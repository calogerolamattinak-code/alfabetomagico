import React from 'react';
import { Home, Volume2, VolumeX, ShieldCheck, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ActiveScreen, LanguageCode } from '../types/alphabet';
import { soundService } from '../services/sound';
import { LANGUAGES } from '../data/alphabets';

interface HeaderProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  stars: number;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onOpenParents: () => void;
  viewMode: 'full' | 'phone' | 'tablet';
  onToggleViewMode: (mode: 'full' | 'phone' | 'tablet') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  stars,
  currentLanguage,
  onSelectLanguage,
  onOpenParents,
  viewMode,
  onToggleViewMode,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundService.getMuted());
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
    if (!next) {
      soundService.playPop();
    }
  };

  const handleLangPick = (lang: LanguageCode) => {
    onSelectLanguage(lang);
    setShowLangMenu(false);
    soundService.playPop();
    soundService.speak(LANGUAGES[lang].name, lang);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 shadow-md flex items-center justify-between border-b-4 border-amber-200 z-30 select-none">
      {/* Left side: Home / Back Button */}
      <div className="flex items-center gap-2">
        {currentScreen !== 'home' ? (
          <button
            onClick={() => {
              soundService.playPop();
              onNavigate('home');
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 flex items-center justify-center font-bold shadow-md border-b-4 border-amber-600 transition btn-chunky"
            title="Torna alla Home"
            aria-label="Home"
          >
            <Home className="w-8 h-8" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">🦁</span>
            <span className="font-extrabold text-xl sm:text-2xl text-amber-900 tracking-wide hidden md:inline">
              Alfabeto Magico
            </span>
          </div>
        )}

        {/* View Mode Simulator Buttons (Phone / Tablet / Full) */}
        <div className="hidden lg:flex items-center bg-amber-100 rounded-xl p-1 gap-1 border border-amber-300">
          <button
            onClick={() => onToggleViewMode('phone')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition ${
              viewMode === 'phone' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800 hover:bg-amber-200'
            }`}
            title="Simulatore Android Phone"
          >
            <Smartphone className="w-4 h-4" /> Phone
          </button>
          <button
            onClick={() => onToggleViewMode('tablet')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition ${
              viewMode === 'tablet' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800 hover:bg-amber-200'
            }`}
            title="Simulatore Android Tablet"
          >
            <Tablet className="w-4 h-4" /> Tablet
          </button>
          <button
            onClick={() => onToggleViewMode('full')}
            className={`px-2 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition ${
              viewMode === 'full' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800 hover:bg-amber-200'
            }`}
            title="Schermo Intero Web"
          >
            <Monitor className="w-4 h-4" /> Full
          </button>
        </div>
      </div>

      {/* Middle: Stars Reward Counter Badge */}
      <button
        onClick={() => {
          soundService.playStarReward();
          onNavigate('stickers');
        }}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg border-2 border-yellow-200 transform hover:scale-105 active:scale-95 transition"
        title="Vedi il tuo album di stelle e adesivi!"
      >
        <span className="text-2xl sm:text-3xl animate-bounce">⭐</span>
        <span className="font-extrabold text-xl sm:text-2xl text-amber-950 font-mono tracking-tight">
          {stars}
        </span>
      </button>

      {/* Right side: Language Selector + Sound Toggle + Parent Gate */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Flag Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              soundService.playPop();
              setShowLangMenu(!showLangMenu);
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-100 hover:bg-sky-200 active:scale-95 flex items-center justify-center text-2xl sm:text-3xl shadow-sm border-2 border-sky-300 transition"
            title="Cambia Lingua"
          >
            {LANGUAGES[currentLanguage]?.flag || '🇮🇹'}
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border-4 border-amber-300 p-2 grid grid-cols-1 gap-2 z-50 w-44">
              {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => {
                const lang = LANGUAGES[code];
                return (
                  <button
                    key={code}
                    onClick={() => handleLangPick(code)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left font-bold transition ${
                      currentLanguage === code ? 'bg-amber-200 text-amber-900' : 'hover:bg-amber-50 text-slate-800'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-sm">{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl active:scale-95 flex items-center justify-center shadow-sm border-2 transition ${
            isMuted
              ? 'bg-red-100 border-red-300 text-red-500'
              : 'bg-emerald-100 border-emerald-300 text-emerald-700'
          }`}
          title={isMuted ? 'Riattiva Audio' : 'Disattiva Audio'}
        >
          {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
        </button>

        {/* Parent Gate Lock Button */}
        <button
          onClick={() => {
            soundService.playPop();
            onOpenParents();
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-100 hover:bg-purple-200 active:scale-95 flex items-center justify-center text-purple-700 shadow-sm border-2 border-purple-300 transition"
          title="Area Genitori (Protetta da Codice)"
        >
          <ShieldCheck className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
};
