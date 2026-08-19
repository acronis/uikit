import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AccordionContainer } from '../index';

describe('AccordionContainer', () => {
  describe('collapsible=false', () => {
    it('renders children directly with no trigger and no panel wrapper', () => {
      render(
        <AccordionContainer collapsible={false}>
          <AccordionContainer.Trigger data-testid="trigger" />
          <AccordionContainer.Content>
            <p>Body content</p>
          </AccordionContainer.Content>
        </AccordionContainer>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trigger')).not.toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeVisible();
    });

    it('defaults collapsible to false when omitted', () => {
      render(
        <AccordionContainer>
          <AccordionContainer.Trigger data-testid="trigger" />
          <AccordionContainer.Content>Body content</AccordionContainer.Content>
        </AccordionContainer>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeVisible();
    });

    it('calls the render-prop children with open: false', () => {
      const children = vi.fn(() => <p>Body</p>);
      render(<AccordionContainer collapsible={false}>{children}</AccordionContainer>);

      expect(children).toHaveBeenCalledWith({ open: false });
    });
  });

  describe('collapsible=true — uncontrolled', () => {
    it('renders a trigger and toggles the panel on click', async () => {
      render(
        <AccordionContainer collapsible defaultOpen={false}>
          <AccordionContainer.Trigger />
          <AccordionContainer.Content>Hidden content</AccordionContainer.Content>
        </AccordionContainer>
      );

      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Hidden content')).toBeVisible();
    });

    it('renders open when defaultOpen is set', () => {
      render(
        <AccordionContainer collapsible defaultOpen>
          <AccordionContainer.Trigger />
          <AccordionContainer.Content>Shown content</AccordionContainer.Content>
        </AccordionContainer>
      );

      expect(screen.getByText('Shown content')).toBeVisible();
    });

    it('sets data-panel-open on the trigger for chevron rotation, and clears it when closed', async () => {
      render(
        <AccordionContainer collapsible defaultOpen>
          <AccordionContainer.Trigger data-testid="trigger" />
          <AccordionContainer.Content>Content</AccordionContainer.Content>
        </AccordionContainer>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('data-panel-open');

      await userEvent.click(trigger);
      expect(trigger).not.toHaveAttribute('data-panel-open');
    });

    it('passes the current open state to the render-prop children as it toggles', async () => {
      const children = vi.fn(({ open }: { open: boolean }) => (
        <>
          <AccordionContainer.Trigger />
          <span data-testid="state">{open ? 'expanded' : 'collapsed'}</span>
        </>
      ));

      render(
        <AccordionContainer collapsible defaultOpen={false}>
          {children}
        </AccordionContainer>
      );

      expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    });
  });

  describe('collapsible=true — controlled', () => {
    it('reflects the controlled open prop and calls onOpenChange without flipping internal state on its own', async () => {
      const onOpenChange = vi.fn();

      function Controlled() {
        const [open, setOpen] = React.useState(false);
        return (
          <AccordionContainer
            collapsible
            open={open}
            onOpenChange={(next, details) => {
              onOpenChange(next, details);
              setOpen(next);
            }}
          >
            <AccordionContainer.Trigger />
            <AccordionContainer.Content>Controlled content</AccordionContainer.Content>
          </AccordionContainer>
        );
      }

      render(<Controlled />);

      expect(screen.queryByText('Controlled content')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('button'));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.getByText('Controlled content')).toBeVisible();
    });

    it('passes the controlled open value to the render-prop children', () => {
      const children = vi.fn(() => <AccordionContainer.Trigger />);

      render(
        <AccordionContainer collapsible open onOpenChange={() => {}}>
          {children}
        </AccordionContainer>
      );

      expect(children).toHaveBeenCalledWith({ open: true });
    });
  });

  describe('style isolation', () => {
    it('Root renders no wrapping element (and no className) when collapsible=false', () => {
      const { container } = render(
        <AccordionContainer collapsible={false}>
          <p>content</p>
        </AccordionContainer>
      );

      expect(container.querySelector('div')).not.toBeInTheDocument();
    });

    it('Root applies no default className when collapsible=true', () => {
      const { container } = render(
        <AccordionContainer collapsible defaultOpen>
          <AccordionContainer.Content>content</AccordionContainer.Content>
        </AccordionContainer>
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.className).toBe('');
    });

    it('Trigger className carries only hit-target sizing and reset, no color/spacing opinion', () => {
      render(
        <AccordionContainer collapsible>
          <AccordionContainer.Trigger />
        </AccordionContainer>
      );

      const classes = screen.getByRole('button').className.split(/\s+/);
      const disallowed = classes.filter((c) =>
        /^(m[trblxy]?-|bg-\[var|hover:bg|rounded-(?!none)|absolute|ml-auto)/.test(c)
      );
      expect(disallowed).toEqual([]);
    });

    it('Content className carries only height-animation classes, no padding/background', () => {
      render(
        <AccordionContainer collapsible defaultOpen>
          <AccordionContainer.Content data-testid="content">body</AccordionContainer.Content>
        </AccordionContainer>
      );

      const classes = screen.getByTestId('content').className.split(/\s+/);
      const disallowed = classes.filter((c) => /^(p[trblxy]?-|bg-|border)/.test(c));
      expect(disallowed).toEqual([]);
    });
  });

  it('forwards a ref to the underlying element when collapsible', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AccordionContainer collapsible ref={ref}>
        <AccordionContainer.Content>content</AccordionContainer.Content>
      </AccordionContainer>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
