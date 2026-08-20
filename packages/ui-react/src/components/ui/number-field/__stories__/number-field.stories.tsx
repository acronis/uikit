import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../number-field';

const meta = {
  title: 'UI/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 3, min: 0, max: 99 },
  render: (args) => (
    <div className="w-[180px]">
      <NumberField {...args}>
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[180px]">
      <NumberField defaultValue={3} disabled>
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  ),
};

// The group no longer hardcodes `w-full`, so a consumer-supplied width class
// can shrink it inside a narrow flex cell instead of it overflowing
// (PLTFRM-93275).
export const ConstrainedWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, width: 240 }}>
      <NumberField defaultValue={3} min={0} max={99}>
        <NumberFieldGroup className="w-24">
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={3} min={0} max={99}>
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease" />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  ),
};
