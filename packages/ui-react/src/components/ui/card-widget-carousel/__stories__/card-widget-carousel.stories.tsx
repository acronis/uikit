import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DiamondWarningRedIcon,
  CircleClockBlueIcon,
} from '@acronis-platform/icons-react/stroke-multi';
import { CircleClockIcon, CoinsIcon } from '@acronis-platform/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

import { CardWidgetCarousel } from '../card-widget-carousel';
import { CardWidget } from '../card-widget';
import { Button } from '../../button';

const meta = {
  title: 'Widgets/CardWidgetCarousel',
  component: CardWidgetCarousel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    nextLabel: {
      control: 'text',
      description: 'Accessible label for the Next chevron button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Next' },
        category: 'Accessibility',
      },
    },
    children: {
      control: false,
      description: 'Action cards placed inside the carousel.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Additional class names applied to the carousel root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof CardWidgetCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared footer slots
// ---------------------------------------------------------------------------
const liveFooter = (
  <Button variant="ghost">
    <AcronisAiMultiIcon size={16} />
    Review and take action
  </Button>
);

const placeholderFooter = (
  <>
    <Button variant="secondary">Primary</Button>
    <Button variant="ghost">Secondary</Button>
  </>
);

// ---------------------------------------------------------------------------
// Live — cards with real content
// ---------------------------------------------------------------------------
export const Live: Story = {
  name: 'Live (real data)',
  args: { nextLabel: 'Next' },
  render: (args) => (
    <div style={{ width: 896 }}>
      <CardWidgetCarousel {...args}>
        <CardWidget
          header="Phishing attacks"
          status="danger"
          icon={<DiamondWarningRedIcon size={16} />}
          title="Phishing attack detected"
          description="3 senior users targeted by phishing — Finance, IT Admin, and Sales"
          metric="$15K"
          caption="Projected new MRR. SAT upsell"
          footer={liveFooter}
        />
        <CardWidget
          header="License optimization"
          status="warning"
          icon={<CoinsIcon size={16} />}
          title="17 licenses can be optimized on renewal"
          description="17 Microsoft 365 licenses in Contoso Ltd are up for renewal"
          metric="$15K"
          caption="Annual savings"
          footer={liveFooter}
        />
        <CardWidget
          header="SLA risk"
          status="warning"
          icon={<CircleClockIcon size={16} />}
          title="SLA breach risk on 5 tickets"
          description="Unassigned 48+ hours. Two customers escalated via email — revenue at risk."
          metric="5"
          caption="Tickets approaching SLA limit"
          footer={liveFooter}
        />
        <CardWidget
          header="Critical alert"
          status="danger"
          icon={<DiamondWarningRedIcon size={16} />}
          title="Critical alert pending review"
          description="High-priority security event requires immediate attention."
          metric="1"
          caption="Unresolved incidents"
          footer={liveFooter}
        />
      </CardWidgetCarousel>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Empty — skeleton cards with placeholder footer buttons
// ---------------------------------------------------------------------------
export const Empty: Story = {
  name: 'Empty (skeleton)',
  args: { nextLabel: 'Next' },
  render: (args) => (
    <div style={{ width: 896 }}>
      <CardWidgetCarousel {...args}>
        <CardWidget
          header="Phishing attacks"
          status="danger"
          icon={<DiamondWarningRedIcon size={16} />}
          title="Phishing attack detected"
          description="3 senior users targeted by phishing — Finance, IT Admin, and Sales"
          metric="$15K"
          caption="Projected new MRR. SAT upsell"
          footer={placeholderFooter}
        />
        <CardWidget
          header="License optimization"
          status="warning"
          icon={<CoinsIcon size={16} />}
          title="17 licenses can be optimized on renewal"
          description="17 Microsoft 365 licenses in Contoso Ltd are up for renewal"
          metric="$15K"
          caption="Annual savings"
          footer={placeholderFooter}
        />
        {/* Third card: skeleton body — data still loading */}
        <CardWidget
          header="SLA risk"
          status="info"
          icon={<CircleClockBlueIcon size={16} />}
          skeleton
          footer={placeholderFooter}
        />
      </CardWidgetCarousel>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// CardWidget — standalone stories
// ---------------------------------------------------------------------------
export const ItemLive: Story = {
  name: 'CardWidget — live',
  render: () => (
    <CardWidget
      header="Phishing attacks"
      status="danger"
      icon={<DiamondWarningRedIcon size={16} />}
      title="Phishing attack detected"
      description="3 senior users targeted by phishing — Finance, IT Admin, and Sales"
      metric="$15K"
      caption="Projected new MRR. SAT upsell"
      footer={liveFooter}
    />
  ),
};

export const ItemSkeleton: Story = {
  name: 'CardWidget — skeleton',
  render: () => (
    <CardWidget
      header="Insights loading…"
      status="info"
      icon={<CircleClockBlueIcon size={16} />}
      skeleton
      footer={placeholderFooter}
    />
  ),
};

export const ItemWarning: Story = {
  name: 'CardWidget — warning',
  render: () => (
    <CardWidget
      header="SLA risk"
      status="warning"
      icon={<CircleClockIcon size={16} />}
      title="SLA breach risk on 5 tickets"
      description="Unassigned 48+ hours. Revenue at risk."
      metric="5"
      caption="Tickets approaching SLA limit"
      footer={liveFooter}
    />
  ),
};
