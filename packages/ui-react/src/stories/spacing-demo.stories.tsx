import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `breakpoints-demo.stories.tsx`: it exists
// so design/QA can see the effect of the framework-agnostic
// `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` spacing utility classes (generated from the
// `units.gap` primitive scale via dedicated build code, not a semantic token)
// at every scale step, and doubles as a visual regression net for this
// feature going forward. Colors/borders below are plain CSS (a `<style>`
// block) referencing `--ui-*` tokens directly, not Tailwind palette
// utilities — Tailwind's source scanning isn't scoped to the lib build's
// `__stories__` glob, so any `bg-blue-500`-style utility written here would
// still be extracted as a candidate and get baked into the published
// `dist/ui-react.css`. Plain CSS property/selector text isn't a Tailwind
// candidate, so it can't leak.
const SPACING_SCALE = [
  0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 88, 96,
] as const;

function Swatch() {
  return <div className="spacing-swatch size-8 shrink-0 rounded" />;
}

function SpacingRow({ step }: { step: number }) {
  return (
    <div className="spacing-row flex items-center gap-6 py-3">
      <span className="spacing-step w-12 shrink-0 font-mono text-sm">
        {step}
      </span>

      <div className="spacing-box flex w-56 items-center">
        <div className={`ui-p-${step} spacing-fill`}>
          <Swatch />
        </div>
      </div>

      <div className="spacing-box flex w-56 items-center">
        <div className={`ui-m-${step} spacing-fill`}>
          <Swatch />
        </div>
      </div>

      <div
        className={`ui-gap-${step} spacing-box flex w-56 items-center p-1`}
      >
        <Swatch />
        <Swatch />
      </div>
    </div>
  );
}

function SpacingDemo() {
  return (
    <div className="p-8">
      <style>{`
        .spacing-swatch { background-color: var(--ui-background-brand-primary-active); }
        .spacing-row { border-bottom: 1px solid var(--ui-border-on-surface-divider); }
        .spacing-step { color: var(--ui-text-on-surface-secondary); }
        .spacing-box { border: 1px dashed var(--ui-border-on-surface-border); }
        .spacing-fill { background-color: var(--ui-background-surface-secondary); }
        .spacing-label { color: var(--ui-text-on-surface-primary); }
      `}</style>

      <div className="spacing-label mb-4 flex gap-6 font-mono text-xs font-semibold">
        <span className="w-12 shrink-0">step</span>
        <span className="w-56">.ui-p-*</span>
        <span className="w-56">.ui-m-*</span>
        <span className="w-56">.ui-gap-*</span>
      </div>

      {SPACING_SCALE.map((step) => (
        <SpacingRow key={step} step={step} />
      ))}

      <div className="mt-8">
        <p className="spacing-label mb-2 font-mono text-xs font-semibold">
          .ui-mx-auto
        </p>
        <div className="spacing-box w-full">
          <div className="ui-mx-auto spacing-fill w-24">
            <Swatch />
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof SpacingDemo> = {
  title: 'Foundations/Spacing',
  component: SpacingDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live demo of the `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` (+ `.ui-mx-auto`) ' +
          'spacing utility classes, generated from the `units.gap` primitive ' +
          'scale for framework-agnostic (non-Tailwind) consumers. One row ' +
          'per scale step.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SpacingDemo>;

export const SpacingDemoStory: Story = {
  name: 'SpacingDemo',
  render: () => <SpacingDemo />,
};
