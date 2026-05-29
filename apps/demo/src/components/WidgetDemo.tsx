import * as React from 'react'
import {
  WidgetAll,
  WidgetBasic,
  WidgetSizes,
  WidgetInteractive,
  WidgetWithIcon,
  WidgetValueDisplay,
  WidgetWithDivider,
  WidgetMinimal,
  WidgetDashboardGrid,
} from '@acronis-platform/shadcn-uikit-demos/widget'
import { DemoWithCode } from './DemoWithCode'

import widgetAllCode from '../../../demos/src/widget/WidgetAll.tsx?raw'
import widgetBasicCode from '../../../demos/src/widget/WidgetBasic.tsx?raw'
import widgetSizesCode from '../../../demos/src/widget/WidgetSizes.tsx?raw'
import widgetInteractiveCode from '../../../demos/src/widget/WidgetInteractive.tsx?raw'
import widgetWithIconCode from '../../../demos/src/widget/WidgetWithIcon.tsx?raw'
import widgetValueDisplayCode from '../../../demos/src/widget/WidgetValueDisplay.tsx?raw'
import widgetWithDividerCode from '../../../demos/src/widget/WidgetWithDivider.tsx?raw'
import widgetMinimalCode from '../../../demos/src/widget/WidgetMinimal.tsx?raw'
import widgetDashboardGridCode from '../../../demos/src/widget/WidgetDashboardGrid.tsx?raw'

export function WidgetDemo() {
  return (
    <section className="demo-section">
      <h2>Dashboard Widgets</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Chart widgets, progress indicators, alerts, data tables, and text metrics for dashboards.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Widget"
          description="Simple widget with header, content, and footer sections."
          code={widgetBasicCode}
        >
          <WidgetBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Size Variants"
          description="Widgets come in four sizes: sm, md, lg, and xl."
          code={widgetSizesCode}
        >
          <WidgetSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Interactive Widget"
          description="Interactive widgets respond to hover, active, and focus states."
          code={widgetInteractiveCode}
        >
          <WidgetInteractive />
        </DemoWithCode>

        <DemoWithCode
          title="With Icon and Actions"
          description="Widget header with icon, title, and an actions slot for dropdown triggers."
          code={widgetWithIconCode}
        >
          <WidgetWithIcon />
        </DemoWithCode>

        <DemoWithCode
          title="Value Display"
          description="KPI-style widgets using WidgetValue and WidgetLabel for prominent metrics."
          code={widgetValueDisplayCode}
        >
          <WidgetValueDisplay />
        </DemoWithCode>

        <DemoWithCode
          title="With Divider"
          description="Use WidgetDivider to separate multiple content sections within a single widget."
          code={widgetWithDividerCode}
        >
          <WidgetWithDivider />
        </DemoWithCode>

        <DemoWithCode
          title="Minimal Widget"
          description="Content-only widgets without header or footer."
          code={widgetMinimalCode}
        >
          <WidgetMinimal />
        </DemoWithCode>

        <DemoWithCode
          title="Dashboard Grid"
          description="Multiple widgets arranged in a responsive grid layout."
          code={widgetDashboardGridCode}
        >
          <WidgetDashboardGrid />
        </DemoWithCode>

        <DemoWithCode
          title="All Widget Types"
          description="Comprehensive showcase including charts, progress, alerts, tables, text metrics, and placeholders."
          code={widgetAllCode}
        >
          <WidgetAll />
        </DemoWithCode>
      </div>
    </section>
  );
}
