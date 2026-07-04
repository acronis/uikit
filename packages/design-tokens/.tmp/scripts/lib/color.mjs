// .tmp/scripts/lib/color.mjs
// Color math: hex parsing, sRGB → HSL, DTCG color-value builder.
//
// All angles/percents are rounded to 2 decimal places — matches the precision
// of the committed primitives.json / semantic.json so the generator output
// stays stable.
//
// Examples:
//   round(1.23456)            → 1.23
//   round(1.23456, 4)         → 1.2346
//   hexToRgb("#D6E4F5")       → { r: 0.8392, g: 0.8941, b: 0.9608, a: 1 }
//   srgbToHsl([0.84, 0.89, 0.96])
//                             → [212.9, 60.78, 90]   (HSL, °/%/%)
//   hexToHslValue("#D6E4F5")  → { colorSpace: "hsl", components: [212.9, 60.78, 90] }
//   hexToHslValue("#00000080") → { colorSpace: "hsl", components: [0,0,0], alpha: 0.502 }

export const round = (x, d = 2) => { const f = 10 ** d; return Math.round(x * f) / f; };

export function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let r, g, b, a = 1;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16) / 255;
    g = parseInt(hex[1] + hex[1], 16) / 255;
    b = parseInt(hex[2] + hex[2], 16) / 255;
  } else if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16) / 255;
    g = parseInt(hex.slice(2, 4), 16) / 255;
    b = parseInt(hex.slice(4, 6), 16) / 255;
    if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16) / 255;
  } else throw new Error(`bad hex: ${hex}`);
  return { r, g, b, a };
}

export function srgbToHsl([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const dlt = max - min;
    s = l > 0.5 ? dlt / (2 - max - min) : dlt / (max + min);
    switch (max) {
      case r: h = ((g - b) / dlt + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / dlt + 2) / 6; break;
      case b: h = ((r - g) / dlt + 4) / 6; break;
    }
  }
  return [round(h * 360), round(s * 100), round(l * 100)];
}

export function hexToHslValue(hex) {
  const { r, g, b, a } = hexToRgb(hex);
  const v = { colorSpace: 'hsl', components: srgbToHsl([r, g, b]) };
  if (a < 1) v.alpha = round(a, 4);
  return v;
}
