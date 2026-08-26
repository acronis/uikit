// Figma Code Connect — status: COMPLETE
// The Figma node is the ChartRadar widget frame; this connection maps the chart
// content only. Card chrome and width variants belong to the consuming widget.
import figma from '@figma/code-connect';

import { RadarChart } from './radar-chart';

figma.connect(
  RadarChart,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9005-73086',
  {
    props: {
      gridType: figma.enum('Grid type', {
        Polygon: 'polygon',
        Circle: 'circle',
      }),
    },
    example: ({ gridType }) => (
      <RadarChart
        gridType={gridType}
        showDots
        angleKey="subject"
        dataKeys={['alice', 'bob']}
        config={{
          alice: { label: 'Alice' },
          bob: { label: 'Bob' },
        }}
        data={[{ subject: 'Math', alice: 120, bob: 110 }]}
      />
    ),
  }
);
