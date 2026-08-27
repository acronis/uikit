import { createRef, useRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

  it('sizes the trigger chevron icon box to the icon-box-size token', () => {
    render(<Field />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger.querySelector('svg')?.parentElement).toHaveClass(
      'size-[var(--ui-input-select-global-icon-box-size)]'
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

  it('does not force the field wrapper to full width, so it can shrink in a constrained flex/grid ancestor', () => {
    render(
      <InputSelect items={{ apple: 'Apple' }}>
        <InputSelectField data-testid="field">
          <InputSelectTrigger aria-label="Fruit">
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    const wrapper = screen.getByTestId('field');
    expect(wrapper).not.toHaveClass('w-full');
    expect(wrapper).toHaveClass(
      'min-w-[var(--ui-input-select-global-container-width-min)]'
    );
  });

  it('renders the dropdown with input-select tokens by default', async () => {
    render(<Field />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const popup = screen.getByRole('listbox');
    expect(popup).toHaveClass(
      'bg-[var(--ui-input-select-dropdown-container-color)]',
      'shadow-md'
    );
  });

  it('renders the dropdown with popover tokens and no shadow when isPopoverStyled', async () => {
    render(
      <InputSelect items={{ apple: 'Apple' }}>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        <InputSelectContent isPopoverStyled>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const popup = screen.getByRole('listbox');
    expect(popup).toHaveClass('bg-[var(--ui-popover-container-color)]');
    expect(popup).not.toHaveClass(
      'bg-[var(--ui-input-select-dropdown-container-color)]',
      'shadow-md'
    );
  });

  it('forwards className to the field wrapper', () => {
    render(
      <InputSelect items={{ apple: 'Apple' }}>
        <InputSelectField className="w-24" data-testid="field">
          <InputSelectTrigger aria-label="Fruit">
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
        </InputSelectField>
        <InputSelectContent>
          <InputSelectItem value="apple">Apple</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    );
    expect(screen.getByTestId('field')).toHaveClass('w-24');
  });
});

describe('InputSelectContent positioning', () => {
  // happy-dom reports every element as a zero-sized rect at the origin, so
  // floating-ui resolves every placement to translate(0, 0) and no offset is
  // observable. Give the anchor/popup a real box so the computed transform
  // actually reflects the offsets under test.
  function mockLayout() {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          width: 200,
          height: 32,
          x: 100,
          y: 100,
          top: 100,
          left: 100,
          right: 300,
          bottom: 132,
          toJSON() {},
        }) as DOMRect
    );
  }

  function open(content: React.ReactNode) {
    render(
      <InputSelect defaultOpen items={{ apple: 'Apple' }}>
        <InputSelectTrigger aria-label="Fruit">
          <InputSelectValue placeholder="Select an option" />
        </InputSelectTrigger>
        {content}
      </InputSelect>
    );
    return screen.getByRole('listbox').parentElement as HTMLElement;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards alignOffset and collisionAvoidance to the positioner', async () => {
    mockLayout();
    const positioner = open(
      <InputSelectContent
        side="right"
        sideOffset={20}
        alignOffset={24}
        collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}
      >
        <InputSelectItem value="apple">Apple</InputSelectItem>
      </InputSelectContent>
    );
    // `side` sticks (no flip), the popup clears the 200px-wide anchor by
    // `sideOffset`, and `alignOffset` shifts it down the alignment axis.
    expect(positioner).toHaveAttribute('data-side', 'right');
    await waitFor(() => {
      expect(positioner.style.transform).toBe('translate(220px, 24px)');
    });
  });

  it('keeps Base UI collision avoidance when collisionAvoidance is omitted', async () => {
    mockLayout();
    const positioner = open(
      <InputSelectContent side="right" sideOffset={20} alignOffset={24}>
        <InputSelectItem value="apple">Apple</InputSelectItem>
      </InputSelectContent>
    );
    // Same offsets, but Base UI's default avoidance flips the popup off the
    // requested side and shifts away the alignOffset — the contrast that proves
    // the previous test's placement came from `collisionAvoidance`.
    await waitFor(() => {
      expect(positioner.style.transform).toBe('translate(-20px, 0px)');
    });
    expect(positioner).toHaveAttribute('data-side', 'left');
  });

  // `anchor` swaps the element the popup measures itself against, so give the
  // external anchor a box distinct from every other element's and read the
  // resulting transform: it can only come from the element actually measured.
  function mockLayoutWithAnchor() {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: Element) {
        const isAnchor = this.getAttribute('data-testid') === 'external-anchor';
        const x = isAnchor ? 400 : 100;
        const y = isAnchor ? 300 : 100;
        return {
          width: 200,
          height: 32,
          x,
          y,
          top: y,
          left: x,
          right: x + 200,
          bottom: y + 32,
          toJSON() {},
        } as DOMRect;
      }
    );
  }

  const anchorRef = createRef<HTMLDivElement>();

  function Anchored({ anchored }: { anchored: boolean }) {
    return (
      <>
        <div ref={anchorRef} data-testid="external-anchor" />
        <InputSelect defaultOpen items={{ apple: 'Apple' }}>
          <InputSelectTrigger aria-label="Fruit">
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
          <InputSelectContent
            anchor={anchored ? anchorRef : undefined}
            collisionAvoidance={{ side: 'none', align: 'none', fallbackAxisSide: 'none' }}
          >
            <InputSelectItem value="apple">Apple</InputSelectItem>
          </InputSelectContent>
        </InputSelect>
      </>
    );
  }

  it('positions the popup against the trigger when anchor is omitted', async () => {
    mockLayoutWithAnchor();
    render(<Anchored anchored={false} />);
    const positioner = screen.getByRole('listbox').parentElement as HTMLElement;
    // Trigger box: left 100, bottom 132, plus the default 4px sideOffset.
    await waitFor(() => {
      expect(positioner.style.transform).toBe('translate(0px, 36px)');
    });
  });

  it('positions the popup against a custom anchor element', async () => {
    mockLayoutWithAnchor();
    render(<Anchored anchored />);
    const positioner = screen.getByRole('listbox').parentElement as HTMLElement;
    // Anchor box: left 400, bottom 332, plus the default 4px sideOffset — i.e.
    // 300px further right and 200px further down than the trigger.
    await waitFor(() => {
      expect(positioner.style.transform).toBe('translate(300px, 236px)');
    });
  });
});

// The pattern the `ControlledOffsetWithDirectionPopoverStyled` story documents: an
// external button drives a controlled popup that anchors to the button while the
// Select's own trigger stays `sr-only`.
describe('InputSelect driven by an external button', () => {
  function ExternalButtonSelect() {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <button ref={buttonRef} type="button" onClick={() => setOpen((v) => !v)}>
          Open
        </button>
        <InputSelect
          items={{ apple: 'Apple' }}
          open={open}
          onOpenChange={(nextOpen, eventDetails) => {
            if (
              !nextOpen &&
              eventDetails.reason === 'outside-press' &&
              buttonRef.current?.contains(eventDetails.event.target as Node)
            ) {
              eventDetails.cancel();
              return;
            }
            setOpen(nextOpen);
          }}
        >
          <InputSelectTrigger aria-label="Fruit" className="sr-only">
            <InputSelectValue placeholder="Select an option" />
          </InputSelectTrigger>
          <InputSelectContent anchor={buttonRef}>
            <InputSelectItem value="apple">Apple</InputSelectItem>
          </InputSelectContent>
        </InputSelect>
      </>
    );
  }

  // Without the cancel, Base UI's outside-press close on `pointerdown` and the
  // button's `click` handler fight: the button can open the popup but never close
  // it.
  it('opens on the first click and closes on the second', async () => {
    render(<ExternalButtonSelect />);
    const button = screen.getByRole('button', { name: 'Open' });

    await userEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    await userEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('still closes on an outside press away from the button', async () => {
    render(<ExternalButtonSelect />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
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
