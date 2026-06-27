// Figma Code Connect — status: COMPLETE
// Mapped to the "Service status" key-value list (Cyber-Compliance file).
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
