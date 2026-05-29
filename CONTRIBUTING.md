# Contributing

Thanks for your interest in contributing to `acronis/shadcn-uikit`. This
file covers the **umbrella** process — forking, branching, commits, and
the things that apply across the whole repo.

**The contribution process differs per workspace.** Each app and package
has its own `CONTRIBUTING.md` describing what's expected when changing
that workspace specifically (tests required? changeset? doc updates?).
Start there once you've read this.

| Workspace | What it is | Workspace-specific guide |
|---|---|---|
| `packages/legacy/ui` | Published UI library | [packages/legacy/ui/CONTRIBUTING.md](packages/legacy/ui/CONTRIBUTING.md) |
| `apps/demo` | Vite SPA for manual verification | [apps/demo/CONTRIBUTING.md](apps/demo/CONTRIBUTING.md) |
| `apps/demos` | Shared source-only demo components | [apps/demos/CONTRIBUTING.md](apps/demos/CONTRIBUTING.md) |
| `apps/docs` | Next.js + Fumadocs documentation site | [apps/docs/CONTRIBUTING.md](apps/docs/CONTRIBUTING.md) |

For repo structure, tooling, and conventions, see [AGENTS.md](AGENTS.md)
and the [`./context/`](context/) directory.

## Forms of contribution

We welcome any of:

- Bug reports and reproductions
- Documentation improvements
- New components, variants, or fixes to existing ones
- Better tests or visual regression coverage
- Discussions, design feedback, and questions

## Issue reporting

File bugs and feature requests via
[GitHub Issues](https://github.com/acronis/shadcn-uikit/issues). A clean
reproduction is the single most useful thing you can include — link a
minimal sandbox or paste a focused snippet.

## Universal workflow

Regardless of which workspace you touch, the outer flow is the same:

1. Fork [the repo](https://github.com/acronis/shadcn-uikit).
2. Install dependencies from the repo root: `pnpm install` (requires
   pnpm `10.27.0` and Node 22.x).
3. Create a branch off `main`.
4. **Read the target workspace's `CONTRIBUTING.md`** for the specific
   requirements that apply to that change.
5. Make the change. Follow [`./context/conventions.md`](context/conventions.md).
6. Run the relevant scripts: `pnpm --filter <package> typecheck` and
   `pnpm --filter <package> test` for the workspace you changed.
7. If you touched `packages/legacy/ui`, add a Changeset (see below).
8. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
   prefixes (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`,
   `ci`, `build`, `perf`, `style`, `revert`). Husky runs lint-staged
   + typecheck on every commit; **don't use `--no-verify`** to skip it.
9. Open a PR. Keep it focused — PRs over ~250 lines are slower to
   review and easier to break.

## Commit conventions

Conventional Commits with scope. Use the workspace or component as the
scope:

- `feat(button): add loading state`
- `fix(card): correct padding on header`
- `chore(deps): bump vitest`
- `docs(agents): clarify per-workspace context loading`

See [`./context/commits.md`](context/commits.md) for the full list of
types and pre-commit hook behavior.

## Changesets (published library only)

Any change to `@acronis-platform/shadcn-uikit` (the only published
workspace) must include a changeset. From the repo root:

```bash
pnpm changeset
```

Answer the prompts (patch / minor / major + a one-line summary). Commit
the generated `.changeset/*.md` file alongside your code.

You **do not need** a changeset for changes scoped to `apps/demo`,
`apps/demos`, or `apps/docs` — they are private and listed under
`ignore` in `.changeset/config.json`.

On merge to `main`, the `Release` workflow opens (or updates) a "Version
Packages" PR aggregating all pending changesets. Merging that PR
publishes the bumped package to npm + GitHub Packages and creates the
GitHub Release. Commit prefixes don't drive the version — **the
changeset bump type does**.

See [`./context/releasing.md`](context/releasing.md) for the full release flow.

## Pull request etiquette

- One change per PR. If you're tempted to bundle "and while I was in
  there…", split it.
- The PR title becomes the squash-merge commit message — it must also
  follow Conventional Commits (commitlint runs on PR titles too).
- The description should explain *why*, not restate the diff.
- Link the issue if there is one.

## License

By contributing, you agree to license your contribution under the
[MIT license](LICENSE).
