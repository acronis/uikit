// .claude/skills/figma-to-design-tokens/helpers/diff-engine.mjs
// Joins the snapshot variable/style indexes against the tiers indexes and
// classifies every difference into a typed change record.

import { DtcgWalker } from './utils-dtcg-walker.mjs';
import { ColorUtils } from './utils-color.mjs';

// Change type constants.
export const ChangeType = Object.freeze({
  TOKEN_ADDED:              'TOKEN_ADDED',
  TOKEN_DELETED:            'TOKEN_DELETED',
  VALUE_CHANGED:            'VALUE_CHANGED',
  MODE_VALUE_CHANGED:       'MODE_VALUE_CHANGED',
  TYPE_CHANGED:             'TYPE_CHANGED',
  SCOPES_CHANGED:           'SCOPES_CHANGED',
  HIDDEN_CHANGED:           'HIDDEN_CHANGED',
  EXTENSION_ADDED:          'EXTENSION_ADDED',
  EXTENSION_REMOVED:        'EXTENSION_REMOVED',
  EXTENSION_VALUE_CHANGED:  'EXTENSION_VALUE_CHANGED',
  STYLE_ADDED:              'STYLE_ADDED',
  STYLE_DELETED:            'STYLE_DELETED',
  STYLE_CHANGED:            'STYLE_CHANGED',
  UNCLASSIFIED:             'UNCLASSIFIED',
  FIGMA_UNTRACKED:          'FIGMA_UNTRACKED',
});

export class DiffEngine {
  #snapshot;
  #tiersReader;
  #changes = [];

  constructor(snapshot, tiersReader) {
    this.#snapshot = snapshot;
    this.#tiersReader = tiersReader;
  }

  run() {
    this.#changes = [];
    this.#diffVariables();
    this.#diffStyles();
    return this;
  }

  get changes() { return this.#changes; }

  // ── Variables ────────────────────────────────────────────────────────────

  #diffVariables() {
    const snapshotIndex = this.#buildSnapshotVarIndex();
    const tiersIndex = this.#tiersReader.variableIndex;

    // Tokens in snapshot → check against tiers.
    for (const [variableId, snEntry] of snapshotIndex) {
      const tierEntry = tiersIndex.get(variableId);
      if (!tierEntry) {
        this.#changes.push({
          type: ChangeType.TOKEN_ADDED,
          variableId,
          figmaPath: snEntry.path,
          inferredTier: DiffEngine.#inferTier(snEntry.path),
          snapshot: snEntry,
        });
        continue;
      }
      this.#compareToken(variableId, snEntry, tierEntry);
    }

    // Tokens in tiers but absent from snapshot.
    for (const [variableId, tierEntry] of tiersIndex) {
      if (!snapshotIndex.has(variableId)) {
        this.#changes.push({
          type: ChangeType.TOKEN_DELETED,
          variableId,
          tier: tierEntry.tier,
          ourPath: tierEntry.path,
          tiers: tierEntry,
        });
      }
    }
  }

  #buildSnapshotVarIndex() {
    const index = new Map();
    for (const { path, leaf } of DtcgWalker.walk(this.#snapshot.variables)) {
      const variableId = leaf.$extensions?.['com.figma.variableId'];
      if (!variableId) continue;
      index.set(variableId, { path, leaf });
    }
    return index;
  }

  #compareToken(variableId, snEntry, tierEntry) {
    const { leaf: snLeaf } = snEntry;
    const { leaf: tierLeaf, tier, path: ourPath } = tierEntry;
    const base = { variableId, tier, ourPath, figmaPath: snEntry.path };
    let classified = false;

    // $type change.
    if (snLeaf.$type && tierLeaf.$type && snLeaf.$type !== tierLeaf.$type) {
      this.#changes.push({ ...base, type: ChangeType.TYPE_CHANGED, from: tierLeaf.$type, to: snLeaf.$type });
      classified = true;
    }

    // $value carrier. For dimension primitives the tier stores a native DTCG
    // `{ value, unit }` while the snapshot has the raw scalar — compare the
    // numeric `value` (rounded to 4 dp to absorb Figma float noise); `unit` is
    // implied by $type and absent from the snapshot, so it isn't compared.
    // Otherwise (DTCG composites / aliases, and plain fontWeight/fontFamily
    // scalars) compare normalized values directly.
    if (snLeaf.$value !== undefined && tierLeaf.$value !== undefined) {
      const tv = tierLeaf.$value;
      if (tv && typeof tv === 'object' && !Array.isArray(tv) && 'value' in tv && 'unit' in tv) {
        const round = c => (typeof c === 'number' ? ColorUtils.round(c, 4) : c);
        if (round(tv.value) !== round(snLeaf.$value)) {
          this.#changes.push({ ...base, type: ChangeType.VALUE_CHANGED, from: tv, to: snLeaf.$value });
        }
      } else {
        const snVal = JSON.stringify(DiffEngine.#normalizeValue(snLeaf.$value));
        const tierVal = JSON.stringify(DiffEngine.#normalizeValue(tv));
        if (snVal !== tierVal) {
          this.#changes.push({ ...base, type: ChangeType.VALUE_CHANGED, from: tv, to: snLeaf.$value });
        }
      }
      classified = true;
    }

    // Mode value changes (compare snapshot modes vs tier values).
    // Snapshot uses Figma's full alias path (e.g. {semantics.colors.text.on surface.primary});
    // tiers use our normalized short path ({colors.text.on-surface.primary}).
    // Normalize before comparing so path-format differences don't emit false positives.
    const snModes = snLeaf.$extensions?.modes ?? {};
    const tierValues = tierLeaf.values ?? {};
    for (const [modeKey, snModeVal] of Object.entries(snModes)) {
      const normalizedKey = modeKey.toLowerCase().replace(/\s+/g, '-');
      const tierModeVal = tierValues[normalizedKey];
      if (tierModeVal !== undefined) {
        const normSn = DiffEngine.#normalizeValue(snModeVal);
        const normTier = DiffEngine.#normalizeValue(tierModeVal);
        if (JSON.stringify(normSn) !== JSON.stringify(normTier)) {
          this.#changes.push({ ...base, type: ChangeType.MODE_VALUE_CHANGED, mode: normalizedKey, from: tierModeVal, to: snModeVal });
          classified = true;
        }
      }
    }

    // com.figma.* extension diffs (skip com.acronis.* — hand-authored).
    const snFigmaExt = this.#figmaExtFields(snLeaf.$extensions ?? {});
    const tierFigmaExt = this.#figmaExtFields(tierLeaf.$extensions ?? {});

    for (const key of new Set([...Object.keys(snFigmaExt), ...Object.keys(tierFigmaExt)])) {
      const inSn = key in snFigmaExt;
      const inTier = key in tierFigmaExt;
      if (key === 'com.figma.variableId') continue; // always present both sides

      if (inSn && !inTier) {
        this.#changes.push({ ...base, type: ChangeType.EXTENSION_ADDED, key, value: snFigmaExt[key] });
        classified = true;
      } else if (!inSn && inTier) {
        this.#changes.push({ ...base, type: ChangeType.EXTENSION_REMOVED, key, value: tierFigmaExt[key] });
        classified = true;
      } else if (inSn && inTier) {
        if (key === 'com.figma.scopes') {
          const snArr = [...(snFigmaExt[key] ?? [])].sort();
          const tierArr = [...(tierFigmaExt[key] ?? [])].sort();
          if (JSON.stringify(snArr) !== JSON.stringify(tierArr)) {
            this.#changes.push({ ...base, type: ChangeType.SCOPES_CHANGED, from: tierFigmaExt[key], to: snFigmaExt[key] });
            classified = true;
          }
        } else if (key === 'com.figma.hiddenFromPublishing') {
          if (snFigmaExt[key] !== tierFigmaExt[key]) {
            this.#changes.push({ ...base, type: ChangeType.HIDDEN_CHANGED, from: tierFigmaExt[key], to: snFigmaExt[key] });
            classified = true;
          }
        } else if (JSON.stringify(snFigmaExt[key]) !== JSON.stringify(tierFigmaExt[key])) {
          this.#changes.push({ ...base, type: ChangeType.EXTENSION_VALUE_CHANGED, key, from: tierFigmaExt[key], to: snFigmaExt[key] });
          classified = true;
        }
      }
    }

    // If nothing classified but the tokens differ, emit UNCLASSIFIED.
    // Flatten snapshot ($value + modes) and tier ($value + values) into a single
    // "allValues" map so structural format differences don't produce false positives:
    //   - snapshot uses $extensions.modes; tiers use `values`
    //   - snapshot always has $value; tiers may omit it (components only store values.acronis)
    // Include `default` in the comparison only when BOTH sides have $value.
    if (!classified) {
      const sortedObj = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
      const includeDefault = snLeaf.$value !== undefined && tierLeaf.$value !== undefined;
      const toAllValues = ($value, modeOrValues) => sortedObj(Object.fromEntries([
        ...(includeDefault ? [['default', DiffEngine.#normalizeValue($value)]] : []),
        ...Object.entries(modeOrValues).map(([k, v]) => [
          k.toLowerCase().replace(/\s+/g, '-'),
          DiffEngine.#normalizeValue(v),
        ]),
      ]));
      // $type is intentionally excluded: primitives/semantics tiers declare
      // $type on the group, not the leaf, so the snapshot leaf carries it inline
      // while the tier leaf does not — comparing them yields false positives.
      // Real $type changes are caught by the explicit TYPE_CHANGED check above.
      const snSig = JSON.stringify({
        allValues: toAllValues(snLeaf.$value, snModes),
        ext: sortedObj(snFigmaExt),
      });
      const tierSig = JSON.stringify({
        allValues: toAllValues(tierLeaf.$value, tierValues),
        ext: sortedObj(tierFigmaExt),
      });
      if (snSig !== tierSig) {
        this.#changes.push({ ...base, type: ChangeType.UNCLASSIFIED, snapshot: snLeaf, tiers: tierLeaf });
      }
    }
  }

  #figmaExtFields(ext) {
    const out = {};
    for (const [k, v] of Object.entries(ext)) {
      if (k.startsWith('com.figma.')) out[k] = v;
    }
    return out;
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  #diffStyles() {
    const snapshotStyles = [
      ...this.#snapshot.styles.text.map(s => ({ ...s, _category: 'text' })),
      ...this.#snapshot.styles.color.map(s => ({ ...s, _category: 'color' })),
      ...this.#snapshot.styles.effect.map(s => ({ ...s, _category: 'effect' })),
    ];
    const tiersStyleIndex = this.#tiersReader.styleIndex;
    const snapshotStyleIndex = new Map(snapshotStyles.map(s => [s.id, s]));

    for (const snStyle of snapshotStyles) {
      if (!tiersStyleIndex.has(snStyle.id)) {
        this.#changes.push({ type: ChangeType.STYLE_ADDED, styleId: snStyle.id, style: snStyle });
      } else {
        const tierEntry = tiersStyleIndex.get(snStyle.id);
        // Basic style change detection: compare name and a few key fields.
        const changed = this.#styleChanged(snStyle, tierEntry.leaf);
        if (changed) {
          this.#changes.push({ type: ChangeType.STYLE_CHANGED, styleId: snStyle.id, tier: tierEntry.tier, ourPath: tierEntry.path, changes: changed });
        }
      }
    }

    for (const [styleId, tierEntry] of tiersStyleIndex) {
      if (!snapshotStyleIndex.has(styleId)) {
        this.#changes.push({ type: ChangeType.STYLE_DELETED, styleId, tier: tierEntry.tier, ourPath: tierEntry.path });
      }
    }
  }

  #styleChanged(snStyle, tierToken) {
    const diffs = [];
    // The tier stores the styleId but the actual style data lives in $value (for typography).
    // We just report the snapshot style name vs what's in tiers.
    if (snStyle.name && tierToken._snapshotName && snStyle.name !== tierToken._snapshotName) {
      diffs.push({ field: 'name', from: tierToken._snapshotName, to: snStyle.name });
    }
    return diffs.length > 0 ? diffs : null;
  }

  // Normalize an alias value so snapshot paths match tier paths:
  //   {semantics.colors.text.on surface.primary} → {colors.text.on-surface.primary}
  //   {components.button.label.color.idle}        → {button.label.color.idle}
  // Non-alias values are returned as-is.
  static #normalizeValue(value) {
    // Objects (e.g. DTCG color { colorSpace, components, alpha }) are compared by
    // JSON.stringify elsewhere, so canonicalize key order — Figma-derived and
    // emitted objects can carry the same fields in different orders. Arrays keep
    // their order ([h, s, l] is positional).
    if (value && typeof value === 'object') return DiffEngine.#sortKeysDeep(value);
    if (typeof value !== 'string' || !value.startsWith('{')) return value;
    let inner = value.slice(1, -1);
    inner = inner.replace(/^(semantics|components)\./, '');
    inner = inner.replace(/ /g, '-');
    return `{${inner}}`;
  }

  static #sortKeysDeep(value) {
    if (Array.isArray(value)) return value.map(DiffEngine.#sortKeysDeep);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.keys(value).sort().map(k => [k, DiffEngine.#sortKeysDeep(value[k])]),
      );
    }
    return value;
  }

  // Infer which tier a snapshot token belongs to from its Figma path.
  //   ['brand', 'components', ...] → 'components'
  //   ['brand', 'semantics', ...]  → 'semantics'
  //   ['theme', ...]               → 'primitives'
  static #inferTier(path) {
    if (path[0] === 'brand' && path[1] === 'components') return 'components';
    if (path[0] === 'brand' && path[1] === 'semantics')  return 'semantics';
    if (path[0] === 'theme')                              return 'primitives';
    return null;
  }
}
