import {
  componentGroups,
  resolveToken,
  semanticGroups,
  type TokenGroup,
} from '@/lib/tokens';

const SWATCH_BORDER = '1px solid var(--ui-border-on-surface-border)';

/** A value that can be shown as a color/gradient swatch. */
function isColorValue(value: string): boolean {
  return /^(#|rgb|hsl|light-dark|linear-gradient|radial-gradient|var\()/.test(
    value
  );
}

function GroupHeading({ label, count }: { label: string; count: number }) {
  return (
    <h3
      style={{
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.6,
        marginBottom: 10,
      }}
    >
      {label} <span style={{ fontWeight: 400 }}>({count})</span>
    </h3>
  );
}

/** One token: a swatch (colors/gradients) or a value chip (dimensions/etc.),
 *  plus the full `--ui-*` custom-property name. */
function TokenCard({ name }: { name: string }) {
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
      <div
        style={{
          fontSize: 10,
          fontFamily: 'monospace',
          marginTop: 4,
          wordBreak: 'break-all',
          color: 'var(--ui-text-on-surface-primary)',
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

function Group({ group }: { group: TokenGroup }) {
  return (
    <div>
      <GroupHeading label={group.tier} count={group.tokens.length} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {group.tokens.map((token) => (
          <TokenCard key={token.name} name={token.name} />
        ))}
      </div>
    </div>
  );
}

export function ColorsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <p style={{ fontSize: 13, color: 'var(--ui-text-on-surface-secondary)' }}>
        Generated <code>--ui-*</code> tokens from{' '}
        <code>@acronis-platform/tokens-pd</code>. Values reflect the active brand
        and light/dark scheme.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Semantic tokens</h3>
        {semanticGroups.map((group) => (
          <Group key={group.tier} group={group} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Component tokens</h3>
        {componentGroups.map((group) => (
          <Group key={group.tier} group={group} />
        ))}
      </div>
    </div>
  );
}
