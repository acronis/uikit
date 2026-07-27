# InputOTP — Behavior

## Rendering

**Given** `length` (default 6)
**When** the field renders
**Then** it shows that many single-character boxes in a row, each labelled
`Digit N of length`, each showing its own 1-based position as a placeholder
while empty.

## Typing

**Given** a slot with focus
**When** a digit is entered
**Then** the value updates, `onChange` fires with the full value, and focus
advances to the next slot (if any).

**Given** the value reaches `length` characters
**When** the last digit is entered
**Then** `onComplete` fires once with the full value. It does not fire again
until the value drops below `length` and reaches it again.

## Backspace / navigation

**Given** an empty slot (not the first)
**When** Backspace is pressed
**Then** the previous slot is cleared and receives focus.

**Given** any slot
**When** ArrowLeft / ArrowRight is pressed
**Then** focus moves to the previous / next slot (clamped at the ends).

## Paste

**Given** a slot with focus
**When** text is pasted
**Then** the code is distributed across the slots starting at the focused
slot, extra characters beyond `length` are discarded, and focus lands on the
last filled slot (or the last slot).

## Validation

**Given** a slot with focus
**When** a non-digit character is typed
**Then** the keystroke is rejected — the slot's value and focus are unchanged.

**Given** a slot with focus
**When** text containing non-digit characters is pasted
**Then** only the digit characters are distributed across the slots; all
other characters (letters, symbols, whitespace) are discarded.

## Error / disabled

**Given** `error`
**When** the field renders
**Then** every slot shows the error border and its focus ring switches to
`--ui-focus-error`.

**Given** `disabled`
**When** the field renders
**Then** every slot is a native disabled `<input>` (out of the tab order, no
interaction).
