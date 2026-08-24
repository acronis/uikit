import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CardSection } from '../card-section';
import { CardContent, CardHeader } from '../../card';

describe('CardSection', () => {
  it('renders the slot content by default', () => {
    render(<CardSection content={<p>Slot body</p>} />);

    expect(screen.getByText('Slot body')).toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardSection ref={ref} content="Body" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('composes another element through the render prop', () => {
    const { container } = render(
      <CardSection render={<section aria-label="Details" />} content="Body" />
    );

    expect(container.querySelector('section')).not.toBeNull();
    expect(screen.getByLabelText('Details')).toBeInTheDocument();
  });

  describe('header', () => {
    it('is hidden by default', () => {
      render(<CardSection content="Body" />);

      expect(screen.queryByText('Section Title')).not.toBeInTheDocument();
    });

    it('renders the title, extras and actions when hasHeader is set', () => {
      render(
        <CardSection
          hasHeader
          title="Network"
          extras={<span>extra</span>}
          actions={<button type="button">Act</button>}
          content="Body"
        />
      );

      expect(screen.getByText('Network')).toBeInTheDocument();
      expect(screen.getByText('extra')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Act' })
      ).toBeInTheDocument();
    });

    it('requires a title at compile time when hasHeader is true', () => {
      render(
        // @ts-expect-error `hasHeader` is only valid together with `title`.
        <CardSection hasHeader content="Body" />
      );

      // `title` may likewise not be passed without `hasHeader`.
      render(
        // @ts-expect-error `title` is only valid together with `hasHeader`.
        <CardSection title="Orphan" content="Body" />
      );

      expect(screen.queryByText('Orphan')).not.toBeInTheDocument();
    });
  });

  describe('hasBottomBorder', () => {
    it('adds no divider by default', () => {
      const { container } = render(<CardSection content="Body" />);

      expect(container.firstElementChild?.className).not.toContain('border-b');
    });

    it('adds the divider token and bottom padding when set', () => {
      const { container } = render(
        <CardSection hasBottomBorder content="Body" />
      );

      const className = container.firstElementChild?.className ?? '';
      expect(className).toContain('border-b');
      expect(className).toContain('var(--ui-border-on-surface-divider)');
      expect(className).toContain('pb-4');
    });
  });

  describe('variants', () => {
    it('insets every variant except table-actions', () => {
      const { container: slot } = render(<CardSection variant="slot" />);
      expect(slot.firstElementChild?.className).toContain('px-4');

      const { container: table } = render(
        <CardSection variant="table-actions" />
      );
      expect(table.firstElementChild?.className).not.toContain('px-4');
    });

    it('renders contentTag for the tag variant', () => {
      render(<CardSection variant="tag" contentTag={<span>Only mine</span>} />);

      expect(screen.getByText('Only mine')).toBeInTheDocument();
    });

    it('renders contentList for the list variant', () => {
      render(<CardSection variant="list" contentList={<dl>Rows</dl>} />);

      expect(screen.getByText('Rows')).toBeInTheDocument();
    });

    it('renders contentTable and its own inset header for table-actions', () => {
      render(
        <CardSection
          variant="table-actions"
          hasHeader
          title="Subnets"
          contentTable={<table />}
        />
      );

      const heading = screen.getByText('Subnets');
      expect(heading.parentElement?.parentElement?.className).toContain('px-4');
    });

    it('nests children inside a Card for card-primary', () => {
      const { container } = render(
        <CardSection variant="card-primary">
          <CardHeader title="Nested" />
          <CardContent>Inner</CardContent>
        </CardSection>
      );

      const nested = container.querySelector('.rounded-lg');
      expect(nested?.className).toContain(
        'var(--ui-background-surface-primary)'
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Inner')).toBeInTheDocument();
    });

    it('uses the secondary surface token for card-secondary', () => {
      const { container } = render(
        <CardSection variant="card-secondary">
          <CardContent>Inner</CardContent>
        </CardSection>
      );

      const nested = container.querySelector('.rounded-lg');
      expect(nested?.className).toContain(
        'var(--ui-background-surface-secondary)'
      );
    });
  });
});
