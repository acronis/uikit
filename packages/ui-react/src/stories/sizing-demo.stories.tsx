import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `spacing-demo.stories.tsx`: it exists so
// design/QA can see the effect of the framework-agnostic `.ui-w-*`/`.ui-h-*`
// (+ min/max) sizing utility classes at every scale step, and doubles as a
// visual regression net for this feature going forward. Colors/borders below
// reference `--ui-*` tokens directly via a `<style>` block, not Tailwind
// palette utilities — see spacing-demo's header comment for why that matters
// for this lib build specifically.
const SIZING_SCALE = [
  0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 88, 96,
] as const;

function SizingRow({ step }: { step: number }) {
  return (
    <div className="sizing-row flex items-center gap-6 py-3">
      <span className="sizing-step w-12 shrink-0 font-mono text-sm">
        {step}
      </span>

      <div className="sizing-box flex h-8 w-56 items-center">
        <div className={`ui-w-${step} sizing-fill h-6`} />
      </div>

      <div className="sizing-box flex h-24 w-20 items-start">
        <div className={`ui-h-${step} sizing-fill w-6`} />
      </div>
    </div>
  );
}

function SizingDemo() {
  return (
    <div className="p-8">
      <style>{`
        .sizing-row { border-bottom: 1px solid var(--ui-border-on-surface-divider); }
        .sizing-step { color: var(--ui-text-on-surface-secondary); }
        .sizing-box { border: 1px dashed var(--ui-border-on-surface-border); }
        .sizing-fill { background-color: var(--ui-background-brand-primary-active); }
        .sizing-label { color: var(--ui-text-on-surface-primary); }
      `}</style>

      <div className="sizing-label mb-4 flex gap-6 font-mono text-xs font-semibold">
        <span className="w-12 shrink-0">step</span>
        <span className="w-56">.ui-w-*</span>
        <span className="w-20">.ui-h-*</span>
      </div>

      {SIZING_SCALE.map((step) => (
        <SizingRow key={step} step={step} />
      ))}

      <div className="mt-8 flex gap-12">
        <div>
          <p className="sizing-label mb-2 font-mono text-xs font-semibold">
            .ui-min-w-64 / .ui-max-w-full
          </p>
          <div className="sizing-box h-8 w-full">
            <div className="ui-min-w-64 ui-max-w-full sizing-fill h-6 w-24" />
          </div>
        </div>

        <div>
          <p className="sizing-label mb-2 font-mono text-xs font-semibold">
            .ui-min-h-32 / .ui-max-h-64
          </p>
          <div className="sizing-box flex h-24 w-24 items-start">
            <div className="ui-min-h-32 ui-max-h-64 sizing-fill w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof SizingDemo> = {
  title: 'Foundations/Sizing',
  component: SizingDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live demo of the `.ui-w-*`/`.ui-h-*`/`.ui-min-w-*`/`.ui-min-h-*`/' +
          '`.ui-max-w-*`/`.ui-max-h-*` (+ `.ui-max-w-full`) sizing utility ' +
          'classes, generated from the same `units.gap` primitive scale as ' +
          'the spacing utilities, for framework-agnostic (non-Tailwind) ' +
          'consumers. One row per scale step.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SizingDemo>;

export const SizingDemoStory: Story = {
  name: 'SizingDemo',
  render: () => <SizingDemo />,
};
