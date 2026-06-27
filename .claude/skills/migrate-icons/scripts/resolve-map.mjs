// Resolve an app's legacy @acronis-platform/shadcn-uikit icon imports to
// @acronis-platform/icons-react names using the AUTHORITATIVE map shipped with
// icons-react (`@acronis-platform/icons-react/legacy-map`). No guessing, no
// monorepo checkout — the map is generated from the design-assets legacyNames
// bridge and published with the package.
//
// Usage:
//   TARGET=stroke-mono node resolve-map.mjs [used-icons.txt]
//     - used-icons.txt: optional newline list of legacy names (e.g. EditIcon).
//       If omitted, the script inventories `src` for icons imported from FROM.
//   Env: TARGET (default stroke-mono) · FROM (default @acronis-platform/shadcn-uikit)
//        MAP (override path to legacy-icon-map.json; default = resolved from the
//             installed icons-react, falling back to node_modules)
// Writes ./.icon-migration/iconmap.json and prints the triage (colored / target-
// gap / unresolved) you must decide on before applying.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const TARGET = process.env.TARGET || 'stroke-mono';
const FROM = process.env.FROM || '@acronis-platform/shadcn-uikit';

function findMap() {
  if (process.env.MAP) return process.env.MAP;
  const req = createRequire(process.cwd() + '/');
  try {
    return req.resolve('@acronis-platform/icons-react/legacy-map');
  } catch {
    return 'node_modules/@acronis-platform/icons-react/legacy-icon-map.json';
  }
}

const M = JSON.parse(readFileSync(findMap(), 'utf8'));

// Inventory: explicit file, else grep imports from FROM for `*Icon` specifiers.
let used;
if (process.argv[2]) {
  used = readFileSync(process.argv[2], 'utf8').split('\n');
} else {
  const esc = FROM.replace(/[/.\-]/g, (m) => `\\${m}`);
  let blocks = '';
  try {
    blocks = execSync(
      `grep -rhzoE "import[^;]*from ['\\"]${esc}['\\"]" src --include='*.ts' --include='*.tsx'`,
      { encoding: 'utf8' }
    );
  } catch {
    /* no matches */
  }
  used = blocks.match(/\b[A-Z][A-Za-z0-9]*Icon\b/g) || [];
}
used = [...new Set(used.map((s) => s.trim()).filter(Boolean))].sort();

const map = {};
const colored = [];
const targetGap = [];
const unresolved = [];

for (const icon of used) {
  const m = M.icons?.[icon];
  if (m) {
    const hit = m.variants?.[TARGET];
    if (hit) {
      map[icon] = hit;
    } else {
      const where = Object.entries(m.variants || {})
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}:${v}`);
      targetGap.push([icon, where.join(', ') || '(none)']);
    }
    continue;
  }
  if (M.colored?.[icon]) {
    const c = M.colored[icon];
    colored.push([icon, Object.entries(c.multi || {}).map(([k, v]) => `${k}:${v}`).join(', ')]);
    continue;
  }
  unresolved.push([icon, M.unresolved?.[icon] || 'NOT_IN_MAP']);
}

mkdirSync('.icon-migration', { recursive: true });
writeFileSync('.icon-migration/iconmap.json', JSON.stringify(map, null, 2) + '\n');
console.log(
  `mapped ${Object.keys(map).length}/${used.length} → .icon-migration/iconmap.json (TARGET=${TARGET})`
);

const dump = (title, rows, hint) => {
  if (!rows.length) return;
  console.log(`\n${title} (${rows.length}) — ${hint}`);
  for (const [a, b] of rows) console.log(`  ${a.padEnd(26)} ${b}`);
};
dump(
  'COLORED status/brand icons',
  colored,
  'no monochrome equivalent. Keep on multicolor pack, OR map to a mono base + a color className — do NOT silently flatten status color. Add chosen entries to iconmap.json by hand.'
);
dump(
  `Present, but not in TARGET=${TARGET}`,
  targetGap,
  'exists in another variant. Switch TARGET, import per-icon from the listed pack, or pick a TARGET-pack alternative.'
);
dump(
  'UNRESOLVED',
  unresolved,
  'logos/illustrations or genuinely absent. Hold on the legacy package, or add the asset upstream (icons-svg-next).'
);
