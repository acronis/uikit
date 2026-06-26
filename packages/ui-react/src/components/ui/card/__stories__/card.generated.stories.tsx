// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';
import { Card } from '../card';

const meta = {
  title: 'UI/Card/All States (generated)',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Card>
        <CardHeader>
          <CardTitle>Backup status</CardTitle>
          <CardDescription>Last run 5 minutes ago.</CardDescription>
        </CardHeader>
        <CardContent>All workloads protected.</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    </div>
  ),
};
