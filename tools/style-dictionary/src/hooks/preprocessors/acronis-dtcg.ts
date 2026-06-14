// Preprocessor: normalize an Acronis token tree into a per-mode, DTCG-conformant
// tree. This is stage 1's real work, expressed as a Style Dictionary hook so the
// vendor divergences are resolved inside SD's pipeline (preprocessors run on the
// token object before resolution/expansion). See context/pipeline.md.
//
// Acronis tokens diverge from DTCG in two ways this pass resolves:
//   - per-mode `values` dict          → a single `$value` for the requested mode
//   - top-level `platforms` array     → filtered on, then dropped (non-DTCG)
//
// Every `$value` is already native DTCG (dimension `{ value, unit }`, composites,
// scalars, aliases) and passes through untouched. `$extensions` is retained for
// traceability; `{group.token}` alias strings are kept as references (resolution
// happens later, in the CSS builder).

import type { Preprocessor, PreprocessedTokens } from 'style-dictionary/types';

export const ACRONIS_DTCG = 'acronis/dtcg';

type Node = Record<string, unknown>;

const isObject = (v: unknown): v is Node =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isToken = (node: Node): boolean => 'values' in node || '$value' in node;

function normalizeToken(
  node: Node,
  type: string | undefined,
  mode: string,
  platformId: string
): Node | undefined {
  const platforms = node['platforms'];
  if (!Array.isArray(platforms) || !platforms.includes(platformId))
    return undefined;

  let value: unknown;
  if (isObject(node['values'])) {
    if (!(mode in node['values'])) return undefined; // token doesn't define this mode
    value = node['values'][mode];
  } else {
    // Mode-invariant `$value`: already native DTCG (dimension { value, unit },
    // composite, scalar, or `{group.token}` alias) — passes through untouched.
    value = node['$value'];
  }

  const token: Node = {};
  if (type) token['$type'] = type;
  token['$value'] = value;
  if (typeof node['$description'] === 'string')
    token['$description'] = node['$description'];
  if ('$deprecated' in node) token['$deprecated'] = node['$deprecated'];
  if (isObject(node['$extensions'])) token['$extensions'] = node['$extensions'];
  return token;
}

function walk(
  node: Node,
  inheritedType: string | undefined,
  mode: string,
  platformId: string
): Node | undefined {
  const ownType = typeof node['$type'] === 'string' ? node['$type'] : undefined;
  const type = ownType ?? inheritedType;

  if (isToken(node)) return normalizeToken(node, type, mode, platformId);

  // Group node: recurse children, carrying $type/$description through. A group
  // whose every child was omitted for this mode is itself omitted.
  const group: Node = {};
  if (ownType) group['$type'] = ownType;
  if (typeof node['$description'] === 'string')
    group['$description'] = node['$description'];

  let kept = 0;
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$') || key === 'platforms') continue;
    if (!isObject(child)) continue;
    const normalized = walk(child, type, mode, platformId);
    if (normalized !== undefined) {
      group[key] = normalized;
      kept += 1;
    }
  }
  return kept > 0 ? group : undefined;
}

/**
 * Normalize a source token tree for one mode, keeping only tokens scoped to
 * `platformId` (the `platforms` enum value). Returns a fresh DTCG tree.
 */
export function normalizeTree(
  root: Node,
  mode: string,
  platformId: string
): PreprocessedTokens {
  return (walk(root, undefined, mode, platformId) ?? {}) as PreprocessedTokens;
}

/**
 * Build the `acronis/dtcg` preprocessor for one mode + platform. A fresh
 * instance is created per view (each closes over its own `mode`/`platformId`)
 * and registered inline on a Style Dictionary instance to normalize its source
 * within the SD pipeline.
 */
export function acronisDtcg(mode: string, platformId: string): Preprocessor {
  return {
    name: ACRONIS_DTCG,
    preprocessor: (tokens) => normalizeTree(tokens as Node, mode, platformId),
  };
}
