import process from 'node:process';

import chalk from 'chalk';

import { cleanDirectory } from './clean-directory';
import { downloadChunks } from './download-chunks';
import { generateManifests } from './generate-manifests';
import { getExistingIcons } from './get-existing-icons';
import { getFigmaIcons } from './get-figma-icons';
import { getFigmaImages } from './get-figma-images';
import { getConfig } from './helpers';
import { saveNewIconsToCategories } from './save-new-icons-to-categories';
import type { CategoryStats, FetcherConfig } from './types';

/**
 * Fetches SVG icons from Figma and saves them as optimized SVG files.
 */
export async function fetchIcons(userConfig: Partial<FetcherConfig> = {}): Promise<void> {
  const config: FetcherConfig = { ...getConfig(), ...userConfig };

  // Validate required config
  if (!config.token) {
    console.error(chalk.red.bold('Token not found. Please add FIGMA_FETCHER_FIGMA_TOKEN to .env.local'));
    process.exit(1);
  }

  try {
    console.log(chalk.bold('\n🎨 Figma Icons Fetcher\n'));
    console.log(`Output directory: ${config.outputDir}`);
    if (config.outputDirs.length > 0) {
      console.log(`Additional outputs: ${config.outputDirs.join(', ')}`);
    }
    if (config.categorizeByColor) {
      console.log(`Color categorization: ${config.monoColorDir}, ${config.multiColorDir}`);
    }
    console.log(`Pages: ${config.pageNames.join(', ')}`);
    console.log(`Frames: ${config.frameNames.join(', ')}`);
    if (config.generateManifests) {
      console.log(`Manifests: ${config.manifestDir}`);
    }
    console.log('');

    // Fetch icon metadata from Figma
    const icons = await getFigmaIcons(config);

    // Get download URLs for icons
    const allIconsWithUrls = await getFigmaImages(config, icons);

    // Icons Figma could not render to SVG come back without an image URL. By
    // default that's a hard error; sources with work-in-progress placeholders
    // can opt into skipping them via FIGMA_FETCHER_SKIP_MISSING_IMAGES.
    const invalidIcons = allIconsWithUrls.filter((icon) => !icon.image);
    if (invalidIcons.length) {
      const list = invalidIcons.map((icon) => `  - ${icon.name} (ID: ${icon.id})`).join('\n');
      if (!config.skipMissingImages) {
        throw new Error(`${invalidIcons.length} icons missing image URLs:\n${list}`);
      }
      console.warn(chalk.yellow(`\n⚠ Skipping ${invalidIcons.length} icons Figma could not render:\n${list}`));
    }

    const iconsWithUrls = allIconsWithUrls.filter((icon) => icon.image);

    console.log(`\n📦 Found ${iconsWithUrls.length} icons to download\n`);

    // Read existing icons from the output dir BEFORE cleaning to track what was there
    console.log(`📋 Reading existing icons from ${config.outputDir}...`);
    const iconsBeforeDownload = await getExistingIcons(config.outputDir);
    console.log(`  Found ${iconsBeforeDownload.size} existing icons in ${config.outputDir}`);

    // Clean output directories (but NOT mono/multicolor - we never delete from those)
    console.log('\n🗑️  Cleaning output directories...');

    await cleanDirectory(config.outputDir);
    console.log(`  ✓ Cleaned ${config.outputDir}`);

    for (const dir of config.outputDirs) {
      await cleanDirectory(dir);
      console.log(`  ✓ Cleaned ${dir}`);
    }

    // Note: We NEVER clean mono/multicolor directories - only add new icons to them
    if (config.categorizeByColor) {
      console.log(`  ℹ️  Preserving all existing icons in ${config.monoColorDir} and ${config.multiColorDir}`);
    }

    // Download icons
    const downloadedIcons = await downloadChunks(config, iconsWithUrls);

    console.log(chalk.green.bold('\n✓ Download complete!\n'));
    console.log(`Icons saved to: ${config.outputDir}`);
    config.outputDirs.forEach((dir) => console.log(`                ${dir}`));

    // Add NEW icons to mono/multicolor directories (never delete existing)
    let categoryStats: CategoryStats = { monoAdded: 0, multiAdded: 0, monoTotal: 0, multiTotal: 0 };
    if (config.categorizeByColor) {
      categoryStats = await saveNewIconsToCategories(config, downloadedIcons, iconsBeforeDownload);

      console.log(`\n📊 Category Summary:`);
      console.log(`  Monocolor: ${categoryStats.monoAdded} added → ${categoryStats.monoTotal} total in ${config.monoColorDir}`);
      console.log(`  Multicolor: ${categoryStats.multiAdded} added → ${categoryStats.multiTotal} total in ${config.multiColorDir}`);
    }

    // Generate manifests
    await generateManifests(config, downloadedIcons);

    console.log(chalk.green.bold('\n✓ All done!\n'));
  } catch (err) {
    const error = err as Error & { cause?: Error };
    console.error(chalk.red.bold('\n✗ Error:'), error.message);
    if (error.cause) {
      console.error(chalk.red('Cause:'), error.cause.message);
    }
    process.exit(1);
  }
}
