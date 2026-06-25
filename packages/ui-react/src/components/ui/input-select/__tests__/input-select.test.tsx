import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectSearch,
  InputSelectSection,
  InputSelectSectionLabel,
  InputSelectStatus,
  InputSelectTrigger,
  InputSelectValue,
} from '../input-select';

function Field(props: React.ComponentProps<typeof InputSelect>) {
  return (
    <InputSelect items={{ apple: 'Apple', banana: 'Banana' }} {...props}>
      <InputSelectField>
        <InputSelectLabel>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectDescription>Pick one</InputSelectDescription>
      </InputSelectField>
      <InputSelectContent>
        <InputSelectItem value="apple">Apple</InputSelectItem>
        <InputSelectItem value="banana">Banana</InputSelectItem>
      </InputSelectContent>
    </InputSelect>
  );
}

describe('InputSelect', () => {
  it('renders a labelled trigger showing the placeholder', () => {
    render(<Field />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Select an option');
  });

  it('renders the description', () => {
    render(<Field />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('appends a required marker without changing the accessible name', () => {
    render(
      <InputSelect>
        <InputSelectLabel required>Fruit</InputSelectLabel>
        <InputSelectTrigger>
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Fruit' })
    ).toBeInTheDocument();
  });

  it('opens, selects an option, and fires onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Field onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onValueChange).toHaveBeenCalledWith('apple', expect.anything());
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent(
      'Apple'
    );
  });

  it('applies the idle input-select token classes to the trigger', () => {
    render(<Field />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveClass(
      'bg-[var(--ui-input-select-global-box-color-idle)]',
      'border-[var(--ui-input-select-normal-box-border-color-idle)]'
    );
  });

  it('takes the error treatment when the trigger is aria-invalid', () => {
    render(
      <InputSelect>
        <InputSelectField>
          <InputSelectTrigger aria-invalid>
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
          <InputSelectError>Required field</InputSelectError>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('supports multiple selection, keeping the popup open', async () => {
    render(
      <InputSelect multiple>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select options" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="banana">Banana</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));
    await userEvent.click(screen.getByRole('option', { name: 'Banana' }));
    // Both options stay reachable — the popup did not close after the first pick.
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
      'data-selected'
    );
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
      'data-selected'
    );
  });

  it('renders a section with a group label and an in-dropdown search', async () => {
    render(
      <InputSelect>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectSearch aria-label="Filter" placeholder="Search" />
          <InputSelectSection>
            <InputSelectSectionLabel>Citrus</InputSelectSectionLabel>
            <InputSelectItem value="lemon">Lemon</InputSelectItem>
          </InputSelectSection>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(screen.getByText('Citrus')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Filter' })).toBeInTheDocument();
  });

  it('renders the empty status', () => {
    render(<InputSelectStatus variant="empty">No data found</InputSelectStatus>);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    render(<Field disabled />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveAttribute('data-disabled');
    await userEvent.click(trigger);
    expect(
      screen.queryByRole('option', { name: 'Apple' })
    ).not.toBeInTheDocument();
  });

  it('forwards the ref to the trigger element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <InputSelect>
        <InputSelectTrigger ref={ref} aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
