// .tmp/scripts/lib/palette-map.mjs
// Shared Figma palette path → our path translator (multi-segment cases only).
//
// Single-element handling differs between callers — primitives uses a redirect
// map (rename or drop), semantic just lowercases. Each caller wraps this fn
// with its own single-element branch.
//
// Examples:
//   mapPaletteParts(["Blue", "Blue-3"])           → ["blue", "3"]
//   mapPaletteParts(["Blue", "Blue-7-Primary"])   → ["blue", "7"]
//   mapPaletteParts(["Blue", "Blue-13-Brand"])    → ["blue", "13"]
//   mapPaletteParts(["Grayscale", "Gray-5"])      → ["grayscale", "5"]
//   mapPaletteParts(["Transparent", "Inverted-0"])→ ["transparent", "inverted", "0"]
//   mapPaletteParts(["Transparent", "Dark-12"])   → ["transparent", "dark", "12"]
//   // throws on unrecognized leaf names — add a case rather than silently mis-mapping.

export function mapPaletteParts(parts) {
  const [group, leaf] = parts;
  if (group === 'Grayscale') return ['grayscale', leaf.replace(/^Gray-/, '')];
  if (group === 'Transparent') {
    const m = leaf.match(/^(Inverted|Dark)-(\d+)$/);
    if (!m) throw new Error(`unrecognized Transparent leaf: ${leaf}`);
    return ['transparent', m[1].toLowerCase(), m[2]];
  }
  const m = leaf.match(/^[A-Za-z]+-(\d+)(?:-(?:Primary|Brand))?$/);
  if (!m) throw new Error(`unrecognized ramp leaf: ${group}.${leaf}`);
  return [group.toLowerCase(), m[1]];
}
