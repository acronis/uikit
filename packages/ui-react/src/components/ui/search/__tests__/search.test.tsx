import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Search } from '../search';

describe('Search', () => {
  it('renders a searchbox with the leading magnifier', () => {
    const { container } = render(<Search aria-label="Search" />);
    expect(
      screen.getByRole('searchbox', { name: 'Search' })
    ).toBeInTheDocument();
    // Leading search icon is rendered (decorative svg).
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('shows the placeholder', () => {
    render(<Search aria-label="Search" placeholder="Search table" />);
    expect(screen.getByPlaceholderText('Search table')).toBeInTheDocument();
  });

  it('fires onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<Search aria-label="Search" onChange={onChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('searchbox')).toHaveValue('abc');
  });

  it('reveals a clear button only once there is a value', async () => {
    render(<Search aria-label="Search" />);
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), 'hi');
    expect(
      screen.getByRole('button', { name: 'Clear search' })
    ).toBeInTheDocument();
  });

  it('clears the value and fires onClear when the clear button is pressed', async () => {
    const onClear = vi.fn();
    render(
      <Search aria-label="Search" defaultValue="hello" onClear={onClear} />
    );
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('hello');
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(onClear).toHaveBeenCalledOnce();
    // The clear button hides again once empty.
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument();
  });

  it('applies the idle form token classes to the box', () => {
    const { container } = render(<Search aria-label="Search" />);
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-form-background-idle)]',
      'border-[var(--ui-form-border-idle)]'
    );
  });

  it('does not accept input or show a clear button when disabled', async () => {
    render(<Search aria-label="Search" disabled defaultValue="x" />);
    const input = screen.getByRole('searchbox');
    expect(input).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument();
  });

  it('forwards the ref to the underlying input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Search aria-label="Search" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
