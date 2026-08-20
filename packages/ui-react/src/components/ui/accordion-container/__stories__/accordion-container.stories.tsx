import type { Meta, StoryObj } from '@storybook/react-vite';
import { within } from 'storybook/test';

import { AccordionContainer } from '../accordion-container';

// AccordionContainer is the generic disclosure primitive behind Card's and
// Section's `isCollapsable` variant (false / true-expanded / true-collapsed).
// It's intentionally unstyled beyond the disclosure mechanic itself, so these
// stories wrap it in a minimal bordered box to make the three states visible —
// that box is story-only demo chrome, not something AccordionContainer ships.
const meta = {
  title: 'UI/AccordionContainer',
  component: AccordionContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    collapsible: {
      control: 'boolean',
      description: 'Whether the disclosure exists at all (the isCollapsable variant).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    open: {
      control: 'boolean',
      description: 'Whether the panel is open (controlled).',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the panel is initially open (uncontrolled).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    onOpenChange: {
      control: false,
      description: 'Fired when the open state changes.',
      table: { type: { summary: '(open: boolean, eventDetails) => void' }, category: 'Events' },
    },
    render: {
      control: false,
      description: 'Base UI composition prop — replaces the rendered root element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
    children: {
      control: false,
      description: 'A node, or a function receiving the current { open } state.',
      table: {
        type: { summary: 'ReactNode | ((state: { open: boolean }) => ReactNode)' },
        category: 'Content',
      },
    },
  },
} satisfies Meta<typeof AccordionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// isCollapsable=false — no trigger, no panel wrapper; content renders directly.
export const NotCollapsable: Story = {
  args: {
    collapsible: false,
  },
  render: (args) => (
    <div className="w-[320px] rounded-md border border-border p-4">
      <AccordionContainer {...args}>
        <div className="font-medium">Backup schedule</div>
        <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
          Runs every night at 2:00 AM.
        </p>
      </AccordionContainer>
    </div>
  ),
};

// Shared demo header: a title always shows, but the description line only
// renders while expanded — a header outside `Content` that varies by state,
// exactly why the render-prop hands `open` back to the consumer even when
// AccordionContainer owns the state itself (uncontrolled).
function DemoHeader({ open }: { open: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">Backup schedule</div>
        {!open && (
          <p className="text-sm text-[var(--ui-text-on-surface-secondary)]">
            Nightly at 2:00 AM
          </p>
        )}
      </div>
      <AccordionContainer.Trigger
        aria-label={open ? 'Collapse' : 'Expand'}
        className="rounded-md hover:bg-[var(--ui-background-surface-hover)]"
      />
    </div>
  );
}

// isCollapsable=true-expanded — the panel starts open; the header drops its
// collapsed-only summary line and the panel shows the full detail instead.
export const Expanded: Story = {
  args: {
    collapsible: true,
    defaultOpen: true,
  },
  render: (args) => (
    <div className="w-[320px] rounded-md border border-border p-4">
      <AccordionContainer {...args}>
        {({ open }) => (
          <>
            <DemoHeader open={open} />
            <AccordionContainer.Content>
              <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
                Runs every night at 2:00 AM. Retains the last 30 backups and
                verifies each one automatically after completion.
              </p>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </div>
  ),
};

// isCollapsable=true-collapsed — the panel starts closed; the header shows a
// one-line summary in place of the hidden panel content.
export const Collapsed: Story = {
  args: {
    collapsible: true,
    defaultOpen: false,
  },
  render: (args) => (
    <div className="w-[320px] rounded-md border border-border p-4">
      <AccordionContainer {...args}>
        {({ open }) => (
          <>
            <DemoHeader open={open} />
            <AccordionContainer.Content>
              <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
                Runs every night at 2:00 AM. Retains the last 30 backups and
                verifies each one automatically after completion.
              </p>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </div>
  ),
};

// Keyboard-focus state on the trigger — the play function tabs to it so the
// `focus-visible:ring-2` treatment is captured for VR (keyboard users need a
// visible indicator; there was previously none).
export const Focused: Story = {
  args: {
    collapsible: true,
    defaultOpen: false,
  },
  render: (args) => (
    <div className="w-[320px] rounded-md border border-border p-4">
      <AccordionContainer {...args}>
        {({ open }) => (
          <>
            <DemoHeader open={open} />
            <AccordionContainer.Content>
              <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
                Runs every night at 2:00 AM. Retains the last 30 backups and
                verifies each one automatically after completion.
              </p>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').focus();
  },
};
