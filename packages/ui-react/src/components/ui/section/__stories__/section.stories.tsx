import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EllipsisIcon } from '@acronis-platform/icons-react/stroke-mono';

import { AccordionContainer } from '../../accordion-container';
import { Button } from '../../button';
import { ButtonIcon } from '../../button-icon';
import { Card, CardContent, CardFooter, CardHeader } from '../../card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../table';
import { Section, SectionContent, SectionHeader } from '../section';

// `Section` owns the content layout (`variant`) and the divider
// (`hasBottomBorder`), so it — not `SectionHeader` — is the story `component`.
// The header's own controls are documented on `SectionHeader`'s argTypes below
// and exercised through the composed stories.
const meta = {
  title: 'UI/Section',
  component: Section,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['column1', 'column2-70-30', 'grid3', 'table'],
      description:
        'Content layout: a single column, a 70/30 split, a three-column grid, or a flush table.',
      table: {
        type: { summary: "'column1' | 'column2-70-30' | 'grid3' | 'table'" },
        category: 'Appearance',
        defaultValue: { summary: 'column1' },
      },
    },
    hasBottomBorder: {
      control: 'boolean',
      description:
        'Draws a divider under the section plus the matching bottom padding, separating it from the next section on the page.',
      table: {
        type: { summary: 'boolean' },
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    render: {
      control: false,
      description:
        'Base UI composition prop — replaces the rendered `<section>` element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent className="pt-4">
        <p className="text-sm">{body}</p>
      </CardContent>
    </Card>
  );
}

function DemoTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workload</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last run</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>web-01</TableCell>
          <TableCell>Protected</TableCell>
          <TableCell>5 minutes ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>db-02</TableCell>
          <TableCell>Protected</TableCell>
          <TableCell>18 minutes ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>mail-03</TableCell>
          <TableCell>Warning</TableCell>
          <TableCell>2 hours ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export const Default: Story = {
  args: {
    variant: 'column1',
    hasBottomBorder: false,
  },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        title="Backup plans"
        description="Manage how your workloads are backed up and retained."
        hasDescription
      />
      <SectionContent>
        <DemoCard
          title="Daily backup"
          body="Runs every night at 02:00 and keeps 30 restore points."
        />
      </SectionContent>
    </Section>
  ),
};

// One full-width content area — the plainest of the four layouts. Whatever the
// consumer puts in `SectionContent` fills the band.
export const Column1: Story = {
  args: { variant: 'column1' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader title="Protection summary" />
      <SectionContent>
        <DemoCard
          title="All workloads"
          body="24 workloads protected, 0 failures in the last 24 hours."
        />
      </SectionContent>
    </Section>
  ),
};

// A 2:1 span of a 3-column grid: `children` take the wide (~70%) column,
// `secondaryContent` the narrow (~30%) one.
export const TwoColumn7030: Story = {
  args: { variant: 'column2-70-30' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        title="Storage"
        description="Usage across every connected location."
        hasDescription
      />
      <SectionContent
        secondaryContent={
          <DemoCard title="Quota" body="1.2 TB of 2 TB used." />
        }
      >
        <DemoCard
          title="Locations"
          body="Cloud storage, local NAS, and one offsite vault."
        />
      </SectionContent>
    </Section>
  ),
};

// Children flow into a three-column grid — the usual home for a row of cards.
export const Grid3: Story = {
  args: { variant: 'grid3' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader title="Recent activity" />
      <SectionContent>
        <DemoCard title="Backups" body="12 completed today." />
        <DemoCard title="Recoveries" body="2 completed today." />
        <DemoCard title="Alerts" body="1 warning to review." />
      </SectionContent>
    </Section>
  ),
};

// The table layout drops the root inset entirely so rows bleed to the page
// edges; the header re-applies it so the title still lines up with the first
// column.
export const TableLayout: Story = {
  args: { variant: 'table' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        title="Workloads"
        actions={
          <ButtonIcon aria-label="More actions">
            <EllipsisIcon size={24} />
          </ButtonIcon>
        }
      />
      <SectionContent>
        <DemoTable />
      </SectionContent>
    </Section>
  ),
};

export const WithBottomBorder: Story = {
  args: { variant: 'column1', hasBottomBorder: true },
  render: (args) => (
    <Section {...args}>
      <SectionHeader title="General" />
      <SectionContent>
        <DemoCard title="Region" body="Frankfurt (eu-central-1)." />
      </SectionContent>
    </Section>
  ),
};

// Stacked sections on one page: every section but the last draws a divider, so
// the page reads as a sequence of separated bands.
export const IntegrationStackedSectionsWithBottomBorder: Story = {
  render: () => (
    <div className="flex flex-col">
      <Section hasBottomBorder>
        <SectionHeader
          title="General"
          description="Region, tenant, and naming."
          hasDescription
        />
        <SectionContent>
          <DemoCard title="Region" body="Frankfurt (eu-central-1)." />
        </SectionContent>
      </Section>
      <Section variant="grid3" hasBottomBorder>
        <SectionHeader title="Protection" />
        <SectionContent>
          <DemoCard title="Backup" body="Nightly at 02:00." />
          <DemoCard title="Replication" body="Every 4 hours." />
          <DemoCard title="Archive" body="Monthly to cold storage." />
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader title="Danger zone" />
        <SectionContent>
          <DemoCard
            title="Delete tenant"
            body="This permanently removes every workload and backup."
          />
        </SectionContent>
      </Section>
    </div>
  ),
};

export const Switchable: Story = {
  args: { variant: 'column1' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        title="Email notifications"
        description="Send a digest whenever a plan fails."
        hasDescription
        isSwitchable
        defaultSwitchChecked
        switchLabel="Toggle email notifications"
      />
      <SectionContent>
        <DemoCard
          title="Recipients"
          body="3 administrators receive the digest."
        />
      </SectionContent>
    </Section>
  ),
};

// `title` renders as a `<p>`, so a section that needs a real document heading
// supplies its own through `children` and leaves `title` unset. With no title,
// no extras, and no description, the header renders no title wrapper at all —
// the custom heading is the first thing in the row.
export const WithCustomHeading: Story = {
  args: { variant: 'column1' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        actions={<Button variant="secondary">Configure</Button>}
      >
        <h2 className="min-w-0 flex-1 truncate text-xl leading-6 font-medium text-[var(--ui-text-on-surface-primary)]">
          Backup plans
        </h2>
      </SectionHeader>
      <SectionContent>
        <DemoCard
          title="Daily backup"
          body="The heading is a real h2 supplied by the consumer, not the title prop."
        />
      </SectionContent>
    </Section>
  ),
};

export const WithExtrasAndActions: Story = {
  args: { variant: 'column1' },
  render: (args) => (
    <Section {...args}>
      <SectionHeader
        title="Cyber Protection"
        extras={
          <span className="rounded-sm bg-[var(--ui-background-surface-secondary)] px-1.5 py-0.5 text-xs text-[var(--ui-text-on-surface-secondary)]">
            Beta
          </span>
        }
        actions={
          <>
            <Button variant="secondary">Configure</Button>
            <ButtonIcon aria-label="More actions">
              <EllipsisIcon size={24} />
            </ButtonIcon>
          </>
        }
      />
      <SectionContent>
        <DemoCard
          title="Coverage"
          body="Extras sit next to the title; actions align to the end."
        />
      </SectionContent>
    </Section>
  ),
};

// The design's `isCollapsable` variant is a composition, not a prop: wrap the
// header and the content in `AccordionContainer` and set `isCollapsible` on the
// header so it renders the trigger — exactly like `Card`.
function CollapsibleSectionDemo({
  args,
  defaultOpen,
}: {
  args: ComponentProps<typeof Section>;
  defaultOpen: boolean;
}) {
  return (
    <Section {...args}>
      <AccordionContainer collapsible defaultOpen={defaultOpen}>
        <SectionHeader
          title="Protection"
          description="3 plans applied to 24 workloads."
          hasDescription
          isCollapsible
          collapseLabel="Toggle protection section"
        />
        <AccordionContainer.Content>
          <SectionContent>
            <DemoCard title="Backup" body="Nightly at 02:00." />
            <DemoCard title="Replication" body="Every 4 hours." />
            <DemoCard title="Archive" body="Monthly to cold storage." />
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  );
}

export const CollapsibleExpanded: Story = {
  args: { variant: 'grid3' },
  render: (args) => <CollapsibleSectionDemo args={args} defaultOpen />,
};

export const CollapsibleCollapsed: Story = {
  args: { variant: 'grid3' },
  render: (args) => <CollapsibleSectionDemo args={args} defaultOpen={false} />,
};

// Nested disclosures: the `Section` and the `Card` inside it each own their
// own independent `AccordionContainer` — collapsing one has no effect on the
// other.
export const IntegrationCollapsibleSectionWithCollapsibleCard: Story = {
  render: () => (
    <Section variant="column1">
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader
          title="Protection"
          description="3 plans applied to 24 workloads."
          hasDescription
          isCollapsible
          collapseLabel="Toggle protection section"
        />
        <AccordionContainer.Content>
          <SectionContent>
            <Card>
              <AccordionContainer collapsible defaultOpen>
                <CardHeader title="Daily backup plan" isCollapsible />
                <AccordionContainer.Content>
                  <CardContent>
                    <p className="text-sm">
                      Runs every night at 02:00 and keeps 30 restore points.
                    </p>
                  </CardContent>
                </AccordionContainer.Content>
              </AccordionContainer>
            </Card>
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  ),
};

// Every `Section` feature and every `CardHeader` feature combined in one
// composition: switch, extras, end actions, a bottom divider, and a
// collapsible section wrapping a nested card that is itself draggable,
// switchable, has an avatar and a rename control, and is independently
// collapsible.
export const IntegrationFullFeaturedWithNestedCards: Story = {
  render: () => (
    <Section variant="column1" hasBottomBorder className="w-120">
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader
          title="Cyber Protection"
          description="Every section feature combined: switch, extras, actions, divider, collapse."
          hasDescription
          isSwitchable
          defaultSwitchChecked
          switchLabel="Toggle Cyber Protection"
          extras={
            <span className="rounded-sm bg-[var(--ui-background-surface-secondary)] px-1.5 py-0.5 text-xs text-[var(--ui-text-on-surface-secondary)]">
              Beta
            </span>
          }
          actions={
            <ButtonIcon aria-label="More actions">
              <EllipsisIcon size={24} />
            </ButtonIcon>
          }
          isCollapsible
          collapseLabel="Toggle Cyber Protection section"
        />
        <AccordionContainer.Content>
          <SectionContent>
            <Card>
              <AccordionContainer collapsible defaultOpen>
                <CardHeader
                  title="Backup policy"
                  description="Every card header feature combined: drag, switch, avatar, rename, collapse."
                  hasDescription
                  isDraggable
                  isSwitchable
                  defaultSwitchChecked
                  hasAvatar
                  avatarLabel="SB"
                  hasRename
                  actions={
                    <ButtonIcon aria-label="More actions">
                      <EllipsisIcon size={24} />
                    </ButtonIcon>
                  }
                  isCollapsible
                />
                <AccordionContainer.Content>
                  <CardContent>
                    <p className="text-sm">
                      Runs every night at 02:00 and keeps 30 restore points.
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button>Save</Button>
                    <Button variant="secondary">Cancel</Button>
                  </CardFooter>
                </AccordionContainer.Content>
              </AccordionContainer>
            </Card>
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    </Section>
  ),
};
