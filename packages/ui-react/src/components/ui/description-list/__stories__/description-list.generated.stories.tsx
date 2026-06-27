// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  DescriptionListValueDescription,
} from '../description-list';
import { DescriptionList } from '../description-list';

const meta = {
  title: 'UI/DescriptionList/All States (generated)',
  component: DescriptionList,
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Backup</DescriptionListLabel>
          <DescriptionListValue>
            <div>
              Success
              <DescriptionListValueDescription>
                150GB backed up
              </DescriptionListValueDescription>
            </div>
          </DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    </div>
  ),
};
