import { LanguageCode, LanguageInfo, LetterItem, StickerItem, ColoringPage, StrokeSegment } from '../types/alphabet';
import { LETTER_STROKES } from './letterStrokes';

export const LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  it: {
    code: 'it',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    locale: 'it-IT',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    locale: 'en-US',
  },
  fr: {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    locale: 'fr-FR',
  },
  es: {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
    locale: 'es-ES',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    locale: 'de-DE',
  },
};

// Helper to construct a clean letter object with accurate educational strokes
function makeLetter(
  lang: string,
  char: string,
  lower: string,
  word: string,
  phonetic: string,
  emoji: string,
  color: string,
  customUpper?: StrokeSegment[],
  customLower?: StrokeSegment[]
): LetterItem {
  const strokeDef = LETTER_STROKES[char.toUpperCase()];
  return {
    id: `${lang}-${char.toLowerCase()}`,
    letter: char,
    lowercase: lower,
    word,
    phonetic,
    emoji,
    color,
    uppercaseStrokes: customUpper || strokeDef?.upper || [],
    lowercaseStrokes: customLower || strokeDef?.lower || [],
  };
}

// 1. ITALIAN ALPHABET (All 26 letters: A-Z matching the coloring cards)
const ITALIAN_LIST: LetterItem[] = [
  makeLetter('it', 'A', 'a', 'Ape', '/a/', '🐝', '#F59E0B'),
  makeLetter('it', 'B', 'b', 'Barca', '/b/', '⛵', '#3B82F6'),
  makeLetter('it', 'C', 'c', 'Casa', '/k/', '🏠', '#10B981'),
  makeLetter('it', 'D', 'd', 'Dado', '/d/', '🎲', '#06B6D4'),
  makeLetter('it', 'E', 'e', 'Elefante', '/e/', '🐘', '#8B5CF6'),
  makeLetter('it', 'F', 'f', 'Fiore', '/f/', '🌸', '#EC4899'),
  makeLetter('it', 'G', 'g', 'Gatto', '/ɡ/', '🐱', '#F97316'),
  makeLetter('it', 'H', 'h', 'Hamburger', 'muta', '🍔', '#EAB308'),
  makeLetter('it', 'I', 'i', 'Isola', '/i/', '🏝️', '#14B8A6'),
  makeLetter('it', 'J', 'j', 'Jet', '/dʒ/', '✈️', '#0284C7'),
  makeLetter('it', 'K', 'k', 'Koala', '/k/', '🐨', '#78716C'),
  makeLetter('it', 'L', 'l', 'Luna', '/l/', '🌙', '#EAB308'),
  makeLetter('it', 'M', 'm', 'Mela', '/m/', '🍎', '#EF4444'),
  makeLetter('it', 'N', 'n', 'Nuvola', '/n/', '☁️', '#60A5FA'),
  makeLetter('it', 'O', 'o', 'Ombrello', '/o/', '☂️', '#84CC16'),
  makeLetter('it', 'P', 'p', 'Pesce', '/p/', '🐟', '#A855F7'),
  makeLetter('it', 'Q', 'q', 'Quadrifoglio', '/kw/', '🍀', '#10B981'),
  makeLetter('it', 'R', 'r', 'Razzo', '/r/', '🚀', '#22C55E'),
  makeLetter('it', 'S', 's', 'Sole', '/s/', '☀️', '#FBBF24'),
  makeLetter('it', 'T', 't', 'Treno', '/t/', '🚂', '#38BDF8'),
  makeLetter('it', 'U', 'u', 'Uva', '/u/', '🍇', '#9333EA'),
  makeLetter('it', 'V', 'v', 'Valigia', '/v/', '🧳', '#F97316'),
  makeLetter('it', 'W', 'w', 'Wigwam', '/w/', '⛺', '#D97706'),
  makeLetter('it', 'X', 'x', 'Xilofono', '/ks/', '🎼', '#6366F1'),
  makeLetter('it', 'Y', 'y', 'Yo-yo', '/j/', '🪀', '#EC4899'),
  makeLetter('it', 'Z', 'z', 'Zucca', '/dz/', '🎃', '#F97316'),
];

// 2. ENGLISH ALPHABET (All 26 letters: A-Z)
const ENGLISH_LIST: LetterItem[] = [
  makeLetter('en', 'A', 'a', 'Apple', '/æ/', '🍎', '#EF4444'),
  makeLetter('en', 'B', 'b', 'Bear', '/b/', '🐻', '#84CC16'),
  makeLetter('en', 'C', 'c', 'Cat', '/k/', '🐱', '#F97316'),
  makeLetter('en', 'D', 'd', 'Duck', '/d/', '🦆', '#06B6D4'),
  makeLetter('en', 'E', 'e', 'Elephant', '/e/', '🐘', '#8B5CF6'),
  makeLetter('en', 'F', 'f', 'Fish', '/f/', '🐟', '#3B82F6'),
  makeLetter('en', 'G', 'g', 'Giraffe', '/dʒ/', '🦒', '#EAB308'),
  makeLetter('en', 'H', 'h', 'Horse', '/h/', '🐴', '#A855F7'),
  makeLetter('en', 'I', 'i', 'Igloo', '/ɪ/', '🧊', '#14B8A6'),
  makeLetter('en', 'J', 'j', 'Jellyfish', '/dʒ/', '🪼', '#EC4899'),
  makeLetter('en', 'K', 'k', 'Kangaroo', '/k/', '🦘', '#F59E0B'),
  makeLetter('en', 'L', 'l', 'Lion', '/l/', '🦁', '#F97316'),
  makeLetter('en', 'M', 'm', 'Monkey', '/m/', '🐵', '#78716C'),
  makeLetter('en', 'N', 'n', 'Nest', '/n/', '🪺', '#60A5FA'),
  makeLetter('en', 'O', 'o', 'Owl', '/aʊl/', '🦉', '#84CC16'),
  makeLetter('en', 'P', 'p', 'Penguin', '/p/', '🐧', '#0F172A'),
  makeLetter('en', 'Q', 'q', 'Queen', '/kw/', '👑', '#F43F5E'),
  makeLetter('en', 'R', 'r', 'Rabbit', '/r/', '🐰', '#22C55E'),
  makeLetter('en', 'S', 's', 'Sun', '/s/', '☀️', '#FBBF24'),
  makeLetter('en', 'T', 't', 'Tiger', '/t/', '🐯', '#EA580C'),
  makeLetter('en', 'U', 'u', 'Umbrella', '/ʌ/', '☂️', '#9333EA'),
  makeLetter('en', 'V', 'v', 'Violin', '/v/', '🎻', '#D97706'),
  makeLetter('en', 'W', 'w', 'Whale', '/w/', '🐋', '#0284C7'),
  makeLetter('en', 'X', 'x', 'Xylophone', '/z/', '🎼', '#6366F1'),
  makeLetter('en', 'Y', 'y', 'Yacht', '/j/', '⛵', '#EC4899'),
  makeLetter('en', 'Z', 'z', 'Zebra', '/z/', '🦓', '#334155'),
];

// 3. SPANISH ALPHABET (All 27 letters: A-Z including Ñ)
const SPANISH_LIST: LetterItem[] = [
  makeLetter('es', 'A', 'a', 'Abeja', '/a/', '🐝', '#F59E0B'),
  makeLetter('es', 'B', 'b', 'Barco', '/b/', '⛵', '#3B82F6'),
  makeLetter('es', 'C', 'c', 'Casa', '/k/', '🏠', '#10B981'),
  makeLetter('es', 'D', 'd', 'Delfín', '/d/', '🐬', '#06B6D4'),
  makeLetter('es', 'E', 'e', 'Elefante', '/e/', '🐘', '#8B5CF6'),
  makeLetter('es', 'F', 'f', 'Foca', '/f/', '🦭', '#38BDF8'),
  makeLetter('es', 'G', 'g', 'Gato', '/ɡ/', '🐱', '#F97316'),
  makeLetter('es', 'H', 'h', 'Helado', 'muda', '🍦', '#EC4899'),
  makeLetter('es', 'I', 'i', 'Isla', '/i/', '🏝️', '#14B8A6'),
  makeLetter('es', 'J', 'j', 'Jirafa', '/x/', '🦒', '#EAB308'),
  makeLetter('es', 'K', 'k', 'Koala', '/k/', '🐨', '#78716C'),
  makeLetter('es', 'L', 'l', 'León', '/l/', '🦁', '#EAB308'),
  makeLetter('es', 'M', 'm', 'Manzana', '/m/', '🍎', '#EF4444'),
  makeLetter('es', 'N', 'n', 'Nube', '/n/', '☁️', '#60A5FA'),
  makeLetter('es', 'Ñ', 'ñ', 'Ñandú', '/ɲ/', '🦤', '#EC4899'), // Ñ con virgulilla
  makeLetter('es', 'O', 'o', 'Oso', '/o/', '🐻', '#84CC16'),
  makeLetter('es', 'P', 'p', 'Perro', '/p/', '🐶', '#A855F7'),
  makeLetter('es', 'Q', 'q', 'Queso', '/k/', '🧀', '#F59E0B'),
  makeLetter('es', 'R', 'r', 'Ratón', '/r/', '🐭', '#22C55E'),
  makeLetter('es', 'S', 's', 'Sol', '/s/', '☀️', '#FBBF24'),
  makeLetter('es', 'T', 't', 'Tigre', '/t/', '🐯', '#EA580C'),
  makeLetter('es', 'U', 'u', 'Uva', '/u/', '🍇', '#9333EA'),
  makeLetter('es', 'V', 'v', 'Vaca', '/b/', '🐮', '#475569'),
  makeLetter('es', 'W', 'w', 'Waterpolo', '/w/', '🤽', '#0284C7'),
  makeLetter('es', 'X', 'x', 'Xilófono', '/ks/', '🎼', '#6366F1'),
  makeLetter('es', 'Y', 'y', 'Yate', '/ʝ/', '⛵', '#EC4899'),
  makeLetter('es', 'Z', 'z', 'Zorro', '/θ/', '🦊', '#EA580C'),
];

// 4. FRENCH ALPHABET (All 26 letters: A-Z + É, Ç)
const FRENCH_LIST: LetterItem[] = [
  makeLetter('fr', 'A', 'a', 'Abeille', '/a/', '🐝', '#F59E0B'),
  makeLetter('fr', 'B', 'b', 'Bateau', '/b/', '⛵', '#3B82F6'),
  makeLetter('fr', 'C', 'c', 'Chat', '/ʃ/', '🐱', '#10B981'),
  makeLetter('fr', 'Ç', 'ç', 'Citron', '/s/', '🍋', '#EAB308'), // Ç con cédille
  makeLetter('fr', 'D', 'd', 'Dauphin', '/d/', '🐬', '#06B6D4'),
  makeLetter('fr', 'E', 'e', 'Éléphant', '/e/', '🐘', '#8B5CF6'),
  makeLetter('fr', 'É', 'é', 'Étoile', '/e/', '⭐', '#FBBF24'), // É con accent aigu
  makeLetter('fr', 'F', 'f', 'Fleur', '/f/', '🌸', '#EC4899'),
  makeLetter('fr', 'G', 'g', 'Girafe', '/ʒ/', '🦒', '#F97316'),
  makeLetter('fr', 'H', 'h', 'Hibou', 'muet', '🦉', '#6366F1'),
  makeLetter('fr', 'I', 'i', 'Île', '/i/', '🏝️', '#14B8A6'),
  makeLetter('fr', 'J', 'j', 'Jardin', '/ʒ/', '🪴', '#22C55E'),
  makeLetter('fr', 'K', 'k', 'Koala', '/k/', '🐨', '#78716C'),
  makeLetter('fr', 'L', 'l', 'Lion', '/l/', '🦁', '#EAB308'),
  makeLetter('fr', 'M', 'm', 'Maison', '/m/', '🏡', '#EF4444'),
  makeLetter('fr', 'N', 'n', 'Nuage', '/n/', '☁️', '#60A5FA'),
  makeLetter('fr', 'O', 'o', 'Oiseau', '/wazo/', '🐦', '#84CC16'),
  makeLetter('fr', 'P', 'p', 'Papillon', '/p/', '🦋', '#EC4899'),
  makeLetter('fr', 'Q', 'q', 'Quatre', '/k/', '4️⃣', '#F43F5E'),
  makeLetter('fr', 'R', 'r', 'Renard', '/ʁ/', '🦊', '#EA580C'),
  makeLetter('fr', 'S', 's', 'Soleil', '/s/', '☀️', '#F59E0B'),
  makeLetter('fr', 'T', 't', 'Tortue', '/t/', '🐢', '#10B981'),
  makeLetter('fr', 'U', 'u', 'Usine', '/y/', '🏭', '#9333EA'),
  makeLetter('fr', 'V', 'v', 'Vache', '/v/', '🐮', '#475569'),
  makeLetter('fr', 'W', 'w', 'Wagon', '/v/', '🚃', '#0284C7'),
  makeLetter('fr', 'X', 'x', 'Xylophone', '/ɡz/', '🎼', '#6366F1'),
  makeLetter('fr', 'Y', 'y', 'Yaourt', '/j/', '🥛', '#EC4899'),
  makeLetter('fr', 'Z', 'z', 'Zèbre', '/z/', '🦓', '#334155'),
];

// 5. GERMAN ALPHABET (All 26 letters: A-Z + Ä, Ö, Ü, ß)
const GERMAN_LIST: LetterItem[] = [
  makeLetter('de', 'A', 'a', 'Apfel', '/a/', '🍎', '#EF4444'),
  makeLetter('de', 'Ä', 'ä', 'Äpfel', '/ɛː/', '🍏', '#84CC16'), // Ä con puntini
  makeLetter('de', 'B', 'b', 'Bär', '/b/', '🐻', '#854D0E'),
  makeLetter('de', 'C', 'c', 'Clown', '/k/', '🤡', '#10B981'),
  makeLetter('de', 'D', 'd', 'Delphin', '/d/', '🐬', '#06B6D4'),
  makeLetter('de', 'E', 'e', 'Elefant', '/e/', '🐘', '#8B5CF6'),
  makeLetter('de', 'F', 'f', 'Fisch', '/f/', '🐟', '#3B82F6'),
  makeLetter('de', 'G', 'g', 'Giraffe', '/ɡ/', '🦒', '#EAB308'),
  makeLetter('de', 'H', 'h', 'Haus', '/h/', '🏠', '#6366F1'),
  makeLetter('de', 'I', 'i', 'Igel', '/iː/', '🦔', '#14B8A6'),
  makeLetter('de', 'J', 'j', 'Jagdhund', '/j/', '🐕', '#EC4899'),
  makeLetter('de', 'K', 'k', 'Katze', '/k/', '🐱', '#F97316'),
  makeLetter('de', 'L', 'l', 'Löwe', '/l/', '🦁', '#EAB308'),
  makeLetter('de', 'M', 'm', 'Maus', '/m/', '🐭', '#78716C'),
  makeLetter('de', 'N', 'n', 'Nest', '/n/', '🪺', '#60A5FA'),
  makeLetter('de', 'O', 'o', 'Orange', '/oː/', '🍊', '#F97316'),
  makeLetter('de', 'Ö', 'ö', 'Ölbaum', '/øː/', '🫒', '#65A30D'), // Ö con puntini
  makeLetter('de', 'P', 'p', 'Pinguin', '/p/', '🐧', '#0F172A'),
  makeLetter('de', 'Q', 'q', 'Qualle', '/kv/', '🪼', '#F43F5E'),
  makeLetter('de', 'R', 'r', 'Rakete', '/ʁ/', '🚀', '#22C55E'),
  makeLetter('de', 'S', 's', 'Sonne', '/z/', '☀️', '#FBBF24'),
  makeLetter('de', 'ß', 'ß', 'Straße', '/s/', '🛣️', '#64748B'), // ß scharfes S
  makeLetter('de', 'T', 't', 'Tiger', '/t/', '🐯', '#EA580C'),
  makeLetter('de', 'U', 'u', 'Uhr', '/uː/', '⏰', '#9333EA'),
  makeLetter('de', 'Ü', 'ü', 'Überraschung', '/yː/', '🎁', '#EC4899'), // Ü con puntini
  makeLetter('de', 'V', 'v', 'Vogel', '/f/', '🐦', '#475569'),
  makeLetter('de', 'W', 'w', 'Wal', '/v/', '🐋', '#0284C7'),
  makeLetter('de', 'X', 'x', 'Xylophon', '/ks/', '🎼', '#6366F1'),
  makeLetter('de', 'Y', 'y', 'Yacht', '/j/', '⛵', '#EC4899'),
  makeLetter('de', 'Z', 'z', 'Zebra', '/ts/', '🦓', '#334155'),
];

export const ALPHABETS: Record<LanguageCode, LetterItem[]> = {
  it: ITALIAN_LIST,
  en: ENGLISH_LIST,
  es: SPANISH_LIST,
  fr: FRENCH_LIST,
  de: GERMAN_LIST,
};

// FULL 26 COLORING PLATES (A to Z) matching the user's educational sheets
export const COLORING_PAGES: ColoringPage[] = [
  { id: 'col-a', letter: 'A', title: 'Ape', category: 'Insetti', previewEmoji: '🐝', svgPath: 'bee' },
  { id: 'col-b', letter: 'B', title: 'Barca', category: 'Veicoli', previewEmoji: '⛵', svgPath: 'boat' },
  { id: 'col-c', letter: 'C', title: 'Casa', category: 'Cose', previewEmoji: '🏠', svgPath: 'house' },
  { id: 'col-d', letter: 'D', title: 'Dado', category: 'Giochi', previewEmoji: '🎲', svgPath: 'dice' },
  { id: 'col-e', letter: 'E', title: 'Elefante', category: 'Animali', previewEmoji: '🐘', svgPath: 'elephant' },
  { id: 'col-f', letter: 'F', title: 'Fiore', category: 'Natura', previewEmoji: '🌸', svgPath: 'flower' },
  { id: 'col-g', letter: 'G', title: 'Gatto', category: 'Animali', previewEmoji: '🐱', svgPath: 'cat' },
  { id: 'col-h', letter: 'H', title: 'Hamburger', category: 'Cibo', previewEmoji: '🍔', svgPath: 'hamburger' },
  { id: 'col-i', letter: 'I', title: 'Isola', category: 'Natura', previewEmoji: '🏝️', svgPath: 'island' },
  { id: 'col-j', letter: 'J', title: 'Jet', category: 'Veicoli', previewEmoji: '✈️', svgPath: 'jet' },
  { id: 'col-k', letter: 'K', title: 'Koala', category: 'Animali', previewEmoji: '🐨', svgPath: 'koala' },
  { id: 'col-l', letter: 'L', title: 'Luna', category: 'Spazio', previewEmoji: '🌙', svgPath: 'moon' },
  { id: 'col-m', letter: 'M', title: 'Mela', category: 'Frutta', previewEmoji: '🍎', svgPath: 'apple' },
  { id: 'col-n', letter: 'N', title: 'Nuvola', category: 'Meteo', previewEmoji: '☁️', svgPath: 'cloud' },
  { id: 'col-o', letter: 'O', title: 'Ombrello', category: 'Cose', previewEmoji: '☂️', svgPath: 'umbrella' },
  { id: 'col-p', letter: 'P', title: 'Pesce', category: 'Mare', previewEmoji: '🐟', svgPath: 'fish' },
  { id: 'col-q', letter: 'Q', title: 'Quadrifoglio', category: 'Natura', previewEmoji: '🍀', svgPath: 'clover' },
  { id: 'col-r', letter: 'R', title: 'Razzo', category: 'Spazio', previewEmoji: '🚀', svgPath: 'rocket' },
  { id: 'col-s', letter: 'S', title: 'Sole', category: 'Natura', previewEmoji: '☀️', svgPath: 'sun' },
  { id: 'col-t', letter: 'T', title: 'Treno', category: 'Veicoli', previewEmoji: '🚂', svgPath: 'train' },
  { id: 'col-u', letter: 'U', title: 'Uva', category: 'Frutta', previewEmoji: '🍇', svgPath: 'grapes' },
  { id: 'col-v', letter: 'V', title: 'Valigia', category: 'Cose', previewEmoji: '🧳', svgPath: 'suitcase' },
  { id: 'col-w', letter: 'W', title: 'Wigwam', category: 'Cose', previewEmoji: '⛺', svgPath: 'wigwam' },
  { id: 'col-x', letter: 'X', title: 'Xilofono', category: 'Musica', previewEmoji: '🎼', svgPath: 'xylophone' },
  { id: 'col-y', letter: 'Y', title: 'Yo-yo', category: 'Giochi', previewEmoji: '🪀', svgPath: 'yoyo' },
  { id: 'col-z', letter: 'Z', title: 'Zucca', category: 'Natura', previewEmoji: '🎃', svgPath: 'pumpkin' },
];

export const STICKERS_DATA: StickerItem[] = [
  { id: 'stk-star', name: 'Stella d\'Oro', emoji: '⭐', requiredStars: 1, category: 'Magia' },
  { id: 'stk-bee', name: 'Ape Allegra', emoji: '🐝', requiredStars: 3, category: 'Natura' },
  { id: 'stk-boat', name: 'Barchetta', emoji: '⛵', requiredStars: 5, category: 'Avventura' },
  { id: 'stk-pup', name: 'Cucciolo', emoji: '🐶', requiredStars: 7, category: 'Amici' },
  { id: 'stk-dolphin', name: 'Delfino', emoji: '🐬', requiredStars: 10, category: 'Oceano' },
  { id: 'stk-elephant', name: 'Elefantino', emoji: '🐘', requiredStars: 14, category: 'Safari' },
  { id: 'stk-crown', name: 'Corona Reale', emoji: '👑', requiredStars: 18, category: 'Trionfo' },
  { id: 'stk-rocket', name: 'Razzo Spaziale', emoji: '🚀', requiredStars: 22, category: 'Spazio' },
  { id: 'stk-unicorn', name: 'Unicorno Magico', emoji: '🦄', requiredStars: 26, category: 'Favole' },
  { id: 'stk-medal', name: 'Medaglia d\'Oro', emoji: '🏅', requiredStars: 30, category: 'Campione' },
];
