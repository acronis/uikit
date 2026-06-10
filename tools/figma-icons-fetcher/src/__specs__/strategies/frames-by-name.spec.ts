import { describe, expect, it } from 'vitest';

import { framesByNameStrategy } from '../../strategies/frames-by-name';
import type { FigmaNode, FigmaPage } from '../../strategies/types';
import type { FetcherConfig } from '../../types';

function makeConfig(overrides: Partial<FetcherConfig> = {}): FetcherConfig {
  return {
    selectionStrategy: 'frames-by-name',
    skipMissingImages: false,
    pageNames: [],
    frameNames: ['16px', '24px'],
    systemColor: '#181818',
    outputDir: './icons',
    outputDirs: [],
    generateManifests: false,
    manifestDir: './manifests',
    categorizeByColor: false,
    monoColorDir: 'monocolor-icons',
    multiColorDir: 'multicolor-icons',
    ...overrides,
  };
}

function page(children: FigmaNode[]): FigmaPage {
  return { id: '1:1', name: 'Actions', document: { id: '1:1', name: 'Actions', type: 'CANVAS', children } };
}

describe('framesByNameStrategy', () => {
  it('collects COMPONENT nodes from frames matching frameNames', () => {
    const icons = framesByNameStrategy(
      page([
        {
          id: 'f1',
          name: '16px',
          type: 'FRAME',
          children: [
            { id: 'c1', name: 'Search', type: 'COMPONENT' },
            { id: 'c2', name: 'Bell', type: 'COMPONENT' },
          ],
        },
      ]),
      makeConfig(),
    );

    expect(icons).toEqual([
      { id: 'c1', name: 'search', pageName: 'Actions' },
      { id: 'c2', name: 'bell', pageName: 'Actions' },
    ]);
  });

  it('ignores frames whose name is not in frameNames', () => {
    const icons = framesByNameStrategy(
      page([{ id: 'f1', name: 'Notes', type: 'FRAME', children: [{ id: 'c1', name: 'Search', type: 'COMPONENT' }] }]),
      makeConfig(),
    );

    expect(icons).toEqual([]);
  });

  it('recurses into nested groups and skips underscore-prefixed components', () => {
    const icons = framesByNameStrategy(
      page([
        {
          id: 'f1',
          name: '24px',
          type: 'FRAME',
          children: [
            {
              id: 'g1',
              name: 'Group',
              type: 'GROUP',
              children: [
                { id: 'c1', name: 'Cog', type: 'COMPONENT' },
                { id: 'c2', name: '_IconGrid', type: 'COMPONENT' },
              ],
            },
          ],
        },
      ]),
      makeConfig(),
    );

    expect(icons).toEqual([{ id: 'c1', name: 'cog', pageName: 'Actions' }]);
  });
});
