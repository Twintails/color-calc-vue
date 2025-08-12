// Convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  // Clamp and normalize
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHex(rgb: string): string {
  // Handles rgb(r, g, b) or rgba(r, g, b, a)
  const result = rgb.match(/\d+/g);
  if (!result) return rgb;
  const hex = result
    .slice(0, 3)
    .map((x) => Number(x).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`.toUpperCase();
}

export function displayP3ToHex(p3: string): string {
  // Handles display-p3 r g b in [0,1] (Safari format)
  // Example: display-p3 0.651403 0.173069 0.090712
  const match = p3.match(
    /(?!color\()display-p3\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/,
  );
  if (!match) return p3;
  const r = Math.round(Math.max(0, Math.min(1, parseFloat(match[1]))) * 255);
  const g = Math.round(Math.max(0, Math.min(1, parseFloat(match[2]))) * 255);
  const b = Math.round(Math.max(0, Math.min(1, parseFloat(match[3]))) * 255);
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// Adjust color in HSL space, like Sass adjust-color
export function adjustColorHSL(
  baseHex: string,
  deltas: { hue?: number; saturation?: number; lightness?: number },
): string {
  const { h, s, l } = hexToHSL(baseHex);
  // Support negative/decimal deltas
  let newH = h + (deltas.hue ?? 0);
  let newS = s + (deltas.saturation ?? 0);
  let newL = l + (deltas.lightness ?? 0);
  // Clamp S/L to [0,100], wrap H to [0,360)
  newH = ((newH % 360) + 360) % 360;
  newS = Math.max(0, Math.min(100, newS));
  newL = Math.max(0, Math.min(100, newL));
  return hslToHex(newH, newS, newL);
}
export function hslColors(
  a: { h: number; s: number; l: number },
  b: { h: number; s: number; l: number },
) {
  const sat = a.s - b.s;
  const lig = a.l - b.l;
  const fnSat = sat > 0 ? "desaturate" : "saturate";
  const fnLig = lig > 0 ? "darken" : "lighten";

  return {
    hue: Math.abs(a.h - b.h),
    [fnSat]: Math.abs(sat),
    [fnLig]: Math.abs(lig),
  };
}

/**
 * Returns the difference in hue, saturation, and lightness between two HSL colors, using the same logic as the SCSS diff-hue, diff-sat, and diff-lig functions.
 * @param a First color {h, s, l}
 * @param b Second color {h, s, l}
 */
export function hslDiff(
  a: { h: number; s: number; l: number },
  b: { h: number; s: number; l: number },
) {
  // diff-hue: if(hue($a) > hue($b), hue($b) - hue($a), -(hue($a) - hue($b)))
  const diffHue = a.h > b.h ? b.h - a.h : -(a.h - b.h);
  // diff-sat: if(saturation($a) > saturation($b), saturation($b) - saturation($a), -(saturation($a) - saturation($b)))
  const diffSat = a.s > b.s ? b.s - a.s : -(a.s - b.s);
  // diff-lgt: if(lightness($a) > lightness($b), lightness($b) - lightness($a), -(lightness($a) - lightness($b)))
  const diffLig = a.l > b.l ? b.l - a.l : -(a.l - b.l);
  return {
    hue: diffHue,
    sat: diffSat,
    lgt: diffLig,
  };
}

/**
 * Returns an HSL color object using the hue from colorA, and the saturation and lightness from colorB.
 * Equivalent to SCSS: hsl(hue($a), saturation($b), lightness($b))
 * @param colorA Source for hue (e.g. {h,s,l})
 * @param colorB Source for saturation and lightness (e.g. {h,s,l})
 */
export function hslMixHueSatLig(
  colorA: { h: number; s: number; l: number },
  colorB: { h: number; s: number; l: number },
): { h: number; s: number; l: number } {
  return {
    h: colorA.h,
    s: colorB.s,
    l: colorB.l,
  };
}

/**
 * Returns an HSL color object using the hue from colorA, and the saturation and lightness from colorA.
 * Equivalent to SCSS: hsl(hue($a), saturation($a), lightness($a))
 * @param colorA Source for all channels (e.g. {h,s,l})
 */
export function hslFrom(colorA: { h: number; s: number; l: number }): {
  h: number;
  s: number;
  l: number;
} {
  return {
    h: colorA.h,
    s: colorA.s,
    l: colorA.l,
  };
}

/**
 * Returns an HSL color object using the hue from colorA, and the saturation and lightness from colorB.
 * Equivalent to SCSS: hsl(hue($a), saturation($b), lightness($b))
 * @param colorA Source for hue (e.g. {h,s,l})
 * @param colorB Source for saturation and lightness (e.g. {h,s,l})
 */
export function hslHueA_SatLigB(
  colorA: { h: number; s: number; l: number },
  colorB: { h: number; s: number; l: number },
): { h: number; s: number; l: number } {
  return {
    h: colorA.h,
    s: colorB.s,
    l: colorB.l,
  };
}

// Helper: Convert hex to HSL
export function hexToHSL(hex: string) {
  // Parse hex to RGB
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  // Normalize to [0,1]
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;

  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const delta = max - min;
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  // Hue calculation
  if (delta === 0) {
    h = 0; // Undefined, achromatic
  } else if (max === rf) {
    h = ((gf - bf) / delta) % 6;
  } else if (max === gf) {
    h = (bf - rf) / delta + 2;
  } else {
    h = (rf - gf) / delta + 4;
  }
  h = h * 60;
  if (h < 0) h += 360;

  // Saturation calculation
  if (delta === 0) {
    s = 0;
  } else {
    // Wikipedia/MDN formula
    s = delta / (1 - Math.abs(2 * l - 1));
    // Clamp for edge cases
    if (isNaN(s) || !isFinite(s)) s = 0;
  }

  // Clamp and round
  h = Number(h.toFixed(9));
  s = Number((s * 100).toFixed(9));
  l = Number((l * 100).toFixed(9));

  // Clamp to [0, 360] for h, [0, 100] for s/l
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  return { h, s, l };
}

// Color diff logic
/**
 *
 * @param primaryColor the primary color hex selected on the form
 * @param compareColor the primary-diff or secondary color hex selected on the form
 * @returns { hue: number; desaturate?: number; lighten?: number; saturate?: number; darken?: number; }
 */
export function diffColors(primaryColor: string, compareColor: string) {
  const hslA = hexToHSL(primaryColor);
  const hslB = hexToHSL(compareColor);
  const sat = hslA.s - hslB.s;
  const lig = hslA.l - hslB.l;
  const fnSat = sat > 0 ? "desaturate" : "saturate";
  const fnLig = lig > 0 ? "darken" : "lighten";
  return {
    hue: Math.abs(hslA.h - hslB.h),
    [fnSat]: Math.abs(sat),
    [fnLig]: Math.abs(lig),
  };
}
