---
'@acronis-platform/ui-react': patch
'@acronis-platform/icons-react': patch
---

chore(deps): bump dependencies

Bumps `vite` (6→8), `vitest` (4.1.7→4.1.10), and `@vitejs/plugin-react`
(5→6), plus `js-yaml`, `ajv`, `style-dictionary`, `svgo`, and `next`
(apps/docs). Pins remaining vulnerable transitive deps (`form-data`,
`postcss`, `brace-expansion`, `fast-uri`, `nanoid`, `undici`, `axios`,
`immutable`, `joi`, `react-router`, `sharp`, `esbuild`, `fast-json-patch`,
`uuid`) via `pnpm-workspace.yaml` overrides. No published-surface behavior
change — build output is unaffected (verified with `pnpm -r
{build,typecheck,test}` and VR baselines).
