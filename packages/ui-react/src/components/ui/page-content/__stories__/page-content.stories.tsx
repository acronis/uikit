import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageContent } from '../page-content';

const meta = {
  title: 'UI/PageContent',
  component: PageContent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[280px] bg-[var(--ui-background-surface-secondary)]">
      <PageContent className="bg-background">
        <h1 className="text-lg font-semibold">Page content</h1>
        <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
          The padded gutter region for a page body — sits inside AppShellMain.
        </p>
      </PageContent>
    </div>
  ),
};
