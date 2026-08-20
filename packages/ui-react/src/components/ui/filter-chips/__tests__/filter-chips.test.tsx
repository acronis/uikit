import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from '../../chip/chip';
import {
  FilterChips,
  FilterChipsList,
  FilterChipsReset,
} from '../filter-chips';

describe('FilterChips', () => {
  it('renders its chips and the reset action', () => {
    render(
      <FilterChips>
        <FilterChipsList>
          <Chip>Type: Server</Chip>
          <Chip>OS: Linux</Chip>
          <FilterChipsReset />
        </FilterChipsList>
      </FilterChips>
    );
    expect(screen.getByText('Type: Server')).toBeInTheDocument();
    expect(screen.getByText('OS: Linux')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reset filters' })
    ).toBeInTheDocument();
  });

  it('exposes the row as a group named for the applied filters', () => {
    render(<FilterChips />);
    expect(
      screen.getByRole('group', { name: 'Applied filters' })
    ).toBeInTheDocument();
  });

  it('overrides the group name via ariaLabel', () => {
    render(<FilterChips ariaLabel="Filtros aplicados" />);
    expect(
      screen.getByRole('group', { name: 'Filtros aplicados' })
    ).toBeInTheDocument();
  });

  it('applies the root gap from the design token', () => {
    render(<FilterChips data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass(
      'flex',
      'items-center',
      'gap-[var(--ui-gap-16)]'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(<FilterChips className="custom-class" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-class', 'flex');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterChips ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('composes with another element via the render prop', () => {
    render(<FilterChips data-testid="root" render={<section />} />);
    expect(screen.getByTestId('root').tagName).toBe('SECTION');
  });
});

describe('FilterChipsList', () => {
  it('wraps its items with the 8px inter-chip gap', () => {
    render(<FilterChipsList data-testid="list" />);
    expect(screen.getByTestId('list')).toHaveClass(
      'flex',
      'flex-wrap',
      'items-center',
      'content-center',
      'gap-[var(--ui-gap-8)]'
    );
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterChipsList ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('FilterChipsReset', () => {
  it('renders a ghost button labelled "Reset filters" by default', () => {
    render(<FilterChipsReset />);
    const button = screen.getByRole('button', { name: 'Reset filters' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass(
      'text-[var(--ui-button-ghost-label-color-idle)]'
    );
  });

  it('accepts a localized label through children', () => {
    render(<FilterChipsReset>Restablecer filtros</FilterChipsReset>);
    expect(
      screen.getByRole('button', { name: 'Restablecer filtros' })
    ).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<FilterChipsReset onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<FilterChipsReset disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards the ref to the underlying button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FilterChipsReset ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(<FilterChipsReset render={<a href="#reset" />} />);
    expect(screen.getByRole('link', { name: 'Reset filters' })).toHaveAttribute(
      'href',
      '#reset'
    );
  });
});

describe('FilterChips composition', () => {
  it('removes a single chip and resets them all', async () => {
    const onRemove = vi.fn();
    const onReset = vi.fn();
    render(
      <FilterChips>
        <FilterChipsList>
          <Chip onRemove={onRemove} removeLabel="Remove type filter">
            Type: Server
          </Chip>
          <FilterChipsReset onClick={onReset} />
        </FilterChipsList>
      </FilterChips>
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove type filter' })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset filters' })
    );
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
