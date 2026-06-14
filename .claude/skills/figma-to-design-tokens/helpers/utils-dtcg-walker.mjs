// .claude/skills/figma-to-design-tokens/helpers/utils-dtcg-walker.mjs
// Depth-first DTCG tree walker. Yields {path, leaf} for every node that
// has a $value key (i.e. is a token, not a group).

export class DtcgWalker {
  // Walk `node` depth-first. Yields { path: string[], leaf: object }.
  // $-prefixed keys are never descended into.
  static *walk(node, path = []) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return;
    if ('$value' in node) {
      yield { path, leaf: node };
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        yield* DtcgWalker.walk(v, [...path, k]);
      }
    }
  }

  // Walk and collect all leaves into an array.
  static collect(node) {
    return [...DtcgWalker.walk(node)];
  }
}
