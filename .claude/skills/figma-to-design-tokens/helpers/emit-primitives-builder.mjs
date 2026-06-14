// .claude/skills/figma-to-design-tokens/helpers/emit-primitives-builder.mjs
// Builds tiers/primitives.json from a normalized figma-snapshot.json.
// Handles palette (theme collection), units (gap/size/radius/stroke),
// and font (font-family/weight/size/line-height/letter-spacing from styles).

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ColorUtils } from './utils-color.mjs';
import { TreeUtils } from './utils-tree.mjs';
import { DtcgWalker } from './utils-dtcg-walker.mjs';
import { DtcgFormatter } from './utils-dtcg-formatter.mjs';
import { PaletteMapper } from './emit-palette-mapper.mjs';
import { TypographyMapper } from './emit-typography-mapper.mjs';

const OUT_PATH = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/primitives.json', import.meta.url));

// Transparent rule: a fully-transparent color (alpha 0) is emitted as the CSS
// keyword `transparent` rather than an HSL object — the RGB channels of a
// zero-alpha color are meaningless (Figma may store magenta, black, etc.).
const colorValue = c => (c && typeof c === 'object' && c.alpha === 0 ? 'transparent' : c);

// Orphan palette stops that Figma never exports as local Mode variables.
// These are referenced by semantic tokens; keep them in sync manually.
const ORPHAN_PALETTE = [
  { ourPath: ['transparent', 'inverted', '6'], variableId: 'VariableID:139:23',
    light: { colorSpace: 'hsl', components: [0, 0, 100], alpha: 0.4 },
    dark:  { colorSpace: 'hsl', components: [0, 0,   0], alpha: 0.4 } },
  { ourPath: ['transparent', 'inverted', '8'], variableId: 'VariableID:139:25',
    light: { colorSpace: 'hsl', components: [0, 0, 100], alpha: 0.2 },
    dark:  { colorSpace: 'hsl', components: [0, 0,   0], alpha: 0.2 } },
];

export class PrimitivesEmitter {
  #snapshot;

  constructor(snapshot) {
    this.#snapshot = snapshot;
  }

  emit() {
    const out = {
      $schema: '../schemas/tier.schema.json',
      palette: { $type: 'color' },
      font: {
        'font-family':    { $type: 'fontFamily' },
        'font-weight':    { $type: 'fontWeight' },
        'font-size':      { $type: 'dimension' },
        'line-height':    { $type: 'dimension' },
        'letter-spacing': {
          $type: 'dimension',
          $description: 'Derived from Figma Text Styles; no source Variable. Refresh by re-pulling styles.json.',
        },
      },
      units: { $type: 'dimension' },
    };

    this.#emitPalette(out);
    this.#emitOrphanPalette(out);
    this.#emitUnits(out);
    this.#emitFont(out);
    this.#emitLetterSpacing(out);

    const root = TreeUtils.sortNode(out);

    fs.writeFileSync(OUT_PATH, DtcgFormatter.serialize(root));
    return root;
  }

  get outputPath() { return OUT_PATH; }

  #emitPalette(out) {
    const themeNode = this.#snapshot.variables?.theme;
    if (!themeNode) throw new Error('Snapshot missing "theme" collection — expected palette source.');

    for (const { path, leaf } of DtcgWalker.walk(themeNode)) {
      const ourPath = PaletteMapper.map(path);
      // Snapshot colors are already normalized to DTCG HSL by ColorNormalizer.
      const light = colorValue(leaf.$value);
      const dark  = colorValue(leaf.$extensions?.modes?.Dark ?? leaf.$value);
      const variableId = leaf.$extensions?.['com.figma.variableId'];
      const ext = this.#buildFigmaExt(leaf.$extensions, variableId);

      TreeUtils.setPath(out, ['palette', ...ourPath], {
        values: { light, dark },
        platforms: ['PD'],
        $extensions: ext,
      });
    }
  }

  #emitOrphanPalette(out) {
    for (const o of ORPHAN_PALETTE) {
      const ext = { 'com.figma.scopes': [], 'com.figma.variableId': o.variableId, 'com.figma.hiddenFromPublishing': true };
      TreeUtils.setPath(out, ['palette', ...o.ourPath], {
        values: { light: o.light, dark: o.dark },
        platforms: ['PD'],
        $extensions: ext,
      });
    }
  }

  #emitUnits(out) {
    const unitsNode = this.#snapshot.variables?.units;
    if (!unitsNode) throw new Error('Snapshot missing "units" collection.');

    const UNIT_SECTIONS = [
      { key: 'gap',    prefix: 'gap',    outKey: 'gap' },
      { key: 'size',   prefix: 'size',   outKey: 'size' },
      { key: 'radius', prefix: 'radius', outKey: 'radius' },
      { key: 'stroke', prefix: 'width',  outKey: 'stroke' },
    ];

    for (const { key, prefix, outKey } of UNIT_SECTIONS) {
      const section = unitsNode[key];
      if (!section) continue;
      for (const { path, leaf } of DtcgWalker.walk(section)) {
        const localKey = path[path.length - 1].replace(new RegExp(`^${prefix}-`), '');
        const num = typeof leaf.$value === 'number' ? leaf.$value : Number(leaf.$value);
        const variableId = leaf.$extensions?.['com.figma.variableId'];
        TreeUtils.setPath(out, ['units', outKey, localKey], {
          $value: { value: ColorUtils.round(num, 4), unit: 'px' },
          platforms: ['PD'],
          $extensions: this.#buildFigmaExt(leaf.$extensions, variableId),
        });
      }
    }
  }

  #emitFont(out) {
    const fontNode = this.#snapshot.variables?.font;
    if (!fontNode) throw new Error('Snapshot missing "font" collection.');

    const FONT_SECTIONS = [
      { key: 'font-family',  prefix: null,          type: 'fontFamily' },
      { key: 'font-weight',  prefix: 'font-weight', type: 'fontWeight' },
      { key: 'font-size',    prefix: 'font-size',   type: 'dimension' },
      { key: 'line-height',  prefix: 'line-height', type: 'dimension' },
    ];

    for (const { key, prefix, type } of FONT_SECTIONS) {
      const section = fontNode[key];
      if (!section) continue;
      for (const { path, leaf } of DtcgWalker.walk(section)) {
        const localKey = prefix
          ? path[path.length - 1].replace(new RegExp(`^${prefix}-`), '')
          : path[path.length - 1];
        const raw = leaf.$value;
        const variableId = leaf.$extensions?.['com.figma.variableId'];
        // `dimension` uses the native DTCG `{ value, unit }`. fontWeight /
        // fontFamily are scalar DTCG types, so they carry a plain `$value`
        // (number / string).
        let dtcgValue;
        if (type === 'dimension') dtcgValue = { value: ColorUtils.round(Number(raw), 4), unit: 'px' };
        else if (type === 'fontWeight') dtcgValue = Number(raw);
        else dtcgValue = raw; // fontFamily (string)
        TreeUtils.setPath(out, ['font', key, localKey], {
          $value: dtcgValue,
          platforms: ['PD'],
          $extensions: this.#buildFigmaExt(leaf.$extensions, variableId),
        });
      }
    }
  }

  #emitLetterSpacing(out) {
    const textStyles = this.#snapshot.styles?.text ?? [];
    const lsValues = new Set();
    for (const s of textStyles) {
      const ls = s.letterSpacing;
      if (!ls) continue;
      if (ls.value === 0) { lsValues.add(0); continue; }
      if (ls.unit !== 'PIXELS') throw new Error(`Text style "${s.name}" non-zero letterSpacing unit ${ls.unit} — only PIXELS supported.`);
      lsValues.add(ColorUtils.round(ls.value, 4));
    }
    for (const px of [...lsValues].sort((a, b) => a - b)) {
      TreeUtils.setPath(out, ['font', 'letter-spacing', TypographyMapper.lsSlug(px)], {
        $value: { value: px, unit: 'px' },
        platforms: ['PD'],
      });
    }
  }

  #buildFigmaExt(ext, variableId) {
    const out = {};
    if (variableId) out['com.figma.variableId'] = variableId;
    if (ext?.['com.figma.scopes']) out['com.figma.scopes'] = ext['com.figma.scopes'];
    if (ext?.['com.figma.hiddenFromPublishing']) out['com.figma.hiddenFromPublishing'] = true;
    return out;
  }
}
