import * as React from 'react'
import {
  SpinnerBasic,
  SpinnerSizes,
  SpinnerWithText,
  SpinnerButton,
  SpinnerCentered,
  SpinnerCard,
  SpinnerInline,
  SpinnerOverlay,
  SpinnerColors,
  SpinnerGrid,
  SpinnerSkeleton,
} from '@acronis-platform/shadcn-uikit-demos/spinner'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import spinnerBasicCode from '../../../demos/src/spinner/SpinnerBasic.tsx?raw'
import spinnerSizesCode from '../../../demos/src/spinner/SpinnerSizes.tsx?raw'
import spinnerWithTextCode from '../../../demos/src/spinner/SpinnerWithText.tsx?raw'
import spinnerButtonCode from '../../../demos/src/spinner/SpinnerButton.tsx?raw'
import spinnerCenteredCode from '../../../demos/src/spinner/SpinnerCentered.tsx?raw'
import spinnerCardCode from '../../../demos/src/spinner/SpinnerCard.tsx?raw'
import spinnerInlineCode from '../../../demos/src/spinner/SpinnerInline.tsx?raw'
import spinnerOverlayCode from '../../../demos/src/spinner/SpinnerOverlay.tsx?raw'
import spinnerColorsCode from '../../../demos/src/spinner/SpinnerColors.tsx?raw'
import spinnerGridCode from '../../../demos/src/spinner/SpinnerGrid.tsx?raw'
import spinnerSkeletonCode from '../../../demos/src/spinner/SpinnerSkeleton.tsx?raw'

export function SpinnerDemo() {
  return (
    <section className="demo-section">
      <h2>Spinner (Loading) Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Loading indicators to show progress and inform users that content is being loaded.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Spinner"
          description="Simple spinner without any text."
          code={spinnerBasicCode}
        >
          <SpinnerBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Spinner Sizes"
          description="Different spinner sizes: small, medium, large, and extra large."
          code={spinnerSizesCode}
        >
          <SpinnerSizes />
        </DemoWithCode>

        <DemoWithCode
          title="Spinner with Text"
          description="Spinner with accompanying text label."
          code={spinnerWithTextCode}
        >
          <SpinnerWithText />
        </DemoWithCode>

        <DemoWithCode
          title="Centered Loading State"
          description="Centered spinner for full-page or container loading states."
          code={spinnerCenteredCode}
        >
          <SpinnerCentered />
        </DemoWithCode>

        <DemoWithCode
          title="Button with Loading State"
          description="Button showing loading spinner when action is in progress."
          code={spinnerButtonCode}
        >
          <SpinnerButton />
        </DemoWithCode>

        <DemoWithCode
          title="Card with Loading State"
          description="Card component showing loading state."
          code={spinnerCardCode}
        >
          <SpinnerCard />
        </DemoWithCode>

        <DemoWithCode
          title="Inline Loading"
          description="Inline spinner for loading within text or small components."
          code={spinnerInlineCode}
        >
          <SpinnerInline />
        </DemoWithCode>

        <DemoWithCode
          title="Loading Overlay"
          description="Full overlay loading state for blocking interactions."
          code={spinnerOverlayCode}
        >
          <SpinnerOverlay />
        </DemoWithCode>

        <DemoWithCode
          title="Custom Colors"
          description="Spinners with custom colors."
          code={spinnerColorsCode}
        >
          <SpinnerColors />
        </DemoWithCode>

        <DemoWithCode
          title="Loading States Grid"
          description="Common loading state patterns."
          code={spinnerGridCode}
        >
          <SpinnerGrid />
        </DemoWithCode>

        <DemoWithCode
          title="List Loading Skeleton"
          description="Loading state for list items."
          code={spinnerSkeletonCode}
        >
          <SpinnerSkeleton />
        </DemoWithCode>
      </div>
    </section>
  )
}
