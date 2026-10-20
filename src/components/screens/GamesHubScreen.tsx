import React, { useState } from 'react';
import { ArrowLeft, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { LanguageCode, LetterItem } from '../../types/alphabet';
import { ALPHABETS } from '../../data/alphabets';
import { soundService } from '../../services/sound';
import { triggerConfetti } from '../../utils/confetti';

interface GamesHubScreenProps {
  language: LanguageCode;
  onBack: () => void;
  onAwardStars: (amount: number) => void;
}

type MiniGameType = 'hub' | 'match' | 'hunt' | 'memory' | 'missing' | 'train';

export const GamesHubScreen: React.FC<GamesHubScreenProps> = ({
  language,
  onBack,
  onAwardStars,
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameType>('hub');
  const letters = ALPHABETS[language] || ALPHABETS.it;

  // 1. MATCH GAME STATE
  const [matchTargetIndex, setMatchTargetIndex] = useState(0);
  const [matchOptions, setMatchOptions] = useState<LetterItem[]>([]);

  // 2. HUNT GAME STATE
  const [huntTargetLetter, setHuntTargetLetter] = useState<LetterItem>(letters[0]);
  const [huntBubbles, setHuntBubbles] = useState<{ id: number; letter: string; isTarget: boolean; popped: boolean }[]>([]);

  // 3. MEMORY GAME STATE
  const [memoryCards, setMemoryCards] = useState<{ id: number; char: string; pairKey: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // 4. MISSING LETTER STATE
  const [missingTarget, setMissingTarget] = useState<LetterItem>(letters[0]);
  const [missingChoices, setMissingChoices] = useState<string[]>([]);

  // 5. TRAIN GAME STATE
  const [trainLetters, setTrainLetters] = useState<string[]>([]);
  const [trainSlotSequence, setTrainSlotSequence] = useState<string[]>([]);

  // Start a specific game
  const startGame = (type: MiniGameType) => {
    soundService.playPop();
    setActiveGame(type);

    if (type === 'match') setupMatchGame();
    if (type === 'hunt') setupHuntGame();
    if (type === 'memory') setupMemoryGame();
    if (type === 'missing') setupMissingGame();
    if (type === 'train') setupTrainGame();
  };

  // Setup Match Game
  const setupMatchGame = () => {
    const targetIdx = Math.floor(Math.random() * letters.length);
    const target = letters[targetIdx];
    setMatchTargetIndex(targetIdx);

    // Pick 2 distractor letters
    const others = letters.filter((l) => l.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const choices = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setMatchOptions(choices);

    soundService.speak(`Tocca l'immagine che inizia con la lettera ${target.letter}!`, language);
  };

  const handleMatchPick = (picked: LetterItem) => {
    const target = letters[matchTargetIndex];
    if (picked.id === target.id) {
      soundService.playStarReward();
      triggerConfetti({ particleCount: 50, spread: 60 });
      onAwardStars(1);
      soundService.speak(`Bravissimo! ${target.letter} come ${target.word}!`, language);
      setTimeout(setupMatchGame, 1400);
    } else {
      soundService.playGentleEncouragement();
      soundService.speak(`Riprova! Cerca ${target.letter}!`, language);
    }
  };

  // Setup Hunt Game
  const setupHuntGame = () => {
    const target = letters[Math.floor(Math.random() * letters.length)];
    setHuntTargetLetter(target);

    const bubbles: { id: number; letter: string; isTarget: boolean; popped: boolean }[] = [];
    for (let i = 0; i < 8; i++) {
      const isTarget = i < 3; // 3 target bubbles
      const char = isTarget
        ? target.letter
        : letters[Math.floor(Math.random() * letters.length)].letter;
      bubbles.push({
        id: i,
        letter: char,
        isTarget: isTarget || char === target.letter,
        popped: false,
      });
    }
    setHuntBubbles(bubbles.sort(() => 0.5 - Math.random()));
    soundService.speak(`Fai scoppiare tutte le bolle con la lettera ${target.letter}!`, language);
  };

  const handleBubbleTap = (id: number) => {
    const bubble = huntBubbles.find((b) => b.id === id);
    if (!bubble || bubble.popped) return;

    if (bubble.isTarget) {
      soundService.playPop();
      const updated = huntBubbles.map((b) => (b.id === id ? { ...b, popped: true } : b));
      setHuntBubbles(updated);

      const remainingTargets = updated.filter((b) => b.isTarget && !b.popped);
      if (remainingTargets.length === 0) {
        soundService.playStarReward();
        triggerConfetti({ particleCount: 60, spread: 70 });
        onAwardStars(2);
        soundService.speak(`Le hai trovate tutte! Ottimo lavoro!`, language);
        setTimeout(setupHuntGame, 1600);
      }
    } else {
      soundService.playBoing();
    }
  };

  // Setup Memory Game
  const setupMemoryGame = () => {
    const selectedLetters = [...letters].sort(() => 0.5 - Math.random()).slice(0, 3);
    const cards: { id: number; char: string; pairKey: string; isFlipped: boolean; isMatched: boolean }[] = [];

    let id = 0;
    selectedLetters.forEach((l) => {
      // Uppercase card
      cards.push({ id: id++, char: l.letter, pairKey: l.id, isFlipped: false, isMatched: false });
      // Lowercase card
      cards.push({ id: id++, char: l.lowercase, pairKey: l.id, isFlipped: false, isMatched: false });
    });

    setMemoryCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    soundService.speak(`Abbina le lettere maiuscole alle lettere minuscole!`, language);
  };

  const handleCardTap = (id: number) => {
    if (selectedCards.length >= 2) return;
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    soundService.playPop();
    const updated = memoryCards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    setMemoryCards(updated);

    const nextSelected = [...selectedCards, id];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const card1 = updated.find((c) => c.id === nextSelected[0])!;
      const card2 = updated.find((c) => c.id === nextSelected[1])!;

      if (card1.pairKey === card2.pairKey) {
        // Matched pair!
        soundService.playSuccess();
        setTimeout(() => {
          const matchedList = updated.map((c) =>
            c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
          );
          setMemoryCards(matchedList);
          setSelectedCards([]);

          if (matchedList.every((c) => c.isMatched)) {
            soundService.playStarReward();
            triggerConfetti({ particleCount: 70, spread: 80 });
            onAwardStars(3);
            soundService.speak('Fantastico! Hai completato il memory!', language);
            setTimeout(setupMemoryGame, 1800);
          }
        }, 600);
      } else {
        // Not a match
        setTimeout(() => {
          soundService.playGentleEncouragement();
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // Setup Missing Letter Game
  const setupMissingGame = () => {
    const target = letters[Math.floor(Math.random() * letters.length)];
    setMissingTarget(target);

    // Pick 2 distractors
    const others = letters.filter((l) => l.id !== target.id);
    const shuffled = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const choices = [target.letter, shuffled[0].letter, shuffled[1].letter].sort(() => 0.5 - Math.random());
    setMissingChoices(choices);

    soundService.speak(`Quale lettera manca per scrivere la parola ${target.word}?`, language);
  };

  const handleMissingPick = (char: string) => {
    if (char === missingTarget.letter) {
      soundService.playStarReward();
      triggerConfetti({ particleCount: 50, spread: 60 });
      onAwardStars(1);
      soundService.speak(`Esatto! ${missingTarget.word}!`, language);
      setTimeout(setupMissingGame, 1400);
    } else {
      soundService.playGentleEncouragement();
      soundService.speak(`Riprova! Manca la ${missingTarget.letter}!`, language);
    }
  };

  // Setup Train Game (Alphabet order)
  const setupTrainGame = () => {
    // 4 sequential letters (e.g. A, B, C, D)
    const startIdx = Math.floor(Math.random() * Math.max(1, letters.length - 4));
    const slice = letters.slice(startIdx, startIdx + 4).map((l) => l.letter);
    setTrainLetters([...slice].sort(() => 0.5 - Math.random()));
    setTrainSlotSequence([]);
    soundService.speak(`Metti le lettere in ordine per far partire il trenino!`, language);
  };

  const handleTrainCarriageTap = (char: string) => {
    soundService.playPop();
    const newSeq = [...trainSlotSequence, char];
    setTrainSlotSequence(newSeq);
    setTrainLetters(trainLetters.filter((l) => l !== char));

    if (newSeq.length === 4) {
      // Check if sequence is in alphabetical order
      const isSorted = newSeq.every((val, i, arr) => !i || arr[i - 1].localeCompare(val) <= 0);
      if (isSorted) {
        soundService.playStarReward();
        triggerConfetti({ particleCount: 70, spread: 80 });
        onAwardStars(2);
        soundService.speak('Ciu ciu! Il trenino parte in perfetto ordine!', language);
        setTimeout(setupTrainGame, 1800);
      } else {
        soundService.playBoing();
        soundService.speak('Oh no! L\'ordine non è corretto, riproviamo insieme!', language);
        setTimeout(setupTrainGame, 1200);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 sm:p-5 max-w-4xl mx-auto w-full select-none overflow-hidden justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            soundService.playPop();
            if (activeGame === 'hub') {
              onBack();
            } else {
              setActiveGame('hub');
            }
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold flex items-center justify-center shadow-md border-b-4 border-amber-600 active:scale-95 transition"
          title="Indietro"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-950">
          {activeGame === 'hub' && 'Giochi Educativi ABC'}
          {activeGame === 'match' && 'Abbina Lettera e Figura'}
          {activeGame === 'hunt' && 'Caccia alla Lettera'}
          {activeGame === 'memory' && 'Memory Maiuscolo / Minuscolo'}
          {activeGame === 'missing' && 'Lettera Mancante'}
          {activeGame === 'train' && 'Trenino dell\'Alfabeto'}
        </h2>

        {activeGame !== 'hub' && (
          <button
            onClick={() => {
              soundService.playPop();
              if (activeGame === 'match') setupMatchGame();
              if (activeGame === 'hunt') setupHuntGame();
              if (activeGame === 'memory') setupMemoryGame();
              if (activeGame === 'missing') setupMissingGame();
              if (activeGame === 'train') setupTrainGame();
            }}
            className="w-12 h-12 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 flex items-center justify-center shadow border-2 border-indigo-300 active:scale-95 transition"
            title="Nuova Partita"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-2">
        {/* 0. GAMES HUB MENU */}
        {activeGame === 'hub' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            <button
              onClick={() => startGame('match')}
              className="p-5 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-xl border-4 border-white flex items-center gap-4 btn-chunky active:scale-95 transition"
            >
              <span className="text-5xl">🎯</span>
              <div className="text-left">
                <h3 className="text-xl font-extrabold">Abbina Lettera-Figura</h3>
                <p className="text-xs font-bold text-amber-900/80">Ascolta e tocca l'oggetto giusto</p>
              </div>
            </button>

            <button
              onClick={() => startGame('hunt')}
              className="p-5 rounded-3xl bg-gradient-to-r from-sky-400 to-blue-500 text-sky-950 shadow-xl border-4 border-white flex items-center gap-4 btn-chunky active:scale-95 transition"
            >
              <span className="text-5xl">🫧</span>
              <div className="text-left">
                <h3 className="text-xl font-extrabold">Caccia alla Lettera</h3>
                <p className="text-xs font-bold text-sky-900/80">Scoppia tutte le bolle con la lettera</p>
              </div>
            </button>

            <button
              onClick={() => startGame('memory')}
              className="p-5 rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950 shadow-xl border-4 border-white flex items-center gap-4 btn-chunky active:scale-95 transition"
            >
              <span className="text-5xl">🃏</span>
              <div className="text-left">
                <h3 className="text-xl font-extrabold">Memory Maiuscolo / Minuscolo</h3>
                <p className="text-xs font-bold text-emerald-900/80">Trova le coppie A e a</p>
              </div>
            </button>

            <button
              onClick={() => startGame('missing')}
              className="p-5 rounded-3xl bg-gradient-to-r from-rose-400 to-pink-500 text-rose-950 shadow-xl border-4 border-white flex items-center gap-4 btn-chunky active:scale-95 transition"
            >
              <span className="text-5xl">🧩</span>
              <div className="text-left">
                <h3 className="text-xl font-extrabold">Lettera Mancante</h3>
                <p className="text-xs font-bold text-rose-900/80">Completa la parola illustrata</p>
              </div>
            </button>

            <div className="sm:col-span-2 flex justify-center">
              <button
                onClick={() => startGame('train')}
                className="w-full max-w-md p-5 rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl border-4 border-white flex items-center gap-4 btn-chunky active:scale-95 transition"
              >
                <span className="text-5xl">🚂</span>
                <div className="text-left">
                  <h3 className="text-xl font-extrabold">Trenino dell'Alfabeto</h3>
                  <p className="text-xs font-bold text-purple-200">Ordina le carrozze A, B, C, D</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 1. MATCH GAME */}
        {activeGame === 'match' && (
          <div className="flex flex-col items-center w-full max-w-lg">
            <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl border-4 border-amber-400 flex items-center justify-center mb-6">
              <span className="text-7xl font-black text-amber-600 font-mono">
                {letters[matchTargetIndex]?.letter}
              </span>
            </div>

            <p className="text-base font-extrabold text-slate-800 mb-6 text-center">
              Quale figura inizia con la lettera{' '}
              <span className="text-amber-600 text-2xl font-black">
                {letters[matchTargetIndex]?.letter}
              </span>
              ?
            </p>

            <div className="grid grid-cols-3 gap-4 w-full">
              {matchOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleMatchPick(opt)}
                  className="p-4 rounded-3xl bg-white shadow-xl border-3 border-amber-200 hover:border-amber-400 flex flex-col items-center justify-center gap-2 active:scale-90 transition btn-chunky"
                >
                  <span className="text-6xl">{opt.emoji}</span>
                  <span className="text-sm font-extrabold text-slate-700">{opt.word}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. HUNT GAME */}
        {activeGame === 'hunt' && (
          <div className="flex flex-col items-center w-full max-w-lg">
            <div className="bg-sky-100 border-2 border-sky-300 px-5 py-2 rounded-2xl mb-4 flex items-center gap-2">
              <span className="text-sm font-extrabold text-sky-950">
                Trova e scoppia tutte le lettere:
              </span>
              <span className="text-3xl font-black text-sky-600 font-mono">
                {huntTargetLetter.letter}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 w-full">
              {huntBubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  disabled={bubble.popped}
                  onClick={() => handleBubbleTap(bubble.id)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl font-black shadow-lg transition-transform active:scale-90 ${
                    bubble.popped
                      ? 'opacity-0 scale-50 pointer-events-none'
                      : 'bg-gradient-to-br from-sky-300 to-blue-500 text-white border-4 border-white/80 animate-soft-bounce'
                  }`}
                >
                  {bubble.letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. MEMORY GAME */}
        {activeGame === 'memory' && (
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {memoryCards.map((card) => {
              const isVisible = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardTap(card.id)}
                  className={`aspect-square rounded-3xl flex items-center justify-center font-mono font-black text-5xl shadow-xl border-4 transition-transform active:scale-95 duration-200 ${
                    isVisible
                      ? 'bg-white border-emerald-400 text-emerald-600'
                      : 'bg-emerald-500 border-emerald-600 text-emerald-300 hover:bg-emerald-400'
                  }`}
                >
                  {isVisible ? card.char : '❓'}
                </button>
              );
            })}
          </div>
        )}

        {/* 4. MISSING LETTER GAME */}
        {activeGame === 'missing' && (
          <div className="flex flex-col items-center w-full max-w-md">
            <span className="text-7xl mb-4">{missingTarget.emoji}</span>

            <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-3xl shadow-xl border-4 border-rose-300 mb-6">
              <span className="w-12 h-14 border-b-4 border-dashed border-rose-500 flex items-center justify-center text-4xl font-black text-rose-500">
                _
              </span>
              <span className="text-4xl font-black text-slate-800 tracking-wider">
                {missingTarget.word.slice(1).toUpperCase()}
              </span>
            </div>

            <div className="flex gap-4">
              {missingChoices.map((c) => (
                <button
                  key={c}
                  onClick={() => handleMissingPick(c)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500 hover:bg-rose-600 active:scale-90 text-white font-mono font-black text-4xl shadow-lg border-b-4 border-rose-700 transition"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. TRAIN GAME */}
        {activeGame === 'train' && (
          <div className="flex flex-col items-center w-full max-w-lg">
            {/* The Train with slots */}
            <div className="flex items-center gap-2 bg-indigo-50 p-4 rounded-3xl border-3 border-indigo-200 mb-6 overflow-x-auto w-full justify-center">
              <span className="text-5xl">🚂</span>
              {[0, 1, 2, 3].map((slotIdx) => {
                const filled = trainSlotSequence[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className="w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-3 border-dashed border-indigo-400 bg-white flex items-center justify-center text-3xl font-black text-indigo-700 shadow-inner"
                  >
                    {filled || ''}
                  </div>
                );
              })}
            </div>

            <p className="text-sm font-extrabold text-slate-700 mb-4">
              Tocca le lettere per agganciare le carrozze in ordine:
            </p>

            {/* Available carriages */}
            <div className="flex gap-3">
              {trainLetters.map((char) => (
                <button
                  key={char}
                  onClick={() => handleTrainCarriageTap(char)}
                  className="w-16 h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-90 text-white font-black font-mono text-3xl shadow-lg border-b-4 border-indigo-700 transition"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Audio Prompt button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            soundService.playPop();
            if (activeGame === 'match') {
              soundService.speak(`Tocca la figura che inizia con la lettera ${letters[matchTargetIndex]?.letter}!`, language);
            } else if (activeGame === 'hunt') {
              soundService.speak(`Scoppia tutte le bolle con la lettera ${huntTargetLetter.letter}!`, language);
            } else if (activeGame === 'memory') {
              soundService.speak(`Trova la coppia di lettere corrispondenti!`, language);
            } else if (activeGame === 'missing') {
              soundService.speak(`Quale lettera manca per scrivere ${missingTarget.word}?`, language);
            } else if (activeGame === 'train') {
              soundService.speak(`Metti le lettere nell'ordine giusto!`, language);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 rounded-full font-extrabold text-sm shadow-md border-2 border-indigo-200 hover:bg-indigo-50 active:scale-95 transition"
        >
          <Volume2 className="w-5 h-5 text-indigo-600" />
          <span>Ascolta Istruzioni</span>
        </button>
      </div>
    </div>
  );
};
