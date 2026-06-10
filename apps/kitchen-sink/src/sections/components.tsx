import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonIcon,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Search,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tag,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@acronis-platform/ui-react';
import {
  CircleCheckIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

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

// Fixed-width wrapper for the full-width form controls (Input/Search/Select).
function Field({ width = 200, children }: { width?: number; children: ReactNode }) {
  return <div style={{ width }}>{children}</div>;
}

const radioRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 14,
  color: 'var(--ui-text-on-surface-primary)',
};

const FRUITS = { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' };

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
        <h3 style={{ marginBottom: 12 }}>Button — with icon</h3>
        <Row label="With icon">
          <Button>
            <PlusIcon /> Add item
          </Button>
          <Button variant="secondary">
            <PlusIcon /> Add item
          </Button>
        </Row>
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

      <div>
        <h3 style={{ marginBottom: 12 }}>Checkbox</h3>
        <Row label="States">
          <Checkbox aria-label="Unchecked" />
          <Checkbox aria-label="Checked" defaultChecked />
          <Checkbox aria-label="Indeterminate" indeterminate />
          <Checkbox aria-label="Disabled" disabled />
          <Checkbox aria-label="Disabled checked" disabled defaultChecked />
        </Row>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Radio</h3>
        <RadioGroup defaultValue="standard" aria-label="Plan">
          <label style={radioRow}>
            <Radio value="standard" /> Standard
          </label>
          <label style={radioRow}>
            <Radio value="pro" /> Pro
          </label>
          <label style={radioRow}>
            <Radio value="enterprise" disabled /> Enterprise (disabled)
          </label>
        </RadioGroup>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Input</h3>
        <Row label="States">
          <Field>
            <Input aria-label="Idle" placeholder="Placeholder" />
          </Field>
          <Field>
            <Input aria-label="Filled" defaultValue="Value" />
          </Field>
          <Field>
            <Input aria-label="Invalid" aria-invalid defaultValue="Bad value" />
          </Field>
          <Field>
            <Input aria-label="Disabled" placeholder="Disabled" disabled />
          </Field>
        </Row>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Search</h3>
        <Row label="States">
          <Field width={240}>
            <Search aria-label="Search" placeholder="Search" />
          </Field>
          <Field width={240}>
            <Search aria-label="Filled" defaultValue="Query" />
          </Field>
          <Field width={240}>
            <Search aria-label="Disabled" placeholder="Search" disabled />
          </Field>
        </Row>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Select</h3>
        <Row label="States">
          <Field width={224}>
            <Select items={FRUITS}>
              <SelectTrigger aria-label="Fruit">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field width={224}>
            <Select items={FRUITS} defaultValue="banana">
              <SelectTrigger aria-label="With value">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field width={224}>
            <Select disabled>
              <SelectTrigger aria-label="Disabled">
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Row>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Breadcrumb</h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Devices</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workstation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Tag</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Row label="Variants">
            <Tag variant="info">Info</Tag>
            <Tag variant="success">Success</Tag>
            <Tag variant="warning">Warning</Tag>
            <Tag variant="critical">Critical</Tag>
            <Tag variant="danger">Danger</Tag>
            <Tag variant="neutral">Neutral</Tag>
          </Row>
          <Row label="Sizes & icon">
            <Tag variant="success" icon={<CircleCheckIcon />}>
              Active
            </Tag>
            <Tag variant="neutral" size="sm">
              Small
            </Tag>
          </Row>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 12 }}>Tooltip</h3>
        <Row label="Open">
          <Tooltip defaultOpen>
            <TooltipTrigger
              render={<Button variant="secondary">Hover me</Button>}
            />
            <TooltipContent side="bottom">Helpful hint</TooltipContent>
          </Tooltip>
        </Row>
      </div>
    </div>
  );
}
