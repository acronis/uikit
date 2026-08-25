import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AccordionContainer } from '../../accordion-container';
import { Section, SectionContent, SectionHeader } from '../section';

describe('Section', () => {
  it('renders a composed section with a header and content', () => {
    render(
      <Section data-testid="section">
        <SectionHeader
          title="Backup plans"
          description="Manage how your workloads are backed up."
          hasDescription
        />
        <SectionContent>All workloads protected.</SectionContent>
      </Section>
    );

    expect(screen.getByTestId('section').tagName).toBe('SECTION');
    expect(screen.getByText('Backup plans')).toBeInTheDocument();
    expect(
      screen.getByText('Manage how your workloads are backed up.')
    ).toBeInTheDocument();
    expect(screen.getByText('All workloads protected.')).toBeInTheDocument();
  });

  it('insets the three card layouts and leaves the table variant flush', () => {
    const inset = ['column1', 'column2-70-30', 'grid3'] as const;

    for (const variant of inset) {
      const { unmount } = render(
        <Section data-testid="section" variant={variant}>
          body
        </Section>
      );
      const root = screen.getByTestId('section');
      expect(root.className).toContain('px-4');
      expect(root.className).toContain('pt-4');
      unmount();
    }

    render(
      <Section data-testid="table" variant="table">
        body
      </Section>
    );
    const table = screen.getByTestId('table');
    expect(table.className).not.toContain('px-4');
    expect(table.className).not.toContain('pt-4');
  });

  it('defaults to the column1 layout', () => {
    render(<Section data-testid="section">body</Section>);
    expect(screen.getByTestId('section').className).toContain('px-4');
  });

  it('draws no divider by default', () => {
    render(<Section data-testid="section">body</Section>);
    expect(screen.getByTestId('section').className).not.toContain('border-b');
  });

  it('adds the divider and the closing bottom padding when hasBottomBorder is set', () => {
    render(
      <Section data-testid="section" hasBottomBorder>
        body
      </Section>
    );
    const root = screen.getByTestId('section');
    expect(root.className).toContain('border-b');
    expect(root.className).toContain(
      'border-[var(--ui-border-on-surface-divider)]'
    );
    expect(root.className).toContain('pb-4');
  });

  it('keeps the table variant flush even when it draws a divider', () => {
    render(
      <Section data-testid="section" variant="table" hasBottomBorder>
        body
      </Section>
    );
    const root = screen.getByTestId('section');
    expect(root.className).toContain('border-b');
    expect(root.className).not.toContain('pb-4');
    expect(root.className).not.toContain('px-4');
  });

  it('merges a custom className without dropping the base classes', () => {
    render(
      <Section data-testid="section" className="custom-class">
        body
      </Section>
    );
    const root = screen.getByTestId('section');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveClass('flex');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLElement>();
    render(<Section ref={ref}>body</Section>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('replaces the root element via the render prop', () => {
    render(
      <Section render={<article data-testid="section" />}>body</Section>
    );
    expect(screen.getByTestId('section').tagName).toBe('ARTICLE');
  });
});

describe('SectionHeader', () => {
  it('renders no title by default', () => {
    render(<SectionHeader data-testid="header" />);
    expect(screen.getByTestId('header').querySelector('p')).toBeNull();
  });

  it('renders the title at the section heading scale', () => {
    render(<SectionHeader title="Backup plans" />);
    const title = screen.getByText('Backup plans');
    expect(title.className).toContain('text-xl');
    expect(title.className).toContain('font-medium');
    expect(title.className).toContain(
      'text-[var(--ui-text-on-surface-primary)]'
    );
  });

  it('only renders the description when hasDescription is set', () => {
    const { rerender } = render(
      <SectionHeader title="Backup plans" description="Helper text" />
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();

    rerender(
      <SectionHeader
        title="Backup plans"
        description="Helper text"
        hasDescription
      />
    );
    const description = screen.getByText('Helper text');
    expect(description.className).toContain(
      'text-[var(--ui-text-on-surface-secondary)]'
    );
  });

  it('omits the title wrapper entirely so a children-only custom heading leads the row', () => {
    render(
      <SectionHeader data-testid="header">
        <h2 data-testid="custom-heading">Custom</h2>
      </SectionHeader>
    );

    const header = screen.getByTestId('header');
    // An always-rendered `flex-1` wrapper would swallow the row's free space
    // and shove the consumer's heading to the end.
    expect(header.querySelector('.flex-1')).toBeNull();
    expect(header.firstElementChild).toBe(screen.getByTestId('custom-heading'));
  });

  it('keeps the title wrapper when only extras are supplied', () => {
    render(
      <SectionHeader data-testid="header" extras={<span>Beta</span>}>
        <h2 data-testid="custom-heading">Custom</h2>
      </SectionHeader>
    );

    const header = screen.getByTestId('header');
    expect(header.querySelector('.flex-1')).not.toBeNull();
    expect(header.firstElementChild).not.toBe(
      screen.getByTestId('custom-heading')
    );
  });

  it('renders extras next to the title and actions at the end', () => {
    render(
      <SectionHeader
        data-testid="header"
        title="Backup plans"
        extras={<span>Beta</span>}
        actions={<button type="button">More</button>}
      />
    );
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'More' })
    ).toBeInTheDocument();
  });

  it('renders a switch with an overridable accessible label', async () => {
    const onSwitchCheckedChange = vi.fn();
    render(
      <SectionHeader
        title="Email notifications"
        isSwitchable
        switchLabel="Toggle email notifications"
        onSwitchCheckedChange={onSwitchCheckedChange}
      />
    );

    const toggle = screen.getByRole('switch', {
      name: 'Toggle email notifications',
    });
    await userEvent.click(toggle);
    expect(onSwitchCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('renders no switch unless isSwitchable is set', () => {
    render(<SectionHeader title="Backup plans" />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('re-applies the horizontal inset inside a table section', () => {
    render(
      <Section variant="table">
        <SectionHeader data-testid="header" title="Workloads" />
      </Section>
    );
    expect(screen.getByTestId('header').className).toContain('px-4');
  });

  it('does not re-apply the inset inside an already inset section', () => {
    render(
      <Section variant="column1">
        <SectionHeader data-testid="header" title="Workloads" />
      </Section>
    );
    expect(screen.getByTestId('header').className).not.toContain('px-4');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SectionHeader ref={ref} title="Backup plans" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('replaces the header element via the render prop', () => {
    render(
      <SectionHeader
        title="Backup plans"
        render={<header data-testid="header" />}
      />
    );
    expect(screen.getByTestId('header').tagName).toBe('HEADER');
  });
});

describe('SectionContent', () => {
  it('renders children as-is under column1', () => {
    render(
      <Section variant="column1">
        <SectionContent data-testid="content">Body</SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content.className).not.toContain('grid');
    expect(content).toHaveTextContent('Body');
  });

  it('splits the 70/30 layout into a 2:1 span of a 3-column grid', () => {
    render(
      <Section variant="column2-70-30">
        <SectionContent
          data-testid="content"
          secondaryContent={<span>Aside</span>}
        >
          <span>Main</span>
        </SectionContent>
      </Section>
    );

    const content = screen.getByTestId('content');
    expect(content.className).toContain('grid-cols-3');
    expect(screen.getByText('Main').parentElement?.className).toContain(
      'col-span-2'
    );
    expect(screen.getByText('Aside').parentElement?.className).toContain(
      'col-span-1'
    );
  });

  it('omits the second column when no secondaryContent is supplied', () => {
    render(
      <Section variant="column2-70-30">
        <SectionContent data-testid="content">
          <span>Main</span>
        </SectionContent>
      </Section>
    );
    expect(screen.getByTestId('content').children).toHaveLength(1);
  });

  it('flows children into a 3-column grid under grid3', () => {
    render(
      <Section variant="grid3">
        <SectionContent data-testid="content">
          <span>One</span>
          <span>Two</span>
          <span>Three</span>
        </SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content.className).toContain('grid-cols-3');
    expect(content.children).toHaveLength(3);
  });

  it('ignores secondaryContent outside the 70/30 layout', () => {
    render(
      <Section variant="grid3">
        <SectionContent data-testid="content" secondaryContent={<span>Aside</span>}>
          <span>One</span>
        </SectionContent>
      </Section>
    );
    expect(screen.queryByText('Aside')).not.toBeInTheDocument();
  });

  it('imposes no grid under the table variant', () => {
    render(
      <Section variant="table">
        <SectionContent data-testid="content">Rows</SectionContent>
      </Section>
    );
    expect(screen.getByTestId('content').className).not.toContain('grid');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SectionContent ref={ref}>Body</SectionContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('replaces the content element via the render prop', () => {
    render(
      <SectionContent render={<ul data-testid="content" />}>
        Body
      </SectionContent>
    );
    expect(screen.getByTestId('content').tagName).toBe('UL');
  });
});

describe('Section collapse composition', () => {
  it('renders no trigger when the section is not collapsible', () => {
    render(
      <Section>
        <SectionHeader title="Backup plans" />
        <SectionContent>Body</SectionContent>
      </Section>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders no trigger when isCollapsible is set outside an AccordionContainer', () => {
    render(
      <Section>
        <SectionHeader title="Backup plans" isCollapsible />
        <SectionContent>Body</SectionContent>
      </Section>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the content expanded and hides it on toggle', async () => {
    render(
      <Section>
        <AccordionContainer collapsible defaultOpen>
          <SectionHeader
            title="Backup plans"
            isCollapsible
            collapseLabel="Toggle backup plans"
          />
          <AccordionContainer.Content>
            <SectionContent>Body</SectionContent>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Section>
    );

    const trigger = screen.getByRole('button', {
      name: 'Toggle backup plans',
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Body')).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts collapsed for the true-collapsed design state', () => {
    render(
      <Section>
        <AccordionContainer collapsible defaultOpen={false}>
          <SectionHeader title="Backup plans" isCollapsible />
          <AccordionContainer.Content>
            <SectionContent>Body</SectionContent>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Section>
    );

    expect(
      screen.getByRole('button', { name: 'Collapse section' })
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps header and content as the root gap-3 flex children through the AccordionContainer wrapper', () => {
    const { container } = render(
      <Section>
        <AccordionContainer collapsible defaultOpen>
          <SectionHeader title="Backup plans" isCollapsible />
          <AccordionContainer.Content>
            <SectionContent>Body</SectionContent>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Section>
    );

    const root = container.firstElementChild as HTMLElement;
    // AccordionContainer's Root renders as `display: contents`, so it never
    // becomes a box the root's `gap-3` has to space around — the header and
    // the accordion's content panel remain the root's effective flex children.
    expect(root.children).toHaveLength(1);
    expect(root.firstElementChild).toHaveClass('contents!');
    expect(root.className).toContain('gap-3');
  });
});
