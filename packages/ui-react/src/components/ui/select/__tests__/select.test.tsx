import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

function Basic(props: React.ComponentProps<typeof Select>) {
  return (
    <Select items={{ apple: 'Apple', banana: 'Banana' }} {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders a trigger showing the placeholder', () => {
    render(<Basic />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Select an option');
  });

  it('applies the idle form token classes to the trigger', () => {
    render(<Basic />);
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveClass(
      'bg-[var(--ui-form-background-idle)]',
      'border-[var(--ui-form-border-idle)]'
    );
  });

  it('opens the listbox and selects an option, firing onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.click(screen.getByRole('option', { name: 'Apple' }));

    expect(onValueChange).toHaveBeenCalledWith('apple', expect.anything());
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent(
      'Apple'
    );
  });

  it('renders the resolved label for a default value while closed', () => {
    render(
      <Select items={{ apple: 'Apple', banana: 'Banana' }} defaultValue="apple">
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent(
      'Apple'
    );
  });

  it('does not open when disabled', async () => {
    render(<Basic disabled />);
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
      <Select>
        <SelectTrigger ref={ref} aria-label="Fruit">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
