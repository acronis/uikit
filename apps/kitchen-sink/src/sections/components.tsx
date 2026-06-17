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
  SidebarPrimary,
  SidebarPrimaryCollapseTrigger,
  SidebarPrimaryContent,
  SidebarPrimaryFooter,
  SidebarPrimaryHeader,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
  SidebarPrimarySection,
  SidebarSecondary,
  SidebarSecondaryCollapseTrigger,
  SidebarSecondaryContent,
  SidebarSecondaryFooter,
  SidebarSecondaryHeader,
  SidebarSecondaryMenu,
  SidebarSecondaryMenuItem,
  SidebarSecondaryMenuSub,
  SidebarSecondaryMenuSubContent,
  SidebarSecondaryMenuSubItem,
  SidebarSecondaryMenuSubTrigger,
  SidebarSecondarySection,
  SidebarSecondarySectionLabel,
  Switch,
  Tag,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@acronis-platform/ui-react';
import {
  BoxIcon,
  CircleCheckIcon,
  CircleHelpIcon,
  LayoutGridIcon,
  PanelLeftIcon,
  PlusIcon,
  ServerIcon,
  UsersIcon,
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

const FOCUS_RING =
  '0 0 0 2px var(--ui-background-surface-primary), 0 0 0 4px var(--ui-focus-brand)';

// Hover/active/focus only trigger on real interaction, so the spec matrix
// forces each cell to a static state by overriding the component's colors with
// the matching next-gen `--ui-button-*` state tokens. Focus reuses the idle
// colors and adds the design's focus ring. Idle/disabled render the real
// component (idle untouched, disabled via the `disabled` prop) so its own
// styling is exercised. The container fill is
// `--ui-button-<variant>-container-color-*` (a gradient for `ai`); the border
// only exists for the `secondary`/`inverted` variants (`-container-border-color-*`)
// — for the others the var is undefined, so the declaration is ignored and the
// component's transparent border shows.
function forcedStyle(
  token: string,
  state: 'hover' | 'active' | 'focus',
  gradient: boolean
): CSSProperties {
  const cs = state === 'focus' ? 'idle' : state;
  const style: CSSProperties = gradient
    ? { backgroundImage: `var(--ui-button-${token}-container-color-${cs})` }
    : { backgroundColor: `var(--ui-button-${token}-container-color-${cs}, transparent)` };
  style.color = `var(--ui-button-${token}-label-color-${cs})`;
  // Only `secondary`/`inverted` define a border token; for the others the var is
  // undefined and falls back to `transparent` (an undefined var in an inline
  // longhand would otherwise compute to `currentColor` and paint a stray border).
  style.borderColor = `var(--ui-button-${token}-container-border-color-${cs}, transparent)`;
  if (state === 'focus') style.boxShadow = FOCUS_RING;
  return style;
}

// ButtonIcon shares one container/glyph color set under
// `--ui-button-icon-global-*`; the `secondary` variant adds a 1px border
// (`--ui-button-icon-secondary-container-border-color-*`). `ghost` (default) has
// no border, so its border var is undefined and falls back to transparent.
type IconVariant = 'ghost' | 'secondary';

function forcedIconStyle(
  state: 'hover' | 'active' | 'focus',
  variant: IconVariant
): CSSProperties {
  const cs = state === 'focus' ? 'idle' : state;
  const style: CSSProperties = {
    backgroundColor: `var(--ui-button-icon-global-container-color-${cs})`,
    color: `var(--ui-button-icon-global-icon-color-${cs})`,
  };
  if (variant === 'secondary') {
    style.borderColor = `var(--ui-button-icon-secondary-container-border-color-${cs}, transparent)`;
  }
  if (state === 'focus') style.boxShadow = FOCUS_RING;
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
    <Button variant={variant} style={forcedStyle(token, state, variant === 'ai')}>
      Label
    </Button>
  );
}

const ICON_VARIANTS: { variant: IconVariant; label: string }[] = [
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'secondary', label: 'Secondary' },
];

function ButtonIconCell({ variant, state }: { variant: IconVariant; state: State }) {
  if (state === 'idle')
    return (
      <ButtonIcon variant={variant} aria-label="Add">
        <PlusIcon />
      </ButtonIcon>
    );
  if (state === 'disabled')
    return (
      <ButtonIcon variant={variant} aria-label="Add" disabled>
        <PlusIcon />
      </ButtonIcon>
    );
  return (
    <ButtonIcon variant={variant} aria-label="Add" style={forcedIconStyle(state, variant)}>
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
        <h3 style={{ marginBottom: 12 }}>ButtonIcon — styles × states</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '110px repeat(5, max-content)',
            gap: '14px 20px',
            alignItems: 'center',
          }}
        >
          <ColumnHeaders />
          {ICON_VARIANTS.map((v) => (
            <Fragment key={v.variant}>
              <span style={{ fontSize: 13, color: 'var(--ui-text-on-surface-primary)' }}>
                {v.label}
              </span>
              {STATES.map((state) => (
                <ButtonIconCell key={state} variant={v.variant} state={state} />
              ))}
            </Fragment>
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
        <Row label="With label">
          <Switch label="Notifications" />
          <Switch label="Auto-update" defaultChecked />
          <Switch label="Disabled" disabled defaultChecked />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--ui-text-on-surface-secondary)' }}>
            With label &amp; description
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
            <Checkbox label="Email notifications" />
            <Checkbox label="Auto-renew" defaultChecked />
            <Checkbox
              label="Share usage data"
              description="Anonymous analytics to help improve the product."
            />
          </div>
        </div>
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
            <Tag variant="ai">AI</Tag>
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

      <div>
        <h3 style={{ marginBottom: 12 }}>Sidebars — primary &amp; secondary</h3>
        {/* Sidebars fill their container height; bound them to a fixed shell. */}
        <div style={{ display: 'flex', gap: 16, height: 440 }}>
          <SidebarPrimary>
            <SidebarPrimaryHeader>
              <PlusIcon />
            </SidebarPrimaryHeader>
            <SidebarPrimaryContent>
              <SidebarPrimarySection>
                <SidebarPrimaryMenu>
                  <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>
                    Assets
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<ServerIcon />}>
                    Protection
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>
                    Clients
                  </SidebarPrimaryMenuItem>
                  <SidebarPrimaryMenuItem href="#" icon={<LayoutGridIcon />}>
                    Automation
                  </SidebarPrimaryMenuItem>
                </SidebarPrimaryMenu>
              </SidebarPrimarySection>
            </SidebarPrimaryContent>
            <SidebarPrimaryFooter>
              <SidebarPrimaryMenu>
                <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>
                  Help
                </SidebarPrimaryMenuItem>
                <SidebarPrimaryCollapseTrigger icon={<PanelLeftIcon />}>
                  Collapse menu
                </SidebarPrimaryCollapseTrigger>
              </SidebarPrimaryMenu>
            </SidebarPrimaryFooter>
          </SidebarPrimary>

          <SidebarSecondary>
            <SidebarSecondaryHeader label="Protection" />
            <SidebarSecondaryContent>
              <SidebarSecondarySection>
                <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>
                <SidebarSecondaryMenu>
                  <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>
                    Dashboard
                  </SidebarSecondaryMenuItem>
                  <SidebarSecondaryMenuItem href="#" icon={<ServerIcon />}>
                    Devices
                  </SidebarSecondaryMenuItem>
                </SidebarSecondaryMenu>
              </SidebarSecondarySection>
              <SidebarSecondarySection>
                <SidebarSecondarySectionLabel>Configuration</SidebarSecondarySectionLabel>
                <SidebarSecondaryMenu>
                  <SidebarSecondaryMenuSub defaultOpen>
                    <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>
                      Policies
                    </SidebarSecondaryMenuSubTrigger>
                    <SidebarSecondaryMenuSubContent>
                      <SidebarSecondaryMenuSubItem href="#" selected>
                        Backup
                      </SidebarSecondaryMenuSubItem>
                      <SidebarSecondaryMenuSubItem href="#">
                        Antivirus
                      </SidebarSecondaryMenuSubItem>
                    </SidebarSecondaryMenuSubContent>
                  </SidebarSecondaryMenuSub>
                </SidebarSecondaryMenu>
              </SidebarSecondarySection>
            </SidebarSecondaryContent>
            <SidebarSecondaryFooter>
              <SidebarSecondaryMenu>
                <SidebarSecondaryCollapseTrigger icon={<PanelLeftIcon />}>
                  Collapse menu
                </SidebarSecondaryCollapseTrigger>
              </SidebarSecondaryMenu>
            </SidebarSecondaryFooter>
          </SidebarSecondary>
        </div>
      </div>
    </div>
  );
}
