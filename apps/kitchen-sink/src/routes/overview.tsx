import { SpecimenPage } from '@/lib/specimen';
import { KsLink } from '@/lib/nav';
import { COMPONENTS } from '@/components/registry';

const SECTIONS: { to: string; title: string; blurb: string }[] = [
  { to: '/tokens', title: 'Tokens', blurb: 'Semantic + per-component --ui-* tokens, live per brand & scheme.' },
  { to: '/typography', title: 'Typography', blurb: 'The .ui-typography-* scale with live samples and metrics.' },
  { to: '/components', title: 'Components', blurb: `${COMPONENTS.length} components, each with Figma-style state sheets.` },
  { to: '/icons', title: 'Icons', blurb: 'All four icons-react packs at every size.' },
];

const card = {
  display: 'block',
  padding: '20px 22px',
  borderRadius: 10,
  border: '1px solid var(--ui-border-on-surface-border)',
  background: 'var(--ui-background-surface-primary)',
  color: 'var(--ui-text-on-surface-primary)',
  textDecoration: 'none',
} as const;

export function Overview() {
  return (
    <SpecimenPage
      title="Acronis UI — Kitchen Sink"
      description="The designer-review & QA surface for the next-gen UI Kit. It renders everything tokens-pd, ui-react, and icons-react ship — exactly as a published consumer gets it. Switch brand and light/dark from the toolbar; both are reflected in the URL so a view is shareable."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {SECTIONS.map((s) => (
          <KsLink key={s.to} to={s.to} style={card}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{s.title}</div>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 13,
                lineHeight: 1.5,
                color: 'var(--ui-text-on-surface-secondary)',
              }}
            >
              {s.blurb}
            </p>
          </KsLink>
        ))}
      </div>
    </SpecimenPage>
  );
}
