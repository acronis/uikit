// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetCloseButton,
  SheetBody,
  SheetDescription,
  SheetFooter,
} from '../sheet';
import { Button } from '../../button';
import { Sheet } from '../sheet';

const meta = {
  title: 'UI/Sheet/All States (generated)',
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Workload details</SheetTitle>
            <SheetCloseButton />
          </SheetHeader>
          <SheetBody>
            <SheetDescription>Inspect the selected workload.</SheetDescription>
          </SheetBody>
          <SheetFooter>
            <Button>Edit</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Workload details</SheetTitle>
          <SheetCloseButton />
        </SheetHeader>
        <SheetBody>
          <SheetDescription>Inspect the selected workload.</SheetDescription>
        </SheetBody>
        <SheetFooter>
          <Button>Edit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
