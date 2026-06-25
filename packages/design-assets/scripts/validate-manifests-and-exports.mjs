import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const PACKAGE_DIR = process.cwd();

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function toPatternRegex(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\*/g, '[^/]+')}$`);
}

function isCoveredByExports(exportsMap, subpath) {
  return Object.keys(exportsMap).some((entry) => toPatternRegex(entry).test(subpath));
}

function collectFileRefs(node, refs = []) {
  if (!node || typeof node !== 'object') return refs;
  if (typeof node.$file === 'string') refs.push(node.$file);
  for (const value of Object.values(node)) collectFileRefs(value, refs);
  return refs;
}

function main() {
  const packageJsonPath = path.join(PACKAGE_DIR, 'package.json');
  const packageJson = readJson(packageJsonPath);
  const exportsMap = packageJson.exports ?? {};

  const packNames = readdirSync(path.join(PACKAGE_DIR, 'packs'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .sort();

  const errors = [];

  for (const packName of packNames) {
    const manifestPath = path.join(PACKAGE_DIR, 'packs', `${packName}.json`);
    const manifest = readJson(manifestPath);

    const manifestSubpath = `./packs/${packName}.json`;
    if (!isCoveredByExports(exportsMap, manifestSubpath)) {
      errors.push(`Missing export coverage for ${manifestSubpath}`);
    }

    const packBinarySubpath = `./packs/${packName}/__audit__.svg`;
    if (!isCoveredByExports(exportsMap, packBinarySubpath)) {
      errors.push(`Missing export coverage for binaries under ./packs/${packName}/*`);
    }

    for (const fileRef of collectFileRefs(manifest)) {
      if (!fileRef.startsWith('./packs/')) {
        errors.push(`packs/${packName}.json: $file must start with "./packs/": ${fileRef}`);
        continue;
      }
      const absoluteRef = path.join(PACKAGE_DIR, fileRef.replace(/^\.\//, ''));
      if (!existsSync(absoluteRef)) {
        errors.push(`packs/${packName}.json: missing file for $file ${fileRef}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('Manifest/export audit failed:\n');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Manifest/export audit passed for ${packNames.length} pack(s).`);
}

main();
