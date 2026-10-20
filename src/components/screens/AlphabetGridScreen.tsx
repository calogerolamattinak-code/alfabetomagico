import React, { useState } from 'react';
import { Volume2, Edit3, ArrowLeft } from 'lucide-react';
import { LetterItem, LanguageCode } from '../../types/alphabet';
import { ALPHABETS } from '../../data/alphabets';
import { soundService } from '../../services/sound';

interface AlphabetGridScreenProps {
  language: LanguageCode;
  onSelectLetterForTracing: (letter: LetterItem) => void;
  onBack: () => void;
  completedLetterIds: string[];
}

export const AlphabetGridScreen: React.FC<AlphabetGridScreenProps> = ({
  language,
  onSelectLetterForTracing,
  onBack,
  completedLetterIds,
}) => {
  const [isUppercase, setIsUppercase] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);

  const letters = ALPHABETS[language] || ALPHABETS.it;

  const handleLetterTap = (letter: LetterItem) => {
    soundService.playPop();
    const displayLetter = isUppercase ? letter.letter : letter.lowercase;
    // Speak letter name and associated word naturally (e.g., "A come Ape!")
    soundService.speakLetter(displayLetter, letter.word, language);
    setSelectedLetter(letter);
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-5xl mx-auto w-full select-none overflow-hidden">
      {/* Top action bar: Back button + Title + Uppercase/Lowercase switch */}
      <div className="flex items-center justify-between mb-4">
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

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-wide">
            Impara l'Alfabeto
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-800/80">
            Tocca per ascoltare la lettera e la parola!
          </p>
        </div>

        {/* Toggle Maiuscolo / Minuscolo */}
        <button
          onClick={() => {
            soundService.playPop();
            setIsUppercase(!isUppercase);
          }}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-lg sm:text-xl shadow-md border-b-4 border-indigo-700 active:scale-95 transition flex items-center gap-1.5"
          title="Cambia Maiuscolo / Minuscolo"
        >
          <span>{isUppercase ? 'A → a' : 'a → A'}</span>
        </button>
      </div>

      {/* Letters Grid */}
      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
          {letters.map((item) => {
            const isCompleted = completedLetterIds.includes(item.id);
            const isSelected = selectedLetter?.id === item.id;
            const displayLetter = isUppercase ? item.letter : item.lowercase;

            return (
              <button
                key={item.id}
                onClick={() => handleLetterTap(item)}
                style={{ borderColor: item.color }}
                className={`relative flex flex-col items-center justify-between p-3 rounded-3xl bg-white shadow-md border-3 transition-transform duration-150 active:scale-90 group hover:-translate-y-1 ${
                  isSelected ? 'ring-4 ring-amber-400 bg-amber-50 scale-105' : ''
                }`}
              >
                {/* Completion star badge */}
                {isCompleted && (
                  <span className="absolute -top-2 -right-2 text-xl filter drop-shadow">
                    ⭐
                  </span>
                )}

                {/* Main letter */}
                <span
                  style={{ color: item.color }}
                  className="font-extrabold text-4xl sm:text-5xl leading-none my-1 font-mono tracking-tight"
                >
                  {displayLetter}
                </span>

                {/* Emoji illustration */}
                <span className="text-3xl sm:text-4xl my-1 group-hover:scale-125 transition-transform">
                  {item.emoji}
                </span>

                {/* Word */}
                <span className="text-xs sm:text-sm font-extrabold text-slate-700 truncate w-full text-center">
                  {item.word}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Card when a letter is tapped */}
      {selectedLetter && (
        <div className="mt-2 bg-white rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-amber-300 flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <span
              style={{ color: selectedLetter.color }}
              className="text-4xl sm:text-5xl font-black font-mono"
            >
              {isUppercase ? selectedLetter.letter : selectedLetter.lowercase}
            </span>
            <span className="text-3xl sm:text-4xl">{selectedLetter.emoji}</span>
            <div>
              <h4 className="font-extrabold text-lg sm:text-xl text-slate-900">
                {selectedLetter.word}
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Suono: <span className="font-bold text-amber-600">{selectedLetter.phonetic}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speak again button */}
            <button
              onClick={() => {
                soundService.playPop();
                const display = isUppercase ? selectedLetter.letter : selectedLetter.lowercase;
                soundService.speakLetter(display, selectedLetter.word, language);
              }}
              className="w-12 h-12 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold transition active:scale-95"
              title="Ascolta di nuovo"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Trace this letter button */}
            <button
              onClick={() => {
                soundService.playPop();
                onSelectLetterForTracing(selectedLetter);
              }}
              className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-md border-b-4 border-emerald-700 active:scale-95 transition"
            >
              <Edit3 className="w-5 h-5" />
              <span>Scrivi "{isUppercase ? selectedLetter.letter : selectedLetter.lowercase}"</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
