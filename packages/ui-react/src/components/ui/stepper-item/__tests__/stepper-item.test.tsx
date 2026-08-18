import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
      'bg-[var(--ui-background-surface-active)]',
      'text-[var(--ui-text-on-surface-primary)]',
      'gap-[var(--ui-gap-8)]',
      'px-[var(--ui-gap-16)]',
      'py-[var(--ui-gap-8)]',
      'rounded-lg'
    );
  });

  it('keeps the current variant highlighted regardless of state', () => {
    for (const state of ['idle', 'hover', 'active'] as const) {
      const { container } = render(
        <StepperItem avatar={avatar} label="Step" state={state} />
      );
      expect(container.firstElementChild).toHaveClass(
        'bg-[var(--ui-background-surface-active)]'
      );
    }
  });

  it('paints a completed step only through its interaction state', () => {
    const { container: idle } = render(
      <StepperItem avatar={avatar} label="Step" variant="completed" />
    );
    expect(idle.firstElementChild).toHaveClass(
      'text-[var(--ui-text-on-surface-primary)]'
    );
    expect(idle.firstElementChild).not.toHaveClass(
      'bg-[var(--ui-background-surface-hover)]',
      'bg-[var(--ui-background-surface-active)]'
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
      'bg-[var(--ui-background-surface-hover)]'
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
      'bg-[var(--ui-background-surface-active)]'
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
    expect(root).toHaveClass(
      'text-[var(--ui-text-on-surface-disabled)]',
      'pointer-events-none'
    );
    expect(root).not.toHaveClass('bg-[var(--ui-background-surface-hover)]');
  });

  it('omits aria-disabled unless the step is in the future', () => {
    const { container } = render(
      <StepperItem avatar={avatar} label="Step" variant="completed" />
    );
    expect(container.firstElementChild).not.toHaveAttribute('aria-disabled');
  });

  it('draws the connecting line only when asked, as a decorative element', () => {
    const { container: without } = render(
      <StepperItem avatar={avatar} label="Step" />
    );
    expect(
      without.querySelector('[data-slot="stepper-item-connecting-line"]')
    ).toBeNull();

    const { container: with_ } = render(
      <StepperItem avatar={avatar} label="Step" connectingLine />
    );
    const line = with_.querySelector(
      '[data-slot="stepper-item-connecting-line"]'
    );
    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute('aria-hidden');
    // Logical, so it mirrors under dir="rtl".
    expect(line).toHaveClass(
      'start-full',
      'border-[var(--ui-border-on-surface-border)]'
    );
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
    expect(button).toHaveClass('text-[var(--ui-text-on-surface-primary)]');
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
