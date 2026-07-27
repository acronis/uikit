import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// code from this file ships. Mirrors `breakpoints-demo.stories.tsx`: it
// exists so design/QA can see the effect of the framework-agnostic
// `.ui-p-*`/`.ui-m-*`/`.ui-gap-*` spacing utility classes (generated from the
// `spacing.*` semantic tokens) at every scale step, and doubles as a visual
// regression net for this feature going forward.
const SPACING_SCALE = [
  0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 88, 96,
] as const;

function Swatch() {
  return <div className="size-8 shrink-0 rounded bg-blue-500" />;
}

function SpacingRow({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 py-3">
      <span className="w-12 shrink-0 font-mono text-sm text-gray-500">
        {step}
      </span>

      <div className="flex w-56 items-center border border-dashed border-gray-300">
        <div className={`ui-p-${step} bg-gray-100`}>
          <Swatch />
        </div>
      </div>

      <div className="flex w-56 items-center border border-dashed border-gray-300">
        <div className={`ui-m-${step} bg-gray-100`}>
          <Swatch />
        </div>
      </div>

      <div
        className={`ui-gap-${step} flex w-56 items-center border border-dashed border-gray-300 p-1`}
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
      <div className="mb-4 flex gap-6 font-mono text-xs font-semibold text-gray-600">
        <span className="w-12 shrink-0">step</span>
        <span className="w-56">.ui-p-*</span>
        <span className="w-56">.ui-m-*</span>
        <span className="w-56">.ui-gap-*</span>
      </div>

      {SPACING_SCALE.map((step) => (
        <SpacingRow key={step} step={step} />
      ))}

      <div className="mt-8">
        <p className="mb-2 font-mono text-xs font-semibold text-gray-600">
          .ui-mx-auto
        </p>
        <div className="w-full border border-dashed border-gray-300">
          <div className="ui-mx-auto w-24 bg-gray-100">
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
          'spacing utility classes, generated from the `spacing.*` semantic ' +
          'tokens for framework-agnostic (non-Tailwind) consumers. One row ' +
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
