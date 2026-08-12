import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { format } from 'date-fns';
import { ar, enUS, es } from 'react-day-picker/locale';
import type { DateRange } from 'react-day-picker';

import { Button } from '../../button';
import { InputText } from '../../input-text';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { CalendarPanel } from '../calendar-panel';
import type {
  CalendarPanelMultipleProps,
  CalendarPanelRangeProps,
  CalendarPanelSingleProps,
} from '../calendar-panel';

const JULY_2026 = new Date(2026, 6, 1);

const formatDate = (date: Date | undefined) => (date ? format(date, 'PP') : '');

const formatDateList = (dates: Date[]) =>
  dates.length ? dates.map((date) => format(date, 'PP')).join(', ') : '';

const formatDateRange = (range: DateRange | undefined) =>
  range?.from ? `${formatDate(range.from)} – ${formatDate(range.to)}` : '';

const meta = {
  title: 'UI/CalendarPanel',
  component: CalendarPanel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
      description:
        'Selection mode + panel structure. `multiple`/`range` add the Cancel/Apply footer; `range` shows two months.',
      table: {
        type: { summary: "'single' | 'multiple' | 'range'" },
        defaultValue: { summary: "'single'" },
        category: 'Appearance',
      },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the panel container.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    selected: {
      control: false,
      description:
        'Selected value — `Date` (single), `Date[]` (multiple) or `DateRange` (range). Controlled once `onSelect` is passed.',
      table: {
        type: { summary: 'Date | Date[] | DateRange' },
        category: 'State',
      },
    },
    month: {
      control: false,
      description: 'Controlled displayed month (the first month, for `range`).',
      table: { type: { summary: 'Date' }, category: 'State' },
    },
    defaultMonth: {
      control: false,
      description: 'Uncontrolled initial displayed month.',
      table: { type: { summary: 'Date' }, category: 'State' },
    },
    disabled: {
      control: false,
      description: 'Days that cannot be selected.',
      table: { type: { summary: 'Matcher | Matcher[]' }, category: 'State' },
    },
    min: {
      control: 'number',
      description: 'Minimum number of selectable days (`multiple` / `range`).',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    max: {
      control: 'number',
      description: 'Maximum number of selectable days (`multiple` / `range`).',
      table: { type: { summary: 'number' }, category: 'Behavior' },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Render the leading/trailing days of the adjacent months.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    weekStartsOn: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
      description:
        "First day of the week (0 = Sunday). Defaults to `locale`'s own week start, falling back to Monday when no `locale` is given.",
      table: {
        type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6' },
        defaultValue: { summary: "locale's week start, else 1" },
        category: 'Behavior',
      },
    },
    locale: {
      control: false,
      description:
        "Localizes weekday names and DayPicker's default day-cell/caption accessible labels.",
      table: {
        type: { summary: 'DayPickerLocale' },
        defaultValue: { summary: 'enUS' },
        category: 'Content',
      },
    },
    fromYear: {
      control: 'number',
      description: 'First year offered by the year dropdown.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'current year − 50' },
        category: 'Behavior',
      },
    },
    toYear: {
      control: 'number',
      description: 'Last year offered by the year dropdown.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'current year + 50' },
        category: 'Behavior',
      },
    },
    monthLabel: {
      control: 'text',
      description: 'Accessible name of the month dropdown.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Month'" },
        category: 'Content',
      },
    },
    yearLabel: {
      control: 'text',
      description: 'Accessible name of the year dropdown.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Year'" },
        category: 'Content',
      },
    },
    formatMonthLabel: {
      control: false,
      description: "Formats a month's name for the month dropdown.",
      table: {
        type: { summary: '(date: Date) => string' },
        defaultValue: { summary: "format(date, 'MMMM', { locale })" },
        category: 'Content',
      },
    },
    cancelLabel: {
      control: 'text',
      description: 'Footer "Cancel" button label (`multiple` / `range`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Cancel'" },
        category: 'Content',
      },
    },
    applyLabel: {
      control: 'text',
      description: 'Footer "Apply" button label (`multiple` / `range`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Apply'" },
        category: 'Content',
      },
    },
    onSelect: {
      control: false,
      description: 'Called when the selection changes.',
      table: {
        type: { summary: '(selected, triggerDate) => void' },
        category: 'Events',
      },
    },
    onMonthChange: {
      control: false,
      description: 'Called when the displayed month changes.',
      table: { type: { summary: '(month: Date) => void' }, category: 'Events' },
    },
    onCancel: {
      control: false,
      description: "Called when the footer's Cancel button is pressed.",
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
    onApply: {
      control: false,
      description: "Called when the footer's Apply button is pressed.",
      table: { type: { summary: '() => void' }, category: 'Events' },
    },
  },
} satisfies Meta<typeof CalendarPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'single', defaultMonth: JULY_2026 },
  render: (args) => {
    const [selected, setSelected] = React.useState<Date | undefined>(
      new Date(2026, 6, 9)
    );
    return (
      <CalendarPanel
        {...(args as CalendarPanelSingleProps)}
        selected={selected}
        onSelect={(next) => setSelected(next)}
      />
    );
  },
};

export const Idle: Story = {
  args: { variant: 'single', defaultMonth: JULY_2026 },
};

export const Multiple: Story = {
  args: { variant: 'multiple', defaultMonth: JULY_2026 },
  render: (args) => {
    const [selected, setSelected] = React.useState<Date[]>([
      new Date(2026, 6, 9),
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
      new Date(2026, 6, 24),
    ]);
    return (
      <CalendarPanel
        {...(args as CalendarPanelMultipleProps)}
        selected={selected}
        onSelect={(next: Date[] | undefined) => setSelected(next ?? [])}
        onCancel={() => setSelected([])}
      />
    );
  },
};

export const Range: Story = {
  args: { variant: 'range', defaultMonth: JULY_2026 },
  render: (args) => {
    const [selected, setSelected] = React.useState<DateRange | undefined>({
      from: new Date(2026, 6, 9),
      to: new Date(2026, 7, 10),
    });
    return (
      <CalendarPanel
        {...(args as CalendarPanelRangeProps)}
        selected={selected}
        onSelect={(next: DateRange | undefined) => setSelected(next)}
        onCancel={() => setSelected(undefined)}
      />
    );
  },
};

export const RangeIdle: Story = {
  args: { variant: 'range', defaultMonth: JULY_2026 },
};

export const CustomLabels: Story = {
  args: {
    variant: 'multiple',
    defaultMonth: JULY_2026,
    monthLabel: 'Mois',
    yearLabel: 'Année',
    cancelLabel: 'Annuler',
    applyLabel: 'Appliquer',
  },
};

// `locale` only localizes DayPicker's own weekday/day-cell/caption labels — the
// month dropdown items (`formatMonthLabel`) and every text prop (`monthLabel`,
// `yearLabel`, `cancelLabel`, `applyLabel`) are separate and must be kept in
// sync by the consumer, as shown here for `es`.
export const LocalizedEnUS: Story = {
  name: 'Localized (en-US)',
  args: {
    variant: 'multiple',
    defaultMonth: JULY_2026,
    locale: enUS,
    formatMonthLabel: (date) => format(date, 'MMMM', { locale: enUS }),
  },
};

export const LocalizedEs: Story = {
  name: 'Localized (es)',
  args: {
    variant: 'multiple',
    defaultMonth: JULY_2026,
    locale: es,
    formatMonthLabel: (date) => format(date, 'MMMM', { locale: es }),
    monthLabel: 'Mes',
    yearLabel: 'Año',
    cancelLabel: 'Cancelar',
    applyLabel: 'Aplicar',
  },
};

// `ar`'s `weekStartsOn` is 6 (Saturday), unlike the design's default Monday —
// this demonstrates `weekStartsOn` following `locale` when not set explicitly
// (see `resolveWeekStartsOn` in `calendar-panel-utils.ts`).
export const LocalizedAr: Story = {
  name: 'Localized (ar)',
  args: {
    variant: 'multiple',
    defaultMonth: JULY_2026,
    locale: ar,
    formatMonthLabel: (date) => format(date, 'MMMM', { locale: ar }),
    monthLabel: 'الشهر',
    yearLabel: 'السنة',
    cancelLabel: 'إلغاء',
    applyLabel: 'تطبيق',
  },
};

// The three demos below are the intended real-world usage: a trigger `Button`
// opens the panel inside a `Popover` (per the docs — CalendarPanel is inline
// content, not an overlay), and a plain `InputText` reflects the committed
// value. `single` has no footer, so picking a day both commits and closes;
// `multiple`/`range` stage the pick in a draft and only commit on Apply —
// dismissing the popover any other way (Cancel or an outside click) discards
// the draft and leaves the field untouched.
export const SingleInPopover: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<Date | undefined>();

    return (
      <div className="flex flex-col items-start gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={<Button variant="secondary">Pick a date</Button>}
          />
          <PopoverContent>
            <CalendarPanel
              variant="single"
              defaultMonth={JULY_2026}
              selected={value}
              onSelect={(next) => {
                setValue(next as Date | undefined);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <InputText label="Selected date" value={formatDate(value)} readOnly />
      </div>
    );
  },
};

export const MultipleInPopover: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [applied, setApplied] = React.useState<Date[]>([]);
    const [draft, setDraft] = React.useState<Date[]>([]);

    const handleOpenChange = (next: boolean) => {
      if (next) setDraft(applied);
      setOpen(next);
    };

    return (
      <div className="flex flex-col items-start gap-4">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            render={<Button variant="secondary">Pick dates</Button>}
          />
          <PopoverContent>
            <CalendarPanel
              variant="multiple"
              defaultMonth={JULY_2026}
              selected={draft}
              onSelect={(next) => setDraft((next as Date[] | undefined) ?? [])}
              onCancel={() => setOpen(false)}
              onApply={() => {
                setApplied(draft);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <InputText
          label="Selected dates"
          value={formatDateList(applied)}
          readOnly
        />
      </div>
    );
  },
};

export const RangeInPopover: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [applied, setApplied] = React.useState<DateRange | undefined>();
    const [draft, setDraft] = React.useState<DateRange | undefined>();

    const handleOpenChange = (next: boolean) => {
      if (next) setDraft(applied);
      setOpen(next);
    };

    return (
      <div className="flex flex-col items-start gap-4">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            render={<Button variant="secondary">Pick a range</Button>}
          />
          <PopoverContent>
            <CalendarPanel
              variant="range"
              defaultMonth={JULY_2026}
              selected={draft}
              onSelect={(next) => setDraft(next as DateRange | undefined)}
              onCancel={() => setOpen(false)}
              onApply={() => {
                setApplied(draft);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        <InputText
          label="Selected range"
          value={formatDateRange(applied)}
          readOnly
        />
      </div>
    );
  },
};
