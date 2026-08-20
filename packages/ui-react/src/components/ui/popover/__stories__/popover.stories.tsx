import * as React from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within } from 'storybook/test';

import { Button } from '../../button';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverPortal,
  PopoverTrigger,
} from '../popover';
import { PortalContainerProvider } from '@/lib/portal-container';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the popover opens or closes.',
      table: {
        type: { summary: '(open, eventDetails) => void' },
        category: 'Events',
      },
    },
    children: {
      control: false,
      description: 'A `PopoverTrigger` and a `PopoverContent`.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger
        render={<Button variant="secondary">Open popover</Button>}
      />
      <PopoverContent>
        <PopoverBody>
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Filters</Button>} />
      <PopoverContent>
        <PopoverBody>
          <p className="text-sm text-muted-foreground">
            Apply filters to the current view.
          </p>
        </PopoverBody>
        <PopoverFooter>
          <Button variant="ghost">Reset</Button>
          <Button>Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
};

// The exact recipe shown by the Figma node: a text body plus the
// `FooterDefault` (variant=default) action row — Cancel + Apply.
export const WithFooter: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger
        render={<Button variant="secondary">Open popover</Button>}
      />
      <PopoverContent>
        <PopoverBody>
          <p className="text-sm text-foreground">
            Drop any content into this slot.
          </p>
        </PopoverBody>
        <PopoverFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ),
};

// Regression coverage for PLTFRM-92756: reproduces a constrained MFE/Shadow
// DOM host (a small, offset, overflow-hidden mount point) via
// PortalContainerProvider. PopoverContent must default to `fixed` positioning
// so the popup stays fully visible instead of being clipped at the mount's
// own edge — the platform's own collision boundary already resolves against
// the real viewport once positioning is `fixed`.
function ConstrainedPortalContainerExample() {
  const [mount, setMount] = React.useState<HTMLDivElement | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        The dashed box simulates a constrained MFE/Shadow DOM host container
        (small, offset, <code>overflow: hidden</code>). The popover portals
        inside it but must stay fully visible against the viewport.
      </p>
      <div
        ref={setMount}
        className="relative h-40 w-72 overflow-hidden rounded border border-dashed border-border"
      >
        {mount && (
          <PortalContainerProvider container={mount}>
            <div className="absolute inset-0 flex items-start justify-end p-2">
              <Popover defaultOpen>
                <PopoverTrigger
                  render={<Button variant="secondary">Open</Button>}
                />
                <PopoverContent>
                  <PopoverBody>
                    <p className="text-sm text-foreground">
                      Escapes the constrained container.
                    </p>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </div>
          </PortalContainerProvider>
        )}
      </div>
    </div>
  );
}

export const InConstrainedPortalContainer: Story = {
  name: 'Inside a constrained portal container (regression)',
  parameters: { snapshot: { fullPage: true } },
  render: () => <ConstrainedPortalContainerExample />,
};

// Companion to the regression above: `portal={false}` hands portaling off to
// a `PopoverPortal` the *caller* supplies (Base UI requires some ancestor
// Portal — it's never truly portal-less), which may not target the resolved
// `PortalContainerProvider` container at all — here it uses the Portal
// default (document.body). PopoverContent has no way to know where a
// caller-supplied Portal actually mounts, so it must not assume the
// provider's constrained container applies: it keeps the platform default
// (absolute, no explicit collision boundary) even though a
// PortalContainerProvider is in scope.
function CallerSuppliedPortalExample() {
  const [mount, setMount] = React.useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setMount}
      className="relative h-40 w-72 overflow-hidden rounded border border-dashed border-border p-2"
    >
      {mount && (
        <PortalContainerProvider container={mount}>
          <Popover defaultOpen>
            <PopoverTrigger
              render={<Button variant="secondary">Open</Button>}
            />
            <PopoverPortal>
              <PopoverContent
                portal={false}
                data-testid="caller-portaled-popup"
              >
                <PopoverBody>
                  <p className="text-sm text-foreground">
                    Caller-supplied PopoverPortal — unaffected by the provider.
                  </p>
                </PopoverBody>
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        </PortalContainerProvider>
      )}
    </div>
  );
}

export const CallerSuppliedPortalIgnoresProviderDefaults: Story = {
  name: 'portal={false} (caller-supplied Portal) ignores the provider defaults',
  render: () => <CallerSuppliedPortalExample />,
  play: async () => {
    // Renders with `defaultOpen`, so the popup is already open — clicking the
    // trigger here would toggle it closed instead of asserting on it.
    const body = within(document.body);
    const popup = await body.findByTestId('caller-portaled-popup');
    // Stays 'absolute' (the platform default), not 'fixed' — proves the
    // provider's fixed/viewport-boundary defaults were not applied just
    // because a PortalContainerProvider happened to be in scope.
    const positioner = popup.parentElement;
    if (positioner && getComputedStyle(positioner).position !== 'absolute') {
      throw new Error(
        `Expected PopoverContent to keep 'absolute' positioning, got '${getComputedStyle(positioner).position}'`
      );
    }
  },
};

// Simulates the primary real-world case `portalContainer` exists for: a
// Shadow DOM MFE host (see `portal-container.tsx`'s `PortalContainerProvider`
// doc, "the recommended way for shadow-DOM MFEs"). No other story portals
// into a *real* ShadowRoot — this one attaches one and adopts ui-react's own
// compiled styles into it, mirroring `apps/docs/src/components/ShadowDemo.tsx`.
// Storybook's preview already does `import '../src/styles/index.css'`
// (`.storybook/preview.ts`), so — unlike the docs site, which fetches the
// compiled CSS over HTTP — the stylesheet is already present in the preview
// iframe's document. It's read from the already-parsed `document.styleSheets`
// (each sheet's `cssRules` re-serialized into one combined `CSSStyleSheet`,
// adopted by the shadow root) rather than cloning `<style>`/`<link>` tags —
// dev-mode CSS is injected progressively, so cloning tags present at mount
// time can race and miss rules added afterward; reading the live CSSOM avoids
// that race and also sidesteps `<link>` tags never resolving inside a shadow
// root. Without this, the popup and trigger would mount but render unstyled.
//
// Everything — trigger included — is portaled into the shadow root via
// `createPortal` (not just rendered as a light-DOM child of the host): a
// host with a shadow root attached no longer renders its own light-DOM
// children (no `<slot>` here), so a trigger left in the light DOM would be
// present but invisible.
function ShadowDomPortalContainerExample() {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [mount, setMount] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // A shadow root can only be attached once per element, so on a re-run
    // (React Strict Mode double-invokes effects in dev) reuse the existing
    // one rather than bailing — bailing here would leave `mount` unset after
    // the first run's cleanup cancelled it.
    let root = host.shadowRoot;
    if (!root) {
      root = host.attachShadow({ mode: 'open' });
      const sheet = new CSSStyleSheet();
      const cssText = [...document.styleSheets]
        .map((styleSheet) => {
          try {
            return [...styleSheet.cssRules].map((rule) => rule.cssText).join('\n');
          } catch {
            // Cross-origin stylesheets throw on `cssRules` access — none are
            // expected here, but skip rather than fail the whole sheet.
            return '';
          }
        })
        .join('\n');
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
      const wrapper = document.createElement('div');
      wrapper.className = 'absolute inset-0 flex items-start justify-end p-2';
      root.appendChild(wrapper);
    }
    setMount(root.querySelector<HTMLDivElement>('.absolute'));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        The dashed box is a constrained host with a real{' '}
        <code>ShadowRoot</code> attached inside it — the primary real-world
        case <code>portalContainer</code> exists for (a Shadow DOM MFE). The
        popover portals inside the shadow root but must stay fully visible
        against the viewport.
      </p>
      <div
        ref={hostRef}
        className="relative h-40 w-72 overflow-hidden rounded border border-dashed border-border"
      />
      {mount &&
        createPortal(
          <PortalContainerProvider container={mount}>
            <Popover defaultOpen>
              <PopoverTrigger
                render={<Button variant="secondary">Open</Button>}
              />
              <PopoverContent portalContainer={mount}>
                <PopoverBody>
                  <p className="text-sm text-foreground">
                    Escapes the shadow host&apos;s clipping.
                  </p>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </PortalContainerProvider>,
          mount
        )}
    </div>
  );
}

export const InShadowDomPortalContainer: Story = {
  name: 'Inside a Shadow DOM portal container',
  parameters: { snapshot: { fullPage: true } },
  render: () => <ShadowDomPortalContainerExample />,
};

// Regression coverage for the `useResolvedPortalContainerNode` fix in
// `popover.tsx`: a plain `Boolean(container)`/inline resolution of a ref
// object mounted in the *same commit* as the Popover still sees
// `current: null` during render (React attaches refs during commit, before
// any layout effect runs), so it wrongly kept 'absolute' positioning. The
// Vitest regression test ("switches to fixed positioning when
// portalContainer is a ref attached in the same commit", popover.test.tsx)
// covers this against happy-dom; this story exercises the same shape through
// the real browser paint/animation pipeline that storybook:test:visual runs
// against. Uses `useRef` (not `useState`) and reads `portalContainer` off the
// ref unconditionally in the same render — no `{mount && ...}` gating, since
// that gating (via a callback ref + re-render) is exactly what previously
// masked the bug.
function RefObjectPortalContainerExample() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-40 w-72 overflow-hidden rounded border border-dashed border-border">
      {/* Must be a preceding sibling of the Popover, not its ancestor: React
          commits refs bottom-up (children before parents), so a wrapping
          ancestor's own ref would attach *after* a descendant's mount-time
          layout effect already ran and read a stale `current: null` — the
          opposite of the same-commit race this story exists to reproduce. An
          earlier sibling's ref commits before the next sibling's subtree is
          processed, matching the Vitest `Wrapper`'s shape. */}
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-start justify-end p-2">
        <Popover defaultOpen>
          <PopoverTrigger
            render={<Button variant="secondary">Open</Button>}
          />
          <PopoverContent
            portalContainer={containerRef}
            data-testid="ref-object-popup"
          >
            <PopoverBody>
              <p className="text-sm text-foreground">
                Portal container resolved from a same-commit ref.
              </p>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export const WithRefObjectPortalContainer: Story = {
  name: 'portalContainer as a same-commit RefObject (regression)',
  render: () => <RefObjectPortalContainerExample />,
  play: async () => {
    // Renders with `defaultOpen`, so the popup is already open.
    const body = within(document.body);
    const popup = await body.findByTestId('ref-object-popup');
    const positioner = popup.parentElement;
    if (positioner && getComputedStyle(positioner).position !== 'fixed') {
      throw new Error(
        `Expected PopoverContent to use 'fixed' positioning, got '${getComputedStyle(positioner).position}'`
      );
    }
  },
};
