# Contributing to `@acronis-platform/design-tokens`

There are two ways to make a change, and they answer different needs:

- **✋ By hand** — open the token files and edit a value yourself.
- **🤖 Via Agent** — let Claude Code pull the latest values straight from Figma
  for you.

> [!IMPORTANT]
> The token files under `tiers/` are the **single source of truth**. They're
> what gets published and what every product reads. Whichever path you take, a
> change isn't real until those files are updated, checked (`pnpm validate`),
> and committed.

## At a glance

|                     | ✋ **By hand**                                    | 🤖 **Via Agent**                                                            |
| ------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| **What it is**      | You open the token JSON and edit a value yourself | You run a skill that pulls the latest values from Figma                     |
| **Best for**        | One small tweak you already understand            | Syncing real design changes from Figma (new tokens, renames, value updates) |
| **What you need**   | A code editor + the repo running locally          | Figma Desktop + a Figma token + Claude Code                                 |
| **Who it's for**    | Comfortable reading and editing JSON              | Anyone — the agent does the typing                                          |
| **Does the typing** | You                                               | The agent                                                                   |
| **Safety net**      | `pnpm validate` — your seatbelt, run it yourself  | Diff-gated: nothing is written until **you** approve the diff               |
| **Effort**          | Higher                                            | Lower — **recommended** for syncing from Figma                              |

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

## 🤖 Via Agent

This is the easy path for **bringing design changes from Figma into the repo**.
You change tokens in Figma like you always do, then let the agent read your file
and write the matching JSON for you — and it shows you exactly what will change
before it touches anything.

Set it up once 3 steps, then it's a one-line command each time.

> [!NOTE]
> The `/figma-to-design-tokens` skill runs in **Claude Code** — which you'll
> install in the first step below.

### 1. Install the necessary software

On a Mac, paste this whole block into your terminal. It installs anything you're
missing and skips what you already have:

```bash
# Homebrew — the macOS package manager that installs everything else
command -v brew >/dev/null || \
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node 22 — runs the tooling (installed via nvm, the version manager)
command -v node >/dev/null || {
  brew install nvm
  mkdir -p ~/.nvm
  # Add nvm to ~/.zshrc (only once) so every new terminal loads node
  grep -q 'NVM_DIR' ~/.zshrc 2>/dev/null || cat >> ~/.zshrc <<'EOF'

# nvm (Node version manager)
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"
EOF
  export NVM_DIR="$HOME/.nvm"
  source "$(brew --prefix nvm)/nvm.sh"
  nvm install 22
  nvm alias default 22
}

# pnpm — this repo's package manager
command -v pnpm >/dev/null || brew install pnpm

# Claude Code — the agent that runs the sync skill
command -v claude >/dev/null || brew install --cask claude-code
```

When it finishes, check each tool answers:

```bash
node -v          # v22.…
pnpm -v          # 10.x
claude --version # any version
```

### 2. Set your Figma access token

The repo's config looks for your token in a variable called
`FIGMA_ACCESS_TOKEN_ACRONIS`. Create the token in Figma, then save it:

1. Open [figma.com](https://www.figma.com) in your browser.
2. Click your avatar (top-left) → **Settings** → the **Security** tab.
3. Under **Personal access tokens**, click **Generate new token**. Name it
   something like `acronis-uikit`.
4. Copy the token — it starts with `figd_` and Figma shows it **only once**.
5. Save it to your shell config and reload it — paste these two lines in your
   terminal:

   ```bash
   echo 'export FIGMA_ACCESS_TOKEN_ACRONIS="figd_YOUR_TOKEN_HERE"' >> ~/.zshrc
   source ~/.zshrc
   ```

   > 🔒 Your token is a password — **never commit it** or paste it into a tracked
   > file. The lines above keep it in your local shell config only.

### 3. Install the Figma Console MCP

The repo is **already wired** to start the Figma Console MCP server — you just
approve it the first time you open the repo in Claude Code. The one piece you
install by hand is its **Desktop Bridge plugin**, which lets the agent read your
variables from inside Figma Desktop. You only do this once:

1. Open the plugin repo: **<https://github.com/southleft/figma-console-mcp>**
2. **Download it** — click the green **Code** button → **Download ZIP**, then
   unzip it. The plugin is the `figma-desktop-bridge/` folder.
3. **Import it into Figma Desktop** — **Plugins → Development → Import plugin
   from manifest…**, then pick `figma-desktop-bridge/manifest.json` from the
   folder you just unzipped.

The plugin now lives under **Plugins → Development → Figma Desktop Bridge**.
You'll _run_ it (not re-import it) each time you sync — that's step 4 below.

### 4. Sync with `/figma-to-design-tokens`

The sync skill needs:

- **Claude Desktop** / **Claude Code**, as it the skill is buiold for them. With more agents planned in the future.
- IDE / tool thatthat reads the repo's `.mcp.json` and starts the Figma bridge for you. (VS Code, JetBrains, etc.)

**1. Open the plugin in Figma.** In Figma Desktop, open the
[shadcn-uikit file](https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit),
then **Plugins → Development → Figma Desktop Bridge → Run**. Leave it open — the
status pill turns green when it's connected.

**2. Start Claude Code in this repo.** Open the repo whichever way you prefer:

| Start from…                      | What to do                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A terminal**                   | Go to the repo folder and run `claude` — e.g. `cd path/to/acronis-uikit && claude`               |
| **An IDE** (VS Code / JetBrains) | Open the repo folder, then open the Claude Code panel (needs the Claude Code extension / plugin) |
| **Claude Code desktop app**      | Launch the app, then open this repo folder as your project                                       |

The first time, Claude Code asks to enable the **`figma-console`** MCP server —
approve it. (The repo already configured it; you're just saying yes.)

**3. Type the command.** On its own the skill syncs everything; add a target to
narrow it down:

```
/figma-to-design-tokens                    # everything
/figma-to-design-tokens primitives         # just the palette / spacing / type
/figma-to-design-tokens semantics          # just the roles / brand colors
/figma-to-design-tokens components         # all per-component values
/figma-to-design-tokens only ButtonIcon    # just one component
```

What happens, step by step:

1. It pulls a **fresh snapshot** of your Figma variables and styles.
2. It shows you a **full diff** — every token added, removed, or changed, in
   plain `+ / − / ~` lines.
3. It **stops and waits** for you. Read the diff like a design review.
4. **Only after you approve** does it update the `tiers/*.json` files, rebuild
   the consumable CSS, double-check everything (`pnpm validate`), and write a
   release note (a "changeset") describing the change.

The golden rule built into the skill: **nothing under `tiers/` is written until
you say yes.** If the diff shows something you didn't expect, say so — don't
approve.

### Going the other way (repo → Figma)

Right now there's **no skill** for pushing token changes _from the repo back
into Figma_ — that direction isn't automated yet.

If you need it, you can still do it through the **Figma Console MCP** directly:
ask the agent (in Claude Code, with the Desktop Bridge plugin running) to use the
Figma Console tools to create or update the variables in Figma. Point it at the
change you want and let it write the variables for you. It's a manual,
case-by-case flow for now — not the polished, diff-gated experience the
Figma → repo skill gives you.

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
