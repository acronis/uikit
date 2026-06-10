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
