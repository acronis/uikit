import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonGroupItem } from '../../button-group';
import { Timer } from '../timer';

const Icon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M8 0v16M0 8h16" />
  </svg>
);

function renderTimer(props?: Partial<React.ComponentProps<typeof Timer>>) {
  const { value = '12:01:45', children, ...rest } = props ?? {};
  return render(
    <Timer value={value} {...rest}>
      {children ?? (
        <>
          <ButtonGroupItem aria-label="Pause">
            <Icon />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Rename">
            <Icon />
          </ButtonGroupItem>
          <ButtonGroupItem aria-label="Add entry">
            <Icon />
          </ButtonGroupItem>
        </>
      )}
    </Timer>
  );
}

describe('Timer', () => {
  it('renders the value inside a timer live region', () => {
    renderTimer();
    expect(screen.getByRole('timer')).toHaveTextContent('12:01:45');
  });

  it('renders the actions in an inlined, named toolbar', () => {
    renderTimer();
    const toolbar = screen.getByRole('toolbar', { name: 'Timer actions' });
    expect(toolbar).toBeInTheDocument();
    // `inlined`: the Timer container already draws the border and radius, so
    // the nested group must not draw its own.
    expect(toolbar).not.toHaveClass(
      'border-[length:var(--ui-button-group-global-container-border-width)]'
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('uses a caller-supplied label for the action cluster', () => {
    renderTimer({ actionsLabel: 'Acciones del temporizador' });
    expect(
      screen.getByRole('toolbar', { name: 'Acciones del temporizador' })
    ).toBeInTheDocument();
  });

  it('applies the container tokens', () => {
    const { container } = renderTimer();
    expect(container.firstElementChild).toHaveClass(
      'h-[var(--ui-timer-container-height)]',
      'rounded-[var(--ui-timer-container-radius)]',
      'bg-[var(--ui-timer-container-color)]',
      'border-[length:var(--ui-timer-container-border-width)]',
      'border-[color:var(--ui-timer-container-border-color)]',
      // Clips the trailing action's hover fill and inset focus ring to the
      // container radius.
      'overflow-hidden'
    );
  });

  it('applies the readout tokens, including tabular figures', () => {
    renderTimer();
    expect(screen.getByRole('timer')).toHaveClass(
      'ui-timer-value-text-style',
      'px-[var(--ui-timer-content-box-padding-x)]',
      'text-[var(--ui-timer-value-color)]',
      '[font-variant-numeric:var(--ui-timer-value-font-variant-numeric)]'
    );
  });

  it('draws the divider as the readout inline-end border, reset on last child', () => {
    renderTimer();
    // Mirrors Figma, which hangs the divider off the contentBox. `border-e-*`
    // (not `border-r-*`) so it flips under `dir="rtl"`; `last:border-e-0`
    // drops it when the readout stands alone.
    expect(screen.getByRole('timer')).toHaveClass(
      'border-e-[length:var(--ui-timer-content-box-divider-width)]',
      'border-[color:var(--ui-timer-content-box-divider-color)]',
      'last:border-e-0'
    );
  });

  it('renders no toolbar at all without actions', () => {
    render(<Timer value="00:00:00" />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    // The readout is then the last child, so the divider is dropped in CSS.
    expect(screen.getByRole('timer')).toHaveClass('last:border-e-0');
  });

  it('accepts a non-string value', () => {
    render(<Timer value={<span data-testid="parts">01:02</span>} />);
    expect(screen.getByTestId('parts')).toBeInTheDocument();
  });

  it('merges a custom className with the container classes', () => {
    const { container } = renderTimer({ className: 'custom-class' });
    expect(container.firstElementChild).toHaveClass(
      'custom-class',
      'inline-flex'
    );
  });

  it('forwards the ref and passes native div props through', () => {
    const ref = createRef<HTMLDivElement>();
    renderTimer({ ref, id: 'session-timer' });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('id', 'session-timer');
  });

  it('gives the whole action cluster one tab stop, roving with the arrow keys', async () => {
    renderTimer();
    const [pause, rename] = screen.getAllByRole('button');

    await userEvent.tab();
    expect(pause).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(rename).toHaveFocus();
  });

  it('fires an action onClick', async () => {
    const onClick = vi.fn();
    renderTimer({
      children: (
        <ButtonGroupItem aria-label="Pause" onClick={onClick}>
          <Icon />
        </ButtonGroupItem>
      ),
    });
    await userEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
