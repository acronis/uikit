// .claude/skills/figma-to-design-tokens/helpers/utils-dtcg-formatter.mjs
// JSON formatter matching the tiers/*.json house style, which is Prettier's
// (printWidth 80 — the pre-commit hook runs `prettier --write` on these files):
//   - `$extensions` and `values` are always expanded (multi-line)
//   - every other object/array is inlined when the whole line (indentation +
//     `"key": ` prefix + inline form) fits within 80 columns, else expanded
//     one member per line. So a `{ colorSpace, components }` color inlines when
//     shallow but expands when deeply indented; alpha colors and gradient-stop
//     arrays expand because their lines overflow.
// Key order is whatever the (pre-sorted) tree carries; see TreeUtils.sortNode.

export class DtcgFormatter {
  // Prettier's default printWidth; the inline/expand boundary for the whole line.
  static PRINT_WIDTH = 80;

  // Returns a formatted JSON string (trailing newline) for a token tree.
  static serialize(root) {
    return DtcgFormatter.#format(root, 0, null) + '\n';
  }

  // `key` is the property name this value sits under (null at the root / array
  // elements) — used to compute the line prefix and to keep `$extensions` /
  // `values` always expanded.
  static #format(value, indent, key) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);

    const pad = '  '.repeat(indent);
    const childPad = '  '.repeat(indent + 1);
    const prefixLen = pad.length + (key !== null ? `${JSON.stringify(key)}: `.length : 0);

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const inline = DtcgFormatter.#inline(value);
      if (prefixLen + inline.length <= DtcgFormatter.PRINT_WIDTH) return inline;
      const lines = value.map(v => `${childPad}${DtcgFormatter.#format(v, indent + 1, null)}`);
      return `[\n${lines.join(',\n')}\n${pad}]`;
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';

    // `$extensions` / `values` always expand; any other scalar object inlines
    // when the whole line fits in PRINT_WIDTH.
    if (indent > 0 && key !== '$extensions' && key !== 'values' && DtcgFormatter.#isScalarObject(value)) {
      const inline = DtcgFormatter.#inline(value);
      if (prefixLen + inline.length <= DtcgFormatter.PRINT_WIDTH) return inline;
    }

    const lines = keys.map(
      k => `${childPad}${JSON.stringify(k)}: ${DtcgFormatter.#format(value[k], indent + 1, k)}`,
    );
    return `{\n${lines.join(',\n')}\n${pad}}`;
  }

  // True when no member is a nested plain object (arrays and primitives are fine).
  static #isScalarObject(obj) {
    return Object.values(obj).every(
      v => v === null || typeof v !== 'object' || Array.isArray(v),
    );
  }

  // Inline JSON with spaces: { "k": v, ... } and [a, b, c]; [] and {} stay tight.
  static #inline(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) {
      return value.length === 0 ? '[]' : `[${value.map(DtcgFormatter.#inline).join(', ')}]`;
    }
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    return `{ ${keys.map(k => `${JSON.stringify(k)}: ${DtcgFormatter.#inline(value[k])}`).join(', ')} }`;
  }
}
