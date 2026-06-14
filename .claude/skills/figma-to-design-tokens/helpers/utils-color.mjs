// .claude/skills/figma-to-design-tokens/helpers/utils-color.mjs
// Color math utilities: hex parsing, HSL conversion, DTCG value builders.

export class ColorUtils {
  static round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }

  static hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  static srgbToHsl(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: ColorUtils.round(l * 100) };

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
    return {
      h: ColorUtils.round(h * 360),
      s: ColorUtils.round(s * 100),
      l: ColorUtils.round(l * 100),
    };
  }

  // Build a DTCG color value object from a hex string.
  // Returns { colorSpace: 'hsl', components: [h, s, l] } optionally with alpha.
  static hexToHslValue(hex) {
    const { r, g, b, a } = ColorUtils.hexToRgb(hex);
    const { h, s, l } = ColorUtils.srgbToHsl(r, g, b);
    const value = { colorSpace: 'hsl', components: [h, s, l] };
    if (a < 1) value.alpha = ColorUtils.round(a, 4);
    return value;
  }
}
