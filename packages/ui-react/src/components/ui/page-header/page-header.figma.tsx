// Figma Code Connect — status: COMPLETE
// Mapped to the Page Header design (shadcn-uikit file, node 2850-701).
import figma from '@figma/code-connect';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderRow,
  PageHeaderTitle,
} from './page-header';

figma.connect(
  PageHeader,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2850-701',
  {
    example: () => (
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>Header title</PageHeaderTitle>
          <PageHeaderActions>{/* actions */}</PageHeaderActions>
        </PageHeaderRow>
      </PageHeader>
    ),
  }
);
