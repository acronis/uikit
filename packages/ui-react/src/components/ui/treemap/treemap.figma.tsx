// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { Treemap } from './treemap';

figma.connect(
  Treemap,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8999-72036&m=dev',
  {
    example: () => (
      <Treemap
        dataKey="size"
        nameKey="name"
        config={{
          React: { label: 'React' },
          Vue: { label: 'Vue' },
        }}
        data={[
          { name: 'React', size: 2400 },
          { name: 'Vue', size: 1200 },
        ]}
      />
    ),
  }
);
