// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';
import { Select } from '../select';

const meta = {
  title: 'UI/Select/All States (generated)',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Select>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
      <Select disabled>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <Select>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>,
};

export const FocusVisible: Story = {
  render: () => <Select>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};

// transition "openPopup": trigger press / Space / Enter / ArrowDown -> true [guard: not disabled]
export const OpenPopup: Story = {
  render: () => <Select>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="combobox"], button');
    if (el) await userEvent.click(el as HTMLElement);
  },
};
