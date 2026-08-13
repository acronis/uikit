# Contributing to `@acronis-platform/design-tokens`

There are two ways a change lands in these files, and they answer different
needs:

- **✋ By hand** — open the token files and edit a value yourself.
- **🎨 From Figma** — the tier files are regenerated from the Figma variables by
  the standalone `acronis-tokens-updater` project, outside this monorepo.

> [!IMPORTANT]
> The token files under `tiers/` are the **single source of truth**. They're
> what gets published and what every product reads. Whichever path a change
> takes, it isn't real until those files are updated, checked (`pnpm validate`),
> and committed.

## At a glance

|                     | ✋ **By hand**                                    | 🎨 **From Figma**                                                             |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| **What it is**      | You open the token JSON and edit a value yourself | The tier files are regenerated from the Figma variables                       |
| **Best for**        | One small tweak you already understand            | Real design changes from Figma (new tokens, renames, value updates)           |
| **Where it runs**   | This repo                                         | The standalone `acronis-tokens-updater` project                               |
| **Does the typing** | You                                               | The generator                                                                 |
| **Safety net**      | `pnpm validate` — your seatbelt, run it yourself  | The generator's own diff review, plus `pnpm validate` on the resulting change |

---

## ✋ By hand

The token files live under `tiers/`:

| File                    | Holds                                                        |
| ----------------------- | ------------------------------------------------------------ |
| `tiers/primitives.json` | The raw building blocks — the palette, spacing, font values  |
| `tiers/semantics.json`  | Meaningful roles — "surface", "border", "text", brand colors |
| `tiers/components.json` | Per-component values — Button, InputText, Checkbox, …        |

They're plain JSON. To change a value, open the file, find the token, and edit
it. A few things to keep true:

- A token carries its value either **per mode** (one value per brand/theme) **or**
  as a single fixed value — never both.
- When tokens point at other tokens (an "alias"), they follow one direction:
  **components → semantics → primitives**. A component reads a semantic role; a
  semantic role reads a primitive. Never the other way around.

When you're done:

```bash
pnpm validate          # from packages/design-tokens/
```

`pnpm validate` is your seatbelt — it catches a token that's shaped wrong (a
missing field, a typo in the structure). It does **not** check whether you
picked the right color or the right value; that's what a review is for. Once it
passes, commit your change.

> New to the vocabulary (Tier, Mode, Theme, Brand, alias)? The
> [deeper context](#where-the-deeper-context-lives) at the bottom explains every
> term in plain language. Read it once and the files make a lot more sense.

---

## 🎨 From Figma

Token updates that originate in Figma are **not** made in this repo. The tier
files are regenerated from the Figma variables by the standalone
`acronis-tokens-updater` project, which pulls a fresh snapshot, shows a full
diff for review, and writes the updated `tiers/*.json` back into this package.

That means:

- Don't hand-edit `tiers/*.json` to mirror a Figma change — it will be
  overwritten on the next regeneration, and the two will silently disagree in
  the meantime.
- If a token is missing or wrong in Figma, fix it in Figma and have the tokens
  updater regenerate the tiers.
- After regenerated tiers land here, rebuild the consumable CSS
  (`pnpm --filter @acronis-platform/tokens-pd build`) and commit both together
  with a changeset.

Hand-edits (the path above) stay legitimate for a one-off tweak — they just have
to pass `pnpm validate` before they're committed.

---

## Where the deeper context lives

These docs live in this package under `context/`. They're the full reference;
this guide is the quick start. Start with the **glossary** if any term above was
unfamiliar.

| Topic                                                                                            | File                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| Vocabulary — Tier, Group, Mode, Theme, Brand, Collection, token                                  | [`./context/glossary.md`](./context/glossary.md) |
| How the token files are organized — token shape, modes & themes, the alias chain, platform scope | [`./context/manifest.md`](./context/manifest.md) |
| The format rules — DTCG conformance & divergence, `$extensions` namespaces, naming / `$type`     | [`./context/spec.md`](./context/spec.md)         |

The same context files are indexed in `./CLAUDE.md` for AI agents.
