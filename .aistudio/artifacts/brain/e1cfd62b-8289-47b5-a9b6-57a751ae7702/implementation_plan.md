# Architettura Doppio Canvas & Fix Colorazione Figure

Risoluzione definitiva del problema di colorazione delle figure tramite un'architettura a doppio canvas trasparente sovrapposto, garantendo contorni neri sempre perfetti e colorazione fluida all'interno di lettere e disegni con assistente anti-sbavatura attivo.

### User Review & Critical Decisions

> [!IMPORTANT]
> In base alle scelte confermate nella fase di chiarimento, l'architettura non ridisegnerà più elementi opachi bianchi sul livello del colore. I contorni rimarranno sempre nitidi e sovrapposti, mentre il colore potrà riempire liberamente l'interno delle forme.

- **Decisione Confermata 1**: **Livello contorni separato su canvas trasparente sovrapposto**. I contorni neri non vengono disegnati sullo stesso livello dei pigmenti, ma su un canvas dedicato trasparente posto sopra (`pointer-events-none`), evitando che i riempimenti bianchi del template cancellino il colore del bambino.
- **Decisione Confermata 2**: **Mantenimento dell'assistente intelligente anti-sbavatura**. L'assistente continua a calcolare la maschera di regione chiusa partendo dai bordi scuri del livello contorni, vincolando pennello e secchiello esattamente entro le sagome.

---

### 1. Overview & Core Concept

- **Cosa fa**: Consente ai bambini di colorare sia lo sfondo sia l'interno di tutte le 26 sagome (lettere A-Z, animali, oggetti come Ape, Barca, Cuore) senza che il colore scompaia o venga rimpiazzato dal bianco.
- **Target**: Bambini dai 3 ai 7 anni che utilizzano l'app su tablet o desktop con tocco o mouse.
- **Valore Chiave**: Esperienza di disegno gratificante, priva di frustrazioni, con contorni sempre visibili sopra il colore e protezione dai tratti fuori bordo se l'assistente è attivo.

---

### 2. User Experience & Visual Design

- **Flussi Utente**:
  1. Il bambino seleziona una tavola da colorare (es. "A come Ape").
  2. Il canvas mostra il foglio bianco con i contorni neri nitidi dell'ape e delle lettere "A" e "a".
  3. Il bambino tocca un colore (es. Giallo) e tocca o trascina il dito sull'addome dell'ape o all'interno della lettera: il colore riempie l'area istantaneamente e rimane brillante.
  4. I contorni neri dell'ape rimangono sempre sopra il colore, perfettamente definiti.
  5. Il bambino può usare il secchiello per un riempimento rapido, o il pennello con l'assistente intelligente per dipingere con le dita senza uscire dalle linee.
  6. Le funzioni Annulla, Ripristina, Pulisci e Salva/Stampa continuano a funzionare integrando entrambi i livelli.
- **Visual Identity & Coerenza**:
  - Mantenimento dell'aspetto giocoso e rassicurante di *Alfabeto Magico*.
  - Colori primari vivaci, pulsanti touch-friendly con feedback audio immediato (pop e campanellini).
  - Canvas a risoluzione nativa con rapporto d'aspetto fedele alla scheda stampabile.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisione 1: Separazione Fisica dei Livelli (Color Canvas vs. Outline Canvas)**
  - *Approccio Scelto*: Due elementi `<canvas>` sovrapposti con posizionamento assoluto nello stesso container:
    - `Canvas Inferiore (Color Canvas)`: Riceve i tratti del pennello, il secchiello, la gomma e lo sfondo iniziale bianco.
    - `Canvas Superiore (Outline Canvas)`: Disegna esclusivamente i contorni scuri vettoriali su sfondo trasparente con `pointer-events-none`.
  - *Motivazione*: Elimina alla radice la causa del bug: `coloringTemplates.ts` utilizzava `fillAndStroke` con `ctx.fillStyle = '#FFFFFF'` per coprire linee sovrapposte, cancellando ogni colore sottostante ogni volta che il template veniva ridisegnato sul canvas unico.
  - *Alternative Scartate*: Riscrivere tutti i 26 template per eliminare ogni riempimento bianco (molto rischioso per la sovrapposizione visiva delle figure complesse) oppure usare blend modes complessi (meno performanti su tablet a basse risorse).
- **Decisione 2: Adattamento di `drawColoringTemplate` per Contorni Trasparenti**
  - *Approccio Scelto*: Aggiunta di un parametro opzionale `outlineOnly: boolean` o modalità trasparente in `drawColoringTemplate`, in modo che sul canvas superiore le forme vengano tracciate con `stroke()` mantenendo trasparente l'interno, oppure pre-renderizzando i contorni puri.
  - *Motivazione*: Massima nitidezza dei bordi senza alcun residuo bianco che copra il colore.
- **Decisione 3: Esportazione e Stampa ad Alta Risoluzione**
  - *Approccio Scelto*: Al momento del salvataggio (`handleDownload`) o della stampa, un canvas offscreen invisibile compone in sequenza lo sfondo bianco + i tratti del colore + i contorni neri, producendo un file PNG o PDF completo.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    ColoringScreen Container                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Outline Canvas (Top Layer, z-index: 10)              │  │
│  │  • pointer-events: none                               │  │
│  │  • Contorni scuri nitidi su sfondo trasparente        │  │
│  │  • Usato anche come sorgente per `computeRegionMask`  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Color Canvas (Base Layer, z-index: 1)                │  │
│  │  • Riceve input tocco/mouse                           │  │
│  │  • Conserva i pigmenti (Pennello, Secchiello, Gomma)  │  │
│  │  • Gestisce la cronologia Undo/Redo                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Smart Assist Pipeline (Offscreen Buffers)            │  │
│  │  • Mask Canvas: Calcola flood-fill dai bordi Outline  │  │
│  │  • Temp Stroke Canvas: Traccia linea grezza           │  │
│  │  • Destination-In: Ritaglia tratto entro la sagoma    │  │
│  │  • Source-Over: Applica direttamente a Color Canvas   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Mappatura Interazioni e Stato

1. **Inizializzazione Tavola (`initCanvas`)**:
   - `colorCanvas`: viene riempito di bianco `#FFFFFF`. Lo stato viene salvato nello stack di `history`.
   - `outlineCanvas`: viene pulito e ridisegna i contorni della tavola attiva (`drawPlateOutline`).
2. **Pennello con Smart Assist (`handlePointerMove`)**:
   - `strokeCanvas` registra la linea del pennello.
   - `maskCanvas` contiene la maschera binaria calcolata al `pointerDown` usando `outlineCanvas`.
   - Si applica il ritaglio e si trasferisce il risultato sul `colorCanvas`.
   - I contorni su `outlineCanvas` rimangono intatti e visibili in primo piano senza bisogno di ridisegnare l'intero template ogni frame.
3. **Secchiello Intelligente (`handlePointerDown` con bucket)**:
   - Calcola la regione chiusa a partire dal punto di tocco tramite `computeRegionMask`.
   - Riempie la maschera sul `colorCanvas`.
   - Nessuna interferenza con i contorni.
4. **Annulla / Ripristina (`undo` / `clear`)**:
   - Agisce unicamente sul `colorCanvas`. I contorni sul layer superiore restano sempre stabili e perfetti.
