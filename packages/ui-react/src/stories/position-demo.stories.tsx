import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `sizing-demo.stories.tsx`: shows the
// effect of the framework-agnostic `.ui-*` position-type and offset utility
// classes and doubles as a visual regression net. Colors/borders reference
// `--ui-*` tokens directly via a `<style>` block, not Tailwind palette
// utilities — see spacing-demo's header comment for why that matters for
// this lib build specifically.

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="position-section mb-8">
      <p className="position-label mb-3 font-mono text-xs font-semibold">
        {title}
      </p>
      {children}
    </section>
  );
}

function OffsetDemo() {
  return (
    <Section title=".ui-relative + .ui-top-8 / .ui-right-8">
      <div className="position-box ui-relative h-32 w-64">
        <div className="position-chip ui-absolute ui-top-8 ui-right-8">
          top-8 / right-8
        </div>
      </div>
    </Section>
  );
}

function InsetDemo() {
  return (
    <Section title=".ui-absolute + .ui-inset-4">
      <div className="position-box ui-relative h-32 w-64">
        <div className="position-chip ui-absolute ui-inset-4 flex items-center justify-center">
          inset-4
        </div>
      </div>
    </Section>
  );
}

function FullOffsetDemo() {
  return (
    <Section title=".ui-absolute + .ui-bottom-full (sits above its container)">
      <div className="position-box ui-relative mt-12 h-16 w-64">
        <div className="position-chip ui-absolute ui-bottom-full">
          bottom-full
        </div>
      </div>
    </Section>
  );
}

function StickyDemo() {
  return (
    <Section title=".ui-sticky + .ui-top-0 (scroll the box)">
      <div className="position-box h-32 w-64 overflow-y-auto">
        <div className="position-chip ui-sticky ui-top-0">sticky header</div>
        <div className="position-filler h-64" />
      </div>
    </Section>
  );
}

function PositionDemo() {
  return (
    <div className="p-8">
      <style>{`
        .position-box { border: 1px dashed var(--ui-border-on-surface-border); }
        .position-label { color: var(--ui-text-on-surface-primary); }
        .position-chip {
          background-color: var(--ui-background-brand-primary-active);
          color: var(--ui-text-on-brand-primary);
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .position-filler { background-color: var(--ui-background-surface-secondary); }
      `}</style>

      <OffsetDemo />
      <InsetDemo />
      <FullOffsetDemo />
      <StickyDemo />
    </div>
  );
}

const meta: Meta<typeof PositionDemo> = {
  title: 'Foundations/Position',
  component: PositionDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Live demo of the `.ui-static`/`.ui-relative`/`.ui-absolute`/' +
          '`.ui-fixed`/`.ui-sticky` position-type classes and the ' +
          '`.ui-top-*`/`.ui-right-*`/`.ui-bottom-*`/`.ui-left-*`/' +
          '`.ui-start-*`/`.ui-end-*`/`.ui-inset-*`/`.ui-inset-x-*`/' +
          '`.ui-inset-y-*` offset classes (+ a `-full` variant), generated ' +
          'from the same spacing scale, for framework-agnostic ' +
          '(non-Tailwind) consumers.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PositionDemo>;

export const PositionDemoStory: Story = {
  name: 'PositionDemo',
  render: () => <PositionDemo />,
};
