// CLI home. Parses the requested platform keys / filters / packs and dispatches to
// the two build domains — tokens (`./tokens`) and assets (`./assets`) — in
// dependency order (css reads dtcg). The shared platform-key axes and output
// locations live in `./platforms`; all translation logic lives in those domains,
// not here.
//
// A platform key is `${filter}-${output}`, the CLI selector. Usage:
//   tsx src/index.ts                                                all filters, all outputs
//   tsx src/index.ts pd-css                                         one platform (runs its dtcg dep first)
//   tsx src/index.ts pd-assets web-assets --pack=icons-stroke-mono  one asset pack only
//   tsx src/index.ts --filter=web                                   restrict to one filter

import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import { type AssetFilter, buildAssetsForFilter, listPackNames } from './assets';
import {
  ALL_FILTERS,
  ASSETS_DIST,
  type Filter,
  filtersFor,
  type Output,
  OUTPUTS,
  type PlatformKey,
  rel,
} from './platforms';
import { buildCss, buildDtcg } from './tokens';

/** Enumerate the asset pack names (`packs/*.json` stems, = each pack's `name`). */
const availablePacks = (): string[] => listPackNames();

// ── Assets dispatch ──────────────────────────────────────────────────────────
// The asset build's source is @acronis-platform/design-assets (SVG packs), NOT the
// design tokens — its own domain (`./assets`). This wrapper resets the filter's
// deliverables on a full build and hands off. `packs` selects a subset (CI rebuilds
// only the packs that changed); undefined = all packs (this filter's deliverables
// are reset).

function buildAssets(filter: Filter, packs?: string[]): void {
  if (!packs && existsSync(ASSETS_DIST)) {
    for (const entry of readdirSync(ASSETS_DIST)) {
      if (entry.startsWith(`${filter}-`)) {
        rmSync(path.join(ASSETS_DIST, entry), { recursive: true, force: true });
      }
    }
  }
  mkdirSync(ASSETS_DIST, { recursive: true });
  buildAssetsForFilter({
    filter: filter as AssetFilter,
    packs,
    outDir: ASSETS_DIST,
    log: (msg) => console.log(`✓ ${rel(ASSETS_DIST)}/${msg}`),
  });
}

// ── CLI ────────────────────────────────────────────────────────────────────────

/** One requested build target, split into its two axes. */
type Pair = { filter: Filter; output: Output };

const validKeys = (): PlatformKey[] =>
  OUTPUTS.flatMap((o) => filtersFor(o).map((f): PlatformKey => `${f}-${o}`));

function parseKey(key: string): Pair {
  // Neither a filter (pd/web) nor an output (dtcg/css/assets) contains a dash,
  // so the last dash is always the boundary between them.
  const dash = key.lastIndexOf('-');
  if (dash <= 0 || dash === key.length - 1) {
    throw new Error(`Unknown platform: ${key}. Known: ${validKeys().join(', ')}.`);
  }
  const filter = key.slice(0, dash) as Filter;
  const output = key.slice(dash + 1) as Output;
  if (!OUTPUTS.includes(output) || !filtersFor(output).includes(filter)) {
    throw new Error(`Unknown platform: ${key}. Known: ${validKeys().join(', ')}.`);
  }
  return { filter, output };
}

interface ParsedArgs {
  packs: string[] | undefined;
  pairs: Pair[];
}

/** Turn `process.argv` into the packs and build pairs to run. */
function parseArgs(args: string[]): ParsedArgs {
  const filterArg = args
    .find((a) => a.startsWith('--filter='))
    ?.slice('--filter='.length) as Filter | undefined;
  if (filterArg && !ALL_FILTERS.includes(filterArg)) {
    throw new Error(`Unknown filter: ${filterArg}. Known: ${ALL_FILTERS.join(', ')}.`);
  }
  const filters = filterArg ? [filterArg] : ALL_FILTERS;

  const packArgs = args
    .filter((a) => a.startsWith('--pack='))
    .flatMap((a) => a.slice('--pack='.length).split(','))
    .map((s) => s.trim())
    .filter(Boolean);
  const packs = packArgs.length ? packArgs : undefined;
  if (packs) {
    const known = availablePacks();
    const unknown = packs.filter((p) => !known.includes(p));
    if (unknown.length) {
      throw new Error(`Unknown pack(s): ${unknown.join(', ')}. Known: ${known.join(', ')}.`);
    }
  }

  const requestedKeys = args.filter((a) => !a.startsWith('-'));
  const pairs = requestedKeys.length
    ? requestedKeys.map(parseKey).filter((p) => filters.includes(p.filter))
    : OUTPUTS.flatMap((o) =>
        filtersFor(o)
          .filter((f) => filters.includes(f))
          .map((f): Pair => ({ filter: f, output: o }))
      );

  return { packs, pairs };
}

async function main(): Promise<void> {
  const { packs, pairs } = parseArgs(process.argv.slice(2));

  // css reads the dtcg files, so build dtcg first for any filter needing them.
  const dtcgFilters = new Set<Filter>();
  for (const { filter, output } of pairs) {
    if (output === 'dtcg' || output === 'css') dtcgFilters.add(filter);
  }
  for (const filter of dtcgFilters) buildDtcg(filter);
  for (const { filter, output } of pairs) if (output === 'css') await buildCss(filter);
  for (const { filter, output } of pairs) if (output === 'assets') buildAssets(filter, packs);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
