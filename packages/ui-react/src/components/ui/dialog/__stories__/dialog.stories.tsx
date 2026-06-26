import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
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
      description: 'Fires when the dialog opens or closes.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    // `size` is a `DialogContent` prop (not a Dialog root prop), so it isn't an
    // arg here — see the `Large` story and the API reference for the scale.
    children: {
      control: false,
      description:
        'Composed parts — `DialogTrigger`, `DialogContent` (wrapping header/body/footer parts).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button variant="destructive">Delete account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run backup now?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            A full backup of all 24 workloads will start immediately.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Run backup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// `DialogContent` takes a `size` prop (max-width): xs 464 · sm 512 (default) ·
// md 672 · lg 832 · xl 992 · 2xl 1136 (px).
export const Large: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Configure discovery agent</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            The discovery agent will obtain the neighbor IP addresses by using
            NetBIOS discovery, Web Service Discovery (WSD), and Address
            Resolution Protocol (ARP) table.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button>Configure</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
