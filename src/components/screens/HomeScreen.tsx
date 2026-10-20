import React from 'react';
import { Sparkles, Edit3, Palette, Gamepad2, Award } from 'lucide-react';
import { ActiveScreen, LanguageCode } from '../../types/alphabet';
import { soundService } from '../../services/sound';
import { Mascot } from '../Mascot';

interface HomeScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  language: LanguageCode;
  stars: number;
  onOpenParents?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  language,
  onOpenParents,
}) => {
  const getGreeting = () => {
    switch (language) {
      case 'en':
        return 'Hi! Tap a game to play and learn letters!';
      case 'es':
        return '¡Hola! ¡Toca un juego para aprender las letras!';
      case 'fr':
        return 'Salut ! Touche un jeu pour apprendre l\'alphabet !';
      case 'de':
        return 'Hallo! Tippe auf ein Spiel, um Buchstaben zu lernen!';
      case 'it':
      default:
        return 'Ciao! Benvenuto in Alfabeto Magico! Tocca un gioco per iniziare a giocare!';
    }
  };

  const handleMenuClick = (screen: ActiveScreen, titleVoice: string) => {
    soundService.playPop();
    soundService.speak(titleVoice, language);
    onNavigate(screen);
  };

  const getMenuVoiceText = (key: string) => {
    switch (language) {
      case 'en':
        if (key === 'letters') return 'Learn the Alphabet';
        if (key === 'write') return 'Trace Letters';
        if (key === 'color') return 'Color the ABC';
        if (key === 'games') return 'Fun Educational Games';
        return 'My Sticker Album';
      case 'es':
        if (key === 'letters') return 'Aprende las Letras';
        if (key === 'write') return 'Traza las Letras';
        if (key === 'color') return 'Colorea el Abecedario';
        if (key === 'games') return 'Juegos Divertidos';
        return 'Mi Álbum de Pegatinas';
      case 'fr':
        if (key === 'letters') return 'Apprends les Lettres';
        if (key === 'write') return 'Écris les Lettres';
        if (key === 'color') return 'Colorie l\'Alphabet';
        if (key === 'games') return 'Jeux Amusants';
        return 'Mon Album d\'Autocollants';
      case 'de':
        if (key === 'letters') return 'Buchstaben Lernen';
        if (key === 'write') return 'Buchstaben Nachspuren';
        if (key === 'color') return 'ABC Ausmalen';
        if (key === 'games') return 'Lustige Spiele';
        return 'Mein Sticker-Album';
      case 'it':
      default:
        if (key === 'letters') return 'Impara le Lettere';
        if (key === 'write') return 'Scrivi le Lettere';
        if (key === 'color') return 'Colora l\'ABC';
        if (key === 'games') return 'Giochi Divertenti';
        return 'Il Mio Album di Adesivi';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-6 max-w-4xl mx-auto w-full select-none">
      {/* Friendly Mascot */}
      <div className="w-full">
        <Mascot
          message={getGreeting()}
          language={language}
        />
      </div>

      {/* Chunky, touch-friendly 64dp+ action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 my-auto">
        {/* 1. Impara le lettere */}
        <button
          onClick={() => handleMenuClick('alphabet', getMenuVoiceText('letters'))}
          className="bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-amber-950 p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-white flex items-center gap-4 sm:gap-5 btn-chunky transition group"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition">
            🔤
          </div>
          <div className="text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 tracking-wide">
              {getMenuVoiceText('letters')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-amber-900/80">
              A, B, C... suono e parole
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-amber-800/60 hidden sm:block" />
        </button>

        {/* 2. Scrivi la lettera (Tracing) */}
        <button
          onClick={() => handleMenuClick('tracing', getMenuVoiceText('write'))}
          className="bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-500 active:scale-95 text-emerald-950 p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-white flex items-center gap-4 sm:gap-5 btn-chunky transition group"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition">
            ✍️
          </div>
          <div className="text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950 tracking-wide">
              {getMenuVoiceText('write')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-emerald-900/80">
              Ricalca con il dito i puntini
            </p>
          </div>
          <Edit3 className="w-6 h-6 text-emerald-800/60 hidden sm:block" />
        </button>

        {/* 3. Colora (Coloring Book) */}
        <button
          onClick={() => handleMenuClick('coloring', getMenuVoiceText('color'))}
          className="bg-gradient-to-br from-rose-400 to-pink-500 hover:from-rose-300 hover:to-pink-500 active:scale-95 text-rose-950 p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-white flex items-center gap-4 sm:gap-5 btn-chunky transition group"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition">
            🎨
          </div>
          <div className="text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-rose-950 tracking-wide">
              {getMenuVoiceText('color')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-rose-900/80">
              Tavolozza, pennelli e secchiello
            </p>
          </div>
          <Palette className="w-6 h-6 text-rose-800/60 hidden sm:block" />
        </button>

        {/* 4. Giochi educativi */}
        <button
          onClick={() => handleMenuClick('games-hub', getMenuVoiceText('games'))}
          className="bg-gradient-to-br from-indigo-400 to-blue-500 hover:from-indigo-300 hover:to-blue-500 active:scale-95 text-indigo-950 p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-white flex items-center gap-4 sm:gap-5 btn-chunky transition group"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner group-hover:scale-110 transition">
            🎮
          </div>
          <div className="text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-950 tracking-wide">
              {getMenuVoiceText('games')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-indigo-900/80">
              Abbina, Memory e Caccia
            </p>
          </div>
          <Gamepad2 className="w-6 h-6 text-indigo-800/60 hidden sm:block" />
        </button>
      </div>

      {/* 5. Album Stickers Bottom Button */}
      <div className="mt-4 pt-2 flex flex-col items-center gap-2">
        <button
          onClick={() => handleMenuClick('stickers', getMenuVoiceText('stickers'))}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 active:scale-95 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-3xl shadow-xl border-4 border-white flex items-center gap-3 sm:gap-4 btn-chunky transition"
        >
          <Award className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300" />
          <span className="text-lg sm:text-xl font-extrabold tracking-wide">
            {getMenuVoiceText('stickers')}
          </span>
          <span className="bg-yellow-400 text-purple-950 px-2.5 py-1 rounded-full text-xs font-black">
            Album ⭐
          </span>
        </button>

        {/* Discreet link for Parents & Google Play review */}
        <div className="flex items-center justify-center gap-3 mt-1 text-[11px] text-slate-500">
          {onOpenParents && (
            <button
              onClick={() => {
                soundService.playPop();
                onOpenParents();
              }}
              className="hover:text-purple-700 underline font-medium transition"
            >
              🔒 Area Genitori
            </button>
          )}
          <span>&bull;</span>
          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 underline font-medium transition"
          >
            Norme sulla Privacy
          </a>
        </div>
      </div>
    </div>
  );
};
