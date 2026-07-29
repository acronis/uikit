import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as parseYaml } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { listComponentNames, loadSpec } from '../lib/load';

const HERE = dirname(fileURLToPath(import.meta.url));
const UI_REACT_SRC = resolve(HERE, '../../ui-react/src');
const UI_REACT_UI = resolve(UI_REACT_SRC, 'components/ui');
const DOCS_COMPONENTS_DIR = resolve(
  HERE,
  '../../../apps/docs/content/docs/components'
);

const barrel = readFileSync(resolve(UI_REACT_SRC, 'index.ts'), 'utf8');

function parseFrontmatter(mdx: string): Record<string, unknown> {
  const match = mdx.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return (parseYaml(match[1]) as Record<string, unknown>) ?? {};
}

function readStoriesSource(sourceDir: string): { path: string; text: string } | null {
  const dir = resolve(UI_REACT_UI, sourceDir, '__stories__');
  for (const file of [`${sourceDir}.stories.tsx`, `${sourceDir}.generated.stories.tsx`]) {
    const path = resolve(dir, file);
    if (existsSync(path)) return { path, text: readFileSync(path, 'utf8') };
  }
  return null;
}

const componentNames = listComponentNames();
const flagged = componentNames.filter((name) => {
  const { index } = loadSpec(name);
  return index.visibility === 'internal' || Boolean(index.deprecated);
});

describe('internal/deprecated components are not exported, and are flagged in docs + Storybook', () => {
  for (const name of flagged) {
    const { index } = loadSpec(name);
    const sourceDir = index.sourceDir ?? name;
    const isInternal = index.visibility === 'internal';
    const deprecated = index.deprecated;

    it(`${name}: not exported from ui-react's public entry point`, () => {
      expect(
        barrel.includes(`components/ui/${sourceDir}`),
        `${name} is visibility:internal and/or deprecated but is still referenced in src/index.ts`
      ).toBe(false);
    });

    it(`${name}: docs frontmatter declares its status`, () => {
      const mdxPath = resolve(DOCS_COMPONENTS_DIR, `${name}.mdx`);
      expect(existsSync(mdxPath), `missing docs page ${mdxPath}`).toBe(true);
      const frontmatter = parseFrontmatter(readFileSync(mdxPath, 'utf8'));

      if (isInternal) {
        expect(frontmatter.internal, `${name}.mdx frontmatter missing "internal: true"`).toBe(
          true
        );
      }
      if (deprecated) {
        const fmDeprecated = frontmatter.deprecated as { replacement?: string } | undefined;
        expect(
          fmDeprecated?.replacement,
          `${name}.mdx frontmatter "deprecated.replacement" must be "${deprecated.replacement}"`
        ).toBe(deprecated.replacement);
      }
    });

    it(`${name}: Storybook tags declare its status`, () => {
      const stories = readStoriesSource(sourceDir);
      expect(stories, `no stories file found for ${sourceDir}`).not.toBeNull();
      if (!stories) return;

      if (isInternal) {
        expect(
          /tags:\s*\[[^\]]*'internal'/.test(stories.text),
          `${stories.path} is missing 'internal' in its tags array`
        ).toBe(true);
      }
      if (deprecated) {
        expect(
          /tags:\s*\[[^\]]*'deprecated'/.test(stories.text),
          `${stories.path} is missing 'deprecated' in its tags array`
        ).toBe(true);

        const replacement = loadSpec(deprecated.replacement).index.component;
        expect(
          stories.text.includes(replacement),
          `${stories.path} does not mention its replacement ("${replacement}")`
        ).toBe(true);
      }
    });

    if (deprecated) {
      it(`${name}: replacement "${deprecated.replacement}" exists and isn't itself deprecated`, () => {
        expect(componentNames.includes(deprecated.replacement)).toBe(true);
        const replacementSpec = loadSpec(deprecated.replacement).index;
        expect(
          replacementSpec.deprecated,
          `${name}'s replacement "${deprecated.replacement}" is itself deprecated`
        ).toBeUndefined();
      });
    }
  }
});
