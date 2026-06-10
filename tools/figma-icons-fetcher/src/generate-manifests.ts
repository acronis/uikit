import fs from 'node:fs/promises';
import path from 'node:path';

import chalk from 'chalk';

import { groupIconsByPage } from './helpers';

interface ManifestConfig {
  generateManifests: boolean;
  manifestDir: string;
}

interface ManifestIcon {
  name: string;
  pageName: string;
}

/**
 * Generates JSON manifest files for icons grouped by page, plus a combined manifest.
 */
export async function generateManifests(config: ManifestConfig, icons: ManifestIcon[]): Promise<void> {
  if (!config.generateManifests) {
    return;
  }

  console.log(chalk.bold('\n📝 Generating JSON manifests...\n'));

  // Ensure manifest directory exists
  await fs.mkdir(config.manifestDir, { recursive: true });

  // Group icons by page
  const iconsByPage = groupIconsByPage(icons);

  // Generate per-page manifests
  const pageManifests: Array<{ page: string; count: number; path: string }> = [];
  for (const [pageName, pageIcons] of Object.entries(iconsByPage)) {
    // Group keys may contain "/" (e.g. a "Brands / logos" category) — keep the
    // manifest flat by collapsing path separators into hyphens.
    const manifestFileName = `${pageName.replace(/[/\\]/g, '-')}.json`;
    const manifestPath = path.join(config.manifestDir, manifestFileName);

    // Sort icon names alphabetically
    const iconNames = pageIcons.map((icon) => icon.name).sort();

    await fs.writeFile(manifestPath, `${JSON.stringify(iconNames, null, 2)}\n`, 'utf8');

    pageManifests.push({ page: pageName, count: iconNames.length, path: manifestPath });
    console.log(chalk.cyan(`  ✓ ${manifestFileName} (${iconNames.length} icons)`));
  }

  // Generate combined manifest (all icons)
  const allIconNames = icons.map((icon) => icon.name).sort();
  const combinedManifestPath = path.join(config.manifestDir, 'icons.json');
  await fs.writeFile(combinedManifestPath, `${JSON.stringify(allIconNames, null, 2)}\n`, 'utf8');
  console.log(chalk.cyan(`  ✓ icons.json (${allIconNames.length} icons - combined)`));

  console.log(chalk.green.bold(`\n✓ Generated ${pageManifests.length + 1} manifest files`));
  console.log(`Manifest directory: ${config.manifestDir}\n`);
}
