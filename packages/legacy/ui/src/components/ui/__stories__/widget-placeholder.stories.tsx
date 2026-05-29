import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon, ShieldIcon } from '@/components/icons'

const BarChart3Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
)
import {
  WidgetPlaceholder,
  WidgetPlaceholderHeader,
  WidgetPlaceholderTitle,
  WidgetPlaceholderIcon,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
  WidgetPlaceholderFooter,
} from '../widget-placeholder'

const meta = {
  title: 'UI/WidgetPlaceholder',
  component: WidgetPlaceholder,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetPlaceholder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <WidgetPlaceholder className="w-[320px] h-[220px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon><BarChart3Icon /></WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Backup Statistics</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <BarChart3Icon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
        <WidgetPlaceholderAction>Set up backup plan</WidgetPlaceholderAction>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <WidgetPlaceholder className="w-[320px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon><ShieldIcon /></WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Protection Status</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <ShieldIcon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>No devices protected</WidgetPlaceholderText>
        <WidgetPlaceholderAction>
          <PlusIcon className="inline h-3 w-3 mr-1" />
          Add device
        </WidgetPlaceholderAction>
      </WidgetPlaceholderContent>
      <WidgetPlaceholderFooter>Last checked: never</WidgetPlaceholderFooter>
    </WidgetPlaceholder>
  ),
}

export const Interactive: Story = {
  render: () => (
    <WidgetPlaceholder interactive className="w-[320px] h-[220px]">
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderIcon><BarChart3Icon /></WidgetPlaceholderIcon>
        <WidgetPlaceholderTitle>Click to configure</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>
          <BarChart3Icon />
        </WidgetPlaceholderImage>
        <WidgetPlaceholderText>Click anywhere to get started</WidgetPlaceholderText>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  ),
}
