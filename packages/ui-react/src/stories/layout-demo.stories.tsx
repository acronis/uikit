import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `spacing-demo.stories.tsx`/
// `sizing-demo.stories.tsx`: shows the effect of the framework-agnostic
// `.ui-*` layout & text-flow utility classes (flex, grid, alignment, text
// wrapping/overflow, display) and doubles as a visual regression net. Colors/
// borders reference `--ui-*` tokens directly via a `<style>` block, not
// Tailwind palette utilities — see spacing-demo's header comment for why
// that matters for this lib build specifically.

function Chip({ children }: { children: ReactNode }) {
  return <div className="layout-chip">{children}</div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="layout-section mb-8">
      <p className="layout-label mb-3 font-mono text-xs font-semibold">
        {title}
      </p>
      {children}
    </section>
  );
}

function FlexDemo() {
  return (
    <Section title=".ui-flex / .ui-flex-row / .ui-flex-col / .ui-flex-wrap">
      <div className="layout-box ui-flex ui-flex-row gap-2 p-2">
        <Chip>1</Chip>
        <Chip>2</Chip>
        <Chip>3</Chip>
      </div>
      <div className="layout-box ui-flex ui-flex-col mt-2 gap-2 p-2">
        <Chip>1</Chip>
        <Chip>2</Chip>
        <Chip>3</Chip>
      </div>
      <div className="layout-box ui-flex ui-flex-wrap mt-2 w-40 gap-2 p-2">
        <Chip>1</Chip>
        <Chip>2</Chip>
        <Chip>3</Chip>
        <Chip>4</Chip>
        <Chip>5</Chip>
      </div>
    </Section>
  );
}

function GridDemo() {
  return (
    <Section title=".ui-grid / .ui-grid-cols-4 / .ui-col-span-2">
      <div className="layout-box ui-grid ui-grid-cols-4 gap-2 p-2">
        <Chip>1</Chip>
        <div className="ui-col-span-2">
          <Chip>span 2</Chip>
        </div>
        <Chip>3</Chip>
        <Chip>4</Chip>
      </div>
    </Section>
  );
}

function AlignmentDemo() {
  return (
    <Section title=".ui-items-center / .ui-justify-between / .ui-justify-center">
      <div className="layout-box ui-flex ui-items-center ui-justify-between h-16 gap-2 p-2">
        <Chip>start</Chip>
        <Chip>end</Chip>
      </div>
      <div className="layout-box ui-flex ui-items-center ui-justify-center mt-2 h-16 gap-2 p-2">
        <Chip>centered</Chip>
      </div>
    </Section>
  );
}

function NonFlexAlignmentDemo() {
  return (
    <Section title=".ui-text-left / .ui-text-center / .ui-text-right / .ui-float-right">
      <div className="layout-box ui-text-left w-64 p-2">left</div>
      <div className="layout-box ui-text-center mt-2 w-64 p-2">center</div>
      <div className="layout-box ui-text-right mt-2 w-64 p-2">right</div>
      <div className="layout-box mt-2 w-64 p-2">
        <Chip>
          <span className="ui-float-right">floated</span>
        </Chip>
      </div>
    </Section>
  );
}

function TextFlowDemo() {
  return (
    <Section title=".ui-truncate / .ui-line-clamp-2 / .ui-whitespace-nowrap">
      <div className="layout-box ui-truncate w-40 p-2">
        This text is long enough that it should be truncated with an ellipsis
      </div>
      <div className="layout-box ui-line-clamp-2 mt-2 w-40 p-2">
        This text is long enough that it should wrap and then clamp after
        exactly two lines, hiding everything past that point.
      </div>
      <div className="layout-box ui-whitespace-nowrap mt-2 w-40 overflow-hidden p-2">
        This text should never wrap onto a second line
      </div>
      <a href="#" className="ui-underline-offset-4 mt-2 inline-block underline">
        .ui-underline-offset-4 link
      </a>
    </Section>
  );
}

function ListDemo() {
  return (
    <Section title=".ui-list-disc / .ui-list-decimal / .ui-list-none">
      <div className="flex gap-8">
        <ul className="ui-list-disc ui-list-inside">
          <li>disc item one</li>
          <li>disc item two</li>
        </ul>
        <ol className="ui-list-decimal ui-list-inside">
          <li>decimal item one</li>
          <li>decimal item two</li>
        </ol>
        <ul className="ui-list-none">
          <li>none item one</li>
          <li>none item two</li>
        </ul>
      </div>
    </Section>
  );
}

function CursorDemo() {
  const cursors = ['help', 'move', 'pointer', 'not-allowed', 'grab'] as const;
  return (
    <Section title=".ui-cursor-help / .ui-cursor-move / .ui-cursor-pointer / .ui-cursor-not-allowed">
      <div className="flex gap-2">
        {cursors.map((cursor) => (
          <div key={cursor} className={`ui-cursor-${cursor}`}>
            <Chip>{cursor}</Chip>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ResizeDemo() {
  return (
    <Section title=".ui-resize-none / .ui-resize-x / .ui-resize-y">
      <div className="flex gap-4">
        <textarea
          className="layout-box ui-resize-none h-16 w-32 p-2"
          defaultValue="resize-none"
        />
        <textarea
          className="layout-box ui-resize-x h-16 w-32 p-2"
          defaultValue="resize-x"
        />
        <textarea
          className="layout-box ui-resize-y h-16 w-32 p-2"
          defaultValue="resize-y"
        />
      </div>
    </Section>
  );
}

function ChildSpacingDemo() {
  return (
    <Section title=".ui-space-y-4 / .ui-divide-y">
      <div className="ui-space-y-4 layout-box w-40 p-2">
        <Chip>1</Chip>
        <Chip>2</Chip>
        <Chip>3</Chip>
      </div>
      <div className="ui-divide-y layout-box mt-2 w-40 p-2">
        <div className="py-1">row 1</div>
        <div className="py-1">row 2</div>
        <div className="py-1">row 3</div>
      </div>
    </Section>
  );
}

function BorderWidthDemo() {
  const sides = ['border-t', 'border-r', 'border-b', 'border-l'] as const;
  return (
    <Section title=".ui-border-t-0 / .ui-border-x-0 / .ui-border-y / .ui-border-*">
      <div className="flex gap-4">
        {sides.map((side) => (
          <div
            key={side}
            className={`ui-${side}-4 border-solid p-2`}
            style={{ borderColor: 'var(--ui-border-on-surface-border-active)' }}
          >
            .ui-{side}-4
          </div>
        ))}
        <div
          className="ui-border-x-0 ui-border-y-4 border-solid p-2"
          style={{ borderColor: 'var(--ui-border-on-surface-border-active)' }}
        >
          .ui-border-x-0 .ui-border-y-4
        </div>
      </div>
    </Section>
  );
}

function DisplayDemo() {
  return (
    <Section title=".ui-block / .ui-inline-block / .ui-hidden">
      <div className="layout-box p-2">
        <span className="ui-block">
          <Chip>block</Chip>
        </span>
        <span className="ui-inline-block">
          <Chip>inline-block</Chip>
        </span>
        <span className="ui-hidden">
          <Chip>hidden (never rendered)</Chip>
        </span>
      </div>
    </Section>
  );
}

function LayoutDemo() {
  return (
    <div className="p-8">
      <style>{`
        .layout-box { border: 1px dashed var(--ui-border-on-surface-border); }
        .layout-label { color: var(--ui-text-on-surface-primary); }
        .layout-chip {
          background-color: var(--ui-background-brand-primary-active);
          color: var(--ui-text-on-brand-primary);
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
      `}</style>

      <FlexDemo />
      <GridDemo />
      <AlignmentDemo />
      <NonFlexAlignmentDemo />
      <TextFlowDemo />
      <DisplayDemo />
      <ListDemo />
      <CursorDemo />
      <ResizeDemo />
      <ChildSpacingDemo />
      <BorderWidthDemo />
    </div>
  );
}

const meta: Meta<typeof LayoutDemo> = {
  title: 'Foundations/Layout',
  component: LayoutDemo,
  parameters: {
    layout: 'fullscreen',
    // Eleven sections stacked vertically exceed the default viewport —
    // capture the full page so nothing below the fold is missing from the
    // visual regression baseline.
    snapshot: { fullPage: true },
    docs: {
      description: {
        component:
          'Live demo of the static `.ui-*` layout & text-flow utility ' +
          'classes — flex, grid, flex/grid alignment, non-flex alignment ' +
          '(text-align, float), text wrapping/overflow (truncate, ' +
          'line-clamp, whitespace, underline-offset), display, list-style, ' +
          'cursor, resize, child spacing (space-y/divide-y), and ' +
          'border-width per side — for framework-agnostic (non-Tailwind) ' +
          'consumers. Typography (font-size/weight) is out of scope here; ' +
          'see the Typography catalog.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LayoutDemo>;

export const LayoutDemoStory: Story = {
  name: 'LayoutDemo',
  render: () => <LayoutDemo />,
};
