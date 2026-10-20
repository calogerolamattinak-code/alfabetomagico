import { StrokeSegment } from '../types/alphabet';

// Accurate school-standard strokes for all letters (Uppercase and Lowercase)
// Curved letters (O, C, D, G, J, P, Q, R, S, U, B, etc.) have rich, smoothly rounded trajectories
export const LETTER_STROKES: Record<string, { upper: StrokeSegment[]; lower: StrokeSegment[] }> = {
  A: {
    upper: [
      { order: 1, points: [{ x: 0.5, y: 0.15 }, { x: 0.22, y: 0.85 }], directionHint: 'Diagonale giù a sinistra', arrowDirection: 'down-left' },
      { order: 2, points: [{ x: 0.5, y: 0.15 }, { x: 0.78, y: 0.85 }], directionHint: 'Diagonale giù a destra', arrowDirection: 'down-right' },
      { order: 3, points: [{ x: 0.32, y: 0.58 }, { x: 0.68, y: 0.58 }], directionHint: 'Trattino da sinistra a destra', arrowDirection: 'right' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.65, y: 0.48 },
          { x: 0.52, y: 0.42 },
          { x: 0.38, y: 0.46 },
          { x: 0.32, y: 0.60 },
          { x: 0.36, y: 0.74 },
          { x: 0.50, y: 0.78 },
          { x: 0.65, y: 0.72 },
        ],
        directionHint: 'Cerchio tondo a sinistra',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.65, y: 0.42 }, { x: 0.65, y: 0.85 }], directionHint: 'Gambo giù', arrowDirection: 'down' },
    ],
  },

  B: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.28, y: 0.15 },
          { x: 0.50, y: 0.15 },
          { x: 0.65, y: 0.20 },
          { x: 0.72, y: 0.32 },
          { x: 0.65, y: 0.44 },
          { x: 0.50, y: 0.50 },
          { x: 0.28, y: 0.50 },
        ],
        directionHint: 'Prima pancia arrotondata',
        arrowDirection: 'right',
      },
      {
        order: 3,
        points: [
          { x: 0.28, y: 0.50 },
          { x: 0.52, y: 0.50 },
          { x: 0.68, y: 0.56 },
          { x: 0.76, y: 0.68 },
          { x: 0.68, y: 0.79 },
          { x: 0.52, y: 0.85 },
          { x: 0.28, y: 0.85 },
        ],
        directionHint: 'Seconda pancia arrotondata',
        arrowDirection: 'right',
      },
    ],
    lower: [
      { order: 1, points: [{ x: 0.28, y: 0.12 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta lunga giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.28, y: 0.52 },
          { x: 0.46, y: 0.48 },
          { x: 0.62, y: 0.52 },
          { x: 0.72, y: 0.65 },
          { x: 0.66, y: 0.79 },
          { x: 0.48, y: 0.85 },
          { x: 0.28, y: 0.85 },
        ],
        directionHint: 'Pancia arrotondata a destra',
        arrowDirection: 'right',
      },
    ],
  },

  C: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.74, y: 0.26 },
          { x: 0.60, y: 0.17 },
          { x: 0.45, y: 0.15 },
          { x: 0.30, y: 0.24 },
          { x: 0.22, y: 0.50 },
          { x: 0.30, y: 0.76 },
          { x: 0.45, y: 0.85 },
          { x: 0.60, y: 0.83 },
          { x: 0.74, y: 0.74 },
        ],
        directionHint: 'Grande arco tondo verso sinistra',
        arrowDirection: 'left',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.68, y: 0.48 },
          { x: 0.56, y: 0.43 },
          { x: 0.42, y: 0.42 },
          { x: 0.32, y: 0.50 },
          { x: 0.28, y: 0.63 },
          { x: 0.32, y: 0.76 },
          { x: 0.42, y: 0.84 },
          { x: 0.56, y: 0.83 },
          { x: 0.68, y: 0.78 },
        ],
        directionHint: 'Archetto tondo',
        arrowDirection: 'left',
      },
    ],
  },

  D: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.28, y: 0.15 },
          { x: 0.48, y: 0.15 },
          { x: 0.64, y: 0.22 },
          { x: 0.74, y: 0.34 },
          { x: 0.78, y: 0.50 },
          { x: 0.74, y: 0.66 },
          { x: 0.64, y: 0.78 },
          { x: 0.48, y: 0.85 },
          { x: 0.28, y: 0.85 },
        ],
        directionHint: 'Grande pancia tonda a destra',
        arrowDirection: 'right',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.68, y: 0.52 },
          { x: 0.52, y: 0.48 },
          { x: 0.38, y: 0.52 },
          { x: 0.30, y: 0.65 },
          { x: 0.36, y: 0.79 },
          { x: 0.50, y: 0.85 },
          { x: 0.68, y: 0.85 },
        ],
        directionHint: 'Pancia arrotondata a sinistra',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.68, y: 0.12 }, { x: 0.68, y: 0.85 }], directionHint: 'Asta alta a destra', arrowDirection: 'down' },
    ],
  },

  E: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.28, y: 0.15 }, { x: 0.75, y: 0.15 }], directionHint: 'Braccio sopra', arrowDirection: 'right' },
      { order: 3, points: [{ x: 0.28, y: 0.50 }, { x: 0.65, y: 0.50 }], directionHint: 'Braccio al centro', arrowDirection: 'right' },
      { order: 4, points: [{ x: 0.28, y: 0.85 }, { x: 0.75, y: 0.85 }], directionHint: 'Braccio sotto', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.60 }, { x: 0.68, y: 0.60 }], directionHint: 'Trattino al centro', arrowDirection: 'right' },
      {
        order: 2,
        points: [
          { x: 0.68, y: 0.60 },
          { x: 0.60, y: 0.44 },
          { x: 0.48, y: 0.40 },
          { x: 0.34, y: 0.48 },
          { x: 0.30, y: 0.63 },
          { x: 0.36, y: 0.78 },
          { x: 0.50, y: 0.85 },
          { x: 0.66, y: 0.80 },
        ],
        directionHint: 'Curva tonda intorno',
        arrowDirection: 'up',
      },
    ],
  },

  F: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.28, y: 0.15 }, { x: 0.75, y: 0.15 }], directionHint: 'Braccio sopra', arrowDirection: 'right' },
      { order: 3, points: [{ x: 0.28, y: 0.50 }, { x: 0.65, y: 0.50 }], directionHint: 'Braccio al centro', arrowDirection: 'right' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.65, y: 0.18 },
          { x: 0.54, y: 0.15 },
          { x: 0.45, y: 0.22 },
          { x: 0.45, y: 0.85 },
        ],
        directionHint: 'Gancio arrotondato e asta giù',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.30, y: 0.45 }, { x: 0.60, y: 0.45 }], directionHint: 'Traversa orizzontale', arrowDirection: 'right' },
    ],
  },

  G: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.74, y: 0.26 },
          { x: 0.60, y: 0.17 },
          { x: 0.45, y: 0.15 },
          { x: 0.30, y: 0.24 },
          { x: 0.22, y: 0.50 },
          { x: 0.30, y: 0.76 },
          { x: 0.45, y: 0.85 },
          { x: 0.62, y: 0.83 },
          { x: 0.74, y: 0.72 },
          { x: 0.74, y: 0.52 },
        ],
        directionHint: 'Grande arco tondo fino a metà',
        arrowDirection: 'left',
      },
      {
        order: 2,
        points: [
          { x: 0.74, y: 0.52 },
          { x: 0.50, y: 0.52 },
        ],
        directionHint: 'Stanghetta orizzontale verso l\'interno',
        arrowDirection: 'left',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.65, y: 0.44 },
          { x: 0.52, y: 0.38 },
          { x: 0.38, y: 0.44 },
          { x: 0.32, y: 0.56 },
          { x: 0.38, y: 0.68 },
          { x: 0.52, y: 0.72 },
          { x: 0.65, y: 0.68 },
        ],
        directionHint: 'Cerchio tondo sopra',
        arrowDirection: 'left',
      },
      {
        order: 2,
        points: [
          { x: 0.65, y: 0.38 },
          { x: 0.65, y: 0.75 },
          { x: 0.60, y: 0.88 },
          { x: 0.48, y: 0.95 },
          { x: 0.32, y: 0.88 },
        ],
        directionHint: 'Gambo giù con gancio morbido a sinistra',
        arrowDirection: 'down',
      },
    ],
  },

  H: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Prima asta verticale sinistra', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.72, y: 0.15 }, { x: 0.72, y: 0.85 }], directionHint: 'Seconda asta verticale destra', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.28, y: 0.50 }, { x: 0.72, y: 0.50 }], directionHint: 'Sbarra orizzontale al centro', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.30, y: 0.12 }, { x: 0.30, y: 0.85 }], directionHint: 'Asta alta a sinistra', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.50 },
          { x: 0.42, y: 0.42 },
          { x: 0.58, y: 0.42 },
          { x: 0.68, y: 0.52 },
          { x: 0.68, y: 0.85 },
        ],
        directionHint: 'Archetto tondo a destra',
        arrowDirection: 'right',
      },
    ],
  },

  I: {
    upper: [
      { order: 1, points: [{ x: 0.50, y: 0.15 }, { x: 0.50, y: 0.85 }], directionHint: 'Asta verticale centrale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.32, y: 0.15 }, { x: 0.68, y: 0.15 }], directionHint: 'Sbarretta in alto', arrowDirection: 'right' },
      { order: 3, points: [{ x: 0.32, y: 0.85 }, { x: 0.68, y: 0.85 }], directionHint: 'Sbarretta in basso', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.50, y: 0.42 }, { x: 0.50, y: 0.85 }], directionHint: 'Asta dritta giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.50, y: 0.24 }, { x: 0.50, y: 0.27 }], directionHint: 'Puntino sopra', arrowDirection: 'down' },
    ],
  },

  J: {
    upper: [
      { order: 1, points: [{ x: 0.30, y: 0.15 }, { x: 0.70, y: 0.15 }], directionHint: 'Tettuccio orizzontale in alto', arrowDirection: 'right' },
      {
        order: 2,
        points: [
          { x: 0.58, y: 0.15 },
          { x: 0.58, y: 0.62 },
          { x: 0.55, y: 0.74 },
          { x: 0.47, y: 0.83 },
          { x: 0.36, y: 0.85 },
          { x: 0.26, y: 0.79 },
          { x: 0.22, y: 0.68 },
        ],
        directionHint: 'Gambo giù con gancio arrotondato a sinistra',
        arrowDirection: 'down',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.55, y: 0.40 },
          { x: 0.55, y: 0.72 },
          { x: 0.52, y: 0.84 },
          { x: 0.42, y: 0.94 },
          { x: 0.28, y: 0.88 },
        ],
        directionHint: 'Asta giù con gancio morbido a sinistra',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.55, y: 0.24 }, { x: 0.55, y: 0.27 }], directionHint: 'Puntino sopra', arrowDirection: 'down' },
    ],
  },

  K: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.72, y: 0.18 }, { x: 0.28, y: 0.52 }], directionHint: 'Ramo obliquo giù al centro', arrowDirection: 'down-left' },
      { order: 3, points: [{ x: 0.38, y: 0.46 }, { x: 0.74, y: 0.85 }], directionHint: 'Gamba obliqua giù a destra', arrowDirection: 'down-right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.28, y: 0.12 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta alta giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.65, y: 0.46 }, { x: 0.28, y: 0.66 }], directionHint: 'Ramo corto', arrowDirection: 'down-left' },
      { order: 3, points: [{ x: 0.38, y: 0.62 }, { x: 0.68, y: 0.85 }], directionHint: 'Gambetta giù', arrowDirection: 'down-right' },
    ],
  },

  L: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.28, y: 0.85 }, { x: 0.72, y: 0.85 }], directionHint: 'Piede orizzontale a destra', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.50, y: 0.12 }, { x: 0.50, y: 0.85 }], directionHint: 'Asta verticale dritta giù', arrowDirection: 'down' },
    ],
  },

  M: {
    upper: [
      { order: 1, points: [{ x: 0.22, y: 0.85 }, { x: 0.22, y: 0.15 }], directionHint: 'Prima asta in alto', arrowDirection: 'up' },
      { order: 2, points: [{ x: 0.22, y: 0.15 }, { x: 0.50, y: 0.62 }], directionHint: 'Diagonale giù al centro', arrowDirection: 'down-right' },
      { order: 3, points: [{ x: 0.50, y: 0.62 }, { x: 0.78, y: 0.15 }], directionHint: 'Diagonale su a destra', arrowDirection: 'up' },
      { order: 4, points: [{ x: 0.78, y: 0.15 }, { x: 0.78, y: 0.85 }], directionHint: 'Asta destra giù', arrowDirection: 'down' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.22, y: 0.40 }, { x: 0.22, y: 0.85 }], directionHint: 'Asta corta sinistra', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.22, y: 0.52 },
          { x: 0.32, y: 0.40 },
          { x: 0.44, y: 0.40 },
          { x: 0.50, y: 0.50 },
          { x: 0.50, y: 0.85 },
        ],
        directionHint: 'Prima gobba tonda',
        arrowDirection: 'right',
      },
      {
        order: 3,
        points: [
          { x: 0.50, y: 0.52 },
          { x: 0.60, y: 0.40 },
          { x: 0.72, y: 0.40 },
          { x: 0.78, y: 0.50 },
          { x: 0.78, y: 0.85 },
        ],
        directionHint: 'Seconda gobba tonda',
        arrowDirection: 'right',
      },
    ],
  },

  N: {
    upper: [
      { order: 1, points: [{ x: 0.26, y: 0.85 }, { x: 0.26, y: 0.15 }], directionHint: 'Asta sinistra su', arrowDirection: 'up' },
      { order: 2, points: [{ x: 0.26, y: 0.15 }, { x: 0.74, y: 0.85 }], directionHint: 'Grande diagonale attraverso', arrowDirection: 'down-right' },
      { order: 3, points: [{ x: 0.74, y: 0.85 }, { x: 0.74, y: 0.15 }], directionHint: 'Asta destra su', arrowDirection: 'up' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.30, y: 0.40 }, { x: 0.30, y: 0.85 }], directionHint: 'Asta corta sinistra', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.52 },
          { x: 0.42, y: 0.40 },
          { x: 0.58, y: 0.40 },
          { x: 0.70, y: 0.52 },
          { x: 0.70, y: 0.85 },
        ],
        directionHint: 'Gobba arrotondata a destra',
        arrowDirection: 'right',
      },
    ],
  },

  // O: PERFETTAMENTE ARROTONDATA CON TRAIETTORIA MORBIDA A 12 PUNTI
  O: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.15 },
          { x: 0.36, y: 0.18 },
          { x: 0.26, y: 0.30 },
          { x: 0.22, y: 0.50 },
          { x: 0.26, y: 0.70 },
          { x: 0.36, y: 0.82 },
          { x: 0.50, y: 0.85 },
          { x: 0.64, y: 0.82 },
          { x: 0.74, y: 0.70 },
          { x: 0.78, y: 0.50 },
          { x: 0.74, y: 0.30 },
          { x: 0.64, y: 0.18 },
          { x: 0.50, y: 0.15 },
        ],
        directionHint: 'Grande cerchio tondo e continuo',
        arrowDirection: 'left',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.42 },
          { x: 0.38, y: 0.45 },
          { x: 0.30, y: 0.53 },
          { x: 0.28, y: 0.63 },
          { x: 0.30, y: 0.73 },
          { x: 0.38, y: 0.82 },
          { x: 0.50, y: 0.85 },
          { x: 0.62, y: 0.82 },
          { x: 0.70, y: 0.73 },
          { x: 0.72, y: 0.63 },
          { x: 0.70, y: 0.53 },
          { x: 0.62, y: 0.45 },
          { x: 0.50, y: 0.42 },
        ],
        directionHint: 'Cerchietto tondo continuo',
        arrowDirection: 'left',
      },
    ],
  },

  P: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.28, y: 0.15 },
          { x: 0.52, y: 0.15 },
          { x: 0.68, y: 0.21 },
          { x: 0.76, y: 0.32 },
          { x: 0.68, y: 0.44 },
          { x: 0.52, y: 0.50 },
          { x: 0.28, y: 0.50 },
        ],
        directionHint: 'Pancia arrotondata in alto a destra',
        arrowDirection: 'right',
      },
    ],
    lower: [
      { order: 1, points: [{ x: 0.30, y: 0.40 }, { x: 0.30, y: 0.95 }], directionHint: 'Asta lunga giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.52 },
          { x: 0.48, y: 0.46 },
          { x: 0.64, y: 0.50 },
          { x: 0.72, y: 0.64 },
          { x: 0.64, y: 0.78 },
          { x: 0.48, y: 0.84 },
          { x: 0.30, y: 0.84 },
        ],
        directionHint: 'Pancia tonda a destra',
        arrowDirection: 'right',
      },
    ],
  },

  Q: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.15 },
          { x: 0.36, y: 0.18 },
          { x: 0.26, y: 0.30 },
          { x: 0.22, y: 0.50 },
          { x: 0.26, y: 0.70 },
          { x: 0.36, y: 0.82 },
          { x: 0.50, y: 0.85 },
          { x: 0.64, y: 0.82 },
          { x: 0.74, y: 0.70 },
          { x: 0.78, y: 0.50 },
          { x: 0.74, y: 0.30 },
          { x: 0.64, y: 0.18 },
          { x: 0.50, y: 0.15 },
        ],
        directionHint: 'Grande cerchio tondo',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.58, y: 0.68 }, { x: 0.82, y: 0.88 }], directionHint: 'Gambetta obliqua in basso', arrowDirection: 'down-right' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.68, y: 0.52 },
          { x: 0.52, y: 0.48 },
          { x: 0.38, y: 0.52 },
          { x: 0.30, y: 0.65 },
          { x: 0.36, y: 0.79 },
          { x: 0.50, y: 0.85 },
          { x: 0.68, y: 0.85 },
        ],
        directionHint: 'Cerchio a sinistra',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.68, y: 0.40 }, { x: 0.68, y: 0.95 }, { x: 0.78, y: 0.88 }], directionHint: 'Asta giù con piedino', arrowDirection: 'down' },
    ],
  },

  R: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.15 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.28, y: 0.15 },
          { x: 0.52, y: 0.15 },
          { x: 0.68, y: 0.21 },
          { x: 0.76, y: 0.32 },
          { x: 0.68, y: 0.44 },
          { x: 0.52, y: 0.50 },
          { x: 0.28, y: 0.50 },
        ],
        directionHint: 'Pancia arrotondata sopra',
        arrowDirection: 'right',
      },
      { order: 3, points: [{ x: 0.48, y: 0.50 }, { x: 0.75, y: 0.85 }], directionHint: 'Gamba obliqua giù a destra', arrowDirection: 'down-right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.35, y: 0.40 }, { x: 0.35, y: 0.85 }], directionHint: 'Asta corta giù', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.35, y: 0.56 },
          { x: 0.46, y: 0.44 },
          { x: 0.60, y: 0.42 },
          { x: 0.70, y: 0.48 },
        ],
        directionHint: 'Archetto morbido a destra',
        arrowDirection: 'right',
      },
    ],
  },

  S: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.72, y: 0.26 },
          { x: 0.60, y: 0.17 },
          { x: 0.44, y: 0.16 },
          { x: 0.32, y: 0.23 },
          { x: 0.28, y: 0.34 },
          { x: 0.34, y: 0.44 },
          { x: 0.48, y: 0.50 },
          { x: 0.62, y: 0.56 },
          { x: 0.72, y: 0.65 },
          { x: 0.70, y: 0.76 },
          { x: 0.58, y: 0.84 },
          { x: 0.42, y: 0.85 },
          { x: 0.28, y: 0.78 },
        ],
        directionHint: 'Curva a serpente morbida e continua',
        arrowDirection: 'left',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.68, y: 0.48 },
          { x: 0.56, y: 0.42 },
          { x: 0.42, y: 0.43 },
          { x: 0.34, y: 0.50 },
          { x: 0.38, y: 0.58 },
          { x: 0.50, y: 0.64 },
          { x: 0.62, y: 0.70 },
          { x: 0.66, y: 0.78 },
          { x: 0.56, y: 0.84 },
          { x: 0.44, y: 0.85 },
          { x: 0.34, y: 0.80 },
        ],
        directionHint: 'Curva a serpente morbida',
        arrowDirection: 'left',
      },
    ],
  },

  T: {
    upper: [
      { order: 1, points: [{ x: 0.20, y: 0.18 }, { x: 0.80, y: 0.18 }], directionHint: 'Tetto orizzontale in alto', arrowDirection: 'right' },
      { order: 2, points: [{ x: 0.50, y: 0.18 }, { x: 0.50, y: 0.85 }], directionHint: 'Asta verticale centrale giù', arrowDirection: 'down' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.18 },
          { x: 0.50, y: 0.76 },
          { x: 0.54, y: 0.83 },
          { x: 0.64, y: 0.85 },
        ],
        directionHint: 'Asta alta con curva morbida in fondo',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.35, y: 0.42 }, { x: 0.65, y: 0.42 }], directionHint: 'Traversa orizzontale', arrowDirection: 'right' },
    ],
  },

  U: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.28, y: 0.15 },
          { x: 0.28, y: 0.60 },
          { x: 0.32, y: 0.74 },
          { x: 0.40, y: 0.83 },
          { x: 0.50, y: 0.85 },
          { x: 0.60, y: 0.83 },
          { x: 0.68, y: 0.74 },
          { x: 0.72, y: 0.60 },
          { x: 0.72, y: 0.15 },
        ],
        directionHint: 'Grande conca arrotondata giù e su',
        arrowDirection: 'down',
      },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.30, y: 0.42 },
          { x: 0.30, y: 0.68 },
          { x: 0.34, y: 0.78 },
          { x: 0.42, y: 0.84 },
          { x: 0.50, y: 0.85 },
          { x: 0.58, y: 0.84 },
          { x: 0.66, y: 0.78 },
          { x: 0.70, y: 0.68 },
          { x: 0.70, y: 0.42 },
        ],
        directionHint: 'Conca arrotondata',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.70, y: 0.42 }, { x: 0.70, y: 0.85 }], directionHint: 'Gambetta destra giù', arrowDirection: 'down' },
    ],
  },

  V: {
    upper: [
      { order: 1, points: [{ x: 0.25, y: 0.18 }, { x: 0.50, y: 0.85 }], directionHint: 'Diagonale giù a sinistra', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.50, y: 0.85 }, { x: 0.75, y: 0.18 }], directionHint: 'Diagonale su a destra', arrowDirection: 'up' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.42 }, { x: 0.50, y: 0.85 }], directionHint: 'Diagonale giù', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.50, y: 0.85 }, { x: 0.68, y: 0.42 }], directionHint: 'Diagonale su', arrowDirection: 'up' },
    ],
  },

  W: {
    upper: [
      { order: 1, points: [{ x: 0.18, y: 0.18 }, { x: 0.32, y: 0.85 }], directionHint: 'Prima linea giù', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.32, y: 0.85 }, { x: 0.50, y: 0.38 }], directionHint: 'Seconda linea su', arrowDirection: 'up' },
      { order: 3, points: [{ x: 0.50, y: 0.38 }, { x: 0.68, y: 0.85 }], directionHint: 'Terza linea giù', arrowDirection: 'down-right' },
      { order: 4, points: [{ x: 0.68, y: 0.85 }, { x: 0.82, y: 0.18 }], directionHint: 'Quarta linea su', arrowDirection: 'up' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.22, y: 0.42 }, { x: 0.35, y: 0.85 }], directionHint: 'Linea giù', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.35, y: 0.85 }, { x: 0.50, y: 0.55 }], directionHint: 'Linea su', arrowDirection: 'up' },
      { order: 3, points: [{ x: 0.50, y: 0.55 }, { x: 0.65, y: 0.85 }], directionHint: 'Linea giù', arrowDirection: 'down-right' },
      { order: 4, points: [{ x: 0.65, y: 0.85 }, { x: 0.78, y: 0.42 }], directionHint: 'Linea su', arrowDirection: 'up' },
    ],
  },

  X: {
    upper: [
      { order: 1, points: [{ x: 0.25, y: 0.18 }, { x: 0.75, y: 0.85 }], directionHint: 'Prima diagonale da sinistra a destra', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.75, y: 0.18 }, { x: 0.25, y: 0.85 }], directionHint: 'Seconda diagonale da destra a sinistra', arrowDirection: 'down-left' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.42 }, { x: 0.68, y: 0.85 }], directionHint: 'Prima diagonale', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.68, y: 0.42 }, { x: 0.32, y: 0.85 }], directionHint: 'Seconda diagonale', arrowDirection: 'down-left' },
    ],
  },

  Y: {
    upper: [
      { order: 1, points: [{ x: 0.25, y: 0.18 }, { x: 0.50, y: 0.52 }], directionHint: 'Ramo sinistro al centro', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.75, y: 0.18 }, { x: 0.50, y: 0.52 }], directionHint: 'Ramo destro al centro', arrowDirection: 'down-left' },
      { order: 3, points: [{ x: 0.50, y: 0.52 }, { x: 0.50, y: 0.85 }], directionHint: 'Gambo centrale giù', arrowDirection: 'down' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.42 }, { x: 0.50, y: 0.65 }], directionHint: 'Ramo sinistro corto', arrowDirection: 'down-right' },
      { order: 2, points: [{ x: 0.68, y: 0.42 }, { x: 0.50, y: 0.65 }, { x: 0.35, y: 0.95 }], directionHint: 'Lunga diagonale giù a sinistra', arrowDirection: 'down-left' },
    ],
  },

  Z: {
    upper: [
      { order: 1, points: [{ x: 0.25, y: 0.18 }, { x: 0.75, y: 0.18 }], directionHint: 'Sbarra orizzontale in alto', arrowDirection: 'right' },
      { order: 2, points: [{ x: 0.75, y: 0.18 }, { x: 0.25, y: 0.85 }], directionHint: 'Grande diagonale obliqua giù', arrowDirection: 'down-left' },
      { order: 3, points: [{ x: 0.25, y: 0.85 }, { x: 0.75, y: 0.85 }], directionHint: 'Sbarra orizzontale in basso', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.45 }, { x: 0.68, y: 0.45 }], directionHint: 'Sbarretta in alto', arrowDirection: 'right' },
      { order: 2, points: [{ x: 0.68, y: 0.45 }, { x: 0.32, y: 0.85 }], directionHint: 'Diagonale', arrowDirection: 'down-left' },
      { order: 3, points: [{ x: 0.32, y: 0.85 }, { x: 0.68, y: 0.85 }], directionHint: 'Sbarretta in basso', arrowDirection: 'right' },
    ],
  },

  Ñ: {
    upper: [
      { order: 1, points: [{ x: 0.26, y: 0.25 }, { x: 0.26, y: 0.85 }], directionHint: 'Asta sinistra giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.26, y: 0.25 }, { x: 0.74, y: 0.85 }], directionHint: 'Grande diagonale', arrowDirection: 'down-right' },
      { order: 3, points: [{ x: 0.74, y: 0.25 }, { x: 0.74, y: 0.85 }], directionHint: 'Asta destra giù', arrowDirection: 'down' },
      { order: 4, points: [{ x: 0.35, y: 0.14 }, { x: 0.50, y: 0.10 }, { x: 0.65, y: 0.15 }], directionHint: 'Virgulilla ondeggiata in alto', arrowDirection: 'right' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.30, y: 0.45 }, { x: 0.30, y: 0.85 }], directionHint: 'Asta corta', arrowDirection: 'down' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.55 },
          { x: 0.42, y: 0.45 },
          { x: 0.58, y: 0.45 },
          { x: 0.70, y: 0.58 },
          { x: 0.70, y: 0.85 },
        ],
        directionHint: 'Gobba arrotondata a destra',
        arrowDirection: 'right',
      },
      { order: 3, points: [{ x: 0.38, y: 0.30 }, { x: 0.50, y: 0.26 }, { x: 0.62, y: 0.31 }], directionHint: 'Virgulilla', arrowDirection: 'right' },
    ],
  },

  Ç: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.74, y: 0.26 },
          { x: 0.60, y: 0.17 },
          { x: 0.45, y: 0.15 },
          { x: 0.30, y: 0.24 },
          { x: 0.22, y: 0.48 },
          { x: 0.30, y: 0.72 },
          { x: 0.45, y: 0.76 },
          { x: 0.60, y: 0.74 },
          { x: 0.74, y: 0.66 },
        ],
        directionHint: 'Grande curva C',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.50, y: 0.76 }, { x: 0.55, y: 0.85 }, { x: 0.45, y: 0.94 }], directionHint: 'Cediglia sotto', arrowDirection: 'down' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.68, y: 0.48 },
          { x: 0.56, y: 0.43 },
          { x: 0.42, y: 0.42 },
          { x: 0.32, y: 0.50 },
          { x: 0.28, y: 0.60 },
          { x: 0.32, y: 0.72 },
          { x: 0.42, y: 0.76 },
          { x: 0.56, y: 0.74 },
          { x: 0.68, y: 0.68 },
        ],
        directionHint: 'Curva c',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.50, y: 0.76 }, { x: 0.54, y: 0.85 }, { x: 0.46, y: 0.94 }], directionHint: 'Cediglia sotto', arrowDirection: 'down' },
    ],
  },

  É: {
    upper: [
      { order: 1, points: [{ x: 0.28, y: 0.20 }, { x: 0.28, y: 0.85 }], directionHint: 'Asta verticale giù', arrowDirection: 'down' },
      { order: 2, points: [{ x: 0.28, y: 0.20 }, { x: 0.75, y: 0.20 }], directionHint: 'Braccio sopra', arrowDirection: 'right' },
      { order: 3, points: [{ x: 0.28, y: 0.52 }, { x: 0.65, y: 0.52 }], directionHint: 'Braccio al centro', arrowDirection: 'right' },
      { order: 4, points: [{ x: 0.28, y: 0.85 }, { x: 0.75, y: 0.85 }], directionHint: 'Braccio sotto', arrowDirection: 'right' },
      { order: 5, points: [{ x: 0.60, y: 0.06 }, { x: 0.42, y: 0.14 }], directionHint: 'Accento acuto in alto', arrowDirection: 'down-left' },
    ],
    lower: [
      { order: 1, points: [{ x: 0.32, y: 0.60 }, { x: 0.68, y: 0.60 }], directionHint: 'Trattino', arrowDirection: 'right' },
      {
        order: 2,
        points: [
          { x: 0.68, y: 0.60 },
          { x: 0.60, y: 0.44 },
          { x: 0.48, y: 0.40 },
          { x: 0.34, y: 0.48 },
          { x: 0.30, y: 0.63 },
          { x: 0.36, y: 0.78 },
          { x: 0.50, y: 0.85 },
          { x: 0.66, y: 0.80 },
        ],
        directionHint: 'Curva intorno',
        arrowDirection: 'up',
      },
      { order: 3, points: [{ x: 0.58, y: 0.20 }, { x: 0.42, y: 0.30 }], directionHint: 'Accento acuto', arrowDirection: 'down-left' },
    ],
  },

  Ä: {
    upper: [
      { order: 1, points: [{ x: 0.50, y: 0.22 }, { x: 0.22, y: 0.85 }], directionHint: 'Diagonale giù a sinistra', arrowDirection: 'down-left' },
      { order: 2, points: [{ x: 0.50, y: 0.22 }, { x: 0.78, y: 0.85 }], directionHint: 'Diagonale giù a destra', arrowDirection: 'down-right' },
      { order: 3, points: [{ x: 0.32, y: 0.62 }, { x: 0.68, y: 0.62 }], directionHint: 'Trattino al centro', arrowDirection: 'right' },
      { order: 4, points: [{ x: 0.38, y: 0.08 }, { x: 0.38, y: 0.12 }], directionHint: 'Primo puntino', arrowDirection: 'down' },
      { order: 5, points: [{ x: 0.62, y: 0.08 }, { x: 0.62, y: 0.12 }], directionHint: 'Secondo puntino', arrowDirection: 'down' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.65, y: 0.50 },
          { x: 0.52, y: 0.44 },
          { x: 0.38, y: 0.48 },
          { x: 0.32, y: 0.62 },
          { x: 0.36, y: 0.76 },
          { x: 0.50, y: 0.80 },
          { x: 0.65, y: 0.74 },
        ],
        directionHint: 'Cerchio',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.65, y: 0.44 }, { x: 0.65, y: 0.85 }], directionHint: 'Gambo', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.40, y: 0.24 }, { x: 0.40, y: 0.28 }], directionHint: 'Primo puntino', arrowDirection: 'down' },
      { order: 4, points: [{ x: 0.60, y: 0.24 }, { x: 0.60, y: 0.28 }], directionHint: 'Secondo puntino', arrowDirection: 'down' },
    ],
  },

  Ö: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.22 },
          { x: 0.36, y: 0.25 },
          { x: 0.26, y: 0.36 },
          { x: 0.22, y: 0.54 },
          { x: 0.26, y: 0.72 },
          { x: 0.36, y: 0.82 },
          { x: 0.50, y: 0.85 },
          { x: 0.64, y: 0.82 },
          { x: 0.74, y: 0.72 },
          { x: 0.78, y: 0.54 },
          { x: 0.74, y: 0.36 },
          { x: 0.64, y: 0.25 },
          { x: 0.50, y: 0.22 },
        ],
        directionHint: 'Grande cerchio tondo continuo',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.40, y: 0.08 }, { x: 0.40, y: 0.12 }], directionHint: 'Primo puntino', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.60, y: 0.08 }, { x: 0.60, y: 0.12 }], directionHint: 'Secondo puntino', arrowDirection: 'down' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.50, y: 0.45 },
          { x: 0.38, y: 0.48 },
          { x: 0.30, y: 0.56 },
          { x: 0.28, y: 0.65 },
          { x: 0.30, y: 0.74 },
          { x: 0.38, y: 0.82 },
          { x: 0.50, y: 0.85 },
          { x: 0.62, y: 0.82 },
          { x: 0.70, y: 0.74 },
          { x: 0.72, y: 0.65 },
          { x: 0.70, y: 0.56 },
          { x: 0.62, y: 0.48 },
          { x: 0.50, y: 0.45 },
        ],
        directionHint: 'Cerchietto',
        arrowDirection: 'left',
      },
      { order: 2, points: [{ x: 0.40, y: 0.24 }, { x: 0.40, y: 0.28 }], directionHint: 'Puntino sinistro', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.60, y: 0.24 }, { x: 0.60, y: 0.28 }], directionHint: 'Puntino destro', arrowDirection: 'down' },
    ],
  },

  Ü: {
    upper: [
      {
        order: 1,
        points: [
          { x: 0.28, y: 0.24 },
          { x: 0.28, y: 0.62 },
          { x: 0.32, y: 0.74 },
          { x: 0.40, y: 0.83 },
          { x: 0.50, y: 0.85 },
          { x: 0.60, y: 0.83 },
          { x: 0.68, y: 0.74 },
          { x: 0.72, y: 0.62 },
          { x: 0.72, y: 0.24 },
        ],
        directionHint: 'Grande conca tonda giù e su',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.38, y: 0.08 }, { x: 0.38, y: 0.12 }], directionHint: 'Primo puntino', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.62, y: 0.08 }, { x: 0.62, y: 0.12 }], directionHint: 'Secondo puntino', arrowDirection: 'down' },
    ],
    lower: [
      {
        order: 1,
        points: [
          { x: 0.32, y: 0.45 },
          { x: 0.32, y: 0.70 },
          { x: 0.36, y: 0.79 },
          { x: 0.43, y: 0.84 },
          { x: 0.50, y: 0.85 },
          { x: 0.57, y: 0.84 },
          { x: 0.64, y: 0.79 },
          { x: 0.68, y: 0.70 },
          { x: 0.68, y: 0.45 },
        ],
        directionHint: 'Conca',
        arrowDirection: 'down',
      },
      { order: 2, points: [{ x: 0.68, y: 0.45 }, { x: 0.68, y: 0.85 }], directionHint: 'Gambetta', arrowDirection: 'down' },
      { order: 3, points: [{ x: 0.40, y: 0.24 }, { x: 0.40, y: 0.28 }], directionHint: 'Puntino 1', arrowDirection: 'down' },
      { order: 4, points: [{ x: 0.60, y: 0.24 }, { x: 0.60, y: 0.28 }], directionHint: 'Puntino 2', arrowDirection: 'down' },
    ],
  },

  ß: {
    upper: [
      { order: 1, points: [{ x: 0.30, y: 0.85 }, { x: 0.30, y: 0.18 }], directionHint: 'Asta verticale dal basso in alto', arrowDirection: 'up' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.18 },
          { x: 0.52, y: 0.18 },
          { x: 0.68, y: 0.24 },
          { x: 0.68, y: 0.38 },
          { x: 0.56, y: 0.48 },
          { x: 0.40, y: 0.52 },
        ],
        directionHint: 'Prima pancia arrotondata',
        arrowDirection: 'right',
      },
      {
        order: 3,
        points: [
          { x: 0.40, y: 0.52 },
          { x: 0.58, y: 0.54 },
          { x: 0.74, y: 0.66 },
          { x: 0.68, y: 0.79 },
          { x: 0.52, y: 0.85 },
          { x: 0.38, y: 0.85 },
        ],
        directionHint: 'Seconda pancia arrotondata',
        arrowDirection: 'right',
      },
    ],
    lower: [
      { order: 1, points: [{ x: 0.30, y: 0.85 }, { x: 0.30, y: 0.18 }], directionHint: 'Asta verticale in alto', arrowDirection: 'up' },
      {
        order: 2,
        points: [
          { x: 0.30, y: 0.18 },
          { x: 0.52, y: 0.18 },
          { x: 0.68, y: 0.24 },
          { x: 0.68, y: 0.38 },
          { x: 0.56, y: 0.48 },
          { x: 0.40, y: 0.52 },
        ],
        directionHint: 'Prima curva',
        arrowDirection: 'right',
      },
      {
        order: 3,
        points: [
          { x: 0.40, y: 0.52 },
          { x: 0.58, y: 0.54 },
          { x: 0.74, y: 0.66 },
          { x: 0.68, y: 0.79 },
          { x: 0.52, y: 0.85 },
          { x: 0.38, y: 0.85 },
        ],
        directionHint: 'Seconda curva',
        arrowDirection: 'right',
      },
    ],
  },
};
