---
'@acronis-platform/ui-react': patch
---

Add LLM-friendly component reference docs to the published package.

A new `build:llms` script (also hooked into `build`) reads the framework-agnostic
specs from `packages/ui-spec` and emits:

- `dist/llms.txt` — index of all components grouped by category
- `dist/llms/<name>.md` — self-contained doc per component (props, events, content
  slots, behavior, accessibility, usage examples)

Consumers can reference these from a project's `CLAUDE.md`:

```
@node_modules/@acronis-platform/ui-react/dist/llms.txt
@node_modules/@acronis-platform/ui-react/dist/llms/button.md
```

Both entry points are exposed via the package `exports` field.
