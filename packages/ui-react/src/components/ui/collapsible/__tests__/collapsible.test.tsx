import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../index';

describe('Collapsible', () => {
  it('toggles the panel content on trigger click', async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Hidden content')).toBeVisible();
  });

  it('renders open when defaultOpen is set', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Shown content</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText('Shown content')).toBeVisible();
  });
});
