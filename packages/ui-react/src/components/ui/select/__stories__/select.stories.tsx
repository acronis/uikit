import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial value (matches a SelectItem `value`).',
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
        'Item data structure; when set, `SelectValue` renders the selected item label instead of the raw value.',
      table: {
        type: { summary: 'Record<string, ReactNode> | { label; value }[]' },
        category: 'Content',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevents choosing a different option from the popup.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    required: {
      control: 'boolean',
      description: 'Requires a value before form submission.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'State' },
    },
    multiple: {
      control: 'boolean',
      description: 'Allows selecting multiple items.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the popup is initially open (uncontrolled).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Behavior' },
    },
    open: {
      control: false,
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
    modal: {
      control: 'boolean',
      description: 'Whether the select enters a modal state (locks scroll, blocks outside pointer) when open.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' }, category: 'Behavior' },
    },
    name: {
      control: 'text',
      description: 'Identifies the field when a form is submitted.',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    onValueChange: {
      control: false,
      description: 'Called when the selected value changes.',
      table: { type: { summary: '(value, eventDetails) => void' }, category: 'Events' },
    },
    onOpenChange: {
      control: false,
      description: 'Called when the popup is opened or closed.',
      table: { type: { summary: '(open, eventDetails) => void' }, category: 'Events' },
    },
    children: {
      control: false,
      description: 'SelectTrigger + SelectContent composition.',
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruitItems = {
  apple: 'Apple',
  banana: 'Banana',
  blueberry: 'Blueberry',
  grapes: 'Grapes',
  pineapple: 'Pineapple',
};

const fruits = (
  <>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="blueberry">Blueberry</SelectItem>
    <SelectItem value="grapes">Grapes</SelectItem>
    <SelectItem value="pineapple">Pineapple</SelectItem>
  </>
);

export const Default: Story = {
  render: () => (
    <Select items={fruitItems}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>{fruits}</SelectContent>
    </Select>
  ),
};

// Closed-trigger states mirroring the Figma "Select" variants:
// placeholder, a resolved value, and disabled.
export const States: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Select items={fruitItems}>
        <SelectTrigger aria-label="Placeholder">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>{fruits}</SelectContent>
      </Select>

      <Select items={{ apple: 'Apple', banana: 'Banana' }} defaultValue="apple">
        <SelectTrigger aria-label="With value">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>{fruits}</SelectContent>
      </Select>

      <Select disabled>
        <SelectTrigger aria-label="Disabled">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>{fruits}</SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select
      items={{
        apple: 'Apple',
        banana: 'Banana',
        carrot: 'Carrot',
        potato: 'Potato',
      }}
    >
      <SelectTrigger aria-label="Food">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectGroupLabel>Fruits</SelectGroupLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectGroupLabel>Vegetables</SelectGroupLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="potato">Potato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger aria-label="Disabled">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>{fruits}</SelectContent>
    </Select>
  ),
};

// `defaultOpen` renders the popup open so the listbox is visible in docs and
// visual-regression snapshots. `animationDelay` lets the open transition settle
// before the screenshot.
export const Open: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => (
    <Select items={fruitItems} defaultOpen>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>{fruits}</SelectContent>
    </Select>
  ),
};

// Open with a selected value — the chosen item shows its check indicator and is
// the initially highlighted row.
export const OpenWithSelection: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => (
    <Select items={fruitItems} defaultValue="banana" defaultOpen>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>{fruits}</SelectContent>
    </Select>
  ),
};

// Open within a grouped list.
export const OpenWithGroups: Story = {
  parameters: { snapshot: { animationDelay: 400 } },
  render: () => (
    <Select
      items={{
        apple: 'Apple',
        banana: 'Banana',
        carrot: 'Carrot',
        potato: 'Potato',
      }}
      defaultValue="carrot"
      defaultOpen
    >
      <SelectTrigger aria-label="Food">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectGroupLabel>Fruits</SelectGroupLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectGroupLabel>Vegetables</SelectGroupLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="potato">Potato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
