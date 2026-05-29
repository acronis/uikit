# Commit conventions

The repo enforces commit hygiene via Husky + commitlint + lint-staged.
Working with these — not around them — keeps history clean and the
release pipeline reliable.

## Conventional Commits

All commit messages must follow
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Commitlint enforces this on every commit.

Format: `<type>(<scope>): <summary>`

Common types used in this repo:

- `feat` — new user-facing functionality
- `fix` — bug fix
- `chore` — repo plumbing, tooling, dependencies
- `docs` — documentation only (including `AGENTS.md`, `./context/`, `apps/docs/`)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or correcting tests
- `ci` — changes to CI workflows under `.github/workflows/`

Scope is optional but **highly encouraged**. Use the workspace or
component as the scope:

- `feat(button): add loading state`
- `fix(card): correct padding on header`
- `chore(deps): bump vitest to 4.0.18`
- `docs(agents): clarify per-workspace context loading`

## Pre-commit hook

`pnpm husky` runs on every commit (configured via `prepare`):

1. **lint-staged** — runs `eslint --fix` on staged `.ts`/`.tsx`/`.js`/`.jsx`
   files under `apps/**` and `packages/**`, and `prettier --write` on
   staged `.json`/`.md`/`.yml`/`.yaml` files.
2. **typecheck** — `pnpm -r typecheck` runs TypeScript across every
   workspace.

If the hook fails:

- Fix the underlying issue. Stage the fix. Try the commit again.
- **Do not** use `--no-verify` to bypass the hook.
- **Do not** `--amend` the previous commit — if the hook failed, the
  commit did not happen, so amending would touch the wrong commit.

## What to commit and what not to

- Always commit `.changeset/*.md` files alongside the code change they
  describe (see `context/releasing.md`).
- Never commit `.env`, credentials, or anything matching `*.local.*`.
- Stage specific files (`git add <path>`) rather than `git add -A` when
  the working tree is mixed — it's easy to accidentally include the
  untracked `TO-DO.md` or similar scratch files.

## PR titles

The PR title becomes the squash-merge commit message, so it must also
follow Conventional Commits — commitlint also runs on PR titles via CI.
