import fs from 'node:fs/promises';
import path from 'node:path';

import { DEFAULT_PACK_NAME } from './config';

const GROUP_ID = 'stroke-mono';
// Reports are internal build output, not published package data — they live
// in the tool's own directory, not in the consumer package's packs/. Relative
// to cwd (the tool always runs from the consumer package dir — see README).
const REPORTS_DIR = path.join('..', '..', 'tools', 'figma-design-assets-sync', 'reports');
const REPORT_PATH = path.join(REPORTS_DIR, 'stroke-fill-warnings.md');

export interface StrokeIntegrityResult {
  total: number;
  fullyOutlined: string[];
  mixed: string[];
  reportPath: string;
}

interface PackManifest {
  assetsGroups?: Record<string, { assets: Record<string, unknown> }>;
}

/**
 * Scans the SVGs belonging to the `stroke-mono` group for hardcoded fill
 * colors (fill="#..."), which indicates the icon's strokes were outlined in
 * Figma rather than using live stroke paths. Writes a markdown report of
 * offenders. Binaries are flat under `packs/<pack>/` and shared by every
 * group, so which files belong to `stroke-mono` comes from the manifest's
 * `assetsGroups.stroke-mono.assets` keys, not a directory listing.
 */
export async function checkStrokeIntegrity(packName: string = DEFAULT_PACK_NAME): Promise<StrokeIntegrityResult> {
  const manifestPath = path.join('packs', `${packName}.json`);
  const binariesDir = path.join('packs', packName);

  let manifest: PackManifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as PackManifest;
  } catch {
    return { total: 0, fullyOutlined: [], mixed: [], reportPath: REPORT_PATH };
  }

  const group = manifest.assetsGroups?.[GROUP_ID];
  if (!group) {
    return { total: 0, fullyOutlined: [], mixed: [], reportPath: REPORT_PATH };
  }

  const svgFiles = Object.keys(group.assets).map((id) => `${id}.svg`).sort();
  const fullyOutlined: string[] = [];
  const mixed: string[] = [];

  for (const file of svgFiles) {
    let content: string;
    try {
      content = await fs.readFile(path.join(binariesDir, file), 'utf8');
    } catch {
      continue;
    }
    const hasFill = content.includes('fill="#');
    if (!hasFill) continue;

    const hasStroke = content.includes('stroke=');
    const name = file.replace(/\.svg$/, '');
    if (hasStroke) {
      mixed.push(name);
    } else {
      fullyOutlined.push(name);
    }
  }

  // Report lives outside the consumer package, so its <img> links need a
  // path back to the binaries dir relative to REPORTS_DIR — computed from
  // cwd rather than hardcoded, so this works for any consumer package.
  const binariesRelFromReport = path.relative(path.resolve(REPORTS_DIR), path.resolve(binariesDir));

  await writeReport(fullyOutlined, mixed, packName, binariesRelFromReport);

  return {
    total: svgFiles.length,
    fullyOutlined,
    mixed,
    reportPath: REPORT_PATH,
  };
}

function iconRow(name: string, binariesRelFromReport: string): string {
  const src = `${binariesRelFromReport}/${name}.svg`;
  return `| <img src="${src}" height="24" /> | \`${name}\` |`;
}

async function writeReport(
  fullyOutlined: string[],
  mixed: string[],
  packName: string,
  binariesRelFromReport: string,
): Promise<void> {
  const totalAffected = fullyOutlined.length + mixed.length;
  const lines: string[] = [
    '# Stroke-Mono Fill Integrity Warnings',
    '',
    `Icons in \`assetsGroups.${GROUP_ID}\` of \`packs/${packName}.json\` whose binary (under \`packs/${packName}/\`) contains hardcoded \`fill="#..."\` attributes.`,
    'These icons have outlined (expanded) strokes in Figma instead of live stroke paths.',
    'The fix must be applied in the Figma source file.',
    '',
    `**Total affected: ${totalAffected}**  ·  Fully outlined: ${fullyOutlined.length}  ·  Mixed (fill + stroke): ${mixed.length}`,
    '',
    '---',
    '',
  ];

  if (fullyOutlined.length > 0) {
    lines.push(
      '## Fully Outlined (no `stroke` attribute)',
      '',
      'These icons export as filled paths only — strokes were expanded to fills in Figma.',
      '',
      '| Preview | Name |',
      '|---|---|',
      ...fullyOutlined.map((name) => iconRow(name, binariesRelFromReport)),
      '',
    );
  }

  if (mixed.length > 0) {
    lines.push(
      '## Mixed (fill + stroke)',
      '',
      'These icons use both fills and strokes. The fills may be intentional (e.g. screen bezels,',
      'rack details) or may indicate partial outlining. Review case-by-case.',
      '',
      '| Preview | Name |',
      '|---|---|',
      ...mixed.map((name) => iconRow(name, binariesRelFromReport)),
      '',
    );
  }

  if (totalAffected === 0) {
    lines.push('_No issues found. All icons use stroke-only paths._', '');
  }

  await fs.mkdir(REPORTS_DIR, { recursive: true });
  await fs.writeFile(REPORT_PATH, lines.join('\n'), 'utf8');
}
