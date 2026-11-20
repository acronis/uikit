export interface NetworkGraphPosition {
  x: number;
  y: number;
  depth: number;
}

export type NetworkGraphNodeVariant =
  | 'network'
  | 'gateway'
  | 'subnet'
  | 'device'
  | 'group';

export interface NetworkGraphNodeLayoutLike {
  id: string;
  variant?: NetworkGraphNodeVariant;
  width?: number;
  height?: number;
  deviceIndicators?: ReadonlyArray<unknown>;
  alerts?: ReadonlyArray<unknown>;
}

export interface NetworkGraphNodeSize {
  width: number;
  height: number;
}

export interface NetworkGraphLayout<Node extends { id: string }, Edge> {
  nodes: Node[];
  positions: Map<string, NetworkGraphPosition>;
  nodeSizes: Map<string, NetworkGraphNodeSize>;
  validEdges: Array<{ edge: Edge; index: number }>;
  treeEdges: Array<{
    edge: Edge;
    index: number;
    source: string;
    target: string;
  }>;
  width: number;
  height: number;
}

export interface NetworkGraphEdgeLike {
  source: string;
  target: string;
}

export const NETWORK_GRAPH_HORIZONTAL_GAP = 64;
export const NETWORK_GRAPH_DEFAULT_VERTICAL_GAP = 72;
export const NETWORK_GRAPH_DEFAULT_NODE_WIDTH = 192;
export const NETWORK_GRAPH_DEFAULT_NODE_HEIGHT = 56;

const NETWORK_GRAPH_NODE_SIZES: Record<
  NetworkGraphNodeVariant,
  NetworkGraphNodeSize
> = {
  network: { width: 139, height: 112 },
  gateway: { width: 184, height: 56 },
  subnet: { width: 128, height: 104 },
  device: { width: 192, height: 56 },
  group: { width: 192, height: 56 },
};

const NETWORK_GRAPH_VERTICAL_GAPS: Record<string, number> = {
  'network:gateway': 48,
  'gateway:subnet': 84,
  'subnet:device': 50,
  'device:group': 132,
};

export function getBaseNetworkGraphNodeSize(
  node: NetworkGraphNodeLayoutLike
): NetworkGraphNodeSize {
  const defaults = node.variant
    ? NETWORK_GRAPH_NODE_SIZES[node.variant]
    : {
        width: NETWORK_GRAPH_DEFAULT_NODE_WIDTH,
        height: NETWORK_GRAPH_DEFAULT_NODE_HEIGHT,
      };
  return {
    width:
      typeof node.width === 'number' && Number.isFinite(node.width)
        ? node.width
        : defaults.width,
    height:
      typeof node.height === 'number' && Number.isFinite(node.height)
        ? node.height
        : defaults.height,
  };
}

/** Height of the wrapped Figma marker row, including its vertical padding. */
export function getNetworkGraphIndicatorsHeight(
  node: NetworkGraphNodeLayoutLike
): number {
  if (!node.deviceIndicators?.length) return 0;
  const width = Math.max(1, getBaseNetworkGraphNodeSize(node).width);
  let used = 0;
  let rowHeight = 0;
  let height = 16;
  for (const item of node.deviceIndicators) {
    const size =
      typeof item === 'object' &&
      item !== null &&
      'size' in item &&
      item.size === 14
        ? 14
        : 12;
    if (used && used + 4 + size > width) {
      height += rowHeight + 4;
      used = 0;
      rowHeight = 0;
    }
    used += (used ? 4 : 0) + size;
    rowHeight = Math.max(rowHeight, size);
  }
  return height + rowHeight;
}

/**
 * Calculates the full node footprint, including optional device indicators
 * and status rows rendered beneath its card. The extra height participates in
 * layout so attached details cannot overlap the next graph level.
 */
export function getNetworkGraphNodeSize(
  node: NetworkGraphNodeLayoutLike
): NetworkGraphNodeSize {
  const base = getBaseNetworkGraphNodeSize(node);
  const indicatorCount = node.deviceIndicators?.length ?? 0;
  const indicatorHeight = getNetworkGraphIndicatorsHeight(node);
  const alertCount = node.alerts?.length ?? 0;
  const detailCount = Number(indicatorCount > 0) + alertCount;
  const detailHeight = indicatorHeight + alertCount * 24 + detailCount * 4;

  return {
    width: base.width,
    height: base.height + detailHeight,
  };
}

function getVerticalGap(
  parent: NetworkGraphNodeLayoutLike,
  child: NetworkGraphNodeLayoutLike
) {
  if (!parent.variant || !child.variant) {
    return NETWORK_GRAPH_DEFAULT_VERTICAL_GAP;
  }
  return (
    NETWORK_GRAPH_VERTICAL_GAPS[`${parent.variant}:${child.variant}`] ??
    NETWORK_GRAPH_DEFAULT_VERTICAL_GAP
  );
}

/**
 * Makes a deterministic spanning forest from the declared roots, then places
 * each tree by its descendant width. Non-tree edges remain available to render.
 */
export function layoutNetworkGraph<
  Node extends NetworkGraphNodeLayoutLike,
  Edge extends NetworkGraphEdgeLike,
>(
  inputNodes: ReadonlyArray<Node>,
  inputEdges: ReadonlyArray<Edge>,
  declaredRoots: ReadonlyArray<string>,
  horizontalGap = NETWORK_GRAPH_HORIZONTAL_GAP
): NetworkGraphLayout<Node, Edge> {
  horizontalGap = Number.isFinite(horizontalGap)
    ? Math.max(0, horizontalGap)
    : NETWORK_GRAPH_HORIZONTAL_GAP;
  const nodeById = new Map<string, Node>();
  for (const node of inputNodes) {
    if (nodeById.has(node.id)) {
      throw new Error(`NetworkGraph node id must be unique: ${node.id}`);
    }
    nodeById.set(node.id, node);
  }
  const nodes = [...nodeById.values()];
  const nodeSizes = new Map(
    nodes.map((node) => [node.id, getNetworkGraphNodeSize(node)])
  );
  const validEdges = inputEdges.flatMap((edge, index) =>
    nodeById.has(edge.source) && nodeById.has(edge.target)
      ? [{ edge, index }]
      : []
  );
  const adjacency = new Map<string, Array<{ id: string; edgeIndex: number }>>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const { edge, index } of validEdges) {
    adjacency.get(edge.source)?.push({ id: edge.target, edgeIndex: index });
  }

  const visited = new Set<string>();
  const depths = new Map<string, number>();
  const children = new Map<string, Array<{ id: string; edgeIndex: number }>>();
  const roots: string[] = [];

  const visitTree = (rootId: string) => {
    if (visited.has(rootId)) return;
    roots.push(rootId);
    const queue = [rootId];
    visited.add(rootId);
    depths.set(rootId, 0);
    children.set(rootId, []);

    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const currentId = queue[cursor];
      const nextDepth = (depths.get(currentId) ?? 0) + 1;
      for (const next of adjacency.get(currentId) ?? []) {
        if (visited.has(next.id)) continue;
        visited.add(next.id);
        depths.set(next.id, nextDepth);
        children.set(next.id, []);
        children.get(currentId)?.push(next);
        queue.push(next.id);
      }
    }
  };

  for (const rootId of declaredRoots) {
    if (nodeById.has(rootId)) visitTree(rootId);
  }
  for (const node of nodes) visitTree(node.id);

  const treeEdges: Array<{
    edge: Edge;
    index: number;
    source: string;
    target: string;
  }> = [];
  for (const [source, childNodes] of children) {
    for (const child of childNodes) {
      const edge = validEdges.find(
        ({ index }) => index === child.edgeIndex
      )?.edge;
      if (edge) {
        treeEdges.push({
          edge,
          index: child.edgeIndex,
          source,
          target: child.id,
        });
      }
    }
  }

  const subtreeWidths = new Map<string, number>();
  const postOrder: string[] = [];
  for (const rootId of roots) {
    const stack: Array<{ id: string; exiting: boolean }> = [
      { id: rootId, exiting: false },
    ];
    while (stack.length > 0) {
      const item = stack.pop()!;
      if (item.exiting) {
        postOrder.push(item.id);
        continue;
      }
      stack.push({ id: item.id, exiting: true });
      const childNodes = children.get(item.id) ?? [];
      for (let index = childNodes.length - 1; index >= 0; index -= 1) {
        stack.push({ id: childNodes[index].id, exiting: false });
      }
    }
  }
  for (const id of postOrder) {
    const childNodes = children.get(id) ?? [];
    const childrenWidth = childNodes.reduce(
      (sum, child, index) =>
        sum +
        (subtreeWidths.get(child.id) ??
          nodeSizes.get(child.id)?.width ??
          NETWORK_GRAPH_DEFAULT_NODE_WIDTH) +
        (index > 0 ? horizontalGap : 0),
      0
    );
    subtreeWidths.set(
      id,
      Math.max(
        nodeSizes.get(id)?.width ?? NETWORK_GRAPH_DEFAULT_NODE_WIDTH,
        childrenWidth
      )
    );
  }

  const positions = new Map<string, NetworkGraphPosition>();
  let rootOffset = 0;
  let maxDepth = 0;
  const levelHeights: number[] = [];
  const levelGaps: number[] = [];
  for (const node of nodes) {
    const depth = depths.get(node.id) ?? 0;
    maxDepth = Math.max(maxDepth, depth);
    levelHeights[depth] = Math.max(
      levelHeights[depth] ?? 0,
      nodeSizes.get(node.id)?.height ?? NETWORK_GRAPH_DEFAULT_NODE_HEIGHT
    );
  }
  for (const { source, target } of treeEdges) {
    const depth = depths.get(source) ?? 0;
    const parent = nodeById.get(source)!;
    const child = nodeById.get(target)!;
    levelGaps[depth] = Math.max(
      levelGaps[depth] ?? 0,
      getVerticalGap(parent, child)
    );
  }
  const levelCenters: number[] = [];
  if (levelHeights.length > 0) levelCenters[0] = levelHeights[0] / 2;
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    levelCenters[depth] =
      levelCenters[depth - 1] +
      (levelHeights[depth - 1] ?? NETWORK_GRAPH_DEFAULT_NODE_HEIGHT) / 2 +
      (levelGaps[depth - 1] ?? NETWORK_GRAPH_DEFAULT_VERTICAL_GAP) +
      (levelHeights[depth] ?? NETWORK_GRAPH_DEFAULT_NODE_HEIGHT) / 2;
  }

  for (const rootId of roots) {
    const rootWidth =
      subtreeWidths.get(rootId) ?? NETWORK_GRAPH_DEFAULT_NODE_WIDTH;
    const stack: Array<{ id: string; offset: number }> = [
      { id: rootId, offset: rootOffset },
    ];
    while (stack.length > 0) {
      const { id, offset } = stack.pop()!;
      const depth = depths.get(id) ?? 0;
      const nodeWidth =
        nodeSizes.get(id)?.width ?? NETWORK_GRAPH_DEFAULT_NODE_WIDTH;
      const subtreeWidth = subtreeWidths.get(id) ?? nodeWidth;
      positions.set(id, {
        x: offset + subtreeWidth / 2,
        y: levelCenters[depth] ?? nodeWidth / 2,
        depth,
      });

      const childNodes = children.get(id) ?? [];
      const childrenWidth = childNodes.reduce(
        (sum, child, index) =>
          sum +
          (subtreeWidths.get(child.id) ??
            nodeSizes.get(child.id)?.width ??
            NETWORK_GRAPH_DEFAULT_NODE_WIDTH) +
          (index > 0 ? horizontalGap : 0),
        0
      );
      let childOffset = offset + (subtreeWidth - childrenWidth) / 2;
      for (const child of childNodes) {
        const childWidth =
          subtreeWidths.get(child.id) ??
          nodeSizes.get(child.id)?.width ??
          NETWORK_GRAPH_DEFAULT_NODE_WIDTH;
        stack.push({ id: child.id, offset: childOffset });
        childOffset += childWidth + horizontalGap;
      }
    }
    rootOffset += rootWidth + horizontalGap;
  }

  const width = roots.length === 0 ? 0 : rootOffset - horizontalGap;
  const height =
    roots.length === 0
      ? 0
      : (levelCenters[maxDepth] ?? 0) + (levelHeights[maxDepth] ?? 0) / 2;

  return { nodes, positions, nodeSizes, validEdges, treeEdges, width, height };
}

export interface NetworkGraphPathSelection {
  nodeIds: Set<string>;
  edgeIndices: Set<number>;
}

/** Finds and unions the shortest undirected path for each requested pair. */
export function findNetworkGraphPaths<Edge extends NetworkGraphEdgeLike>(
  nodeIds: ReadonlySet<string>,
  edges: ReadonlyArray<Edge>,
  pairs: ReadonlyArray<{ from: string; to: string }>
): NetworkGraphPathSelection {
  const adjacency = new Map<string, Array<{ id: string; edgeIndex: number }>>();
  for (const nodeId of nodeIds) adjacency.set(nodeId, []);
  edges.forEach((edge, edgeIndex) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return;
    adjacency.get(edge.source)?.push({ id: edge.target, edgeIndex });
    adjacency.get(edge.target)?.push({ id: edge.source, edgeIndex });
  });

  const selectedNodes = new Set<string>();
  const selectedEdges = new Set<number>();
  for (const { from, to } of pairs) {
    if (!nodeIds.has(from) || !nodeIds.has(to)) continue;
    if (from === to) {
      selectedNodes.add(from);
      continue;
    }

    const queue = [from];
    const previous = new Map<string, { id: string; edgeIndex: number }>();
    const visited = new Set([from]);
    let found = false;
    for (let cursor = 0; cursor < queue.length && !found; cursor += 1) {
      const currentId = queue[cursor];
      for (const next of adjacency.get(currentId) ?? []) {
        if (visited.has(next.id)) continue;
        visited.add(next.id);
        previous.set(next.id, { id: currentId, edgeIndex: next.edgeIndex });
        if (next.id === to) {
          found = true;
          break;
        }
        queue.push(next.id);
      }
    }
    if (!found) continue;

    let currentId = to;
    selectedNodes.add(to);
    while (currentId !== from) {
      const step = previous.get(currentId);
      if (!step) break;
      selectedEdges.add(step.edgeIndex);
      selectedNodes.add(step.id);
      currentId = step.id;
    }
  }

  return { nodeIds: selectedNodes, edgeIndices: selectedEdges };
}
