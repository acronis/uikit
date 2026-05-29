import * as React from 'react'
import {
  TagDefault,
  TagSmall,
  TagWithIcons,
  TagSmallWithIcons,
  TagStatus,
  TagPriority,
  TagSecurity,
  TagFeature,
  TagEnvironment,
  TagVersion,
  TagCategory,
  TagMixedSizes,
} from '@acronis-platform/shadcn-uikit-demos/tag'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import tagDefaultCode from '../../../demos/src/tag/TagDefault.tsx?raw'
import tagSmallCode from '../../../demos/src/tag/TagSmall.tsx?raw'
import tagWithIconsCode from '../../../demos/src/tag/TagWithIcons.tsx?raw'
import tagSmallWithIconsCode from '../../../demos/src/tag/TagSmallWithIcons.tsx?raw'
import tagStatusCode from '../../../demos/src/tag/TagStatus.tsx?raw'
import tagPriorityCode from '../../../demos/src/tag/TagPriority.tsx?raw'
import tagSecurityCode from '../../../demos/src/tag/TagSecurity.tsx?raw'
import tagFeatureCode from '../../../demos/src/tag/TagFeature.tsx?raw'
import tagEnvironmentCode from '../../../demos/src/tag/TagEnvironment.tsx?raw'
import tagVersionCode from '../../../demos/src/tag/TagVersion.tsx?raw'
import tagCategoryCode from '../../../demos/src/tag/TagCategory.tsx?raw'
import tagMixedSizesCode from '../../../demos/src/tag/TagMixedSizes.tsx?raw'

export function TagDemo() {
  return (
    <section className="demo-section">
      <h2>Tag Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to label, categorize, or organize items using keywords that describe them.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Default Size Tags"
          description="Tags in default size (24px height) with different color variants."
          code={tagDefaultCode}
        >
          <TagDefault />
        </DemoWithCode>

        <DemoWithCode
          title="Small Size Tags"
          description="Compact tags in small size (16px height)."
          code={tagSmallCode}
        >
          <TagSmall />
        </DemoWithCode>

        <DemoWithCode
          title="Tags with Icons"
          description="Tags with leading icons for additional visual context."
          code={tagWithIconsCode}
        >
          <TagWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Small Tags with Icons"
          description="Compact tags with icons in small size."
          code={tagSmallWithIconsCode}
        >
          <TagSmallWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Status Tags"
          description="Tags representing different system or item statuses."
          code={tagStatusCode}
        >
          <TagStatus />
        </DemoWithCode>

        <DemoWithCode
          title="Priority Tags"
          description="Tags indicating priority levels."
          code={tagPriorityCode}
        >
          <TagPriority />
        </DemoWithCode>

        <DemoWithCode
          title="Security Tags"
          description="Tags for security-related information."
          code={tagSecurityCode}
        >
          <TagSecurity />
        </DemoWithCode>

        <DemoWithCode
          title="Feature Tags"
          description="Tags highlighting features or capabilities."
          code={tagFeatureCode}
        >
          <TagFeature />
        </DemoWithCode>

        <DemoWithCode
          title="Environment Tags"
          description="Tags for different deployment environments."
          code={tagEnvironmentCode}
        >
          <TagEnvironment />
        </DemoWithCode>

        <DemoWithCode
          title="Version Tags"
          description="Tags for version information."
          code={tagVersionCode}
        >
          <TagVersion />
        </DemoWithCode>

        <DemoWithCode
          title="Category Tags"
          description="Tags for categorizing content or items."
          code={tagCategoryCode}
        >
          <TagCategory />
        </DemoWithCode>

        <DemoWithCode
          title="Mixed Sizes Example"
          description="Combination of default and small tags in a real-world scenario."
          code={tagMixedSizesCode}
        >
          <TagMixedSizes />
        </DemoWithCode>
      </div>
    </section>
  );
}
