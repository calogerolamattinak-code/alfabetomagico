export type LanguageCode = 'it' | 'en' | 'fr' | 'es' | 'de';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  locale: string;
}

export interface StrokePoint {
  x: number; // 0.0 to 1.0 (relative)
  y: number; // 0.0 to 1.0 (relative)
}

export interface StrokeSegment {
  order: number;
  points: StrokePoint[];
  directionHint: string;
  arrowDirection?: 'down' | 'up' | 'right' | 'left' | 'down-right' | 'down-left';
}

export interface LetterItem {
  id: string;
  letter: string;
  lowercase: string;
  word: string;
  phonetic: string;
  emoji: string;
  color: string;
  uppercaseStrokes: StrokeSegment[];
  lowercaseStrokes: StrokeSegment[];
}

export interface ColoringPage {
  id: string;
  letter: string;
  title: string;
  category: string;
  svgPath: string;
  previewEmoji: string;
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  requiredStars: number;
  category: string;
}

export type ActiveScreen = 
  | 'home'
  | 'alphabet'
  | 'letter-detail'
  | 'tracing'
  | 'coloring'
  | 'games-hub'
  | 'game-match'
  | 'game-hunt'
  | 'game-memory'
  | 'game-missing'
  | 'game-train'
  | 'stickers'
  | 'parents';
