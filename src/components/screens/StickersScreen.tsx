import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Image as ImageIcon, Lock, Trophy } from 'lucide-react';
import { STICKERS_DATA } from '../../data/alphabets';
import { soundService } from '../../services/sound';
import { storageService } from '../../services/storage';
import { triggerConfetti } from '../../utils/confetti';

interface StickersScreenProps {
  stars: number;
  unlockedStickerIds: string[];
  onBack: () => void;
  onStickerUnlocked: (id: string) => void;
}

export const StickersScreen: React.FC<StickersScreenProps> = ({
  stars,
  unlockedStickerIds,
  onBack,
  onStickerUnlocked,
}) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'drawings'>('stickers');
  const savedDrawings = storageService.getState().savedDrawings;

  const handleStickerTap = (stk: typeof STICKERS_DATA[0]) => {
    const isUnlocked = unlockedStickerIds.includes(stk.id) || stars >= stk.requiredStars;

    if (isUnlocked) {
      soundService.playBoing();
      soundService.playStarReward();
      triggerConfetti({ particleCount: 40, spread: 50 });
      if (!unlockedStickerIds.includes(stk.id)) {
        onStickerUnlocked(stk.id);
      }
    } else {
      soundService.playGentleEncouragement();
      alert(`Questo adesivo si sblocca con ${stk.requiredStars} stelle! Ne hai ${stars}. Continua a giocare per ottenerlo! ⭐`);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-4xl mx-auto w-full select-none overflow-hidden justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
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

        <div className="flex bg-white rounded-2xl p-1.5 shadow border-2 border-purple-200">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('stickers');
            }}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm flex items-center gap-2 transition ${
              activeTab === 'stickers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Adesivi ({unlockedStickerIds.length}/{STICKERS_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('drawings');
            }}
            className={`px-4 py-2 rounded-xl font-extrabold text-sm flex items-center gap-2 transition ${
              activeTab === 'drawings'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>I Miei Disegni ({savedDrawings.length})</span>
          </button>
        </div>

        {/* Stars summary */}
        <div className="flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-300 px-3.5 py-2 rounded-2xl">
          <span className="text-xl">⭐</span>
          <span className="text-lg font-black text-amber-950 font-mono">{stars}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'stickers' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {STICKERS_DATA.map((stk) => {
              const isUnlocked = unlockedStickerIds.includes(stk.id) || stars >= stk.requiredStars;

              return (
                <button
                  key={stk.id}
                  onClick={() => handleStickerTap(stk)}
                  className={`p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-md border-3 transition-transform active:scale-90 ${
                    isUnlocked
                      ? 'bg-white border-yellow-400 hover:scale-105'
                      : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center text-5xl mb-2 relative">
                    {stk.emoji}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center text-white backdrop-blur-[1px]">
                        <Lock className="w-7 h-7 text-yellow-300" />
                      </div>
                    )}
                  </div>

                  <span className="font-extrabold text-sm text-slate-800 truncate w-full">
                    {stk.name}
                  </span>

                  <span className="text-[11px] font-bold text-amber-700 mt-1">
                    {isUnlocked ? 'Sbloccato! ✨' : `Serve ⭐ ${stk.requiredStars}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'drawings' && (
          <div>
            {savedDrawings.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <span className="text-6xl mb-4 inline-block">🎨</span>
                <p className="font-extrabold text-lg text-slate-700">Non hai ancora salvato disegni!</p>
                <p className="text-sm">Vai su "Colora l'ABC" per dipingere e salvare le tue creazioni.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {savedDrawings.map((draw) => (
                  <div
                    key={draw.id}
                    className="bg-white rounded-3xl p-3 shadow-md border-3 border-rose-200 flex flex-col items-center"
                  >
                    <img
                      src={draw.dataUrl}
                      alt={draw.title}
                      className="w-full aspect-square object-contain rounded-2xl border border-slate-100 bg-white mb-2"
                    />
                    <span className="font-extrabold text-sm text-slate-800">{draw.title}</span>
                    <span className="text-[11px] text-slate-400">{draw.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gentle Motivation */}
      <div className="text-center py-2 text-xs font-bold text-purple-900/70">
        Nessuna fretta o classifica: gioca e colleziona tutti gli adesivi al tuo ritmo! 🌟
      </div>
    </div>
  );
};
