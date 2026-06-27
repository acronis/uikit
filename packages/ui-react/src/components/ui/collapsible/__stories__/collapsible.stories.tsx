import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[320px]">
      <CollapsibleTrigger
        render={<Button variant="ghost" className="w-full justify-start" />}
      >
        Show advanced settings
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 py-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
          These options change how backups are scheduled and retained.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
