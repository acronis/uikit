import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

import type { Locale } from '../../../../../.storybook/globals';
import { t } from '../../../../../.storybook/i18n';
import { Chip } from '../../chip/chip';
import { FilterChips, FilterChipsList, FilterChipsReset } from '../filter-chips';

const meta = {
  title: 'UI/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'The `FilterChipsList` (and anything else placed beside it, separated by the root\'s 16px gap).',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the applied-filter region (`role="group"`).',
      table: {
        type: { summary: 'string' },
        category: 'Content',
        defaultValue: { summary: 'Applied filters' },
      },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the root row.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<div>` with another element or component.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

// The design's default content: three removable chips with a leading icon,
// closed by the ghost "Reset filters" action inside the same 8px-gap list.
export const Default: Story = {
  render: (args) => (
    <FilterChips {...args}>
      <FilterChipsList>
        <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
        <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
        <Chip icon={<SquareDashedIcon size={16} />}>Label</Chip>
        <FilterChipsReset />
      </FilterChipsList>
    </FilterChips>
  ),
};

// Real applied-filter labels, no leading icons — the common product usage.
export const AppliedFilters: Story = {
  render: (args) => (
    <FilterChips {...args}>
      <FilterChipsList>
        <Chip removeLabel="Remove type filter">Type: Server</Chip>
        <Chip removeLabel="Remove OS filter">OS: Linux</Chip>
        <Chip removeLabel="Remove status filter">Status: Active</Chip>
        <FilterChipsReset />
      </FilterChipsList>
    </FilterChips>
  ),
};

// A single filter — the reset action still reads as the row's trailing affordance.
export const SingleFilter: Story = {
  render: (args) => (
    <FilterChips {...args}>
      <FilterChipsList>
        <Chip removeLabel="Remove type filter">Type: Server</Chip>
        <FilterChipsReset />
      </FilterChipsList>
    </FilterChips>
  ),
};

// The reset action is composed, not built in — omit it when the surrounding UI
// already offers a way to clear the filters.
export const WithoutReset: Story = {
  render: (args) => (
    <FilterChips {...args}>
      <FilterChipsList>
        <Chip removeLabel="Remove type filter">Type: Server</Chip>
        <Chip removeLabel="Remove OS filter">OS: Linux</Chip>
      </FilterChipsList>
    </FilterChips>
  ),
};

// `FilterChipsList` wraps onto as many lines as it needs; `content-center`
// keeps the wrapped lines centered against the row and the chips stay 8px
// apart in both axes. The narrow container is the story's own constraint —
// FilterChips itself sets no width.
export const Wrapping: Story = {
  render: (args) => (
    <div style={{ width: 420 }}>
      <FilterChips {...args}>
        <FilterChipsList>
          <Chip removeLabel="Remove type filter">Type: Server</Chip>
          <Chip removeLabel="Remove OS filter">OS: Linux Ubuntu 22.04 LTS</Chip>
          <Chip removeLabel="Remove status filter">Status: Active</Chip>
          <Chip removeLabel="Remove location filter">
            Location: eu-central-1
          </Chip>
          <Chip removeLabel="Remove owner filter">Owner: Infrastructure</Chip>
          <FilterChipsReset />
        </FilterChipsList>
      </FilterChips>
    </div>
  ),
};

// Chips truncate rather than stretch the row: a long label ellipsizes inside the
// chip once the list runs out of width.
export const LongLabel: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <FilterChips {...args}>
        <FilterChipsList>
          <Chip className="max-w-56" removeLabel="Remove path filter">
            Path: /var/lib/acronis/backups/2026/august/archive-001
          </Chip>
          <FilterChipsReset />
        </FilterChipsList>
      </FilterChips>
    </div>
  ),
};

// Working state: removing a chip drops that filter, "Reset filters" clears them
// all, and the row disappears once nothing is applied.
export const Interactive: Story = {
  render: (args) => {
    const initial = [
      { id: 'type', label: 'Type: Server' },
      { id: 'os', label: 'OS: Linux' },
      { id: 'status', label: 'Status: Active' },
    ];
    const [applied, setApplied] = React.useState(initial);
    if (applied.length === 0) {
      return (
        <button
          type="button"
          className="text-sm underline"
          onClick={() => setApplied(initial)}
        >
          No filters applied — restore the sample filters
        </button>
      );
    }
    return (
      <FilterChips {...args}>
        <FilterChipsList>
          {applied.map((filter) => (
            <Chip
              key={filter.id}
              removeLabel={`Remove ${filter.id} filter`}
              onRemove={() =>
                setApplied((current) =>
                  current.filter((entry) => entry.id !== filter.id)
                )
              }
            >
              {filter.label}
            </Chip>
          ))}
          <FilterChipsReset onClick={() => setApplied([])} />
        </FilterChipsList>
      </FilterChips>
    );
  },
};

// Every string in the row is consumer-supplied, so the whole component
// localizes — and mirrors under the `ar`/`he` locales, which set `dir="rtl"`.
export const Localized: Story = {
  render: (args, { globals }) => {
    const locale = (globals.locale as Locale) ?? 'en';
    return (
      <FilterChips {...args}>
        <FilterChipsList>
          <Chip>{t(locale, 'filterType')}</Chip>
          <Chip>{t(locale, 'filterStatus')}</Chip>
          <FilterChipsReset>{t(locale, 'resetFilters')}</FilterChipsReset>
        </FilterChipsList>
      </FilterChips>
    );
  },
};
