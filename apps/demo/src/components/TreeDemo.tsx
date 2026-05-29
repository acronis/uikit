import * as React from 'react'
import {
  TreeBasic,
  TreeWithIcons,
  TreeWithCheckboxes,
  TreeWithIconsAndCheckboxes,
  TreeFileSystem,
  TreeProjectStructure,
  TreeOrganization,
  TreeControlled,
  TreeDeepNesting,
  TreeMixedContent,
} from '@acronis-platform/shadcn-uikit-demos/tree'
import { DemoWithCode } from './DemoWithCode'

// Import actual source code files as raw strings
import treeBasicCode from '../../../demos/src/tree/TreeBasic.tsx?raw'
import treeWithIconsCode from '../../../demos/src/tree/TreeWithIcons.tsx?raw'
import treeWithCheckboxesCode from '../../../demos/src/tree/TreeWithCheckboxes.tsx?raw'
import treeWithIconsAndCheckboxesCode from '../../../demos/src/tree/TreeWithIconsAndCheckboxes.tsx?raw'
import treeFileSystemCode from '../../../demos/src/tree/TreeFileSystem.tsx?raw'
import treeProjectStructureCode from '../../../demos/src/tree/TreeProjectStructure.tsx?raw'
import treeOrganizationCode from '../../../demos/src/tree/TreeOrganization.tsx?raw'
import treeControlledCode from '../../../demos/src/tree/TreeControlled.tsx?raw'
import treeDeepNestingCode from '../../../demos/src/tree/TreeDeepNesting.tsx?raw'
import treeMixedContentCode from '../../../demos/src/tree/TreeMixedContent.tsx?raw'

export function TreeDemo() {
  return (
    <section className="demo-section">
      <h2>Tree Component</h2>
      <p className="demo-description mb-8 text-muted-foreground">
        A hierarchical tree structure for displaying nested data with expand/collapse functionality.
      </p>

      <div className="space-y-8">
        <DemoWithCode
          title="Basic Tree"
          description="Simple tree structure without icons or checkboxes."
          code={treeBasicCode}
        >
          <TreeBasic />
        </DemoWithCode>

        <DemoWithCode
          title="Tree with Icons"
          description="Tree structure with custom icons for each node."
          code={treeWithIconsCode}
        >
          <TreeWithIcons />
        </DemoWithCode>

        <DemoWithCode
          title="Tree with Checkboxes"
          description="Tree with checkboxes for multi-selection."
          code={treeWithCheckboxesCode}
        >
          <TreeWithCheckboxes />
        </DemoWithCode>

        <DemoWithCode
          title="Tree with Icons and Checkboxes"
          description="Full-featured tree with both icons and checkboxes."
          code={treeWithIconsAndCheckboxesCode}
        >
          <TreeWithIconsAndCheckboxes />
        </DemoWithCode>

        <DemoWithCode
          title="File System Explorer"
          description="Tree representing a file system with folders and files."
          code={treeFileSystemCode}
        >
          <TreeFileSystem />
        </DemoWithCode>

        <DemoWithCode
          title="Project Structure"
          description="Tree showing a typical project folder structure."
          code={treeProjectStructureCode}
        >
          <TreeProjectStructure />
        </DemoWithCode>

        <DemoWithCode
          title="Organization Hierarchy"
          description="Tree displaying company organizational structure."
          code={treeOrganizationCode}
        >
          <TreeOrganization />
        </DemoWithCode>

        <DemoWithCode
          title="Controlled Tree"
          description="Tree with event handlers for expand, select, and check actions."
          code={treeControlledCode}
        >
          <TreeControlled />
        </DemoWithCode>

        <DemoWithCode
          title="Deep Nesting"
          description="Tree with multiple levels of nesting."
          code={treeDeepNestingCode}
        >
          <TreeDeepNesting />
        </DemoWithCode>

        <DemoWithCode
          title="Mixed Content Tree"
          description="Tree with various types of content and icons."
          code={treeMixedContentCode}
        >
          <TreeMixedContent />
        </DemoWithCode>
      </div>
    </section>
  );
}
