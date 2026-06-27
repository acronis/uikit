import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Toggle, ToggleGroup, ToggleGroupItem } from '../index';

describe('Toggle', () => {
  it('toggles its pressed state on click', async () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const btn = screen.getByRole('button', { name: 'Bold' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not toggle when disabled', async () => {
    render(
      <Toggle aria-label="Bold" disabled>
        B
      </Toggle>
    );
    const btn = screen.getByRole('button', { name: 'Bold' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ToggleGroup', () => {
  it('presses the clicked item', async () => {
    render(
      <ToggleGroup aria-label="Alignment">
        <ToggleGroupItem value="left" aria-label="Left">
          L
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">
          C
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const left = screen.getByRole('button', { name: 'Left' });
    expect(left).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(left);
    expect(left).toHaveAttribute('aria-pressed', 'true');
  });

  it('reflects the controlled value', () => {
    render(
      <ToggleGroup value={['center']} aria-label="Alignment">
        <ToggleGroupItem value="left" aria-label="Left">
          L
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">
          C
        </ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
