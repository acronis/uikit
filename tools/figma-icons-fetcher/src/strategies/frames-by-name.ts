import { formatName } from '../helpers';
import type { FetcherConfig, FigmaIcon } from '../types';
import type { FigmaNode, FigmaPage, SelectionStrategy } from './types';

/**
 * The original selection model: within a page, pick frames whose name is in
 * `config.frameNames`, then collect every `COMPONENT` node nested under them.
 * Components whose name starts with `_` (grids, guides, internal helpers) are
 * skipped. The icon's source page name is used for manifest grouping.
 */
export const framesByNameStrategy: SelectionStrategy = (page: FigmaPage, config: FetcherConfig): FigmaIcon[] => {
  const framesWithIcons = (page.document.children ?? []).filter(
    (child) => child.type === 'FRAME' && config.frameNames.includes(child.name),
  );

  const components: FigmaNode[] = [];

  function findComponents(element: FigmaNode): void {
    element.children?.forEach((child) => {
      if (child.type === 'COMPONENT') {
        components.push(child);
      } else {
        findComponents(child);
      }
    });
  }

  framesWithIcons.forEach((frame) => findComponents(frame));

  return components
    .filter((component) => !component.name.startsWith('_'))
    .map((component) => ({
      id: component.id,
      name: formatName(component.name),
      pageName: page.name,
    }));
};
