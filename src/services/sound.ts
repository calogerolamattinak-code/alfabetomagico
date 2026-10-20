import { LanguageCode } from '../types/alphabet';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private bgOscillator: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicPlaying) {
      this.stopGentleMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play synthetic cheerful sound effects via Web Audio API
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignored
    }
  }

  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
      });
    } catch {
      // Ignored
    }
  }

  public playStarReward() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const arp = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      arp.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.25);
      });
    } catch {
      // Ignored
    }
  }

  public playBoing() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // Ignored
    }
  }

  public playGentleEncouragement() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.setValueAtTime(392, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // Ignored
    }
  }

  public getVoicesList(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) this.voices = v;
    }
    return this.voices;
  }

  public hasItalianVoice(): boolean {
    const voices = this.getVoicesList();
    return voices.some((v) => v.lang.toLowerCase().replace('_', '-').startsWith('it'));
  }

  // System Text-To-Speech with Android and tablet-specific workarounds
  public async speak(text: string, language: LanguageCode, rate?: number, pitch?: number) {
    if (this.isMuted) return;

    const langMap: Record<LanguageCode, string> = {
      it: 'it-IT',
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
    };

    const targetLocale = langMap[language] || 'it-IT';
    // On Android tablets, fractional rates/pitches (<1.0) can crash/mute the TTS engine
    const effectiveRate = rate ?? 1.0;
    const effectivePitch = pitch ?? 1.0;

    // 1. Android Native JavascriptInterface (if user created an Android WebView bridge)
    try {
      const win = window as unknown as {
        Android?: { speak?: (t: string, lang?: string) => void };
        AndroidTTS?: { speak?: (t: string, lang?: string) => void };
      };
      if (win.Android && typeof win.Android.speak === 'function') {
        win.Android.speak(text, language);
        return;
      }
      if (win.AndroidTTS && typeof win.AndroidTTS.speak === 'function') {
        win.AndroidTTS.speak(text, language);
        return;
      }
    } catch {
      // Ignored
    }

    // 2. Native App on Android via Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop().catch(() => {});
        await TextToSpeech.speak({
          text,
          lang: targetLocale,
          rate: effectiveRate,
          pitch: effectivePitch,
          volume: 1.0,
          category: 'ambient',
        });
        return;
      } catch (nativeError) {
        console.warn('Native Capacitor TTS not available or failed:', nativeError);
      }
    }

    // 3. Browser SpeechSynthesis (Web / Android Chrome / Android WebView)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        // Fix Android deadlock: resume paused synthesis before queueing
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        // Only cancel if actively speaking, to avoid Android IPC cancellation race condition
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLocale;
        utterance.rate = effectiveRate;
        utterance.pitch = effectivePitch;
        utterance.volume = 1.0;

        // Refresh voices list
        const latestVoices = window.speechSynthesis.getVoices();
        if (latestVoices.length > 0) {
          this.voices = latestVoices;
        }

        const matchingVoices = this.voices.filter((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(language.toLowerCase())
        );

        if (matchingVoices.length > 0) {
          const preferredVoice =
            matchingVoices.find(
              (v) =>
                v.name.includes('Google') ||
                v.name.includes('Alice') ||
                v.name.includes('Federica') ||
                v.name.includes('Natural') ||
                v.name.includes('Elsa')
            ) ||
            matchingVoices.find((v) => !v.localService) ||
            matchingVoices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang;
          }
        }

        // CRITICAL ANDROID FIX: Prevent Garbage Collection of utterance in Chromium V8
        (window as unknown as { __activeUtterance: SpeechSynthesisUtterance | null }).__activeUtterance = utterance;

        utterance.onend = () => {
          (window as unknown as { __activeUtterance: SpeechSynthesisUtterance | null }).__activeUtterance = null;
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis utterance error:', e);
          (window as unknown as { __activeUtterance: SpeechSynthesisUtterance | null }).__activeUtterance = null;
        };

        // Small 40ms timeout helps Android IPC sync after cancel
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        }, 40);
      } catch (err) {
        console.warn('SpeechSynthesis failed:', err);
      }
    }
  }

  // Helper specifically designed for natural letter pronunciation in Italian and other languages
  public speakLetter(letter: string, word: string, language: LanguageCode) {
    if (language === 'it') {
      // "A come Ape!"
      this.speak(`${letter}. ${letter} come ${word}!`, 'it', 1.0, 1.0);
    } else if (language === 'es') {
      this.speak(`Letra ${letter}. ¡${letter} de ${word}!`, 'es', 1.0, 1.0);
    } else if (language === 'fr') {
      this.speak(`Lettre ${letter}. Comme ${word}!`, 'fr', 1.0, 1.0);
    } else if (language === 'de') {
      this.speak(`Buchstabe ${letter}. Wie ${word}!`, 'de', 1.0, 1.0);
    } else {
      this.speak(`Letter ${letter}. ${letter} is for ${word}!`, 'en', 1.0, 1.0);
    }
  }

  // Soft ambient music toggle
  public toggleGentleMusic(): boolean {
    if (this.musicPlaying) {
      this.stopGentleMusic();
      return false;
    } else {
      this.startGentleMusic();
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  private startGentleMusic() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.bgOscillator = ctx.createOscillator();
      this.bgGain = ctx.createGain();
      this.bgOscillator.type = 'sine';
      this.bgOscillator.frequency.setValueAtTime(261.63, ctx.currentTime); // C4

      this.bgGain.gain.setValueAtTime(0.03, ctx.currentTime);

      this.bgOscillator.connect(this.bgGain);
      this.bgGain.connect(ctx.destination);
      this.bgOscillator.start();
      this.musicPlaying = true;
    } catch {
      this.musicPlaying = false;
    }
  }

  private stopGentleMusic() {
    try {
      if (this.bgOscillator) {
        this.bgOscillator.stop();
        this.bgOscillator.disconnect();
        this.bgOscillator = null;
      }
      this.musicPlaying = false;
    } catch {
      this.musicPlaying = false;
    }
  }
}

export const soundService = new SoundService();
