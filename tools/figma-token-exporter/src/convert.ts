// Variable → DTCG serialization.
//
// This is a faithful, trimmed port of figma-console-mcp's pipeline
// (MIT — southleft/figma-console-mcp: dist/core/tokens/figma-converter.js +
// formatters/dtcg.js + alias-resolver.js), restricted to the single-file,
// all-modes export shape that this repo's design-tokens emitters consume.
//
// Faithfulness is the whole point: the `/figma-to-design-tokens` skill's
// snapshot loader + tier emitters were written against figma-console's output,
// so reproducing the exact transform (slugified collection key, slash→path
// variable names, `lastSyncedValue` keyed by mode name with {reference}|{literal},
// primary mode in `$value` and others under `$extensions.modes`) yields a drop-in
// snapshot. Do not "improve" the shape here — change the emitters instead.

import type {
  ExportPayload,
  RawVariable,
  RawCollection,
  RawMode,
  FigmaVariableValue,
  FigmaVariableAlias,
  FigmaRgba,
  FigmaResolvedType,
  Token,
  TokenDocument,
  TokenSet,
  TokenType,
  TokenValue,
} from './types.js';

export const FIGMA_MCP_EXTENSION_KEY = 'figma-console-mcp';

// ---------------------------------------------------------------------------
// payload → TokenDocument  (port of figma-converter.js)
// ---------------------------------------------------------------------------

export function convertPayloadToDocument(payload: ExportPayload): TokenDocument {
  // Reference resolution uses LOCAL variables only — exactly like
  // figma-console. An alias to a non-local target is encoded as
  // `{__library:VariableID:X:Y}` so the semantic emitter's library-alias branch
  // can resolve it and the orphan-coverage gate can spot the ID. The resolved
  // orphan metadata (from the plugin's getVariableByIdAsync) feeds the meta
  // sidecar instead — never the reference path.
  const variableById = new Map<string, RawVariable>();
  for (const v of payload.variables) variableById.set(v.id, v);

  const sets = payload.collections.map((collection) => {
    const wantedModes = modesDefaultFirst(collection);
    const collectionVars = payload.variables.filter(
      (v) => v.variableCollectionId === collection.id,
    );
    const tokens = collectionVars.map((variable) =>
      convertVariable(variable, wantedModes, variableById),
    );
    const set: TokenSet = {
      name: collection.name,
      modes: wantedModes.map((m) => m.name),
      tokens,
      meta: { figmaCollectionId: collection.id },
    };
    return set;
  });

  return {
    sets,
    meta: {
      figmaFileKey: payload.fileKey,
      exportedAt: new Date(payload.exportedAt).toISOString(),
    },
  };
}

// Put the collection's default mode first. `renderToken` uses the first mode
// for the token's `$value` and stashes the rest under `$extensions.modes`, and
// figma-to-primitives expects the default (e.g. Light) in `$value` and Dark
// under `modes.Dark` — so order by `defaultModeId`, not Figma's array order.
function modesDefaultFirst(collection: RawCollection): RawMode[] {
  const def = collection.modes.find((m) => m.modeId === collection.defaultModeId);
  if (!def) return collection.modes;
  return [def, ...collection.modes.filter((m) => m.modeId !== collection.defaultModeId)];
}

function convertVariable(
  variable: RawVariable,
  wantedModes: RawMode[],
  variableById: Map<string, RawVariable>,
): Token {
  const path = variable.name.split('/').filter(Boolean);
  const type = mapResolvedType(variable.resolvedType, variable.name);

  // Null-prototype map: keys are Figma mode names (untrusted input), so a
  // literal `__proto__`/`constructor` mode can't pollute Object.prototype.
  const values: Record<string, TokenValue> = Object.create(null);
  for (const mode of wantedModes) {
    const rawValue = variable.valuesByMode[mode.modeId];
    if (rawValue === undefined) continue;
    values[mode.name] = convertValue(rawValue, variable.resolvedType, variableById);
  }

  return {
    path,
    type,
    description: variable.description || undefined,
    values,
    extensions: {
      [FIGMA_MCP_EXTENSION_KEY]: {
        variableId: variable.id,
        collectionId: variable.variableCollectionId,
        // lastSyncedValue mirrors `values` — this is the field the semantic /
        // components emitters actually read (reference|literal per mode name).
        lastSyncedValue: { ...values },
      },
    },
  };
}

function mapResolvedType(resolvedType: FigmaResolvedType, variableName: string): TokenType {
  switch (resolvedType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return inferFloatType(variableName);
    case 'STRING':
      return inferStringType(variableName);
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'string';
  }
}

function inferFloatType(variableName: string): TokenType {
  const lower = variableName.toLowerCase();
  if (lower.includes('opacity') || lower.includes('alpha')) return 'number';
  if (lower.includes('font-weight') || lower.includes('weight')) return 'fontWeight';
  if (lower.includes('duration') || lower.includes('delay')) return 'duration';
  return 'dimension';
}

function inferStringType(variableName: string): TokenType {
  const lower = variableName.toLowerCase();
  if (lower.includes('font-family') || lower.includes('font/family')) return 'fontFamily';
  return 'string';
}

function convertValue(
  rawValue: FigmaVariableValue,
  resolvedType: FigmaResolvedType,
  variableById: Map<string, RawVariable>,
): TokenValue {
  if (isVariableAlias(rawValue)) {
    const target = variableById.get(rawValue.id);
    if (!target) {
      // Cross-library / unresolved alias — preserve the ID so the orphan gate
      // and round-trip can recover it; matches figma-console's encoding.
      return { reference: `{__library:${rawValue.id}}` };
    }
    const dotPath = target.name.replace(/\//g, '.');
    return { reference: `{${dotPath}}` };
  }

  if (resolvedType === 'COLOR') {
    if (typeof rawValue === 'object' && rawValue !== null && 'r' in rawValue) {
      return { literal: rgbaToHex(rawValue as FigmaRgba) };
    }
    return { literal: String(rawValue) };
  }
  if (resolvedType === 'FLOAT') {
    return { literal: typeof rawValue === 'number' ? rawValue : Number(rawValue) };
  }
  if (resolvedType === 'BOOLEAN') {
    return { literal: Boolean(rawValue) };
  }
  return { literal: typeof rawValue === 'string' ? rawValue : String(rawValue) };
}

function isVariableAlias(value: FigmaVariableValue): value is FigmaVariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as { type?: string }).type === 'VARIABLE_ALIAS'
  );
}

function rgbaToHex(rgba: FigmaRgba): string {
  const r = clampByte(rgba.r);
  const g = clampByte(rgba.g);
  const b = clampByte(rgba.b);
  const a = rgba.a ?? 1;
  const hex = `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
  if (a >= 1) return hex;
  return `${hex}${byteToHex(clampByte(a))}`;
}

function clampByte(f: number): number {
  return Math.max(0, Math.min(255, Math.round(f * 255)));
}

function byteToHex(byte: number): string {
  return byte.toString(16).padStart(2, '0').toUpperCase();
}

// ---------------------------------------------------------------------------
// TokenDocument → DTCG tree  (port of formatters/dtcg.js, single-file mode)
// ---------------------------------------------------------------------------

type DtcgNode = Record<string, unknown>;

export function buildDtcgTree(doc: TokenDocument): DtcgNode {
  // Null-prototype containers throughout the tree build: keys derive from Figma
  // variable names / mode names (untrusted), so a `__proto__` segment becomes a
  // plain own property instead of polluting Object.prototype.
  const tree: DtcgNode = Object.create(null);

  const mcpDocMeta: Record<string, unknown> = {};
  if (doc.meta?.figmaFileKey) mcpDocMeta.figmaFileKey = doc.meta.figmaFileKey;
  if (doc.meta?.exportedAt) mcpDocMeta.exportedAt = doc.meta.exportedAt;
  if (Object.keys(mcpDocMeta).length > 0) {
    tree.$extensions = { [FIGMA_MCP_EXTENSION_KEY]: mcpDocMeta };
  }

  for (const set of doc.sets) {
    const setKey = slugify(set.name);
    let setGroup = tree[setKey] as DtcgNode | undefined;
    if (!setGroup) {
      setGroup = Object.create(null) as DtcgNode;
      const mcpMeta: Record<string, unknown> = {};
      if (set.meta?.figmaCollectionId) mcpMeta.figmaCollectionId = set.meta.figmaCollectionId;
      if (set.name !== setKey) mcpMeta.originalName = set.name;
      if (Object.keys(mcpMeta).length > 0) {
        setGroup.$extensions = { [FIGMA_MCP_EXTENSION_KEY]: mcpMeta };
      }
      tree[setKey] = setGroup;
    }
    for (const token of set.tokens) {
      writeTokenIntoTree(setGroup, token, set.modes);
    }
  }

  return sortKeys(tree) as DtcgNode;
}

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    // Runs are already collapsed to a single '-' above, so a single anchored
    // strip per side is sufficient — and avoids the backtracking-prone
    // `/^-+|-+$/` alternation (ReDoS).
    .replace(/^-/, '')
    .replace(/-$/, '');
}

function writeTokenIntoTree(root: DtcgNode, token: Token, setModes: string[]): void {
  let cursor = root;
  for (let i = 0; i < token.path.length - 1; i++) {
    const segment = token.path[i];
    let next = cursor[segment] as DtcgNode | undefined;
    if (!next || isToken(next)) {
      next = Object.create(null) as DtcgNode;
      cursor[segment] = next;
    }
    cursor = next;
  }
  const leafKey = token.path[token.path.length - 1];
  cursor[leafKey] = renderToken(token, setModes);
}

function isRecordLike(node: unknown): node is Record<string, unknown> {
  return Object(node) === node && !Array.isArray(node);
}

function isToken(node: unknown): boolean {
  return isRecordLike(node) && '$value' in node;
}

function renderToken(token: Token, setModes: string[]): DtcgNode {
  const result: DtcgNode = { $value: '', $type: token.type };
  if (token.description) result.$description = token.description;

  const modeKeys = Object.keys(token.values);
  if (modeKeys.length === 1) {
    result.$value = encodeValue(token.values[modeKeys[0]]);
  } else if (modeKeys.length > 1) {
    const primaryMode = setModes[0] in token.values ? setModes[0] : modeKeys[0];
    result.$value = encodeValue(token.values[primaryMode]);
    const otherModes: Record<string, unknown> = Object.create(null);
    for (const m of modeKeys) {
      if (m === primaryMode) continue;
      otherModes[m] = encodeValue(token.values[m]);
    }
    if (Object.keys(otherModes).length > 0) mergeExtension(result, 'modes', otherModes);
  }

  if (token.extensions) {
    for (const [vendor, payload] of Object.entries(token.extensions)) {
      mergeExtension(result, vendor, payload);
    }
  }
  return result;
}

function encodeValue(value: TokenValue | undefined): string | number | boolean {
  if (value?.reference) {
    // Normalize to DTCG brace form, idempotent if already wrapped.
    return `{${value.reference.replace(/^\{|\}$/g, '')}}`;
  }
  if (value?.literal === undefined) return '';
  return value.literal;
}

function mergeExtension(node: DtcgNode, key: string, payload: unknown): void {
  if (!node.$extensions) node.$extensions = Object.create(null);
  (node.$extensions as Record<string, unknown>)[key] = payload;
}

function sortKeys(node: unknown): unknown {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return node;
  const obj = node as Record<string, unknown>;
  const sorted: Record<string, unknown> = Object.create(null);
  const keys = Object.keys(obj).sort((a, b) => {
    const aDollar = a.startsWith('$');
    const bDollar = b.startsWith('$');
    if (aDollar && !bDollar) return -1;
    if (!aDollar && bDollar) return 1;
    return a.localeCompare(b);
  });
  for (const k of keys) sorted[k] = sortKeys(obj[k]);
  return sorted;
}
