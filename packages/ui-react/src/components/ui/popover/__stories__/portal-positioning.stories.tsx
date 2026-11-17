import * as React from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../../combobox';
import { Button } from '../../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../dropdown-menu';
import {
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
} from '../../input-select';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from '../popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip';
import { PortalContainerProvider } from '@/lib/portal-container';

const meta = {
  title: 'UI/Portal positioning',
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type PopupKind =
  | 'Popover'
  | 'Tooltip'
  | 'DropdownMenu'
  | 'InputSelect'
  | 'Combobox';

function PopupExample({ kind }: { kind: PopupKind }) {
  switch (kind) {
    case 'Popover':
      return (
        <Popover defaultOpen>
          <PopoverTrigger
            render={<Button variant="secondary">Manage access</Button>}
          />
          <PopoverContent data-testid="positioned-popup" style={{ width: 280 }}>
            <PopoverBody>
              <h4 className="font-medium leading-none">Workspace access</h4>
              <p className="text-sm text-muted-foreground">
                Invite a teammate to this workspace.
              </p>
            </PopoverBody>
            <PopoverFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Invite</Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      );
    case 'Tooltip':
      return (
        <Tooltip defaultOpen>
          <TooltipTrigger
            render={<Button variant="secondary">Sync status</Button>}
          />
          <TooltipContent data-testid="positioned-popup">
            Last synced a few seconds ago.
          </TooltipContent>
        </Tooltip>
      );
    case 'DropdownMenu':
      return (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger
            render={<Button variant="secondary">More actions</Button>}
          />
          <DropdownMenuContent data-testid="positioned-popup">
            <DropdownMenuItem>Open settings</DropdownMenuItem>
            <DropdownMenuItem>Copy workspace link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    case 'InputSelect':
      return (
        <InputSelect
          defaultOpen
          items={[
            { value: 'admin', label: 'Administrator' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        >
          <InputSelectField className="w-64">
            <InputSelectLabel>Default role</InputSelectLabel>
            <InputSelectTrigger>
              <InputSelectValue placeholder="Choose a role" />
            </InputSelectTrigger>
          </InputSelectField>
          <InputSelectContent data-testid="positioned-popup">
            <InputSelectItem value="admin">Administrator</InputSelectItem>
            <InputSelectItem value="editor">Editor</InputSelectItem>
            <InputSelectItem value="viewer">Viewer</InputSelectItem>
          </InputSelectContent>
        </InputSelect>
      );
    case 'Combobox':
      return (
        <Combobox
          defaultOpen
          items={[
            { value: 'platform', label: 'Platform team' },
            { value: 'security', label: 'Security team' },
            { value: 'support', label: 'Support team' },
          ]}
        >
          <ComboboxInput
            aria-label="Search teams"
            containerClassName="w-64"
            placeholder="Search teams"
          />
          <ComboboxContent data-testid="positioned-popup">
            <ComboboxList>
              {(item: { value: string; label: string }) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      );
  }
}

function ShadowRootPortalExample({ kind }: { kind: PopupKind }) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [mount, setMount] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let root = host.shadowRoot;
    if (!root) {
      root = host.attachShadow({ mode: 'open' });
      const sheet = new CSSStyleSheet();
      const cssText = [...document.styleSheets]
        .map((styleSheet) => {
          try {
            return [...styleSheet.cssRules]
              .map((rule) => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
    }

    let panel = root.querySelector<HTMLDivElement>('[data-panel-content]');
    if (!panel) {
      panel = document.createElement('div');
      panel.dataset.panelContent = '';
      panel.className = 'min-h-[280px] w-full bg-background p-4';

      const heading = document.createElement('div');
      heading.className = 'flex items-start justify-between gap-3';

      const copy = document.createElement('div');
      const title = document.createElement('p');
      title.className = 'text-sm font-semibold text-foreground';
      title.textContent = 'Workspace settings';
      const subtitle = document.createElement('p');
      subtitle.className = 'mt-1 text-xs text-muted-foreground';
      subtitle.textContent = 'Manage people and access.';
      copy.append(title, subtitle);

      const badge = document.createElement('span');
      badge.className =
        'rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground';
      badge.textContent = 'ACTIVE';
      heading.append(copy, badge);
      panel.appendChild(heading);

      const summary = document.createElement('div');
      summary.className = 'mt-4 flex items-center gap-2';
      for (const label of ['2 members', '1 team']) {
        const chip = document.createElement('span');
        chip.className =
          'rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground';
        chip.textContent = label;
        summary.appendChild(chip);
      }
      panel.appendChild(summary);
      root.appendChild(panel);
    }

    let portalMount = panel.querySelector<HTMLDivElement>(
      '[data-portal-mount]'
    );
    if (!portalMount) {
      portalMount = document.createElement('div');
      portalMount.dataset.portalMount = '';
      portalMount.className =
        'relative mt-4 flex h-12 w-full items-center justify-end px-4';
      panel.appendChild(portalMount);

      const scrollSpace = document.createElement('div');
      scrollSpace.style.height = '96px';
      panel.appendChild(scrollSpace);
    }
    setMount(portalMount);
  }, []);

  return (
    <div className="flex w-96 flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Embedded workspace
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          The popup stays visible and follows its control as this panel scrolls.
        </p>
      </div>
      <div
        ref={hostRef}
        data-shadow-host
        className="relative h-40 w-96 overflow-auto rounded-lg border border-border bg-background shadow-sm"
      />
      {mount &&
        createPortal(
          <PortalContainerProvider container={mount}>
            <PopupExample kind={kind} />
          </PortalContainerProvider>,
          mount
        )}
    </div>
  );
}

function storyFor(kind: PopupKind): Story {
  return {
    name: `${kind} inside a real ShadowRoot`,
    parameters: { snapshot: { fullPage: true } },
    render: () => <ShadowRootPortalExample kind={kind} />,
    play: async ({ canvasElement }) => {
      if (!navigator.webdriver) return;

      const host =
        canvasElement.querySelector<HTMLElement>('[data-shadow-host]');
      expect(host).not.toBeNull();

      await waitFor(() => {
        expect(host!.shadowRoot).not.toBeNull();
        expect(
          host!.shadowRoot?.querySelector('[data-testid="positioned-popup"]')
        ).not.toBeNull();
      });

      const shadowRoot = host!.shadowRoot!;
      const popup = shadowRoot.querySelector<HTMLElement>(
        '[data-testid="positioned-popup"]'
      )!;
      const trigger = shadowRoot.querySelector<HTMLElement>(
        'button[data-popup-open]'
      )!;
      const positioner = popup.parentElement!;

      expect(popup).not.toBeNull();
      expect(trigger).not.toBeNull();
      expect(positioner).not.toBeNull();
      expect(window.getComputedStyle(positioner).position).toBe('fixed');

      const initialPopupTop = popup.getBoundingClientRect().top;
      const initialTriggerTop = trigger.getBoundingClientRect().top;
      host!.scrollTop = 12;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      expect(host!.scrollTop).toBe(12);
      expect(trigger.getBoundingClientRect().top).toBeLessThan(
        initialTriggerTop
      );
      expect(popup.getBoundingClientRect().top).toBeLessThan(initialPopupTop);
    },
  };
}

export const PopoverInShadowRoot = storyFor('Popover');
export const TooltipInShadowRoot = storyFor('Tooltip');
export const DropdownMenuInShadowRoot = storyFor('DropdownMenu');
export const InputSelectInShadowRoot = storyFor('InputSelect');
export const ComboboxInShadowRoot = storyFor('Combobox');
