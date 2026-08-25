---
---

No release impact. Removes the `apps/demo` / `apps/demos` demo workspaces and
the ui-react build-config hooks that existed only to serve them (the legacy
specifier alias in `.storybook/main.ts` + `tsconfig.json`, and the
`apps/demos` manifest copy in `Dockerfile.storybook`). The published
`@acronis-platform/ui-react` artifact is unchanged.
