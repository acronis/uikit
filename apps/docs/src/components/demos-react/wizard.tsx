'use client';

import {
  Avatar,
  AvatarFallback,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  InputText,
  PageHeaderActions,
  PageHeaderRow,
  PageHeaderTitle,
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
  Stepper,
  StepperItem,
  Wizard,
  WizardBody,
  WizardHeader,
  WizardSubtitle,
} from '@acronis-platform/ui-react';

export function WizardDemo() {
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
              <BreadcrumbLink href="#">Dashboards</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeaderRow>
          <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          {/* Which of these shows on a given step is the consuming UI block's
              decision — Wizard only provides the slot. */}
          <PageHeaderActions>
            <Button variant="secondary">Cancel</Button>
            <Button variant="secondary">Back</Button>
            <Button>Next</Button>
          </PageHeaderActions>
        </PageHeaderRow>

        <WizardSubtitle>
          Name the dashboard, pick the widgets it shows, and choose who can see
          it.
        </WizardSubtitle>

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
      </WizardHeader>

      <WizardBody>
        <Section>
          <SectionHeader>
            <SectionTitle>Choose widgets</SectionTitle>
            <SectionDescription>
              Widgets you add here appear on the dashboard in the order you pick
              them.
            </SectionDescription>
          </SectionHeader>
          <SectionContent>
            {/* `InputText` labels itself — no surrounding Field/FieldLabel,
                which would leave the label unassociated. */}
            <InputText
              label="Dashboard name"
              defaultValue="Workload protection"
            />
          </SectionContent>
        </Section>
      </WizardBody>
    </Wizard>
  );
}
