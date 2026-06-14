// .claude/skills/figma-to-design-tokens/helpers/emit-semantics-builder.mjs
// Builds tiers/semantics.json from a normalized figma-snapshot.json.
// Handles variable-backed semantic colors, AI gradients, and typography
// derived from text styles.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ColorUtils } from './utils-color.mjs';
import { TreeUtils } from './utils-tree.mjs';
import { DtcgFormatter } from './utils-dtcg-formatter.mjs';
import { AliasTranslator } from './emit-alias-translator.mjs';
import { TypographyMapper } from './emit-typography-mapper.mjs';

const OUT_PATH        = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/semantics.json', import.meta.url));
const PRIMITIVES_PATH = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/primitives.json', import.meta.url));

const normalizeMode = m => m.toLowerCase().replace(/\s+/g, '-');
const normalizeKey  = k => k.replace(/\s+/g, '-');

export class SemanticsEmitter {
  #snapshot;
  #primitives;
  #aliasTranslator;
  #typoMapper;

  constructor(snapshot) {
    this.#snapshot = snapshot;
    this.#primitives = JSON.parse(fs.readFileSync(PRIMITIVES_PATH, 'utf8'));
    this.#aliasTranslator = new AliasTranslator(this.#primitives);
    this.#typoMapper = new TypographyMapper(this.#primitives);
  }

  emit() {
    const prevOut = fs.existsSync(OUT_PATH)
      ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'))
      : {};

    const out = {
      $schema: '../schemas/tier.schema.json',
      colors: { $type: 'color' },
    };
    if (prevOut.$extensions) out.$extensions = prevOut.$extensions;

    const aliasErrors = [];
    this.#emitColors(out, aliasErrors);
    this.#emitGradients(out, aliasErrors);
    this.#emitTypography(out);

    if (aliasErrors.length) {
      for (const e of aliasErrors) console.error('Alias error:', e);
      throw new Error(`${aliasErrors.length} alias error(s) — see above.`);
    }

    // Attach the hand-authored $extensions before sorting so its key lands in
    // alphabetical position, then restore its content verbatim afterwards
    // (sortNode would otherwise reorder its hand-curated internals).
    if (prevOut.$extensions) out.$extensions = prevOut.$extensions;
    const root = TreeUtils.sortNode(out);
    if (prevOut.$extensions) root.$extensions = prevOut.$extensions;

    fs.writeFileSync(OUT_PATH, DtcgFormatter.serialize(root));
    return root;
  }

  get outputPath() { return OUT_PATH; }

  #emitColors(out, aliasErrors) {
    const colorsNode = this.#snapshot.variables?.brand?.semantics?.colors;
    if (!colorsNode) throw new Error('Snapshot missing brand.semantics.colors subtree.');

    for (const { path, leaf } of this.#walkColorLeaves(colorsNode)) {
      const variableId = leaf.$extensions?.['com.figma.variableId'];
      const lastSynced = leaf.$extensions?.modes ?? {};

      if (Object.keys(lastSynced).length === 0) {
        aliasErrors.push(`no mode values at ${path.join('.')}`);
        continue;
      }

      const values = {};
      let isGradient = false;
      for (const [figmaModeKey, modeRef] of Object.entries(lastSynced)) {
        if (typeof modeRef !== 'string' || !modeRef.startsWith('{')) {
          aliasErrors.push(`${path.join('.')} mode ${figmaModeKey}: expected reference, got ${JSON.stringify(modeRef)}`);
          continue;
        }
        // A semantic that points at another semantic (e.g. a gradient border →
        // gradients.ai.idle) exports as a `{semantics.…}` alias — strip the
        // redundant prefix. Everything else is a palette reference.
        const semMatch = modeRef.match(/^\{(?:brand\.)?semantics\.(.+)\}$/);
        if (semMatch) {
          const inner = semMatch[1].replace(/\s+/g, '-');
          values[normalizeMode(figmaModeKey)] = `{${inner}}`;
          if (inner.startsWith('gradients.')) isGradient = true;
          continue;
        }
        try {
          const ourAlias = this.#aliasTranslator.translate(modeRef);
          if (!this.#aliasTranslator.validates(ourAlias)) {
            aliasErrors.push(`unknown palette target: ${ourAlias} (from ${path.join('.')} mode ${figmaModeKey})`);
          }
          values[normalizeMode(figmaModeKey)] = ourAlias;
        } catch (e) {
          aliasErrors.push(e.message);
        }
      }

      const ourKey = path.map(normalizeKey);
      const ext = { 'com.figma.scopes': leaf.$extensions?.['com.figma.scopes'] ?? [], 'com.figma.variableId': variableId };
      if (leaf.$extensions?.['com.figma.hiddenFromPublishing']) ext['com.figma.hiddenFromPublishing'] = true;
      // A gradient-valued leaf overrides the group's `color` $type.
      const leafOut = isGradient
        ? { $type: 'gradient', values, platforms: ['PD'], $extensions: ext }
        : { values, platforms: ['PD'], $extensions: ext };
      TreeUtils.setPath(out.colors, ourKey, leafOut);
    }
  }

  *#walkColorLeaves(node, path = []) {
    if (!node || typeof node !== 'object') return;
    if ('$value' in node || ('$extensions' in node && node.$extensions?.['com.figma.variableId'])) {
      yield { path, leaf: node };
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      yield* this.#walkColorLeaves(v, [...path, k]);
    }
  }

  #emitGradients(out, aliasErrors) {
    const gradientsNode = this.#snapshot.variables?.brand?.semantics?.gradients;
    out.gradients = { $type: 'gradient' };
    if (!gradientsNode) return;

    for (const [group, tokens] of Object.entries(gradientsNode)) {
      if (group.startsWith('$')) continue;
      out.gradients[group] = {};
      for (const [key, leaf] of Object.entries(tokens)) {
        if (key.startsWith('$')) continue;
        const variableId = leaf.$extensions?.['com.figma.variableId'];
        const modes = leaf.$extensions?.modes ?? {};
        const values = {};
        let rawCss = null;

        for (const [modeKey, modeVal] of Object.entries(modes)) {
          if (typeof modeVal !== 'string') {
            aliasErrors.push(`gradients.${group}.${key} mode ${modeKey}: expected CSS literal`);
            continue;
          }
          rawCss = modeVal;
          values[normalizeMode(modeKey)] = this.#parseCssGradient(modeVal);
        }
        const ext = {
          'com.figma.scopes': leaf.$extensions?.['com.figma.scopes'] ?? [],
          'com.figma.variableId': variableId,
          'com.figma.cssGradient': rawCss,
        };
        out.gradients[group][key] = { values, platforms: ['PD'], $extensions: ext };
      }
    }
  }

  #parseCssGradient(css) {
    const m = css.trim().replace(/;$/, '').match(/^linear-gradient\(([^)]+)\)$/);
    if (!m) throw new Error(`Unparseable gradient: ${css}`);
    const parts = m[1].split(',').map(s => s.trim());
    const angle = parts.shift();
    if (!/^\d+deg$/.test(angle)) throw new Error(`Unexpected gradient angle: ${angle}`);
    return parts.map(p => {
      const sm = p.match(/^(#[0-9A-Fa-f]{6})\s+([\d.]+)%$/);
      if (!sm) throw new Error(`Unparseable gradient stop: ${p}`);
      return { color: ColorUtils.hexToHslValue(sm[1]), position: ColorUtils.round(Number(sm[2]) / 100, 4) };
    });
  }

  #emitTypography(out) {
    const textStyles = this.#snapshot.styles?.text ?? [];
    out.typography = { $type: 'typography' };

    for (const style of textStyles) {
      if (style.name.startsWith('_library/')) continue;
      const ourPath = TypographyMapper.mapTextStyleName(style.name);
      const family  = style.fontName?.family;
      const weight  = TypographyMapper.styleToWeight(style.fontName?.style);

      if (style.lineHeight?.unit !== 'PIXELS') throw new Error(`Text style "${style.name}" lineHeight unit ${style.lineHeight?.unit} — only PIXELS.`);
      if (style.letterSpacing.value !== 0 && style.letterSpacing.unit !== 'PIXELS') {
        throw new Error(`Text style "${style.name}" non-zero letterSpacing unit ${style.letterSpacing.unit} — only PIXELS.`);
      }

      const fontSize      = style.fontSize;
      const lineHeight    = ColorUtils.round(style.lineHeight.value, 4);
      const letterSpacing = style.letterSpacing.value === 0 ? 0 : ColorUtils.round(style.letterSpacing.value, 4);

      const composite = {
        fontFamily:    this.#requireAlias(this.#typoMapper.fontFamily(family), 'fontFamily', family, style.name),
        fontSize:      this.#aliasOrInline(this.#typoMapper.fontSize(fontSize), fontSize, 'fontSize', style.name),
        fontWeight:    this.#requireAlias(this.#typoMapper.fontWeight(weight), 'fontWeight', weight, style.name),
        lineHeight:    this.#aliasOrInline(this.#typoMapper.lineHeight(lineHeight), lineHeight, 'lineHeight', style.name),
        letterSpacing: this.#requireAlias(this.#typoMapper.letterSpacing(letterSpacing), 'letterSpacing', letterSpacing, style.name),
      };

      const ext = {};
      if (style.textCase && style.textCase !== 'ORIGINAL') ext['com.acronis.textCase'] = style.textCase;
      if (style.textDecoration && style.textDecoration !== 'NONE') ext['com.acronis.textDecoration'] = style.textDecoration;
      ext['com.figma.styleId'] = style.id;

      TreeUtils.setPath(out.typography, ourPath, { $value: composite, platforms: ['PD'], $extensions: ext });
    }
  }

  #requireAlias(alias, field, value, styleName) {
    if (alias !== null) return alias;
    throw new Error(`Text style "${styleName}": no primitive for ${field}=${JSON.stringify(value)} — extend primitives.json.`);
  }

  #aliasOrInline(alias, px, field, styleName) {
    if (alias !== null) return alias;
    console.warn(`Warning: "${styleName}" ${field} ${px}px has no matching primitive — inlined raw dimension.`);
    return { unit: 'px', value: px };
  }
}
