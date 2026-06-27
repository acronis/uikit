# Field

A form-field wrapper that ties a control to its label, description, and error.
Built on Base UI's Field primitive, so the `for` / `id` / `aria-describedby` /
`aria-invalid` associations and the validity state are wired automatically — no
manual plumbing. Structural parts (`FieldSet`, `FieldLegend`, `FieldGroup`,
`FieldContent`, `FieldSeparator`) compose and group fields.

> **Design-pending v1**, ported from the legacy shadcn-uikit `field` and rebuilt
> on Base UI Field. Reconcile with Figma later.

## When to use

- Labelling a **bare** control with a description and/or validation error — the
  primary case is a text field via `FieldControl render={<InputBox />}`.
- Grouping related controls under a heading (`FieldSet` + `FieldLegend`).

## When not to use

- A standalone text field with built-in furniture — use `InputText` /
  `InputSearch` / `InputSelect`, which already include label/description/error.
- Naming a single `Checkbox` / `Switch` — they self-label via their own `label`
  prop. Use `Field`/`FieldSet` only to **group** them.

## Parts

| Export             | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| `Field`            | The field wrapper (Base UI Field.Root). `orientation` lays out label vs. control. |
| `FieldLabel`       | The caption — auto-associated with the control.                                   |
| `FieldControl`     | Wires a bare control; use its `render` prop (e.g. `render={<InputBox />}`).       |
| `FieldDescription` | Helper text — auto-linked via `aria-describedby`.                                 |
| `FieldError`       | Validation message — shown by validity, or forced with `match`.                   |
| `FieldContent`     | Stacks a label + description beside a control (e.g. a toggle row).                |
| `FieldTitle`       | A non-label heading for a field with no single associated control.                |
| `FieldSet`         | Native `<fieldset>` grouping related fields.                                      |
| `FieldLegend`      | The fieldset heading — `legend` (large) or `label` (small) `variant`.             |
| `FieldGroup`       | A vertical stack of fields / nested groups (container-query context).             |
| `FieldSeparator`   | A divider between fields, with an optional centered label.                        |

> `FieldLabel` / `FieldControl` / `FieldDescription` / `FieldError` are Base UI
> Field parts — they must be rendered **inside a `Field`** (they throw without the
> Field context). For a group-level heading use `FieldLegend` in a `FieldSet`.

## Example

```tsx
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  InputBox,
} from '@acronis-platform/ui-react';

<Field invalid={hasError}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl render={<InputBox type="email" />} />
  <FieldDescription>We'll never share your email.</FieldDescription>
  <FieldError match>Please enter a valid email address.</FieldError>
</Field>;
```

Group self-labeling controls:

```tsx
<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldGroup>
    <Checkbox label="Product updates" />
    <Checkbox label="Security alerts" />
  </FieldGroup>
</FieldSet>
```
