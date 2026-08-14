import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FittedActions } from '../fitted-actions';
import type { FittedAction } from '../fitted-actions';

const meta = {
  title: 'UI/FittedActions',
  component: FittedActions,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    actions: {
      control: false,
      description: 'Ordered actions; trailing items overflow into the menu first.',
      table: { type: { summary: 'FittedAction[]' } },
    },
    showDropdown: {
      control: 'boolean',
      description: 'Collapse overflow into a "More" menu.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    moreLabel: {
      control: 'text',
      description: 'Label for the overflow trigger.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: '"More"' } },
    },
    gap: {
      control: { type: 'number', min: 0, max: 32, step: 2 },
      description: 'Inter-item gap in px.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '8' } },
    },
    onAction: {
      control: false,
      description: 'Fired for any chosen action, after its own `onSelect`.',
      table: { type: { summary: '(action: FittedAction) => void' } },
    },
    renderAction: {
      control: false,
      description: 'Custom inline action renderer.',
      table: { type: { summary: '(action, api) => ReactNode' } },
    },
    renderTrigger: {
      control: false,
      description: 'Custom overflow trigger renderer.',
      table: { type: { summary: '(api) => ReactElement' } },
    },
  },
} satisfies Meta<typeof FittedActions>;

export default meta;
type Story = StoryObj<typeof meta>;

const actions: FittedAction[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'tag', label: 'Tag' },
  { id: 'export', label: 'Export' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
];

/** All actions fit in a wide container — nothing overflows. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <FittedActions {...args} actions={actions} />
    </div>
  ),
};

/** Narrow container — trailing actions collapse into "More". */
export const WithOverflow: Story = {
  render: () => (
    <div style={{ width: 160 }}>
      <FittedActions actions={actions} />
    </div>
  ),
};

/** `showDropdown={false}` renders all actions inline regardless of available width. No "More" trigger is shown. */
export const NoDropdown: Story = {
  render: () => (
    <div style={{ width: 160 }}>
      <FittedActions actions={actions} showDropdown={false} />
    </div>
  ),
};

/** `isDisplayed: false` hides an action without removing it from the array. */
export const WithHiddenAction: Story = {
  render: () => (
    <div style={{ width: 500 }}>
      <FittedActions
        actions={[
          { id: 'edit', label: 'Edit' },
          { id: 'hidden', label: 'Hidden', isDisplayed: false },
          { id: 'export', label: 'Export' },
        ]}
      />
    </div>
  ),
};
