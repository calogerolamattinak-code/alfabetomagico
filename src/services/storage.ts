import { LanguageCode } from '../types/alphabet';

export interface UserProgressState {
  stars: number;
  completedLetterIds: string[];
  unlockedStickerIds: string[];
  savedDrawings: { id: string; date: string; dataUrl: string; title: string }[];
  currentLanguage: LanguageCode;
  preferUppercase: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  customSvgPlates?: Record<string, string>; // Maps letter char (A, B, C...) to SVG markup
}

const STORAGE_KEY = 'alfabeto_magico_progress_v2';
const STORAGE_KEY_V1 = 'alfabeto_magico_progress_v1';

const DEFAULT_STATE: UserProgressState = {
  stars: 0, // Starts at zero as requested
  completedLetterIds: [],
  unlockedStickerIds: [],
  savedDrawings: [],
  currentLanguage: 'it',
  preferUppercase: true,
  soundEnabled: true,
  musicEnabled: false,
  customSvgPlates: {},
};

class StorageService {
  private state: UserProgressState = DEFAULT_STATE;

  constructor() {
    this.load();
  }

  public load(): UserProgressState {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
      } else {
        // Migration from v1: preserve drawings & custom plates, ensure stars start at 0
        const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
        if (rawV1) {
          try {
            const old = JSON.parse(rawV1);
            this.state = {
              ...DEFAULT_STATE,
              customSvgPlates: old.customSvgPlates || {},
              savedDrawings: old.savedDrawings || [],
              stars: 0, // Set to 0 as requested
            };
          } catch {
            this.state = { ...DEFAULT_STATE, stars: 0 };
          }
        } else {
          this.state = { ...DEFAULT_STATE, stars: 0 };
        }
        this.save();
      }
    } catch {
      this.state = { ...DEFAULT_STATE, stars: 0 };
    }
    return this.state;
  }

  public save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignored
    }
  }

  public getState(): UserProgressState {
    return this.state;
  }

  public addStars(amount: number): number {
    this.state.stars = Math.max(0, this.state.stars + amount);
    this.save();
    return this.state.stars;
  }

  public markLetterCompleted(letterId: string) {
    if (!this.state.completedLetterIds.includes(letterId)) {
      this.state.completedLetterIds.push(letterId);
      this.addStars(2);
    }
    this.save();
  }

  public setLanguage(lang: LanguageCode) {
    this.state.currentLanguage = lang;
    this.save();
  }

  public setPreferUppercase(upper: boolean) {
    this.state.preferUppercase = upper;
    this.save();
  }

  public unlockSticker(stickerId: string) {
    if (!this.state.unlockedStickerIds.includes(stickerId)) {
      this.state.unlockedStickerIds.push(stickerId);
      this.save();
    }
  }

  public saveDrawing(dataUrl: string, title: string) {
    this.state.savedDrawings.unshift({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      dataUrl,
      title,
    });
    // Keep max 20 drawings to protect local storage
    if (this.state.savedDrawings.length > 20) {
      this.state.savedDrawings = this.state.savedDrawings.slice(0, 20);
    }
    this.addStars(1);
    this.save();
  }

  public setCustomSvgPlate(letter: string, svgContent: string) {
    if (!this.state.customSvgPlates) {
      this.state.customSvgPlates = {};
    }
    this.state.customSvgPlates[letter.toUpperCase()] = svgContent;
    this.save();
  }

  public setMultipleCustomSvgPlates(plates: Record<string, string>) {
    if (!this.state.customSvgPlates) {
      this.state.customSvgPlates = {};
    }
    this.state.customSvgPlates = { ...this.state.customSvgPlates, ...plates };
    this.save();
  }

  public getCustomSvgPlate(letter: string): string | undefined {
    return this.state.customSvgPlates?.[letter.toUpperCase()];
  }

  public resetStars(): number {
    this.state.stars = 0;
    this.save();
    return 0;
  }

  public resetAllProgress() {
    this.state = { ...DEFAULT_STATE, stars: 0, unlockedStickerIds: [] };
    this.save();
  }
}

export const storageService = new StorageService();
