// .claude/skills/figma-to-design-tokens/helpers/emit-typography-mapper.mjs
// Builds value→alias lookups from tiers/primitives.json for all typography
// primitive dimensions (fontFamily, fontSize, fontWeight, lineHeight,
// letterSpacing).

// Maps font style strings to numeric weights.
const WEIGHT_MAP = new Map([
  ['Thin', 100], ['Extra Light', 200], ['Light', 300],
  ['Regular', 400], ['Medium', 500], ['Semi Bold', 600],
  ['Bold', 700], ['Extra Bold', 800], ['Black', 900],
]);

export class TypographyMapper {
  #map = { fontFamily: new Map(), fontSize: new Map(), fontWeight: new Map(), lineHeight: new Map(), letterSpacing: new Map() };

  constructor(primitives) {
    this.#buildFromPrimitives(primitives);
  }

  fontFamily(family)        { return this.#map.fontFamily.get(family) ?? null; }
  fontSize(px)              { return this.#map.fontSize.get(px) ?? null; }
  fontWeight(numericWeight) { return this.#map.fontWeight.get(numericWeight) ?? null; }
  lineHeight(px)            { return this.#map.lineHeight.get(px) ?? null; }
  letterSpacing(px)         { return this.#map.letterSpacing.get(px) ?? null; }

  static styleToWeight(style) {
    return WEIGHT_MAP.get(style?.trim()) ?? null;
  }

  // Derive the letter-spacing token slug from a px value (matches figma-to-primitives logic).
  static lsSlug(px) {
    if (px === 0) return '0';
    return String(px).replace('.', '-');
  }

  // Map a Figma text style name (e.g. "body/body-strong") to a DTCG path array.
  static mapTextStyleName(name) {
    const parts = name.split('/').map(p =>
      p.toLowerCase().replace(/\s+/g, '-').replace(/^body-/, ''),
    );
    return parts;
  }

  #buildFromPrimitives(primitives) {
    const font = primitives.font;
    if (!font) return;

    // Dimension leaves (font-size/line-height/letter-spacing) carry a native
    // DTCG `$value: { value, unit }` — the scalar is `value`. fontFamily/fontWeight
    // carry a plain DTCG scalar `$value` (string / number).
    // The font tree is shallow (section → leaf), so iterate directly.
    for (const section of ['font-family', 'font-weight', 'font-size', 'line-height', 'letter-spacing']) {
      const group = font[section];
      if (!group || typeof group !== 'object') continue;

      for (const [key, leaf] of Object.entries(group)) {
        if (key.startsWith('$')) continue;
        const raw = leaf?.$value;
        const comp = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw.value : raw;
        if (comp === undefined) continue;
        const alias = `{font.${section}.${key}}`;

        switch (section) {
          case 'font-family':
            if (typeof comp === 'string') this.#map.fontFamily.set(comp, alias);
            break;
          case 'font-weight':
            this.#map.fontWeight.set(Number(comp), alias);
            break;
          case 'font-size':
            this.#map.fontSize.set(comp, alias);
            break;
          case 'line-height':
            this.#map.lineHeight.set(comp, alias);
            break;
          case 'letter-spacing':
            this.#map.letterSpacing.set(comp, alias);
            break;
        }
      }
    }
  }
}
