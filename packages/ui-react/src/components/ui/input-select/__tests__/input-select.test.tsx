import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  InputSelect,
  InputSelectContent,
  InputSelectDescription,
  InputSelectError,
  InputSelectExpander,
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

  it('indents nested items by the Figma nesting width (16 / 40 / 64 for levels 1–3)', async () => {
    render(
      <InputSelect>
        <InputSelectTrigger aria-label="Tenant">
          <InputSelectValue placeholder="Select" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectItem value="root">Root</InputSelectItem>
          <InputSelectItem value="child" indent={3}>
            Child
          </InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Tenant' }));
    const child = screen.getByRole('option', { name: 'Child' });
    expect(child.querySelector('[aria-hidden="true"]')).toHaveStyle({
      minWidth: '64px',
    });
    // An un-indented item reserves no nesting spacer.
    const root = screen.getByRole('option', { name: 'Root' });
    expect(root.querySelector('[aria-hidden="true"]')).toBeNull();
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

describe('InputSelectExpander', () => {
  it('reflects the expanded state and toggles on click', async () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <InputSelectExpander expanded={false} onToggle={onToggle}>
        DataBridge Systems
      </InputSelectExpander>
    );
    const button = screen.getByRole('button', { name: 'DataBridge Systems' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(
      <InputSelectExpander expanded onToggle={onToggle}>
        DataBridge Systems
      </InputSelectExpander>
    );
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it.each([
    [undefined, '16px'],
    [1, '16px'],
    [2, '40px'],
    [3, '64px'],
  ])(
    'tucks the chevron into a %s-indent nesting spacer of %s',
    (indent, expected) => {
      render(
        <InputSelectExpander expanded={false} onToggle={() => {}} indent={indent}>
          Node
        </InputSelectExpander>
      );
      const button = screen.getByRole('button', { name: 'Node' });
      expect(button.firstElementChild).toHaveStyle({ minWidth: expected });
    }
  );
});

describe('InputSelect in-dropdown search', () => {
  function SearchableSelect() {
    return (
      <InputSelect>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectSearch aria-label="Filter" placeholder="Search" />
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="banana">Banana</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
  }

  it('shows the typed query and filters items to matches', async () => {
    render(<SearchableSelect />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const search = screen.getByRole('searchbox', { name: 'Filter' });
    await userEvent.type(search, 'ban');
    // The typed text is reflected in the field (Base UI no longer swallows keys).
    expect(search).toHaveValue('ban');
    // Non-matching rows hide themselves; matches stay.
    expect(screen.getByRole('option', { name: 'Banana' })).toBeVisible();
    // Apple hides (kept mounted, so still queryable by text) instead of unmounting.
    expect(screen.getByText('Apple').closest('[role="option"]')).not.toBeVisible();
  });

  it('follows an externally controlled value and re-syncs when it changes outside onChange', async () => {
    function ControlledSearchableSelect({
      query,
      onChange,
    }: {
      query: string;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }) {
      return (
        <InputSelect>
          <InputSelectTrigger aria-label="Fruit">
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
          <InputSelectContent>
            <InputSelectSearch aria-label="Filter" value={query} onChange={onChange} />
            <InputSelectItem value="apple">Apple</InputSelectItem>
            <InputSelectItem value="banana">Banana</InputSelectItem>
          </InputSelectContent>
        </InputSelect>
      );
    }

    const onChange = vi.fn();
    const { rerender } = render(
      <ControlledSearchableSelect query="ban" onChange={onChange} />
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const search = screen.getByRole('searchbox', { name: 'Filter' });
    // The external value drives both the box and the internal filter items match against.
    expect(search).toHaveValue('ban');
    expect(screen.getByText('Apple').closest('[role="option"]')).not.toBeVisible();
    // A prop-driven reset (e.g. a consumer "clear" button) fires no onChange, yet
    // the filter must still clear so Apple reappears — the desync this guards against.
    rerender(<ControlledSearchableSelect query="" onChange={onChange} />);
    expect(search).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Apple' })).toBeVisible();
  });

  it('keeps a non-string-children item visible while filtering, unless textValue is given', async () => {
    render(
      <InputSelect>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectSearch aria-label="Filter" placeholder="Search" />
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="jsx">
            <span>Custom</span>
          </InputSelectItem>
          <InputSelectItem value="labelled" textValue="Cherry">
            <span>Cherry node</span>
          </InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Filter' }), 'zzz');
    // Apple has a string label that doesn't match → hides.
    expect(screen.getByText('Apple').closest('[role="option"]')).not.toBeVisible();
    // JSX children with no textValue → no text to match, so it degrades to visible.
    expect(screen.getByText('Custom').closest('[role="option"]')).toBeVisible();
    // JSX children WITH textValue match against that text → hides like a string label.
    expect(
      screen.getByText('Cherry node').closest('[role="option"]')
    ).not.toBeVisible();
  });

  it('drops filtered-out items from the accessibility tree while keeping them mounted', async () => {
    render(
      <InputSelect>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectSearch aria-label="Filter" placeholder="Search" />
          <InputSelectItem value="apple">Apple</InputSelectItem>
          <InputSelectItem value="zzz">Zzz</InputSelectItem>
          <InputSelectItem value="apricot">Apricot</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    // "ap" keeps Apple + Apricot and hides the middle Zzz.
    await userEvent.type(screen.getByRole('searchbox', { name: 'Filter' }), 'ap');
    // A `hidden` row leaves the accessibility tree (so it can't be a keyboard-nav
    // or screen-reader target) but stays in the DOM — which is what keeps Base UI's
    // selection-by-index stable. (That Base UI's composite navigation also visually
    // skips the hidden row is a layout-driven, real-browser behaviour, exercised in
    // Storybook rather than here — happy-dom has no layout to honour it.)
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Apple',
      'Apricot',
    ]);
    expect(screen.getByText('Zzz').closest('[role="option"]')).toBeInTheDocument();
  });

  it('respects an explicit hidden prop instead of auto-filtering', async () => {
    render(
      <InputSelect>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent>
          <InputSelectSearch aria-label="Filter" placeholder="Search" />
          {/* Consumer-controlled visibility wins over the query auto-filter. */}
          <InputSelectItem value="apple" hidden={false}>
            Apple
          </InputSelectItem>
          <InputSelectItem value="banana">Banana</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Filter' }), 'ban');
    // Apple would auto-hide, but the explicit hidden={false} keeps it shown.
    expect(screen.getByRole('option', { name: 'Apple' })).toBeVisible();
  });

  it('keeps typed characters but lets navigation keys reach the list', () => {
    const ancestorKeyDown = vi.fn();
    render(
      <div onKeyDown={ancestorKeyDown}>
        <InputSelectSearch aria-label="Filter" placeholder="Search" />
      </div>
    );
    const search = screen.getByRole('searchbox', { name: 'Filter' });
    // Printable keys are consumed here so Base UI's typeahead doesn't steal them
    // from the input — they must NOT bubble to the popup's key handler.
    fireEvent.keyDown(search, { key: 'a' });
    expect(ancestorKeyDown).not.toHaveBeenCalled();
    // Navigation/selection keys bubble so list nav + Enter-select work from the box.
    fireEvent.keyDown(search, { key: 'ArrowDown' });
    fireEvent.keyDown(search, { key: 'Enter' });
    fireEvent.keyDown(search, { key: 'Escape' });
    expect(ancestorKeyDown).toHaveBeenCalledTimes(3);
  });
});
