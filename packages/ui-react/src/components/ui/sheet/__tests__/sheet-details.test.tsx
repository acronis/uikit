import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../../button';
import { SheetDetails } from '../index';

const properties = [
  { label: 'Status', value: 'Protected' },
  { label: 'Owner', value: 'ken99@example.com' },
];

describe('SheetDetails', () => {
  it('renders the title and a property list in the content state', () => {
    render(<SheetDetails open title="Workload details" properties={properties} />);
    expect(screen.getByText('Workload details')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Protected')).toBeInTheDocument();
    expect(screen.getByText('ken99@example.com')).toBeInTheDocument();
  });

  it('shows a spinner in the loading state', () => {
    render(<SheetDetails open title="Details" contentState="loading" properties={properties} />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('shows an empty state with custom copy', () => {
    render(
      <SheetDetails
        open
        title="Details"
        contentState="empty"
        emptyTitle="No workload selected"
      />
    );
    expect(screen.getByText('No workload selected')).toBeInTheDocument();
  });

  it('shows an error state', () => {
    render(<SheetDetails open title="Details" contentState="error" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders footer actions when provided', () => {
    render(
      <SheetDetails
        open
        title="Details"
        properties={properties}
        actions={<Button>Edit</Button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders custom children over the property list', () => {
    render(
      <SheetDetails open title="Details" properties={properties}>
        <p>Custom body</p>
      </SheetDetails>
    );
    expect(screen.getByText('Custom body')).toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });
});
