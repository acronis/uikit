'use client';

import { Calendar } from '@acronis-platform/ui-react';

// A fixed month keeps the preview deterministic (and network-free). Selection is
// left uncontrolled — `react-day-picker` manages the in-grid range state.
const JULY_2026 = new Date(2026, 6, 1);

export function CalendarDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <Calendar mode="range" numberOfMonths={2} defaultMonth={JULY_2026} />
    </div>
  );
}
