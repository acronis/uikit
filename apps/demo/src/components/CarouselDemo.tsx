import * as React from 'react'
import {
  CarouselBasic,
  CarouselWithDots,
  CarouselMultiple,
  CarouselImageGallery,
  CarouselTestimonials,
  CarouselProducts,
  CarouselVertical,
  CarouselAutoplay,
  CarouselFigmaStyle,
} from '@acronis-platform/shadcn-uikit-demos/carousel'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import carouselBasicCode from '../../../demos/src/carousel/CarouselBasic.tsx?raw'
import carouselWithDotsCode from '../../../demos/src/carousel/CarouselWithDots.tsx?raw'
import carouselMultipleCode from '../../../demos/src/carousel/CarouselMultiple.tsx?raw'
import carouselImageGalleryCode from '../../../demos/src/carousel/CarouselImageGallery.tsx?raw'
import carouselTestimonialsCode from '../../../demos/src/carousel/CarouselTestimonials.tsx?raw'
import carouselProductsCode from '../../../demos/src/carousel/CarouselProducts.tsx?raw'
import carouselVerticalCode from '../../../demos/src/carousel/CarouselVertical.tsx?raw'
import carouselAutoplayCode from '../../../demos/src/carousel/CarouselAutoplay.tsx?raw'
import carouselFigmaStyleCode from '../../../demos/src/carousel/CarouselFigmaStyle.tsx?raw'

export function CarouselDemo() {
  return (
    <section className="demo-section">
      <h2>Carousel Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A carousel component for cycling through elements with navigation controls and indicators.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Carousel"
          description="Simple carousel with navigation arrows."
          code={carouselBasicCode}
        >
          <CarouselBasic />
        </DemoWithCode>

        <DemoWithCode
          title="With Dot Indicators"
          description="Carousel with navigation dots matching Figma design."
          code={carouselWithDotsCode}
        >
          <CarouselWithDots />
        </DemoWithCode>

        <DemoWithCode
          title="Multiple Items Per View"
          description="Show multiple slides at once."
          code={carouselMultipleCode}
        >
          <CarouselMultiple />
        </DemoWithCode>

        <DemoWithCode
          title="Image Gallery"
          description="Carousel for displaying images."
          code={carouselImageGalleryCode}
        >
          <CarouselImageGallery />
        </DemoWithCode>

        <DemoWithCode
          title="Testimonials Carousel"
          description="Carousel for displaying customer testimonials."
          code={carouselTestimonialsCode}
        >
          <CarouselTestimonials />
        </DemoWithCode>

        <DemoWithCode
          title="Product Showcase"
          description="Carousel for showcasing products with details."
          code={carouselProductsCode}
        >
          <CarouselProducts />
        </DemoWithCode>

        <DemoWithCode
          title="Vertical Carousel"
          description="Carousel with vertical orientation."
          code={carouselVerticalCode}
        >
          <CarouselVertical />
        </DemoWithCode>

        <DemoWithCode
          title="Auto-play Carousel"
          description="Carousel that automatically advances slides."
          code={carouselAutoplayCode}
        >
          <CarouselAutoplay />
        </DemoWithCode>

        <DemoWithCode
          title="Figma-Style Navigation"
          description="Carousel with navigation matching the Figma design exactly."
          code={carouselFigmaStyleCode}
        >
          <CarouselFigmaStyle />
        </DemoWithCode>
      </div>
    </section>
  );
}
