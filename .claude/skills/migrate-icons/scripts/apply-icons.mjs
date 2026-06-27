// Apply a legacy → new icon map across `src`: rewrite the legacy import
// (splitting icons out from components that stay), rename JSX/body occurrences,
// route the renamed icons to the target pack, and dedupe collisions. Names NOT
// in the map (held colored icons, components, unresolved) stay on the FROM module.
//
// Usage:
//   MAP=.icon-migration/iconmap.json \
//   FROM=@acronis-platform/shadcn-uikit \
//   TO=@acronis-platform/icons-react/stroke-mono \
//     node apply-icons.mjs
// Review the map first; run inside a clean git tree so the diff is reviewable.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const MAP = JSON.parse(readFileSync(process.env.MAP || '.icon-migration/iconmap.json', 'utf8'));
const FROM = process.env.FROM || '@acronis-platform/shadcn-uikit';
const TO = process.env.TO || '@acronis-platform/icons-react/stroke-mono';

const esc = (s) => s.replace(/[/.\-]/g, (m) => `\\${m}`);
const importRe = new RegExp(
  String.raw`import\s+\{([^}]*)\}\s*from\s*['"]${esc(FROM)}['"];?`,
  'g'
);
const importedName = (s) => s.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
const oldNames = Object.keys(MAP).sort((a, b) => b.length - a.length);
if (!oldNames.length) {
  console.error('Empty map — nothing to apply.');
  process.exit(1);
}
const renameRe = new RegExp(String.raw`\b(${oldNames.join('|')})\b`, 'g');

const files = execSync(
  `grep -rlE "${esc(FROM)}" src --include='*.ts' --include='*.tsx'`,
  { encoding: 'utf8' }
)
  .split('\n')
  .filter(Boolean);

let changed = 0;
for (const file of files) {
  let src = readFileSync(file, 'utf8');
  const migrated = new Set();

  src = src.replace(importRe, (full, body) => {
    const specs = body.split(',').map((s) => s.trim()).filter(Boolean);
    const mig = specs.filter((s) => MAP[importedName(s)]);
    if (mig.length === 0) return full;
    mig.forEach((s) => migrated.add(importedName(s)));
    const rest = specs.filter((s) => !MAP[importedName(s)]);
    const newNames = [...new Set(mig.map((s) => MAP[importedName(s)]))].sort();
    const toImport = `import { ${newNames.join(', ')} } from '${TO}'`;
    const fromImport = rest.length ? `import { ${rest.join(', ')} } from '${FROM}'` : null;
    return [fromImport, toImport].filter(Boolean).join('\n');
  });

  if (migrated.size === 0) continue;
  src = src.replace(renameRe, (m) => (migrated.has(m) ? MAP[m] : m));
  writeFileSync(file, src);
  changed++;
  console.log(`${file}  [${[...migrated].join(', ')}]`);
}
console.log(`\n${changed} files updated`);
