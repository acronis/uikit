import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartBarVerticalIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import {
  WidgetPlaceholder,
  WidgetPlaceholderAction,
  WidgetPlaceholderContent,
  WidgetPlaceholderFooter,
  WidgetPlaceholderHeader,
  WidgetPlaceholderIcon,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderTitle,
} from '../widget-placeholder';

const meta = {
  title: 'UI/WidgetPlaceholder',
  component: WidgetPlaceholder,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <WidgetPlaceholder className="h-[220px] w-[320px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Backup statistics</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
        <WidgetPlaceholderAction>Set up backup plan</WidgetPlaceholderAction>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <WidgetPlaceholder className="w-[320px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon>
          <ShieldCheckIcon />
        </WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Protection status</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <ShieldCheckIcon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>No devices protected</WidgetPlaceholderText>
        <WidgetPlaceholderAction>
          <PlusIcon className="mr-1 inline size-3" />
          Add device
        </WidgetPlaceholderAction>
      </WidgetPlaceholderContent>
      <WidgetPlaceholderFooter>Last checked: never</WidgetPlaceholderFooter>
    </WidgetPlaceholder>
  ),
};

export const Interactive: Story = {
  render: () => (
    <WidgetPlaceholder interactive className="h-[220px] w-[320px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Click to configure</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <ChartBarVerticalIcon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>Click anywhere to get started</WidgetPlaceholderText>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  ),
};
