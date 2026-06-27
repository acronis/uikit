import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  // Edge-anchored panel — capture the whole page so the full-height panel + the
  // dimmed backdrop are in frame.
  parameters: { layout: 'fullscreen', snapshot: { fullPage: true } },
  tags: ['autodocs'],
  argTypes: {
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
      description:
        'Modal behavior — focus trap and scroll lock while open. Default `true`.',
      table: {
        type: { summary: "boolean | 'trap-focus'" },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the sheet opens or closes.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    // `side` is a `SheetContent` prop (not a Sheet root prop) — see the per-side
    // stories and the API reference.
    children: {
      control: false,
      description:
        'Composed parts — `SheetTrigger`, `SheetContent` (wrapping header/body/footer parts).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const PanelBody = () => (
  <SheetBody>
    <SheetDescription>
      Inspect and act on the selected item without leaving the page.
    </SheetDescription>
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Status</dt>
      <dd className="font-medium">Protected</dd>
      <dt className="text-muted-foreground">Last backup</dt>
      <dd className="font-medium">5 minutes ago</dd>
      <dt className="text-muted-foreground">Owner</dt>
      <dd className="font-medium">ken99@example.com</dd>
    </dl>
  </SheetBody>
);

export const Default: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="secondary">Open details</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Workload details</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <PanelBody />
        <SheetFooter>
          <SheetClose render={<Button variant="ghost">Close</Button>} />
          <Button>Edit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <PanelBody />
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <PanelBody />
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick actions</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <PanelBody />
      </SheetContent>
    </Sheet>
  ),
};
