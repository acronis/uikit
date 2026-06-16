---
'@acronis-platform/design-tokens': minor
'@acronis-platform/tokens-pd': minor
---

## design-tokens

### Deleted

| Token                                         | Was                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `semantics.colors.border.onSurface.border-ai` | Alias to a palette blue color representing the AI brand border treatment |

## Migration

Replace usages of `--ui-border-onSurface-border-ai` with one of the dedicated AI gradient tokens, which now represent the canonical AI border/surface treatment:

| Replacement token                 | CSS variable                 | Use when                |
| --------------------------------- | ---------------------------- | ----------------------- |
| `semantics.gradients.ai.idle`     | `--ui-gradients-ai-idle`     | Default / resting state |
| `semantics.gradients.ai.hover`    | `--ui-gradients-ai-hover`    | Hover state             |
| `semantics.gradients.ai.active`   | `--ui-gradients-ai-active`   | Active / pressed state  |
| `semantics.gradients.ai.disabled` | `--ui-gradients-ai-disabled` | Disabled state          |
