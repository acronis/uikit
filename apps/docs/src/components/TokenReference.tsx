import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * A scannable reference of every `--ui-*` custom property
 * `@acronis-platform/tokens-pd` ships, read at build time. The semantic tier
 * lives in `css/acronis.css`; each component tier lives in
 * `css/<Component>/acronis.css`. Values are shown as authored (e.g. they may be
 * `light-dark(...)`); when a value looks like a single color, a swatch is shown.
 */

interface Token {
  name: string;
  value: string;
}

interface TokenGroup {
  label: string;
  tokens: Token[];
}

/** `process.cwd()` is `apps/docs/` at build time; tokens-pd lives at the root. */
const CSS_DIR = resolve(process.cwd(), '..', '..', 'packages/tokens-pd/css');

/** Extract `--ui-*` declarations (name + value, as authored) in source order. */
function parseTokens(css: string): Token[] {
  const seen = new Set<string>();
  const out: Token[] = [];
  // Match `--ui-name: value;` allowing nested parens (light-dark, gradients).
  const re = /(--ui-[a-z0-9-]+)\s*:\s*([^;]+);/g;
  for (const m of css.matchAll(re)) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, value: m[2].trim() });
  }
  return out;
}

/** A single, non-`light-dark`, paintable color value gets a swatch preview. */
function swatchColor(value: string): string | null {
  if (value.startsWith('light-dark(')) return null;
  if (/^(rgb|rgba|hsl|hsla|oklch|#)/.test(value)) return value;
  return null;
}

function buildGroups(): TokenGroup[] {
  const groups: TokenGroup[] = [];

  const semantic = parseTokens(readFileSync(resolve(CSS_DIR, 'acronis.css'), 'utf-8'));
  if (semantic.length) groups.push({ label: 'Semantic', tokens: semantic });

  // Component tiers are the subdirectories of css/ (discovered, not hardcoded).
  const componentDirs = readdirSync(CSS_DIR)
    .filter((entry) => statSync(resolve(CSS_DIR, entry)).isDirectory())
    .sort();

  for (const dir of componentDirs) {
    const file = resolve(CSS_DIR, dir, 'acronis.css');
    let css: string;
    try {
      css = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    const tokens = parseTokens(css);
    if (tokens.length) groups.push({ label: dir, tokens });
  }

  return groups;
}

export function TokenReference() {
  const groups = buildGroups();

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            {group.label} <span className="font-normal">({group.tokens.length})</span>
          </h3>
          <div className="overflow-x-auto rounded-lg border border-fd-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-fd-border bg-fd-muted/50">
                  <th className="px-3 py-2 font-medium text-fd-muted-foreground">Token</th>
                  <th className="px-3 py-2 font-medium text-fd-muted-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {group.tokens.map((token) => {
                  const color = swatchColor(token.value);
                  return (
                    <tr
                      key={token.name}
                      className="border-b border-fd-border last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-3 py-1.5 font-mono text-fd-foreground">
                        {token.name}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-fd-muted-foreground">
                        <span className="flex items-center gap-2">
                          {color && (
                            <span
                              aria-hidden
                              className="inline-block size-3.5 shrink-0 rounded border border-fd-border"
                              style={{ background: color }}
                            />
                          )}
                          <span className="break-all">{token.value}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
