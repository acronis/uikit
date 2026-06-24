import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchGlobal } from '../search-global';

const meta = {
  title: 'UI/SearchGlobal',
  component: SearchGlobal,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the input.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Search anything' }, category: 'Content' },
    },
    shortcut: {
      control: 'text',
      description: 'Decorative keyboard-shortcut hint at the trailing edge. Pass null to hide.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: '⌘K' }, category: 'Content' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name for the input (no visible label).',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Search' }, category: 'Accessibility' },
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SearchGlobal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomPlaceholder: Story = {
  args: { placeholder: 'Search the platform' },
};

export const CustomShortcut: Story = {
  args: { shortcut: '/' },
};

export const WithoutShortcut: Story = {
  args: { shortcut: null },
};

export const WithValue: Story = {
  args: { defaultValue: 'backup policy' },
};
