// Figma Code Connect — status: COMPLETE
// Mapped to the "RegionMain" full-page wizard frame (ui-react file, node
// 10511-61418).
//
// There are no `props` to map, and that is the design rather than an omission:
// the Figma node is a page-template *frame*, not a variant component set — it
// exposes no variant/boolean/text properties, and every visible string in it
// (breadcrumb trail, title, button labels, subtitle, step names) belongs to one
// of the composed child components, which carry their own Code Connect
// mappings. So the whole mapping is the `example` composition, showing how the
// existing parts assemble into the wizard skeleton.
import figma from '@figma/code-connect';

import { Avatar, AvatarFallback } from '../avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';
import { Button } from '../button';
import { PageHeaderActions, PageHeaderRow, PageHeaderTitle } from '../page-header';
import { Section, SectionContent, SectionHeader } from '../section';
import { Stepper } from '../stepper';
import { StepperItem } from '../stepper-item';
import { Wizard, WizardBody, WizardHeader, WizardSubtitle } from './wizard';

figma.connect(
  Wizard,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=10511-61418',
  {
    example: () => (
      <Wizard>
        <WizardHeader>
          <Breadcrumb>
            <BreadcrumbList>
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
            {/* Which of Cancel / Back / Next / Submit shows on a given step is
                the consuming UI block's decision — Wizard only owns the slot. */}
            <PageHeaderActions>
              <Button variant="secondary">Cancel</Button>
              <Button variant="secondary">Back</Button>
              <Button>Next</Button>
            </PageHeaderActions>
          </PageHeaderRow>
          <WizardSubtitle>
            Name the dashboard, pick its widgets, and choose who can see it.
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
        </WizardHeader>
        <WizardBody>
          <Section>
            <SectionHeader title="Choose widgets" />
            <SectionContent>{/* step fields */}</SectionContent>
          </Section>
        </WizardBody>
      </Wizard>
    ),
  }
);
