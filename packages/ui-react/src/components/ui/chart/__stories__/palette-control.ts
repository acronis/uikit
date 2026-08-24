import type { ChartPalette } from '../chart-palette';

// A Storybook control for the `palette` prop, shared by every chart's stories.
//
// `palette` is an object, which a `select` can't offer directly — so the
// control lists readable ids and `mapping` turns the chosen id back into the
// palette object. Spread it into a chart meta's `argTypes` to make every one
// of that chart's stories switchable from the Controls panel:
//
//   argTypes: { ...paletteArgTypes }
//
// Not a `.stories.tsx` file, so Storybook's glob doesn't pick it up as stories.

const PALETTES = {
  categorical: { type: 'categorical' },
  'sequential-blue': { type: 'sequential', ramp: 'blue' },
  'sequential-teal': { type: 'sequential', ramp: 'teal' },
  'sequential-orange': { type: 'sequential', ramp: 'orange' },
  'sequential-violet': { type: 'sequential', ramp: 'violet' },
  'diverging-blue-orange': { type: 'diverging', pair: 'blue-orange' },
  'diverging-teal-violet': { type: 'diverging', pair: 'teal-violet' },
  status: { type: 'status' },
} satisfies Record<string, ChartPalette>;

export const paletteArgTypes = {
  palette: {
    name: 'palette',
    description:
      'The dataviz palette the series are painted from. `status` reads gray unless each series names a `tone`.',
    control: { type: 'select' as const },
    options: Object.keys(PALETTES),
    mapping: PALETTES,
    table: { category: 'Appearance', defaultValue: { summary: 'categorical' } },
  },
};
