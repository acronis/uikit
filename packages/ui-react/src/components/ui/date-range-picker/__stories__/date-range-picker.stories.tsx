import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { format, isValid, parseISO } from 'date-fns';

import { DateRangePicker, type DateRange } from '../date-range-picker';

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label rendered above the trigger.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    description: {
      control: 'text',
      description:
        'Helper text below the trigger (hidden while `error` is set).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    error: {
      control: 'text',
      description:
        'Error message below the trigger; switches it to the error treatment.',
      table: { type: { summary: 'ReactNode' }, category: 'State' },
    },
    placeholder: {
      control: 'text',
      description: 'Hint shown in the trigger when no range is selected.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    required: {
      control: 'boolean',
      description: 'Marks the trigger required (appends `*`).',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the trigger and prevents opening the popover.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    value: {
      control: false,
      description: 'The applied range (controlled).',
      table: {
        type: { summary: '{ from?: Date; to?: Date }' },
        category: 'Behavior',
      },
    },
    defaultValue: {
      control: false,
      description:
        'The initial applied range (uncontrolled) and the target of "Reset to default".',
      table: {
        type: { summary: '{ from?: Date; to?: Date }' },
        category: 'Behavior',
      },
    },
    onValueChange: {
      control: false,
      description: 'Called with the committed range when Apply is pressed.',
      table: { type: { summary: '(range) => void' }, category: 'Events' },
    },
  },
  args: {
    label: 'Period',
    placeholder: 'Select a date range',
    onValueChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) },
    description: 'Defaults to the first half of July.',
  },
};

/**
 * Controlled usage: the parent owns the applied range and updates it on Apply.
 */
export const Controlled: Story = {
  render: (args) => {
    const [range, setRange] = React.useState<DateRange>({
      from: new Date(2026, 6, 10),
      to: new Date(2026, 6, 20),
    });
    return <DateRangePicker {...args} value={range} onValueChange={setRange} />;
  },
};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: { error: 'Please select a valid date range.' },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) },
  },
};

/**
 * Right-to-left. The trigger's `startDate – endDate` reads right-to-left in
 * chronological order. Pinned to `rtl` via the Direction toolbar global. (The
 * dual-month calendar's RTL treatment is covered by `Calendar`'s `Rtl` story.)
 */
export const Rtl: Story = {
  globals: { direction: 'rtl', locale: 'ar' },
  args: {
    defaultValue: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 15) },
  },
};

const ISO_DAY = 'yyyy-MM-dd';

// Namespaced query keys so they never collide with Storybook's own
// `path`/`args`/`globals` params on the shared preview-iframe URL.
const DRP_FROM = 'drp_from';
const DRP_TO = 'drp_to';
// Fallback range when the URL carries no params — keeps the trigger (and the VR
// snapshot) deterministic while still round-tripping through the URL.
const DEFAULT_RANGE: DateRange = {
  from: new Date(2026, 6, 1),
  to: new Date(2026, 6, 15),
};

// A story renders inside Storybook's preview iframe. A param pasted directly onto
// a story URL is carried by whichever frame the user navigated — the iframe's own
// `location` when opened via the canvas "open in new tab", or the parent (manager)
// frame's when the manager forwards it down / when it lives only up top. Check the
// iframe first, then fall back to the accessible parent frame.
function readSearchParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const own = new URLSearchParams(window.location.search).get(key);
  if (own != null) return own;
  try {
    if (window.top && window.top !== window.self) {
      return new URLSearchParams(window.top.location.search).get(key);
    }
  } catch {
    // Cross-origin parent — inaccessible; fall through.
  }
  return null;
}

// Parse a single end, ignoring a malformed value so it drops out of the range.
function readEndFromUrl(key: string): Date | undefined {
  const raw = readSearchParam(key);
  if (!raw) return undefined;
  const parsed = parseISO(raw);
  return isValid(parsed) ? parsed : undefined;
}

function readRangeFromUrl(): DateRange | undefined {
  const from = readEndFromUrl(DRP_FROM);
  const to = readEndFromUrl(DRP_TO);
  if (!from && !to) return undefined;
  return { from, to };
}

function rangeToQuery(range: DateRange): string {
  const params = new URLSearchParams();
  if (range.from) params.set(DRP_FROM, format(range.from, ISO_DAY));
  if (range.to) params.set(DRP_TO, format(range.to, ISO_DAY));
  return params.toString();
}

// Storybook's manager forwards unknown query params DOWN to the preview iframe
// on load, but the other direction never reaches the visible address bar —
// `history.replaceState` inside a story only updates the iframe's own
// `window.location`, a separate browsing context from the manager's. Mirror the
// `drp_*` params up to the parent frame (when actually embedded in one) after
// every render, so an applied range is reflected in the address bar the user is
// looking at, not just the iframe's. (Same mechanism as the Table URL-state
// stories.)
function useSyncUrlToParentFrame() {
  React.useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.top ||
      window.top === window.self
    )
      return;
    try {
      const iframeUrl = new URL(window.location.href);
      const topUrl = new URL(window.top.location.href);
      let changed = false;
      for (const [key, value] of iframeUrl.searchParams.entries()) {
        if (key.startsWith('drp_') && topUrl.searchParams.get(key) !== value) {
          topUrl.searchParams.set(key, value);
          changed = true;
        }
      }
      for (const key of Array.from(topUrl.searchParams.keys())) {
        if (key.startsWith('drp_') && !iframeUrl.searchParams.has(key)) {
          topUrl.searchParams.delete(key);
          changed = true;
        }
      }
      // `URLSearchParams.toString()` percent-encodes every value it serializes,
      // including Storybook's own unrelated `path=/story/...` param — `/` never
      // needs escaping in a query string, so unescape it back for a readable URL.
      if (changed) {
        window.top.history.replaceState(
          null,
          '',
          topUrl.toString().replace(/%2F/g, '/')
        );
      }
    } catch {
      // Cross-origin parent (e.g. an unrelated embed) — nothing to sync.
    }
  });
}

function clearDrpParams() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const key of Array.from(params.keys())) {
    if (key.startsWith('drp_')) params.delete(key);
  }
  const query = params.toString();
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}`
  );
}

/**
 * URL round-trip wired to the **real** address bar: the initial range is read
 * from the `drp_from`/`drp_to` query params, and Apply writes the committed
 * range back via `history.replaceState` and mirrors it up to the parent frame —
 * so applying a range updates the visible URL, and reloading restores it. This
 * is the realistic pattern for a filter whose state lives in the address bar.
 */
export const WithUrlSync: Story = {
  // Clean up AFTER the story only — do NOT wipe params before it renders, or an
  // incoming `drp_from`/`drp_to` (pasted onto the story URL) would be gone before
  // the initial `useState` reads it, defeating restore-from-URL. The teardown
  // keeps an applied range from leaking into the next story in the shared iframe.
  beforeEach: () => clearDrpParams,
  render: (args) => {
    useSyncUrlToParentFrame();
    const [range, setRange] = React.useState<DateRange>(
      () => readRangeFromUrl() ?? DEFAULT_RANGE
    );

    const handleChange = (next: DateRange) => {
      setRange(next);
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      params.delete(DRP_FROM);
      params.delete(DRP_TO);
      if (next.from) params.set(DRP_FROM, format(next.from, ISO_DAY));
      if (next.to) params.set(DRP_TO, format(next.to, ISO_DAY));
      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
      );
    };

    const query = rangeToQuery(range);

    return (
      <div className="flex flex-col gap-3">
        <DateRangePicker {...args} value={range} onValueChange={handleChange} />
        <code className="text-xs text-muted-foreground">
          ?{query || '(empty)'}
        </code>
      </div>
    );
  },
};
