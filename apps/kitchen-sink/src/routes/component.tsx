import { useParams } from 'react-router-dom';

import { SpecimenPage } from '@/lib/specimen';
import { KsLink } from '@/lib/nav';
import { findComponent } from '@/components/registry';

export function ComponentRoute() {
  const { slug } = useParams();
  const entry = findComponent(slug);

  if (!entry) {
    return (
      <SpecimenPage
        title="Not found"
        description={`No component matches "${slug ?? ''}".`}
      >
        <KsLink to="/components" style={{ color: 'var(--ui-text-on-surface-link)' }}>
          ← All components
        </KsLink>
      </SpecimenPage>
    );
  }

  const { Specimen } = entry;
  return <Specimen />;
}
