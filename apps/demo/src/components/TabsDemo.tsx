import * as React from 'react'
import {
  TabsBasic,
  TabsAccountSettings,
  TabsMultiple,
  TabsFullWidth,
  TabsDisabled,
  TabsProduct,
  TabsDashboard,
  TabsDocumentation,
  TabsCompact,
  TabsVertical,
} from '@acronis-platform/shadcn-uikit-demos/tabs'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import tabsBasicCode from '../../../demos/src/tabs/TabsBasic.tsx?raw'
import tabsAccountSettingsCode from '../../../demos/src/tabs/TabsAccountSettings.tsx?raw'
import tabsMultipleCode from '../../../demos/src/tabs/TabsMultiple.tsx?raw'
import tabsFullWidthCode from '../../../demos/src/tabs/TabsFullWidth.tsx?raw'
import tabsDisabledCode from '../../../demos/src/tabs/TabsDisabled.tsx?raw'
import tabsProductCode from '../../../demos/src/tabs/TabsProduct.tsx?raw'
import tabsDashboardCode from '../../../demos/src/tabs/TabsDashboard.tsx?raw'
import tabsDocumentationCode from '../../../demos/src/tabs/TabsDocumentation.tsx?raw'
import tabsCompactCode from '../../../demos/src/tabs/TabsCompact.tsx?raw'
import tabsVerticalCode from '../../../demos/src/tabs/TabsVertical.tsx?raw'

export function TabsDemo() {
  return (
    <section className="demo-section">
      <h2>Tabs Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used as additional navigation between content within a subsection. The content is switched
        without reloading the page.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Tabs"
          description="Simple tabs with content panels."
          code={tabsBasicCode}
        >
          <TabsBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Account Settings"
          description="Tabs for managing account settings."
          code={tabsAccountSettingsCode}
        >
          <TabsAccountSettings />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Tabs"
          description="Tabs with multiple options."
          code={tabsMultipleCode}
        >
          <TabsMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Full Width Tabs"
          description="Tabs that span the full width."
          code={tabsFullWidthCode}
        >
          <TabsFullWidth />
        </DemoWithCode>

        <DemoWithCode
          title="Disabled Tab"
          description="Tabs with a disabled option."
          code={tabsDisabledCode}
        >
          <TabsDisabled />
        </DemoWithCode>

        <DemoWithCode
          title="Product Details"
          description="Tabs for product information."
          code={tabsProductCode}
        >
          <TabsProduct />
        </DemoWithCode>

        <DemoWithCode
          title="Dashboard Sections"
          description="Tabs for different dashboard views."
          code={tabsDashboardCode}
        >
          <TabsDashboard />
        </DemoWithCode>

        <DemoWithCode
          title="Documentation Tabs"
          description="Tabs for documentation sections."
          code={tabsDocumentationCode}
        >
          <TabsDocumentation />
        </DemoWithCode>

        <DemoWithCode
          title="Compact Tabs"
          description="Smaller tabs for compact layouts."
          code={tabsCompactCode}
        >
          <TabsCompact />
        </DemoWithCode>

        <DemoWithCode
          title="Vertical Layout"
          description="Tabs with content displayed vertically."
          code={tabsVerticalCode}
        >
          <TabsVertical />
        </DemoWithCode>
      </div>
    </section>
  );
}
