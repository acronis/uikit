import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { AccordionContainer } from '../../accordion-container';
import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import { Card, CardContent, CardFooter, CardHeader } from '../card';

// `CardHeader` carries almost all of the design's interactive surface
// (drag handle, switch, avatar, rename, extras, actions), so it — not the
// plain `Card` root — is the story `component` with the full control set.
const meta = {
  title: 'UI/Card',
  component: CardHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: "The card's title.",
      table: { type: { summary: 'string' }, category: 'Content' },
      defaultValue: { summary: 'Title' },
    },
    description: {
      control: 'text',
      description:
        'Helper text shown under the title when `hasDescription` is set.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    hasDescription: {
      control: 'boolean',
      description: 'Shows `description` below the title.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    isDraggable: {
      control: 'boolean',
      description:
        'Shows a drag handle at the start of the header, for reorderable lists.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    dragHandleLabel: {
      control: 'text',
      description: 'Accessible label for the drag handle.',
      table: {
        type: { summary: 'string' },
        category: 'Content',
        defaultValue: { summary: 'Reorder' },
      },
    },
    isSwitchable: {
      control: 'boolean',
      description: 'Shows a toggle switch at the start of the header.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    switchChecked: {
      control: 'boolean',
      description: 'Controlled checked state of the header switch.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultSwitchChecked: {
      control: 'boolean',
      description: 'Uncontrolled initial checked state of the header switch.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onSwitchCheckedChange: {
      control: false,
      description: 'Fires when the header switch is toggled.',
      table: {
        type: { summary: '(checked: boolean) => void' },
        category: 'Events',
      },
    },
    switchDisabled: {
      control: 'boolean',
      description: 'Disables the header switch.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    switchLabel: {
      control: 'text',
      description: 'Accessible label for the header switch.',
      table: {
        type: { summary: 'string' },
        category: 'Content',
        defaultValue: { summary: 'Toggle card' },
      },
    },
    hasAvatar: {
      control: 'boolean',
      description: 'Shows an avatar before the title.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    avatarLabel: {
      control: 'text',
      description:
        'Initials shown in the default avatar; ignored if `avatar` is provided.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    avatar: {
      control: false,
      description: 'Replaces the default initials avatar with custom content.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    hasRename: {
      control: 'boolean',
      description: 'Shows a rename button next to the title.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    onRename: {
      control: false,
      description: 'Fires when the rename button is activated.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    renameLabel: {
      control: 'text',
      description: 'Accessible label for the rename button.',
      table: {
        type: { summary: 'string' },
        category: 'Content',
        defaultValue: { summary: 'Rename' },
      },
    },
    extras: {
      control: false,
      description:
        'Extra content rendered inline next to the title (e.g. a tag or badge).',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    actions: {
      control: false,
      description:
        'Actions rendered at the end of the header (e.g. a menu button).',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the header.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    isCollapsible: {
      control: 'boolean',
      description:
        'Shows a disclosure trigger at the end of the header. Only has an effect inside a collapsible AccordionContainer.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    collapseLabel: {
      control: 'text',
      description: 'Accessible label for the collapse trigger.',
      table: {
        type: { summary: 'string' },
        category: 'Content',
        defaultValue: { summary: 'Toggle card' },
      },
    },
  },
} satisfies Meta<typeof CardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Backup status',
    description: 'Last successful run 5 minutes ago.',
    hasDescription: true,
  },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">
          All 24 workloads are protected and up to date.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>View report</Button>
        <Button variant="secondary">Run now</Button>
      </CardFooter>
    </Card>
  ),
};

export const HasError: Story = {
  args: {
    title: 'Backup status',
    description: 'Last run failed.',
    hasDescription: true,
  },
  render: (args) => (
    <Card className="w-[350px]" hasError>
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">Retry the job or check the agent logs.</p>
      </CardContent>
    </Card>
  ),
};

export const Draggable: Story = {
  args: { title: 'Storage usage', isDraggable: true },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">
          Drag the handle to reorder this card in a list.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Switchable: Story = {
  args: {
    title: 'Email notifications',
    isSwitchable: true,
    defaultSwitchChecked: true,
  },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">Toggle without expanding the card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithAvatar: Story = {
  args: { title: 'Sofia Bergman', hasAvatar: true, avatarLabel: 'SB' },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">
          Card owner shown as an avatar next to the title.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithRename: Story = {
  args: {
    title: 'Untitled policy',
    hasRename: true,
    renameLabel: 'Rename policy',
  },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader {...args} />
      <CardContent>
        <p className="text-sm">Click the pencil to rename this card.</p>
      </CardContent>
    </Card>
  ),
};

export const WithExtrasAndActions: Story = {
  args: { title: 'Cyber Protection' },
  render: (args) => (
    <Card className="w-[350px]">
      <CardHeader
        {...args}
        extras={
          <span className="rounded-sm bg-[var(--ui-background-surface-primary)] px-1.5 py-0.5 text-xs text-[var(--ui-text-on-surface-secondary)]">
            Beta
          </span>
        }
        actions={
          <ButtonIcon aria-label="More actions">
            <EllipsisIcon size={24} />
          </ButtonIcon>
        }
      />
      <CardContent>
        <p className="text-sm">
          Extras sit next to the title; actions align to the end.
        </p>
      </CardContent>
    </Card>
  ),
};

// Shared header args + a state-dependent description for the collapsible
// stories below. The header's title/controls stay put, but the description
// swaps to a denser one-line summary while collapsed — since the panel
// content is hidden in that state, the header is where that context has to
// live. This is the same pattern AccordionContainer's own docs use (see
// `accordion-container.stories.tsx`'s `DemoHeader`), applied through the
// `AccordionContainer` render-prop's `{ open }` state.
const collapsibleHeaderArgs = {
  title: 'Backup policy',
  isCollapsible: true,
  collapseLabel: 'Toggle backup policy',
};

function collapsibleDescription(open: boolean) {
  return open
    ? 'Applies to 12 workloads.'
    : '12 workloads · last run 5 minutes ago';
}

function CollapsibleCardDemo({
  args,
  defaultOpen,
}: {
  args: ComponentProps<typeof CardHeader>;
  defaultOpen: boolean;
}) {
  return (
    <Card className="w-[420px]">
      <AccordionContainer collapsible defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <CardHeader
              {...args}
              hasDescription
              description={collapsibleDescription(open)}
            />
            <AccordionContainer.Content>
              <CardContent>
                <p className="text-sm">
                  Collapse the card to hide the content and footer while
                  keeping the header visible.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button>Save</Button>
                <Button variant="secondary">Cancel</Button>
              </CardFooter>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </Card>
  );
}

export const Expanded: Story = {
  args: collapsibleHeaderArgs,
  render: (args) => <CollapsibleCardDemo args={args} defaultOpen />,
};

export const Collapsed: Story = {
  args: collapsibleHeaderArgs,
  render: (args) => <CollapsibleCardDemo args={args} defaultOpen={false} />,
};

// Side by side so the header difference between the two states is visible at
// a glance: the trigger's chevron points down when expanded and toward the
// reading-direction end when collapsed, and the description text itself
// changes (full sentence when expanded vs. a dense summary when collapsed,
// since the content/footer region only renders while expanded).
export const ExpandedVsCollapsed: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-[var(--ui-text-on-surface-secondary)]">
          Expanded
        </span>
        <CollapsibleCardDemo args={collapsibleHeaderArgs} defaultOpen />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-[var(--ui-text-on-surface-secondary)]">
          Collapsed
        </span>
        <CollapsibleCardDemo args={collapsibleHeaderArgs} defaultOpen={false} />
      </div>
    </div>
  ),
};

// FullFeatured is collapsible: every header feature (drag, switch, avatar,
// rename, actions) combines with the collapse trigger, and the description
// swaps between a full sentence (expanded) and a dense status summary
// (collapsed) — the same header-changes-with-state pattern as the stories
// above, exercised together with the rest of the header's interactive
// surface.
export const FullFeatured: Story = {
  args: {
    title: 'Backup policy',
    isDraggable: true,
    isSwitchable: true,
    defaultSwitchChecked: true,
    hasAvatar: true,
    avatarLabel: 'SB',
    hasRename: true,
    isCollapsible: true,
  },
  render: (args) => (
    <Card className="w-[420px]">
      <AccordionContainer collapsible defaultOpen>
        {({ open }) => (
          <>
            <CardHeader
              {...args}
              hasDescription
              description={collapsibleDescription(open)}
              actions={
                <ButtonIcon aria-label="More actions">
                  <EllipsisIcon size={24} />
                </ButtonIcon>
              }
            />
            <AccordionContainer.Content>
              <CardContent>
                <p className="text-sm">
                  Every header feature combined: drag, switch, avatar,
                  rename, collapse.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button>Save</Button>
                <Button variant="secondary">Cancel</Button>
              </CardFooter>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-4">
        <p className="text-sm">
          A bare card with content and no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};
