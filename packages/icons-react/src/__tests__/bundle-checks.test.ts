import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

import { build } from 'vite';
import { describe, expect, it } from 'vitest';

const pkgRoot = resolve(__dirname, '..', '..');
const strokeMonoEntry = resolve(pkgRoot, 'src', 'packs', 'stroke-mono', 'index.ts');

async function bundleBytes(importStatement: string): Promise<{
  raw: number;
  gzip: number;
}> {
  const tmpRoot = await mkdtemp(join(tmpdir(), 'icons-react-bundle-check-'));
  const entryFile = join(tmpRoot, 'entry.js');
  const outDir = join(tmpRoot, 'out');
  await writeFile(
    entryFile,
    `${importStatement}\nexport const keep = 1;\n`,
    'utf8'
  );

  await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      outDir,
      emptyOutDir: true,
      minify: 'esbuild',
      lib: {
        entry: entryFile,
        formats: ['es'],
        fileName: () => 'bundle.js',
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ],
      },
    },
  });

  const files = await readdir(outDir);
  let output = '';
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    output += await readFile(join(outDir, file), 'utf8');
  }
  return { raw: Buffer.byteLength(output), gzip: gzipSync(output).length };
}

describe('tree-shaking and bundle-size guards', () => {
  it(
    'keeps named icon imports small and avoids pulling full icon registry',
    async () => {
      const named = await bundleBytes(
        `import { BoltIcon } from ${JSON.stringify(strokeMonoEntry)};\nconsole.log(BoltIcon);`
      );
      const registry = await bundleBytes(
        `import { icons } from ${JSON.stringify(strokeMonoEntry)};\nconsole.log(icons);`
      );

      expect(named.gzip).toBeLessThan(3000);
      expect(registry.gzip).toBeGreaterThan(named.gzip * 10);
      expect(registry.raw).toBeGreaterThan(named.raw * 20);
    },
    30_000
  );
});
