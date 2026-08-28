// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { ScatterChart } from './scatter-chart';

figma.connect(ScatterChart, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9005-73829&m=dev', {
  example: () => (
    <ScatterChart
      xKey="x"
      yKey="y"
      config={{
        a: { label: 'Group A' },
      }}
      series={[
        {
          key: 'a',
          data: [
            { x: 2, y: 55 },
            { x: 4, y: 65 },
          ],
        },
      ]}
    />
  ),
});
