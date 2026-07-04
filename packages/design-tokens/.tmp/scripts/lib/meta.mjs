// .tmp/scripts/lib/meta.mjs
// Build a metaFor(variableId) lookup over the variables-meta.json sidecar.
//
// The DTCG export drops `scopes` and `hiddenFromPublishing` — this sidecar
// (generated via figma_execute → getLocalVariablesAsync) holds them.
//
// Example:
//   const metaFor = makeMetaFor(loadMeta());
//   metaFor("VariableID:99:1932")
//   // → { scopes: ["ALL_SCOPES"], hidden: false }
//   // throws on unknown IDs — refresh figma/variables-meta.json

export function makeMetaFor(meta) {
  return (id) => {
    const m = meta?.[id];
    if (!m) throw new Error(`no metadata for ${id} — refresh .tmp/figma-tokens/variables-meta.json`);
    return { scopes: m.scopes ?? [], hidden: !!m.hidden };
  };
}
