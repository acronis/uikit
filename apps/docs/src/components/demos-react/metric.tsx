'use client';

import {
  Metric,
  TrendIndicator,
  Tag,
  Meter,
  Separator,
} from '@acronis-platform/ui-react';
import { ChartPieIcon } from '@acronis-platform/icons-react/stroke-mono';
import { AcronisAiMultiIcon } from '@acronis-platform/icons-react/solid-multi';

export function MetricDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Metric
        className="w-[220px]"
        label="Endpoint coverage"
        value="94"
        unit="%"
        status="success"
        icon={<ChartPieIcon />}
        supportingText="Target: 98%"
        trend={
          <TrendIndicator
            direction="up"
            sentiment="positive"
            value="2%"
            size="small"
          />
        }
      />

      <Metric
        className="w-[314px]"
        label="At-risk customers"
        status="critical"
        icon={<ChartPieIcon />}
        caption={
          <Tag variant="neutral" size="sm">
            Now
          </Tag>
        }
        value="3"
        trend={
          <TrendIndicator
            direction="up"
            sentiment="negative"
            value="1"
            comparisonLabel="this week"
            size="small"
          />
        }
      >
        <div className="mt-3 flex flex-col gap-2.5">
          <Meter
            label="Healthy"
            value={46}
            max={54}
            color="var(--ui-background-status-strong-success)"
            showTooltip={false}
          />
          <Meter
            label="Unhealthy"
            value={5}
            max={54}
            color="var(--ui-background-status-strong-warning)"
            showTooltip={false}
          />
          <Meter
            label="At risk"
            value={3}
            max={54}
            color="var(--ui-background-status-strong-critical)"
            showTooltip={false}
          />
        </div>
        <Separator className="my-3" />
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <AcronisAiMultiIcon size={16} aria-hidden className="mt-0.5 shrink-0" />
          +3 customers predicted at-risk within 30 days — act before renewal.
        </p>
      </Metric>
    </div>
  );
}
