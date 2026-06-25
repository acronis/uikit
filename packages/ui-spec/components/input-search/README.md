# InputSearch

A full search field: a label (with an optional required marker) above the search
box. It composes the bare [`Search`](../search/README.md) box — a leading
magnifier, the input, and a clear (×) button — and adds the surrounding field
furniture.

## When to use

- A labelled search / filter field in a form or panel, where the field needs a
  visible label above the box.

## When not to use

- For a bare search box with no label (e.g. in a toolbar or table header) — use
  the [`Search`](../search/README.md) box directly.
- For the page-level global search affordance — use `SearchGlobal`.
- For a plain labelled text field with no leading magnifier — use `InputText`.

## Examples

```tsx
import { InputSearch } from '@acronis-platform/ui-react';

// Basic labelled search field
<InputSearch label="Find" placeholder="Search table" />;

// Required
<InputSearch label="Find" required />;

// Controlled with clear
<InputSearch
  label="Find"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onClear={() => setQuery('')}
/>;
```

## Parts

| Part       | Element    | Description                                                 |
| ---------- | ---------- | ----------------------------------------------------------- |
| `label`    | `<label>`  | Field label (associated via `htmlFor`/`id`).                |
| `required` | `<span>`   | Required `*` marker (decorative; `aria-hidden`).            |
| `icon`     | `<svg>`    | Leading magnifier inside the box (from `Search`).           |
| `input`    | `<input>`  | The search box input (`role="searchbox"`, from `Search`).   |
| `clear`    | `<button>` | Optional clear (×) button; calls `onClear` (from `Search`). |
