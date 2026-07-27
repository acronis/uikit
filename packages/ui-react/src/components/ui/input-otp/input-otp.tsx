import * as React from 'react';

import { cn } from '@/lib/utils';

// Mirrors the Figma "inputOTP" component: a bare row of single-character boxes
// (no label/description — like `Input`, field furniture is a future `Field`
// wrapper). Themed by the `--ui-input-otp-*` token tier. Each slot is a plain
// `<input>`; typing a digit advances focus to the next slot, Backspace on an
// empty slot clears and moves back to the previous one, and pasting — or a
// browser/password-manager autofill that drops the full code into one slot's
// `onChange` — distributes it across the slots from the focused one onward.
// `error`
// reddens every box (via `--ui-input-otp-box-border-color-error`); there is no
// disabled treatment in the design, so `disabled` falls back to the generic
// `disabled:opacity-50` convention used elsewhere in this package. OTP codes
// are numeric-only by design (SMS/authenticator codes): `inputMode="numeric"`
// and `pattern="[0-9]*"` are mobile-keyboard hints only, so both typed and
// pasted input are also filtered to digits in JS — a non-digit keystroke is
// rejected outright and non-digit characters are stripped from a paste.
export interface InputOTPProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'onChange' | 'defaultValue' | 'children'
  > {
  /** Number of single-character slots. */
  length?: number;
  /** Controlled value (the digits entered so far, left to right). */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the full value on every change. */
  onChange?: (value: string) => void;
  /** Fires once, the moment the value reaches `length` characters. */
  onComplete?: (value: string) => void;
  /** Disables every slot. */
  disabled?: boolean;
  /** Switches every slot to the error treatment. */
  error?: boolean;
  /** Focuses the first slot on mount. */
  autoFocus?: boolean;
  /** Builds the accessible name for a slot from its 1-based index and the total length. */
  slotAriaLabel?: (index: number, length: number) => string;
}

const defaultSlotAriaLabel = (index: number, length: number) =>
  `Digit ${index} of ${length}`;

const DIGIT_PATTERN = /^[0-9]$/;

// Fixed-length per-slot array, not a derived dense string — a slot's
// position must survive edits to other slots (see `commitSlots`).
const toSlots = (value: string, length: number): string[] =>
  Array.from({ length }, (_, index) => value[index] ?? '');

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      className,
      length = 6,
      value,
      defaultValue,
      onChange,
      onComplete,
      disabled,
      error,
      autoFocus,
      slotAriaLabel = defaultSlotAriaLabel,
      ...props
    },
    ref
  ) => {
    const [internalSlots, setInternalSlots] = React.useState(() =>
      toSlots(defaultValue ?? '', length)
    );
    const isControlled = value != null;
    const slots = isControlled ? toSlots(value, length) : internalSlots;
    const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const completedRef = React.useRef(false);

    // `nextSlots` is the source of truth — each index keeps its own slot's
    // character regardless of whether earlier slots are filled. The joined
    // string handed to `onChange`/`onComplete` is a derived value; only
    // `nextSlots.every(...)` can tell whether every slot has been filled,
    // since a joined string with a blank slot collapses indistinguishably
    // from a shorter one.
    const commitSlots = (nextSlots: string[]) => {
      if (!isControlled) setInternalSlots(nextSlots);
      const joined = nextSlots.join('');
      onChange?.(joined);
      if (nextSlots.every((char) => char !== '')) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.(joined);
        }
      } else {
        completedRef.current = false;
      }
    };

    const focusSlot = (index: number) => {
      const slot = slotRefs.current[index];
      slot?.focus();
      slot?.select();
    };

    React.useEffect(() => {
      if (autoFocus) focusSlot(0);
      // Only run on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Distributes digits across slots starting at `index` — shared by a
    // multi-character paste and a multi-character autofill `onChange` (a
    // password manager or Chrome's OTP autofill can set a single slot's
    // `.value` to the entire code, bypassing `maxLength`).
    const distributeFrom = (index: number, digits: string) => {
      const nextSlots = [...slots];
      let cursor = index;
      for (const char of digits) {
        if (cursor >= length) break;
        nextSlots[cursor] = char;
        cursor += 1;
      }
      commitSlots(nextSlots);
      focusSlot(Math.min(cursor, length - 1));
    };

    const handleSlotChange = (index: number, raw: string) => {
      if (raw.length > 1) {
        const digits = raw.replace(/\D/g, '');
        if (digits) distributeFrom(index, digits);
        return;
      }
      const char = raw;
      if (char !== '' && !DIGIT_PATTERN.test(char)) return;
      const nextSlots = [...slots];
      nextSlots[index] = char;
      commitSlots(nextSlots);
      if (char && index < length - 1) focusSlot(index + 1);
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Backspace' && !slots[index] && index > 0) {
        event.preventDefault();
        const nextSlots = [...slots];
        nextSlots[index - 1] = '';
        commitSlots(nextSlots);
        focusSlot(index - 1);
      } else if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        focusSlot(index - 1);
      } else if (event.key === 'ArrowRight' && index < length - 1) {
        event.preventDefault();
        focusSlot(index + 1);
      }
    };

    const handlePaste = (
      index: number,
      event: React.ClipboardEvent<HTMLInputElement>
    ) => {
      const digits = event.clipboardData.getData('text').replace(/\D/g, '');
      if (!digits) return;
      event.preventDefault();
      distributeFrom(index, digits);
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex justify-[var(--ui-input-otp-container-justify-content)] gap-3',
          className
        )}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              slotRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={1}
            value={slots[index]}
            placeholder={String(index + 1)}
            disabled={disabled}
            aria-label={slotAriaLabel(index + 1, length)}
            aria-invalid={error || undefined}
            onChange={(event) => handleSlotChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
            className={cn(
              'ui-input-otp-value-text-style h-[var(--ui-input-otp-box-height)] w-[var(--ui-input-otp-box-width)] rounded-[var(--ui-input-otp-box-border-radius)] border-[length:var(--ui-input-otp-box-border-width)] bg-[var(--ui-input-otp-box-color)] px-[var(--ui-input-otp-box-padding-x)] py-[var(--ui-input-otp-box-padding-y)] text-center text-[var(--ui-input-otp-value-color)] caret-[var(--ui-input-otp-value-color)] placeholder:text-[var(--ui-input-otp-placeholder-color)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-[var(--ui-input-otp-box-border-color-error)] focus-visible:ring-[var(--ui-focus-error)]'
                : 'border-[var(--ui-input-otp-box-border-color-idle)] focus-visible:border-[var(--ui-input-otp-box-border-color-active)] focus-visible:ring-[var(--ui-focus-primary)]'
            )}
          />
        ))}
      </div>
    );
  }
);
InputOTP.displayName = 'InputOTP';

export { InputOTP };
