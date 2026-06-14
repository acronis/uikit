// .claude/skills/figma-to-design-tokens/helpers/emit-alias-translator.mjs
// Translates Figma alias strings into our token path aliases and validates
// them against the current tiers/primitives.json.

import { PaletteMapper } from './emit-palette-mapper.mjs';

export class AliasTranslator {
  #primitives;
  // Map<variableId, ourDotPath> — built from primitives $extensions.
  #varIdToPath;

  constructor(primitives) {
    this.#primitives = primitives;
    this.#varIdToPath = AliasTranslator.#buildVarIdIndex(primitives);
  }

  static #buildVarIdIndex(node, base = [], map = new Map()) {
    if (!node || typeof node !== 'object') return map;
    const variableId = node?.$extensions?.['com.figma.variableId'];
    if (variableId) map.set(variableId, base.join('.'));
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      AliasTranslator.#buildVarIdIndex(v, [...base, k], map);
    }
    return map;
  }

  // Translate a Figma alias string to our alias.
  // Input shapes:
  //   "{Base}"                      → "{palette.base}"
  //   "{Blue.Blue-3}"               → "{palette.blue.3}"
  //   "{__library:VariableID:X:Y}"  → "{palette.transparent.inverted.6}" (via variableId)
  translate(figmaAlias) {
    // Orphan/library reference.
    const orphanMatch = figmaAlias.match(/^\{__library:(VariableID:[^}]+)\}$/);
    if (orphanMatch) {
      const ourPath = this.#varIdToPath.get(orphanMatch[1]);
      if (!ourPath) throw new Error(`Orphan variableId ${orphanMatch[1]} not found in primitives — refresh primitives first.`);
      return `{${ourPath}}`;
    }

    const match = figmaAlias.match(/^\{([^}]+)\}$/);
    if (!match) throw new Error(`Expected alias in {…} form, got: ${figmaAlias}`);

    const parts = match[1].split('.');
    const ourParts = PaletteMapper.map(parts);
    return `{palette.${ourParts.join('.')}}`;
  }

  // Returns true if the translated alias path exists in primitives.
  validates(ourAlias) {
    const inner = ourAlias.slice(1, -1); // strip { }
    const parts = inner.split('.');
    let cur = this.#primitives;
    for (const k of parts) {
      if (!cur || typeof cur !== 'object' || !(k in cur)) return false;
      cur = cur[k];
    }
    return true;
  }
}
