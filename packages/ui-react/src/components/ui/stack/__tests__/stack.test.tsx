import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from '../index';

describe('Stack', () => {
  it('defaults to a vertical flex column with md gap', () => {
    render(<Stack data-testid="s">x</Stack>);
    const el = screen.getByTestId('s');
    expect(el.className).toContain('flex');
    expect(el.className).toContain('flex-col');
    expect(el.className).toContain('gap-4');
  });

  it('applies direction / gap / align / justify variants', () => {
    render(
      <Stack data-testid="s" direction="horizontal" gap="lg" align="center" justify="between">
        x
      </Stack>
    );
    const c = screen.getByTestId('s').className;
    expect(c).toContain('flex-row');
    expect(c).toContain('gap-6');
    expect(c).toContain('items-center');
    expect(c).toContain('justify-between');
  });

  it('wraps when wrap is set', () => {
    render(<Stack data-testid="s" wrap>x</Stack>);
    expect(screen.getByTestId('s').className).toContain('flex-wrap');
  });
});
