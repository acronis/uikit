// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { BarChart } from './bar-chart';

// Vertical mode (Layout=Grouped / Stacked) — node 8804-170895
figma.connect(BarChart, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8804-170895&m=dev', {
  props: {
    layout: figma.enum('Layout', {
      Grouped: 'grouped',
      Stacked: 'stacked',
    }),
  },
  example: ({ layout }) => (
    <BarChart
      layout={layout}
      xKey="month"
      dataKeys={['desktop', 'mobile']}
      config={{
        desktop: { label: 'Desktop' },
        mobile: { label: 'Mobile' },
      }}
      data={[{ month: 'Jan', desktop: 186, mobile: 80 }]}
    />
  ),
});

// Horizontal mode (labelled proportional bars) — node 8804-170619
figma.connect(BarChart, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8804-170619&m=dev', {
  props: {},
  example: () => (
    <BarChart
      orientation="horizontal"
      palette={{ type: 'status' }}
      items={[
        { label: 'Category 1', value: 21, tone: { status: 'danger' } },
        { label: 'Category 2', value: 39, tone: { status: 'warning' } },
      ]}
      max={125}
    />
  ),
});

// Horizontal mode with forecast — node 8982-27501
figma.connect(BarChart, 'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8982-27501&m=dev', {
  props: {},
  example: () => (
    <BarChart
      orientation="horizontal"
      palette={{ type: 'status' }}
      items={[
        { label: 'Category 1', value: 21, tone: { status: 'danger' }, forecast: 28 },
        { label: 'Category 2', value: 39, tone: { status: 'warning' }, forecast: 46 },
      ]}
      max={125}
    />
  ),
});
