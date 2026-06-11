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
              children: [title('Arrows'), icon('i1', '_iconsource/ArrowDown')],
            },
            {
              id: 'cat2',
              name: 'Category',
              type: 'FRAME',
              children: [title('Shapes'), icon('i2', '_iconsource/Circle')],
            },
          ],
        },
        {
          id: 'p2',
          name: 'solid-mono',
          type: 'FRAME',
          // icons listed directly under the pack → grouped under the pack
          children: [icon('i3', '_iconsource/Acronis')],
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
            { id: 'cat', name: 'Symbols', type: 'FRAME', children: [icon('i1', '_iconsource/Bell')] },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'i1', name: 'bell', pageName: 'stroke-mono/symbols' }]);
  });

  it('ignores components without the _iconsource/ prefix and non-component noise', () => {
    const icons = iconPacksStrategy(
      sectionOf([
        {
          id: 'p1',
          name: 'solid-mono',
          type: 'FRAME',
          children: [
            icon('keep', '_iconsource/Database'),
            // stray auto-added component the designer still has to clean up
            icon('junk', 'Auto-added frame'),
            { id: 'txt', name: '_iconsource/NotAnIcon', type: 'TEXT' },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'keep', name: 'database', pageName: 'solid-mono' }]);
  });
});
