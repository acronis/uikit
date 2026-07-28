import { createElement, type ComponentType } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { icons as strokeMono } from '../packs/stroke-mono';
import { icons as solidMono } from '../packs/solid-mono';
import { icons as strokeMulti } from '../packs/stroke-multi';
import { icons as solidMulti } from '../packs/solid-multi';

type IconRecord = Record<string, ComponentType<{ size?: number }>>;

// The per-pack `icons` registries are typed with each pack's narrow `IconSize`
// union; widen to a plain `size?: number` for uniform iteration here.
const asIcons = (registry: object): IconRecord => registry as IconRecord;

const PACKS: { name: string; icons: IconRecord }[] = [
  { name: 'stroke-mono', icons: asIcons(strokeMono) },
  { name: 'solid-mono', icons: asIcons(solidMono) },
  { name: 'stroke-multi', icons: asIcons(strokeMulti) },
  { name: 'solid-multi', icons: asIcons(solidMulti) },
];

const SIZES = [16, 24] as const;

afterEach(cleanup);

// Snapshot every generated icon's rendered SVG markup, per size. This is the
// full-set regression net: any change to the design-assets source, the shared
// resolver/executor rules (scale / stroke / color), or the generator surfaces
// here as a reviewable per-icon diff. The Storybook pixel VR only covers icons
// that appear in a story; this covers all of them, deterministically and
// without Docker.
describe.each(PACKS)('$name icon markup', ({ icons }) => {
  it('matches the committed markup for every icon and size', () => {
    const markup: Record<string, Record<number, string>> = {};
    for (const [name, Icon] of Object.entries(icons)) {
      markup[name] = {};
      for (const size of SIZES) {
        const { container } = render(createElement(Icon, { size }));
        markup[name][size] = container.querySelector('svg')?.outerHTML ?? '';
        cleanup();
      }
    }
    expect(markup).toMatchSnapshot();
  });
});
