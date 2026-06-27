/**
 * Generate the authoritative legacy-icon → icons-react name map.
 *
 * Output: `packages/icons-react/legacy-icon-map.json`, shipped with the package
 * (subpath export `@acronis-platform/icons-react/legacy-map`) so any consumer —
 * every MFE migrating off `@acronis-platform/shadcn-uikit` — resolves names from
 * the package itself, with no monorepo checkout.
 *
 * The map is built from three sources in this monorepo (never by guessing /
 * SVG-path matching — the legacy and next-gen art grids differ):
 *   1. ui-legacy `auto-generated.tsx` — legacy React name → source svg name
 *      (e.g. `EditIcon` ← `edit--16.svg`).
 *   2. design-assets `packs/icons.json` — `metadata.legacyNames` → canonical
 *      asset key (e.g. `edit--16` → `Pencil`).
 *   3. the four icons-react packs — which `<Asset>Icon` actually exist per variant.
 *
 * An icon present only in `*-multi` packs (not mono) is inherently colored — it's
 * classified `colored` (needs a human decision when targeting a mono pack), not
 * silently flattened. The output is deterministic (no timestamp) so re-running
 * only changes it when the icon set changes.
 *
 * Run: `pnpm --filter @acronis-platform/icons-react generate:legacy-map`
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = join(HERE, '..');
const MONOREPO = join(PKG, '..', '..');

const VARIANTS = ['stroke-mono', 'solid-mono', 'stroke-multi', 'solid-multi'] as const;
type Variant = (typeof VARIANTS)[number];
const MONO: Variant[] = ['stroke-mono', 'solid-mono'];

// 1. legacy React name -> source svg name (strip extension)
const autoGen = readFileSync(
  join(MONOREPO, 'packages/ui-legacy/src/components/icons/auto-generated.tsx'),
  'utf8'
);
const legacyToSource = new Map<string, string>();
for (const m of autoGen.matchAll(
  /\* ([A-Z][A-Za-z0-9]*Icon) - Auto-generated from ([^\s*]+)/g
)) {
  legacyToSource.set(m[1], m[2].replace(/\.svg$/, ''));
}

// 2. source/legacy name -> canonical asset key (via design-assets legacyNames)
const pack = JSON.parse(
  readFileSync(join(MONOREPO, 'packages/design-assets/packs/icons.json'), 'utf8')
) as { assetsGroups?: Record<string, { assets?: Record<string, { metadata?: { legacyNames?: string[] } }> }> };
const sourceToAssets = new Map<string, Set<string>>();
for (const grp of Object.values(pack.assetsGroups ?? {})) {
  for (const [asset, a] of Object.entries(grp.assets ?? {})) {
    for (const l of a.metadata?.legacyNames ?? []) {
      if (!sourceToAssets.has(l)) sourceToAssets.set(l, new Set());
      sourceToAssets.get(l)!.add(asset);
    }
  }
}

// 3. available `<Name>Icon` per variant pack
const packNames: Record<Variant, Set<string>> = {} as Record<Variant, Set<string>>;
for (const v of VARIANTS) {
  const idx = readFileSync(join(PKG, 'src/packs', v, 'index.ts'), 'utf8');
  packNames[v] = new Set(idx.match(/\b[A-Z][A-Za-z0-9]+Icon\b/g) ?? []);
}

const resolveAsset = (source: string): string[] | null => {
  const base = source.replace(/--\d+$/, '');
  for (const c of [source, base, `${base}--16`, `${base}--24`, `${base}--32`]) {
    if (sourceToAssets.has(c)) return [...sourceToAssets.get(c)!];
  }
  return null;
};

const icons: Record<string, { asset: string; source: string; variants: Record<string, string | null> }> = {};
const colored: Record<string, { asset: string; source: string; multi: Record<string, string>; note: string }> = {};
const unresolved: Record<string, string> = {};

for (const [legacy, source] of [...legacyToSource].sort((a, b) => a[0].localeCompare(b[0]))) {
  const assets = resolveAsset(source);
  if (!assets) {
    unresolved[legacy] = 'NO_LEGACY_NAME_MATCH';
    continue;
  }
  // Prefer an asset whose `<Asset>Icon` exists in a mono pack; else any.
  const pick = (pred: (n: string) => boolean) =>
    assets.map((a) => ({ a, n: `${a}Icon` })).find(({ n }) => pred(n));
  const monoHit = pick((n) => MONO.some((v) => packNames[v].has(n)));
  const anyHit = monoHit ?? pick((n) => VARIANTS.some((v) => packNames[v].has(n)));
  if (!anyHit) {
    unresolved[legacy] = `NOT_IN_ANY_PACK(${assets.map((a) => `${a}Icon`).join('|')})`;
    continue;
  }
  const name = anyHit.n;
  const variants = Object.fromEntries(
    VARIANTS.map((v) => [v, packNames[v].has(name) ? name : null])
  );
  if (monoHit) {
    icons[legacy] = { asset: anyHit.a, source, variants };
  } else {
    // present only in multi packs → inherently colored
    colored[legacy] = {
      asset: anyHit.a,
      source,
      multi: Object.fromEntries(
        (['stroke-multi', 'solid-multi'] as Variant[])
          .filter((v) => variants[v])
          .map((v) => [v, name])
      ),
      note: 'colored glyph — no monochrome equivalent; keep multicolor or pick a mono base + a color className. Do not silently flatten status color.',
    };
  }
}

const out = {
  $comment:
    'AUTHORITATIVE legacy @acronis-platform/shadcn-uikit icon name -> @acronis-platform/icons-react name. Generated from the design-assets legacyNames bridge — do not hand-edit. Regenerate: pnpm --filter @acronis-platform/icons-react generate:legacy-map',
  meta: {
    defaultVariant: 'stroke-mono',
    variants: VARIANTS,
    counts: {
      total: legacyToSource.size,
      mapped: Object.keys(icons).length,
      colored: Object.keys(colored).length,
      unresolved: Object.keys(unresolved).length,
    },
  },
  icons,
  colored,
  unresolved,
};

writeFileSync(join(PKG, 'legacy-icon-map.json'), JSON.stringify(out, null, 2) + '\n');
console.log(
  `legacy-icon-map.json: ${out.meta.counts.mapped} mapped, ${out.meta.counts.colored} colored, ${out.meta.counts.unresolved} unresolved (of ${out.meta.counts.total})`
);
