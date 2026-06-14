// .claude/skills/figma-to-design-tokens/helpers/emit-palette-mapper.mjs
// Translates Figma palette path parts (from the DTCG variable tree) into our
// kebab-case code path parts used in tiers/primitives.json.

export class PaletteMapper {
  // Figma name → our code name mappings.
  static #NAME_MAP = new Map([
    ['Blue',       'blue'],
    ['Teal',       'teal'],
    ['Green',      'green'],
    ['Yellow',     'yellow'],
    ['Orange',     'orange'],
    ['Red',        'red'],
    ['Violet',     'violet'],
    ['Ink',        'ink'],
    ['Grayscale',  'grayscale'],
    ['Transparent','transparent'],
  ]);

  // Figma sub-group within Transparent → our sub-path.
  static #TRANSPARENT_MAP = new Map([
    ['Inverted', 'inverted'],
    ['Dark',     'dark'],
    ['Clear',    'clear'],
  ]);

  // Map a Figma path like "Blue.Blue-3" or "Transparent.Inverted-6" to our
  // code path: ["blue", "3"] or ["transparent", "inverted", "6"].
  // Single-element paths (e.g. ["Base"]) are just lowercased.
  static map(parts) {
    if (parts.length === 1) return [parts[0].toLowerCase()];

    const [group, ...rest] = parts;
    const mappedGroup = PaletteMapper.#NAME_MAP.get(group);
    if (!mappedGroup) return parts.map(p => p.toLowerCase().replace(/\s+/g, '-'));

    if (mappedGroup === 'grayscale') {
      // "Grayscale/Gray-3" → ["grayscale", "3"]
      const num = rest.join('/').match(/(\d+)$/)?.[1];
      return num ? [mappedGroup, num] : [mappedGroup, rest.join('-').toLowerCase()];
    }

    if (mappedGroup === 'transparent') {
      // "Transparent/Inverted-6" → ["transparent", "inverted", "6"]
      const subParts = rest.join('/').split(/[-/]/);
      const subName = subParts[0];
      const subNum = subParts[subParts.length - 1];
      const mappedSub = PaletteMapper.#TRANSPARENT_MAP.get(subName);
      if (mappedSub && /^\d+$/.test(subNum)) return [mappedGroup, mappedSub, subNum];
      return [mappedGroup, ...subParts.map(p => p.toLowerCase())];
    }

    // Blue/Teal/Green/... — strip the group prefix from the number key.
    // "Blue.Blue-3" → ["blue", "3"]
    const raw = rest.join('.');
    const stripped = raw.replace(new RegExp(`^${group}-?`, 'i'), '');
    const num = stripped.match(/^(\d+)/)?.[1];
    if (num) return [mappedGroup, num];
    return [mappedGroup, stripped.toLowerCase().replace(/\s+/g, '-')];
  }
}
