import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../../stepper-item';
import { Stepper } from '../stepper';

const items = (
  <>
    <StepperItem
      variant="completed"
      label="Create an account"
      avatar={
        <Avatar color="green">
          <AvatarFallback>1</AvatarFallback>
        </Avatar>
      }
    />
    <StepperItem
      variant="current"
      label="Choose a plan"
      avatar={
        <Avatar color="blue">
          <AvatarFallback>2</AvatarFallback>
        </Avatar>
      }
    />
  </>
);

const base = {
  currentStep: 3,
  totalSteps: 5,
  current: 'name of the current step',
  next: 'name of the next step',
};

const summaryLine = (container: HTMLElement, slot: string) =>
  container.querySelector<HTMLElement>(`[data-slot="stepper-${slot}-line"]`);

describe('Stepper', () => {
  it('renders both layouts at once — which one shows is a CSS media query', () => {
    // jsdom evaluates no media query, so the assertion here is precisely that
    // both subtrees exist. In a browser, `lg:hidden` / `hidden lg:flex` reduce
    // that to exactly one visible (and one `display:none`, a11y-invisible) tree.
    const { container } = render(<Stepper {...base}>{items}</Stepper>);

    const summary = container.querySelector('[data-slot="stepper-summary"]')!;
    const row = container.querySelector('[data-slot="stepper-items"]')!;

    expect(summary).toBeInTheDocument();
    expect(row).toBeInTheDocument();
    expect(summary).toHaveClass('lg:hidden');
    expect(row).toHaveClass('hidden', 'lg:flex');

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Choose a plan')).toBeInTheDocument();
    expect(summaryLine(container, 'current')).toHaveTextContent(
      'Step 3 of 5: name of the current step'
    );
  });

  it('puts the StepperItem children in the row, not the summary', () => {
    const { container } = render(<Stepper {...base}>{items}</Stepper>);
    const row = container.querySelector('[data-slot="stepper-items"]')!;

    expect(row.querySelectorAll('[data-slot="stepper-item"]')).toHaveLength(2);
    expect(
      container
        .querySelector('[data-slot="stepper-summary"]')!
        .querySelector('[data-slot="stepper-item"]')
    ).toBeNull();
  });

  it('renders the "Next:" line when a next step is supplied', () => {
    const { container } = render(<Stepper {...base} />);
    expect(summaryLine(container, 'next')).toHaveTextContent(
      'Next: name of the next step'
    );
  });

  it('omits the "Next:" line entirely on the last step', () => {
    const { container } = render(
      <Stepper currentStep={5} totalSteps={5} current="Confirm and pay" />
    );

    expect(summaryLine(container, 'next')).toBeNull();
    expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
    expect(summaryLine(container, 'current')).toHaveTextContent(
      'Step 5 of 5: Confirm and pay'
    );
  });

  it('lets every self-rendered label be overridden for translation', () => {
    const { container } = render(
      <Stepper
        {...base}
        stepLabel="Étape"
        ofLabel="sur"
        nextLabel="Suivante :"
        separatorLabel=" : "
      />
    );

    expect(summaryLine(container, 'current')).toHaveTextContent(
      'Étape 3 sur 5 : name of the current step'
    );
    expect(summaryLine(container, 'next')).toHaveTextContent(
      'Suivante : name of the next step'
    );
  });

  it('lets the counter/name separator be overridden on its own', () => {
    const { container: byDefault } = render(<Stepper {...base} />);
    expect(
      summaryLine(byDefault, 'current')!.firstElementChild
    ).toHaveTextContent(/5:$/);

    const { container: overridden } = render(
      <Stepper {...base} separatorLabel=" — " />
    );
    expect(summaryLine(overridden, 'current')).toHaveTextContent(
      'Step 3 of 5 — name of the current step'
    );
  });

  it('lays the item row out as a wrapping, top-packed row with the design gap', () => {
    const { container } = render(<Stepper {...base}>{items}</Stepper>);
    expect(container.querySelector('[data-slot="stepper-items"]')).toHaveClass(
      'gap-[var(--ui-gap-8)]',
      'flex-wrap',
      'content-start',
      'items-start'
    );
  });

  it('colors the generated prefixes and the step names apart', () => {
    const { container } = render(<Stepper {...base} />);

    const [prefix, name] = Array.from(
      summaryLine(container, 'current')!.children
    );
    expect(prefix).toHaveClass('text-[var(--ui-text-on-surface-secondary)]');
    expect(name).toHaveClass('text-[var(--ui-text-on-surface-primary)]');
  });

  it('merges a consumer className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Stepper {...base} ref={ref} className="px-6" data-testid="stepper" />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstElementChild).toHaveClass('w-full', 'px-6');
    expect(container.firstElementChild).toHaveAttribute('data-slot', 'stepper');
    expect(screen.getByTestId('stepper')).toBe(container.firstElementChild);
  });
});
