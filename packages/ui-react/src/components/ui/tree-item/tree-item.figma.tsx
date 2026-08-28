// Figma Code Connect — status: COMPLETE
// Node 2092:2596 (the "TreeItem" component set). Property names and variant
// options come from `get_context_for_code_connect`, not guesswork:
// `title` (TEXT), `hasIcon` / `hasCheckbox` / `isExpandable` / `hasExtras`
// (BOOLEAN), `icon` (INSTANCE_SWAP), `containerExtras` (the trailing slot layer),
// plus two variant axes — `variant` (unselected / selected) and `state`
// (idle / hover / active / focus).
//
// `variant=selected` maps to the `selected` prop. `state` is deliberately NOT
// mapped: `idle`/`hover`/`focus` are pointer/keyboard looks with no prop
// equivalent, and the `active` swatch renders the same background as
// `variant=selected` (its generated reference code applies the selected
// background class), so it previews a selected row rather than a mousedown —
// there is nothing extra to express in code.
//
// `expanded` also has no Figma property (the node draws no distinct expanded
// variant — see tree-item.tsx), but unlike `state` it's a prop a consumer must
// still supply for the chevron to agree with their own `aria-expanded`. Left
// out of the mapping it would silently default to `false`, so — same pattern
// as `carousel-dialog.figma.tsx`'s unmapped `slideCount`/`selectedIndex` — the
// example fixes it as a literal instead of dropping it.
import figma from '@figma/code-connect';

import { TreeItem } from './tree-item';

figma.connect(
  TreeItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=2092-2596',
  {
    props: {
      title: figma.string('title'),
      hasIcon: figma.boolean('hasIcon'),
      icon: figma.instance('icon'),
      hasCheckbox: figma.boolean('hasCheckbox'),
      isExpandable: figma.boolean('isExpandable'),
      hasExtras: figma.boolean('hasExtras'),
      // The trailing slot's contents become `children`.
      children: figma.children('containerExtras'),
      selected: figma.enum('variant', {
        selected: true,
        unselected: false,
      }),
    },
    example: ({
      title,
      hasIcon,
      icon,
      hasCheckbox,
      isExpandable,
      hasExtras,
      children,
      selected,
    }) => (
      <TreeItem
        title={title}
        hasIcon={hasIcon}
        icon={icon}
        hasCheckbox={hasCheckbox}
        isExpandable={isExpandable}
        expanded={false}
        hasExtras={hasExtras}
        selected={selected}
      >
        {children}
      </TreeItem>
    ),
  }
);
