// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  WidgetPlaceholderHeader,
  WidgetPlaceholderIcon,
  WidgetPlaceholderTitle,
  WidgetPlaceholderContent,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderAction,
} from '../widget-placeholder';
import { ChartBarVerticalIcon } from '@acronis-platform/icons-react/stroke-mono';
import { WidgetPlaceholder } from '../widget-placeholder';

const meta = {
  title: 'UI/WidgetPlaceholder/All States (generated)',
  component: WidgetPlaceholder,
} satisfies Meta<typeof WidgetPlaceholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <WidgetPlaceholder>
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
    </div>
  ),
};
