import React, { useState, useEffect } from 'react';
import { ActiveScreen, LanguageCode, LetterItem } from './types/alphabet';
import { storageService, UserProgressState } from './services/storage';
import { Header } from './components/Header';
import { ParentGateModal } from './components/ParentGateModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { AlphabetGridScreen } from './components/screens/AlphabetGridScreen';
import { TracingScreen } from './components/screens/TracingScreen';
import { ColoringScreen } from './components/screens/ColoringScreen';
import { GamesHubScreen } from './components/screens/GamesHubScreen';
import { StickersScreen } from './components/screens/StickersScreen';

export default function App() {
  const [userState, setUserState] = useState<UserProgressState>(() => storageService.getState());
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [selectedTracingLetter, setSelectedTracingLetter] = useState<LetterItem | undefined>(undefined);
  const [isParentsOpen, setIsParentsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'full' | 'phone' | 'tablet'>('full');

  useEffect(() => {
    // Sync storage state
    setUserState(storageService.load());
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    storageService.setLanguage(lang);
    setUserState({ ...storageService.getState() });
  };

  const handleAwardStars = (amount: number) => {
    const newStars = storageService.addStars(amount);
    setUserState({ ...userState, stars: newStars });
  };

  const handleLetterCompleted = (letterId: string) => {
    storageService.markLetterCompleted(letterId);
    setUserState({ ...storageService.getState() });
  };

  const handleStickerUnlocked = (stickerId: string) => {
    storageService.unlockSticker(stickerId);
    setUserState({ ...storageService.getState() });
  };

  const handleNavigate = (screen: ActiveScreen) => {
    setCurrentScreen(screen);
  };

  const handleSelectLetterForTracing = (letter: LetterItem) => {
    setSelectedTracingLetter(letter);
    setCurrentScreen('tracing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-sky-100 to-rose-100 flex flex-col items-center justify-center p-0 md:p-3 overflow-hidden select-none">
      {/* Device frame container according to view mode */}
      <div
        className={`w-full flex flex-col bg-white overflow-hidden transition-all duration-300 shadow-2xl ${
          viewMode === 'full'
            ? 'h-screen max-w-none rounded-none'
            : viewMode === 'phone'
            ? 'h-[92vh] max-w-md rounded-[44px] border-[10px] border-slate-900 relative ring-8 ring-slate-800/20'
            : 'h-[90vh] max-w-4xl rounded-[36px] border-[12px] border-slate-900 relative ring-8 ring-slate-800/20'
        }`}
      >
        {/* Android Notch / Camera Cutout simulation for phone frame */}
        {viewMode === 'phone' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700" />
          </div>
        )}

        {/* Global App Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          stars={userState.stars}
          currentLanguage={userState.currentLanguage}
          onSelectLanguage={handleLanguageChange}
          onOpenParents={() => setIsParentsOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {/* Main View Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-amber-50/40">
          {currentScreen === 'home' && (
            <HomeScreen
              onNavigate={handleNavigate}
              language={userState.currentLanguage}
              stars={userState.stars}
              onOpenParents={() => setIsParentsOpen(true)}
            />
          )}

          {currentScreen === 'alphabet' && (
            <AlphabetGridScreen
              language={userState.currentLanguage}
              onSelectLetterForTracing={handleSelectLetterForTracing}
              onBack={() => handleNavigate('home')}
              completedLetterIds={userState.completedLetterIds}
            />
          )}

          {currentScreen === 'tracing' && (
            <TracingScreen
              language={userState.currentLanguage}
              initialLetter={selectedTracingLetter}
              onBack={() => handleNavigate('home')}
              onCompleted={handleLetterCompleted}
            />
          )}

          {currentScreen === 'coloring' && (
            <ColoringScreen
              language={userState.currentLanguage}
              onBack={() => handleNavigate('home')}
              onSaveDrawing={() => setUserState({ ...storageService.getState() })}
            />
          )}

          {currentScreen === 'games-hub' && (
            <GamesHubScreen
              language={userState.currentLanguage}
              onBack={() => handleNavigate('home')}
              onAwardStars={handleAwardStars}
            />
          )}

          {currentScreen === 'stickers' && (
            <StickersScreen
              stars={userState.stars}
              unlockedStickerIds={userState.unlockedStickerIds}
              onBack={() => handleNavigate('home')}
              onStickerUnlocked={handleStickerUnlocked}
            />
          )}
        </main>

        {/* Android Predictive Back Navigation Bar Indicator for mobile frame */}
        {viewMode === 'phone' && (
          <div className="w-full bg-white py-1 flex items-center justify-center border-t border-slate-100 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>

      {/* Math-Protected Parents Area Modal */}
      <ParentGateModal
        isOpen={isParentsOpen}
        onClose={() => setIsParentsOpen(false)}
        currentLanguage={userState.currentLanguage}
        onLanguageChange={handleLanguageChange}
        stars={userState.stars}
        onProgressReset={() => setUserState({ ...storageService.getState() })}
      />
    </div>
  );
}
