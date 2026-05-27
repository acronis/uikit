import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '../select';
import { withDarkMode } from './utils';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="potato">Potato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

const selectRender = () => (
  <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
);

const openSelectPlay = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('combobox'));
  await userEvent.keyboard('{ArrowDown}');
};

export const DarkDefault: Story = {
  name: 'Dark / Default',
  decorators: [withDarkMode()],
  render: selectRender,
  play: openSelectPlay,
};

export const DarkAcronisDefault: Story = {
  name: 'Dark / Acronis Default',
  decorators: [withDarkMode('theme-acronis-default')],
  render: selectRender,
  play: openSelectPlay,
};

export const DarkAcronisOcean: Story = {
  name: 'Dark / Acronis Ocean',
  decorators: [withDarkMode('theme-acronis-ocean')],
  render: selectRender,
  play: openSelectPlay,
};

export const DarkCyberChat: Story = {
  name: 'Dark / Cyber Chat',
  decorators: [withDarkMode('theme-cyber-chat')],
  render: selectRender,
  play: openSelectPlay,
};

export const DarkAcronisElectric: Story = {
  name: 'Dark / Acronis Electric',
  decorators: [withDarkMode('theme-acronis-electric')],
  render: selectRender,
  play: openSelectPlay,
};
