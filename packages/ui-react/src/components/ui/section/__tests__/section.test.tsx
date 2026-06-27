import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '../index';

describe('Section', () => {
  it('renders a section landmark with its parts', () => {
    const { container } = render(
      <Section>
        <SectionHeader>
          <SectionTitle>Backups</SectionTitle>
          <SectionDescription>Manage your backup plans.</SectionDescription>
        </SectionHeader>
        <SectionContent>body</SectionContent>
      </Section>
    );
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.getByText('Backups').tagName).toBe('H2');
    expect(screen.getByText('Manage your backup plans.')).toHaveClass(
      'text-muted-foreground'
    );
    expect(screen.getByText('body')).toBeInTheDocument();
  });
});
