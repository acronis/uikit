import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from '../number-field'

const meta = {
  title: 'UI/NumberField',
  component: NumberFieldRoot,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof NumberFieldRoot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: 0 },
  render: (args) => (
    <NumberFieldRoot {...args} className="w-48">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput placeholder="0" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldRoot>
  ),
}

export const WithMinMax: Story = {
  args: { defaultValue: 5, min: 0, max: 10 },
  render: (args) => (
    <NumberFieldRoot {...args} className="w-48">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldRoot>
  ),
}

export const Disabled: Story = {
  args: { defaultValue: 42, disabled: true },
  render: (args) => (
    <NumberFieldRoot {...args} className="w-48">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldRoot>
  ),
}
