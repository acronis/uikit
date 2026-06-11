import { formatName } from '../helpers';
import type { FetcherConfig, FigmaIcon } from '../types';
import type { FigmaNode, FigmaPage, SelectionStrategy } from './types';

// Real icons in the "icon-packs-source" section are COMPONENT nodes named
// "_iconsource/<Name>". Everything else under a pack (Category wrappers,
// CategoryTitle text, stray auto-added frames) is layout/noise and is ignored.
const ICON_PREFIX = '_iconsource/';
const TITLE_NAME = 'categorytitle';

function isIcon(node: FigmaNode): boolean {
  return node.type === 'COMPONENT' && node.name.startsWith(ICON_PREFIX);
}

function iconName(node: FigmaNode): string {
  return formatName(node.name.slice(ICON_PREFIX.length));
}

// A category's display name lives in its "CategoryTitle" text node — the frame
// itself is just named "Category". Falls back to the frame's own name.
function categoryLabel(frame: FigmaNode): string {
  const title = frame.children?.find(
    (child) => child.type === 'TEXT' && child.name.trim().toLowerCase() === TITLE_NAME,
  )?.characters;
  return formatName(title?.trim() || frame.name);
}

function collectIcons(node: FigmaNode, pageName: string, icons: FigmaIcon[]): void {
  const visit = (candidate: FigmaNode): void => {
    if (isIcon(candidate)) {
      icons.push({ id: candidate.id, name: iconName(candidate), pageName });
    }
    candidate.children?.forEach(visit);
  };
  visit(node);
}

/**
 * Selection model for the next-gen `icon-packs-source` section. The fetched
 * node is the section itself; each of its top-level frames is one *pack*
 * (`stroke-mono`, `stroke-multi`, `solid-mono`, `solid-multi`). Icons are the
 * `COMPONENT` leaves named `_iconsource/<Name>` (the prefix is stripped).
 *
 * Manifest grouping reflects the pack's internal layout:
 * - icons nested in a `Category` frame are grouped as `<pack>/<category>` (the
 *   category name comes from its `CategoryTitle` text), so a pack like
 *   `stroke-mono` splits into `stroke-mono-arrows`, `stroke-mono-shapes`, … ;
 * - icons listed directly under a pack are grouped under the pack itself.
 */
export const iconPacksStrategy: SelectionStrategy = (page: FigmaPage, _config: FetcherConfig): FigmaIcon[] => {
  const packs = (page.document.children ?? []).filter((child) => child.type === 'FRAME');
  const icons: FigmaIcon[] = [];

  packs.forEach((pack) => {
    const packName = formatName(pack.name);

    (pack.children ?? []).forEach((child) => {
      if (child.type === 'FRAME') {
        collectIcons(child, `${packName}/${categoryLabel(child)}`, icons);
      } else if (isIcon(child)) {
        icons.push({ id: child.id, name: iconName(child), pageName: packName });
      }
    });
  });

  return icons;
};
