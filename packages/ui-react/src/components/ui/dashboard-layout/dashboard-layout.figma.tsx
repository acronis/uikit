// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via `/figma-component DashboardLayout <url> --update`.
import figma from '@figma/code-connect';

import { DashboardGrid, DashboardLayout } from './dashboard-layout';

figma.connect(DashboardLayout, 'FIGMA_NODE_URL', {
  example: () => (
    <DashboardLayout>
      <DashboardGrid cols={3}>{/* widgets */}</DashboardGrid>
    </DashboardLayout>
  ),
});
