import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../stepper-item';

const avatar = (
  <Avatar data-testid="avatar">
    <AvatarFallback>1</AvatarFallback>
  </Avatar>
);

describe('StepperItem', () => {
  it('renders the consumer avatar and the label, in that order', () => {
    const { container } = render(
      <StepperItem avatar={avatar} label="Choose a plan" />
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('data-slot', 'stepper-item');
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('Choose a plan')).toBeInTheDocument();
    expect(root.firstElementChild).toBe(screen.getByTestId('avatar'));
  });

  it('renders without a label', () => {
    const { container } = render(<StepperItem avatar={avatar} />);
    expect(container.firstElementChild?.childElementCount).toBe(1);
  });

  it('defaults to the current variant in its idle state', () => {
    const { container } = render(<StepperItem avatar={avatar} label="Step" />);
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('data-variant', 'current');
    expect(root).toHaveAttribute('data-state', 'idle');
    expect(root).toHaveClass(
      'border-[length:var(--ui-stepper-item-current-container-border-width)]',
      'border-[var(--ui-stepper-item-current-container-border-color)]',
      'bg-[var(--ui-stepper-item-current-container-color)]',
      'text-[var(--ui-stepper-item-current-label-color)]',
      'gap-[var(--ui-stepper-item-global-container-gap)]',
      'ps-[var(--ui-stepper-item-global-container-padding-l)]',
      'pe-[var(--ui-stepper-item-global-container-padding-r)]',
      'py-[var(--ui-stepper-item-global-container-padding-y)]',
      'rounded-[var(--ui-stepper-item-global-container-border-radius)]'
    );
  });

  it('keeps the current variant highlighted regardless of state', () => {
    for (const state of ['idle', 'hover', 'active', 'focus'] as const) {
      const { container } = render(
        <StepperItem avatar={avatar} label="Step" state={state} />
      );
      expect(container.firstElementChild).toHaveClass(
        'bg-[var(--ui-stepper-item-current-container-color)]'
      );
    }
  });

  it('paints a completed step only through its interaction state', () => {
    const { container: idle } = render(
      <StepperItem avatar={avatar} label="Step" variant="completed" />
    );
    expect(idle.firstElementChild).toHaveClass(
      'text-[var(--ui-stepper-item-completed-label-color)]'
    );
    expect(idle.firstElementChild).not.toHaveClass(
      'bg-[var(--ui-stepper-item-completed-container-color-hover)]',
      'bg-[var(--ui-stepper-item-completed-container-color-active)]',
      'ring-[var(--ui-stepper-item-completed-container-color-focus-ring)]'
    );

    const { container: hover } = render(
      <StepperItem
        avatar={avatar}
        label="Step"
        variant="completed"
        state="hover"
      />
    );
    expect(hover.firstElementChild).toHaveClass(
      'bg-[var(--ui-stepper-item-completed-container-color-hover)]'
    );

    const { container: active } = render(
      <StepperItem
        avatar={avatar}
        label="Step"
        variant="completed"
        state="active"
      />
    );
    expect(active.firstElementChild).toHaveClass(
      'bg-[var(--ui-stepper-item-completed-container-color-active)]'
    );

    const { container: focus } = render(
      <StepperItem
        avatar={avatar}
        label="Step"
        variant="completed"
        state="focus"
      />
    );
    expect(focus.firstElementChild).toHaveClass(
      'ring-[3px]',
      'ring-[var(--ui-stepper-item-completed-container-color-focus-ring)]'
    );
  });

  it('renders a future step disabled and non-interactive whatever the state', () => {
    const { container } = render(
      <StepperItem
        avatar={avatar}
        label="Step"
        variant="future"
        state="hover"
      />
    );
    const root = container.firstElementChild!;

    expect(root).toHaveAttribute('aria-disabled', 'true');
    // `aria-disabled` on a role-less <div> is not announced (ARIA 1.2), so the
    // default rendering carries an explicit role — as BreadcrumbPage does.
    expect(root).toHaveAttribute('role', 'link');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(root).toHaveClass(
      'text-[var(--ui-stepper-item-future-label-color)]',
      'pointer-events-none'
    );
    expect(root).not.toHaveClass(
      'bg-[var(--ui-stepper-item-completed-container-color-hover)]'
    );
  });

  it('still reports the state it was given on a future step', () => {
    // `state` is never dropped from the contract, even where it paints nothing,
    // so a consumer can key off the data attribute.
    for (const state of ['idle', 'hover', 'active', 'focus'] as const) {
      const { container } = render(
        <StepperItem
          avatar={avatar}
          label="Step"
          variant="future"
          state={state}
        />
      );
      const root = container.firstElementChild!;
      expect(root).toHaveAttribute('data-state', state);
      expect(root).toHaveAttribute('data-variant', 'future');
    }
  });

  it('keeps a future step out of the tab order even when composed as a button', async () => {
    const onClick = vi.fn();
    render(
      <>
        <button type="button">before</button>
        <StepperItem
          render={<button type="button" onClick={onClick} />}
          avatar={avatar}
          label="Confirm and pay"
          variant="future"
        />
      </>
    );

    const step = screen.getByRole('button', { name: /confirm and pay/i });
    expect(step).toHaveAttribute('tabindex', '-1');
    // The composed element brings its own role, so the `role="link"` the default
    // <div> needs is deliberately not forced onto it.
    expect(step).not.toHaveAttribute('role');
    expect(step).toHaveAttribute('aria-disabled', 'true');
    // The pointer guarantee is CSS; no stylesheet is applied in this environment,
    // so it is asserted as the class that produces it.
    expect(step).toHaveClass('pointer-events-none');

    // Tab cannot reach it, so Enter/Space can never activate it either.
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'before' })).toHaveFocus();
    await userEvent.tab();
    expect(step).not.toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('carries the library focus ring so a composed control is never focused invisibly', () => {
    render(
      <StepperItem
        render={<button type="button" />}
        avatar={avatar}
        label="Back to step 1"
        variant="completed"
      />
    );
    expect(screen.getByRole('button')).toHaveClass(
      'outline-none',
      'focus-visible:ring-[3px]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
  });

  it('renders children last, after the label', () => {
    const { container } = render(
      <StepperItem avatar={avatar} label="Choose a plan">
        <span data-testid="extra">extra</span>
      </StepperItem>
    );

    const slots = Array.from(container.firstElementChild!.children);
    expect(slots).toHaveLength(3);
    expect(slots[0]).toBe(screen.getByTestId('avatar'));
    expect(slots[1]).toHaveTextContent('Choose a plan');
    expect(slots[2]).toBe(screen.getByTestId('extra'));
  });

  it('omits aria-disabled unless the step is in the future', () => {
    const { container } = render(
      <StepperItem avatar={avatar} label="Step" variant="completed" />
    );
    expect(container.firstElementChild).not.toHaveAttribute('aria-disabled');
  });

  it('composes into another element through the render prop', () => {
    render(
      <StepperItem
        render={<button type="button" />}
        avatar={avatar}
        label="Back to step 1"
        variant="completed"
      />
    );
    const button = screen.getByRole('button', { name: /back to step 1/i });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass(
      'text-[var(--ui-stepper-item-completed-label-color)]'
    );
  });

  it('merges a consumer className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <StepperItem ref={ref} avatar={avatar} label="Step" className="w-64" />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstElementChild).toHaveClass('w-64');
  });
});
