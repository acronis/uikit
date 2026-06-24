# SearchGlobal

A prominent global **"search anything"** field: a pill-shaped box with a gradient
brand border, a leading magnifier, a borderless input, and a trailing
keyboard-shortcut hint. It's the top-level search entry point of an app.

## When to use

- The single, app-wide search at the top of a layout (header / command bar).
- A launch point for a command palette or universal search.

## When not to use

- In-page filtering or table/list search — use `Search` (the standard search
  input with a clear button).
- A plain text field — use the base input.

## Parts

| Part     | Role                                                            |
| -------- | --------------------------------------------------------------- |
| box      | Pill container; gradient border + fill, owns the visual states. |
| icon     | Leading magnifier (AI-purple).                                  |
| input    | Borderless native search input.                                 |
| shortcut | Trailing keyboard-shortcut hint (`⌘K`); decorative.             |

## Examples

```tsx
import { SearchGlobal } from '@acronis-platform/ui-react';

// Default
<SearchGlobal onChange={(e) => setQuery(e.target.value)} />

// Custom placeholder + shortcut
<SearchGlobal placeholder="Search the platform" shortcut="/" />

// As a command-palette trigger: focus on ⌘K
const ref = useRef<HTMLInputElement>(null);
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      ref.current?.focus();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);
<SearchGlobal ref={ref} />;

// No shortcut hint
<SearchGlobal shortcut={null} />
```

## Theming

Colors, sizes, the gradient border, and typography come from the
`--ui-search-global-*` token tier in `@acronis-platform/tokens-pd` (generated from
`@acronis-platform/design-tokens`) and resolve per brand/theme — see `tokens.yaml`.
The border is a brand gradient, applied with a padding-box / border-box background
rather than `border-color`. Don't hard-code values.
