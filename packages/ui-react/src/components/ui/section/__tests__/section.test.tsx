import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AccordionContainer } from '@/components/ui/accordion-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Section, SectionContent, SectionHeader } from '../section';

describe('Section', () => {
  it('renders a composed section with header and content', () => {
    render(
      <Section data-testid="section">
        <SectionHeader title="Backup policies" />
        <SectionContent>All workloads protected.</SectionContent>
      </Section>
    );

    expect(screen.getByText('Backup policies')).toBeInTheDocument();
    expect(screen.getByText('All workloads protected.')).toBeInTheDocument();
  });

  it('renders the default title placeholder when none is given', () => {
    render(<SectionHeader />);
    expect(screen.getByText('Section Title')).toBeInTheDocument();
  });

  it('renders a supplied title instead of the placeholder', () => {
    render(<SectionHeader title="Custom title" />);
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.queryByText('Section Title')).not.toBeInTheDocument();
  });

  it('applies gap and padding for the column1 variant', () => {
    render(<Section data-testid="section">body</Section>);
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('gap-3');
    expect(section).toHaveClass('px-4');
    expect(section).toHaveClass('pt-4');
  });

  it('applies gap and padding for the column2-70-30 variant', () => {
    render(
      <Section variant="column2-70-30" data-testid="section">
        body
      </Section>
    );
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('gap-3');
    expect(section).toHaveClass('px-4');
    expect(section).toHaveClass('pt-4');
  });

  it('applies gap and padding for the grid3 variant', () => {
    render(
      <Section variant="grid3" data-testid="section">
        body
      </Section>
    );
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('gap-3');
    expect(section).toHaveClass('px-4');
    expect(section).toHaveClass('pt-4');
  });

  it('renders flush, with no padding or gap, for the table variant', () => {
    render(
      <Section variant="table" data-testid="section">
        body
      </Section>
    );
    const section = screen.getByTestId('section');
    expect(section).not.toHaveClass('gap-3');
    expect(section).not.toHaveClass('px-4');
    expect(section).not.toHaveClass('pt-4');
  });

  it('adds the divider and bottom padding on a padded variant with hasBottomBorder', () => {
    render(
      <Section variant="column1" hasBottomBorder data-testid="section">
        body
      </Section>
    );
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('border-b');
    expect(section).toHaveClass(
      'border-[var(--ui-border-on-surface-divider)]'
    );
    expect(section).toHaveClass('pb-4');
  });

  it('adds the divider WITHOUT bottom padding on the table variant with hasBottomBorder', () => {
    render(
      <Section variant="table" hasBottomBorder data-testid="section">
        body
      </Section>
    );
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('border-b');
    expect(section).toHaveClass(
      'border-[var(--ui-border-on-surface-divider)]'
    );
    expect(section).not.toHaveClass('pb-4');
  });

  it('omits the divider when hasBottomBorder is false', () => {
    render(<Section data-testid="section">body</Section>);
    expect(screen.getByTestId('section')).not.toHaveClass('border-b');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Section ref={ref}>body</Section>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('composes as another element via the render prop', () => {
    render(
      <Section render={<section data-testid="section" />}>body</Section>
    );
    expect(screen.getByTestId('section').tagName).toBe('SECTION');
  });
});

describe('SectionHeader', () => {
  it('re-applies horizontal/top/bottom padding under the table variant', () => {
    render(
      <Section variant="table">
        <SectionHeader data-testid="header" />
      </Section>
    );
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('px-4');
    expect(header).toHaveClass('pt-4');
    expect(header).toHaveClass('pb-3');
  });

  it('does not re-apply that padding under the column1 variant', () => {
    render(
      <Section variant="column1">
        <SectionHeader data-testid="header" />
      </Section>
    );
    const header = screen.getByTestId('header');
    expect(header).not.toHaveClass('px-4');
    expect(header).not.toHaveClass('pt-4');
    expect(header).not.toHaveClass('pb-3');
  });

  it('hides the description unless hasDescription is set', () => {
    render(<SectionHeader description="Hidden" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows the description when hasDescription is set', () => {
    render(<SectionHeader description="Visible" hasDescription />);
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('renders extras and actions in their respective slots', () => {
    render(
      <SectionHeader
        extras={<span>Beta</span>}
        actions={<button type="button">Menu</button>}
      />
    );
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  it('does not render extras or actions when not supplied', () => {
    render(<SectionHeader />);
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument();
  });

  it('renders an icon when supplied', () => {
    render(<SectionHeader icon={<span data-testid="icon">*</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('does not render an icon slot when not supplied', () => {
    render(<SectionHeader data-testid="header" />);
    const header = screen.getByTestId('header');
    expect(header.querySelector('[data-testid="icon"]')).toBeNull();
  });

  it('renders a switch with the default accessible label and respects defaultSwitchChecked', () => {
    render(<SectionHeader isSwitchable defaultSwitchChecked />);
    const toggle = screen.getByRole('switch', { name: 'Toggle section' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('fires onSwitchCheckedChange when the switch is clicked', async () => {
    const user = userEvent.setup();
    const onSwitchCheckedChange = vi.fn();
    render(
      <SectionHeader
        isSwitchable
        switchLabel="Enable"
        onSwitchCheckedChange={onSwitchCheckedChange}
      />
    );
    const toggle = screen.getByRole('switch', { name: 'Enable' });
    await user.click(toggle);
    expect(onSwitchCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('honors a controlled switchChecked value', () => {
    render(<SectionHeader isSwitchable switchChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('disables the switch when switchDisabled is set', () => {
    render(<SectionHeader isSwitchable switchDisabled />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not render a switch by default', () => {
    render(<SectionHeader />);
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  it('does not render a collapse trigger outside a collapsible AccordionContainer', () => {
    render(<SectionHeader isCollapsible />);
    expect(
      screen.queryByRole('button', { name: 'Collapse section' })
    ).not.toBeInTheDocument();
  });

  it('renders and operates a collapse trigger inside a collapsible AccordionContainer', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <AccordionContainer collapsible defaultOpen onOpenChange={onOpenChange}>
        <SectionHeader isCollapsible collapseLabel="Toggle band" />
        <AccordionContainer.Content>Body</AccordionContainer.Content>
      </AccordionContainer>
    );
    const trigger = screen.getByRole('button', { name: 'Toggle band' });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('collapses and re-expands content when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader isCollapsible collapseLabel="Toggle band" />
        <AccordionContainer.Content>
          <p>Section body</p>
        </AccordionContainer.Content>
      </AccordionContainer>
    );

    expect(screen.getByText('Section body')).toBeVisible();

    const trigger = screen.getByRole('button', { name: 'Toggle band' });
    await user.click(trigger);
    expect(screen.queryByText('Section body')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText('Section body')).toBeVisible();
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SectionHeader ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('SectionContent', () => {
  it('renders children', () => {
    render(<SectionContent>Body content</SectionContent>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('applies plain full-width layout for the column1 variant, via context', () => {
    render(
      <Section variant="column1">
        <SectionContent data-testid="content">body</SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('w-full');
    expect(content).not.toHaveClass('grid');
  });

  it('applies plain full-width layout for the table variant, via context', () => {
    render(
      <Section variant="table">
        <SectionContent data-testid="content">body</SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('w-full');
    expect(content).not.toHaveClass('grid');
  });

  it('applies the 3-column, first-child-spans-2 grid for column2-70-30, via context', () => {
    render(
      <Section variant="column2-70-30">
        <SectionContent data-testid="content">body</SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('grid');
    expect(content).toHaveClass('grid-cols-3');
    expect(content).toHaveClass('gap-4');
    expect(content).toHaveClass('[&>*:first-child]:col-span-2');
  });

  it('applies the plain 3-column grid for grid3, via context', () => {
    render(
      <Section variant="grid3">
        <SectionContent data-testid="content">body</SectionContent>
      </Section>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('grid');
    expect(content).toHaveClass('grid-cols-3');
    expect(content).toHaveClass('gap-4');
    expect(content).not.toHaveClass('[&>*:first-child]:col-span-2');
  });

  it('falls back to the column1 layout when rendered outside any Section', () => {
    render(<SectionContent data-testid="content">body</SectionContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('w-full');
    expect(content).not.toHaveClass('grid');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SectionContent ref={ref}>body</SectionContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('composes as another element via the render prop', () => {
    render(
      <SectionContent render={<ul data-testid="content" />}>
        <li>item</li>
      </SectionContent>
    );
    expect(screen.getByTestId('content').tagName).toBe('UL');
  });
});

describe('Section + nested Card disclosure independence', () => {
  const renderComposition = () =>
    render(
      <AccordionContainer collapsible defaultOpen>
        <SectionHeader isCollapsible collapseLabel="Toggle section" />
        <AccordionContainer.Content>
          <SectionContent>
            <p>Sibling section content</p>
            <AccordionContainer collapsible defaultOpen>
              <Card>
                <CardHeader
                  title="Nested card"
                  isCollapsible
                  collapseLabel="Toggle card"
                />
                <AccordionContainer.Content>
                  <CardContent>Nested card body</CardContent>
                </AccordionContainer.Content>
              </Card>
            </AccordionContainer>
          </SectionContent>
        </AccordionContainer.Content>
      </AccordionContainer>
    );

  it('hides the nested card entirely when the Section is collapsed, and restores it on re-expand', async () => {
    const user = userEvent.setup();
    renderComposition();

    expect(screen.getByText('Nested card body')).toBeVisible();

    const sectionTrigger = screen.getByRole('button', {
      name: 'Toggle section',
    });
    await user.click(sectionTrigger);

    expect(screen.queryByText('Nested card body')).not.toBeInTheDocument();
    expect(screen.queryByText('Sibling section content')).not.toBeInTheDocument();

    await user.click(sectionTrigger);

    expect(screen.getByText('Nested card body')).toBeVisible();
    expect(screen.getByText('Sibling section content')).toBeVisible();
  });

  it('toggling only the card trigger collapses the card without affecting the rest of the Section content', async () => {
    const user = userEvent.setup();
    renderComposition();

    const cardTrigger = screen.getByRole('button', { name: 'Toggle card' });
    await user.click(cardTrigger);

    expect(screen.queryByText('Nested card body')).not.toBeInTheDocument();
    expect(screen.getByText('Sibling section content')).toBeVisible();

    await user.click(cardTrigger);
    expect(screen.getByText('Nested card body')).toBeVisible();
  });
});
