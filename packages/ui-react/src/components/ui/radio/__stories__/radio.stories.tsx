import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio, RadioGroup } from '../radio';

const meta = {
  title: 'UI/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial selected value of the group.',
      table: { type: { summary: 'unknown' }, category: 'State' },
    },
    value: {
      control: 'text',
      description: 'Controlled selected value of the group.',
      table: { type: { summary: 'unknown' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every radio in the group.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents the user from changing the selected value.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the group as required for form submission.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the selected value.',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    onValueChange: {
      control: false,
      description: 'Fires with the new selected value when the selection changes.',
      table: {
        type: { summary: '(value: unknown, event: Event) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description: 'Base UI render prop for overriding the rendered element.',
      table: { type: { summary: 'ReactElement | function' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function LabeledRadio({
  value,
  children,
  disabled,
}: {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-[var(--ui-radio-global-container-gap)] text-sm text-[var(--ui-radio-global-label-color)]">
      <Radio value={value} disabled={disabled} />
      {children}
    </label>
  );
}

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" aria-label="Plan">
      <LabeledRadio value="free">Free</LabeledRadio>
      <LabeledRadio value="standard">Standard</LabeledRadio>
      <LabeledRadio value="premium">Premium</LabeledRadio>
    </RadioGroup>
  ),
};

export const States: Story = {
  // Each visual state needs its own group, since a group has a single selection.
  render: () => (
    <div className="flex flex-col gap-3">
      <RadioGroup aria-label="Unselected">
        <LabeledRadio value="x">Unselected</LabeledRadio>
      </RadioGroup>
      <RadioGroup defaultValue="x" aria-label="Selected">
        <LabeledRadio value="x">Selected</LabeledRadio>
      </RadioGroup>
      <RadioGroup aria-label="Disabled unselected">
        <LabeledRadio value="x" disabled>
          Disabled unselected
        </LabeledRadio>
      </RadioGroup>
      <RadioGroup defaultValue="x" aria-label="Disabled selected">
        <LabeledRadio value="x" disabled>
          Disabled selected
        </LabeledRadio>
      </RadioGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      defaultValue="yes"
      aria-label="Confirm"
      className="flex-row gap-4"
    >
      <LabeledRadio value="yes">Yes</LabeledRadio>
      <LabeledRadio value="no">No</LabeledRadio>
    </RadioGroup>
  ),
};
