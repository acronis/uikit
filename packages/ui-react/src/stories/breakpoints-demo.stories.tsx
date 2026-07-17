import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// code from this file ships. (Tailwind's CSS scanning is a separate,
// unscoped concern — see the color-coding note on `BreakpointIndicator`
// below.) It exists so design/UX can pick a viewport from the toolbar above
// and see, live, which of ui-react's pinned breakpoints (`src/styles/index.css`'s
// `@theme` block) is active at that width — to sign off on the overrides
// against Tailwind's stock scale before they land in a real component.
//
// Named viewports scoped to this story only (not the whole Storybook) so the
// toolbar for every other component's stories keeps Storybook's own default
// viewport presets.
const BREAKPOINT_VIEWPORTS = {
  sm: {
    name: 'sm — 640px (Tailwind default, unchanged)',
    styles: { width: '640px', height: '400px' },
    type: 'desktop',
  },
  md: {
    name: 'md — 768px (Tailwind default, unchanged)',
    styles: { width: '768px', height: '400px' },
    type: 'desktop',
  },
  lg: {
    name: 'lg — 1024px (unchanged)',
    styles: { width: '1024px', height: '400px' },
    type: 'desktop',
  },
  xl: {
    name: 'xl — 1280px (matches Tailwind default; design range 1281-1440)',
    styles: { width: '1280px', height: '400px' },
    type: 'desktop',
  },
  '2xl': {
    name: '2xl — 1440px (was 1536px)',
    styles: { width: '1440px', height: '400px' },
    type: 'desktop',
  },
  '3xl': {
    name: '3xl — 1680px (new step)',
    styles: { width: '1680px', height: '400px' },
    type: 'desktop',
  },
  '4xl': {
    name: '4xl — 1920px (new step)',
    styles: { width: '1920px', height: '400px' },
    type: 'desktop',
  },
} as const;

// A single box whose border/background color and label swap at each pinned
// breakpoint. The color coding is plain CSS (a <style> block below), not
// Tailwind palette utilities — Tailwind's automatic source scanning isn't
// scoped to the lib build's __stories__ glob, so any `bg-teal-50`-style
// utility written here would still be extracted as a candidate and get
// baked into the published `dist/ui-react.css`. Plain CSS property/selector
// text isn't a Tailwind candidate, so it can't leak. The label-switching
// (`sm:hidden`, `md:max-lg:block`, …) below is left on real Tailwind
// breakpoint-prefixed utilities on purpose — that's the actual thing this
// story verifies.
//
// Font size scales up with each step too — reviewing the large breakpoints
// (xl/2xl/3xl) usually means zooming the browser out to fit that width on a
// normal monitor, which shrinks everything on screen proportionally. Scaling
// the label up as the breakpoint grows keeps it legible after that zoom-out
// instead of shrinking to unreadable.
function BreakpointIndicator() {
  return (
    <div className="bp-indicator flex min-h-40 w-full items-center justify-center rounded-lg border-4 p-6 text-center font-mono text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
      <style>{`
        .bp-indicator { border-color: #9ca3af; background-color: #f3f4f6; color: #374151; }
        @media (min-width: 40rem) { .bp-indicator { border-color: #60a5fa; background-color: #eff6ff; color: #1d4ed8; } }
        @media (min-width: 48rem) { .bp-indicator { border-color: #2dd4bf; background-color: #f0fdfa; color: #0f766e; } }
        @media (min-width: 64rem) { .bp-indicator { border-color: #22c55e; background-color: #f0fdf4; color: #15803d; } }
        @media (min-width: 80rem) { .bp-indicator { border-color: #eab308; background-color: #fefce8; color: #854d0e; } }
        @media (min-width: 90rem) { .bp-indicator { border-color: #f97316; background-color: #fff7ed; color: #9a3412; } }
        @media (min-width: 105rem) { .bp-indicator { border-color: #ef4444; background-color: #fef2f2; color: #991b1b; } }
        @media (min-width: 120rem) { .bp-indicator { border-color: #a855f7; background-color: #faf5ff; color: #6b21a8; } }
      `}</style>
      <span className="block sm:hidden">base — below 640px</span>
      <span className="hidden sm:max-md:block">
        sm — 640-767px (Tailwind default)
      </span>
      <span className="hidden md:max-lg:block">
        md — 768-1023px (Tailwind default)
      </span>
      <span className="hidden lg:max-xl:block">lg — 1024-1279px</span>
      <span className="hidden xl:max-2xl:block">
        xl — 1280-1439px (ours; design range 1281-1440, rounded to 1280px for
        a clean rem value)
      </span>
      <span className="hidden 2xl:max-3xl:block">
        2xl — 1440-1679px (ours; design range 1441-1680, rounded to 1440px
        for a clean rem value)
      </span>
      <span className="hidden 3xl:max-4xl:block">
        3xl — 1680-1919px (new step; design range 1681-1920, rounded to
        1680px for a clean rem value)
      </span>
      <span className="hidden 4xl:block">
        4xl — 1920px+ (new step, beyond the given design ranges)
      </span>
    </div>
  );
}

const meta: Meta<typeof BreakpointIndicator> = {
  title: 'Foundations/Breakpoints',
  component: BreakpointIndicator,
  parameters: {
    layout: 'fullscreen',
    viewport: { options: BREAKPOINT_VIEWPORTS },
    // Diagnostic/QA aid, not shipped UI — the toolbar-driven named viewports
    // above are for a human to pick manually, so an automated visual
    // regression snapshot (always taken at the default viewport) wouldn't
    // exercise this story's actual purpose. Opt out rather than commit a
    // baseline that never gets meaningfully re-verified.
    snapshot: { skip: true },
    docs: {
      description: {
        component:
          'Live demo of the breakpoint scale pinned in `src/styles/index.css`. ' +
          'Pick a named viewport from the toolbar above (sm / md / lg / xl / ' +
          '2xl / 3xl / 4xl) to see which step is active at that width.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BreakpointIndicator>;

export const BreakpointsDemo: Story = {
  render: () => (
    <div className="p-8">
      <BreakpointIndicator />
    </div>
  ),
};
