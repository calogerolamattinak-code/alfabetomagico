import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Paintbrush,
  Eraser,
  PaintBucket,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Upload,
  Grid,
  Palette,
  Printer,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { COLORING_PAGES } from '../../data/alphabets';
import { soundService } from '../../services/sound';
import { storageService } from '../../services/storage';
import { drawColoringTemplate } from '../../utils/coloringTemplates';
import { triggerConfetti } from '../../utils/confetti';
import { LanguageCode, ColoringPage } from '../../types/alphabet';

interface ColoringScreenProps {
  language: LanguageCode;
  onBack: () => void;
  onSaveDrawing: () => void;
}

const PALETTE = [
  '#EF4444', // Rosso
  '#F97316', // Arancione
  '#F59E0B', // Ambra
  '#EAB308', // Giallo
  '#84CC16', // Lime
  '#10B981', // Smeraldo
  '#06B6D4', // Ciano
  '#3B82F6', // Blu
  '#8B5CF6', // Viola
  '#EC4899', // Rosa
  '#78716C', // Marrone
  '#1E293B', // Grigio scuro
];

/**
 * Computes an exact binary region mask starting from (startX, startY),
 * stopping at dark outline border pixels (< 120 brightness).
 */
function computeRegionMask(
  outlineCanvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  w: number,
  h: number
): ImageData {
  const octx = outlineCanvas.getContext('2d', { willReadFrequently: true });
  if (!octx) return new ImageData(w, h);
  const imgData = octx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const maskData = new ImageData(w, h);
  const maskPixels = maskData.data;

  let sx = Math.floor(Math.max(0, Math.min(w - 1, startX)));
  let sy = Math.floor(Math.max(0, Math.min(h - 1, startY)));

  // Border detection: dark pixel (r, g, b < 120 and alpha > 100)
  const isBorder = (x: number, y: number) => {
    const idx = (y * w + x) * 4;
    return data[idx] < 120 && data[idx + 1] < 120 && data[idx + 2] < 120 && data[idx + 3] > 100;
  };

  // If clicked directly on a border line, find closest non-border pixel within 8px
  if (isBorder(sx, sy)) {
    let found = false;
    for (let r = 1; r <= 8 && !found; r++) {
      for (let dy = -r; dy <= r && !found; dy++) {
        for (let dx = -r; dx <= r && !found; dx++) {
          const nx = sx + dx;
          const ny = sy + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h && !isBorder(nx, ny)) {
            sx = nx;
            sy = ny;
            found = true;
          }
        }
      }
    }
    if (!found) return maskData;
  }

  // Fast queue-based flood fill
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const startIdx = sy * w + sx;
  queue[tail++] = startIdx;
  visited[startIdx] = 1;

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const mIdx = curr * 4;
    maskPixels[mIdx] = 255;
    maskPixels[mIdx + 1] = 255;
    maskPixels[mIdx + 2] = 255;
    maskPixels[mIdx + 3] = 255;

    // Check 4 adjacent neighbors
    if (cx > 0) {
      const left = curr - 1;
      if (!visited[left]) {
        visited[left] = 1;
        if (!isBorder(cx - 1, cy)) queue[tail++] = left;
      }
    }
    if (cx < w - 1) {
      const right = curr + 1;
      if (!visited[right]) {
        visited[right] = 1;
        if (!isBorder(cx + 1, cy)) queue[tail++] = right;
      }
    }
    if (cy > 0) {
      const top = curr - w;
      if (!visited[top]) {
        visited[top] = 1;
        if (!isBorder(cx, cy - 1)) queue[tail++] = top;
      }
    }
    if (cy < h - 1) {
      const bottom = curr + w;
      if (!visited[bottom]) {
        visited[bottom] = 1;
        if (!isBorder(cx, cy + 1)) queue[tail++] = bottom;
      }
    }
  }

  return maskData;
}

export const ColoringScreen: React.FC<ColoringScreenProps> = ({
  language,
  onBack,
  onSaveDrawing,
}) => {
  const [viewMode, setViewMode] = useState<'canvas' | 'gallery'>('canvas');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const activePage = COLORING_PAGES[selectedPageIndex];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outlineOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialStrokeDataRef = useRef<ImageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0]);
  const [brushSize, setBrushSize] = useState<number>(24);
  const [toolMode, setToolMode] = useState<'brush' | 'bucket' | 'eraser'>('brush');
  const [smartAssist, setSmartAssist] = useState<boolean>(true); // Smart fill assistant: stay inside lines
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Initialize canvas when plate changes or when entering canvas mode
  useEffect(() => {
    if (viewMode === 'canvas') {
      initCanvas();
      // Announce letter and matching figure in child's language
      soundService.speakLetter(activePage.letter, activePage.title.split(' ')[0], language);
    }
  }, [selectedPageIndex, viewMode, language]);

  const drawPlateOutline = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    options?: { transparentFill?: boolean },
    onDone?: () => void
  ) => {
    const customSvg = storageService.getCustomSvgPlate(activePage.letter);
    if (customSvg) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, w * 0.05, h * 0.05, w * 0.9, h * 0.9);
        if (onDone) onDone();
      };
      img.onerror = () => {
        drawColoringTemplate(ctx, activePage.svgPath, activePage.letter, w, h, options);
        if (onDone) onDone();
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(customSvg);
    } else {
      drawColoringTemplate(ctx, activePage.svgPath, activePage.letter, w, h, options);
      if (onDone) onDone();
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const overlay = outlineOverlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 1. Prepare base drawing canvas with a clean white sheet
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state for undo
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);

    // 2. Prepare transparent outline overlay canvas on top (crisp dark outlines with transparent interior)
    if (overlay) {
      const octx = overlay.getContext('2d', { willReadFrequently: true });
      if (octx) {
        octx.clearRect(0, 0, overlay.width, overlay.height);
        drawPlateOutline(octx, overlay.width, overlay.height, { transparentFill: true });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loaded = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (!content) return;

        const match = file.name.match(/(?:lettera_|^)?([A-Za-z])/i);
        const letter = match ? match[1].toUpperCase() : activePage.letter;

        storageService.setCustomSvgPlate(letter, content);
        loaded++;

        if (letter === activePage.letter && viewMode === 'canvas') {
          initCanvas();
        }

        if (loaded === files.length) {
          soundService.playSuccess();
          triggerConfetti({ particleCount: 30, spread: 60 });
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    let loaded = 0;
    Array.from(files).forEach((file) => {
      if (!file.name.endsWith('.svg')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (!content) return;

        const match = file.name.match(/(?:lettera_|^)?([A-Za-z])/i);
        const letter = match ? match[1].toUpperCase() : activePage.letter;

        storageService.setCustomSvgPlate(letter, content);
        loaded++;

        if (letter === activePage.letter && viewMode === 'canvas') {
          initCanvas();
        }

        if (loaded === files.length) {
          soundService.playSuccess();
          triggerConfetti({ particleCount: 30, spread: 60 });
        }
      };
      reader.readAsText(file);
    });
  };

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
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

  const renderSmartStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !initialStrokeDataRef.current || !strokeCanvasRef.current || !maskCanvasRef.current) return;

    if (!compCanvasRef.current) {
      compCanvasRef.current = document.createElement('canvas');
      compCanvasRef.current.width = canvas.width;
      compCanvasRef.current.height = canvas.height;
    }
    const cctx = compCanvasRef.current.getContext('2d');
    if (!cctx) return;

    // 1. Draw raw stroke onto composite canvas
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.drawImage(strokeCanvasRef.current, 0, 0);

    // 2. Crop strictly to the region mask
    cctx.globalCompositeOperation = 'destination-in';
    cctx.drawImage(maskCanvasRef.current, 0, 0);
    cctx.globalCompositeOperation = 'source-over';

    // 3. Restore pre-stroke canvas and blit masked stroke
    ctx.putImageData(initialStrokeDataRef.current, 0, 0);
    ctx.drawImage(compCanvasRef.current, 0, 0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pos = getCanvasPos(e);

    // Save initial state for this stroke
    initialStrokeDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // If smart assist is ON, calculate the bounded region mask from outlineOverlay
    const outlineSource = outlineOverlayRef.current || canvas;
    if (smartAssist && outlineSource) {
      const maskData = computeRegionMask(
        outlineSource,
        pos.x,
        pos.y,
        canvas.width,
        canvas.height
      );

      if (!maskCanvasRef.current) {
        maskCanvasRef.current = document.createElement('canvas');
        maskCanvasRef.current.width = canvas.width;
        maskCanvasRef.current.height = canvas.height;
      }
      const mctx = maskCanvasRef.current.getContext('2d');
      if (mctx) {
        mctx.putImageData(maskData, 0, 0);
      }
    }

    if (toolMode === 'bucket') {
      soundService.playPop();

      if (smartAssist && maskCanvasRef.current) {
        // Smart Bucket: Instant clean fill within the tapped border region
        if (!compCanvasRef.current) {
          compCanvasRef.current = document.createElement('canvas');
          compCanvasRef.current.width = canvas.width;
          compCanvasRef.current.height = canvas.height;
        }
        const cctx = compCanvasRef.current.getContext('2d');
        if (cctx) {
          cctx.clearRect(0, 0, canvas.width, canvas.height);
          cctx.fillStyle = selectedColor;
          cctx.fillRect(0, 0, canvas.width, canvas.height);
          cctx.globalCompositeOperation = 'destination-in';
          cctx.drawImage(maskCanvasRef.current, 0, 0);
          cctx.globalCompositeOperation = 'source-over';

          ctx.drawImage(compCanvasRef.current, 0, 0);
          saveState();
        }
      } else {
        // Freehand splash bucket
        ctx.fillStyle = selectedColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 48, 0, Math.PI * 2);
        ctx.fill();
        saveState();
      }
      return;
    }

    // Brush or Eraser
    setIsDrawing(true);
    soundService.playPop();

    if (smartAssist) {
      if (!strokeCanvasRef.current) {
        strokeCanvasRef.current = document.createElement('canvas');
        strokeCanvasRef.current.width = canvas.width;
        strokeCanvasRef.current.height = canvas.height;
      }
      const sctx = strokeCanvasRef.current.getContext('2d');
      if (sctx) {
        sctx.clearRect(0, 0, canvas.width, canvas.height);
        sctx.beginPath();
        sctx.moveTo(pos.x, pos.y);
        sctx.lineCap = 'round';
        sctx.lineJoin = 'round';
        sctx.strokeStyle = toolMode === 'eraser' ? '#FFFFFF' : selectedColor;
        sctx.lineWidth = toolMode === 'eraser' ? 36 : brushSize;
        sctx.lineTo(pos.x + 0.1, pos.y + 0.1);
        sctx.stroke();

        renderSmartStroke();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = toolMode === 'eraser' ? '#FFFFFF' : selectedColor;
      ctx.lineWidth = toolMode === 'eraser' ? 36 : brushSize;
      ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pos = getCanvasPos(e);

    if (smartAssist) {
      const sctx = strokeCanvasRef.current?.getContext('2d');
      if (sctx) {
        sctx.lineTo(pos.x, pos.y);
        sctx.stroke();
        renderSmartStroke();
      }
    } else {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), data]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    soundService.playPop();
    const newHist = [...history];
    newHist.pop();
    const prev = newHist[newHist.length - 1];
    setHistory(newHist);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx && prev) {
      ctx.putImageData(prev, 0, 0);
    }
  };

  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    const overlay = outlineOverlayRef.current;
    if (!canvas) return;
    soundService.playSuccess();
    triggerConfetti({ particleCount: 60, spread: 70 });

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext('2d');
    if (octx) {
      // 1. Draw painted colors with background
      octx.drawImage(canvas, 0, 0);
      // 2. Draw crisp outlines on top
      if (overlay) {
        octx.drawImage(overlay, 0, 0);
      }
      const dataUrl = offscreen.toDataURL('image/png');
      storageService.saveDrawing(dataUrl, `${activePage.letter} - ${activePage.title}`);
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      storageService.saveDrawing(dataUrl, `${activePage.letter} - ${activePage.title}`);
    }
    onSaveDrawing();
  };

  // Download blank coloring outline sheet to print on paper
  const handleDownloadBlankSheet = (page: ColoringPage = activePage) => {
    soundService.playPop();
    const offscreen = document.createElement('canvas');
    offscreen.width = 1000;
    offscreen.height = 1000;
    const octx = offscreen.getContext('2d');
    if (!octx) return;

    // White paper background
    octx.fillStyle = '#FFFFFF';
    octx.fillRect(0, 0, 1000, 1000);

    // Draw the template (includes card frame, uppercase and lowercase letters, figure, and caption)
    drawColoringTemplate(octx, page.svgPath, page.letter, 1000, 1000);

    const link = document.createElement('a');
    link.download = `Colora_Lettera_${page.letter}_${page.svgPath}.png`;
    link.href = offscreen.toDataURL('image/png');
    link.click();
    soundService.playStarReward();
  };

  const nextPlate = () => {
    soundService.playPop();
    if (selectedPageIndex < COLORING_PAGES.length - 1) {
      setSelectedPageIndex(selectedPageIndex + 1);
    } else {
      setSelectedPageIndex(0);
    }
  };

  const prevPlate = () => {
    soundService.playPop();
    if (selectedPageIndex > 0) {
      setSelectedPageIndex(selectedPageIndex - 1);
    } else {
      setSelectedPageIndex(COLORING_PAGES.length - 1);
    }
  };

  const selectDrawingFromGallery = (idx: number) => {
    soundService.playPop();
    setSelectedPageIndex(idx);
    setViewMode('canvas');
  };

  return (
    <div className="flex-1 flex flex-col p-2 sm:p-4 max-w-5xl mx-auto w-full select-none overflow-hidden justify-between">
      {/* Hidden file input for SVG upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".svg"
        className="hidden"
      />

      {/* Top Header: Back, View Toggle, Navigator, Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
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

          {/* Toggle between Drawing Canvas and Gallery View */}
          <button
            onClick={() => {
              soundService.playPop();
              setViewMode(viewMode === 'canvas' ? 'gallery' : 'canvas');
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow border-2 transition active:scale-95 ${
              viewMode === 'gallery'
                ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300'
                : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
            }`}
          >
            {viewMode === 'canvas' ? (
              <>
                <Grid className="w-5 h-5 text-rose-500" />
                <span>Tutti i 26 Disegni</span>
              </>
            ) : (
              <>
                <Palette className="w-5 h-5 text-white" />
                <span>Torna a Colorare</span>
              </>
            )}
          </button>
        </div>

        {/* Center: In canvas mode, show letter navigator */}
        {viewMode === 'canvas' && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={prevPlate}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow border-2 border-slate-200 active:scale-90"
              title="Precedente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              onClick={() => soundService.speakLetter(activePage.letter, activePage.title.split(' ')[0], language)}
              className="cursor-pointer flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 rounded-2xl shadow border-2 border-rose-300 hover:bg-rose-50 transition active:scale-95"
              title="Tocca per riascoltare"
            >
              <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
                {activePage.letter}
              </span>
              <span className="text-2xl sm:text-3xl">{activePage.previewEmoji}</span>
              <div className="text-left hidden md:block">
                <span className="font-extrabold text-sm text-slate-800 block leading-tight">
                  {activePage.title}
                </span>
              </div>
              <Volume2 className="w-4 h-4 text-rose-500 ml-1" />
            </div>

            <button
              onClick={nextPlate}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow border-2 border-slate-200 active:scale-90"
              title="Successivo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Actions in Canvas Mode: Print/Download blank sheet, Upload SVG, Undo & Save */}
        {viewMode === 'canvas' ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleDownloadBlankSheet(activePage)}
              className="p-2 sm:px-3 sm:py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              title="Stampa / Scarica foglio da colorare su carta"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">Stampa Foglio</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 sm:px-3 sm:py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              title="Carica file SVG personalizzati per le lettere"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden lg:inline">Carica SVG</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 flex items-center justify-center shadow border-2 border-slate-300 active:scale-95 transition"
              title="Annulla ultimo tratto"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleSaveToGallery}
              className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow border-b-4 border-emerald-700 active:scale-95 transition"
              title="Salva Disegno nell'Album"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Salva</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Importa Disegni SVG</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: FULL 26 DRAWINGS GALLERY (A to Z) */}
      {viewMode === 'gallery' ? (
        <div className="flex-1 overflow-y-auto px-1 py-2">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
              <span>🎨</span> I 26 Disegni dell'Alfabeto dalla A alla Z <span>✨</span>
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              Tocca un disegno per iniziare a colorarlo o ascolta il suono della lettera!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-6">
            {COLORING_PAGES.map((pg, index) => {
              const isSelected = selectedPageIndex === index;
              return (
                <div
                  key={pg.id}
                  className={`bg-white rounded-3xl p-3 shadow-md border-3 transition-all flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 ${
                    isSelected ? 'border-rose-500 ring-4 ring-rose-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-10 h-10 rounded-2xl bg-rose-500 text-white font-black text-xl flex items-center justify-center shadow font-mono">
                      {pg.letter}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.speakLetter(pg.letter, pg.title.split(' ')[0], language);
                      }}
                      className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition active:scale-90"
                      title="Ascolta pronuncia"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Big Figure Emoji & Word */}
                  <div
                    onClick={() => selectDrawingFromGallery(index)}
                    className="cursor-pointer my-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/60 transition"
                  >
                    <span className="text-5xl sm:text-6xl mb-1 filter drop-shadow group-hover:scale-110 transition-transform">
                      {pg.previewEmoji}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm text-center leading-tight">
                      {pg.title}
                    </span>
                    <span className="text-[11px] font-bold text-rose-500 bg-rose-100/70 px-2 py-0.5 rounded-full mt-1.5">
                      {pg.category}
                    </span>
                  </div>

                  {/* Action buttons: Color & Blank print */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => selectDrawingFromGallery(index)}
                      className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Colora</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadBlankSheet(pg);
                      }}
                      className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center active:scale-90 transition shrink-0"
                      title="Scarica foglio bianco per colorare su carta"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: INTERACTIVE COLORING CANVAS */
        <>
          {/* 26-Letter Carousel for Direct Access (A to Z) */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 px-1 bg-white/80 rounded-2xl border border-rose-200 mb-1 scrollbar-none">
            {COLORING_PAGES.map((pg, idx) => (
              <button
                key={pg.id}
                onClick={() => {
                  soundService.playPop();
                  setSelectedPageIndex(idx);
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center transition active:scale-90 ${
                  selectedPageIndex === idx
                    ? 'bg-rose-500 text-white shadow-md scale-105 ring-2 ring-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-100'
                }`}
              >
                <span className="leading-none">{pg.letter}</span>
                <span className="text-[10px] leading-none">{pg.previewEmoji}</span>
              </button>
            ))}
          </div>

          {/* Main Drawing Canvas Area with Drag & Drop */}
          <div
            className="relative flex-1 flex items-center justify-center p-1"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div
              className={`relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-xl border-4 overflow-hidden flex items-center justify-center touch-none transition-all ${
                isDragOver ? 'border-indigo-500 ring-8 ring-indigo-200 scale-102' : 'border-rose-300'
              }`}
            >
              {/* Badge indicating smart border assistant is active */}
              {smartAssist && (
                <div className="absolute top-2.5 left-2.5 z-20 bg-amber-400/95 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow border border-amber-500/30 flex items-center gap-1.5 pointer-events-none select-none backdrop-blur-xs animate-fade-in">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-900" />
                  <span>Colori nei bordi attivo</span>
                </div>
              )}

              {/* Bottom Layer: Color Canvas (receives pointer events for brush, bucket, eraser) */}
              <canvas
                ref={canvasRef}
                width={480}
                height={480}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-[1]"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />

              {/* Top Layer: Outline Canvas (crisp dark contours with transparent interior, clicks pass through) */}
              <canvas
                ref={outlineOverlayRef}
                width={480}
                height={480}
                className="absolute inset-0 w-full h-full pointer-events-none z-[10]"
              />

              {isDragOver && (
                <div className="absolute inset-0 bg-indigo-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-indigo-900 font-extrabold text-lg pointer-events-none z-[30]">
                  <Upload className="w-12 h-12 mb-2 animate-bounce" />
                  <span>Rilascia qui i file SVG!</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Tools & Big Color Palette Bar */}
          <div className="mt-1 bg-white/95 rounded-3xl p-2.5 sm:p-3 shadow-lg border-2 border-rose-200 flex flex-col gap-2">
            {/* Tools row: Brush, Bucket, Eraser, Smart Assist, Brush Sizes */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    soundService.playPop();
                    setToolMode('brush');
                  }}
                  className={`p-2 sm:p-2.5 rounded-2xl font-bold flex items-center gap-1.5 text-xs transition ${
                    toolMode === 'brush'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Paintbrush className="w-5 h-5" />
                  <span className="hidden sm:inline">Pennello</span>
                </button>

                <button
                  onClick={() => {
                    soundService.playPop();
                    setToolMode('bucket');
                  }}
                  className={`p-2 sm:p-2.5 rounded-2xl font-bold flex items-center gap-1.5 text-xs transition ${
                    toolMode === 'bucket'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <PaintBucket className="w-5 h-5" />
                  <span className="hidden sm:inline">Secchiello</span>
                </button>

                <button
                  onClick={() => {
                    soundService.playPop();
                    setToolMode('eraser');
                  }}
                  className={`p-2 sm:p-2.5 rounded-2xl font-bold flex items-center gap-1.5 text-xs transition ${
                    toolMode === 'eraser'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span className="hidden sm:inline">Gomma</span>
                </button>

                {/* SMART FILL ASSISTANT (Stay Inside the Lines) TOGGLE */}
                <button
                  onClick={() => {
                    soundService.playPop();
                    const next = !smartAssist;
                    setSmartAssist(next);
                    if (next) {
                      soundService.playStarReward();
                      soundService.speak('Assistente attivo: non uscirai dai bordi!', language);
                    } else {
                      soundService.speak('Disegno libero!', language);
                    }
                  }}
                  className={`p-2 sm:px-3 sm:py-2.5 rounded-2xl font-extrabold flex items-center gap-1.5 text-xs shadow-sm transition active:scale-95 ${
                    smartAssist
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border-2 border-amber-300 ring-2 ring-amber-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                  }`}
                  title="Attiva/disattiva l'assistente che impedisce di colorare fuori dai bordi"
                >
                  <Sparkles className={`w-4 h-4 ${smartAssist ? 'text-amber-950 fill-amber-300' : 'text-slate-400'}`} />
                  <span className="font-bold">{smartAssist ? 'Bordi Magici: ON' : 'Bordi: OFF'}</span>
                </button>
              </div>

              {/* 3 Brush Sizes */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                {[12, 24, 40].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      soundService.playPop();
                      setBrushSize(size);
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition ${
                      brushSize === size ? 'bg-white shadow-sm ring-2 ring-rose-400' : 'hover:bg-slate-200'
                    }`}
                  >
                    <div
                      className="rounded-full bg-slate-800"
                      style={{ width: `${Math.max(6, size * 0.45)}px`, height: `${Math.max(6, size * 0.45)}px` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Big Touch Color Circles Palette */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
              {PALETTE.map((color) => {
                const isSelected = selectedColor === color && toolMode !== 'eraser';
                return (
                  <button
                    key={color}
                    onClick={() => {
                      soundService.playPop();
                      setSelectedColor(color);
                      if (toolMode === 'eraser') setToolMode('brush');
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 shadow-md transition-transform active:scale-90 ${
                      isSelected ? 'scale-115 ring-4 ring-white shadow-lg' : 'hover:scale-105'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
