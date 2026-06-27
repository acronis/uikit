import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageContent } from '../index';

describe('PageContent', () => {
  it('renders a padded content region (not a main landmark)', () => {
    const { container } = render(<PageContent>body</PageContent>);
    const el = container.querySelector('[data-slot="page-content"]')!;
    expect(el.tagName).toBe('DIV');
    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    expect(el.className).toContain('p-6');
    expect(el).toHaveTextContent('body');
  });

  it('merges a custom className', () => {
    const { container } = render(<PageContent className="max-w-3xl" />);
    expect(container.querySelector('[data-slot="page-content"]')).toHaveClass('max-w-3xl');
  });
});
