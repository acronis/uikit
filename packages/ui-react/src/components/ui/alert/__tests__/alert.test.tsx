import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '../index';

describe('Alert', () => {
  it('renders with role="alert" and the default info variant', () => {
    render(<Alert>Heads up</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Heads up');
    expect(alert.className).toContain('bg-[var(--ui-background-status-info)]');
  });

  it('applies the destructive variant (danger tokens)', () => {
    render(<Alert variant="destructive">Error</Alert>);
    expect(screen.getByRole('alert').className).toContain(
      'bg-[var(--ui-background-status-danger)]'
    );
  });

  it('renders the icon / content / title / description parts', () => {
    render(
      <Alert>
        <AlertIcon>
          <svg data-testid="icon" />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components.</AlertDescription>
        </AlertContent>
      </Alert>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Heads up!').tagName).toBe('H5');
    expect(screen.getByText('You can add components.')).toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>x</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
