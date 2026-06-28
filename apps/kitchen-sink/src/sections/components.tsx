import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { Button, ButtonIcon, Switch } from '@acronis-platform/ui-react';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';

type Variant =
  | 'default'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'ai'
  | 'inverted';

// The `default` variant is the Figma "Primary" style; its tokens live under
// `--ui-button-primary-*`. Other variant names match their token prefix.
const STYLES: { variant: Variant; token: string; label: string }[] = [
  { variant: 'default', token: 'primary', label: 'Primary' },
  { variant: 'secondary', token: 'secondary', label: 'Secondary' },
  { variant: 'ghost', token: 'ghost', label: 'Ghost' },
  { variant: 'destructive', token: 'destructive', label: 'Destructive' },
  { variant: 'ai', token: 'ai', label: 'AI' },
  { variant: 'inverted', token: 'inverted', label: 'Inverted' },
];

type State = 'idle' | 'hover' | 'active' | 'disabled' | 'focus';
const STATES: State[] = ['idle', 'hover', 'active', 'disabled', 'focus'];

// Hover/active/focus only trigger on real interaction, so the spec matrix
// forces each cell to a static state by overriding the component's colors with
// the matching `--ui-button-*` state tokens. Focus reuses the idle colors and
// adds the design's focus ring. Idle/disabled render the real component (idle
// untouched, disabled via the `disabled` prop) so its own styling is exercised.
function forcedStyle(
  token: string,
  state: 'hover' | 'active' | 'focus',
  colorKey: 'label' | 'icon',
  gradient: boolean
): CSSProperties {
  const cs = state === 'focus' ? 'idle' : state;
  const style: CSSProperties = gradient
    ? { backgroundImage: `var(--ui-background-ai-${cs})` }
    : { backgroundColor: `var(--ui-button-${token}-background-${cs})` };
  style.color = `var(--ui-button-${token}-${colorKey}-${cs})`;
  style.borderColor = `var(--ui-button-${token}-border-${cs})`;
  if (state === 'focus') {
    style.boxShadow =
      '0 0 0 2px var(--ui-background-surface-primary), 0 0 0 4px var(--ui-focus-brand)';
  }
  return style;
}

function ColumnHeaders() {
  return (
    <>
      <span />
      {STATES.map((state) => (
        <span
          key={state}
          style={{
            fontSize: 12,
            textTransform: 'capitalize',
            color: 'var(--ui-text-on-surface-secondary)',
          }}
        >
          {state}
        </span>
      ))}
    </>
  );
}

function ButtonCell({ variant, token, state }: { variant: Variant; token: string; state: State }) {
  if (state === 'idle') return <Button variant={variant}>Label</Button>;
  if (state === 'disabled')
    return (
      <Button variant={variant} disabled>
        Label
      </Button>
    );
  return (
    <Button variant={variant} style={forcedStyle(token, state, 'label', variant === 'ai')}>
      Label
    </Button>
  );
}

function ButtonIconCell({ state }: { state: State }) {
  if (state === 'idle')
    return (
      <ButtonIcon aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
    );
  if (state === 'disabled')
    return (
      <ButtonIcon aria-label="Add" disabled>
        <PlusIcon />
      </ButtonIcon>
    );
  return (
    <ButtonIcon aria-label="Add" style={forcedStyle('icon', state, 'icon', false)}>
      <PlusIcon />
    </ButtonIcon>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, color: 'var(--ui-text-on-surface-secondary)' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

export function ComponentsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h3 style={{ marginBottom: 12 }}>Button — styles × states</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(5, max-content)',
            gap: '14px 20px',
            alignItems: 'center',
          }}
        >
          <ColumnHeaders />
          {STYLES.map((s) => (
            <Fragment key={s.variant}>
              <span style={{ fontSize: 13, color: 'var(--ui-text-on-surface-primary)' }}>
                {s.label}
              </span>
              {STATES.map((state) => (
                <ButtonCell key={state} variant={s.variant} token={s.token} state={state} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>ButtonIcon — states</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(5, max-content)',
            gap: '14px 20px',
            alignItems: 'center',
          }}
        >
          <ColumnHeaders />
          <span style={{ fontSize: 13, color: 'var(--ui-text-on-surface-primary)' }}>
            Default
          </span>
          {STATES.map((state) => (
            <ButtonIconCell key={state} state={state} />
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Button — sizes &amp; usage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="With icon">
            <Button>
              <PlusIcon /> Add item
            </Button>
            <Button variant="secondary">
              <PlusIcon /> Add item
            </Button>
          </Row>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Switch</h3>
        <Row label="States">
          <Switch aria-label="Off" />
          <Switch aria-label="On" defaultChecked />
          <Switch aria-label="Disabled off" disabled />
          <Switch aria-label="Disabled on" disabled defaultChecked />
        </Row>
      </div>
    </div>
  );
}
