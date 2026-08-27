# InputSelect — Accessibility

- **Roles:** the trigger is a `role="combobox"` button; the popup is a
  `role="listbox"`; each item is a `role="option"` (provided by Base UI `Select`).
- **Label association:** `InputSelectLabel` (Base UI `Select.Label`) is automatically
  associated with the trigger via the select context — clicking the label focuses the
  trigger and screen readers announce the field name. No manual `htmlFor`/`id` needed.
- **Required:** `required` appends a visual `*` marker (`aria-hidden`); set the root
  `required` so the form-level constraint is conveyed via the hidden input.
- **Error:** set `aria-invalid` on the trigger; pair with `InputSelectError`. Associate
  the message via `aria-describedby` on the trigger when wiring a controlled error.
- **Keyboard:** Space / Enter / ArrowDown open the popup; arrows move the highlight;
  Enter selects; Escape closes and returns focus to the trigger; type-ahead matches
  items. In `multiple` mode the popup stays open so several items can be toggled.
- **Search box keyboard:** when the in-dropdown search row has focus, printable
  keys are stopped from reaching Base UI's own typeahead (so they type into the
  box instead of jumping the highlighted item); `Arrow*`/`Home`/`End`/`Enter`/
  `Escape` still bubble, so the user can move from the search box into the
  filtered list and select with the keyboard without leaving it first.
- **Expander:** `InputSelectExpander` is a plain button with `aria-expanded`
  reflecting its toggle state; it is not a `role="option"` and does not
  register with Base UI's composite list (unlike `SelectPrimitive.Item`), so
  Arrow-key roaming inside the listbox skips it entirely — it cannot be
  reached with the keyboard once the popup is open, only by pointer. It
  remains a normal native tab stop outside that roving focus order.
- **Decoupled anchor:** `anchor` moves only where the popup is _drawn_ — the
  combobox semantics (`aria-expanded`, `aria-controls`, the accessible name) and
  the focus return on close stay on the **trigger**, and cannot be relocated. So
  if the visible control is a separate element (an external button opening a
  visually hidden trigger), that button needs its own accessible name (visible
  text or `aria-label`) and, because it is the control the user actually
  operates, its own `aria-expanded` bound to the same controlled `open` state
  that drives the popup. `aria-controls` on the button is optional and only
  wirable by giving `InputSelectContent` an explicit `id` and referencing it
  while the popup is open. Keep the trigger reachable — do not `display: none`
  it, or closing returns focus to nothing. Prefer opening from the real trigger
  whenever the design allows it.
- **Visually hidden trigger — focus is the consumer's job (2.4.7):** leaving the
  trigger merely `sr-only`-reachable is **not** sufficient. It is still
  focusable while invisible, and on the close paths where the platform restores
  focus to it (Escape, selecting an item) keyboard focus lands on a control the
  user cannot see — a WCAG 2.4.7 Focus Visible failure. On other close paths
  (an outside press onto nothing focusable) the platform does not restore focus
  at all and it is simply lost to the document body — also a failure. The
  required pattern is **both** of:
  1. `tabIndex={-1}` on the **trigger** (`InputSelectTrigger`) — not on the
     `InputSelectField` wrapper, which is a plain non-focusable element — so the
     invisible trigger is out of the natural Tab sequence;
  2. a **conditional** focus return to the consumer's own visible control on
     close (`onOpenChange` → after committing the new state, `if (!nextOpen)`
     reclaim focus for the external button). Two properties of the platform make
     this non-trivial. First, **the platform's own focus restore may still be
     pending when the close is reported** — on the Escape and item-selection
     paths focus is still inside the popup that is about to unmount at handler
     time, and the move to the (invisible) trigger can land afterwards. On
     Escape a synchronous reclaim already lands on the visible control before
     that move happens, so nothing overwrites it; on item selection the
     platform's move can still land on the hidden trigger after a synchronous
     reclaim, so the reclaim must be re-asserted once that settles. Second,
     **on some close reasons the platform's restore does not happen at all** —
     an outside press onto nothing focusable leaves focus on the document
     body. So the focus return must be **re-asserted once the platform's own
     focus-restore attempts have settled**, not only synchronously during the
     handler — even where the synchronous call already suffices, the deferred
     re-assertion is a harmless no-op.
     Crucially, the reclaim must **never override an element the user has
     legitimately focused since** — an outside press onto another focusable
     control is that user's choice of focus, and an unconditional refocus steals
     it. Gate the reclaim on focus being _unclaimed_: still inside the closing
     popup, on the hidden trigger, or lost to the document body. Anything else
     is left alone.
     `tabIndex={-1}` alone does not stop the platform's programmatic `.focus()`
     call, and the reclaim alone leaves the invisible trigger in the Tab order —
     each fixes one half. The reclaim must sit after the state commit, so the
     cancelled `outside-press` branch (which returns early) does not move focus
     for a close that never happened.
- **External-button toggle:** an external button must also cancel the
  `outside-press` close that its own pointerdown triggers (`onOpenChange` →
  `eventDetails.reason === 'outside-press'` and the event target inside the
  button → `eventDetails.cancel()`), otherwise the popup cannot be dismissed
  from the button at all — a keyboard/AT user who activates the button a second
  time gets a popup that reopens instead of closing. Escape still closes it.
- **Selection indicator:** single-select shows a trailing check on the selected item;
  multiple-select shows a leading checkbox per item (not focusable — the row is the
  control).
- **Focus visible:** keyboard focus paints a 3px ring flush to the trigger —
  `--ui-focus-primary` normally, `--ui-focus-error` while `aria-invalid`.
- **Disabled:** native `disabled` removes the trigger from the tab order and blocks
  opening; state is not conveyed by color alone (the control is also inert).
- **Status:** the loading / empty / error row is informational; provide a real message
  and, for errors, a focusable retry control.
- **Contrast:** label / value / placeholder / border / item pairs come from the design
  tokens, authored to meet WCAG contrast.
- **WCAG:** 1.3.1, 2.1.1, 2.4.7, 1.4.3 / 1.4.11, 3.3.1 / 3.3.2, 4.1.2.
