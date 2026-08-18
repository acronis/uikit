import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertText,
  AlertTitle,
  type AlertCloseProps,
} from '../index';

describe('Alert', () => {
  it('renders with role="alert" and the default info variant', () => {
    render(<Alert>Heads up</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Heads up');
    expect(alert).toHaveAttribute('data-variant', 'info');
    expect(alert.className).toContain(
      'border-[color:var(--ui-alert-info-border-color)]'
    );
  });

  // Full token names, not a prefix + suffix concatenation: the readiness audit
  // greps this directory for `--ui-*` refs, and a bare prefix reads as a
  // dangling token.
  it.each([
    ['info', '--ui-alert-info-border-color', '--ui-alert-info-left-line'],
    [
      'success',
      '--ui-alert-success-border-color',
      '--ui-alert-success-left-line',
    ],
    [
      'warning',
      '--ui-alert-warning-border-color',
      '--ui-alert-warning-left-line',
    ],
    [
      'critical',
      '--ui-alert-critical-border-color',
      '--ui-alert-critical-left-line',
    ],
    ['danger', '--ui-alert-danger-border-color', '--ui-alert-danger-left-line'],
  ] as const)(
    'wires the %s variant to its own border and status-line tokens',
    (variant, borderToken, lineToken) => {
      render(<Alert variant={variant}>x</Alert>);
      const { className } = screen.getByRole('alert');
      expect(className).toContain(`border-[color:var(${borderToken})]`);
      expect(className).toContain(`before:bg-[var(${lineToken})]`);
    }
  );

  it('carries the neutral surface and status line on every variant', () => {
    render(<Alert variant="danger">x</Alert>);
    const { className } = screen.getByRole('alert');
    expect(className).toContain(
      'bg-[var(--ui-alert-global-container-background)]'
    );
    expect(className).toContain(
      'before:w-[var(--ui-alert-global-container-status-width)]'
    );
    // The line must stay on the leading edge under dir="rtl".
    expect(className).toContain('before:start-[-1px]');
    // The 1px outward bleed is what makes the line cover the border rather than
    // sit beside it, and it only survives if the clip edge is the border box —
    // plain `overflow-clip` clips at the padding box and shaves it to 5px.
    expect(className).toContain('before:-inset-y-px');
    expect(className).toContain('overflow-clip');
    expect(className).toContain('[overflow-clip-margin:border-box]');
  });

  it('renders the icon / content / text / title / description parts', () => {
    render(
      <Alert>
        <AlertIcon />
        <AlertContent>
          <AlertText>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components.</AlertDescription>
          </AlertText>
        </AlertContent>
      </Alert>
    );
    expect(screen.getByText('Heads up!').tagName).toBe('H5');
    expect(screen.getByText('You can add components.').tagName).toBe('P');
    expect(
      screen.getByRole('alert').querySelector('[data-slot="alert-text"]')
    ).toBeInTheDocument();
  });

  it('defaults AlertIcon to the variant status icon', () => {
    const { rerender } = render(
      <Alert variant="success">
        <AlertIcon />
      </Alert>
    );
    const iconBox = () =>
      screen.getByRole('alert').querySelector('[data-slot="alert-icon"]');
    expect(iconBox()?.querySelector('svg')).toBeInTheDocument();

    // A different variant swaps the glyph rather than recoloring one icon.
    const successMarkup = iconBox()?.innerHTML;
    rerender(
      <Alert variant="danger">
        <AlertIcon />
      </Alert>
    );
    expect(iconBox()?.innerHTML).not.toBe(successMarkup);
  });

  it('lets AlertIcon children override the status icon', () => {
    render(
      <Alert variant="warning">
        <AlertIcon>
          <svg data-testid="custom-icon" />
        </AlertIcon>
      </Alert>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders actions inside the content column', () => {
    render(
      <Alert>
        <AlertContent>
          <AlertText>
            <AlertTitle>Title</AlertTitle>
          </AlertText>
          <AlertActions>
            <button type="button">Retry</button>
          </AlertActions>
        </AlertContent>
      </Alert>
    );
    const content = screen
      .getByRole('alert')
      .querySelector('[data-slot="alert-content"]');
    expect(
      content?.querySelector('[data-slot="alert-actions"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('dismisses via AlertClose, which has a localizable accessible name', async () => {
    const onClick = vi.fn();
    render(
      <Alert>
        <AlertClose onClick={onClick} ariaLabel="Cerrar" />
      </Alert>
    );
    const close = screen.getByRole('button', { name: 'Cerrar' });
    await userEvent.click(close);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults the AlertClose accessible name', () => {
    render(
      <Alert>
        <AlertClose />
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  // The spec pins the dismiss control to a ghost ButtonIcon. `variant` and
  // `render` are omitted from AlertCloseProps so a consumer cannot silently
  // override that; this guards the appearance those omissions protect.
  it('pins AlertClose to the ghost ButtonIcon appearance', () => {
    render(
      <Alert>
        <AlertClose />
      </Alert>
    );
    const { className } = screen.getByRole('button', { name: 'Close' });
    // ghost has no container border; secondary would add one.
    expect(className).toContain(
      'bg-[var(--ui-button-icon-global-container-color-idle)]'
    );
    expect(className).not.toContain(
      '--ui-button-icon-secondary-container-border-color-idle'
    );
  });

  // Omitting `aria-label` from the type cannot stop this on its own: TypeScript
  // skips checking hyphenated JSX attributes, so it still compiles. `ariaLabel`
  // stays authoritative because it is pinned after the spread.
  it('keeps ariaLabel authoritative over a native aria-label', () => {
    const sneaky = { 'aria-label': 'Native' } as unknown as AlertCloseProps;
    render(
      <Alert>
        <AlertClose {...sneaky} ariaLabel="Cerrar" />
      </Alert>
    );
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Native' })
    ).not.toBeInTheDocument();
  });

  it('forwards refs on the root and the close button', () => {
    const ref = createRef<HTMLDivElement>();
    const closeRef = createRef<HTMLButtonElement>();
    render(
      <Alert ref={ref}>
        <AlertClose ref={closeRef} />
      </Alert>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(closeRef.current).toBeInstanceOf(HTMLButtonElement);
  });
});
