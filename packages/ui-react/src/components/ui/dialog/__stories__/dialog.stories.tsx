import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../button';
import { DataTable } from '../../data-table';
import { Dialog, DialogClose } from '../dialog';

const VARIANTS = [
  'default',
  'rename',
  'save changes',
  'reset password',
  'discard changes',
  'accept',
  'read-only',
  'wide',
] as const;

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        "Selects the canned title / body / footer preset. `wide` is a legacy escape hatch (no canned preset) kept for backward compatibility.",
      table: {
        type: { summary: VARIANTS.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'default'" },
        category: 'Appearance',
      },
    },
    hasLoading: {
      control: 'boolean',
      description: 'Show a spinner overlay across the body + footer.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    hasHeader: {
      control: 'boolean',
      description:
        'Show the header (title + close button). When false, the title still renders off-screen so the dialog keeps an accessible name.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    hasFooter: {
      control: 'boolean',
      description: 'Show the footer (action buttons).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'large'],
      description:
        'Popup max-width (forwarded to DialogContent). `large` is a legacy backward-compatibility size with no design token.',
      table: {
        type: { summary: "'sm' | 'large'" },
        defaultValue: { summary: "'sm'" },
        category: 'Appearance',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    modal: {
      control: 'boolean',
      description: 'Modal behavior — focus trap and scroll lock while open.',
      table: {
        type: { summary: "boolean | 'trap-focus'" },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the dialog opens or closes.',
      table: {
        type: { summary: '(open, eventDetails) => void' },
        category: 'Events',
      },
    },
    children: {
      control: false,
      description: "Overrides the variant's default body content.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    title: {
      control: 'text',
      description: "Overrides the variant's default title.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    objectName: {
      control: 'text',
      description:
        "The real name of the object being acted on. Interpolated into the rename/discard changes/accept variants' canned title/body in place of the generic placeholder; ignored by other variants.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    objectNameLabel: {
      control: 'text',
      description:
        "Overrides the accessible name of the rename variant's text field. Ignored by every other variant.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Object name'" },
        category: 'Content',
      },
    },
    secondaryLabel: {
      control: 'text',
      description:
        "Overrides the variant's default secondary (dismiss) button label. Passing this on a variant with no secondary button by default also makes the button appear. Ignored when `footer` is provided.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    primaryLabel: {
      control: 'text',
      description:
        "Overrides the variant's default primary button label. Ignored when `footer` is provided.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    onPrimaryAction: {
      control: false,
      description:
        'Fires when the primary footer button is clicked. Does not close the dialog automatically. Ignored when `footer` is provided.',
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    footer: {
      control: false,
      description:
        "Replaces the footer's action content entirely with free-form buttons — the escape hatch the `wide` variant is meant to be paired with.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    closeLabel: {
      control: 'text',
      description: "Overrides the close button's accessible name.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Close'" },
        category: 'Content',
      },
    },
    portal: {
      control: false,
      description: 'Render inside a portal (forwarded to DialogContent).',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
  args: { variant: 'default', hasLoading: false },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Dialog {...args} defaultOpen />,
};

export const Default: Story = {
  render: () => <Dialog variant="default" defaultOpen />,
};

export const Rename: Story = {
  render: () => <Dialog variant="rename" defaultOpen />,
};

// `objectName` interpolates the real object's name into the rename/discard
// changes/accept variants' canned title/body, in place of the generic
// "object name" placeholder — no need to override title/children by hand.
export const WithObjectName: Story = {
  render: () => (
    <Dialog variant="rename" objectName="Q3 Report.xlsx" defaultOpen />
  ),
};

export const SaveChanges: Story = {
  render: () => <Dialog variant="save changes" defaultOpen />,
};

export const ResetPassword: Story = {
  render: () => <Dialog variant="reset password" defaultOpen />,
};

export const DiscardChanges: Story = {
  render: () => <Dialog variant="discard changes" defaultOpen />,
};

export const Accept: Story = {
  render: () => <Dialog variant="accept" defaultOpen />,
};

export const ReadOnly: Story = {
  render: () => <Dialog variant="read-only" defaultOpen />,
};

export const Loading: Story = {
  render: () => <Dialog variant="save changes" hasLoading defaultOpen />,
};

export const CustomContent: Story = {
  render: () => (
    <Dialog variant="default" defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        Any custom body content can be dropped into the slot, replacing the
        preset copy while keeping the header and footer chrome.
      </p>
    </Dialog>
  ),
};

// `hasHeader`/`hasFooter` (both default true) hide the header/footer chrome
// entirely — beyond the strict Figma DialogDefault contract, which always
// shows both. The title still renders off-screen when the header is hidden,
// so the dialog keeps an accessible name.
export const NoHeader: Story = {
  render: () => (
    <Dialog variant="default" hasHeader={false} defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        No header bar — no visible title, no close button. Escape or the
        footer actions still dismiss the dialog.
      </p>
    </Dialog>
  ),
};

export const NoFooter: Story = {
  render: () => (
    <Dialog variant="default" hasFooter={false} defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        No footer bar — no action buttons. The header&apos;s close button is
        the only way to dismiss the dialog.
      </p>
    </Dialog>
  ),
};

export const NoHeaderNoFooter: Story = {
  render: () => (
    <Dialog variant="default" hasHeader={false} hasFooter={false} defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        Body-only dialog — no header, no footer. Dismiss with Escape or an
        outside press; the dialog still has an accessible name from the
        off-screen title.
      </p>
    </Dialog>
  ),
};

// The popup grows with its body up to the viewport-margin bound
// (`calc(100dvh-96px)`); past that bound the body itself scrolls instead of
// the popup overflowing its frame. Stacking many real paragraphs reliably
// exceeds that bound regardless of the Storybook viewport.
export const TallContent: Story = {
  render: () => (
    <Dialog variant="default" defaultOpen>
      <div className="flex flex-col gap-3 text-sm leading-6 text-foreground">
        <p className="font-semibold">
          Top of the body — scroll down to reach the bottom marker.
        </p>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Paragraph {i + 1} of representative body content.</p>
        ))}
        <p className="font-semibold">
          Bottom of the body — the popup itself never grows past its margin.
        </p>
      </div>
    </Dialog>
  ),
};

// The popup's width is fixed to one of the predefined `size` values (never
// content-driven) — non-wrapping content wider than that fixed width scrolls
// horizontally inside the body instead of being clipped at the popup edge.
export const WideContent: Story = {
  render: () => (
    <Dialog variant="default" defaultOpen>
      <p className="whitespace-nowrap text-sm leading-6 text-foreground">
        This single line of non-wrapping text is intentionally wider than the
        dialog&apos;s fixed popup width, so the body must scroll horizontally
        to reveal the rest of it.
      </p>
    </Dialog>
  ),
};

// Both scroll axes at once: content that's both taller and wider than the
// popup's bounds. The body scrolls in whichever direction is needed —
// vertically for the paragraphs, horizontally for the non-wrapping line —
// independently of each other, in a single scroll container: per the CSS
// overflow spec, `overflow-y-auto` alone already makes `overflow-x` compute
// to `auto` too, so no separate horizontal scroll container is needed.
export const OverflowXY: Story = {
  render: () => (
    <Dialog variant="default" defaultOpen>
      <div className="flex flex-col gap-3 text-sm leading-6 text-foreground">
        <p className="whitespace-nowrap font-semibold">
          This non-wrapping line is wider than the dialog — scroll right to
          read the rest of it, and scroll down for more paragraphs below.
        </p>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} className="whitespace-nowrap">
            Row {i + 1}: another non-wrapping line, just as wide as the first.
          </p>
        ))}
      </div>
    </Dialog>
  ),
};

interface DataRow {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'pending';
  region: string;
  plan: string;
  usage: string;
  lastSeen: string;
  owner: string;
}

const DATA_TABLE_COLUMNS: ColumnDef<DataRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'usage', header: 'Usage' },
  { accessorKey: 'lastSeen', header: 'Last seen' },
  { accessorKey: 'owner', header: 'Owner' },
];

const DATA_TABLE_STATUSES: DataRow['status'][] = [
  'active',
  'suspended',
  'pending',
];

const DATA_TABLE_ROWS: DataRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: `WS-${1000 + i}`,
  name: `Workspace ${i + 1}`,
  status: DATA_TABLE_STATUSES[i % DATA_TABLE_STATUSES.length],
  region: ['us-east', 'eu-west', 'ap-south'][i % 3],
  plan: ['Starter', 'Business', 'Enterprise'][i % 3],
  usage: `${(i * 7) % 100}%`,
  lastSeen: `2026-0${(i % 9) + 1}-1${i % 9}`,
  owner: `owner-${i + 1}@example.com`,
}));

// A `wide` dialog with a real `DataTable` (30 rows) dropped into the body —
// the same grow-then-scroll behavior as `TallContent`, but with a
// representative composed component instead of synthetic content: all 8
// columns fit within the `large` popup width, so only the rows overflow —
// the body scrolls vertically for the rows that don't fit, no
// special-casing needed. (`DataTable`'s own `Table` wrapper — see
// table.tsx's `overflow-auto` — would scroll its columns horizontally on a
// narrower popup or with more columns; this story doesn't hit that case.)
export const WideDataTable: Story = {
  render: () => (
    <Dialog
      variant="wide"
      size="large"
      title="Workspaces"
      defaultOpen
      footer={
        <DialogClose render={<Button variant="secondary">Close</Button>} />
      }
    >
      <DataTable columns={DATA_TABLE_COLUMNS} data={DATA_TABLE_ROWS} bordered />
    </Dialog>
  ),
};

// The `wide` variant is a legacy escape hatch with no canned preset — kept for
// backward compatibility with pre-Figma call sites that used a wider popup and
// fully custom footer buttons. Pair it with `size="large"` (832px) and the
// `footer` prop for free-form action content.
export const Large: Story = {
  render: () => (
    <Dialog
      variant="wide"
      size="large"
      title="Configure discovery agent"
      defaultOpen
      footer={
        <>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button>Configure</Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-foreground">
        The discovery agent will obtain the neighbor IP addresses by using
        NetBIOS discovery, Web Service Discovery (WSD), and Address Resolution
        Protocol (ARP) table.
      </p>
    </Dialog>
  ),
};
