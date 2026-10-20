import React from 'react';
import { soundService } from '../services/sound';
import { LanguageCode } from '../types/alphabet';

interface MascotProps {
  message?: string;
  language: LanguageCode;
  onTap?: () => void;
  compact?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  message = 'Ciao! Tocca una lettera per giocare!',
  language,
  onTap,
  compact = false,
}) => {
  const [bouncing, setBouncing] = React.useState(false);

  const handleMascotClick = () => {
    setBouncing(true);
    soundService.playBoing();
    soundService.speak(message, language);
    if (onTap) onTap();
    setTimeout(() => setBouncing(false), 800);
  };

  if (compact) {
    return (
      <button
        onClick={handleMascotClick}
        className={`inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 rounded-full px-3 py-1.5 shadow-sm active:scale-95 transition ${
          bouncing ? 'animate-bounce' : ''
        }`}
      >
        <span className="text-2xl">🦁</span>
        <span className="text-xs font-bold text-amber-900">Leo</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 my-2 px-2 max-w-lg mx-auto">
      <button
        onClick={handleMascotClick}
        className={`relative group active:scale-90 transition transform ${
          bouncing ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title="Tocca Leo per ascoltare!"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-lg border-4 border-white">
          🦁
        </div>
        <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow">
          LEO
        </span>
      </button>

      {message && (
        <div
          onClick={handleMascotClick}
          className="cursor-pointer flex-1 bg-white border-3 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-md relative text-slate-800 hover:bg-amber-50 transition active:scale-98"
        >
          {/* Speech bubble tail */}
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-10 border-r-white border-b-8 border-b-transparent" />
          <p className="text-sm sm:text-base font-bold text-amber-950 leading-snug">
            {message}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-600">
            <span>🔊 Tocca per riascoltare</span>
          </div>
        </div>
      )}
    </div>
  );
};
