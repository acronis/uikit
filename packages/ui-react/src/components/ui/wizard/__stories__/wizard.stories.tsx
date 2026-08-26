import type { Meta, StoryObj } from '@storybook/react-vite';

import { useWizard, type WizardStep } from '@/hooks';

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

const DASHBOARD_WIZARD_STEPS: WizardStep[] = [
  { id: 'name', label: 'Name the dashboard' },
  { id: 'widgets', label: 'Choose widgets' },
  { id: 'permissions', label: 'Set permissions' },
];

const HOOK_DEMO_STEPS = [
  {
    id: 'name',
    label: 'Name the integration',
    title: 'Name the integration',
    description: 'Give this integration a name your team will recognize.',
  },
  {
    id: 'source',
    label: 'Pick a source',
    title: 'Pick a source',
    description: 'Choose the workload this integration reads its data from.',
  },
  {
    id: 'schedule',
    label: 'Set a schedule',
    title: 'Set a schedule',
    description: 'Decide how often the integration runs and in which window.',
  },
  {
    id: 'filters',
    label: 'Configure filters',
    title: 'Configure filters',
    description: 'Narrow down which records the integration picks up.',
  },
  {
    id: 'destination',
    label: 'Choose a destination',
    title: 'Choose a destination',
    description: 'Point the processed records at a destination system.',
  },
  {
    id: 'notifications',
    label: 'Set notifications',
    title: 'Set notifications',
    description: 'Pick who hears about a failed or delayed run.',
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Review the integration',
    description: 'Check every choice above before the integration goes live.',
  },
  {
    id: 'confirm',
    label: 'Confirm',
    title: 'Confirm and finish',
    description: 'Confirm to create the integration and start the first run.',
  },
] satisfies (WizardStep & { title: string; description: string })[];

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
// `Wizard` components deliberately own no step state or navigation logic (see
// wizard.tsx); `useWizard` is an opt-in hook, and which buttons a step shows
// stays the consuming UI block's decision.
function WizardActions() {
  return (
    <PageHeaderActions>
      <Button variant="secondary">Cancel</Button>
      <Button variant="secondary">Back</Button>
      <Button>Next</Button>
    </PageHeaderActions>
  );
}

// `useWizard` (`@/hooks`) is the opt-in headless companion to these
// presentational components: it owns the step index and derives the `Stepper`
// summary props plus each `StepperItem`'s `variant` and avatar colour/classes,
// so a consumer never hand-maintains three near-identical item blocks per step.
function WizardSteps({ initialStep = 1 }: { initialStep?: number | string }) {
  const wizard = useWizard({ steps: DASHBOARD_WIZARD_STEPS, initialStep });

  return (
    <Stepper
      currentStep={wizard.currentStepNumber}
      totalSteps={wizard.stepCount}
      current={wizard.currentStepLabel}
      // `undefined` on the last step, so the "Next: …" line is left out.
      next={wizard.nextStepLabel}
    >
      {wizard.steps.map((step) => (
        <StepperItem
          key={step.id}
          variant={step.variant}
          label={step.label}
          avatar={
            <Avatar color={step.avatarColor} className={step.avatarClassName}>
              <AvatarFallback>{step.stepNumber}</AvatarFallback>
            </Avatar>
          }
        />
      ))}
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
        <WizardSteps initialStep={0} />
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
        <WizardSteps initialStep={2} />
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

// One `useWizard` instance drives the whole page: the `Stepper` markup is
// inlined here rather than reusing `WizardSteps`, because that component owns
// its own hook instance and so would desync from these buttons.
function WizardHookDemo() {
  const wizard = useWizard({ steps: HOOK_DEMO_STEPS });
  const activeStep = HOOK_DEMO_STEPS[wizard.currentIndex];

  return (
    <Wizard>
      <WizardHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Monitoring</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Integrations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Configure integration</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PageHeaderRow>
          <PageHeaderTitle>Configure integration</PageHeaderTitle>
          <PageHeaderActions>
            <Button
              variant="secondary"
              disabled={wizard.isFirstStep}
              onClick={wizard.goToPreviousStep}
            >
              Back
            </Button>
            {/* `goToNextStep` is already a no-op past the last step, so the
                CTA stays clickable rather than needing its own guard. */}
            <Button onClick={wizard.goToNextStep}>
              {wizard.isLastStep ? 'Finish' : 'Next'}
            </Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <Stepper
          currentStep={wizard.currentStepNumber}
          totalSteps={wizard.stepCount}
          current={wizard.currentStepLabel}
          next={wizard.nextStepLabel}
        >
          {wizard.steps.map((step) => (
            <StepperItem
              key={step.id}
              variant={step.variant}
              label={step.label}
              avatar={
                <Avatar
                  color={step.avatarColor}
                  className={step.avatarClassName}
                >
                  <AvatarFallback>{step.stepNumber}</AvatarFallback>
                </Avatar>
              }
            />
          ))}
        </Stepper>
      </WizardHeader>
      <WizardBody>
        <Section>
          <SectionHeader
            title={activeStep.title}
            description={activeStep.description}
            hasDescription
          />
          <SectionContent>
            <InputText label="Integration name" defaultValue="Nightly export" />
          </SectionContent>
        </Section>
      </WizardBody>
    </Wizard>
  );
}

// The only interactive story here: unlike the static ones above, Back/Next are
// wired to a real `useWizard` instance, so clicking them visibly moves the
// stepper, swaps the body `Section`, and flips Back's disabled state and the
// CTA's label ("Next" → "Finish" on the last of the eight steps).
export const UseWizardHookDemo: Story = {
  render: () => <WizardHookDemo />,
};

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
