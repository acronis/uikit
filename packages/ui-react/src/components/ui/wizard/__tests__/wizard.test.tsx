import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback } from '../../avatar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../../breadcrumb';
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
import { Wizard, WizardBody, WizardHeader, WizardSubtitle } from '../index';

describe('Wizard', () => {
  it('renders the root as a full-height column', () => {
    const { container } = render(<Wizard>content</Wizard>);
    const root = container.querySelector('[data-slot="wizard"]');

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('flex', 'h-full', 'w-full', 'flex-col');
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Wizard className="bg-red-500" />);

    expect(container.querySelector('[data-slot="wizard"]')).toHaveClass(
      'bg-red-500',
      'flex-col'
    );
  });

  it('forwards the root ref and native attributes', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Wizard ref={ref} id="create-dashboard" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('id', 'create-dashboard');
  });

  describe('WizardHeader', () => {
    it('is sticky and carries the surface, divider, padding and gap tokens', () => {
      const { container } = render(<WizardHeader>header</WizardHeader>);
      const header = container.querySelector('[data-slot="wizard-header"]');

      expect(header).toHaveClass(
        'sticky',
        'top-0',
        'bg-[var(--ui-background-surface-secondary)]',
        'border-[var(--ui-border-on-surface-divider)]',
        'p-[var(--ui-gap-16)]',
        'gap-[var(--ui-gap-12)]'
      );
    });

    it('is not a banner landmark, so it can nest inside a page that has one', () => {
      const { container } = render(<WizardHeader>header</WizardHeader>);

      expect(
        container.querySelector('[data-slot="wizard-header"]')
      ).not.toHaveAttribute('role');
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    });

    it('forwards its ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<WizardHeader ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('WizardSubtitle', () => {
    it('renders a muted paragraph of consumer text', () => {
      render(<WizardSubtitle>Pick the widgets to include.</WizardSubtitle>);
      const subtitle = screen.getByText('Pick the widgets to include.');

      expect(subtitle.tagName).toBe('P');
      expect(subtitle).toHaveAttribute('data-slot', 'wizard-subtitle');
      expect(subtitle).toHaveClass('text-sm', 'leading-6', 'text-muted-foreground');
    });

    it('forwards its ref', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<WizardSubtitle ref={ref}>Subtitle</WizardSubtitle>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('WizardBody', () => {
    it('caps the content column at 1024px', () => {
      const { container } = render(<WizardBody>body</WizardBody>);

      expect(container.querySelector('[data-slot="wizard-body"]')).toHaveClass(
        'max-w-[1024px]',
        'w-full',
        'flex-col',
        'pb-[var(--ui-gap-16)]'
      );
    });

    it('renders a Section as its content', () => {
      render(
        <WizardBody>
          <Section>
            <SectionHeader title="General" />
            <SectionContent>Fields</SectionContent>
          </Section>
        </WizardBody>
      );

      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Fields')).toBeInTheDocument();
    });

    // A step's inputs must stay labelled. `InputText` wires its own label to the
    // input's id, so it is used bare — wrapping one in `Field`/`FieldLabel`
    // instead leaves the label unassociated (Base UI's `Field.Label` only
    // targets a `FieldControl`), which Storybook's a11y addon flags.
    it('keeps a step input labelled', () => {
      render(
        <WizardBody>
          <Section>
            <SectionContent>
              <InputText label="Dashboard name" defaultValue="Untitled" />
            </SectionContent>
          </Section>
        </WizardBody>
      );

      expect(screen.getByLabelText('Dashboard name')).toHaveValue('Untitled');
    });

    it('forwards its ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<WizardBody ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  it('composes breadcrumb, title row, subtitle, stepper and body in order', () => {
    const { container } = render(
      <Wizard>
        <WizardHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Create dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <PageHeaderRow>
            <PageHeaderTitle>Create dashboard</PageHeaderTitle>
            <PageHeaderActions>
              <Button variant="secondary">Cancel</Button>
              <Button>Next</Button>
            </PageHeaderActions>
          </PageHeaderRow>
          <WizardSubtitle>Two steps to a new dashboard.</WizardSubtitle>
          <Stepper currentStep={1} totalSteps={2} current="Details" next="Widgets">
            <StepperItem
              variant="current"
              label="Details"
              avatar={
                <Avatar
                  color="blue"
                  className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"
                >
                  <AvatarFallback>1</AvatarFallback>
                </Avatar>
              }
            />
          </Stepper>
        </WizardHeader>
        <WizardBody>
          <Section>
            <SectionHeader title="Details" />
          </Section>
        </WizardBody>
      </Wizard>
    );

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Create dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('Two steps to a new dashboard.')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stepper"]')).toBeInTheDocument();

    const slots = Array.from(
      container.querySelectorAll('[data-slot]')
    ).map((el) => el.getAttribute('data-slot'));
    expect(slots.indexOf('wizard-header')).toBeLessThan(
      slots.indexOf('wizard-body')
    );
    expect(slots.indexOf('wizard-subtitle')).toBeLessThan(
      slots.indexOf('stepper')
    );
  });

  it('renders without a stepper — short wizards omit it entirely', () => {
    const { container } = render(
      <Wizard>
        <WizardHeader>
          <PageHeaderRow>
            <PageHeaderTitle>Create dashboard</PageHeaderTitle>
          </PageHeaderRow>
        </WizardHeader>
        <WizardBody>
          <Section>
            <SectionHeader title="Details" />
          </Section>
        </WizardBody>
      </Wizard>
    );

    expect(container.querySelector('[data-slot="stepper"]')).toBeNull();
    expect(container.querySelector('[data-slot="wizard-body"]')).toBeInTheDocument();
  });

  it('renders no self-generated text — every string comes from the consumer', () => {
    const { container } = render(
      <Wizard>
        <WizardHeader />
        <WizardBody />
      </Wizard>
    );

    expect(container.textContent).toBe('');
  });

  it('uses no physical directional utilities, so it mirrors under dir="rtl"', () => {
    const { container } = render(
      <Wizard>
        <WizardHeader />
        <WizardSubtitle>Subtitle</WizardSubtitle>
        <WizardBody />
      </Wizard>
    );

    const classNames = Array.from(container.querySelectorAll('*'))
      .map((el) => el.className)
      .join(' ');

    expect(classNames).not.toMatch(/(^|[\s:])(ml|mr|pl|pr|left|right)-/);
  });
});
