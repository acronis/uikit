import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { format, isValid, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '../calendar';

// A fixed month keeps the grid deterministic for visual-regression snapshots.
const JULY_2026 = new Date(2026, 6, 1);

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode passed through to `react-day-picker`.',
      table: {
        type: { summary: "'single' | 'multiple' | 'range'" },
        defaultValue: { summary: 'single' },
        category: 'Behavior',
      },
    },
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      description: 'How many months to render side by side.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Appearance',
      },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from the previous/next month to fill the grid.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Appearance',
      },
    },
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      description: 'How the month/year caption is rendered.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'label' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: false,
      description:
        'Matcher (or array of matchers) for days that cannot be selected.',
      table: { type: { summary: 'Matcher | Matcher[]' }, category: 'Behavior' },
    },
    selected: {
      control: false,
      description: 'The controlled selection (shape depends on `mode`).',
      table: {
        type: { summary: 'Date | Date[] | DateRange' },
        category: 'Behavior',
      },
    },
    onSelect: {
      control: false,
      description: 'Called when the selection changes.',
      table: { type: { summary: '(selected) => void' }, category: 'Events' },
    },
    defaultMonth: {
      control: false,
      description: 'The month rendered first (uncontrolled).',
      table: { type: { summary: 'Date' }, category: 'Behavior' },
    },
  },
  args: {
    defaultMonth: JULY_2026,
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { mode: 'single' },
};

export const TwoMonths: Story = {
  args: { mode: 'single', numberOfMonths: 2 },
};

export const RangeSelection: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: {
      from: new Date(2026, 6, 8),
      to: new Date(2026, 6, 16),
    } as DateRange,
  },
};

export const WithDisabledDays: Story = {
  args: {
    mode: 'single',
    disabled: [
      new Date(2026, 6, 4),
      new Date(2026, 6, 5),
      { dayOfWeek: [0, 6] },
    ],
  },
};

export const Selected: Story = {
  args: {
    mode: 'single',
    selected: new Date(2026, 6, 15),
  },
};

/**
 * Fully interactive single-date example. Keyboard navigation (arrow keys to move,
 * Enter/Space to select, PageUp/PageDown to change month) is handled by
 * `react-day-picker`.
 */
export const Interactive: Story = {
  args: { mode: 'single' },
  render: (args) => {
    const [selected, setSelected] = React.useState<Date | undefined>(
      new Date(2026, 6, 15)
    );
    return (
      <Calendar
        {...args}
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

/**
 * Right-to-left. The prev/next chevrons mirror, the two months read
 * right-to-left in chronological order, and the range band's rounded ends flip
 * sides. Pinned to `rtl` via the Direction toolbar global.
 */
export const Rtl: Story = {
  globals: { direction: 'rtl', locale: 'ar' },
  args: {
    mode: 'range',
    numberOfMonths: 2,
    selected: {
      from: new Date(2026, 6, 8),
      to: new Date(2026, 6, 16),
    } as DateRange,
  },
};

const ISO_DAY = 'yyyy-MM-dd';

// Namespaced query key so it never collides with Storybook's own
// `path`/`args`/`globals` params on the shared preview-iframe URL.
const CAL_PARAM = 'cal_date';
// Fallback selection when the URL carries no `cal_date` — keeps the grid (and
// the VR snapshot) deterministic while still round-tripping through the URL.
const DEFAULT_DATE = new Date(2026, 6, 15);

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

function readDateFromUrl(): Date | undefined {
  const iso = readSearchParam(CAL_PARAM);
  if (!iso) return undefined;
  const parsed = parseISO(iso);
  // Ignore a malformed `cal_date` so it falls back to the hardcoded default.
  return isValid(parsed) ? parsed : undefined;
}

// Storybook's manager forwards unknown query params DOWN to the preview iframe
// on load, but the other direction never reaches the visible address bar —
// `history.replaceState` inside a story only updates the iframe's own
// `window.location`, a separate browsing context from the manager's. Mirror the
// `cal_*` param up to the parent frame (when actually embedded in one) after
// every render, so a real pick is reflected in the address bar the user is
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
        if (key.startsWith('cal_') && topUrl.searchParams.get(key) !== value) {
          topUrl.searchParams.set(key, value);
          changed = true;
        }
      }
      for (const key of Array.from(topUrl.searchParams.keys())) {
        if (key.startsWith('cal_') && !iframeUrl.searchParams.has(key)) {
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

function clearCalParams() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const key of Array.from(params.keys())) {
    if (key.startsWith('cal_')) params.delete(key);
  }
  const query = params.toString();
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}`
  );
}

/**
 * URL round-trip for a single selected date, wired to the **real** address bar:
 * the initial selection is read from the `cal_date` query param (ISO
 * `yyyy-MM-dd`), and every pick writes it back via `history.replaceState` and
 * mirrors it up to the parent frame — so picking a day updates the visible URL,
 * and reloading restores the selection. This is the pattern a consumer uses to
 * keep a picked date bookmarkable.
 */
export const WithUrlSync: Story = {
  args: { mode: 'single' },
  // Clean up AFTER the story only — do NOT wipe params before it renders, or an
  // incoming `cal_date` (pasted onto the story URL) would be gone before the
  // initial `useState` reads it, defeating restore-from-URL. The teardown keeps
  // a pick from leaking into the next story in the shared preview iframe.
  beforeEach: () => clearCalParams,
  render: (args) => {
    useSyncUrlToParentFrame();
    const [selected, setSelected] = React.useState<Date | undefined>(
      () => readDateFromUrl() ?? DEFAULT_DATE
    );

    const handleSelect = (next: Date | undefined) => {
      setSelected(next);
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      if (next) params.set(CAL_PARAM, format(next, ISO_DAY));
      else params.delete(CAL_PARAM);
      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
      );
    };

    const query = selected ? `${CAL_PARAM}=${format(selected, ISO_DAY)}` : '';

    return (
      <div className="flex flex-col gap-3">
        <Calendar
          {...args}
          mode="single"
          selected={selected}
          onSelect={handleSelect}
        />
        <code className="text-xs text-muted-foreground">
          ?{query || '(empty)'}
        </code>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Picking a day writes the ISO date to the real query string. The day
    // button's accessible name is the full date (e.g. "…July 20th, 2026").
    await userEvent.click(canvas.getByRole('button', { name: /July 20th/ }));
    await expect(window.location.search).toContain(`${CAL_PARAM}=2026-07-20`);
  },
};
