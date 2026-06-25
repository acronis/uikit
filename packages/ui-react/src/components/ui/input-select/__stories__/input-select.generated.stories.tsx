// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import {
  InputSelectField,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
  InputSelectContent,
  InputSelectItem,
} from '../input-select';
import { InputSelect } from '../input-select';

const meta = {
  title: 'UI/InputSelect/All States (generated)',
  component: InputSelect,
} satisfies Meta<typeof InputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <InputSelect>
        <InputSelectField>
          <InputSelectLabel>Fruit</InputSelectLabel>
          <InputSelectTrigger>
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="banana">Banana</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
      <InputSelect disabled>
        <InputSelectField>
          <InputSelectLabel>Fruit</InputSelectLabel>
          <InputSelectTrigger>
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="banana">Banana</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <InputSelect>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectItem value="apple">Apple</InputSelectItem>
        <InputSelectItem value="banana">Banana</InputSelectItem>
      </InputSelectContent>
    </InputSelect>
  ),
};

export const FocusVisible: Story = {
  render: () => (
    <InputSelect>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectItem value="apple">Apple</InputSelectItem>
        <InputSelectItem value="banana">Banana</InputSelectItem>
      </InputSelectContent>
    </InputSelect>
  ),
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};

// transition "openPopup": trigger press / Space / Enter / ArrowDown -> true [guard: not disabled]
export const OpenPopup: Story = {
  render: () => (
    <InputSelect>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectItem value="apple">Apple</InputSelectItem>
        <InputSelectItem value="banana">Banana</InputSelectItem>
      </InputSelectContent>
    </InputSelect>
  ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[role="group"], div');
    if (el) await userEvent.click(el as HTMLElement);
  },
};
