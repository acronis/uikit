import * as React from 'react'
import {
  SeparatorHorizontal,
  SeparatorVertical,
  SeparatorWithText,
  SeparatorInNavigation,
  SeparatorInLists,
  SeparatorInCards,
  SeparatorInForms,
  SeparatorInSidebar,
  SeparatorInToolbar,
  SeparatorMultiple,
  SeparatorInGrid,
} from '@acronis-platform/shadcn-uikit-demos/separator'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import separatorHorizontalCode from '../../../demos/src/separator/SeparatorHorizontal.tsx?raw'
import separatorVerticalCode from '../../../demos/src/separator/SeparatorVertical.tsx?raw'
import separatorWithTextCode from '../../../demos/src/separator/SeparatorWithText.tsx?raw'
import separatorInNavigationCode from '../../../demos/src/separator/SeparatorInNavigation.tsx?raw'
import separatorInListsCode from '../../../demos/src/separator/SeparatorInLists.tsx?raw'
import separatorInCardsCode from '../../../demos/src/separator/SeparatorInCards.tsx?raw'
import separatorInFormsCode from '../../../demos/src/separator/SeparatorInForms.tsx?raw'
import separatorInSidebarCode from '../../../demos/src/separator/SeparatorInSidebar.tsx?raw'
import separatorInToolbarCode from '../../../demos/src/separator/SeparatorInToolbar.tsx?raw'
import separatorMultipleCode from '../../../demos/src/separator/SeparatorMultiple.tsx?raw'
import separatorInGridCode from '../../../demos/src/separator/SeparatorInGrid.tsx?raw'

export function SeparatorDemo() {
  return (
    <section className="demo-section">
      <h2>Separator Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Visually or semantically separates content.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Horizontal Separator"
          description="A horizontal line to divide content."
          code={separatorHorizontalCode}
        >
          <SeparatorHorizontal />
        </DemoWithCode>

        <DemoWithCode
          title="Vertical Separator"
          description="A vertical line to divide content horizontally."
          code={separatorVerticalCode}
        >
          <SeparatorVertical />
        </DemoWithCode>

        <DemoWithCode
          title="In Navigation"
          description="Separator used in navigation menus."
          code={separatorInNavigationCode}
        >
          <SeparatorInNavigation />
        </DemoWithCode>

        <DemoWithCode
          title="In Lists"
          description="Separator between list items."
          code={separatorInListsCode}
        >
          <SeparatorInLists />
        </DemoWithCode>

        <DemoWithCode
          title="In Cards"
          description="Separator within card components."
          code={separatorInCardsCode}
        >
          <SeparatorInCards />
        </DemoWithCode>

        <DemoWithCode
          title="With Text"
          description="Separator with centered text."
          code={separatorWithTextCode}
        >
          <SeparatorWithText />
        </DemoWithCode>

        <DemoWithCode
          title="In Forms"
          description="Separator between form sections."
          code={separatorInFormsCode}
        >
          <SeparatorInForms />
        </DemoWithCode>

        <DemoWithCode
          title="In Sidebar"
          description="Separator in sidebar navigation."
          code={separatorInSidebarCode}
        >
          <SeparatorInSidebar />
        </DemoWithCode>

        <DemoWithCode
          title="In Toolbar"
          description="Separator between toolbar groups."
          code={separatorInToolbarCode}
        >
          <SeparatorInToolbar />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Separators"
          description="Multiple sections divided by separators."
          code={separatorMultipleCode}
        >
          <SeparatorMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="In Grid Layout"
          description="Separators in a grid structure."
          code={separatorInGridCode}
        >
          <SeparatorInGrid />
        </DemoWithCode>
      </div>
    </section>
  )
}

