'use client';

import { useState } from 'react';
import {
  FolderIcon,
  PencilIcon,
} from '@acronis-platform/icons-react/stroke-mono';
import { ButtonIcon, Tag, TreeItem } from '@acronis-platform/ui-react';

export function TreeItemDemo() {
  // The row owns neither the expand state nor the selection — the tree does.
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState('cloud');
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* A real tree: the consumer supplies the ARIA roles, the indentation,
          the expand state, and the selection. */}
      <ul role="tree" aria-label="Workloads" className="w-80">
        <TreeItem
          render={<li role="treeitem" aria-expanded={open} aria-level={1} />}
          expanded={open}
          hasIcon
          icon={<FolderIcon size={16} />}
          title="All workloads"
          tabIndex={0}
          onClick={() => setOpen((value) => !value)}
        >
          <Tag variant="info">24</Tag>
        </TreeItem>

        {open && (
          <ul role="group" className="ps-4">
            {[
              { id: 'machines', title: 'Machines with agents', leaf: false },
              { id: 'cloud', title: 'Cloud applications', leaf: true },
              { id: 'unmanaged', title: 'Unmanaged workloads', leaf: true },
            ].map((node) => (
              <TreeItem
                key={node.id}
                render={
                  <li
                    role="treeitem"
                    aria-level={2}
                    aria-selected={selected === node.id}
                  />
                }
                isExpandable={!node.leaf}
                hasIcon
                icon={<FolderIcon size={16} />}
                title={node.title}
                selected={selected === node.id}
                tabIndex={-1}
                onClick={() => setSelected(node.id)}
              />
            ))}
          </ul>
        )}
      </ul>

      {/* Each optional slot on its own. */}
      <div className="flex w-80 flex-col">
        <TreeItem title="Chevron and title only (the Figma default)" />
        <TreeItem hasIcon title="With the placeholder icon" />
        <TreeItem
          hasIcon
          icon={<FolderIcon size={16} />}
          title="With a custom icon"
        />
        <TreeItem
          hasCheckbox
          hasIcon
          icon={<FolderIcon size={16} />}
          title="With a checkbox"
          checkboxProps={{
            checked,
            onCheckedChange: (value) => setChecked(Boolean(value)),
          }}
        />
        <TreeItem
          hasIcon
          icon={<FolderIcon size={16} />}
          title="With an action in the extras slot"
        >
          <ButtonIcon aria-label="Rename">
            <PencilIcon size={16} />
          </ButtonIcon>
        </TreeItem>
        <TreeItem
          isExpandable={false}
          hasIcon
          icon={<FolderIcon size={16} />}
          title="A leaf row — no chevron"
        />
        <TreeItem
          expanded
          hasIcon
          icon={<FolderIcon size={16} />}
          title="Expanded — the chevron points down"
        />
        <TreeItem
          hasIcon
          icon={<FolderIcon size={16} />}
          selected
          title="Selected"
        />
        <TreeItem
          hasIcon
          icon={<FolderIcon size={16} />}
          title="A very long row label that has to truncate rather than wrap or widen the row"
        />
      </div>
    </div>
  );
}
