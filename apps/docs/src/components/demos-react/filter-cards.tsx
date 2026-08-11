'use client';

import { FilterCards, CardFilter } from '@acronis-platform/ui-react';
import {
  ServerIcon,
  CircleWarningIcon,
  ShieldCheckIcon,
} from '@acronis-platform/icons-react/stroke-mono';

export function FilterCardsDemo() {
  return (
    <FilterCards>
      <CardFilter label="Total workloads" value="128" icon={<ServerIcon />} />
      <CardFilter
        variant="clickable"
        label="Alerts"
        value="7"
        icon={<CircleWarningIcon />}
      />
      <CardFilter label="Protected" value="982" icon={<ShieldCheckIcon />} />
      <CardFilter variant="static-empty" label="Pending" />
    </FilterCards>
  );
}
