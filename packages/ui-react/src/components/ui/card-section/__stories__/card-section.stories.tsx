import type { Meta, StoryObj } from '@storybook/react-vite';

import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { ButtonIcon } from '../../button-icon';
import { Card, CardContent, CardHeader } from '../../card';
import { Tag } from '../../tag';
import { CardSection } from '../card-section';

const meta = {
  title: 'UI/CardSection',
  component: CardSection,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'slot',
        'tag',
        'list',
        'table-actions',
        'card-primary',
        'card-secondary',
      ],
      description:
        'Which body shape the section renders. `table-actions` sits flush so its rows run edge-to-edge; the `card-*` pair nests a `Card` on the primary or secondary surface.',
      table: {
        type: { summary: 'CardSectionVariant' },
        category: 'Appearance',
        defaultValue: { summary: 'slot' },
      },
    },
    hasBottomBorder: {
      control: 'boolean',
      description:
        'Adds a bottom divider plus the matching bottom padding, separating this section from the next one stacked below it.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    hasHeader: {
      control: 'boolean',
      description:
        "Shows the section's own 14px mini-header row. Requires `title`.",
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description:
        "The section header's title. Required whenever `hasHeader` is set.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    extras: {
      control: false,
      description: 'Content rendered inline next to the title.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    actions: {
      control: false,
      description: 'Actions rendered at the end of the header row.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    content: {
      control: false,
      description: 'Body of the `slot` variant — arbitrary passthrough.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    contentTag: {
      control: false,
      description:
        'Body of the `tag` variant. Defaults to a short example tag row.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    contentList: {
      control: false,
      description:
        'Body of the `list` variant — title/description key-value rows.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    contentTable: {
      control: false,
      description: 'Body of the `table-actions` variant.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description:
        'For `card-primary`/`card-secondary`, the nested `Card`’s parts. For the other variants, appended after the body.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    render: {
      control: false,
      description:
        'Base UI composition prop — replaces the rendered `<div>` (e.g. with a `<section>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof CardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleList = (
  <>
    {[
      ['Network', '192.168.0.0/24'],
      ['Gateway', '192.168.0.1'],
      ['DNS', '8.8.8.8'],
    ].map(([term, value]) => (
      <div
        key={term}
        className="grid min-h-10 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 py-2 text-sm leading-6"
      >
        <span className="text-[var(--ui-text-on-surface-primary)]">{term}</span>
        <span className="truncate text-[var(--ui-text-on-surface-primary)]">
          {value}
        </span>
      </div>
    ))}
  </>
);

const SampleTable = (
  <table className="w-full text-sm leading-6">
    <thead>
      <tr className="border-b border-[var(--ui-border-on-surface-divider)]">
        <th className="px-4 py-2 text-start font-semibold">Subnet</th>
        <th className="px-4 py-2 text-start font-semibold">Hosts</th>
      </tr>
    </thead>
    <tbody>
      {[
        ['192.160.0.0/24', '25'],
        ['179.20.204.0/24', '87'],
      ].map(([subnet, hosts]) => (
        <tr
          key={subnet}
          className="border-b border-[var(--ui-border-on-surface-divider)] last:border-b-0"
        >
          <td className="px-4 py-2">{subnet}</td>
          <td className="px-4 py-2">{hosts}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const HeaderActions = (
  <ButtonIcon variant="ghost" aria-label="More">
    <EllipsisIcon size={16} />
  </ButtonIcon>
);

export const Default: Story = {
  args: { variant: 'slot', content: 'Arbitrary section content.' },
  render: (args) => (
    <Card className="w-[640px]">
      <CardHeader title="Card title" />
      <CardContent className="p-0 pb-4">
        <CardSection {...args} />
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  args: {
    variant: 'slot',
    hasHeader: true,
    title: 'Section Title',
    content: 'Arbitrary section content.',
  },
  render: Default.render,
};

export const WithHeaderExtrasAndActions: Story = {
  args: {
    variant: 'slot',
    hasHeader: true,
    title: 'Section Title',
    extras: <Tag variant="info">Beta</Tag>,
    actions: HeaderActions,
    content: 'Arbitrary section content.',
  },
  render: Default.render,
};

export const TagVariant: Story = {
  args: { variant: 'tag', hasHeader: true, title: 'Labels' },
  render: Default.render,
};

export const ListVariant: Story = {
  args: {
    variant: 'list',
    hasHeader: true,
    title: 'Network details',
    contentList: SampleList,
  },
  render: Default.render,
};

export const TableActionsVariant: Story = {
  args: {
    variant: 'table-actions',
    hasHeader: true,
    title: 'Subnets',
    actions: HeaderActions,
    contentTable: SampleTable,
  },
  render: Default.render,
};

export const CardPrimaryVariant: Story = {
  args: { variant: 'card-primary', hasHeader: true, title: 'Nested card' },
  render: (args) => (
    <Card className="w-[640px]">
      <CardHeader title="Card title" />
      <CardContent className="p-0 pb-4">
        <CardSection {...args}>
          <CardHeader title="Title" />
          <CardContent>Nested card body.</CardContent>
        </CardSection>
      </CardContent>
    </Card>
  ),
};

export const CardSecondaryVariant: Story = {
  args: { variant: 'card-secondary', hasHeader: true, title: 'Nested card' },
  render: CardPrimaryVariant.render,
};

/** All six variants stacked in one card body, each separated by a divider. */
export const StackedWithDividers: Story = {
  args: { variant: 'slot' },
  render: () => (
    <Card className="w-[640px]">
      <CardHeader title="Workload" />
      <CardContent className="p-0 pb-4">
        <CardSection
          variant="slot"
          hasHeader
          title="Slot"
          hasBottomBorder
          content="Arbitrary section content."
        />
        <CardSection variant="tag" hasHeader title="Tag" hasBottomBorder />
        <CardSection
          variant="list"
          hasHeader
          title="List"
          hasBottomBorder
          contentList={SampleList}
        />
        <CardSection
          variant="table-actions"
          hasHeader
          title="Table + Actions"
          actions={HeaderActions}
          hasBottomBorder
          contentTable={SampleTable}
        />
        <CardSection
          variant="card-primary"
          hasHeader
          title="Card (primary)"
          hasBottomBorder
        >
          <CardHeader title="Title" />
          <CardContent>Nested card body.</CardContent>
        </CardSection>
        <CardSection variant="card-secondary" hasHeader title="Card (secondary)">
          <CardHeader title="Title" />
          <CardContent>Nested card body.</CardContent>
        </CardSection>
      </CardContent>
    </Card>
  ),
};

/** Every variant without its mini-header, for the header on/off comparison. */
export const AllVariantsWithoutHeader: Story = {
  args: { variant: 'slot' },
  render: () => (
    <Card className="w-[640px]">
      <CardContent className="p-0 pb-4">
        <CardSection
          variant="slot"
          hasBottomBorder
          content="Arbitrary section content."
        />
        <CardSection variant="tag" hasBottomBorder />
        <CardSection variant="list" hasBottomBorder contentList={SampleList} />
        <CardSection
          variant="table-actions"
          hasBottomBorder
          contentTable={SampleTable}
        />
        <CardSection variant="card-primary" hasBottomBorder>
          <CardHeader title="Title" />
          <CardContent>Nested card body.</CardContent>
        </CardSection>
        <CardSection variant="card-secondary">
          <CardHeader title="Title" />
          <CardContent>Nested card body.</CardContent>
        </CardSection>
      </CardContent>
    </Card>
  ),
};
