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
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '../../section';
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
          <Avatar color="green">
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="current"
        label="Choose widgets"
        avatar={
          <Avatar color="blue">
            <AvatarFallback>2</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="future"
        label="Set permissions"
        avatar={
          <Avatar color="gray">
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
      <SectionHeader>
        <SectionTitle>Choose widgets</SectionTitle>
        <SectionDescription>
          Widgets you add here appear on the dashboard in the order you pick them.
        </SectionDescription>
      </SectionHeader>
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

// A two- or three-step flow may drop the stepper entirely — the design leaves
// that to the flow, so `Wizard` never forces one.
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

// The last step swaps Next for Submit. Which buttons show on which step is the
// consuming UI block's decision, not the kit's — this story just shows the slot.
export const LastStep: Story = {
  render: () => (
    <Wizard>
      <WizardHeader>
        <WizardBreadcrumb />
        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          <PageHeaderActions>
            <Button variant="secondary">Cancel</Button>
            <Button variant="secondary">Back</Button>
            <Button>Submit</Button>
          </PageHeaderActions>
        </PageHeaderRow>
        <WizardSubtitle>{SUBTITLE}</WizardSubtitle>
        <Stepper
          currentStep={3}
          totalSteps={3}
          current="Set permissions"
        >
          <StepperItem
            variant="completed"
            label="Name the dashboard"
            avatar={
              <Avatar color="green">
                <AvatarFallback>1</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="completed"
            label="Choose widgets"
            avatar={
              <Avatar color="green">
                <AvatarFallback>2</AvatarFallback>
              </Avatar>
            }
          />
          <StepperItem
            variant="current"
            label="Set permissions"
            avatar={
              <Avatar color="blue">
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
