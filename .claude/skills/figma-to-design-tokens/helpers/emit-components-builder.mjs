// .claude/skills/figma-to-design-tokens/helpers/emit-components-builder.mjs
// Builds tiers/components.json from a normalized figma-snapshot.json.
// Filters by a COMPONENTS allowlist, maps PascalCase component names to
// camelCase keys, and preserves hand-authored $extensions.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TreeUtils } from './utils-tree.mjs';
import { DtcgFormatter } from './utils-dtcg-formatter.mjs';
import { AliasTranslator } from './emit-alias-translator.mjs';

// Figma "units" collection sections → our `units.<section>` group.
const UNIT_SECTIONS = new Set(['gap', 'size', 'radius', 'stroke']);

const OUT_PATH        = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/components.json', import.meta.url));
const PRIMITIVES_PATH = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/primitives.json', import.meta.url));
const SEMANTICS_PATH  = fileURLToPath(new URL('../../../../packages/design-tokens/tiers/semantics.json', import.meta.url));

// Components to emit — PascalCase Figma names. Pass a subset via constructor.
const DEFAULT_COMPONENTS = [
  'Breadcrumb', 'Button', 'ButtonIcon', 'Checkbox', 'InputText',
  'SidebarPrimary', 'SidebarSecondary', 'Switch', 'Tag', 'Tooltip',
];


// No case transformation: Figma segment names are preserved exactly as-is.
// Components and SubComponents are PascalCase in Figma; everything else is camelCase.
// The emitter must not change casing at any level.

export class ComponentsEmitter {
  #snapshot;
  #primitives;
  #semantics;
  #allowlist;
  #aliasTranslator;

  constructor(snapshot, { components = DEFAULT_COMPONENTS } = {}) {
    this.#snapshot = snapshot;
    this.#primitives = JSON.parse(fs.readFileSync(PRIMITIVES_PATH, 'utf8'));
    this.#semantics  = JSON.parse(fs.readFileSync(SEMANTICS_PATH, 'utf8'));
    this.#allowlist  = new Set(components);
    this.#aliasTranslator = new AliasTranslator(this.#primitives);
  }

  emit() {
    const prevOut = fs.existsSync(OUT_PATH)
      ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'))
      : {};

    const out = { $schema: '../schemas/tier.schema.json' };
    // Preserve hand-authored $extensions (e.g. com.acronis.tailwindRoles).
    if (prevOut.$extensions) out.$extensions = prevOut.$extensions;

    const componentsNode = this.#snapshot.variables?.brand?.components;
    if (!componentsNode) throw new Error('Snapshot missing brand.components subtree.');

    for (const [figmaName, subtree] of Object.entries(componentsNode)) {
      if (figmaName.startsWith('$')) continue;
      if (!this.#allowlist.has(figmaName)) continue;

      out[figmaName] = this.#emitComponent(figmaName, subtree);
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

  #emitComponent(figmaName, subtree) {
    const result = {};
    this.#walk(subtree, result);
    return result;
  }

  #walk(node, out, depth = 0) {
    if (!node || typeof node !== 'object') return;

    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (!v || typeof v !== 'object') continue;

      if ('$value' in v || '$extensions' in v) {
        // Leaf token. Figma segment names are already camelCase — use as-is.
        out[k] = this.#buildLeaf(v);
      } else {
        // Group. Figma segment names are already camelCase — use as-is.
        out[k] = {};
        this.#walk(v, out[k], depth + 1);
      }
    }
  }

  #buildLeaf(leaf) {
    const variableId = leaf.$extensions?.['figma-console-mcp']?.variableId
      ?? leaf.$extensions?.['com.figma.variableId'];

    const value = this.#translateValue(leaf.$value, variableId);

    const token = {};
    if (leaf.$type) token.$type = leaf.$type;

    // Build extensions.
    const ext = {};
    const figmaExt = leaf.$extensions?.['figma-console-mcp'] ?? {};
    const cleanExt = leaf.$extensions ?? {};
    const id = figmaExt.variableId ?? cleanExt['com.figma.variableId'];
    if (id) ext['com.figma.variableId'] = id;

    const scopes = cleanExt['com.figma.scopes'] ?? figmaExt.scopes;
    if (scopes) ext['com.figma.scopes'] = scopes;
    if (cleanExt['com.figma.hiddenFromPublishing']) ext['com.figma.hiddenFromPublishing'] = true;

    // Multi-mode values.
    const modes = cleanExt.modes ?? {};
    const lastSynced = figmaExt.lastSyncedValue ?? {};
    const allModes = { ...modes };
    for (const [modeKey, modeData] of Object.entries(lastSynced)) {
      if ('reference' in modeData) allModes[modeKey] = modeData.reference;
      else if ('literal' in modeData) allModes[modeKey] = modeData.literal;
    }

    if (Object.keys(allModes).length > 0) {
      const translatedValues = {};
      for (const [modeKey, modeRef] of Object.entries(allModes)) {
        const normalizedKey = modeKey.toLowerCase().replace(/\s+/g, '-');
        translatedValues[normalizedKey] = this.#translateValue(modeRef, id);
      }
      if (Object.keys(translatedValues).length > 0) token.values = translatedValues;
    }

    // A leaf carries exactly one value carrier: per-mode `values` (the brand
    // axis) when modes exist, else a single `$value`. Figma exports both a
    // default `$value` and a `modes` map, so prefer `values` and drop the
    // redundant `$value` to satisfy the schema's one-carrier rule.
    if (!token.values) token.$value = value;

    // A token whose value references a typography composite is itself typography
    // (Figma stores it in a string Variable, so its source $type is "string").
    // Correct it so the CSS builder emits a `.typography-*` utility class.
    const sample = token.values ? Object.values(token.values)[0] : token.$value;
    if (typeof sample === 'string' && sample.startsWith('{typography.')) token.$type = 'typography';

    token.platforms = ['PD'];
    if (Object.keys(ext).length > 0) token.$extensions = ext;
    return token;
  }

  // Translate a single component value to our alias/literal form:
  //   "{semantics.colors.text.onSurface.primary}" → "{colors.text.onSurface.primary}"
  //   "{components.Button._global.container.radius}" → "{Button._global.container.radius}"
  //   "{gap.gap-4}" / "{stroke.width-1}"          → "{units.gap.4}" / "{units.stroke.1}"
  //   "{Base}" / "{Blue.Blue-3}"                   → palette ref (via AliasTranslator)
  //   "typography.link.default" / "body.accent"    → "{typography.link.default}" / "{typography.body.accent}"
  //   "underline" / "none" / "solid"               → kept verbatim (enum literal)
  #translateValue(value, variableId) {
    // Transparent rule: a fully-transparent literal color (alpha 0) becomes the
    // CSS keyword `transparent` — its RGB channels are meaningless.
    if (value && typeof value === 'object' && value.alpha === 0) return 'transparent';
    if (typeof value !== 'string') return value;
    if (value.startsWith('{')) return this.#translateAlias(value, variableId);
    // A bare dotted string is a typography reference; a bare word is an enum literal.
    if (value.includes('.')) {
      return value.startsWith('typography.') ? `{${value}}` : `{typography.${value}}`;
    }
    return value;
  }

  #translateAlias(alias, variableId) {
    // Semantic / component self references: strip the redundant tier prefix.
    const prefixed = alias.match(/^\{(?:brand\.)?(semantics|components)\.(.+)\}$/);
    if (prefixed) return `{${prefixed[2].replace(/\s+/g, '-')}}`;

    const inner = alias.slice(1, -1);
    const section = inner.split('.')[0];

    // Units: "{gap.gap-4}" → "{units.gap.4}" (strip the section-name key prefix).
    if (UNIT_SECTIONS.has(section)) {
      const rest = inner.slice(section.length + 1);
      const key = rest.replace(/^[^-]+-/, '');
      return `{units.${section}.${key}}`;
    }

    // Orphan/library + palette references go through the shared translator.
    try {
      return this.#aliasTranslator.translate(alias);
    } catch {
      return alias;
    }
  }
}
