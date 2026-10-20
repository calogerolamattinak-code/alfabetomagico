import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Volume2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { LetterItem, LanguageCode, StrokeSegment } from '../../types/alphabet';
import { soundService } from '../../services/sound';
import { ALPHABETS } from '../../data/alphabets';
import { triggerConfetti } from '../../utils/confetti';

interface TracingScreenProps {
  language: LanguageCode;
  initialLetter?: LetterItem;
  onBack: () => void;
  onCompleted: (letterId: string) => void;
}

/**
 * Applies Chaikin's corner-cutting algorithm to convert any rough polyline
 * into a fluid, naturally rounded, and non-segmented curve.
 */
function smoothPolyline(points: { x: number; y: number }[], iterations = 2): { x: number; y: number }[] {
  if (points.length <= 2) return points;
  let current = points;

  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: { x: number; y: number }[] = [current[0]];
    for (let i = 0; i < current.length - 1; i++) {
      const p0 = current[i];
      const p1 = current[i + 1];
      const q = { x: 0.75 * p0.x + 0.25 * p1.x, y: 0.75 * p0.y + 0.25 * p1.y };
      const r = { x: 0.25 * p0.x + 0.75 * p1.x, y: 0.25 * p0.y + 0.75 * p1.y };
      smoothed.push(q, r);
    }
    smoothed.push(current[current.length - 1]);
    current = smoothed;
  }

  return current;
}

/**
 * Draws a fluid, continuous curve using quadratic Bézier midpoint interpolation.
 * Completely eliminates segmented, polygonal, or jagged line artifacts.
 */
function drawSmoothPath(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  if (points.length < 2) return;
  if (points.length === 2) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

export const TracingScreen: React.FC<TracingScreenProps> = ({
  language,
  initialLetter,
  onBack,
  onCompleted,
}) => {
  const letters = ALPHABETS[language] || ALPHABETS.it;
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialLetter) {
      const idx = letters.findIndex((l) => l.id === initialLetter.id);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [isUppercase, setIsUppercase] = useState(true);
  const letter = letters[currentIndex] || letters[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [drawnStrokes, setDrawnStrokes] = useState<{ x: number; y: number }[][]>([]);
  const [activePoints, setActivePoints] = useState<{ x: number; y: number }[]>([]);
  const [isCompletedWaiting, setIsCompletedWaiting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const segments: StrokeSegment[] = isUppercase
    ? letter.uppercaseStrokes
    : letter.lowercaseStrokes;

  // Speak letter on entry or change
  useEffect(() => {
    soundService.speakLetter(
      isUppercase ? letter.letter : letter.lowercase,
      letter.word,
      language
    );
    resetTracing();
  }, [currentIndex, isUppercase, language]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
    };
  }, []);

  const resetTracing = () => {
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
      celebrationTimeoutRef.current = null;
    }
    setIsCompletedWaiting(false);
    setCurrentSegmentIdx(0);
    setDrawnStrokes([]);
    setActivePoints([]);
    setShowCelebration(false);
    redrawCanvas();
  };

  // Convert normalized point (0..1) to canvas pixels
  const toCanvasCoords = (pt: { x: number; y: number }, w: number, h: number) => {
    return {
      x: pt.x * w,
      y: pt.y * h,
    };
  };

  // Densely interpolate waypoints along a stroke segment with smooth curvature
  const getWaypoints = useCallback((points: { x: number; y: number }[], w: number, h: number) => {
    if (points.length < 2) return points.map((p) => ({ x: p.x * w, y: p.y * h }));
    const rawCanvasPts = points.map((p) => ({ x: p.x * w, y: p.y * h }));
    const smoothed = smoothPolyline(rawCanvasPts, 2);

    const waypoints: { x: number; y: number }[] = [];
    for (let i = 0; i < smoothed.length - 1; i++) {
      const p1 = smoothed[i];
      const p2 = smoothed[i + 1];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const steps = Math.max(2, Math.ceil(dist / 8)); // sample every ~8px for high smoothness
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        waypoints.push({
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t,
        });
      }
    }
    waypoints.push(smoothed[smoothed.length - 1]);
    return waypoints;
  }, []);

  // Redraw canvas content with fluid curved strokes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 0. Soft watermark of the actual font glyph so the child sees the full letter shape
    ctx.font = `bold ${Math.min(w, h) * 0.72}px Fredoka, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(isUppercase ? letter.letter : letter.lowercase, w * 0.5, h * 0.54);

    // 1. Draw Letter Outline Ghost / Track (Rounded, continuous stroke)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.min(w, h) * 0.16; // Chunky, generous stroke track
    ctx.strokeStyle = '#E2E8F0'; // Soft ghost gray

    segments.forEach((seg) => {
      if (seg.points.length < 2) return;
      const canvasPts = seg.points.map((p) => toCanvasCoords(p, w, h));
      drawSmoothPath(ctx, canvasPts);
    });

    // 1b. Draw subtle dashed center guidance line inside track
    ctx.lineWidth = 3.5;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#94A3B8';
    segments.forEach((seg) => {
      if (seg.points.length < 2) return;
      const canvasPts = seg.points.map((p) => toCanvasCoords(p, w, h));
      drawSmoothPath(ctx, canvasPts);
    });
    ctx.setLineDash([]); // Reset dashed line

    // 2. Draw Already Completed Strokes (in fluid, silky emerald green)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = Math.min(w, h) * 0.15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    drawnStrokes.forEach((stroke) => {
      if (stroke.length < 2) return;
      drawSmoothPath(ctx, stroke);
    });

    // 3. Draw Currently Active Drawing Stroke (in bright playful cyan/blue)
    if (activePoints.length >= 2) {
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = Math.min(w, h) * 0.15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const smoothedActive = smoothPolyline(activePoints, 1);
      drawSmoothPath(ctx, smoothedActive);
    }

    // 4. Draw Guide Points and Numbered Badges ONLY for current target segment
    const currentSeg = segments[currentSegmentIdx];
    if (currentSeg && currentSeg.points.length >= 2) {
      const startPt = toCanvasCoords(currentSeg.points[0], w, h);
      const endPt = toCanvasCoords(currentSeg.points[currentSeg.points.length - 1], w, h);
      const midIdx = Math.floor(currentSeg.points.length / 2);
      const midPt = toCanvasCoords(currentSeg.points[midIdx], w, h);

      // Start Badge with glowing animated pulse
      const startRadius = 22;
      ctx.beginPath();
      ctx.arc(startPt.x, startPt.y, startRadius + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.fill();

      // Start circle badge
      ctx.beginPath();
      ctx.arc(startPt.x, startPt.y, startRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Stroke number in center
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${startRadius + 1}px Fredoka, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentSeg.order.toString(), startPt.x, startPt.y);

      // Finish Star Indicator at the end of current stroke
      const endRadius = 14;
      ctx.beginPath();
      ctx.arc(endPt.x, endPt.y, endRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', endPt.x, endPt.y);

      // Subtle directional hint at midpoint
      if (currentSeg.points.length >= 3) {
        ctx.beginPath();
        ctx.arc(midPt.x, midPt.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#CBD5E1';
        ctx.fill();
      }
    }
  }, [segments, currentSegmentIdx, drawnStrokes, activePoints, isUppercase, letter]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Touch & Pointer Coordinates
  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (showCelebration || isCompletedWaiting || currentSegmentIdx >= segments.length) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pos = getCoords(e);
    setIsDrawing(true);
    setActivePoints([pos]);
    soundService.playPop();
  };

  const checkCompletion = (
    pts: { x: number; y: number }[],
    waypoints: { x: number; y: number }[],
    tolerance: number
  ) => {
    let minHitIdx = -1;
    let maxHitIdx = -1;
    let hitCount = 0;

    waypoints.forEach((wp, idx) => {
      const isHit = pts.some((p) => {
        const dx = p.x - wp.x;
        const dy = p.y - wp.y;
        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
      });

      if (isHit) {
        hitCount++;
        if (minHitIdx === -1) minHitIdx = idx;
        maxHitIdx = idx;
      }
    });

    const startedNearBeginning = minHitIdx !== -1 && minHitIdx <= Math.ceil(waypoints.length * 0.35);
    const reachedNearEnd = maxHitIdx >= Math.floor(waypoints.length * 0.65);
    const coveredSufficientDistance = hitCount >= Math.ceil(waypoints.length * 0.6);

    return (startedNearBeginning && reachedNearEnd) || coveredSufficientDistance;
  };

  const completeCurrentStroke = (canvasW: number, canvasH: number) => {
    const currentSeg = segments[currentSegmentIdx];
    if (!currentSeg) return;

    soundService.playSuccess();
    // Use smoothed, perfected trajectory so the final stroke is never segmented
    const perfectedStroke = getWaypoints(currentSeg.points, canvasW, canvasH);
    const updatedStrokes = [...drawnStrokes, perfectedStroke];
    setDrawnStrokes(updatedStrokes);
    setActivePoints([]);
    setIsDrawing(false);

    if (currentSegmentIdx + 1 < segments.length) {
      setCurrentSegmentIdx(currentSegmentIdx + 1);
    } else {
      // Mark all segments completed so helper numbers/badges disappear cleanly
      setCurrentSegmentIdx(segments.length);
      setIsCompletedWaiting(true);
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
      // Wait 2 seconds so the child can admire their complete letter before celebration appears
      celebrationTimeoutRef.current = setTimeout(() => {
        handleLetterCompleted();
        celebrationTimeoutRef.current = null;
      }, 2000);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || showCelebration || isCompletedWaiting || currentSegmentIdx >= segments.length) return;
    const pos = getCoords(e);

    // Filter micro-movements to avoid noise
    const lastPos = activePoints[activePoints.length - 1];
    if (lastPos && Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) < 3) {
      return;
    }

    const newPoints = [...activePoints, pos];
    setActivePoints(newPoints);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const currentSeg = segments[currentSegmentIdx];
    if (!currentSeg) return;

    // Generous kid-friendly tolerance radius (~55 pixels on 480px canvas)
    const tolerance = Math.min(w, h) * 0.13;
    const waypoints = getWaypoints(currentSeg.points, w, h);
    if (waypoints.length === 0) return;

    if (checkCompletion(newPoints, waypoints, tolerance)) {
      completeCurrentStroke(w, h);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const canvas = canvasRef.current;
    if (isDrawing && canvas && currentSegmentIdx < segments.length) {
      const currentSeg = segments[currentSegmentIdx];
      const tolerance = Math.min(canvas.width, canvas.height) * 0.14;
      const waypoints = getWaypoints(currentSeg.points, canvas.width, canvas.height);

      if (checkCompletion(activePoints, waypoints, tolerance)) {
        completeCurrentStroke(canvas.width, canvas.height);
        return;
      }
    }

    // If stroke was not completed, reset active points to avoid leaving jagged broken scraps
    if (isDrawing) {
      if (activePoints.length > 5) {
        soundService.playGentleEncouragement();
      }
      setActivePoints([]);
      setIsDrawing(false);
    }
  };

  const handleLetterCompleted = () => {
    setIsCompletedWaiting(false);
    setShowCelebration(true);
    soundService.playStarReward();
    soundService.speak(
      `Bravissimo! Hai scritto la lettera ${isUppercase ? letter.letter : letter.lowercase}!`,
      language
    );

    // Confetti celebration
    try {
      triggerConfetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored
    }

    onCompleted(letter.id);
  };

  const nextLetter = () => {
    if (currentIndex < letters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(letters.length - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-4xl mx-auto w-full select-none overflow-hidden justify-between">
      {/* Top bar: Back, Letter Selector and Reset */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            soundService.playPop();
            onBack();
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold flex items-center justify-center shadow-md border-b-4 border-amber-600 active:scale-95 transition"
          title="Indietro"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        {/* Previous & Next Letter Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundService.playPop();
              prevLetter();
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow border-2 border-slate-200 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-md border-3 border-amber-300">
            <span
              style={{ color: letter.color }}
              className="text-3xl sm:text-4xl font-black font-mono"
            >
              {isUppercase ? letter.letter : letter.lowercase}
            </span>
            <span className="text-2xl sm:text-3xl">{letter.emoji}</span>
          </div>

          <button
            onClick={() => {
              soundService.playPop();
              nextLetter();
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow border-2 border-slate-200 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Upper/Lower switch + Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundService.playPop();
              setIsUppercase(!isUppercase);
            }}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-sm sm:text-base shadow border-b-4 border-indigo-700 active:scale-95 transition"
          >
            {isUppercase ? 'A → a' : 'a → A'}
          </button>

          <button
            onClick={() => {
              soundService.playPop();
              resetTracing();
            }}
            className="w-12 h-12 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center shadow border-2 border-red-300 active:scale-95 transition"
            title="Ricomincia il ricalco"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tracing Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-2">
        <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex items-center justify-center touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={480}
            className="w-full h-full cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />

          {/* Gentle Kid Instructions Banner */}
          <div className="absolute top-3 inset-x-3 pointer-events-none flex justify-between items-center bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-amber-200 shadow-sm">
            {isCompletedWaiting ? (
              <>
                <span className="text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5 truncate mr-2 animate-pulse">
                  <span>✨</span>
                  <span>Guarda che bella la tua lettera!</span>
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0 animate-bounce">
                  Completata! ⭐
                </span>
              </>
            ) : (
              <>
                <span className="text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5 truncate mr-2">
                  <span>👉</span>
                  <span>{segments[currentSegmentIdx]?.directionHint || 'Segui la guida morbida'}</span>
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                  Tratto {Math.min(currentSegmentIdx + 1, segments.length)} di {segments.length}
                </span>
              </>
            )}
          </div>

          {/* Success Celebration Popup */}
          {showCelebration && (
            <div className="absolute inset-0 bg-amber-500/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center animate-zoomIn z-20">
              <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
                🌟 ⭐ 🌟
              </div>
              <h3 className="text-3xl sm:text-4xl font-black mb-2 text-yellow-200">
                BRAVISSIMO!
              </h3>
              <p className="text-base sm:text-lg font-bold mb-6 max-w-xs">
                Hai scritto la lettera{' '}
                <span className="text-2xl text-yellow-100 underline">
                  {isUppercase ? letter.letter : letter.lowercase}
                </span>{' '}
                come {letter.word} {letter.emoji}!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={resetTracing}
                  className="px-5 py-3 rounded-2xl bg-white text-amber-900 font-extrabold text-sm sm:text-base shadow-lg border-b-4 border-slate-300 active:scale-95 transition"
                >
                  Riprova ✍️
                </button>
                <button
                  onClick={() => {
                    soundService.playPop();
                    nextLetter();
                  }}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base shadow-lg border-b-4 border-emerald-700 active:scale-95 transition flex items-center gap-2"
                >
                  <span>Avanti</span>
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Audio Helper Bar */}
      <div className="mt-2 bg-white/95 rounded-2xl p-3 shadow-md border-2 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{letter.emoji}</span>
          <span className="font-extrabold text-base sm:text-lg text-slate-800">
            {letter.word}
          </span>
        </div>

        <button
          onClick={() => {
            soundService.playPop();
            soundService.speakLetter(
              isUppercase ? letter.letter : letter.lowercase,
              letter.word,
              language
            );
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition active:scale-95"
        >
          <Volume2 className="w-5 h-5" />
          <span>Ascolta Voce</span>
        </button>
      </div>
    </div>
  );
};
