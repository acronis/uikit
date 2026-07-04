// .tmp/scripts/lib/typography-map.mjs
// Typography helpers shared by figma-to-primitives.mjs and figma-to-semantic.mjs.
//
//   - styleToWeight("Semi Bold")        → 600
//   - lsSlug(0)                         → "0"
//   - lsSlug(0.3)                       → "0-3"
//   - mapTextStyleName("body/body")     → ["body", "default"]
//   - mapTextStyleName("body/body-strong") → ["body", "strong"]
//   - makeTypographyMap(primitives).fontSize(14)
//                                       → "{font.font-size.14}"
//   - makeTypographyMap(primitives).fontSize(11)  → null  (no matching primitive)
//
// makeTypographyMap reads the `font` subtree of tiers/primitives.json and
// returns value→alias-string lookups for each sub-field. A null result is the
// signal to inline a raw value (see .tmp/scripts/figma-to-semantic.mjs for the
// font-size 11 / line-height 40 gap handling).

const FONT_STYLE_TO_WEIGHT = {
  'Regular': 400,
  'Medium': 500,
  'Semi Bold': 600,
  'Bold': 700,
};

export function styleToWeight(style) {
  if (!(style in FONT_STYLE_TO_WEIGHT)) {
    throw new Error(`unknown fontName.style: ${style} — extend FONT_STYLE_TO_WEIGHT in .tmp/scripts/lib/typography-map.mjs`);
  }
  return FONT_STYLE_TO_WEIGHT[style];
}

export function lsSlug(px) {
  return String(px).replace('.', '-');
}

export function mapTextStyleName(figmaName) {
  const parts = figmaName.split('/');
  if (parts.length !== 2) {
    throw new Error(`expected slash-separated text style name (group/leaf), got: ${figmaName}`);
  }
  const [group, leaf] = parts;
  if (leaf === group) return [group, 'default'];
  const prefix = group + '-';
  if (leaf.startsWith(prefix)) return [group, leaf.slice(prefix.length)];
  return [group, leaf];
}

function* leaves(node) {
  if (!node) return;
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    yield [k, v];
  }
}

function unitsOf(leaf) {
  return leaf?.$extensions?.['com.acronis.units'];
}

export function makeTypographyMap(primitives) {
  const font = primitives?.font;
  if (!font) throw new Error('tiers/primitives.json has no font subtree — run .tmp/scripts/figma-to-primitives.mjs first');

  const ff = new Map();
  for (const [k, leaf] of leaves(font['font-family'])) ff.set(unitsOf(leaf), k);

  const fs = new Map();
  for (const [k, leaf] of leaves(font['font-size'])) fs.set(unitsOf(leaf).value, k);

  const fw = new Map();
  for (const [k, leaf] of leaves(font['font-weight'])) fw.set(unitsOf(leaf), k);

  const lh = new Map();
  for (const [k, leaf] of leaves(font['line-height'])) lh.set(unitsOf(leaf).value, k);

  const ls = new Map();
  for (const [k, leaf] of leaves(font['letter-spacing'])) ls.set(unitsOf(leaf).value, k);

  return {
    fontFamily: family => ff.has(family) ? `{font.font-family.${ff.get(family)}}` : null,
    fontSize:   px     => fs.has(px)     ? `{font.font-size.${fs.get(px)}}`       : null,
    fontWeight: weight => fw.has(weight) ? `{font.font-weight.${fw.get(weight)}}` : null,
    lineHeight: px     => lh.has(px)     ? `{font.line-height.${lh.get(px)}}`     : null,
    letterSpacing: px  => ls.has(px)     ? `{font.letter-spacing.${ls.get(px)}}`  : null,
  };
}
