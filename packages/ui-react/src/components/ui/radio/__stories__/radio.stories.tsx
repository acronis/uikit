import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio, RadioGroup } from '../radio';

const meta = {
  title: 'UI/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
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
    <label className="inline-flex items-center gap-[var(--ui-form-units-gap-lg)] text-sm text-[var(--ui-form-text-label)]">
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
