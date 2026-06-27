import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  DescriptionList,
  DescriptionListActions,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  DescriptionListValueDescription,
} from '../index';

describe('DescriptionList', () => {
  it('renders label/value pairs in a description list', () => {
    render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Backup</DescriptionListLabel>
          <DescriptionListValue>Success</DescriptionListValue>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListLabel>RMM</DescriptionListLabel>
          <DescriptionListValue>Healthy</DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    );
    expect(screen.getByText('Backup').tagName).toBe('DT');
    expect(screen.getByText('Success').tagName).toBe('DD');
    expect(screen.getByText('RMM')).toBeInTheDocument();
  });

  it('uses a <dl> root', () => {
    const { container } = render(
      <DescriptionList data-testid="dl">
        <DescriptionListItem>
          <DescriptionListLabel>K</DescriptionListLabel>
          <DescriptionListValue>V</DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    );
    expect(container.querySelector('dl')).toBeTruthy();
  });

  it('renders a value description and actions', () => {
    render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Backup</DescriptionListLabel>
          <DescriptionListValue>
            <div>
              Success
              <DescriptionListValueDescription>
                150GB backed up
              </DescriptionListValueDescription>
            </div>
          </DescriptionListValue>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListLabel>EDR</DescriptionListLabel>
          <DescriptionListValue>
            <DescriptionListActions>
              <a href="#fix">Action to fix</a>
              <a href="#alert">View alert</a>
            </DescriptionListActions>
          </DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    );
    expect(screen.getByText('150GB backed up')).toHaveClass('text-muted-foreground');
    expect(screen.getByText('Action to fix')).toBeInTheDocument();
    expect(screen.getByText('View alert')).toBeInTheDocument();
  });

  it('divides items with a top border', () => {
    render(
      <DescriptionListItem data-testid="item">
        <DescriptionListLabel>K</DescriptionListLabel>
        <DescriptionListValue>V</DescriptionListValue>
      </DescriptionListItem>
    );
    expect(screen.getByTestId('item')).toHaveClass('border-t', 'border-border');
  });

  it('forwards the ref on the list', () => {
    const ref = createRef<HTMLDListElement>();
    render(
      <DescriptionList ref={ref}>
        <DescriptionListItem>
          <DescriptionListLabel>K</DescriptionListLabel>
          <DescriptionListValue>V</DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    );
    expect(ref.current?.tagName).toBe('DL');
  });
});
