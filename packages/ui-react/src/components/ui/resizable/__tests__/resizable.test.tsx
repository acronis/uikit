import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../resizable';

const Group = ({
  orientation = 'horizontal',
  withHandle,
  handleClassName,
}: {
  orientation?: 'horizontal' | 'vertical';
  withHandle?: boolean;
  handleClassName?: string;
}) => (
  <ResizablePanelGroup orientation={orientation}>
    <ResizablePanel defaultSize={50}>One</ResizablePanel>
    <ResizableHandle withHandle={withHandle} className={handleClassName} />
    <ResizablePanel defaultSize={50}>Two</ResizablePanel>
  </ResizablePanelGroup>
);

describe('Resizable', () => {
  it('renders the panels and a separator handle', () => {
    render(<Group />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders the grab-bar grip only when withHandle is set', () => {
    const { rerender } = render(<Group />);
    expect(screen.getByRole('separator').children).toHaveLength(0);

    rerender(<Group withHandle />);
    expect(screen.getByRole('separator').children).toHaveLength(1);
  });

  it('forwards className to the handle', () => {
    render(<Group handleClassName="custom-handle" />);
    expect(screen.getByRole('separator')).toHaveClass('custom-handle');
  });

  it('reflects orientation on the separator (vertical group → horizontal divider)', () => {
    const { rerender } = render(<Group orientation="horizontal" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');

    rerender(<Group orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('keeps the separator keyboard-focusable', async () => {
    render(<Group />);
    const handle = screen.getByRole('separator');
    await userEvent.tab();
    expect(handle).toHaveFocus();
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  it('uses tokenized divider/grip/focus colors', () => {
    render(<Group withHandle />);
    const handle = screen.getByRole('separator');
    expect(handle).toHaveClass(
      'after:bg-[var(--ui-resizable-border-color-hover)]',
      'active:after:bg-[var(--ui-resizable-border-color-active)]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
    expect(handle.firstElementChild).toHaveClass('bg-[var(--ui-resizable-bar-color)]');
  });
});
