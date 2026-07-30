import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `FormProps` in form.tsx is
// generic and extends Base UI's `Form` props, which expand to the whole `<form>`
// DOM surface — a large, noisy table. This companion documents only the props
// callers set directly. (The runtime type lives in form.tsx; never bundled.)

/** Props for `Form` — a native `<form>` with consolidated validation. */
export interface FormProps {
  /**
   * When the fields validate. A `Field`'s own `validationMode` takes precedence.
   * Defaults to `onSubmit`, after which fields re-validate on change.
   */
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange';
  /**
   * Externally supplied errors (typically from a server) keyed by each `Field`'s
   * `name`. Shown in that field's `FieldError`.
   */
  errors?: Record<string, string | string[]>;
  /**
   * Fired on submit once every field is valid, with the collected values keyed by
   * field `name`. `preventDefault()` is called on the native submit event.
   */
  onFormSubmit?: (
    values: Record<string, unknown>,
    eventDetails: unknown
  ) => void;
  /**
   * Imperative handle — `validate()` runs every field, or one when passed a
   * field `name`.
   */
  actionsRef?: React.RefObject<{
    validate: (fieldName?: string) => void;
  } | null>;
  /** The `Field`s and the submit control. */
  children?: React.ReactNode;
  /** Extra classes merged onto the `<form>`. */
  className?: string;
}
