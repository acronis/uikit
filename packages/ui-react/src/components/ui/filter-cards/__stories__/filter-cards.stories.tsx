import type { Meta, StoryObj } from '@storybook/react-vite';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';

import { CardFilter } from '../../card-filter/card-filter';
import { FilterCards } from '../filter-cards';

// CardFilter wraps its label/value by default; wrapping the text passed to
// `label`/`value` in a `nowrap` span is the consumer-level opt-in for a card
// that never wraps onto a second line (letting the row overflow instead) —
// used below to keep every card in a row the same single-line height.
const nowrap = (text: string) => (
  <span className="whitespace-nowrap">{text}</span>
);

const meta = {
  title: 'UI/FilterCards',
  component: FilterCards,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'The `CardFilter` items to lay out in the row.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<div>` with another element or component.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof FilterCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FilterCards {...args}>
      <CardFilter
        label="Total assets"
        value="125"
        icon={<SquareDashedIcon />}
      />
      <CardFilter
        label="Active filters"
        value="125"
        icon={<SquareDashedIcon />}
      />
      <CardFilter label="Pending" value="125" icon={<SquareDashedIcon />} />
      <CardFilter label="Resolved" value="125" icon={<SquareDashedIcon />} />
      <CardFilter label="Ignored" value="125" icon={<SquareDashedIcon />} />
      <CardFilter label="Archived" value="125" icon={<SquareDashedIcon />} />
    </FilterCards>
  ),
};

export const FewCards: Story = {
  render: (args) => (
    <FilterCards {...args}>
      <CardFilter
        label="Total assets"
        value="125"
        icon={<SquareDashedIcon />}
      />
      <CardFilter
        variant="clickable"
        label="Active filters"
        value="3"
        icon={<SquareDashedIcon />}
      />
      <CardFilter variant="static-empty" label="Pending" />
    </FilterCards>
  ),
};

// Diagnostic: the default (no `nowrap` opt-in) behavior in a narrow
// container. Without `nowrap`, a card's label wraps onto a second line
// before the row would overflow — "Active filters" wraps here while its
// siblings don't. `items-stretch` on FilterCards keeps every card the same
// height as its tallest sibling, so the row stays even-topped/even-bottomed
// instead of the wrapped card's neighbors floating at a shorter height.
export const Wrapping: Story = {
  render: (args) => (
    <div style={{ width: 500 }}>
      <FilterCards {...args}>
        <CardFilter
          label="Total assets"
          value="125"
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label="Active filters"
          value="125"
          icon={<SquareDashedIcon />}
        />
        <CardFilter label="Pending" value="125" icon={<SquareDashedIcon />} />
        <CardFilter label="Resolved" value="125" icon={<SquareDashedIcon />} />
        <CardFilter label="Ignored" value="125" icon={<SquareDashedIcon />} />
        <CardFilter label="Archived" value="125" icon={<SquareDashedIcon />} />
      </FilterCards>
    </div>
  ),
};

// Diagnostic: more cards than fit comfortably in a narrow container.
// FilterCards never wraps (single flex row) and only shrinks each card down
// to its own content's natural width — it never clips a card's label/value.
// Once the cards' combined natural width exceeds the row, the row overflows
// its container; here the consumer wraps FilterCards in a fixed-width,
// `overflow-x-auto` container (the pattern FilterCards expects consumers to
// use) so the excess cards scroll into view instead of shrinking further.
// Every card opts into `nowrap` (see the `nowrap` helper above) so the row
// stays a single line of equal-height cards instead of some cards wrapping
// their label onto a second line while their neighbors don't.
export const Overflow: Story = {
  render: (args) => (
    <div style={{ width: 700, overflowX: 'auto' }}>
      <FilterCards {...args}>
        <CardFilter
          label={nowrap('Total assets')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Active filters')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Pending')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Resolved')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Ignored')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Archived')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Escalated')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Reviewed')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Snoozed')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Closed')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Assets pending manual review')}
          value={nowrap('1,204,573')}
          icon={<SquareDashedIcon />}
        />
      </FilterCards>
    </div>
  ),
};

// The recommended consumer pattern: wrap FilterCards in a full-width,
// `overflow-x-auto` container. The exact same markup renders with no
// scrollbar when the container is wide enough for every card's natural
// width, and becomes horizontally scrollable — with no clipped text — once
// the container narrows past that point (e.g. on a small screen). Every card
// opts into `nowrap` so the row stays single-line/equal-height at both sizes.
export const ResponsiveContainer: Story = {
  render: (args) => {
    const cards = (
      <>
        <CardFilter
          label={nowrap('Total assets')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Active filters')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Pending')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Resolved')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Ignored')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
        <CardFilter
          label={nowrap('Archived')}
          value={nowrap('125')}
          icon={<SquareDashedIcon />}
        />
      </>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Wide container (1100px) — cards fit at full width, no scroll
          </p>
          <div style={{ width: 1100, overflowX: 'auto' }}>
            <FilterCards {...args}>{cards}</FilterCards>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            Same markup, narrow container (500px) — now scrolls horizontally
          </p>
          <div style={{ width: 500, overflowX: 'auto' }}>
            <FilterCards {...args}>{cards}</FilterCards>
          </div>
        </div>
      </div>
    );
  },
};
