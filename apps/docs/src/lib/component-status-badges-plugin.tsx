import { Fragment } from 'react';
import type { LoaderPlugin } from 'fumadocs-core/source';

interface ComponentStatusPageData {
  internal?: boolean;
  deprecated?: { replacement: string; reason?: string };
}

function StatusBadge({
  tone,
  children,
}: {
  tone: 'info' | 'warn';
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        'ms-1.5 rounded px-1 py-0.5 text-[10px] font-medium uppercase tracking-wide ' +
        (tone === 'warn'
          ? 'bg-fd-warning/15 text-fd-warning'
          : 'bg-fd-info/15 text-fd-info')
      }
    >
      {children}
    </span>
  );
}

// Sidebar-visible counterpart to the in-page <ComponentStatusCallout> — reads
// the same `internal`/`deprecated` frontmatter (extended in source.config.ts)
// so a component's status is visible in the nav tree, not just on its page.
export function componentStatusBadgesPlugin(): LoaderPlugin {
  return {
    name: 'component-status-badges',
    transformPageTree: {
      file(node, filePath) {
        if (!filePath) return node;
        const file = this.storage.read(filePath);
        if (file?.format !== 'page') return node;
        const data = file.data as ComponentStatusPageData;
        if (!data.internal && !data.deprecated) return node;

        node.name = (
          <Fragment>
            {node.name}
            {data.internal && <StatusBadge tone="info">Internal</StatusBadge>}
            {data.deprecated && (
              <StatusBadge tone="warn">Deprecated</StatusBadge>
            )}
          </Fragment>
        );
        return node;
      },
    },
  };
}
