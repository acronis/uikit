# Coding conventions

Truly cross-cutting rules that apply to **every** workspace in this
monorepo — current and future. Workspace-specific conventions
(framework, styling, file layout, variant management, a11y primitives,
etc.) live in `<workspace>/context/conventions.md`, not here.

## TypeScript

- **TypeScript across the board.** No new `.js` source files.
- Strict mode is on at the root `tsconfig`; workspaces inherit it.
- Define explicit interfaces / types at module boundaries (exports,
  function signatures). Implementation details can rely on inference.

## Naming

- **Files**: kebab-case (e.g. `data-table.tsx`, `auth-utils.ts`).
- **Directories**: kebab-case to match the file inside.

Framework-specific naming (e.g. PascalCase React component names) is
documented per workspace.

## Editing rules

- **Imports at the top of the file.** Never inline an import mid-file.
- Don't disable ESLint rules to silence warnings — fix the underlying issue.
- Don't add comments that restate what the code does. Comments should
  explain _why_ (a non-obvious constraint, a workaround, an invariant).
- Don't add features, refactors, or abstractions beyond what the task
  requires. A bug fix is a bug fix.
- Don't add backwards-compatibility shims, "removed" stubs, or
  deprecated re-exports unless explicitly asked. If something is
  unused, delete it.

## Cross-workspace dependency versions

Shared dependency versions live in the `catalog:` block of
`pnpm-workspace.yaml`. Workspaces reference them with `"catalog:"` in
their `package.json`. **Bump in one place.** The catalog comment also
documents intentional drift (e.g. zod 3 vs zod 4 between workspaces) —
respect those notes; don't align in passing.
