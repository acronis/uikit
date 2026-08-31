'use client';

import { Button, CardWidget, CardWidgetCarousel } from '@acronis-platform/ui-react';
import {
  DiamondWarningRedIcon,
  CircleClockBlueIcon,
} from '@acronis-platform/icons-react/stroke-multi';
import { CircleClockIcon, CoinsIcon } from '@acronis-platform/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

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

export function CardWidgetCarouselDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Live cards */}
      <CardWidgetCarousel nextLabel="Next" className="w-[608px] max-w-full">
        <CardWidget
          header="Phishing attacks"
          status="danger"
          icon={<DiamondWarningRedIcon size={16} />}
          title="Phishing attack detected"
          description="3 senior users targeted by phishing — Finance, IT, Sales"
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
          description="Unassigned 48+ hours. Revenue at risk."
          metric="5"
          caption="Tickets approaching SLA limit"
          footer={liveFooter}
        />
      </CardWidgetCarousel>

      {/* Skeleton / empty state */}
      <CardWidgetCarousel nextLabel="Next" className="w-[608px] max-w-full">
        <CardWidget
          header="Phishing attacks"
          status="danger"
          icon={<DiamondWarningRedIcon size={16} />}
          title="Phishing attack detected"
          description="3 senior users targeted by phishing — Finance, IT, Sales"
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
        {/* Skeleton card — data still loading */}
        <CardWidget
          header="SLA risk"
          status="info"
          icon={<CircleClockBlueIcon size={16} />}
          skeleton
          footer={placeholderFooter}
        />
      </CardWidgetCarousel>
    </div>
  );
}
