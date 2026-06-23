import { SpecimenPage } from '@/lib/specimen';
import { KsLink } from '@/lib/nav';
import { COMPONENTS } from '@/components/registry';

export function ComponentsIndex() {
  return (
    <SpecimenPage
      title="Components"
      description="Every implemented ui-react component, each on its own route with a Figma-style variant × state sheet. Pick one below or from the sidebar."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {COMPONENTS.map((c) => (
          <KsLink
            key={c.slug}
            to={`/components/${c.slug}`}
            style={{
              display: 'block',
              padding: '16px 18px',
              borderRadius: 8,
              border: '1px solid var(--ui-border-on-surface-border)',
              background: 'var(--ui-background-surface-primary)',
              color: 'var(--ui-text-on-surface-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {c.name}
          </KsLink>
        ))}
      </div>
    </SpecimenPage>
  );
}
