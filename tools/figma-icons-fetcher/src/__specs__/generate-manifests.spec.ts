import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { generateManifests } from '../generate-manifests';

describe('generateManifests', () => {
  const testDir = path.join(process.cwd(), 'test-manifests-temp');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should do nothing when generateManifests is false', async () => {
    const config = { generateManifests: false, manifestDir: testDir };
    const icons = [{ name: 'icon1', pageName: 'Actions' }];

    await generateManifests(config, icons);

    const files = await fs.readdir(testDir);
    expect(files).toHaveLength(0);
  });

  it('should create manifest directory if it does not exist', async () => {
    const manifestDir = path.join(testDir, 'new-dir');
    const config = { generateManifests: true, manifestDir };
    const icons = [{ name: 'icon1', pageName: 'Actions' }];

    await generateManifests(config, icons);

    const exists = await fs.access(manifestDir).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('should generate per-page manifests', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [
      { name: 'icon1', pageName: 'Actions' },
      { name: 'icon2', pageName: 'Actions' },
      { name: 'icon3', pageName: 'Arrows' },
    ];

    await generateManifests(config, icons);

    const actionsContent = await fs.readFile(path.join(testDir, 'actions.json'), 'utf8');
    const arrowsContent = await fs.readFile(path.join(testDir, 'arrows.json'), 'utf8');

    expect(JSON.parse(actionsContent)).toEqual(['icon1', 'icon2']);
    expect(JSON.parse(arrowsContent)).toEqual(['icon3']);
  });

  it('should generate combined icons.json manifest', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [
      { name: 'icon1', pageName: 'Actions' },
      { name: 'icon2', pageName: 'Arrows' },
      { name: 'icon3', pageName: 'Common' },
    ];

    await generateManifests(config, icons);

    const iconsContent = await fs.readFile(path.join(testDir, 'icons.json'), 'utf8');
    expect(JSON.parse(iconsContent)).toEqual(['icon1', 'icon2', 'icon3']);
  });

  it('should sort icon names alphabetically', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [
      { name: 'zebra', pageName: 'Actions' },
      { name: 'apple', pageName: 'Actions' },
      { name: 'banana', pageName: 'Actions' },
    ];

    await generateManifests(config, icons);

    const actionsContent = await fs.readFile(path.join(testDir, 'actions.json'), 'utf8');
    expect(JSON.parse(actionsContent)).toEqual(['apple', 'banana', 'zebra']);
  });

  it('should format page names correctly', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [
      { name: 'icon1', pageName: 'Monocolor - Actions' },
      { name: 'icon2', pageName: 'Multicolor - Status' },
    ];

    await generateManifests(config, icons);

    const files = await fs.readdir(testDir);

    expect(files).toContain('monocolor---actions.json');
    expect(files).toContain('multicolor---status.json');
    expect(files).toContain('icons.json');
  });

  it('collapses path separators in group names into a flat filename', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [{ name: 'microsoft365', pageName: 'Brands / logos' }];

    await generateManifests(config, icons);

    const files = await fs.readdir(testDir);
    expect(files).toContain('brands-logos.json');
    expect(JSON.parse(await fs.readFile(path.join(testDir, 'brands-logos.json'), 'utf8'))).toEqual(['microsoft365']);
  });

  it('should add newline at end of JSON files', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [{ name: 'icon1', pageName: 'Actions' }];

    await generateManifests(config, icons);

    const content = await fs.readFile(path.join(testDir, 'actions.json'), 'utf8');
    expect(content.endsWith('\n')).toBe(true);
  });

  it('should handle empty icons array', async () => {
    const config = { generateManifests: true, manifestDir: testDir };

    await generateManifests(config, []);

    const iconsContent = await fs.readFile(path.join(testDir, 'icons.json'), 'utf8');
    expect(JSON.parse(iconsContent)).toEqual([]);
  });

  it('should handle icons with same name from different pages', async () => {
    const config = { generateManifests: true, manifestDir: testDir };
    const icons = [
      { name: 'icon1', pageName: 'Actions' },
      { name: 'icon1', pageName: 'Arrows' },
    ];

    await generateManifests(config, icons);

    const actionsContent = await fs.readFile(path.join(testDir, 'actions.json'), 'utf8');
    const arrowsContent = await fs.readFile(path.join(testDir, 'arrows.json'), 'utf8');
    const iconsContent = await fs.readFile(path.join(testDir, 'icons.json'), 'utf8');

    expect(JSON.parse(actionsContent)).toEqual(['icon1']);
    expect(JSON.parse(arrowsContent)).toEqual(['icon1']);
    expect(JSON.parse(iconsContent)).toEqual(['icon1', 'icon1']);
  });
});
