import {
  buttonExtras,
  buttonMatrix,
  componentGroups,
  resolveToken,
  semanticContextGroups,
  statusExtras,
  statusMatrix,
  type ComponentTokenGroup,
  type ContextGroup,
  type MatrixCellKind,
  type RoleGroup,
  type TokenMatrix,
} from '@/lib/tokens';

const SWATCH_BORDER = '1px solid var(--ui-border-on-surface-border)';

/** A value that can be shown as a color/gradient swatch. */
function isColorValue(value: string): boolean {
  return /^(#|rgb|hsl|light-dark|linear-gradient|radial-gradient|var\()/.test(
    value
  );
}

const ROLE_LABELS: Record<string, string> = {
  bg: 'Background',
  text: 'Text',
  border: 'Border',
  glyph: 'Glyph',
  focus: 'Focus',
};

/** One token: a swatch (colors/gradients) or a value chip (dimensions/etc.),
 *  with a compact `label` up top and the full `--ui-*` name below. */
function TokenCard({ name, label }: { name: string; label?: string }) {
  const value = resolveToken(name);
  const isColor = isColorValue(value);
  return (
    <div style={{ minWidth: 0 }}>
      {isColor ? (
        <div
          style={{
            height: 44,
            borderRadius: 6,
            background: `var(${name})`,
            border: SWATCH_BORDER,
          }}
        />
      ) : (
        <div
          style={{
            height: 44,
            borderRadius: 6,
            border: SWATCH_BORDER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 6px',
            fontSize: 12,
            fontFamily: 'monospace',
            color: 'var(--ui-text-on-surface-primary)',
            background: 'var(--ui-background-surface-secondary)',
            overflow: 'hidden',
          }}
        >
          {value || '—'}
        </div>
      )}
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            marginTop: 4,
            color: 'var(--ui-text-on-surface-primary)',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          fontFamily: 'monospace',
          marginTop: label ? 1 : 4,
          wordBreak: 'break-all',
          color: 'var(--ui-text-on-surface-secondary)',
        }}
      >
        {name}
      </div>
      {isColor && (
        <div
          style={{
            fontSize: 9,
            color: 'var(--ui-text-on-surface-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: 12,
} as const;

const groupCard = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 16,
  borderRadius: 8,
  border: SWATCH_BORDER,
  background: 'var(--ui-background-surface-primary)',
} as const;

const groupHeading = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  margin: 0,
} as const;

/** A role row within a context — small role label, then its swatches. */
function RoleRow({ group }: { group: RoleGroup }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'capitalize',
          color: 'var(--ui-text-on-surface-secondary)',
        }}
      >
        {ROLE_LABELS[group.role] ?? group.role}{' '}
        <span style={{ fontWeight: 400, opacity: 0.7 }}>
          ({group.tokens.length})
        </span>
      </div>
      <div style={cardGrid}>
        {group.tokens.map((token) => (
          <TokenCard key={token.name} name={token.name} label={token.leaf} />
        ))}
      </div>
    </div>
  );
}

/** A single matrix cell, previewed per what its column paints. */
function MatrixCell({
  kind,
  name,
}: {
  kind: MatrixCellKind;
  name: string | null;
}) {
  if (!name) {
    return (
      <span style={{ opacity: 0.3, color: 'var(--ui-text-on-surface-secondary)' }}>
        –
      </span>
    );
  }
  const box = {
    width: 30,
    height: 30,
    borderRadius: 6,
    border: SWATCH_BORDER,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  } as const;
  if (kind === 'fill') {
    return <div title={name} style={{ ...box, background: `var(${name})` }} />;
  }
  if (kind === 'border') {
    return <div title={name} style={{ ...box, border: `2px solid var(${name})` }} />;
  }
  // Glyph/label colors can be light (e.g. a primary button's white label) or
  // dark, so a single-tone backdrop hides one or the other. A diagonal two-tone
  // keeps the centered swatch legible either way (it straddles both halves).
  const fg = {
    ...box,
    color: `var(${name})`,
    background: 'linear-gradient(135deg, #e5e7eb 0 50%, #4b5563 50% 100%)',
  } as const;
  return kind === 'text' ? (
    <div title={name} style={{ ...fg, fontSize: 12, fontWeight: 700 }}>
      Aa
    </div>
  ) : (
    <div title={name} style={{ ...fg, fontSize: 15 }}>
      ●
    </div>
  );
}

const matrixTh = {
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'var(--ui-text-on-surface-secondary)',
  padding: '4px 8px',
  whiteSpace: 'nowrap',
} as const;

/** A row × (role/state) matrix (status intents, button variants, …). Hover a
 *  cell for its full `--ui-*` name. `extras` lists tokens off the grid. */
function TokenMatrixView({
  matrix,
  extras,
  extrasLabel,
}: {
  matrix: TokenMatrix;
  extras: RoleGroup[];
  extrasLabel: string;
}) {
  // Left border between column groups makes the grouping legible.
  const divider = '1px solid var(--ui-border-on-surface-divider)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...matrixTh, textAlign: 'left' }} rowSpan={2} />
              {matrix.groups.map((g) => (
                <th
                  key={g.label}
                  colSpan={g.columns.length}
                  style={{
                    ...matrixTh,
                    textAlign: 'center',
                    borderLeft: divider,
                    borderBottom: divider,
                  }}
                >
                  {g.label}
                </th>
              ))}
            </tr>
            <tr>
              {matrix.groups.flatMap((g) =>
                g.columns.map((c, ci) => (
                  <th
                    key={`${g.label}-${c}`}
                    style={{
                      ...matrixTh,
                      textAlign: 'center',
                      borderLeft: ci === 0 ? divider : undefined,
                    }}
                  >
                    {c}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row}>
                <th
                  style={{
                    ...matrixTh,
                    textAlign: 'left',
                    color: 'var(--ui-text-on-surface-primary)',
                  }}
                >
                  {row}
                </th>
                {matrix.groups.flatMap((g, gi) =>
                  g.cells[row].map((name, ci) => (
                    <td
                      key={`${g.label}-${row}-${ci}`}
                      style={{
                        padding: 6,
                        borderLeft: gi > 0 && ci === 0 ? divider : undefined,
                      }}
                    >
                      <MatrixCell kind={g.kind} name={name} />
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {extras.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.4,
              color: 'var(--ui-text-on-surface-secondary)',
            }}
          >
            {extrasLabel}
          </div>
          {extras.map((role) => (
            <RoleRow key={role.role} group={role} />
          ))}
        </div>
      )}
    </div>
  );
}

/** A context section (Surface, Brand, Status, …) holding its role rows. */
function ContextSection({ group }: { group: ContextGroup }) {
  return (
    <div style={groupCard}>
      <h4 style={groupHeading}>
        {group.context}{' '}
        <span style={{ fontWeight: 400, opacity: 0.6 }}>({group.count})</span>
      </h4>
      {group.context === 'status' ? (
        <TokenMatrixView
          matrix={statusMatrix}
          extras={statusExtras}
          extrasLabel="Other status tokens"
        />
      ) : (
        group.roles.map((role) => <RoleRow key={role.role} group={role} />)
      )}
    </div>
  );
}

/** A component token group, mirroring the semantic context cards: each
 *  component is a card of sub-group rows. `button` gets the matrix treatment. */
function ComponentSection({ group }: { group: ComponentTokenGroup }) {
  return (
    <div style={groupCard}>
      <h4 style={groupHeading}>
        {group.component}{' '}
        <span style={{ fontWeight: 400, opacity: 0.6 }}>({group.count})</span>
      </h4>
      {group.component === 'button' ? (
        <TokenMatrixView
          matrix={buttonMatrix}
          extras={buttonExtras}
          extrasLabel="Other button tokens"
        />
      ) : (
        group.subgroups.map((sub) => <RoleRow key={sub.role} group={sub} />)
      )}
    </div>
  );
}

/** The intro blurb shared by the tokens page. */
export function TokensIntro() {
  return (
    <p style={{ fontSize: 13, color: 'var(--ui-text-on-surface-secondary)', margin: 0 }}>
      Generated <code>--ui-*</code> tokens from{' '}
      <code>@acronis-platform/tokens-pd</code>. Values reflect the active brand
      and light/dark scheme. Tokens are grouped by <strong>context</strong> (the
      surface/intent a color lives on, or the component), then by{' '}
      <strong>role</strong> (background, text, border, glyph) within. Regular
      families — status by intent, button by variant — are shown as a matrix.
    </p>
  );
}

/** Semantic colors, grouped by context → role. */
export function SemanticColors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {semanticContextGroups.map((group) => (
        <ContextSection key={group.context} group={group} />
      ))}
    </div>
  );
}

/** Per-component token tiers (`--ui-button-*`, `--ui-switch-*`, …). */
export function ComponentColors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {componentGroups.map((group) => (
        <ComponentSection key={group.component} group={group} />
      ))}
    </div>
  );
}
