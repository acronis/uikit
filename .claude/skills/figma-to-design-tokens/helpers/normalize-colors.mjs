// .claude/skills/figma-to-design-tokens/helpers/normalize-colors.mjs
// Normalizes Figma-exported color leaves (hex strings) into the canonical DTCG
// HSL form used by tiers/*.json, so the diff compares like-for-like and the
// emitter can pass colors through without re-converting.
//
// Figma exports colors as hex (#RRGGBB / #RRGGBBAA); our tier files store
// { colorSpace: 'hsl', components: [h, s, l], alpha? }. This helper is the
// single conversion point, injected at the snapshot-build (normalization) stage.

import { ColorUtils } from './utils-color.mjs';
import { DtcgWalker } from './utils-dtcg-walker.mjs';

export class ColorNormalizer {
  // Convert every hex color leaf in a variable tree to DTCG HSL, in place.
  // Non-color leaves, aliases, and already-normalized values are left untouched.
  static normalize(tree) {
    for (const { leaf } of DtcgWalker.walk(tree)) {
      if (leaf.$type !== 'color') continue;

      if (ColorNormalizer.#isHex(leaf.$value)) {
        leaf.$value = ColorUtils.hexToHslValue(leaf.$value);
      }

      const modes = leaf.$extensions?.modes;
      if (modes) {
        for (const [mode, value] of Object.entries(modes)) {
          if (ColorNormalizer.#isHex(value)) {
            modes[mode] = ColorUtils.hexToHslValue(value);
          }
        }
      }
    }
    return tree;
  }

  // A literal hex string — not an alias reference ("{path}") or HSL object.
  static #isHex(value) {
    return typeof value === 'string' && value.startsWith('#');
  }
}
