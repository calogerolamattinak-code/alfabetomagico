/**
 * Educational coloring plate renderer for "Alfabeto Magico".
 * Faithfully reproduces the 26 educational coloring sheets (A-Z)
 * with zero overlapping/intersecting wireframe lines:
 * - Rounded card border
 * - Top outlined UPPERCASE and LOWERCASE letters side-by-side (colorable)
 * - Clean, child-friendly line-art figures with solid fillable regions
 * - Child-friendly caption banner "[Letter] come [Word]"
 */

export function drawColoringTemplate(
  ctx: CanvasRenderingContext2D,
  template: string,
  letterChar: string,
  w: number,
  h: number,
  options?: { transparentFill?: boolean }
) {
  ctx.save();

  const transparent = options?.transparentFill ?? false;
  const charUpper = letterChar.toUpperCase();
  const charLower = letterChar.toLowerCase();

  // 1. Draw outer rounded card border
  ctx.lineWidth = Math.max(3, w * 0.007);
  ctx.strokeStyle = '#64748B';
  if (!transparent) {
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.beginPath();
  const cardPad = w * 0.035;
  const cardRadius = w * 0.05;
  ctx.roundRect(cardPad, cardPad, w - cardPad * 2, h - cardPad * 2, cardRadius);
  if (!transparent) {
    ctx.fill();
  }
  ctx.stroke();

  // 2. Top outlined UPPERCASE and LOWERCASE letters side-by-side
  // Both are outlined in bold dark stroke with white fill (or transparent on overlay) so the child can color them!
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(5, w * 0.016);
  ctx.strokeStyle = '#1E293B';
  if (!transparent) {
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.font = `900 ${Math.round(w * 0.20)}px Fredoka, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Positions: Uppercase on left, Lowercase on right (comfortably positioned at top)
  const upperX = w * 0.32;
  const lowerX = w * 0.68;
  const letterY = h * 0.17;

  // Draw Uppercase
  if (!transparent) {
    ctx.fillText(charUpper, upperX, letterY);
  }
  ctx.strokeText(charUpper, upperX, letterY);

  // Draw Lowercase
  if (!transparent) {
    ctx.fillText(charLower, lowerX, letterY);
  }
  ctx.strokeText(charLower, lowerX, letterY);

  // 3. Middle drawing section styling
  ctx.lineWidth = Math.max(4.5, w * 0.013);
  ctx.strokeStyle = '#1E293B';
  if (!transparent) {
    ctx.fillStyle = '#FFFFFF';
  }

  const strokeColor = '#1E293B';
  const fillColor = '#FFFFFF';

  // Helper for closed shapes: fills with pure white to mask background lines (unless transparent), then strokes with dark outline
  const fillAndStroke = (pathFn: () => void, fill = true) => {
    ctx.beginPath();
    pathFn();
    if (fill && !transparent) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  };

  // Helper star drawer
  const drawStar = (cx: number, cy: number, spikes: number, outerR: number, innerR: number) => {
    fillAndStroke(() => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
    }, true);
  };

  let wordCaption = '';

  // 4. Render specific figure cleanly with NO overlapping wireframe lines
  switch (template) {
    case 'bee': {
      wordCaption = 'A come Ape';

      // 1. Back Wing
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.48, w * 0.065, w * 0.11, -0.35, 0, Math.PI * 2);
      });

      // 2. Stinger
      fillAndStroke(() => {
        ctx.moveTo(w * 0.70, h * 0.65);
        ctx.lineTo(w * 0.77, h * 0.67);
        ctx.lineTo(w * 0.70, h * 0.69);
        ctx.closePath();
      });

      // 3. Legs under body
      ctx.beginPath();
      ctx.moveTo(w * 0.46, h * 0.76);
      ctx.lineTo(w * 0.44, h * 0.83);
      ctx.moveTo(w * 0.54, h * 0.77);
      ctx.lineTo(w * 0.54, h * 0.84);
      ctx.moveTo(w * 0.62, h * 0.76);
      ctx.lineTo(w * 0.63, h * 0.83);
      ctx.stroke();

      // 4. Body Oval
      fillAndStroke(() => {
        ctx.ellipse(w * 0.54, h * 0.67, w * 0.17, w * 0.12, 0, 0, Math.PI * 2);
      });

      // 5. Body Stripes (clipped to body naturally by endpoints)
      ctx.beginPath();
      ctx.moveTo(w * 0.46, h * 0.56);
      ctx.quadraticCurveTo(w * 0.49, h * 0.67, w * 0.46, h * 0.78);
      ctx.moveTo(w * 0.54, h * 0.55);
      ctx.quadraticCurveTo(w * 0.57, h * 0.67, w * 0.54, h * 0.79);
      ctx.moveTo(w * 0.62, h * 0.57);
      ctx.quadraticCurveTo(w * 0.65, h * 0.67, w * 0.62, h * 0.77);
      ctx.stroke();

      // 6. Front Wing (in front of body)
      fillAndStroke(() => {
        ctx.ellipse(w * 0.57, h * 0.50, w * 0.07, w * 0.12, 0.25, 0, Math.PI * 2);
      });
      // Wing inner line
      ctx.beginPath();
      ctx.moveTo(w * 0.57, h * 0.60);
      ctx.quadraticCurveTo(w * 0.59, h * 0.50, w * 0.58, h * 0.40);
      ctx.stroke();

      // 7. Head (drawn in front of body, masking the body line completely!)
      fillAndStroke(() => {
        ctx.arc(w * 0.33, h * 0.67, w * 0.085, 0, Math.PI * 2);
      });

      // 8. Antennae
      ctx.beginPath();
      ctx.moveTo(w * 0.30, h * 0.59);
      ctx.quadraticCurveTo(w * 0.26, h * 0.54, w * 0.27, h * 0.51);
      ctx.moveTo(w * 0.36, h * 0.59);
      ctx.quadraticCurveTo(w * 0.38, h * 0.54, w * 0.39, h * 0.51);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.27, h * 0.51, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.39, h * 0.51, 5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // 9. Face: Eyes & Smile
      ctx.beginPath();
      ctx.arc(w * 0.30, h * 0.66, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.35, h * 0.66, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w * 0.325, h * 0.70, 9, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Rosy cheek
      ctx.beginPath();
      ctx.arc(w * 0.27, h * 0.69, 3, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'boat': {
      wordCaption = 'B come Barca';

      // 1. Sun in sky
      fillAndStroke(() => {
        ctx.arc(w * 0.75, h * 0.46, w * 0.055, 0, Math.PI * 2);
      });
      // Sun rays
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.75 + Math.cos(ang) * w * 0.065, h * 0.46 + Math.sin(ang) * w * 0.065);
        ctx.lineTo(w * 0.75 + Math.cos(ang) * w * 0.095, h * 0.46 + Math.sin(ang) * w * 0.095);
        ctx.stroke();
      }

      // 2. Mast
      fillAndStroke(() => {
        ctx.rect(w * 0.49, h * 0.46, w * 0.02, h * 0.26);
      });

      // 3. Flag at top
      fillAndStroke(() => {
        ctx.moveTo(w * 0.51, h * 0.46);
        ctx.lineTo(w * 0.60, h * 0.49);
        ctx.lineTo(w * 0.51, h * 0.52);
        ctx.closePath();
      });

      // 4. Jib Sail (left)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.47, h * 0.50);
        ctx.lineTo(w * 0.33, h * 0.70);
        ctx.quadraticCurveTo(w * 0.40, h * 0.71, w * 0.47, h * 0.70);
        ctx.closePath();
      });

      // 5. Main Sail (right)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.53, h * 0.48);
        ctx.lineTo(w * 0.68, h * 0.70);
        ctx.quadraticCurveTo(w * 0.60, h * 0.71, w * 0.53, h * 0.70);
        ctx.closePath();
      });

      // 6. Hull (boat body)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.26, h * 0.72);
        ctx.lineTo(w * 0.74, h * 0.72);
        ctx.quadraticCurveTo(w * 0.69, h * 0.83, w * 0.56, h * 0.83);
        ctx.lineTo(w * 0.44, h * 0.83);
        ctx.quadraticCurveTo(w * 0.31, h * 0.83, w * 0.26, h * 0.72);
        ctx.closePath();
      });

      // 7. 3 Portholes inside hull
      [0.38, 0.50, 0.62].forEach((px) => {
        fillAndStroke(() => {
          ctx.arc(w * px, h * 0.77, w * 0.025, 0, Math.PI * 2);
        });
      });

      // 8. Wavy Water lines below boat
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.87);
      for (let wx = 0.18; wx <= 0.82; wx += 0.16) {
        ctx.quadraticCurveTo(w * (wx + 0.04), h * 0.85, w * (wx + 0.08), h * 0.87);
        ctx.quadraticCurveTo(w * (wx + 0.12), h * 0.89, w * (wx + 0.16), h * 0.87);
      }
      ctx.stroke();
      break;
    }

    case 'house': {
      wordCaption = 'C come Casa';

      // 1. Chimney (drawn first, masked by roof)
      fillAndStroke(() => {
        ctx.rect(w * 0.60, h * 0.48, w * 0.07, h * 0.14);
      });
      // Chimney cap
      fillAndStroke(() => {
        ctx.rect(w * 0.58, h * 0.46, w * 0.11, h * 0.025);
      });

      // 2. House walls
      fillAndStroke(() => {
        ctx.rect(w * 0.29, h * 0.62, w * 0.42, h * 0.24);
      });

      // 3. Roof (covers house wall top and chimney base completely!)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.25, h * 0.63);
        ctx.lineTo(w * 0.50, h * 0.47);
        ctx.lineTo(w * 0.75, h * 0.63);
        ctx.closePath();
      });

      // 4. Attic round window
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.56, w * 0.035, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.50, h * 0.525);
      ctx.lineTo(w * 0.50, h * 0.595);
      ctx.moveTo(w * 0.465, h * 0.56);
      ctx.lineTo(w * 0.535, h * 0.56);
      ctx.stroke();

      // 5. Arched Door
      fillAndStroke(() => {
        ctx.moveTo(w * 0.45, h * 0.86);
        ctx.lineTo(w * 0.45, h * 0.75);
        ctx.arc(w * 0.50, h * 0.75, w * 0.05, Math.PI, 0);
        ctx.lineTo(w * 0.55, h * 0.86);
        ctx.closePath();
      });
      // Doorknob
      ctx.beginPath();
      ctx.arc(w * 0.53, h * 0.79, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // 6. Left 4-pane window
      fillAndStroke(() => {
        ctx.rect(w * 0.32, h * 0.66, w * 0.09, w * 0.08);
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.365, h * 0.66);
      ctx.lineTo(w * 0.365, h * 0.66 + w * 0.08);
      ctx.moveTo(w * 0.32, h * 0.66 + w * 0.04);
      ctx.lineTo(w * 0.41, h * 0.66 + w * 0.04);
      ctx.stroke();

      // 7. Right 4-pane window
      fillAndStroke(() => {
        ctx.rect(w * 0.59, h * 0.66, w * 0.09, w * 0.08);
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.635, h * 0.66);
      ctx.lineTo(w * 0.635, h * 0.66 + w * 0.08);
      ctx.moveTo(w * 0.59, h * 0.66 + w * 0.04);
      ctx.lineTo(w * 0.68, h * 0.66 + w * 0.04);
      ctx.stroke();

      // 8. Ground baseline (only outside the house, never through the door!)
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.86);
      ctx.lineTo(w * 0.29, h * 0.86);
      ctx.moveTo(w * 0.71, h * 0.86);
      ctx.lineTo(w * 0.82, h * 0.86);
      ctx.stroke();
      break;
    }

    case 'dice': {
      wordCaption = 'D come Dado';
      const cx = w * 0.50;
      const cy = h * 0.65;
      const r = w * 0.19;

      // Top face
      fillAndStroke(() => {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - r * 0.86, cy - r * 0.5);
        ctx.lineTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.86, cy - r * 0.5);
        ctx.closePath();
      });

      // Front-left face
      fillAndStroke(() => {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - r * 0.86, cy - r * 0.5);
        ctx.lineTo(cx - r * 0.86, cy + r * 0.6);
        ctx.lineTo(cx, cy + r * 1.1);
        ctx.closePath();
      });

      // Front-right face
      fillAndStroke(() => {
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * 0.86, cy - r * 0.5);
        ctx.lineTo(cx + r * 0.86, cy + r * 0.6);
        ctx.lineTo(cx, cy + r * 1.1);
        ctx.closePath();
      });

      // Top face dots (2 dots)
      [
        { x: cx - r * 0.28, y: cy - r * 0.68 },
        { x: cx + r * 0.28, y: cy - r * 0.42 },
      ].forEach((p) => {
        fillAndStroke(() => {
          ctx.arc(p.x, p.y, w * 0.02, 0, Math.PI * 2);
        });
      });

      // Front-left dots (5 dots)
      [
        { x: cx - r * 0.6, y: cy - r * 0.12 },
        { x: cx - r * 0.22, y: cy - r * 0.32 },
        { x: cx - r * 0.42, y: cy + r * 0.25 },
        { x: cx - r * 0.62, y: cy + r * 0.42 },
        { x: cx - r * 0.22, y: cy + r * 0.65 },
      ].forEach((p) => {
        fillAndStroke(() => {
          ctx.arc(p.x, p.y, w * 0.022, 0, Math.PI * 2);
        });
      });

      // Front-right dots (3 dots)
      [
        { x: cx + r * 0.32, y: cy - r * 0.18 },
        { x: cx + r * 0.48, y: cy + r * 0.22 },
        { x: cx + r * 0.64, y: cy + r * 0.52 },
      ].forEach((p) => {
        fillAndStroke(() => {
          ctx.arc(p.x, p.y, w * 0.022, 0, Math.PI * 2);
        });
      });
      break;
    }

    case 'elephant': {
      wordCaption = 'E come Elefante';

      // 1. Far Legs (drawn behind the body)
      fillAndStroke(() => {
        // Far rear leg
        ctx.roundRect(w * 0.64, h * 0.68, w * 0.08, h * 0.16, [0, 0, 10, 10]);
      });
      // Toenails on far rear leg
      [0.655, 0.68, 0.705].forEach((tx) => {
        ctx.beginPath();
        ctx.arc(w * tx, h * 0.84, 4, Math.PI, 0);
        ctx.stroke();
      });

      fillAndStroke(() => {
        // Far front leg
        ctx.roundRect(w * 0.44, h * 0.68, w * 0.08, h * 0.16, [0, 0, 10, 10]);
      });
      // Toenails on far front leg
      [0.455, 0.48, 0.505].forEach((tx) => {
        ctx.beginPath();
        ctx.arc(w * tx, h * 0.84, 4, Math.PI, 0);
        ctx.stroke();
      });

      // 2. Tail with brush tuft at rear
      ctx.beginPath();
      ctx.moveTo(w * 0.73, h * 0.62);
      ctx.quadraticCurveTo(w * 0.79, h * 0.67, w * 0.78, h * 0.75);
      ctx.stroke();
      fillAndStroke(() => {
        ctx.ellipse(w * 0.78, h * 0.76, 5, 8, 0.2, 0, Math.PI * 2);
      });

      // 3. Body + Near Legs: continuous unified silhouette!
      // (Flows smoothly from neck over back, down rear leg, across belly, down front leg, up to chest)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.42, h * 0.55);
        // Back curve to rear rump
        ctx.quadraticCurveTo(w * 0.56, h * 0.51, w * 0.73, h * 0.61);
        // Down rear flank to near rear foot
        ctx.quadraticCurveTo(w * 0.74, h * 0.72, w * 0.72, h * 0.84);
        // Near rear foot bottom
        ctx.lineTo(w * 0.62, h * 0.84);
        // Up inside rear leg to belly
        ctx.quadraticCurveTo(w * 0.63, h * 0.74, w * 0.59, h * 0.73);
        // Across belly to near front leg
        ctx.quadraticCurveTo(w * 0.52, h * 0.74, w * 0.43, h * 0.73);
        // Down near front leg
        ctx.quadraticCurveTo(w * 0.43, h * 0.78, w * 0.43, h * 0.84);
        // Near front foot bottom
        ctx.lineTo(w * 0.33, h * 0.84);
        // Up front leg to chest
        ctx.quadraticCurveTo(w * 0.33, h * 0.72, w * 0.38, h * 0.62);
        // Chest up to neck
        ctx.quadraticCurveTo(w * 0.40, h * 0.57, w * 0.42, h * 0.55);
        ctx.closePath();
      });

      // Toenails on near rear foot
      [0.635, 0.665, 0.695].forEach((tx) => {
        ctx.beginPath();
        ctx.arc(w * tx, h * 0.84, 4.5, Math.PI, 0);
        ctx.stroke();
      });

      // Toenails on near front foot
      [0.345, 0.375, 0.405].forEach((tx) => {
        ctx.beginPath();
        ctx.arc(w * tx, h * 0.84, 4.5, Math.PI, 0);
        ctx.stroke();
      });

      // 4. Head + Trunk (single continuous curved path)
      fillAndStroke(() => {
        // Crown of head
        ctx.moveTo(w * 0.41, h * 0.54);
        // Over top of head to forehead
        ctx.quadraticCurveTo(w * 0.34, h * 0.48, w * 0.28, h * 0.54);
        // Down trunk outer curve
        ctx.quadraticCurveTo(w * 0.23, h * 0.61, w * 0.21, h * 0.69);
        // Trunk tip curling upward
        ctx.quadraticCurveTo(w * 0.19, h * 0.75, w * 0.23, h * 0.77);
        ctx.quadraticCurveTo(w * 0.27, h * 0.78, w * 0.26, h * 0.73);
        // Inside of curled trunk
        ctx.quadraticCurveTo(w * 0.24, h * 0.71, w * 0.26, h * 0.66);
        // Under-trunk back to mouth/chin
        ctx.quadraticCurveTo(w * 0.28, h * 0.62, w * 0.32, h * 0.63);
        // Chin and throat back to neck
        ctx.quadraticCurveTo(w * 0.36, h * 0.66, w * 0.41, h * 0.54);
        ctx.closePath();
      });

      // Trunk wrinkle creases
      ctx.beginPath();
      ctx.moveTo(w * 0.24, h * 0.63);
      ctx.quadraticCurveTo(w * 0.26, h * 0.62, w * 0.28, h * 0.63);
      ctx.moveTo(w * 0.23, h * 0.66);
      ctx.quadraticCurveTo(w * 0.25, h * 0.65, w * 0.27, h * 0.66);
      ctx.stroke();

      // Cute smile under trunk
      ctx.beginPath();
      ctx.arc(w * 0.33, h * 0.63, 5, 0.1, Math.PI - 0.2);
      ctx.stroke();

      // 5. Big Ear (drawn at junction between head and body, masking any seam!)
      fillAndStroke(() => {
        ctx.ellipse(w * 0.42, h * 0.59, w * 0.085, w * 0.12, 0.15, 0, Math.PI * 2);
      });
      // Inner ear flap crease
      ctx.beginPath();
      ctx.ellipse(w * 0.42, h * 0.59, w * 0.05, w * 0.08, 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Eye with shiny pupil dot
      fillAndStroke(() => {
        ctx.arc(w * 0.32, h * 0.56, 6, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.arc(w * 0.32, h * 0.56, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();
      // White reflection dot
      if (!transparent) {
        ctx.beginPath();
        ctx.arc(w * 0.31, h * 0.55, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      // Cute curved eyebrow
      ctx.beginPath();
      ctx.arc(w * 0.32, h * 0.52, 6, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      break;
    }

    case 'flower': {
      wordCaption = 'F come Fiore';
      const cx = w * 0.50;
      const cy = h * 0.58;
      const cr = w * 0.08;

      // 1. Stem
      fillAndStroke(() => {
        ctx.rect(w * 0.485, cy + cr, w * 0.03, h * 0.27);
      });

      // 2. Left Leaf
      fillAndStroke(() => {
        ctx.moveTo(w * 0.485, h * 0.75);
        ctx.quadraticCurveTo(w * 0.35, h * 0.70, w * 0.30, h * 0.72);
        ctx.quadraticCurveTo(w * 0.35, h * 0.79, w * 0.485, h * 0.78);
        ctx.closePath();
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.485, h * 0.765);
      ctx.quadraticCurveTo(w * 0.38, h * 0.73, w * 0.31, h * 0.73);
      ctx.stroke();

      // 3. Right Leaf
      fillAndStroke(() => {
        ctx.moveTo(w * 0.515, h * 0.78);
        ctx.quadraticCurveTo(w * 0.65, h * 0.72, w * 0.70, h * 0.74);
        ctx.quadraticCurveTo(w * 0.65, h * 0.81, w * 0.515, h * 0.81);
        ctx.closePath();
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.515, h * 0.795);
      ctx.quadraticCurveTo(w * 0.62, h * 0.75, w * 0.69, h * 0.75);
      ctx.stroke();

      // 4. 8 Petals (drawn around center)
      const petalDist = w * 0.12;
      const petalR = w * 0.055;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const px = cx + Math.cos(angle) * petalDist;
        const py = cy + Math.sin(angle) * petalDist;
        fillAndStroke(() => {
          ctx.arc(px, py, petalR, 0, Math.PI * 2);
        });
      }

      // 5. Center Circle (drawn ON TOP of petals, masking all inner petal lines!)
      fillAndStroke(() => {
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      });

      // 6. Cute smiling face inside center
      ctx.beginPath();
      ctx.arc(cx - 15, cy - 8, 4.5, 0, Math.PI * 2);
      ctx.arc(cx + 15, cy - 8, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy + 4, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Rosy cheeks
      ctx.beginPath();
      ctx.arc(cx - 22, cy + 5, 4, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy + 5, 4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'cat': {
      wordCaption = 'G come Gatto';

      // 1. Curved Tail (drawn behind body)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.62, h * 0.78);
        ctx.quadraticCurveTo(w * 0.78, h * 0.78, w * 0.76, h * 0.65);
        ctx.quadraticCurveTo(w * 0.70, h * 0.63, w * 0.68, h * 0.70);
        ctx.quadraticCurveTo(w * 0.70, h * 0.74, w * 0.62, h * 0.74);
        ctx.closePath();
      });

      // 2. Seated Body
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.76, w * 0.15, w * 0.12, 0, 0, Math.PI * 2);
      });

      // 3. 2 Front Paws (placed neatly at bottom of body)
      fillAndStroke(() => {
        ctx.ellipse(w * 0.44, h * 0.85, w * 0.045, w * 0.025, 0, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.ellipse(w * 0.56, h * 0.85, w * 0.045, w * 0.025, 0, 0, Math.PI * 2);
      });

      // 4. Ears (attached to top of head)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.38, h * 0.56);
        ctx.lineTo(w * 0.37, h * 0.46);
        ctx.lineTo(w * 0.46, h * 0.52);
        ctx.closePath();
      });
      fillAndStroke(() => {
        ctx.moveTo(w * 0.62, h * 0.56);
        ctx.lineTo(w * 0.63, h * 0.46);
        ctx.lineTo(w * 0.54, h * 0.52);
        ctx.closePath();
      });

      // Inner ear triangles
      ctx.beginPath();
      ctx.moveTo(w * 0.39, h * 0.53);
      ctx.lineTo(w * 0.39, h * 0.48);
      ctx.lineTo(w * 0.44, h * 0.51);
      ctx.moveTo(w * 0.61, h * 0.53);
      ctx.lineTo(w * 0.61, h * 0.48);
      ctx.lineTo(w * 0.56, h * 0.51);
      ctx.stroke();

      // 5. Head (drawn ON TOP of body, masking the body top curve completely!)
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.60, w * 0.12, 0, Math.PI * 2);
      });

      // 6. Eyes (circles with dark pupils)
      fillAndStroke(() => {
        ctx.arc(w * 0.45, h * 0.59, 8, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.55, h * 0.59, 8, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.59, 4, 0, Math.PI * 2);
      ctx.arc(w * 0.55, h * 0.59, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // 7. Cute Triangle Nose
      ctx.beginPath();
      ctx.moveTo(w * 0.48, h * 0.63);
      ctx.lineTo(w * 0.52, h * 0.63);
      ctx.lineTo(w * 0.50, h * 0.655);
      ctx.closePath();
      ctx.fill();

      // 8. W-shaped cat mouth
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.66, 5, 0, Math.PI);
      ctx.arc(w * 0.52, h * 0.66, 5, 0, Math.PI);
      ctx.stroke();

      // 9. Whiskers (radiating outward from cheeks)
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.62);
      ctx.lineTo(w * 0.32, h * 0.61);
      ctx.moveTo(w * 0.42, h * 0.65);
      ctx.lineTo(w * 0.32, h * 0.66);
      ctx.moveTo(w * 0.58, h * 0.62);
      ctx.lineTo(w * 0.68, h * 0.61);
      ctx.moveTo(w * 0.58, h * 0.65);
      ctx.lineTo(w * 0.68, h * 0.66);
      ctx.stroke();
      break;
    }

    case 'hamburger': {
      wordCaption = 'H come Hamburger';

      // 1. Bottom Bun (rounded base)
      fillAndStroke(() => {
        ctx.roundRect(w * 0.30, h * 0.77, w * 0.40, h * 0.08, [4, 4, 24, 24]);
      });

      // 2. Burger Patty (thick rounded rectangle)
      fillAndStroke(() => {
        ctx.roundRect(w * 0.28, h * 0.69, w * 0.44, h * 0.07, 10);
      });

      // 3. Cheese Slice with hanging corners
      fillAndStroke(() => {
        ctx.moveTo(w * 0.29, h * 0.68);
        ctx.lineTo(w * 0.71, h * 0.68);
        ctx.lineTo(w * 0.71, h * 0.71);
        ctx.lineTo(w * 0.64, h * 0.74);
        ctx.lineTo(w * 0.57, h * 0.71);
        ctx.lineTo(w * 0.50, h * 0.74);
        ctx.lineTo(w * 0.43, h * 0.71);
        ctx.lineTo(w * 0.36, h * 0.74);
        ctx.lineTo(w * 0.29, h * 0.71);
        ctx.closePath();
      });

      // 4. Wavy Lettuce Layer
      fillAndStroke(() => {
        ctx.moveTo(w * 0.27, h * 0.64);
        for (let lx = 0.27; lx <= 0.73; lx += 0.057) {
          ctx.quadraticCurveTo(w * (lx + 0.028), h * 0.665, w * (lx + 0.057), h * 0.64);
        }
        ctx.lineTo(w * 0.73, h * 0.61);
        ctx.lineTo(w * 0.27, h * 0.61);
        ctx.closePath();
      });

      // 5. Top Bun Dome
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.59, w * 0.21, Math.PI, 0);
        ctx.lineTo(w * 0.71, h * 0.61);
        ctx.lineTo(w * 0.29, h * 0.61);
        ctx.closePath();
      });

      // 6. Sesame seeds on top bun
      [
        { x: 0.42, y: 0.48 },
        { x: 0.50, y: 0.45 },
        { x: 0.58, y: 0.48 },
        { x: 0.36, y: 0.54 },
        { x: 0.46, y: 0.53 },
        { x: 0.56, y: 0.53 },
        { x: 0.64, y: 0.55 },
      ].forEach((s) => {
        fillAndStroke(() => {
          ctx.ellipse(w * s.x, h * s.y, 4, 2.5, 0.3, 0, Math.PI * 2);
        });
      });
      break;
    }

    case 'island': {
      wordCaption = 'I come Isola';

      // 1. Sun in sky
      fillAndStroke(() => {
        ctx.arc(w * 0.75, h * 0.44, w * 0.05, 0, Math.PI * 2);
      });
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.75 + Math.cos(ang) * w * 0.06, h * 0.44 + Math.sin(ang) * w * 0.06);
        ctx.lineTo(w * 0.75 + Math.cos(ang) * w * 0.085, h * 0.44 + Math.sin(ang) * w * 0.085);
        ctx.stroke();
      }

      // 2. Sea Waves
      ctx.beginPath();
      ctx.moveTo(w * 0.16, h * 0.83);
      for (let sx = 0.16; sx <= 0.84; sx += 0.14) {
        ctx.quadraticCurveTo(w * (sx + 0.035), h * 0.81, w * (sx + 0.07), h * 0.83);
        ctx.quadraticCurveTo(w * (sx + 0.105), h * 0.85, w * (sx + 0.14), h * 0.83);
      }
      ctx.stroke();

      // 3. Island Sand Mound (clean closed hill)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.25, h * 0.83);
        ctx.quadraticCurveTo(w * 0.50, h * 0.72, w * 0.75, h * 0.83);
        ctx.closePath();
      });

      // 4. Palm Trunk (slender curved trunk)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.48, h * 0.75);
        ctx.quadraticCurveTo(w * 0.51, h * 0.65, w * 0.50, h * 0.54);
        ctx.lineTo(w * 0.54, h * 0.54);
        ctx.quadraticCurveTo(w * 0.55, h * 0.65, w * 0.52, h * 0.75);
        ctx.closePath();
      });
      // Bark ridges
      [0.60, 0.65, 0.70].forEach((ry) => {
        ctx.beginPath();
        ctx.moveTo(w * 0.49, h * ry);
        ctx.lineTo(w * 0.53, h * ry);
        ctx.stroke();
      });

      // 5. 5 Palm Fronds (leaves)
      const fronds = [
        { cpx: 0.36, cpy: 0.47, ex: 0.32, ey: 0.52 },
        { cpx: 0.38, cpy: 0.42, ex: 0.41, ey: 0.47 },
        { cpx: 0.52, cpy: 0.38, ex: 0.60, ey: 0.45 },
        { cpx: 0.64, cpy: 0.42, ex: 0.68, ey: 0.49 },
        { cpx: 0.68, cpy: 0.50, ex: 0.71, ey: 0.55 },
      ];
      fronds.forEach((f) => {
        fillAndStroke(() => {
          ctx.moveTo(w * 0.52, h * 0.54);
          ctx.quadraticCurveTo(w * f.cpx, h * f.cpy, w * f.ex, h * f.ey);
          ctx.quadraticCurveTo(w * f.cpx, h * (f.cpy + 0.05), w * 0.52, h * 0.54);
          ctx.closePath();
        });
      });

      // 6. Coconuts under fronds
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.55, 6, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.55, h * 0.55, 6, 0, Math.PI * 2);
      });
      break;
    }

    case 'jet': {
      wordCaption = 'J come Jet';

      // 1. Clouds in sky (continuous arc silhouette, NO intersecting internal circles!)
      const drawFluffyCloud = (cx: number, cy: number, scale: number) => {
        fillAndStroke(() => {
          ctx.arc(w * (cx + 0.03 * scale), h * cy, w * 0.035 * scale, Math.PI * 0.8, Math.PI * 1.8);
          ctx.arc(w * (cx + 0.07 * scale), h * (cy - 0.015 * scale), w * 0.045 * scale, Math.PI * 1.1, Math.PI * 1.9);
          ctx.arc(w * (cx + 0.11 * scale), h * cy, w * 0.035 * scale, Math.PI * 1.3, Math.PI * 0.2);
          ctx.quadraticCurveTo(w * (cx + 0.07 * scale), h * (cy + 0.035 * scale), w * (cx + 0.03 * scale), h * cy);
          ctx.closePath();
        });
      };
      drawFluffyCloud(0.20, 0.46, 1.0);
      drawFluffyCloud(0.64, 0.48, 0.8);

      // 2. Tail Fin (drawn first, attached cleanly at rear)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.24, h * 0.65);
        ctx.lineTo(w * 0.25, h * 0.53);
        ctx.lineTo(w * 0.33, h * 0.53);
        ctx.lineTo(w * 0.38, h * 0.65);
        ctx.closePath();
      });

      // 3. Airplane Fuselage (streamlined body)
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.67, w * 0.27, w * 0.08, 0, 0, Math.PI * 2);
      });

      // 4. Cockpit window at front
      fillAndStroke(() => {
        ctx.moveTo(w * 0.66, h * 0.64);
        ctx.quadraticCurveTo(w * 0.73, h * 0.66, w * 0.74, h * 0.68);
        ctx.lineTo(w * 0.66, h * 0.68);
        ctx.closePath();
      });

      // 5. 4 Passenger Windows
      [0.37, 0.44, 0.51, 0.58].forEach((wx) => {
        fillAndStroke(() => {
          ctx.arc(w * wx, h * 0.67, w * 0.018, 0, Math.PI * 2);
        });
      });

      // 6. Wing extending down
      fillAndStroke(() => {
        ctx.moveTo(w * 0.46, h * 0.71);
        ctx.lineTo(w * 0.42, h * 0.81);
        ctx.lineTo(w * 0.56, h * 0.81);
        ctx.lineTo(w * 0.58, h * 0.71);
        ctx.closePath();
      });

      // 7. Turbine engine pod
      fillAndStroke(() => {
        ctx.ellipse(w * 0.47, h * 0.79, w * 0.05, w * 0.02, 0, 0, Math.PI * 2);
      });
      break;
    }

    case 'koala': {
      wordCaption = 'K come Koala';

      // 1. Two Big Fuzzy Ears (drawn behind head)
      fillAndStroke(() => {
        ctx.arc(w * 0.34, h * 0.54, w * 0.08, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.66, h * 0.54, w * 0.08, 0, Math.PI * 2);
      });
      // Inner ear arcs
      ctx.beginPath();
      ctx.arc(w * 0.34, h * 0.54, w * 0.045, 0, Math.PI * 2);
      ctx.arc(w * 0.66, h * 0.54, w * 0.045, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Koala Head (drawn in front of ears, masking inner ear lines!)
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.60, w * 0.13, 0, Math.PI * 2);
      });

      // 3. Koala Face: Big Oval Nose & Eyes
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.62, w * 0.045, w * 0.065, 0, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.arc(w * 0.43, h * 0.57, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.57, h * 0.57, 5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.69, 8, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // 4. Tummy / Body behind branch
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.77, w * 0.12, w * 0.08, 0, 0, Math.PI * 2);
      });

      // 5. Bamboo branch (horizontal rounded log)
      fillAndStroke(() => {
        ctx.roundRect(w * 0.18, h * 0.78, w * 0.64, w * 0.05, 8);
      });
      // Bamboo branch leaves
      fillAndStroke(() => {
        ctx.ellipse(w * 0.24, h * 0.76, w * 0.05, w * 0.02, -0.4, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.ellipse(w * 0.76, h * 0.76, w * 0.05, w * 0.02, -0.4, 0, Math.PI * 2);
      });

      // 6. 2 Paws hugging the branch (drawn in front of branch!)
      fillAndStroke(() => {
        ctx.arc(w * 0.42, h * 0.79, w * 0.035, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.58, h * 0.79, w * 0.035, 0, Math.PI * 2);
      });
      break;
    }

    case 'moon': {
      wordCaption = 'L come Luna';

      // 1. Clean continuous Crescent Moon contour
      fillAndStroke(() => {
        ctx.arc(w * 0.46, h * 0.64, w * 0.18, 0.75, Math.PI * 1.25);
        ctx.quadraticCurveTo(w * 0.56, h * 0.64, w * 0.58, h * 0.48);
        ctx.quadraticCurveTo(w * 0.38, h * 0.64, w * 0.58, h * 0.80);
        ctx.closePath();
      });

      // 2. Sleeping sweet face on moon
      ctx.beginPath();
      // Closed eye with eyelashes
      ctx.arc(w * 0.42, h * 0.60, 7, 0.2, Math.PI - 0.2);
      ctx.moveTo(w * 0.39, h * 0.63);
      ctx.lineTo(w * 0.38, h * 0.66);
      ctx.moveTo(w * 0.45, h * 0.63);
      ctx.lineTo(w * 0.46, h * 0.66);
      // Gentle smile
      ctx.moveTo(w * 0.45, h * 0.68);
      ctx.quadraticCurveTo(w * 0.47, h * 0.71, w * 0.44, h * 0.73);
      ctx.stroke();

      // Rosy cheek
      ctx.beginPath();
      ctx.arc(w * 0.41, h * 0.68, 4, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Stars around in night sky
      drawStar(w * 0.68, h * 0.48, 5, w * 0.055, w * 0.025);
      drawStar(w * 0.75, h * 0.64, 5, w * 0.045, w * 0.020);
      drawStar(w * 0.66, h * 0.78, 5, w * 0.040, w * 0.018);
      break;
    }

    case 'apple': {
      wordCaption = 'M come Mela';

      // 1. Stem (drawn first)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.49, h * 0.54);
        ctx.quadraticCurveTo(w * 0.49, h * 0.45, w * 0.54, h * 0.43);
        ctx.lineTo(w * 0.56, h * 0.43);
        ctx.quadraticCurveTo(w * 0.52, h * 0.46, w * 0.52, h * 0.54);
        ctx.closePath();
      });

      // 2. Leaf attached to stem
      fillAndStroke(() => {
        ctx.ellipse(w * 0.61, h * 0.46, w * 0.08, w * 0.038, -0.4, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.54, h * 0.45);
      ctx.quadraticCurveTo(w * 0.61, h * 0.46, w * 0.68, h * 0.48);
      ctx.stroke();

      // 3. Apple Body (drawn in front of stem base)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.50, h * 0.54);
        ctx.bezierCurveTo(w * 0.32, h * 0.48, w * 0.22, h * 0.62, w * 0.28, h * 0.74);
        ctx.bezierCurveTo(w * 0.32, h * 0.83, w * 0.46, h * 0.83, w * 0.50, h * 0.79);
        ctx.bezierCurveTo(w * 0.54, h * 0.83, w * 0.68, h * 0.83, w * 0.72, h * 0.74);
        ctx.bezierCurveTo(w * 0.78, h * 0.62, w * 0.68, h * 0.48, w * 0.50, h * 0.54);
        ctx.closePath();
      });

      // 4. Shine reflection mark
      ctx.beginPath();
      ctx.arc(w * 0.36, h * 0.65, w * 0.045, 2.8, 4.2);
      ctx.stroke();
      break;
    }

    case 'cloud': {
      wordCaption = 'N come Nuvola';

      // 1. Cloud Contour (single seamless fluffy contour of 5 connecting arcs!)
      fillAndStroke(() => {
        ctx.arc(w * 0.34, h * 0.58, w * 0.08, Math.PI * 0.7, Math.PI * 1.7);
        ctx.arc(w * 0.50, h * 0.52, w * 0.11, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(w * 0.66, h * 0.58, w * 0.08, Math.PI * 1.3, Math.PI * 0.3);
        ctx.arc(w * 0.60, h * 0.68, w * 0.07, Math.PI * 0.0, Math.PI * 0.7);
        ctx.arc(w * 0.40, h * 0.68, w * 0.07, Math.PI * 0.3, Math.PI * 1.0);
        ctx.closePath();
      });

      // 2. Smiling Face inside cloud
      ctx.beginPath();
      ctx.arc(w * 0.44, h * 0.58, 5, 0, Math.PI * 2);
      ctx.arc(w * 0.56, h * 0.58, 5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.62, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Rosy cheeks
      ctx.beginPath();
      ctx.arc(w * 0.38, h * 0.62, 3.5, 0, Math.PI * 2);
      ctx.arc(w * 0.62, h * 0.62, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Raindrops below
      const topDrops = [0.35, 0.45, 0.55, 0.65];
      topDrops.forEach((dx) => {
        fillAndStroke(() => {
          ctx.ellipse(w * dx, h * 0.78, 4.5, 9, -0.2, 0, Math.PI * 2);
        });
      });

      const btmDrops = [0.40, 0.50, 0.60];
      btmDrops.forEach((dx) => {
        fillAndStroke(() => {
          ctx.ellipse(w * dx, h * 0.85, 4.5, 9, -0.2, 0, Math.PI * 2);
        });
      });
      break;
    }

    case 'umbrella': {
      wordCaption = 'O come Ombrello';

      // 1. Top ferrule tip
      fillAndStroke(() => {
        ctx.rect(w * 0.49, h * 0.38, w * 0.02, h * 0.04);
      });

      // 2. Umbrella Canopy (dome with 4 bottom scalloped curves)
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.56, w * 0.22, Math.PI, 0);
        for (let s = 4; s >= 1; s--) {
          const x1 = w * (0.28 + (s - 1) * 0.11);
          const x2 = w * (0.28 + s * 0.11);
          ctx.quadraticCurveTo((x1 + x2) / 2, h * 0.53, x1, h * 0.56);
        }
        ctx.closePath();
      });

      // Rib lines on canopy
      ctx.beginPath();
      ctx.moveTo(w * 0.50, h * 0.34);
      ctx.quadraticCurveTo(w * 0.45, h * 0.45, w * 0.39, h * 0.56);
      ctx.moveTo(w * 0.50, h * 0.34);
      ctx.quadraticCurveTo(w * 0.55, h * 0.45, w * 0.61, h * 0.56);
      ctx.stroke();

      // 3. Shaft & J-Handle (starts from bottom edge of canopy, does NOT cross the top dome!)
      fillAndStroke(() => {
        ctx.rect(w * 0.49, h * 0.56, w * 0.02, h * 0.22);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.44, h * 0.78, w * 0.06, 0, Math.PI);
      }, false);

      // 4. Raindrops around
      [
        { x: 0.24, y: 0.66 },
        { x: 0.76, y: 0.64 },
        { x: 0.68, y: 0.76 },
      ].forEach((dp) => {
        fillAndStroke(() => {
          ctx.ellipse(w * dp.x, h * dp.y, 4, 8, 0, 0, Math.PI * 2);
        });
      });
      break;
    }

    case 'fish': {
      wordCaption = 'P come Pesce';

      // 1. Triangular Tail Fin (drawn first)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.66, h * 0.65);
        ctx.lineTo(w * 0.78, h * 0.54);
        ctx.lineTo(w * 0.78, h * 0.76);
        ctx.closePath();
      });

      // 2. Dorsal Fin (top)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.44, h * 0.54);
        ctx.quadraticCurveTo(w * 0.52, h * 0.48, w * 0.58, h * 0.56);
        ctx.closePath();
      });

      // 3. Pelvic Fin (bottom)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.46, h * 0.76);
        ctx.quadraticCurveTo(w * 0.52, h * 0.82, w * 0.56, h * 0.75);
        ctx.closePath();
      });

      // 4. Fish Body (drawn ON TOP of fins, masking the inner fin lines!)
      fillAndStroke(() => {
        ctx.ellipse(w * 0.48, h * 0.65, w * 0.20, w * 0.13, 0, 0, Math.PI * 2);
      });

      // 5. Gill Line
      ctx.beginPath();
      ctx.arc(w * 0.40, h * 0.65, w * 0.11, -0.7, 0.7);
      ctx.stroke();

      // 6. Eye with shiny pupil
      fillAndStroke(() => {
        ctx.arc(w * 0.36, h * 0.62, 8, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.arc(w * 0.36, h * 0.62, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // 7. Smiling Mouth
      ctx.beginPath();
      ctx.arc(w * 0.30, h * 0.67, 6, 0, Math.PI);
      ctx.stroke();

      // 8. Scales (2 rows of wave scallops)
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.62, 7, 0, Math.PI);
      ctx.arc(w * 0.54, h * 0.62, 7, 0, Math.PI);
      ctx.arc(w * 0.46, h * 0.68, 7, 0, Math.PI);
      ctx.arc(w * 0.52, h * 0.68, 7, 0, Math.PI);
      ctx.stroke();

      // 9. Water bubbles rising
      [
        { x: 0.25, y: 0.53, r: 6 },
        { x: 0.22, y: 0.59, r: 8 },
        { x: 0.18, y: 0.55, r: 4.5 },
      ].forEach((b) => {
        fillAndStroke(() => {
          ctx.arc(w * b.x, h * b.y, b.r, 0, Math.PI * 2);
        });
      });
      break;
    }

    case 'clover': {
      wordCaption = 'Q come Quadrifoglio';
      const cx = w * 0.50;
      const cy = h * 0.62;

      // 1. Stem curving down
      fillAndStroke(() => {
        ctx.moveTo(w * 0.49, cy);
        ctx.quadraticCurveTo(w * 0.50, h * 0.78, w * 0.56, h * 0.84);
        ctx.lineTo(w * 0.58, h * 0.84);
        ctx.quadraticCurveTo(w * 0.52, h * 0.78, w * 0.51, cy);
        ctx.closePath();
      });

      // 2. 4 Heart-shaped lobes (at 0, 90, 180, 270 deg)
      const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
      angles.forEach((ang) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        fillAndStroke(() => {
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-w * 0.10, -w * 0.05, -w * 0.10, -w * 0.16, 0, -w * 0.12);
          ctx.bezierCurveTo(w * 0.10, -w * 0.16, w * 0.10, -w * 0.05, 0, 0);
          ctx.closePath();
        });
        // Center vein
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -w * 0.10);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Center small node
      fillAndStroke(() => {
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      });
      break;
    }

    case 'rocket': {
      wordCaption = 'R come Razzo';

      // 1. Stars in space
      drawStar(w * 0.24, h * 0.48, 5, w * 0.045, w * 0.020);
      drawStar(w * 0.76, h * 0.50, 5, w * 0.045, w * 0.020);
      drawStar(w * 0.22, h * 0.64, 5, w * 0.035, w * 0.016);

      // 2. Left Booster Fin
      fillAndStroke(() => {
        ctx.moveTo(w * 0.37, h * 0.65);
        ctx.lineTo(w * 0.26, h * 0.76);
        ctx.lineTo(w * 0.37, h * 0.78);
        ctx.closePath();
      });

      // 3. Right Booster Fin
      fillAndStroke(() => {
        ctx.moveTo(w * 0.63, h * 0.65);
        ctx.lineTo(w * 0.74, h * 0.76);
        ctx.lineTo(w * 0.63, h * 0.78);
        ctx.closePath();
      });

      // 4. Flame underneath rocket
      fillAndStroke(() => {
        ctx.moveTo(w * 0.43, h * 0.75);
        ctx.lineTo(w * 0.50, h * 0.86);
        ctx.lineTo(w * 0.57, h * 0.75);
        ctx.closePath();
      });
      // Inner flame
      fillAndStroke(() => {
        ctx.moveTo(w * 0.46, h * 0.75);
        ctx.lineTo(w * 0.50, h * 0.81);
        ctx.lineTo(w * 0.54, h * 0.75);
        ctx.closePath();
      });

      // 5. Rocket Fuselage (aerodynamic pointed body)
      fillAndStroke(() => {
        ctx.moveTo(w * 0.50, h * 0.44);
        ctx.quadraticCurveTo(w * 0.36, h * 0.58, w * 0.37, h * 0.75);
        ctx.lineTo(w * 0.63, h * 0.75);
        ctx.quadraticCurveTo(w * 0.64, h * 0.58, w * 0.50, h * 0.44);
        ctx.closePath();
      });

      // 6. Porthole window with outer rim
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.59, w * 0.065, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.59, w * 0.042, 0, Math.PI * 2);
      });

      // 7. Base band stripe
      fillAndStroke(() => {
        ctx.rect(w * 0.37, h * 0.71, w * 0.26, h * 0.04);
      });
      break;
    }

    case 'sun': {
      wordCaption = 'S come Sole';
      const scx = w * 0.50;
      const scy = h * 0.63;
      const sr = w * 0.13;

      // 1. 16 Triangular Rays (drawn FIRST so ray bases are masked by the face circle!)
      const rays = 16;
      for (let i = 0; i < rays; i++) {
        const midA = (i * 2 * Math.PI) / rays;
        const wA1 = midA - 0.10;
        const wA2 = midA + 0.10;
        const rBase = sr + w * 0.01;
        const rTip = sr + w * 0.085;

        fillAndStroke(() => {
          ctx.moveTo(scx + Math.cos(wA1) * rBase, scy + Math.sin(wA1) * rBase);
          ctx.lineTo(scx + Math.cos(midA) * rTip, scy + Math.sin(midA) * rTip);
          ctx.lineTo(scx + Math.cos(wA2) * rBase, scy + Math.sin(wA2) * rBase);
          ctx.closePath();
        });
      }

      // 2. Sun Face Circle (drawn ON TOP of rays, masking all inner ray bases completely!)
      fillAndStroke(() => {
        ctx.arc(scx, scy, sr, 0, Math.PI * 2);
      });

      // 3. Cute smiling face
      ctx.beginPath();
      ctx.arc(scx - sr * 0.35, scy - sr * 0.15, 5, 0, Math.PI * 2);
      ctx.arc(scx + sr * 0.35, scy - sr * 0.15, 5, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(scx, scy + sr * 0.1, sr * 0.5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Rosy cheeks
      ctx.beginPath();
      ctx.arc(scx - sr * 0.45, scy + sr * 0.2, 5, 0, Math.PI * 2);
      ctx.arc(scx + sr * 0.45, scy + sr * 0.2, 5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'train': {
      wordCaption = 'T come Treno';

      // 1. Smokestack at front
      fillAndStroke(() => {
        ctx.moveTo(w * 0.31, h * 0.63);
        ctx.lineTo(w * 0.31, h * 0.57);
        ctx.lineTo(w * 0.29, h * 0.54);
        ctx.lineTo(w * 0.38, h * 0.54);
        ctx.lineTo(w * 0.36, h * 0.57);
        ctx.lineTo(w * 0.36, h * 0.63);
        ctx.closePath();
      });

      // Smoke puffs rising from stack
      [
        { x: 0.34, y: 0.50, r: 0.022 },
        { x: 0.32, y: 0.45, r: 0.028 },
        { x: 0.35, y: 0.40, r: 0.035 },
      ].forEach((sm) => {
        fillAndStroke(() => {
          ctx.arc(w * sm.x, h * sm.y, w * sm.r, 0, Math.PI * 2);
        });
      });

      // 2. Locomotive Body + Cab
      fillAndStroke(() => {
        ctx.rect(w * 0.27, h * 0.63, w * 0.25, h * 0.15);
      });
      fillAndStroke(() => {
        ctx.rect(w * 0.52, h * 0.56, w * 0.15, h * 0.22);
      });
      // Cab roof overhang
      fillAndStroke(() => {
        ctx.rect(w * 0.50, h * 0.54, w * 0.19, h * 0.025);
      });
      // Cab window
      fillAndStroke(() => {
        ctx.rect(w * 0.55, h * 0.60, w * 0.08, w * 0.07);
      });

      // 3. Cowcatcher at front
      fillAndStroke(() => {
        ctx.moveTo(w * 0.27, h * 0.74);
        ctx.lineTo(w * 0.20, h * 0.80);
        ctx.lineTo(w * 0.27, h * 0.80);
        ctx.closePath();
      });

      // 4. Wheels under chassis
      [0.30, 0.41, 0.53, 0.63].forEach((wx) => {
        fillAndStroke(() => {
          ctx.arc(w * wx, h * 0.80, w * 0.045, 0, Math.PI * 2);
        });
        fillAndStroke(() => {
          ctx.arc(w * wx, h * 0.80, w * 0.022, 0, Math.PI * 2);
        });
      });

      // 5. Track line below wheels
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.85);
      ctx.lineTo(w * 0.82, h * 0.85);
      ctx.stroke();
      break;
    }

    case 'grapes': {
      wordCaption = 'U come Uva';

      // 1. Vine Stem at top with curly tendril
      fillAndStroke(() => {
        ctx.moveTo(w * 0.49, h * 0.54);
        ctx.lineTo(w * 0.49, h * 0.46);
        ctx.lineTo(w * 0.55, h * 0.44);
        ctx.lineTo(w * 0.55, h * 0.46);
        ctx.lineTo(w * 0.51, h * 0.48);
        ctx.lineTo(w * 0.51, h * 0.54);
        ctx.closePath();
      });

      // 2. Grape Leaf pointing right
      fillAndStroke(() => {
        ctx.ellipse(w * 0.62, h * 0.47, w * 0.08, w * 0.038, -0.3, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.moveTo(w * 0.55, h * 0.46);
      ctx.quadraticCurveTo(w * 0.62, h * 0.47, w * 0.69, h * 0.49);
      ctx.stroke();

      // 3. Grapes in triangular cluster, drawn row by row with white fill
      // Each grape cleanly occludes the ones behind it with NO intersecting wireframe lines!
      const grapeR = w * 0.052;
      const grapeRows = [
        // Row 1 (top row, 4 grapes)
        [
          { x: 0.34, y: 0.57 },
          { x: 0.45, y: 0.57 },
          { x: 0.55, y: 0.57 },
          { x: 0.66, y: 0.57 },
        ],
        // Row 2 (3 grapes)
        [
          { x: 0.39, y: 0.65 },
          { x: 0.50, y: 0.65 },
          { x: 0.61, y: 0.65 },
        ],
        // Row 3 (2 grapes)
        [
          { x: 0.44, y: 0.73 },
          { x: 0.56, y: 0.73 },
        ],
        // Row 4 (1 grape tip)
        [
          { x: 0.50, y: 0.81 },
        ],
      ];

      grapeRows.forEach((row) => {
        row.forEach((g) => {
          fillAndStroke(() => {
            ctx.arc(w * g.x, h * g.y, grapeR, 0, Math.PI * 2);
          });
        });
      });
      break;
    }

    case 'suitcase': {
      wordCaption = 'V come Valigia';

      // 1. Handle on top (drawn behind body)
      fillAndStroke(() => {
        ctx.roundRect(w * 0.42, h * 0.53, w * 0.16, h * 0.06, [8, 8, 0, 0]);
      });

      // 2. Wheels at bottom (drawn behind body)
      fillAndStroke(() => {
        ctx.arc(w * 0.35, h * 0.82, w * 0.025, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.65, h * 0.82, w * 0.025, 0, Math.PI * 2);
      });

      // 3. Main Suitcase Body
      fillAndStroke(() => {
        ctx.roundRect(w * 0.27, h * 0.58, w * 0.46, h * 0.24, 16);
      });

      // 4. 2 Vertical Straps
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.58);
      ctx.lineTo(w * 0.38, h * 0.82);
      ctx.moveTo(w * 0.62, h * 0.58);
      ctx.lineTo(w * 0.62, h * 0.82);
      ctx.stroke();

      // 5. Center latch
      fillAndStroke(() => {
        ctx.roundRect(w * 0.46, h * 0.65, w * 0.08, w * 0.055, 6);
      });
      ctx.beginPath();
      ctx.arc(w * 0.50, h * 0.678, 4, 0, Math.PI * 2);
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // 6. Stickers on suitcase
      drawStar(w * 0.33, h * 0.74, 5, w * 0.040, w * 0.018);
      fillAndStroke(() => {
        ctx.arc(w * 0.67, h * 0.74, w * 0.035, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.67, h * 0.74, w * 0.018, 0, Math.PI * 2);
      });
      break;
    }

    case 'wigwam': {
      wordCaption = 'W come Wigwam';

      // 1. Sun in sky
      fillAndStroke(() => {
        ctx.arc(w * 0.75, h * 0.46, w * 0.05, 0, Math.PI * 2);
      });
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.75 + Math.cos(ang) * w * 0.06, h * 0.46 + Math.sin(ang) * w * 0.06);
        ctx.lineTo(w * 0.75 + Math.cos(ang) * w * 0.085, h * 0.46 + Math.sin(ang) * w * 0.085);
        ctx.stroke();
      }

      // 2. Crossing poles at apex
      ctx.beginPath();
      ctx.moveTo(w * 0.43, h * 0.42);
      ctx.lineTo(w * 0.50, h * 0.49);
      ctx.moveTo(w * 0.57, h * 0.42);
      ctx.lineTo(w * 0.50, h * 0.49);
      ctx.stroke();

      // 3. Triangular Tepee Tent Canvas
      fillAndStroke(() => {
        ctx.moveTo(w * 0.50, h * 0.49);
        ctx.lineTo(w * 0.28, h * 0.81);
        ctx.lineTo(w * 0.72, h * 0.81);
        ctx.closePath();
      });

      // 4. Doorway flap
      fillAndStroke(() => {
        ctx.moveTo(w * 0.50, h * 0.63);
        ctx.lineTo(w * 0.42, h * 0.81);
        ctx.lineTo(w * 0.58, h * 0.81);
        ctx.closePath();
      });

      // 5. Zigzag decoration on sides
      ctx.beginPath();
      ctx.moveTo(w * 0.36, h * 0.72);
      ctx.lineTo(w * 0.41, h * 0.68);
      ctx.lineTo(w * 0.44, h * 0.71);
      ctx.moveTo(w * 0.56, h * 0.71);
      ctx.lineTo(w * 0.59, h * 0.68);
      ctx.lineTo(w * 0.64, h * 0.72);
      ctx.stroke();

      // 6. Ground baseline outside tent
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.81);
      ctx.lineTo(w * 0.28, h * 0.81);
      ctx.moveTo(w * 0.72, h * 0.81);
      ctx.lineTo(w * 0.82, h * 0.81);
      ctx.stroke();
      break;
    }

    case 'xylophone': {
      wordCaption = 'X come Xilofono';

      // 1. Crossed mallets placed neatly above xylophone
      fillAndStroke(() => {
        ctx.moveTo(w * 0.26, h * 0.42);
        ctx.lineTo(w * 0.48, h * 0.52);
      }, false);
      fillAndStroke(() => {
        ctx.moveTo(w * 0.74, h * 0.42);
        ctx.lineTo(w * 0.52, h * 0.52);
      }, false);
      fillAndStroke(() => {
        ctx.arc(w * 0.48, h * 0.52, w * 0.028, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.arc(w * 0.52, h * 0.52, w * 0.028, 0, Math.PI * 2);
      });

      // 2. 2 Side Support Rails
      fillAndStroke(() => {
        ctx.moveTo(w * 0.27, h * 0.56);
        ctx.lineTo(w * 0.33, h * 0.83);
        ctx.lineTo(w * 0.36, h * 0.83);
        ctx.lineTo(w * 0.30, h * 0.56);
        ctx.closePath();
      });
      fillAndStroke(() => {
        ctx.moveTo(w * 0.73, h * 0.56);
        ctx.lineTo(w * 0.67, h * 0.83);
        ctx.lineTo(w * 0.64, h * 0.83);
        ctx.lineTo(w * 0.70, h * 0.56);
        ctx.closePath();
      });

      // 3. 7 Wooden sound bars (decreasing width, drawn OVER rails)
      for (let i = 0; i < 7; i++) {
        const by = h * (0.56 + i * 0.038);
        const bw = w * (0.46 - i * 0.034);
        fillAndStroke(() => {
          ctx.roundRect(w * 0.50 - bw / 2, by, bw, h * 0.030, 6);
        });
        // 2 screw peg dots on each bar
        fillAndStroke(() => {
          ctx.arc(w * 0.50 - bw * 0.35, by + h * 0.015, 2.5, 0, Math.PI * 2);
        });
        fillAndStroke(() => {
          ctx.arc(w * 0.50 + bw * 0.35, by + h * 0.015, 2.5, 0, Math.PI * 2);
        });
      }
      break;
    }

    case 'yoyo': {
      wordCaption = 'Y come Yo-yo';
      const yx = w * 0.50;
      const yy = h * 0.67;
      const yr = w * 0.16;

      // 1. Finger loop at top
      fillAndStroke(() => {
        ctx.ellipse(w * 0.50, h * 0.44, w * 0.045, w * 0.022, 0, 0, Math.PI * 2);
      });

      // 2. Wavy string winding down
      ctx.beginPath();
      ctx.moveTo(yx, h * 0.46);
      ctx.quadraticCurveTo(w * 0.47, h * 0.49, w * 0.52, h * 0.51);
      ctx.quadraticCurveTo(w * 0.48, h * 0.53, yx, yy - yr);
      ctx.stroke();

      // 3. Outer rim circle
      fillAndStroke(() => {
        ctx.arc(yx, yy, yr, 0, Math.PI * 2);
      });

      // 4. Inner disc circle
      fillAndStroke(() => {
        ctx.arc(yx, yy, yr * 0.72, 0, Math.PI * 2);
      });

      // 5. Star in center
      drawStar(yx, yy, 5, yr * 0.55, yr * 0.26);
      break;
    }

    case 'pumpkin': {
      wordCaption = 'Z come Zucca';
      const px = w * 0.50;
      const py = h * 0.67;

      // 1. Stem at top
      fillAndStroke(() => {
        ctx.moveTo(px - w * 0.025, py - w * 0.14);
        ctx.quadraticCurveTo(px + w * 0.02, py - w * 0.23, px + w * 0.07, py - w * 0.16);
        ctx.lineTo(px + w * 0.05, py - w * 0.14);
        ctx.closePath();
      });

      // 2. Leaf on stem
      fillAndStroke(() => {
        ctx.ellipse(px - w * 0.11, py - w * 0.16, w * 0.07, w * 0.035, -0.4, 0, Math.PI * 2);
      });
      ctx.beginPath();
      ctx.moveTo(px - w * 0.04, py - w * 0.14);
      ctx.quadraticCurveTo(px - w * 0.11, py - w * 0.16, px - w * 0.18, py - w * 0.18);
      ctx.stroke();

      // 3. Outer Left & Right Ribs (drawn first)
      fillAndStroke(() => {
        ctx.ellipse(px - w * 0.08, py, w * 0.12, w * 0.14, -0.1, 0, Math.PI * 2);
      });
      fillAndStroke(() => {
        ctx.ellipse(px + w * 0.08, py, w * 0.12, w * 0.14, 0.1, 0, Math.PI * 2);
      });

      // 4. Center Rib (drawn in front, masking inner overlapping lines cleanly!)
      fillAndStroke(() => {
        ctx.ellipse(px, py, w * 0.13, w * 0.15, 0, 0, Math.PI * 2);
      });

      // 5. Jack-o'-lantern carved face
      // Triangle Eyes
      fillAndStroke(() => {
        ctx.moveTo(px - w * 0.07, py - w * 0.02);
        ctx.lineTo(px - w * 0.03, py + w * 0.03);
        ctx.lineTo(px - w * 0.11, py + w * 0.03);
        ctx.closePath();
      });
      fillAndStroke(() => {
        ctx.moveTo(px + w * 0.07, py - w * 0.02);
        ctx.lineTo(px + w * 0.11, py + w * 0.03);
        ctx.lineTo(px + w * 0.03, py + w * 0.03);
        ctx.closePath();
      });

      // Triangle Nose
      fillAndStroke(() => {
        ctx.moveTo(px, py + w * 0.03);
        ctx.lineTo(px + w * 0.03, py + w * 0.07);
        ctx.lineTo(px - w * 0.03, py + w * 0.07);
        ctx.closePath();
      });

      // Smiling Carved Mouth with teeth
      fillAndStroke(() => {
        ctx.arc(px, py + w * 0.07, w * 0.09, 0.2, Math.PI - 0.2);
        ctx.quadraticCurveTo(px, py + w * 0.13, px - w * 0.09 * Math.cos(0.2), py + w * 0.07 + w * 0.09 * Math.sin(0.2));
        ctx.closePath();
      });
      break;
    }

    default: {
      wordCaption = `${charUpper} come ${template}`;
      fillAndStroke(() => {
        ctx.arc(w * 0.50, h * 0.65, w * 0.18, 0, Math.PI * 2);
      });
      break;
    }
  }

  // 5. Bottom Caption "[Letter] come [Word]"
  ctx.font = `bold ${Math.max(16, Math.round(w * 0.052))}px Fredoka, sans-serif`;
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(wordCaption, w * 0.50, h * 0.94);

  ctx.restore();
}
