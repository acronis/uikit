import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CogIcon,
  EllipsisIcon,
  ServerIcon,
} from '@acronis-platform/icons-react/stroke-mono';

import { AccordionContainer } from '../../accordion-container';
import { ButtonIcon } from '../../button-icon';
import { Card, CardContent, CardHeader } from '../../card';
import { CardSection } from '../../card-section';
import { Tag } from '../../tag';
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import {
  Section,
  SectionContent,
  SectionHeader,
  type SectionVariant,
} from '../section';

// `Section` is the story's `component` (unlike `Card`, whose header carries
// the interactive surface): all of Section's own controllable props —
// `variant` and `hasBottomBorder` — live on the root, and the compound parts
// (`SectionHeader`/`SectionContent`) are documented below since they aren't
// reachable through `meta.argTypes` while `component` is `Section`.
const meta = {
  title: 'UI/Section',
  component: Section,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "`Section` is a titled band that groups `Card`s (or a `Table`) on a page. It's a compound component: `Section` owns the layout `variant`, `SectionHeader` renders the title row, and `SectionContent` lays out its children per variant.\n\n" +
          '**`SectionHeader` props** — `title` (string, default `"Section Title"`); `description` (string, shown under the title only when `hasDescription` is set); `hasDescription` (boolean); `isSwitchable` (boolean, shows a toggle switch at the start of the header) plus `switchChecked` / `defaultSwitchChecked` / `onSwitchCheckedChange` / `switchDisabled` / `switchLabel`; `icon` (`ReactNode`, rendered after the switch — additive, no Figma counterpart); `extras` (`ReactNode`, inline next to the title); `actions` (`ReactNode`, end of the header row); `isCollapsible` (boolean, shows a disclosure trigger — only has an effect inside a collapsible `AccordionContainer`) with `collapseLabel` for its accessible name.\n\n' +
          "**`SectionContent` props** — only `render` (Base UI composition prop) beyond standard `div` attributes; its layout (single column / grid whose first child spans two of three columns / plain 3-column grid / flush) is driven entirely by the parent `Section`'s `variant`.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['column1', 'column2-70-30', 'grid3', 'table'],
      description:
        "Which layout the section's content area uses. `column1` is a single full-width column; `column2-70-30` is a 3-column grid whose first child spans two columns (a ~67/33 split, not a literal 70/30); `grid3` is a plain 3-column grid (a child opts into a 2-column span via its own `className=\"col-span-2\"`); `table` drops the root's horizontal padding so table rows can run edge-to-edge — `SectionHeader` re-applies the inset for itself.",
      table: {
        type: { summary: "'column1' | 'column2-70-30' | 'grid3' | 'table'" },
        category: 'Appearance',
        defaultValue: { summary: 'column1' },
      },
    },
    hasBottomBorder: {
      control: 'boolean',
      description:
        'Adds a bottom divider plus the matching bottom padding, separating this section from the next one stacked below it. `table` gains only the divider — it has no root padding to extend.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the section root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    children: {
      control: false,
      description:
        'The section body — typically a `SectionHeader` and a `SectionContent`, optionally wrapped in an `AccordionContainer` for a collapsible section.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the rendered `<div>` (e.g. render as a `<section>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// A. Structural stories — one per `variant` x `isCollapsable` combination.
// ---------------------------------------------------------------------------

const structuralTitles: Record<SectionVariant, string> = {
  column1: 'Storage overview',
  'column2-70-30': 'Backup summary',
  grid3: 'Protection status',
  table: 'Recent activity',
};

function Block({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex h-24 items-center justify-center rounded-md border border-dashed border-[var(--ui-border-on-surface-border)] bg-[var(--ui-background-surface-secondary)] text-sm text-[var(--ui-text-on-surface-secondary)] ${className}`}
    >
      {label}
    </div>
  );
}

function structuralContent(variant: SectionVariant) {
  switch (variant) {
    case 'column1':
      return <Block label="Content" />;
    case 'column2-70-30':
      return (
        <>
          <Block label="Primary content (2/3)" />
          <Block label="Side content (1/3)" />
        </>
      );
    case 'grid3':
      return (
        <>
          <Block label="Column 1" />
          <Block label="Column 2" />
          <Block label="Column 3" />
        </>
      );
    case 'table':
      return (
        <div className="h-24 w-full bg-[var(--ui-background-surface-secondary)]" />
      );
    default:
      return null;
  }
}

function StructuralSection({
  variant,
  hasBottomBorder = false,
  collapsible = false,
  defaultOpen,
}: {
  variant: SectionVariant;
  hasBottomBorder?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const title = structuralTitles[variant];

  return (
    <Section
      variant={variant}
      hasBottomBorder={hasBottomBorder}
      className="w-[720px]"
    >
      <AccordionContainer collapsible={collapsible} defaultOpen={defaultOpen}>
        <SectionHeader
          title={title}
          isCollapsible={collapsible}
          collapseLabel={`Toggle ${title.toLowerCase()}`}
        />
        <AccordionContainer.Content>
          <SectionContent>{structuralContent(variant)}</SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  );
}

export const Column1: Story = {
  args: { variant: 'column1', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column1'}
      hasBottomBorder={args.hasBottomBorder ?? false}
    />
  ),
};

export const Column1Collapsible: Story = {
  args: { variant: 'column1', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column1'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen
    />
  ),
};

export const Column1Collapsed: Story = {
  args: { variant: 'column1', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column1'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen={false}
    />
  ),
};

export const Column2With7030: Story = {
  args: { variant: 'column2-70-30', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column2-70-30'}
      hasBottomBorder={args.hasBottomBorder ?? false}
    />
  ),
};

export const Column2With7030Collapsible: Story = {
  args: { variant: 'column2-70-30', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column2-70-30'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen
    />
  ),
};

export const Column2With7030Collapsed: Story = {
  args: { variant: 'column2-70-30', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'column2-70-30'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen={false}
    />
  ),
};

export const Grid3: Story = {
  args: { variant: 'grid3', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'grid3'}
      hasBottomBorder={args.hasBottomBorder ?? false}
    />
  ),
};

export const Grid3Collapsible: Story = {
  args: { variant: 'grid3', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'grid3'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen
    />
  ),
};

export const Grid3Collapsed: Story = {
  args: { variant: 'grid3', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'grid3'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen={false}
    />
  ),
};

export const Table: Story = {
  args: { variant: 'table', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'table'}
      hasBottomBorder={args.hasBottomBorder ?? false}
    />
  ),
};

export const TableCollapsible: Story = {
  args: { variant: 'table', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'table'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen
    />
  ),
};

export const TableCollapsed: Story = {
  args: { variant: 'table', hasBottomBorder: false },
  render: (args) => (
    <StructuralSection
      variant={args.variant ?? 'table'}
      hasBottomBorder={args.hasBottomBorder ?? false}
      collapsible
      defaultOpen={false}
    />
  ),
};

// ---------------------------------------------------------------------------
// B. Integration stories — Section composed with real Card/Table content.
// ---------------------------------------------------------------------------

const scheduleRows: [string, string][] = [
  ['Frequency', 'Daily'],
  ['Start time', '02:00 UTC'],
  ['Retention', '30 days'],
];

const ScheduleList = (
  <>
    {scheduleRows.map(([term, value]) => (
      <div
        key={term}
        className="grid min-h-10 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 py-2 text-sm leading-6"
      >
        <span className="text-[var(--ui-text-on-surface-primary)]">
          {term}
        </span>
        <span className="truncate text-[var(--ui-text-on-surface-primary)]">
          {value}
        </span>
      </div>
    ))}
  </>
);

// 1. `column1` Section containing a single Card (CardHeader + a CardSection
// variant), with the header's icon/extras/actions/description all exercised
// together since they aren't independently covered by their own stories.
export const IntegrationColumn1WithCard: Story = {
  render: () => (
    <Section variant="column1" className="w-[480px]">
      <SectionHeader
        title="Backup jobs"
        description="1 active policy"
        hasDescription
        icon={<ServerIcon size={16} />}
        extras={<Tag variant="info">Beta</Tag>}
        actions={
          <ButtonIcon variant="ghost" aria-label="More actions">
            <EllipsisIcon size={16} />
          </ButtonIcon>
        }
      />
      <SectionContent>
        <Card className="w-full">
          <CardHeader
            title="Daily backup"
            hasDescription
            description="Runs every day at 02:00 UTC"
          />
          <CardContent className="p-0 pb-4">
            <CardSection
              variant="list"
              hasHeader
              title="Schedule"
              contentList={ScheduleList}
            />
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  ),
};

// 2. `column2-70-30` Section containing two Cards side by side — the first
// automatically spans the 2/3 column, the second the remaining 1/3.
export const IntegrationColumn2WithCards: Story = {
  render: () => (
    <Section variant="column2-70-30" className="w-[720px]">
      <SectionHeader title="Protection overview" />
      <SectionContent>
        <Card className="w-full">
          <CardHeader title="Workloads" />
          <CardContent>
            <p className="text-sm">
              24 of 24 workloads are protected and up to date.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader title="Storage" />
          <CardContent>
            <p className="text-sm">128 GB used of 500 GB.</p>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  ),
};

// 3. `grid3` Section containing three Cards, one spanning two columns via its
// own `className="col-span-2"`.
export const IntegrationGrid3WithCards: Story = {
  render: () => (
    <Section variant="grid3" className="w-[720px]">
      <SectionHeader title="Fleet health" />
      <SectionContent>
        <Card className="col-span-2 w-full">
          <CardHeader title="Alerts" />
          <CardContent>
            <p className="text-sm">No active alerts across the fleet.</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader title="Agents" />
          <CardContent>
            <p className="text-sm">312 online</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader title="Licenses" />
          <CardContent>
            <p className="text-sm">48 available</p>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  ),
};

const activityRows: { workload: string; status: string; lastRun: string }[] = [
  { workload: 'Finance DB', status: 'Success', lastRun: '5 min ago' },
  { workload: 'HR Fileshare', status: 'Success', lastRun: '18 min ago' },
  { workload: 'Web App VM', status: 'Failed', lastRun: '1 hour ago' },
];

// 4. `table` Section containing a Table — the padded header sits above rows
// that bleed edge-to-edge against the section's own (padding-free) root.
export const IntegrationTableWithData: Story = {
  render: () => (
    <Section variant="table" className="w-[720px]">
      <SectionHeader
        title="Recent activity"
        actions={
          <ButtonIcon variant="ghost" aria-label="Configure">
            <CogIcon size={16} />
          </ButtonIcon>
        }
      />
      <SectionContent>
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead>Workload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityRows.map((row) => (
              <TableRow key={row.workload}>
                <TableCell>{row.workload}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.lastRun}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UiTable>
      </SectionContent>
    </Section>
  ),
};

// 5. A collapsible Section wrapping a collapsible Card — collapsing the
// Section hides the Card entirely; independently, the Card's own trigger
// collapses just its content while the Section (and Card header) stay put.
function CollapsibleSectionWithCollapsibleCard() {
  return (
    <Section variant="column1" className="w-[480px]">
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader
          title="Backup policy"
          isCollapsible
          collapseLabel="Toggle backup policy"
        />
        <AccordionContainer.Content>
          <SectionContent>
            <Card className="w-full">
              <AccordionContainer collapsible defaultOpen>
                <CardHeader
                  title="Daily schedule"
                  isCollapsible
                  collapseLabel="Toggle daily schedule"
                />
                <AccordionContainer.Content>
                  <CardContent>
                    <p className="text-sm">
                      Runs every day at 02:00 UTC across 12 workloads.
                    </p>
                  </CardContent>
                </AccordionContainer.Content>
              </AccordionContainer>
            </Card>
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  );
}

export const IntegrationCollapsibleSectionWithCollapsibleCard: Story = {
  render: () => <CollapsibleSectionWithCollapsibleCard />,
};

// 6. Two stacked Sections — `hasBottomBorder` on the first shows the divider
// plus its extra 16px bottom spacing before the next Section's header.
export const IntegrationStackedSectionsWithBottomBorder: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col rounded-lg border border-[var(--ui-border-on-surface-border)] bg-[var(--ui-background-surface-primary)]">
      <Section variant="column1" hasBottomBorder>
        <SectionHeader title="General settings" />
        <SectionContent>
          <Block label="General settings content" />
        </SectionContent>
      </Section>
      <Section variant="column1">
        <SectionHeader title="Advanced settings" />
        <SectionContent>
          <Block label="Advanced settings content" />
        </SectionContent>
      </Section>
    </div>
  ),
};

// 7. Kitchen-sink: every `Section`/`SectionHeader` prop exercised at once
// (collapsible root, switch, icon, extras, actions, description,
// hasBottomBorder) around a single `column1` Card, whose own header exercises
// every `CardHeader` prop too. The Card body nests `CardSection`
// `card-primary`, which — per the compound pattern in `card-section.tsx` —
// wraps its `children` in a fresh `Card`; that nested Card's body in turn
// nests a `card-secondary` `CardSection`, giving a real
// Section > Card > CardSection(primary) > Card > CardSection(secondary)
// chain rather than the two variants merely sitting as siblings.
function FullFeaturedSection() {
  const [sectionSwitchOn, setSectionSwitchOn] = React.useState(true);
  const [cardSwitchOn, setCardSwitchOn] = React.useState(true);

  return (
    <Section variant="column1" hasBottomBorder className="w-[560px]">
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader
          title="Backup policy"
          description="Applies to 12 workloads across 2 sites"
          hasDescription
          isSwitchable
          switchChecked={sectionSwitchOn}
          onSwitchCheckedChange={setSectionSwitchOn}
          switchLabel="Enable backup policy"
          icon={<ServerIcon size={16} />}
          extras={<Tag variant="info">Beta</Tag>}
          actions={
            <ButtonIcon variant="ghost" aria-label="Section actions">
              <EllipsisIcon size={16} />
            </ButtonIcon>
          }
          isCollapsible
          collapseLabel="Toggle backup policy"
        />
        <AccordionContainer.Content>
          <SectionContent>
            <Card className="w-full">
              <AccordionContainer collapsible defaultOpen>
                <CardHeader
                  title="Daily schedule"
                  description="Runs every day at 02:00 UTC"
                  hasDescription
                  isDraggable
                  dragHandleLabel="Reorder daily schedule"
                  isSwitchable
                  switchChecked={cardSwitchOn}
                  onSwitchCheckedChange={setCardSwitchOn}
                  switchLabel="Enable daily schedule"
                  hasAvatar
                  avatarLabel="DS"
                  hasRename
                  onRename={() => {}}
                  renameLabel="Rename schedule"
                  extras={<Tag variant="success">Active</Tag>}
                  actions={
                    <ButtonIcon variant="ghost" aria-label="Card actions">
                      <CogIcon size={16} />
                    </ButtonIcon>
                  }
                  isCollapsible
                  collapseLabel="Toggle daily schedule"
                />
                <AccordionContainer.Content>
                  <CardContent className="p-0 pb-4">
                    <CardSection
                      variant="card-primary"
                      hasHeader
                      title="Primary target"
                      extras={<Tag variant="neutral">On-site</Tag>}
                      actions={
                        <ButtonIcon
                          variant="ghost"
                          aria-label="Primary target actions"
                        >
                          <EllipsisIcon size={16} />
                        </ButtonIcon>
                      }
                    >
                      <CardHeader
                        title="Local NAS"
                        description="192.168.1.20"
                        hasDescription
                      />
                      <CardContent className="p-0 pb-4">
                        <CardSection
                          variant="card-secondary"
                          hasHeader
                          title="Secondary target"
                          extras={<Tag variant="neutral">Off-site</Tag>}
                          actions={
                            <ButtonIcon
                              variant="ghost"
                              aria-label="Secondary target actions"
                            >
                              <EllipsisIcon size={16} />
                            </ButtonIcon>
                          }
                        >
                          <CardHeader
                            title="Cloud storage"
                            description="Acronis Cloud, EU-West"
                            hasDescription
                          />
                          <CardContent className="p-0 pb-4">
                            <CardSection variant="list" contentList={ScheduleList} />
                          </CardContent>
                        </CardSection>
                      </CardContent>
                    </CardSection>
                  </CardContent>
                </AccordionContainer.Content>
              </AccordionContainer>
            </Card>
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  );
}

export const IntegrationFullFeaturedWithNestedCards: Story = {
  render: () => <FullFeaturedSection />,
};
