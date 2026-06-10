import { formatName } from '../helpers';
import type { FetcherConfig, FigmaIcon } from '../types';
import type { FigmaNode, FigmaPage, SelectionStrategy } from './types';

// The redesigned icons live inside green frames badged with a vertical "New"
// text label, sitting next to the old size-suffixed icons. We detect those
// frames by that label rather than by fill so the rule stays readable.
const NEW_LABEL = 'new';

// Layout wrappers Figma auto-names ("Frame 6", "Frame 12", …) group icons but
// are not icons themselves — recurse through them, never collect them.
const WRAPPER_NAME = /^frame \d+$/i;

const ICON_NODE_TYPES = new Set(['FRAME', 'INSTANCE', 'COMPONENT']);

function isNewFrame(node: FigmaNode): boolean {
  return (node.children ?? []).some(
    (child) => child.type === 'TEXT' && child.name.trim().toLowerCase() === NEW_LABEL,
  );
}

function isIconLeaf(node: FigmaNode): boolean {
  if (!ICON_NODE_TYPES.has(node.type)) {
    return false;
  }
  const name = node.name.trim();
  // `_IconGrid-24` and friends are guides; "?" marks unresolved placeholders.
  return name !== '?' && name.toLowerCase() !== NEW_LABEL && !name.startsWith('_') && !WRAPPER_NAME.test(name);
}

function walk(node: FigmaNode, visit: (node: FigmaNode) => void): void {
  node.children?.forEach((child) => {
    visit(child);
    walk(child, visit);
  });
}

/**
 * Selection model for the next-gen icon source: the page's top-level frames are
 * treated as categories (used for manifest grouping). Within each category we
 * find every frame flagged "New" (the green redesign frames) and collect the
 * icon leaves inside them. Wrapper layout frames and grid/placeholder nodes are
 * skipped. The old size-suffixed icons live *outside* the New frames and are
 * therefore never picked up.
 */
export const newFramesStrategy: SelectionStrategy = (page: FigmaPage, _config: FetcherConfig): FigmaIcon[] => {
  const categories = (page.document.children ?? []).filter((child) => child.type === 'FRAME');
  const icons: FigmaIcon[] = [];

  categories.forEach((category) => {
    const pageName = formatName(category.name);

    walk(category, (node) => {
      if (!isNewFrame(node)) {
        return;
      }
      walk(node, (candidate) => {
        if (isIconLeaf(candidate)) {
          icons.push({ id: candidate.id, name: formatName(candidate.name), pageName });
        }
      });
    });
  });

  return icons;
};
