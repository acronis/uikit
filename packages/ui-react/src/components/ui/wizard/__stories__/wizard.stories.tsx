import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback } from '../../avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../breadcrumb';
import { Button } from '../../button';
import { InputText } from '../../input-text';
import {
  PageHeaderActions,
  PageHeaderRow,
  PageHeaderTitle,
} from '../../page-header';
import { Section, SectionContent, SectionHeader } from '../../section';
import { Stepper } from '../../stepper';
import { StepperItem } from '../../stepper-item';
import { Wizard, WizardBody, WizardHeader, WizardSubtitle } from '../wizard';

const meta = {
  title: 'UI/Wizard',
  component: Wizard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    children: {
      control: false,
      description:
        'The wizard structure — a `WizardHeader` (breadcrumb, `PageHeaderRow` title/actions, optional `WizardSubtitle`, optional `Stepper`) followed by a `WizardBody` wrapping the step content `Section`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    className: {
      control: false,
      description: 'Additional classes merged onto the root `<div>`.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SUBTITLE =
  'Name the dashboard, pick the widgets it shows, and choose who can see it.';

function WizardBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Monitoring</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Create dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// Cancel / Back / Next are plain `Button`s the consumer places and wires — the
// kit deliberately owns no step state or navigation logic (see wizard.tsx).
function WizardActions() {
  return (
    <PageHeaderActions>
      <Button variant="secondary">Cancel</Button>
      <Button variant="secondary">Back</Button>
      <Button>Next</Button>
    </PageHeaderActions>
  );
}

function WizardSteps() {
  return (
    <Stepper
      currentStep={2}
      totalSteps={3}
      current="Choose widgets"
      next="Set permissions"
    >
      <StepperItem
        variant="completed"
        label="Name the dashboard"
        avatar={
          <Avatar color="green" className="[box-shadow:none]">
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="current"
        label="Choose widgets"
        avatar={
          <Avatar
            color="blue"
            className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
          >
            <AvatarFallback>2</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="future"
        label="Set permissions"
        avatar={
          <Avatar
            color="gray"
            className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
          >
            <AvatarFallback>3</AvatarFallback>
          </Avatar>
        }
      />
    </Stepper>
  );
}

function StepContent() {
  return (
    <Section>
      <SectionHeader
        title="Choose widgets"
        description="Widgets you add here appear on the dashboard in the order you pick them."
        hasDescription
      />
      <SectionContent>
        {/* `InputText` labels itself (it wires the label's `htmlFor` to the
            input's id), so it needs no surrounding Field/FieldLabel — a bare
            `InputText` inside one would leave the label unassociated. */}
        <InputText label="Dashboard name" defaultValue="Workload protection" />
      </SectionContent>
    </Section>
  );
}

export const Default: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <WizardActions />
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
        <WizardSteps />
      </WizardHeader>
      <WizardBody>
        <StepContent />
      </WizardBody>
    </Wizard>
  ),
};

// The first step has nothing to go Back to, so per the design brief its
// pairing is [Cancel][Next] — no Back, unlike the middle steps in `Default`.
export const FirstStep: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="secondary">Cancel</Button>
            <Button>Next</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
        <Stepper
          currentStep={1}
          totalSteps={3}
          current="Name the dashboard"
          next="Choose widgets"
        >
          <StepperItem
            variant="current"
            label="Name the dashboard"
            avatar={
              <Avatar
                color="blue"
                className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
              >
                <AvatarFallback>1</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="future"
            label="Choose widgets"
            avatar={
              <Avatar
                color="gray"
                className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
              >
                <AvatarFallback>2</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="future"
            label="Set permissions"
            avatar={
              <Avatar
                color="gray"
                className="[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]"
              >
                <AvatarFallback>3</AvatarFallback>
              </Avatar>
            }
          />
        </Stepper>
      </WizardHeader>
      <WizardBody>
        <StepContent />
      </WizardBody>
    </Wizard>
  ),
};

export const WithoutSubtitle: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <WizardActions />
        </PageHeaderRow>
        <WizardSteps />
      </WizardHeader>
      <WizardBody>
        <StepContent />
      </WizardBody>
    </Wizard>
  ),
};

// A single-step flow drops the stepper entirely and pairs [Cancel][CTA] — the
// same two-button pairing the final step of a multi-step flow uses (see
// LastStep). `Wizard` never forces a stepper; a short multi-step flow can
// choose to omit it too, but this story is the canonical single-step case.
export const WithoutStepper: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="secondary">Cancel</Button>
            <Button>Submit</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
      </WizardHeader>
      <WizardBody>
        <StepContent />
      </WizardBody>
    </Wizard>
  ),
};

// The final step swaps Next for the flow's CTA (its label is the flow's
// action, e.g. "Create dashboard" — never a generic "Submit") and drops Back:
// per the design brief the final step is a two-button [Cancel][CTA] pairing,
// the same as the single-step flow (see WithoutStepper), not a three-button
// state. Which buttons show on which step is the consuming UI block's
// decision, not the kit's — this story just shows the slot.
export const LastStep: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="secondary">Cancel</Button>
            <Button>Create dashboard</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
        <Stepper currentStep={3} totalSteps={3} current="Set permissions">
          <StepperItem
            variant="completed"
            label="Name the dashboard"
            avatar={
              <Avatar color="green" className="[box-shadow:none]">
                <AvatarFallback>1</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="completed"
            label="Choose widgets"
            avatar={
              <Avatar color="green" className="[box-shadow:none]">
                <AvatarFallback>2</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="current"
            label="Set permissions"
            avatar={
              <Avatar
                color="blue"
                className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
              >
                <AvatarFallback>3</AvatarFallback>
              </Avatar>
            }
          />
        </Stepper>
      </WizardHeader>
      <WizardBody>
        <StepContent />
      </WizardBody>
    </Wizard>
  ),
};

// Enough fields to push the body well past the viewport height, so scrolling
// this story demonstrates the one behavior a single short step can't: the
// header staying pinned while the body scrolls underneath it. Three sections,
// per the Figma body-content note (node 11105-6210) — the body's container
// always wraps `Section`s, one per logical group of fields, not a flat field
// list.
function LongStepContent() {
  return (
    <>
      <Section>
        <SectionHeader
          title="Dashboard details"
          description="Name the dashboard and describe its purpose."
          hasDescription
        />
        <SectionContent>
          <InputText
            label="Dashboard name"
            defaultValue="Workload protection"
          />
          <InputText
            label="Description"
            defaultValue="Endpoint coverage across the fleet"
          />
          <InputText label="Owner" defaultValue="Security operations" />
          <InputText label="Tags" defaultValue="protection, endpoints, fleet" />
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader
          title="Data sources"
          description="Pick where the widgets on this dashboard pull their data from."
          hasDescription
        />
        <SectionContent>
          <InputText label="Primary source" defaultValue="Cyber Protection" />
          <InputText
            label="Secondary source"
            defaultValue="Advanced Automation"
          />
          <InputText label="Refresh interval" defaultValue="15 minutes" />
          <InputText label="Time zone" defaultValue="UTC" />
          <InputText label="Retention window" defaultValue="90 days" />
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader
          title="Notifications"
          description="Choose who gets notified when a widget on this dashboard alerts."
          hasDescription
        />
        <SectionContent>
          <InputText
            label="Notification channel"
            defaultValue="#security-alerts"
          />
          <InputText
            label="Escalation contact"
            defaultValue="oncall@acronis.com"
          />
          <InputText label="Digest frequency" defaultValue="Daily" />
          <InputText label="Quiet hours" defaultValue="22:00–07:00" />
        </SectionContent>
      </Section>
    </>
  );
}

// Confirms the mapping this whole component is built on: Figma's
// "TemplateEntity" (node 11098-5825) wraps `RegionNavs` (the app shell's
// sidebar — outside Wizard's scope), `RegionMain`, and `RegionChat`.
// `RegionMain` is exactly `Wizard` — its `containerHeader` slot is
// `WizardHeader` (breadcrumb, title row, stepper) and its `containerBody`
// slot is `WizardBody`. Per the accompanying notes, the header is always
// sticky (node 11101-6205) and the body is a centered, narrower column that
// always wraps a `Section` per content group (node 11105-6210) — this story
// gives the body enough content to prove the header really does stay pinned
// while it scrolls, which a short step's worth of fields can't demonstrate.
export const LongBody: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <WizardActions />
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
        <WizardSteps />
      </WizardHeader>
      <WizardBody>
        <LongStepContent />
      </WizardBody>
    </Wizard>
  ),
};
