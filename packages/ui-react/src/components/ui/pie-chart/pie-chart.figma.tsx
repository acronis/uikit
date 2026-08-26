// Figma Code Connect — status: COMPLETE
// ChartDonut component (node 8811:172438, type=donut variant).
// `type` in Figma discriminates donut vs. radial; the variant filter below
// restricts this connection to donut instances only. RadialBarChart owns
// the `type=radial` half in its own .figma.tsx.
import figma from '@figma/code-connect';

import { PieChart } from './pie-chart';

figma.connect(
  PieChart,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8811-172438',
  {
    variant: { type: 'donut' },
    example: () => (
      <PieChart
        shape="donut"
        dataKey="value"
        nameKey="browser"
        config={{
          Chrome: { label: 'Chrome' },
          Safari: { label: 'Safari' },
        }}
        data={[
          { browser: 'Chrome', value: 275 },
          { browser: 'Safari', value: 200 },
        ]}
      />
    ),
  }
);
