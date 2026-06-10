import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import chalk from 'chalk';
import dotenv from 'dotenv';

import type { FetcherConfig } from './types';

export function getConfig(): FetcherConfig {
  const envConfig = { ...getEnvConfig('.env'), ...getEnvConfig('.env.local'), ...process.env };

  return {
    token: envConfig.FIGMA_FETCHER_FIGMA_TOKEN,
    fileKey: envConfig.FIGMA_FETCHER_FILE_KEY,
    selectionStrategy: envConfig.FIGMA_FETCHER_SELECTION_STRATEGY === 'new-frames' ? 'new-frames' : 'frames-by-name',
    skipMissingImages: envConfig.FIGMA_FETCHER_SKIP_MISSING_IMAGES === 'true',
    frameNames: envConfig.FIGMA_FETCHER_FRAME_NAMES?.split(',').map((name) => name.trim()) ?? [],
    pageNames: envConfig.FIGMA_FETCHER_PAGE_NAMES?.split(',').map((name) => name.trim()) ?? [],
    className: envConfig.FIGMA_FETCHER_CLASS_NAME,
    systemColor: envConfig.FIGMA_FETCHER_SYSTEM_COLOR ?? '#181818',
    outputDir: envConfig.FIGMA_FETCHER_OUTPUT_DIR ?? './icons',
    outputDirs: envConfig.FIGMA_FETCHER_OUTPUT_DIRS?.split(',').map((dir) => dir.trim()).filter(Boolean) ?? [],
    generateManifests: envConfig.FIGMA_FETCHER_GENERATE_MANIFESTS === 'true',
    manifestDir: envConfig.FIGMA_FETCHER_MANIFEST_DIR ?? './manifests',
    categorizeByColor: envConfig.FIGMA_FETCHER_CATEGORIZE_BY_COLOR === 'true',
    monoColorDir: envConfig.FIGMA_FETCHER_MONOCOLOR_DIR ?? 'monocolor-icons',
    multiColorDir: envConfig.FIGMA_FETCHER_MULTICOLOR_DIR ?? 'multicolor-icons',
  };
}

function getEnvConfig(file: string): Record<string, string> {
  const fullPath = path.resolve(file);

  if (fs.existsSync(fullPath)) {
    return dotenv.parse(fs.readFileSync(fullPath));
  }

  return {};
}

export function formatName(name: string): string {
  return name
    .trim()
    // Insert hyphen between lowercase/digit and uppercase: "macBook" → "mac-Book"
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    // Insert hyphen inside uppercase runs when followed by lowercase
    // "XMLHttp" → "XML-Http", "ESXi" → "ESX-i", "HTMLElement" → "HTML-Element"
    .replaceAll(/[A-Z]{2,}/g, (match, offset: number, str: string) => {
      const after = str.slice(offset + match.length);
      if (after && /^[a-z]/.test(after)) {
        // Followed by lowercase - check if it's a word (2+ lowercase) or single char
        if (/^[a-z]{2,}/.test(after)) {
          // Word follows (e.g. "ttp" after "XMLH") → split off last uppercase: "XML-H"
          return `${match.slice(0, -1)}-${match.slice(-1)}`;
        }
        // Single lowercase follows (e.g. "i" after "ESX") → keep run, add hyphen after: "ESX-"
        return `${match}-`;
      }
      return match;
    })
    .toLowerCase()
    .replaceAll(/\s*\/\s*/g, '/')
    .replaceAll(/\s+/g, '-');
}

export function findDuplicates<T extends object>(propertyName: string, arr: T[]): T[] {
  const seen = new Set<unknown>();

  return arr.map((current) => {
    const record = current as Record<string, unknown>;
    if (seen.has(record[propertyName])) {
      console.log(chalk.bgRed.bold(`Duplicate icon name: ${String(record[propertyName])}. Please fix Figma file`));
      record[propertyName] = `${String(record[propertyName])}-duplicate`;
    }
    seen.add(record[propertyName]);
    return current;
  });
}

export function escapeRegExp(text: string): string {
  return text.replaceAll(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Detects if an SVG is multicolor by counting unique colors.
 */
export function isMulticolor(svgContent: string): boolean {
  // Detect url() references (gradients, patterns) — always multicolor
  const urlFillRegex = /(?:fill|stroke)=["']url\(/gi;
  if (urlFillRegex.test(svgContent)) {
    return true;
  }

  // Extract all fill and stroke colors, excluding currentColor, none, and transparent
  const colorRegex = /(?:fill|stroke)=["']#([\da-f]{3,6})["']/gi;
  const matches = [...svgContent.matchAll(colorRegex)];

  // Normalize 3-digit hex to 6-digit
  const colors = matches.map((match) => {
    const color = match[1];
    return color.length === 3
      ? color.split('').map((c) => `${c}${c}`).join('')
      : color;
  });

  const uniqueColors = new Set(colors.map((c) => c.toLowerCase()));
  return uniqueColors.size > 1;
}

/**
 * Groups icons by their source page name (formatted).
 */
export function groupIconsByPage<T extends { pageName: string }>(icons: T[]): Record<string, T[]> {
  return icons.reduce<Record<string, T[]>>((acc, icon) => {
    const pageName = formatName(icon.pageName);
    if (!acc[pageName]) {
      acc[pageName] = [];
    }
    acc[pageName].push(icon);
    return acc;
  }, {});
}
