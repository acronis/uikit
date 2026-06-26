---
'@acronis-platform/ui-react': minor
---

Add `Card` (initial version ported from ui-legacy; design reconciliation pending). A composable surface — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` — built on Base UI `useRender` with a `render` prop on every part. Colors resolve to the shared semantic tokens (`bg-background` / `text-foreground` / `border-border` / `text-muted-foreground`); a `--ui-card-*` tier will be wired in once a Figma reference exists.
