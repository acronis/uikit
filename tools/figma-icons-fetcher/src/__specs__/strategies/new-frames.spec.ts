import { describe, expect, it } from 'vitest';

import { newFramesStrategy } from '../../strategies/new-frames';
import type { FigmaNode, FigmaPage } from '../../strategies/types';
import type { FetcherConfig } from '../../types';

const config: FetcherConfig = {
  selectionStrategy: 'new-frames',
  skipMissingImages: true,
  pageNames: [],
  frameNames: [],
  systemColor: '#1763CF',
  outputDir: './icons',
  outputDirs: [],
  generateManifests: false,
  manifestDir: './manifests',
  categorizeByColor: false,
  monoColorDir: 'monocolor-icons',
  multiColorDir: 'multicolor-icons',
};

function pageOf(categories: FigmaNode[]): FigmaPage {
  return { id: 'p', name: 'page', document: { id: 'p', name: 'page', type: 'CANVAS', children: categories } };
}

const newLabel: FigmaNode = { id: 't', name: 'New', type: 'TEXT' };

describe('newFramesStrategy', () => {
  it('collects icon leaves only from frames badged "New", grouped by category', () => {
    const icons = newFramesStrategy(
      pageOf([
        {
          id: 'cat',
          name: 'Arrows',
          type: 'FRAME',
          children: [
            {
              id: 'sub',
              name: 'Arrow Uturn',
              type: 'FRAME',
              children: [
                // old size-suffixed icons sit OUTSIDE the New frame → ignored
                { id: 'old', name: 'recover--16', type: 'INSTANCE' },
                {
                  id: 'newframe',
                  name: 'Frame 6',
                  type: 'FRAME',
                  children: [
                    newLabel,
                    { id: 'i1', name: 'ArrowUturn', type: 'FRAME' },
                    { id: 'i2', name: 'ArrowReply', type: 'INSTANCE' },
                  ],
                },
              ],
            },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([
      { id: 'i1', name: 'arrow-uturn', pageName: 'arrows' },
      { id: 'i2', name: 'arrow-reply', pageName: 'arrows' },
    ]);
  });

  it('skips grids, placeholders and wrapper frames inside a New frame, but recurses through wrappers', () => {
    const icons = newFramesStrategy(
      pageOf([
        {
          id: 'cat',
          name: 'Objects',
          type: 'FRAME',
          children: [
            {
              id: 'newframe',
              name: 'Frame 6',
              type: 'FRAME',
              children: [
                newLabel,
                { id: 'grid', name: '_IconGrid-24', type: 'INSTANCE' },
                { id: 'q', name: '?', type: 'TEXT' },
                { id: 'i1', name: 'Bell', type: 'FRAME' },
                {
                  // wrapper frame: not an icon itself, but its children are
                  id: 'wrap',
                  name: 'Frame 8',
                  type: 'FRAME',
                  children: [
                    { id: 'q2', name: '?', type: 'TEXT' },
                    { id: 'i2', name: 'BellOff', type: 'FRAME' },
                  ],
                },
              ],
            },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([
      { id: 'i1', name: 'bell', pageName: 'objects' },
      { id: 'i2', name: 'bell-off', pageName: 'objects' },
    ]);
  });

  it('ignores frames without a New label and detects the label case-insensitively', () => {
    const icons = newFramesStrategy(
      pageOf([
        {
          id: 'cat',
          name: 'Shapes',
          type: 'FRAME',
          children: [
            {
              id: 'noNew',
              name: 'Frame 1',
              type: 'FRAME',
              children: [{ id: 'x', name: 'Square', type: 'FRAME' }],
            },
            {
              id: 'newframe',
              name: 'Frame 2',
              type: 'FRAME',
              children: [
                { id: 't2', name: 'NEW', type: 'TEXT' },
                { id: 'i1', name: 'Circle', type: 'FRAME' },
              ],
            },
          ],
        },
      ]),
      config,
    );

    expect(icons).toEqual([{ id: 'i1', name: 'circle', pageName: 'shapes' }]);
  });
});
