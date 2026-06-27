import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../index';

function Basic() {
  return (
    <Accordion>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionContent>Panel A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionContent>Panel B</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers with accessible heading semantics', () => {
    render(<Basic />);
    expect(screen.getByRole('button', { name: 'Section A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Section B' })).toBeInTheDocument();
  });

  it('expands a panel when its trigger is clicked', async () => {
    render(<Basic />);
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Section A' }));
    expect(screen.getByText('Panel A')).toBeVisible();
  });

  it('collapses others by default (single mode)', async () => {
    render(<Basic />);
    await userEvent.click(screen.getByRole('button', { name: 'Section A' }));
    await userEvent.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByText('Panel B')).toBeVisible();
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument();
  });

  it('keeps multiple panels open when multiple is set', async () => {
    render(
      <Accordion multiple>
        <AccordionItem value="a">
          <AccordionTrigger>Section A</AccordionTrigger>
          <AccordionContent>Panel A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Section B</AccordionTrigger>
          <AccordionContent>Panel B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Section A' }));
    await userEvent.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByText('Panel A')).toBeVisible();
    expect(screen.getByText('Panel B')).toBeVisible();
  });
});
