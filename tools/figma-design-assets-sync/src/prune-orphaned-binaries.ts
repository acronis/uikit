import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';

/**
 * Collects every `$file` value anywhere in a manifest value tree (pack root
 * `values`/`assets`, every `assetsGroups.*`, nested asset `values`, …).
 */
function collectFileRefs(node: unknown, refs: string[] = []): string[] {
  if (!node || typeof node !== 'object') return refs;
  const record = node as Record<string, unknown>;
  if (typeof record.$file === 'string') refs.push(record.$file);
  for (const value of Object.values(record)) collectFileRefs(value, refs);
  return refs;
}

/**
 * Binaries under `packs/<pack>/` are flat and shared by every group in the
 * pack — pruning per-group (comparing one group's downloaded icons against
 * the whole directory) risks deleting a file another group still references.
 * Instead this runs once, after every group has synced: read the final
 * manifest, and only delete an SVG that no group (or the flat `assets` map)
 * references anymore.
 */
export async function pruneOrphanedBinaries(manifestPath: string, binariesDir: string): Promise<string[]> {
  let manifest: unknown;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch {
    throw new Error(`Cannot read manifest at ${manifestPath}`);
  }

  const referenced = new Set(
    collectFileRefs(manifest).map((ref) => path.basename(ref)),
  );

  let entries: string[];
  try {
    entries = await fs.readdir(binariesDir);
  } catch {
    return [];
  }

  const orphaned = entries.filter((f) => f.endsWith('.svg') && !referenced.has(f));
  for (const file of orphaned) {
    await fs.unlink(path.join(binariesDir, file));
    console.log(chalk.yellow(`  🗑  Pruned orphaned binary: ${file}`));
  }
  return orphaned;
}
