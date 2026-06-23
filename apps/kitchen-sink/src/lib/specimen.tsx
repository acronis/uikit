/**
 * Shared building blocks for the component "specimen" pages — the Figma-style
 * variant × state sheets the kitchen sink shows for designer review.
 *
 * The central trick is `forcedVars`. Real `:hover` / `:active` only fire on
 * pointer interaction, so a static review grid can't show those states by
 * rendering the component normally. Instead, each component reads its
 * `--ui-<tier>-…-idle` tokens in its **base** (always-on) classes; by remapping
 * those `-idle` custom properties to their `-<state>` siblings on a wrapper, the
 * component paints the target state while still being the real component. The
 * remap cascades through nested DOM (a Switch thumb, a Checkbox box), so it
 * works without per-component overrides. `disabled` is shown via the
 * component's own prop, and `focus` adds the design's focus ring.
 */
import type { CSSProperties, ReactNode } from 'react';

import { tierTokenNames } from '@/lib/tokens';

/** A two-step ring (surface gap + colored ring) around a focused control. */
function ring(token: string): string {
  return `0 0 0 2px var(--ui-background-surface-primary), 0 0 0 4px var(${token})`;
}

// Form controls focus with `--ui-focus-primary`; buttons/links with
// `--ui-focus-brand`. Drives the static focus ring per tier.
const FORM_TIERS = new Set([
  'checkbox',
  'radio',
  'switch',
  'input-text',
  'input-search',
  'input-text-area',
  'input-select',
]);

function focusRing(tier: string): string {
  return ring(FORM_TIERS.has(tier) ? '--ui-focus-primary' : '--ui-focus-brand');
}

/** A state a specimen cell can be pinned to. */
export type ForceState = 'idle' | 'hover' | 'active' | 'focus' | 'disabled';

const IDLE_SUFFIX = '-idle';

/**
 * Inline style that pins a component tier to `state`: every `*-idle` token is
 * remapped to its `*-<state>` sibling (only those the tier actually defines).
 * `idle`/`disabled` need no remap (idle is natural; disabled is the prop);
 * `focus` adds the focus ring. Returns CSS custom properties to spread onto the
 * wrapper that contains the component.
 */
export function forcedVars(tier: string, state: ForceState): CSSProperties {
  if (state === 'idle' || state === 'disabled') return {};
  const names = tierTokenNames[tier] ?? [];
  const present = new Set(names);
  const vars: Record<string, string> = {};
  for (const name of names) {
    if (!name.endsWith(IDLE_SUFFIX)) continue;
    const sibling = `${name.slice(0, -IDLE_SUFFIX.length)}-${state}`;
    if (present.has(sibling)) vars[name] = `var(${sibling})`;
  }
  const style = vars as unknown as CSSProperties;
  // `focus` is the design's focus ring, plus any real `-focus` border token a
  // tier defines (e.g. input-text-area) picked up by the remap above.
  return state === 'focus' ? { ...style, boxShadow: focusRing(tier) } : style;
}

/** Wraps a specimen and pins it to `state` (see `forcedVars`). */
export function Forced({
  tier,
  state,
  children,
}: {
  tier: string;
  state: ForceState;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'inline-flex', borderRadius: 6, ...forcedVars(tier, state) }}>
      {children}
    </div>
  );
}

// ---- Layout primitives ----------------------------------------------------

const mutedLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'var(--ui-text-on-surface-secondary)',
};

export interface GridAxis {
  key: string;
  label: string;
}

/**
 * A variant (rows) × state (columns) sheet. Each cell is centered on a subtle
 * canvas; hover a cell's content for the token it references (set a `title` in
 * `renderCell`).
 */
export function StateGrid({
  rows,
  columns,
  renderCell,
  rowHeaderWidth = 132,
}: {
  rows: GridAxis[];
  columns: GridAxis[];
  renderCell: (rowKey: string, colKey: string) => ReactNode;
  rowHeaderWidth?: number;
}) {
  const divider = '1px solid var(--ui-border-on-surface-divider)';
  return (
    <div style={{ overflowX: 'auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `${rowHeaderWidth}px repeat(${columns.length}, minmax(96px, 1fr))`,
          border: divider,
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--ui-background-surface-primary)',
          minWidth: rowHeaderWidth + columns.length * 96,
        }}
      >
        {/* Header row */}
        <div style={{ ...mutedLabel, padding: '10px 12px', borderBottom: divider }} />
        {columns.map((col) => (
          <div
            key={col.key}
            style={{
              ...mutedLabel,
              padding: '10px 12px',
              textAlign: 'center',
              borderBottom: divider,
              borderLeft: divider,
            }}
          >
            {col.label}
          </div>
        ))}

        {/* Body */}
        {rows.map((row, ri) => (
          <Fragmentish key={row.key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--ui-text-on-surface-primary)',
                borderTop: ri === 0 ? undefined : divider,
              }}
            >
              {row.label}
            </div>
            {columns.map((col) => (
              <div
                key={col.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  borderLeft: divider,
                  borderTop: ri === 0 ? undefined : divider,
                  background: 'var(--ui-background-surface-secondary)',
                }}
              >
                {renderCell(row.key, col.key)}
              </div>
            ))}
          </Fragmentish>
        ))}
      </div>
    </div>
  );
}

// Grid children must be flat (no wrapping element), so a fragment groups a
// row's header + cells without introducing a box.
function Fragmentish({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** A labeled sub-block within a specimen page (e.g. "States", "Sizes"). */
export function Subsection({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{title}</h3>
        {description && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 13,
              color: 'var(--ui-text-on-surface-secondary)',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/** A horizontal sample row with a small caption (for misc, non-grid examples). */
export function SampleRow({
  label,
  children,
  align = 'center',
}: {
  label?: string;
  children: ReactNode;
  align?: CSSProperties['alignItems'];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <span style={mutedLabel}>{label}</span>}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: align,
          gap: 16,
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--ui-border-on-surface-divider)',
          background: 'var(--ui-background-surface-secondary)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Fixed-width wrapper for full-width form controls (Input/Search/Select). */
export function Field({
  width = 220,
  children,
}: {
  width?: number;
  children: ReactNode;
}) {
  return <div style={{ width }}>{children}</div>;
}

/** A specimen / route page: title, optional lead paragraph, stacked sections. */
export function SpecimenPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <header>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{title}</h1>
        {description && (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 14,
              lineHeight: 1.5,
              maxWidth: 720,
              color: 'var(--ui-text-on-surface-secondary)',
            }}
          >
            {description}
          </p>
        )}
      </header>
      {children}
    </div>
  );
}
