import { describe, expect, it } from 'vitest';

import { iconPacksStrategy } from '../../strategies/icon-packs';
import type { FigmaNode, FigmaPage } from '../../strategies/types';
import type { FetcherConfig } from '../../types';

const config: FetcherConfig = {
  selectionStrategy: 'icon-packs',
  skipMissingImages: true,
  pageNames: [],
  frameNames: [],
  systemColor: '#1763CF',
  outputDir: './icons',
  outputDirs: [],
  generateManifests: false,
  manifestDir: './manifests',
  cleanManifests: false,
  categorizeByColor: false,
  monoColorDir: 'monocolor-icons',
  multiColorDir: 'multicolor-icons',
};

// The fetched node is the section itself; its children are the pack frames.
function sectionOf(packs: FigmaNode[]): FigmaPage {
  const document: FigmaNode = { id: 's', name: 'icon-packs-source', type: 'SECTION', children: packs };
  return { id: 's', name: 'icon-packs-source', document };
}

const icon = (id: string, name: string): FigmaNode => ({ id, name, type: 'COMPONENT' });

const title = (text: string): FigmaNode => ({ id: `t-${text}`, name: 'CategoryTitle', type: 'TEXT', characters: text });

describe('iconPacksStrategy', () => {
  it('groups Category-nested icons as <pack>/<category> and direct icons under the pack', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'stroke-mono',
          type: 'FRAME',
          children: [
            // icons nested inside Category frames — split by the CategoryTitle text
            {
              id: 'cat1',
              name: 'Category',
              type: 'FRAME',
              children: [title('Arrows'), icon('i1', '_assetsource/ArrowDown')],
            },
            {
              id: 'cat2',
              name: 'Category',
              type: 'FRAME',
              children: [title('Shapes'), icon('i2', '_assetsource/Circle')],
            },
          ],
        },
        {
          id: 'p2',
          name: 'solid-mono',
          type: 'FRAME',
          // icons listed directly under the pack → grouped under the pack
          children: [icon('i3', '_assetsource/Acronis')],
        },
      ]),
      config,
    );

    expect(icons).toEqual([
      { id: 'i1', name: 'arrow-down', pageName: 'stroke-mono/arrows' },
      { id: 'i2', name: 'circle', pageName: 'stroke-mono/shapes' },
      { id: 'i3', name: 'acronis', pageName: 'solid-mono' },
    ]);
  });

  it('falls back to the frame name when a category has no CategoryTitle text', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'stroke-mono',
          type: 'FRAME',
          children: [
            { id: 'cat', name: 'Symbols', type: 'FRAME', children: [icon('i1', '_assetsource/Bell')] },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'i1', name: 'bell', pageName: 'stroke-mono/symbols' }]);
  });

  it('matches CategoryTitle text nodes case-insensitively after trimming', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'stroke-mono',
          type: 'FRAME',
          children: [
            {
              id: 'cat1',
              name: 'Category',
              type: 'FRAME',
              children: [
                { id: 't1', name: '  cAtEgOrYtItLe  ', type: 'TEXT', characters: ' Brand Icons ' },
                icon('i1', '_assetsource/Cloud'),
              ],
            },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'i1', name: 'cloud', pageName: 'stroke-mono/brand-icons' }]);
  });

  it('collects deeply nested icons within a category frame', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'solid-mono',
          type: 'FRAME',
          children: [
            {
              id: 'cat1',
              name: 'Category',
              type: 'FRAME',
              children: [
                title('Nested'),
                {
                  id: 'lvl1',
                  name: 'Wrapper 1',
                  type: 'FRAME',
                  children: [
                    {
                      id: 'lvl2',
                      name: 'Wrapper 2',
                      type: 'FRAME',
                      children: [icon('i1', '_assetsource/Lock')],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'i1', name: 'lock', pageName: 'solid-mono/nested' }]);
  });

  it('collects very deep icon trees without recursion overflow', () => {
    let nested: FigmaNode = icon('deep', '_assetsource/Database');
    for (let i = 0; i < 15_000; i += 1) {
      nested = { id: `f-${i}`, name: `Frame ${i}`, type: 'FRAME', children: [nested] };
    }

    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'solid-mono',
          type: 'FRAME',
          children: [{ id: 'cat1', name: 'Category', type: 'FRAME', children: [title('Deep'), nested] }],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'deep', name: 'database', pageName: 'solid-mono/deep' }]);
  });

  it('ignores components without the _assetsource/ prefix and non-component noise', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'solid-mono',
          type: 'FRAME',
          children: [
            icon('keep', '_assetsource/Database'),
            // stray auto-added component the designer still has to clean up
            icon('junk', 'Auto-added frame'),
            { id: 'txt', name: '_assetsource/NotAnIcon', type: 'TEXT' },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'keep', name: 'database', pageName: 'solid-mono' }]);
  });
});
