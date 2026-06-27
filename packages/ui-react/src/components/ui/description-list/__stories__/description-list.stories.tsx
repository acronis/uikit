import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CogIcon,
  ShieldCheckIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { Link } from '../../link';
import {
  DescriptionList,
  DescriptionListActions,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  DescriptionListValueDescription,
} from '../description-list';

const meta = {
  title: 'UI/DescriptionList',
  component: DescriptionList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServiceStatus: Story = {
  render: () => (
    <div className="w-[480px] overflow-hidden rounded-lg border border-border bg-background">
      <div className="px-6 py-4 text-lg leading-6 text-foreground">
        Service status
      </div>
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Backup</DescriptionListLabel>
          <DescriptionListValue>
            <CircleCheckIcon className="text-[var(--ui-text-on-status-success)]" />
            <div>
              Success
              <DescriptionListValueDescription>
                150GB of data backed up successfully
              </DescriptionListValueDescription>
            </div>
          </DescriptionListValue>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListLabel>RMM</DescriptionListLabel>
          <DescriptionListValue>
            <CircleInfoIcon className="text-[var(--ui-text-on-status-info)]" />
            <div>
              Healthy
              <DescriptionListValueDescription>
                15 devices monitored, 0 issues detected
              </DescriptionListValueDescription>
            </div>
          </DescriptionListValue>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListLabel>EDR</DescriptionListLabel>
          <DescriptionListValue>
            <CogIcon className="text-[var(--ui-text-on-status-warning)]" />
            <div>
              <DescriptionListValueDescription>
                Issue description here (based on alert)
              </DescriptionListValueDescription>
              <DescriptionListActions className="mt-1">
                <Link href="#fix">Action to fix</Link>
                <Link href="#alert">View alert</Link>
              </DescriptionListActions>
            </div>
          </DescriptionListValue>
        </DescriptionListItem>

        <DescriptionListItem>
          <DescriptionListLabel>Disaster recovery</DescriptionListLabel>
          <DescriptionListValue>
            <ShieldCheckIcon className="text-muted-foreground" />
            <Link href="#enable">Enable service</Link>
          </DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    </div>
  ),
};

export const PlainText: Story = {
  render: () => (
    <div className="w-[420px]">
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Status</DescriptionListLabel>
          <DescriptionListValue>Protected</DescriptionListValue>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListLabel>Last backup</DescriptionListLabel>
          <DescriptionListValue>5 minutes ago</DescriptionListValue>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListLabel>Owner</DescriptionListLabel>
          <DescriptionListValue>ken99@example.com</DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    </div>
  ),
};
