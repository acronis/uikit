import * as React from 'react'
import {
  CardBasic,
  CardWithFooter,
  CardWithForm,
  CardMultiple,
  CardWithShadow,
  CardSettings,
  CardProduct,
  CardWithImage,
  CardCompact,
  CardInteractive,
  CardVariants,
  CardList,
} from '@acronis-platform/shadcn-uikit-demos/card'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import cardBasicCode from '../../../demos/src/card/CardBasic.tsx?raw'
import cardWithFooterCode from '../../../demos/src/card/CardWithFooter.tsx?raw'
import cardWithFormCode from '../../../demos/src/card/CardWithForm.tsx?raw'
import cardMultipleCode from '../../../demos/src/card/CardMultiple.tsx?raw'
import cardWithShadowCode from '../../../demos/src/card/CardWithShadow.tsx?raw'
import cardSettingsCode from '../../../demos/src/card/CardSettings.tsx?raw'
import cardProductCode from '../../../demos/src/card/CardProduct.tsx?raw'
import cardWithImageCode from '../../../demos/src/card/CardWithImage.tsx?raw'
import cardCompactCode from '../../../demos/src/card/CardCompact.tsx?raw'
import cardInteractiveCode from '../../../demos/src/card/CardInteractive.tsx?raw'
import cardVariantsCode from '../../../demos/src/card/CardVariants.tsx?raw'
import cardListCode from '../../../demos/src/card/CardList.tsx?raw'

export function CardDemo() {
  return (
    <section className="demo-section">
      <h2>Card Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A container component used to group related content and actions.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Card"
          description="Simple card with title and content."
          code={cardBasicCode}
        >
          <CardBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Card with Footer"
          description="Card with header, content, and footer sections."
          code={cardWithFooterCode}
        >
          <CardWithFooter />
        </DemoWithCode>

        <DemoWithCode
          title="Card with Form"
          description="Card containing form inputs."
          code={cardWithFormCode}
        >
          <CardWithForm />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Cards"
          description="Grid of cards displaying different information."
          code={cardMultipleCode}
        >
          <CardMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Card with Shadow"
          description="Card with elevated shadow effect."
          code={cardWithShadowCode}
        >
          <CardWithShadow />
        </DemoWithCode>

        <DemoWithCode
          title="Settings Card"
          description="Card for settings with switches."
          code={cardSettingsCode}
        >
          <CardSettings />
        </DemoWithCode>

        <DemoWithCode
          title="Product Cards"
          description="Cards displaying product information."
          code={cardProductCode}
        >
          <CardProduct />
        </DemoWithCode>

        <DemoWithCode
          title="Card with Image"
          description="Card with image header."
          code={cardWithImageCode}
        >
          <CardWithImage />
        </DemoWithCode>

        <DemoWithCode
          title="Compact Cards"
          description="Smaller cards for compact layouts."
          code={cardCompactCode}
        >
          <CardCompact />
        </DemoWithCode>

        <DemoWithCode
          title="Interactive Card"
          description="Card with hover effects."
          code={cardInteractiveCode}
        >
          <CardInteractive />
        </DemoWithCode>

        <DemoWithCode
          title="Card Variants"
          description="Cards with different border styles."
          code={cardVariantsCode}
        >
          <CardVariants />
        </DemoWithCode>

        <DemoWithCode
          title="List Card"
          description="Card containing a list of items."
          code={cardListCode}
        >
          <CardList />
        </DemoWithCode>
      </div>
    </section>
  );
}
