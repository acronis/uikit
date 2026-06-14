// .claude/skills/figma-to-design-tokens/helpers/utils-tree.mjs
// Generic DTCG tree operations: path manipulation, leaf collection, sorting.

export class TreeUtils {
  // Set a nested value at path[], creating intermediate objects as needed.
  static setPath(obj, path, value) {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in cur) || typeof cur[path[i]] !== 'object') {
        cur[path[i]] = {};
      }
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
  }

  // Yield {path: string[], leaf} for every node with a $value key.
  static *collectColorLeaves(node, path = []) {
    if (!node || typeof node !== 'object') return;
    if ('$value' in node && (node.$type === 'color' || !node.$type)) {
      yield { path, leaf: node };
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      yield* TreeUtils.collectColorLeaves(v, [...path, k]);
    }
  }

  // Recursively sort every object's keys alphabetically (ASCII code-unit order),
  // with the exception that all-numeric keys are ordered numerically so "8"
  // precedes "12". Arrays keep their order. This is the single ordering rule for
  // all tiers/*.json output — `$`-prefixed keys sort ahead of digits, which sort
  // ahead of letters, so a leaf reads `$description, $extensions, $type, $value,
  // platforms, values`.
  static sortNode(node) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
    const out = {};
    for (const k of Object.keys(node).sort(TreeUtils.#compareKeys)) {
      out[k] = TreeUtils.sortNode(node[k]);
    }
    return out;
  }

  static #compareKeys(a, b) {
    const na = /^\d+$/.test(a);
    const nb = /^\d+$/.test(b);
    if (na && nb) return Number(a) - Number(b);
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
