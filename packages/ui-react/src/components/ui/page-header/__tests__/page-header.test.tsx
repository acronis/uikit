import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
} from '../index';

describe('PageHeader', () => {
  it('renders the banner with title, description, breadcrumb and actions', () => {
    render(
      <PageHeader>
        <PageHeaderBreadcrumb>Home / Reports</PageHeaderBreadcrumb>
        <PageHeaderRow>
          <PageHeaderTitle>Reports</PageHeaderTitle>
          <PageHeaderActions>
            <button>New</button>
          </PageHeaderActions>
        </PageHeaderRow>
        <PageHeaderDescription>All scheduled reports.</PageHeaderDescription>
      </PageHeader>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Reports').tagName).toBe('H1');
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByText('All scheduled reports.')).toHaveClass('text-muted-foreground');
  });
});
