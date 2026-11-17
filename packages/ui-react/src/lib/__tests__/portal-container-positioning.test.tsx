import { createRef, useRef } from 'react';
import type { ReactElement, RefObject } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputSelect,
  InputSelectContent,
  InputSelectItem,
  InputSelectTrigger,
  InputSelectValue,
} from '@/components/ui/input-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PortalContainerProvider } from '@/lib/portal-container';

type PortalTarget =
  | HTMLElement
  | ShadowRoot
  | RefObject<HTMLElement | ShadowRoot | null>
  | null
  | undefined;

interface PopupCase {
  name: string;
  render: (portalContainer?: PortalTarget) => ReactElement;
}

const popupCases: PopupCase[] = [
  {
    name: 'Popover',
    render: (portalContainer) => (
      <Popover defaultOpen>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent data-testid="popup" portalContainer={portalContainer}>
          Popup
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: 'Tooltip',
    render: (portalContainer) => (
      <Tooltip defaultOpen>
        <TooltipTrigger>Open tooltip</TooltipTrigger>
        <TooltipContent data-testid="popup" portalContainer={portalContainer}>
          Popup
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: 'DropdownMenu',
    render: (portalContainer) => (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent
          data-testid="popup"
          portalContainer={portalContainer}
        >
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: 'InputSelect',
    render: (portalContainer) => (
      <InputSelect defaultOpen items={[{ value: 'one', label: 'One' }]}>
        <InputSelectTrigger>
          <InputSelectValue />
        </InputSelectTrigger>
        <InputSelectContent
          data-testid="popup"
          portalContainer={portalContainer}
        >
          <InputSelectItem value="one">One</InputSelectItem>
        </InputSelectContent>
      </InputSelect>
    ),
  },
  {
    name: 'Combobox',
    render: (portalContainer) => (
      <Combobox defaultOpen items={[{ value: 'one', label: 'One' }]}>
        <ComboboxInput aria-label="Search" />
        <ComboboxContent data-testid="popup" portalContainer={portalContainer}>
          <ComboboxList>
            {(item: { value: string; label: string }) => (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    ),
  },
];

describe.each(popupCases)(
  '$name portal positioning',
  ({ render: renderPopup }) => {
    it('uses fixed positioning inside a resolved provider container', () => {
      const portalContainer = document.createElement('div');
      document.body.appendChild(portalContainer);

      const view = render(
        <PortalContainerProvider container={portalContainer}>
          {renderPopup()}
        </PortalContainerProvider>
      );

      const popup = portalContainer.querySelector('[data-testid="popup"]');
      expect(popup).not.toBeNull();
      expect(popup?.parentElement).toHaveStyle({ position: 'fixed' });

      view.unmount();
      portalContainer.remove();
    });

    it('resolves a ref attached in the same commit', () => {
      function Example() {
        const portalContainerRef = useRef<HTMLDivElement>(null);
        return (
          <>
            <div ref={portalContainerRef} />
            {renderPopup(portalContainerRef)}
          </>
        );
      }

      render(<Example />);

      expect(screen.getByTestId('popup').parentElement).toHaveStyle({
        position: 'fixed',
      });
    });

    it('keeps the platform default when the portal ref is unresolved', () => {
      const portalContainerRef = createRef<HTMLDivElement>();
      render(renderPopup(portalContainerRef));

      expect(screen.getByTestId('popup').parentElement).toHaveStyle({
        position: 'absolute',
      });
    });

    it('keeps the platform default when no portal container is configured', () => {
      render(renderPopup());

      expect(screen.getByTestId('popup').parentElement).toHaveStyle({
        position: 'absolute',
      });
    });
  }
);
