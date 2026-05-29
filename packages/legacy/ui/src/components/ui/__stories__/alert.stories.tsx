import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertIcon, AlertContent, AlertTitle, AlertDescription } from '../alert'
import { ExclamationCircleIcon } from '@/components/icons'

const TerminalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
)

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertIcon>
        <TerminalIcon className="h-4 w-4" />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertIcon>
        <ExclamationCircleIcon className="h-4 w-4" />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </AlertContent>
    </Alert>
  ),
}
