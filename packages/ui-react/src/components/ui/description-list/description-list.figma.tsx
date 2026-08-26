// Figma Code Connect — status: NEEDS_FIGMA_URL
// Not backed by a shared design-system design. The mapped node below is the
// "Service status" key-value list in the **Cyber-Compliance** file — a
// product-specific design, not the shared ui-react design system file — so this
// mapping is a product mapping, not a design-system source of truth. This
// component is the pattern backing that one list; whether it gets formalized as
// a generic kit component (with its own shared-file design, variants and states)
// is still an open decision. Until it does, treat the node URL as informational
// and don't read this as a COMPLETE design-system connection.
import figma from '@figma/code-connect';

import {
  DescriptionList,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
} from './description-list';

figma.connect(
  DescriptionList,
  'https://www.figma.com/design/hc8FRfvlHBqZwNYUsD0DaX/Cyber-Compliance?node-id=3001-20448',
  {
    example: () => (
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListLabel>Backup</DescriptionListLabel>
          <DescriptionListValue>Success</DescriptionListValue>
        </DescriptionListItem>
      </DescriptionList>
    ),
  }
);
