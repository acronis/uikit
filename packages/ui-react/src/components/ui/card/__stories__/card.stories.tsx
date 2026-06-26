import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<div>` (e.g. render the card as an `<article>`, or a part as a heading).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
    children: {
      control: false,
      description:
        'Composed parts — `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Backup status</CardTitle>
        <CardDescription>Last successful run 5 minutes ago.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          All 24 workloads are protected and up to date.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>View report</Button>
        <Button variant="secondary">Run now</Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderAndContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Storage usage</CardTitle>
        <CardDescription>3.2 TB of 5 TB used.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">64% of your quota is currently consumed.</p>
      </CardContent>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p className="text-sm">
          A bare card with content and no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};
