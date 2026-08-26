// Figma Code Connect — status: COMPLETE
// ChartDonut component (node 8811:172438, type=radial variant).
// `type` in Figma discriminates donut vs. radial; the variant filter below
// restricts this connection to radial instances only. PieChart owns
// the `type=donut` half in its own .figma.tsx.
import figma from '@figma/code-connect';

import { RadialBarChart } from './radial-bar-chart';

figma.connect(
  RadialBarChart,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8811-172438',
  {
    variant: { type: 'radial' },
    example: () => (
      <RadialBarChart
        dataKey="value"
        nameKey="browser"
        config={{
          Chrome: { label: 'Chrome' },
          Safari: { label: 'Safari' },
        }}
        data={[
          { browser: 'Chrome', value: 65 },
          { browser: 'Safari', value: 50 },
        ]}
      />
    ),
  }
);
