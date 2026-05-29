import * as React from 'react'
import {
  EmptyBasic,
  EmptyWithAction,
  EmptyWithButtonAndLink,
  EmptyWithMultipleLinks,
  EmptyOnlyLinks,
  EmptyError,
  EmptyVariousStates,
  EmptyDiscoveryAgent,
} from '@acronis-platform/shadcn-uikit-demos/empty'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import emptyBasicCode from '../../../demos/src/empty/EmptyBasic.tsx?raw'
import emptyWithActionCode from '../../../demos/src/empty/EmptyWithAction.tsx?raw'
import emptyWithButtonAndLinkCode from '../../../demos/src/empty/EmptyWithButtonAndLink.tsx?raw'
import emptyWithMultipleLinksCode from '../../../demos/src/empty/EmptyWithMultipleLinks.tsx?raw'
import emptyOnlyLinksCode from '../../../demos/src/empty/EmptyOnlyLinks.tsx?raw'
import emptyErrorCode from '../../../demos/src/empty/EmptyError.tsx?raw'
import emptyVariousStatesCode from '../../../demos/src/empty/EmptyVariousStates.tsx?raw'
import emptyDiscoveryAgentCode from '../../../demos/src/empty/EmptyDiscoveryAgent.tsx?raw'

export function EmptyDemo() {
  return (
    <section className="demo-section">
      <h2>Empty State Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        Used to show initial states of interface sections when no data to show.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Empty State"
          description="Simple empty state with icon, title, and description."
          code={emptyBasicCode}
        >
          <EmptyBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State with Action Button"
          description="Empty state with a primary action button."
          code={emptyWithActionCode}
        >
          <EmptyWithAction />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State with Button and Link"
          description="Empty state with primary action and a secondary link."
          code={emptyWithButtonAndLinkCode}
        >
          <EmptyWithButtonAndLink />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State with Multiple Links"
          description="Empty state with button and multiple help links."
          code={emptyWithMultipleLinksCode}
        >
          <EmptyWithMultipleLinks />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State - Only Links"
          description="Empty state with only links, no primary button."
          code={emptyOnlyLinksCode}
        >
          <EmptyOnlyLinks />
        </DemoWithCode>

        <DemoWithCode
          title="Empty State - Error"
          description="Empty state for error scenarios."
          code={emptyErrorCode}
        >
          <EmptyError />
        </DemoWithCode>

        <DemoWithCode
          title="Various Empty States"
          description="Different empty state examples for common scenarios."
          code={emptyVariousStatesCode}
        >
          <EmptyVariousStates />
        </DemoWithCode>

        <DemoWithCode
          title="Discovery Agent Example"
          description="Complex empty state with detailed description and multiple actions."
          code={emptyDiscoveryAgentCode}
        >
          <EmptyDiscoveryAgent />
        </DemoWithCode>
      </div>
    </section>
  );
}
