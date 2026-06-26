import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Typography tokens are emitted by `@acronis-platform/tokens-pd` as
 * `.ui-typography-*` utility classes (in `css/acronis.css`), not as custom
 * properties. This RSC reads that CSS at build time, parses each class rule and
 * its declarations, and renders a live sample per style with the parsed
 * declarations applied inline as `style` — so the sample renders correctly
 * regardless of whether the page's global CSS happens to load the utility class.
 */

interface TypographyStyle {
  /** e.g. `ui-typography-body-default`. */
  className: string;
  /** First segment, e.g. `body`, `headings`, `link`. */
  group: string;
  /** Remaining segments, e.g. `default`, `form-label`, `default-underline`. */
  variant: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

/** `process.cwd()` is `apps/docs/` at build time; tokens-pd lives at the root. */
const ACRONIS_CSS = resolve(
  process.cwd(),
  '..',
  '..',
  'packages/tokens-pd/css/acronis.css'
);

/** Preferred display order; any unlisted groups are appended after these. */
const GROUP_ORDER = ['headings', 'body', 'link', 'caption', 'note', 'fineprint'];

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

function parseTypography(css: string): TypographyStyle[] {
  const out: TypographyStyle[] = [];
  const blockRe = /\.(ui-typography-[a-z0-9-]+)\s*\{([^}]*)\}/g;
  for (const m of css.matchAll(blockRe)) {
    const className = m[1];
    const decls: Record<string, string> = {};
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':');
      if (i === -1) continue;
      decls[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    const parts = className.slice('ui-typography-'.length).split('-');
    out.push({
      className,
      group: parts[0],
      variant: parts.slice(1).join('-'),
      fontFamily: decls['font-family'] ?? '',
      fontSize: decls['font-size'] ?? '',
      fontWeight: decls['font-weight'] ?? '',
      lineHeight: decls['line-height'] ?? '',
      letterSpacing: decls['letter-spacing'] ?? '',
    });
  }
  return out;
}

function sampleStyle(style: TypographyStyle): React.CSSProperties {
  return {
    fontFamily: style.fontFamily || undefined,
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight ? Number(style.fontWeight) || style.fontWeight : undefined,
    lineHeight: style.lineHeight || undefined,
    letterSpacing: style.letterSpacing || undefined,
  };
}

export function TypographyCatalog() {
  const css = readFileSync(ACRONIS_CSS, 'utf-8');
  const styles = parseTypography(css);

  const seen = new Set<string>();
  const orderedGroups = [
    ...GROUP_ORDER,
    ...styles.map((s) => s.group).filter((g) => !GROUP_ORDER.includes(g)),
  ].filter((g) => (seen.has(g) ? false : seen.add(g)));

  const groups = orderedGroups
    .map((group) => ({
      group,
      items: styles.filter((s) => s.group === group),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-10">
      {groups.map(({ group, items }) => (
        <section key={group} className="flex flex-col gap-1">
          <h3 className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            {group} <span className="font-normal">({items.length})</span>
          </h3>
          <div>
            {items.map((style) => (
              <div
                key={style.className}
                className="flex flex-col gap-2 border-b border-fd-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div className="min-w-0 flex-1 overflow-hidden text-fd-foreground">
                  <span style={sampleStyle(style)}>{SAMPLE}</span>
                </div>
                <div className="shrink-0 font-mono text-[11px] text-fd-muted-foreground sm:text-right">
                  <div className="text-fd-foreground">.{style.className}</div>
                  <div>
                    {[
                      style.fontSize,
                      style.lineHeight,
                      style.fontWeight,
                      style.letterSpacing && style.letterSpacing !== '0px'
                        ? style.letterSpacing
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {style.fontFamily && <div>{style.fontFamily}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
