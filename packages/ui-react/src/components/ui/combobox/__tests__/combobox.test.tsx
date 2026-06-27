import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../index';

type Item = { value: string; label: string };
const items: Item[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'svelte', label: 'SvelteKit' },
  { value: 'astro', label: 'Astro' },
];

function Demo({
  onValueChange,
}: {
  onValueChange?: (value: Item | null) => void;
}) {
  return (
    <Combobox items={items} onValueChange={onValueChange}>
      <ComboboxInput placeholder="Search framework…" />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item: Item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe('Combobox', () => {
  it('opens and lists all items', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByPlaceholderText('Search framework…'));
    expect(screen.getByRole('option', { name: 'Next.js' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'SvelteKit' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Astro' })).toBeInTheDocument();
  });

  it('filters the list by the typed text', async () => {
    render(<Demo />);
    await userEvent.type(screen.getByPlaceholderText('Search framework…'), 'sv');
    expect(screen.getByRole('option', { name: 'SvelteKit' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Next.js' })).not.toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', async () => {
    render(<Demo />);
    await userEvent.type(screen.getByPlaceholderText('Search framework…'), 'zzz');
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('selects an item and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByPlaceholderText('Search framework…'));
    await userEvent.click(screen.getByRole('option', { name: 'Next.js' }));
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'next' }),
      expect.anything()
    );
  });
});
