import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  InputSelectExpander,
  InputSelectRowContent,
  InputSelectSearchField,
  InputSelectSectionLabelView,
  InputSelectSectionView,
} from '../input-select-list';

// These are the presentational pieces of the dropdown list. The whole point of
// splitting them out of `input-select.tsx` is that none of them read Base UI's
// Select context — so each must render standalone, with no `Select.Root`
// ancestor, without throwing.
// `InputSelectRowContent`'s checkbox glyph paints its *checked* appearance
// entirely through Tailwind `group-data-[selected]/item:` modifiers, whose
// selector is `.group\/item[data-selected] &`. So the glyph only ever looks
// checked when the caller's outer row element carries BOTH the `group/item`
// class and a `data-selected` attribute — that pair is the extracted piece's
// contract with whatever hosts it (`InputSelectItem` today, a Popover-hosted
// list later).
//
// Tailwind is not compiled in unit tests, so `getComputedStyle` can't see the
// modifier resolve. Instead we assert the two halves of the contract that the
// DOM does expose: the glyph declares the group-scoped checked classes, and the
// modifier's own scope selector matches an ancestor of the glyph (or doesn't,
// when the caller omits `data-selected`).
const CHECKED_GLYPH_CLASSES = [
  'group-data-[selected]/item:border-[var(--ui-checkbox-checked-box-border-color-idle)]',
  'group-data-[selected]/item:bg-[var(--ui-checkbox-checked-box-color-idle)]',
  'group-data-[selected]/item:text-[var(--ui-checkbox-checked-icon-color-idle)]',
];
const CHECKED_SCOPE_SELECTOR = '.group\\/item[data-selected]';

/** The leading checkbox glyph — the only `aria-hidden` span in a row with no `indent`. */
function checkboxGlyph(container: HTMLElement): HTMLElement {
  const glyph = container.querySelector<HTMLElement>('span[aria-hidden="true"]');
  if (!glyph) throw new Error('expected the multiple-mode checkbox glyph to render');
  return glyph;
}

describe('InputSelectRowContent checked-state contract', () => {
  it('applies the checked styling when the host row supplies group/item + data-selected', () => {
    const { container } = render(
      <div className="group/item" data-selected="">
        <InputSelectRowContent multiple labelSlot={<span>Tenant A</span>} />
      </div>
    );
    const glyph = checkboxGlyph(container);
    expect(glyph).toHaveClass(...CHECKED_GLYPH_CLASSES);
    expect(glyph.closest(CHECKED_SCOPE_SELECTOR)).not.toBeNull();
  });

  it('does not apply the checked styling when the host row omits data-selected', () => {
    const { container } = render(
      <div className="group/item">
        <InputSelectRowContent multiple labelSlot={<span>Tenant A</span>} />
      </div>
    );
    const glyph = checkboxGlyph(container);
    // The declaration is unconditional; what changes is whether its scope
    // selector matches — so the glyph stays visually unchecked here.
    expect(glyph).toHaveClass(...CHECKED_GLYPH_CLASSES);
    expect(glyph.closest(CHECKED_SCOPE_SELECTOR)).toBeNull();
  });

  it('does not apply the checked styling when the host row omits group/item', () => {
    const { container } = render(
      <div data-selected="">
        <InputSelectRowContent multiple labelSlot={<span>Tenant A</span>} />
      </div>
    );
    expect(checkboxGlyph(container).closest(CHECKED_SCOPE_SELECTOR)).toBeNull();
  });
});

describe('input-select list views (standalone, no Select context)', () => {
  it('renders the row content outside any Select context', () => {
    expect(() =>
      render(
        <div>
          <InputSelectRowContent
            multiple
            indent={2}
            icon={<span data-testid="icon" />}
            labelSlot={<span>Tenant A</span>}
            trailingSlot={<span data-testid="trailing" />}
          />
        </div>
      )
    ).not.toThrow();
    expect(screen.getByText('Tenant A')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('renders the section views outside any Select context', () => {
    expect(() =>
      render(
        <InputSelectSectionView data-testid="section">
          <InputSelectSectionLabelView>Recent</InputSelectSectionLabelView>
        </InputSelectSectionView>
      )
    ).not.toThrow();
    expect(screen.getByTestId('section')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
  });

  it('renders the expander outside any Select context and toggles', () => {
    const onToggle = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <InputSelectExpander ref={ref} expanded={false} onToggle={onToggle}>
        Group
      </InputSelectExpander>
    );
    const button = screen.getByRole('button', { name: 'Group' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(ref.current).toBe(button);
    button.click();
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders the search field as a plain controlled input', () => {
    const onChange = vi.fn();
    render(
      <InputSelectSearchField aria-label="Filter" value="abc" onChange={onChange} />
    );
    expect(screen.getByRole('searchbox', { name: 'Filter' })).toHaveValue('abc');
  });
});
