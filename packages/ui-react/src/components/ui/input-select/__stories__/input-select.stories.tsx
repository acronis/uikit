import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectSearch,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectStatus,
  InputSelectTrigger,
  InputSelectValue,
} from '../input-select';

const meta = {
  title: 'UI/InputSelect',
  component: InputSelect,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (matches an InputSelectItem `value`).',
      table: { type: { summary: 'Value | null' }, category: 'Content' },
    },
    value: {
      control: false,
      description: 'Controlled value. Pair with `onValueChange`.',
      table: { type: { summary: 'Value | null' }, category: 'Content' },
    },
    items: {
      control: false,
      description:
        'Item data structure; when set, InputSelectValue renders the selected item label instead of the raw value.',
      table: {
        type: { summary: 'Record<string, ReactNode> | { label; value }[]' },
        category: 'Content',
      },
    },
    multiple: {
      control: 'boolean',
      description:
        'Allow selecting multiple items (items show a leading checkbox; the popup stays open).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the popup is initially open (uncontrolled).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    onValueChange: {
      control: false,
      description: 'Called when the selected value changes.',
      table: { type: { summary: '(value, eventDetails) => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description: 'InputSelectField + InputSelectContent composition.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruitItems = {
  apple: 'Apple',
  banana: 'Banana',
  blueberry: 'Blueberry',
  grapes: 'Grapes',
};

const fruits = (
  <>
    <InputSelectItem value="apple">Apple</InputSelectItem>
    <InputSelectItem value="banana">Banana</InputSelectItem>
    <InputSelectItem value="blueberry">Blueberry</InputSelectItem>
    <InputSelectItem value="grapes">Grapes</InputSelectItem>
  </>
);

export const Default: Story = {
  render: () => (
    <InputSelect items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectDescription>Pick your favourite</InputSelectDescription>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const Required: Story = {
  render: () => (
    <InputSelect items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel required>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const WithValue: Story = {
  render: () => (
    <InputSelect items={fruitItems} defaultValue="apple">
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const Error: Story = {
  render: () => (
    <InputSelect items={fruitItems}>
      <InputSelectField>
        <InputSelectLabel required>Fruit</InputSelectLabel>
        <InputSelectTrigger aria-invalid>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectError>Please choose a fruit</InputSelectError>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputSelect items={fruitItems} disabled defaultValue="apple">
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

// Open popup (single select) showing grouped sections + an in-dropdown search.
export const Open: Story = {
  render: () => (
    <InputSelect items={fruitItems} defaultOpen>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectSearch aria-label="Filter" placeholder="Search" />
        <InputSelectSection>
          <InputSelectSectionLabel>Fruits</InputSelectSectionLabel>
          {fruits}
        </InputSelectSection>
      </InputSelectContent>
    </InputSelect>
  ),
};

export const Multiple: Story = {
  render: () => (
    <InputSelect multiple items={fruitItems} defaultValue={['apple', 'banana']} defaultOpen>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select options" />
        </InputSelectTrigger>
      </InputSelectField>
      <InputSelectContent>{fruits}</InputSelectContent>
    </InputSelect>
  ),
};

// The loading / empty / error status rows shown inside the dropdown.
export const Statuses: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      {(['loading', 'empty', 'error'] as const).map((variant) => (
        <div
          key={variant}
          className="overflow-hidden rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)]"
        >
          <InputSelectStatus
            variant={variant}
            action={
              variant === 'error' ? (
                <button
                  type="button"
                  className="text-[var(--ui-input-select-normal-icon-expand-color-hover)] underline"
                >
                  Try again
                </button>
              ) : undefined
            }
          >
            {variant === 'loading'
              ? 'Loading…'
              : variant === 'empty'
                ? 'No data found'
                : 'Something went wrong'}
          </InputSelectStatus>
        </div>
      ))}
    </div>
  ),
};
