'use client';

import * as React from 'react';
import {
  BoxIcon,
  CircleConnectIcon,
  CloudIcon,
  CloudServerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EthernetIcon,
  FirewallIcon,
  LaptopIcon,
  MagnifierMinusIcon,
  MagnifierPlusIcon,
  NetworkServerIcon,
  NodeNetworkIcon,
  PcTowerIcon,
  RouterIcon,
  ServerIcon,
  WifiIcon,
  type IconSize,
} from '@acronis-platform/icons-react/stroke-mono';
import { DiamondWarningRedIcon } from '@acronis-platform/icons-react/stroke-multi';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import {
  findNetworkGraphPaths,
  getBaseNetworkGraphNodeSize,
  getNetworkGraphIndicatorsHeight,
  layoutNetworkGraph,
  type NetworkGraphPosition,
  type NetworkGraphNodeVariant,
} from './network-graph-layout';

export type { NetworkGraphNodeVariant } from './network-graph-layout';

export type NetworkGraphDeviceType = 'networking' | 'endpoint';
export type NetworkGraphNodeState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled'
  | 'error';

export type NetworkGraphDeviceIndicatorState =
  | 'active'
  | 'inactive'
  | 'muted'
  | 'error';

export type NetworkGraphDeviceIndicator =
  | NetworkGraphDeviceIndicatorState
  | { state: NetworkGraphDeviceIndicatorState; size: 14 };

export interface NetworkGraphAlert {
  id?: string;
  label: string;
  severity?: 'danger';
}

export interface NetworkGraphNode {
  id: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  /** A network icon name (`router`, `server`, `wifi`, etc.) or a React icon element. */
  icon?: string | React.ReactNode;
  /** Figma topology card treatment and layout role. */
  variant?: NetworkGraphNodeVariant;
  /** Figma topology card device treatment; independent of the chosen icon. */
  deviceType?: NetworkGraphDeviceType;
  /** Figma topology card visual state. */
  state?: NetworkGraphNodeState;
  /** Compact device markers displayed beneath the card. */
  deviceIndicators?: NetworkGraphDeviceIndicator[];
  /** Accessible summary of device indicators, localized by the consumer. */
  deviceIndicatorsLabel?: string;
  /** Show a branch toggle when this node has tree children. */
  expandable?: boolean;
  /** ID of an immediate child used as a summary only while this branch is collapsed. */
  collapsedGroupId?: string;
  /** Status chips displayed beneath the card. */
  alerts?: NetworkGraphAlert[];
  width?: number;
  height?: number;
  shape?: 'circle' | 'rect';
  /** Use a color reference backed by a ui-react `--ui-*` theme token. */
  color?: string;
  [key: string]: unknown;
}

export interface NetworkGraphEdge {
  source: string;
  target: string;
  /** Semantic connection category, for example `layer1`, `vpn`, or `wifi`. */
  type?: string;
  style?: 'solid' | 'dotted';
  /** Use a color reference backed by a ui-react `--ui-*` theme token. */
  color?: string;
  [key: string]: unknown;
}

export interface NetworkGraphData {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
  roots: string[];
}

/** Controls the graph viewport independently of the DOM ref. Scale 1 means 100%. */
export interface NetworkGraphViewportHandle {
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (scale: number) => void;
}

export interface NetworkGraphProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onWheel'
> {
  graphData: NetworkGraphData;
  width?: number | string;
  height?: number | string;
  /** Minimum horizontal spacing between sibling subtrees in pixels. */
  horizontalGap?: number;
  /** Enable pointer-drag panning. Off by default. */
  graphDraggable?: boolean;
  nodeDraggable?: boolean;
  selectedNodeIds?: string[];
  selectedNodePairs?: Array<{ from: string; to: string }>;
  selectedEdgeIndices?: number[];
  /** Controlled IDs whose tree descendants are hidden. */
  collapsedNodeIds?: string[];
  /** Initial collapsed IDs when expansion is uncontrolled. */
  defaultCollapsedNodeIds?: string[];
  onCollapsedNodeIdsChange?: (nodeIds: string[]) => void;
  onNodeClick?: (node: NetworkGraphNode) => void;
  onEdgeClick?: (edge: NetworkGraphEdge) => void;
  /** Optional handle for consumer-owned viewport controls. */
  viewportRef?: React.Ref<NetworkGraphViewportHandle>;
  /** Reports the current zoom scale; 1 represents 100%. */
  onZoomChange?: (scale: number) => void;
  renderNodeText?: (node: NetworkGraphNode) => React.ReactNode;
  emptyState?: React.ReactNode;
  ariaLabel?: string;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  /** Show the zoom buttons; wheel zoom remains available. */
  showZoomControls?: boolean;
  /** Localized accessible name for each branch toggle. */
  getBranchToggleLabel?: (node: NetworkGraphNode, expanded: boolean) => string;
}

interface GraphTransform {
  x: number;
  y: number;
  scale: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

type GraphGesture =
  | {
      kind: 'pan';
      pointerId: number;
      clientX: number;
      clientY: number;
      originX: number;
      originY: number;
      moved: boolean;
    }
  | {
      kind: 'node';
      pointerId: number;
      nodeId: string;
      clientX: number;
      clientY: number;
      originX: number;
      originY: number;
      moved: boolean;
    };

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 770;
const MIN_SCALE = 0.001;
const MAX_SCALE = 4;
const ZOOM_FACTOR = 1.15;
const DEFAULT_NODE_STROKE = 'var(--ui-border-on-surface-divider)';
const SELECTED_STROKE = 'var(--ui-border-on-surface-border-active)';
const SELECTED_EDGE_STROKE = 'var(--ui-background-status-strong-info)';

const NETWORK_ICONS: Record<
  string,
  React.ComponentType<{ size?: IconSize }>
> = {
  box: BoxIcon,
  'circle-connect': CircleConnectIcon,
  cloud: CloudIcon,
  'cloud-server': CloudServerIcon,
  ethernet: EthernetIcon,
  firewall: FirewallIcon,
  laptop: LaptopIcon,
  'network-server': NetworkServerIcon,
  'node-network': NodeNetworkIcon,
  'pc-tower': PcTowerIcon,
  router: RouterIcon,
  server: ServerIcon,
  wifi: WifiIcon,
};

function getNumericDimension(
  value: number | string | undefined,
  fallback: number
) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+(?:\.\d+)?px$/.test(value)) {
    return Number.parseFloat(value);
  }
  return fallback;
}

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function fitGraph(
  graphWidth: number,
  graphHeight: number,
  viewport: ViewportSize
): GraphTransform {
  if (graphWidth <= 0 || graphHeight <= 0) {
    return { x: viewport.width / 2, y: viewport.height / 2, scale: 1 };
  }
  const padding = 16;
  const availableWidth = Math.max(1, viewport.width - padding * 2);
  const availableHeight = Math.max(1, viewport.height - padding * 2);
  const scale = clampScale(
    Math.min(1, availableWidth / graphWidth, availableHeight / graphHeight)
  );
  return {
    x: (viewport.width - graphWidth * scale) / 2,
    y: (viewport.height - graphHeight * scale) / 2,
    scale,
  };
}

function resolveNodeIcon(icon: NetworkGraphNode['icon']): React.ReactNode {
  if (React.isValidElement(icon)) return icon;
  if (typeof icon !== 'string') return null;
  const Icon = NETWORK_ICONS[icon];
  return Icon ? <Icon size={24} /> : null;
}

function getNodeAccessibleName(node: NetworkGraphNode): string {
  return (
    [
      node.title,
      node.subtitle,
      node.caption,
      node.deviceIndicatorsLabel,
      ...(node.alerts?.map((alert) => alert.label) ?? []),
    ]
      .filter(
        (value): value is string =>
          typeof value === 'string' && value.length > 0
      )
      .join(', ') || node.id
  );
}

function getEdgeAccessibleName(
  edge: NetworkGraphEdge,
  nodesById: ReadonlyMap<string, NetworkGraphNode>
): string {
  const source = nodesById.get(edge.source);
  const target = nodesById.get(edge.target);
  return `${source ? getNodeAccessibleName(source) : edge.source} to ${target ? getNodeAccessibleName(target) : edge.target}`;
}

function nodePosition(
  nodeId: string,
  positions: ReadonlyMap<string, NetworkGraphPosition>,
  movedPositions: ReadonlyMap<string, { x: number; y: number }>
) {
  const moved = movedPositions.get(nodeId);
  if (moved) return moved;
  const position = positions.get(nodeId);
  return position ? { x: position.x, y: position.y } : { x: 0, y: 0 };
}

const NetworkGraph = React.forwardRef<HTMLDivElement, NetworkGraphProps>(
  (
    {
      graphData,
      width = '100%',
      height = DEFAULT_HEIGHT,
      horizontalGap,
      graphDraggable = false,
      nodeDraggable = false,
      selectedNodeIds,
      selectedNodePairs,
      selectedEdgeIndices,
      collapsedNodeIds,
      defaultCollapsedNodeIds,
      onCollapsedNodeIdsChange,
      onNodeClick,
      onEdgeClick,
      viewportRef: controlsRef,
      onZoomChange,
      renderNodeText,
      emptyState,
      ariaLabel = 'Network graph',
      zoomInLabel = 'Zoom in',
      zoomOutLabel = 'Zoom out',
      showZoomControls = true,
      getBranchToggleLabel = (node, expanded) =>
        `${expanded ? 'Collapse' : 'Expand'} ${getNodeAccessibleName(node)}`,
      className,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const gestureRef = React.useRef<GraphGesture | null>(null);
    const suppressClickRef = React.useRef(false);
    const [viewportSize, setViewportSize] = React.useState<ViewportSize>({
      width: getNumericDimension(width, DEFAULT_WIDTH),
      height: getNumericDimension(height, DEFAULT_HEIGHT),
    });
    const [transform, setTransform] = React.useState<GraphTransform>({
      x: DEFAULT_WIDTH / 2,
      y: DEFAULT_HEIGHT / 2,
      scale: 1,
    });
    const [movedPositions, setMovedPositions] = React.useState(
      () => new Map<string, { x: number; y: number }>()
    );
    const [activeNodeId, setActiveNodeId] = React.useState<string | null>(null);
    const [activeEdgeIndex, setActiveEdgeIndex] = React.useState<number | null>(
      null
    );
    const [uncontrolledCollapsedIds, setUncontrolledCollapsedIds] =
      React.useState<string[]>(() => defaultCollapsedNodeIds ?? []);
    const collapsedIds = collapsedNodeIds ?? uncontrolledCollapsedIds;

    const fullLayout = React.useMemo(
      () =>
        layoutNetworkGraph(
          graphData.nodes,
          graphData.edges,
          graphData.roots,
          horizontalGap
        ),
      [graphData, horizontalGap]
    );
    const treeChildren = React.useMemo(() => {
      const children = new Map<string, string[]>();
      for (const { source, target } of fullLayout.treeEdges) {
        children.set(source, [...(children.get(source) ?? []), target]);
      }
      return children;
    }, [fullLayout]);
    const layout = React.useMemo(() => {
      const collapsedSet = new Set(collapsedIds);
      const summaryByParent = new Map<string, string>();
      for (const node of graphData.nodes) {
        if (
          node.collapsedGroupId &&
          treeChildren.get(node.id)?.includes(node.collapsedGroupId)
        ) {
          summaryByParent.set(node.id, node.collapsedGroupId);
        }
      }
      if (collapsedSet.size === 0 && summaryByParent.size === 0)
        return fullLayout;
      const hidden = new Set<string>();
      const pending = [
        ...[...summaryByParent]
          .filter(([id]) => !collapsedSet.has(id))
          .map(([, summary]) => summary),
        ...collapsedIds.flatMap((id) =>
          (treeChildren.get(id) ?? []).filter(
            (child) => child !== summaryByParent.get(id)
          )
        ),
      ];
      while (pending.length) {
        const id = pending.pop()!;
        if (hidden.has(id)) continue;
        hidden.add(id);
        pending.push(...(treeChildren.get(id) ?? []));
      }
      if (hidden.size === 0) return fullLayout;
      const nodes = graphData.nodes.filter((node) => !hidden.has(node.id));
      const edges = graphData.edges.flatMap((edge, index) =>
        hidden.has(edge.source) || hidden.has(edge.target)
          ? []
          : [{ edge, index }]
      );
      const result = layoutNetworkGraph(
        nodes,
        edges.map(({ edge }) => edge),
        graphData.roots,
        horizontalGap
      );
      return {
        ...result,
        validEdges: result.validEdges.map((entry) => ({
          ...entry,
          index: edges[entry.index].index,
        })),
        treeEdges: result.treeEdges.map((entry) => ({
          ...entry,
          index: edges[entry.index].index,
        })),
      };
    }, [collapsedIds, fullLayout, graphData, treeChildren, horizontalGap]);
    const nodeIds = React.useMemo(
      () => new Set(layout.nodes.map((node) => node.id)),
      [layout.nodes]
    );
    const nodesById = React.useMemo(
      () => new Map(layout.nodes.map((node) => [node.id, node])),
      [layout.nodes]
    );
    const pathSelection = React.useMemo(
      () =>
        findNetworkGraphPaths(
          nodeIds,
          graphData.edges,
          selectedNodePairs ?? []
        ),
      [nodeIds, graphData.edges, selectedNodePairs]
    );

    React.useImperativeHandle(forwardedRef, () => viewportRef.current!, []);

    const layoutRef = React.useRef(layout);
    layoutRef.current = layout;

    React.useLayoutEffect(() => {
      const element = viewportRef.current;
      if (!element) return;

      const measure = () => {
        const bounds = element.getBoundingClientRect();
        setViewportSize({
          width: bounds.width || getNumericDimension(width, DEFAULT_WIDTH),
          height: bounds.height || getNumericDimension(height, DEFAULT_HEIGHT),
        });
      };
      measure();

      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }, [width, height]);

    React.useEffect(() => {
      setTransform(
        fitGraph(
          layoutRef.current.width,
          layoutRef.current.height,
          viewportSize
        )
      );
      setMovedPositions(new Map());
      setActiveNodeId(null);
      setActiveEdgeIndex(null);
      gestureRef.current = null;
    }, [fullLayout, viewportSize]);

    const previousCollapsedRef = React.useRef(collapsedIds);
    React.useEffect(() => {
      const previous = previousCollapsedRef.current;
      previousCollapsedRef.current = collapsedIds;
      if (!previous.some((id) => !collapsedIds.includes(id))) return;
      setTransform((current) => {
        const padding = 16;
        const fits =
          current.x >= padding &&
          current.y >= padding &&
          current.x + layout.width * current.scale <=
            viewportSize.width - padding &&
          current.y + layout.height * current.scale <=
            viewportSize.height - padding;
        return fits
          ? current
          : fitGraph(layout.width, layout.height, viewportSize);
      });
    }, [layout, viewportSize, collapsedIds]);

    const zoomAt = React.useCallback(
      (nextScale: number, pointX: number, pointY: number) => {
        setTransform((current) => {
          const scale = clampScale(nextScale);
          const ratio = scale / current.scale;
          return {
            scale,
            x: pointX - (pointX - current.x) * ratio,
            y: pointY - (pointY - current.y) * ratio,
          };
        });
      },
      []
    );

    const zoomTo = React.useCallback(
      (scale: number) => {
        if (!Number.isFinite(scale) || scale <= 0) return;
        zoomAt(scale, viewportSize.width / 2, viewportSize.height / 2);
      },
      [viewportSize, zoomAt]
    );
    const fitCurrentGraph = React.useCallback(() => {
      if (movedPositions.size === 0 || layout.nodes.length === 0) {
        setTransform(fitGraph(layout.width, layout.height, viewportSize));
        return;
      }
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const node of layout.nodes) {
        const point = nodePosition(node.id, layout.positions, movedPositions);
        const size = layout.nodeSizes.get(node.id)!;
        minX = Math.min(minX, point.x - size.width / 2);
        minY = Math.min(minY, point.y - size.height / 2);
        maxX = Math.max(maxX, point.x + size.width / 2);
        maxY = Math.max(maxY, point.y + size.height / 2);
      }
      const fitted = fitGraph(maxX - minX, maxY - minY, viewportSize);
      setTransform({
        ...fitted,
        x: fitted.x - minX * fitted.scale,
        y: fitted.y - minY * fitted.scale,
      });
    }, [layout, movedPositions, viewportSize]);
    React.useImperativeHandle(
      controlsRef,
      () => ({
        fit: fitCurrentGraph,
        zoomIn: () => zoomTo(transform.scale * ZOOM_FACTOR),
        zoomOut: () => zoomTo(transform.scale / ZOOM_FACTOR),
        setZoom: zoomTo,
      }),
      [fitCurrentGraph, transform.scale, zoomTo]
    );
    const zoomChangeRef = React.useRef(onZoomChange);
    zoomChangeRef.current = onZoomChange;
    React.useEffect(() => {
      zoomChangeRef.current?.(transform.scale);
    }, [transform.scale]);

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      const bounds = event.currentTarget.getBoundingClientRect();
      const factor = event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      zoomAt(
        transform.scale * factor,
        event.clientX - bounds.left,
        event.clientY - bounds.top
      );
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      suppressClickRef.current = false;
      if (event.button !== 0 || !graphDraggable) return;
      const isInteractiveTarget = event.nativeEvent
        .composedPath()
        .some(
          (target) =>
            target instanceof Element &&
            target.matches(
              'button, [data-network-node], [data-network-edge], [data-network-branch-toggle]'
            )
        );
      if (isInteractiveTarget) {
        return;
      }
      gestureRef.current = {
        kind: 'pan',
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        originX: transform.x,
        originY: transform.y,
        moved: false,
      };
    };

    const handleNodePointerDown = (
      event: React.PointerEvent<SVGGElement>,
      nodeId: string
    ) => {
      suppressClickRef.current = false;
      if (nodesById.get(nodeId)?.state === 'disabled') return;
      if (!nodeDraggable || event.button !== 0) return;
      event.stopPropagation();
      const point = nodePosition(nodeId, layout.positions, movedPositions);
      gestureRef.current = {
        kind: 'node',
        pointerId: event.pointerId,
        nodeId,
        clientX: event.clientX,
        clientY: event.clientY,
        originX: point.x,
        originY: point.y,
        moved: false,
      };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - gesture.clientX;
      const deltaY = event.clientY - gesture.clientY;
      const moved = gesture.moved || Math.hypot(deltaX, deltaY) > 5;
      if (!gesture.moved && moved && event.currentTarget.setPointerCapture) {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Some test and embedded DOMs expose pointer capture without implementing it.
        }
      }
      gestureRef.current = { ...gesture, moved };
      if (gesture.kind === 'pan') {
        setTransform((current) => ({
          ...current,
          x: gesture.originX + deltaX,
          y: gesture.originY + deltaY,
        }));
      } else {
        const ratio = 1 / transform.scale;
        setMovedPositions((current) => {
          const next = new Map(current);
          next.set(gesture.nodeId, {
            x: gesture.originX + deltaX * ratio,
            y: gesture.originY + deltaY * ratio,
          });
          return next;
        });
      }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      if (gesture.moved) suppressClickRef.current = true;
      gestureRef.current = null;
    };

    const handleNodeClick = React.useCallback(
      (
        event: Pick<MouseEvent, 'preventDefault' | 'stopPropagation'>,
        node: NetworkGraphNode
      ) => {
        if (node.state === 'disabled') return;
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          event.preventDefault();
          return;
        }
        if (selectedNodeIds === undefined) setActiveNodeId(node.id);
        onNodeClick?.(node);
      },
      [onNodeClick, selectedNodeIds]
    );

    const handleEdgeClick = (
      event: React.MouseEvent<SVGPathElement>,
      edge: NetworkGraphEdge,
      edgeIndex: number
    ) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        event.preventDefault();
        return;
      }
      if (selectedEdgeIndices === undefined) setActiveEdgeIndex(edgeIndex);
      onEdgeClick?.(edge);
    };

    const graphStyle: React.CSSProperties = {
      width,
      height,
      ...style,
    };
    const treeEdgeIndices = new Set(layout.treeEdges.map(({ index }) => index));
    const treeChildrenByParent = new Map<string, string[]>();
    for (const { source, target } of layout.treeEdges) {
      const children = treeChildrenByParent.get(source) ?? [];
      children.push(target);
      treeChildrenByParent.set(source, children);
    }

    const edgePath = (edge: NetworkGraphEdge, index: number) => {
      const source = nodePosition(
        edge.source,
        layout.positions,
        movedPositions
      );
      const target = nodePosition(
        edge.target,
        layout.positions,
        movedPositions
      );
      const sourceSize = layout.nodeSizes.get(edge.source) ?? {
        width: 192,
        height: 56,
      };
      const targetSize = layout.nodeSizes.get(edge.target) ?? {
        width: 192,
        height: 56,
      };

      if (edge.source === edge.target) {
        const loopX = source.x + sourceSize.width / 2 - 8;
        const loopY = source.y - sourceSize.height / 2 + 8;
        return `M ${loopX} ${loopY} C ${loopX + 56} ${loopY - 56}, ${loopX + 56} ${loopY + 56}, ${loopX} ${loopY + 40}`;
      }

      if (treeEdgeIndices.has(index)) {
        const sourceBottom = source.y + sourceSize.height / 2;
        const targetTop = target.y - targetSize.height / 2;
        const siblings = treeChildrenByParent.get(edge.source) ?? [];
        if (siblings.length <= 1) {
          return `M ${source.x} ${sourceBottom} V ${targetTop}`;
        }
        const junctionY = (sourceBottom + targetTop) / 2;
        const siblingXs = siblings.map(
          (id) => nodePosition(id, layout.positions, movedPositions).x
        );
        const isOuter =
          target.x === Math.min(...siblingXs) ||
          target.x === Math.max(...siblingXs);
        const dx = target.x - source.x;
        const dy = targetTop - junctionY;
        const radius = Math.min(16, Math.abs(dx) / 2, Math.abs(dy));
        if (isOuter && radius > 0) {
          return `M ${source.x} ${sourceBottom} V ${junctionY} H ${target.x - Math.sign(dx) * radius} Q ${target.x} ${junctionY} ${target.x} ${junctionY + Math.sign(dy) * radius} V ${targetTop}`;
        }
        return `M ${source.x} ${sourceBottom} V ${junctionY} H ${target.x} V ${targetTop}`;
      }

      const deltaX = target.x - source.x;
      const deltaY = target.y - source.y;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction = Math.sign(deltaX) || 1;
        const sourceX = source.x + direction * (sourceSize.width / 2);
        const targetX = target.x - direction * (targetSize.width / 2);
        const middleX = (sourceX + targetX) / 2;
        return `M ${sourceX} ${source.y} C ${middleX} ${source.y}, ${middleX} ${target.y}, ${targetX} ${target.y}`;
      }

      const direction = Math.sign(deltaY) || 1;
      const sourceY = source.y + direction * (sourceSize.height / 2);
      const targetY = target.y - direction * (targetSize.height / 2);
      const middleY = (sourceY + targetY) / 2;
      return `M ${source.x} ${sourceY} C ${source.x} ${middleY}, ${target.x} ${middleY}, ${target.x} ${targetY}`;
    };

    return (
      <div
        ref={viewportRef}
        role="region"
        aria-label={ariaLabel}
        data-slot="network-graph"
        className={cn(
          'relative w-full overflow-hidden text-[var(--ui-text-on-surface-primary)]',
          graphDraggable && 'cursor-grab active:cursor-grabbing',
          className
        )}
        style={graphStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        {...props}
      >
        {showZoomControls && (
          <div className="absolute end-3 top-3 z-10 flex flex-col gap-1 rounded-[4px] border border-[var(--ui-border-on-surface-divider)] bg-[var(--ui-background-surface-primary)] p-1 shadow-sm">
            <button
              type="button"
              aria-label={zoomInLabel}
              className="inline-flex size-8 items-center justify-center rounded-[4px] text-[var(--ui-glyph-on-surface-primary)] hover:bg-[var(--ui-background-surface-active)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]"
              onClick={() =>
                zoomAt(
                  transform.scale * ZOOM_FACTOR,
                  viewportSize.width / 2,
                  viewportSize.height / 2
                )
              }
            >
              <MagnifierPlusIcon size={24} />
            </button>
            <button
              type="button"
              aria-label={zoomOutLabel}
              className="inline-flex size-8 items-center justify-center rounded-[4px] text-[var(--ui-glyph-on-surface-primary)] hover:bg-[var(--ui-background-surface-active)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]"
              onClick={() =>
                zoomAt(
                  transform.scale / ZOOM_FACTOR,
                  viewportSize.width / 2,
                  viewportSize.height / 2
                )
              }
            >
              <MagnifierMinusIcon size={24} />
            </button>
          </div>
        )}
        {layout.nodes.length === 0 && emptyState != null ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {emptyState}
          </div>
        ) : (
          <svg
            className="size-full touch-none select-none"
            viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
            preserveAspectRatio="none"
          >
            <g
              transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}
            >
              {layout.validEdges.map(({ edge, index }) => {
                const selected =
                  pathSelection.edgeIndices.has(index) ||
                  (selectedEdgeIndices?.includes(index) ?? false) ||
                  (selectedEdgeIndices === undefined &&
                    activeEdgeIndex === index);
                const path = edgePath(edge, index);
                return (
                  <g key={`edge-${index}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke={
                        selected
                          ? SELECTED_EDGE_STROKE
                          : (edge.color ?? DEFAULT_NODE_STROKE)
                      }
                      strokeWidth={selected ? 3 : 2}
                      strokeDasharray={
                        edge.style === 'dotted' ? '2 6' : undefined
                      }
                      strokeLinecap="round"
                      pointerEvents="none"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      className="cursor-pointer focus-visible:outline-none focus-visible:stroke-[var(--ui-focus-primary)] focus-visible:stroke-[3px]"
                      data-network-edge={index}
                      role="button"
                      tabIndex={0}
                      aria-label={getEdgeAccessibleName(edge, nodesById)}
                      aria-pressed={selected}
                      onClick={(event) => handleEdgeClick(event, edge, index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleEdgeClick(
                            event as unknown as React.MouseEvent<SVGPathElement>,
                            edge,
                            index
                          );
                        }
                      }}
                    />
                  </g>
                );
              })}
              {layout.nodes.map((node) => {
                const point = nodePosition(
                  node.id,
                  layout.positions,
                  movedPositions
                );
                const selected =
                  (selectedNodeIds?.includes(node.id) ?? false) ||
                  pathSelection.nodeIds.has(node.id) ||
                  (selectedNodeIds === undefined && activeNodeId === node.id);
                const variant = node.variant ?? 'device';
                const state = node.state ?? 'default';
                const isDisabled = state === 'disabled';
                const isError = state === 'error';
                const isActive =
                  selected || state === 'active' || state === 'focus';
                const isHovered = state === 'hover';
                const circle = node.shape === 'circle';
                const iconNode = resolveNodeIcon(node.icon);
                const nodeSize = layout.nodeSizes.get(node.id) ?? {
                  width: 192,
                  height: 56,
                };
                const cardSize = getBaseNetworkGraphNodeSize(node);
                const indicatorCount = node.deviceIndicators?.length ?? 0;
                const indicatorHeight = getNetworkGraphIndicatorsHeight(node);
                const nodeLeft = point.x - nodeSize.width / 2;
                const nodeTop = point.y - nodeSize.height / 2;
                const alertsTop =
                  nodeTop +
                  cardSize.height +
                  (indicatorCount ? 4 + indicatorHeight : 0) +
                  (node.alerts?.length ? 4 : 0);
                const squareIconBadge =
                  node.deviceType != null
                    ? node.deviceType === 'networking'
                    : variant === 'gateway' || node.icon === 'ethernet';
                const iconBadgeShape = squareIconBadge
                  ? 'rounded-[4px]'
                  : 'rounded-[24px]';
                const iconBadgeClass = isDisabled
                  ? cn(
                      'size-10 bg-[var(--ui-background-status-neutral)] text-[var(--ui-glyph-on-surface-disabled)]',
                      iconBadgeShape
                    )
                  : isError
                    ? cn(
                        'size-10 bg-[var(--ui-background-status-danger)] text-[var(--ui-glyph-on-status-danger)]',
                        iconBadgeShape
                      )
                    : isActive
                      ? cn(
                          'size-10 bg-[var(--ui-background-status-strong-info)] text-[var(--ui-glyph-on-status-strong-primary)]',
                          iconBadgeShape
                        )
                      : variant === 'network'
                        ? 'size-10 rounded-[24px] bg-[var(--ui-background-status-strong-info)] text-[var(--ui-glyph-on-status-strong-primary)]'
                        : variant === 'subnet'
                          ? 'size-10 rounded-full bg-[var(--ui-background-status-info)] text-[var(--ui-glyph-on-surface-primary)]'
                          : node.deviceType === 'networking' ||
                              (node.deviceType == null &&
                                (variant === 'gateway' ||
                                  node.icon === 'ethernet'))
                            ? 'size-10 rounded-[4px] bg-[var(--ui-background-status-info)] text-[var(--ui-glyph-on-surface-primary)]'
                            : 'size-10 rounded-[24px] bg-[var(--ui-background-status-info)] text-[var(--ui-glyph-on-surface-primary)]';
                const nodeContentClass =
                  variant === 'gateway' || variant === 'device'
                    ? 'flex h-full min-w-0 items-center gap-2 overflow-hidden'
                    : 'flex h-full flex-col items-center justify-center gap-2 overflow-hidden text-center';
                const customTextClass =
                  variant === 'gateway' || variant === 'device'
                    ? 'flex min-w-0 max-w-full flex-1 flex-col justify-center overflow-hidden text-left'
                    : 'flex w-full min-w-0 max-w-full flex-col items-center justify-center overflow-hidden text-center';
                const primaryTextClass =
                  variant === 'network'
                    ? 'line-clamp-1 max-w-full text-sm font-bold leading-4 text-[var(--ui-text-on-surface-primary)]'
                    : variant === 'group'
                      ? 'line-clamp-1 max-w-full text-sm font-semibold leading-6 text-[var(--ui-text-on-surface-primary)]'
                      : variant === 'subnet'
                        ? 'line-clamp-1 max-w-full text-sm leading-6 text-[var(--ui-text-on-surface-primary)]'
                        : 'line-clamp-1 max-w-full text-sm leading-6 text-[var(--ui-text-on-surface-primary)]';
                const secondaryTextClass =
                  variant === 'network'
                    ? 'line-clamp-1 max-w-full text-sm font-bold leading-4 text-[var(--ui-text-on-surface-primary)]'
                    : 'line-clamp-1 max-w-full text-[10px] font-bold leading-4 tracking-[1px] text-[var(--ui-text-on-surface-secondary)]';
                const titleText =
                  variant === 'gateway' || variant === 'device'
                    ? node.subtitle
                    : node.title;
                const subtitleText =
                  variant === 'gateway' || variant === 'device'
                    ? node.title
                    : node.subtitle;
                const nodeContent = (
                  <>
                    {iconNode != null && (
                      <span
                        className={cn(
                          'flex shrink-0 items-center justify-center [&_svg]:size-6 [&_svg]:shrink-0',
                          iconBadgeClass
                        )}
                      >
                        {iconNode}
                      </span>
                    )}
                    {renderNodeText ? (
                      <div
                        className={cn(
                          'w-full min-w-0 max-w-full [overflow-wrap:anywhere] [&>*]:min-w-0 [&>*]:max-w-full',
                          customTextClass,
                          isDisabled &&
                            'text-[var(--ui-text-on-surface-disabled)]'
                        )}
                      >
                        {renderNodeText(node)}
                      </div>
                    ) : (
                      <div className={customTextClass}>
                        {titleText && (
                          <span
                            className={cn(
                              secondaryTextClass,
                              isDisabled &&
                                'text-[var(--ui-text-on-surface-disabled)]',
                              isError &&
                                'text-[var(--ui-text-on-surface-destructive)]',
                              isActive &&
                                'text-[var(--ui-text-on-surface-link-idle)]'
                            )}
                          >
                            {titleText}
                          </span>
                        )}
                        {subtitleText && (
                          <span
                            className={cn(
                              primaryTextClass,
                              isDisabled &&
                                'text-[var(--ui-text-on-surface-secondary)]',
                              isActive &&
                                (variant === 'device' ||
                                  variant === 'gateway') &&
                                'font-semibold'
                            )}
                          >
                            {subtitleText}
                          </span>
                        )}
                        {node.caption && (
                          <span
                            className={cn(
                              'line-clamp-1 max-w-full text-[10px] leading-4 text-[var(--ui-text-on-surface-secondary)]',
                              isDisabled &&
                                'text-[var(--ui-text-on-surface-disabled)]'
                            )}
                          >
                            {node.caption}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                );
                return (
                  <g
                    key={node.id}
                    data-network-node={node.id}
                    data-network-node-variant={variant}
                    data-network-node-state={state}
                    role="button"
                    tabIndex={isDisabled ? -1 : 0}
                    aria-label={getNodeAccessibleName(node)}
                    aria-pressed={selected}
                    aria-disabled={isDisabled || undefined}
                    className={cn(
                      'group focus-visible:outline-none [&:focus-visible>circle]:stroke-[var(--ui-focus-primary)] [&:focus-visible>circle]:stroke-[3px]',
                      isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    )}
                    onPointerDown={(event) =>
                      handleNodePointerDown(event, node.id)
                    }
                    onClick={(event) => handleNodeClick(event, node)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleNodeClick(event, node);
                      }
                    }}
                  >
                    {circle && (
                      <circle
                        cx={point.x}
                        cy={nodeTop + cardSize.height / 2}
                        r={Math.min(cardSize.width, cardSize.height) / 2}
                        fill="var(--ui-background-surface-primary)"
                        stroke={
                          selected
                            ? SELECTED_STROKE
                            : (node.color ?? DEFAULT_NODE_STROKE)
                        }
                        strokeWidth={selected ? 2 : 1}
                      />
                    )}
                    {circle ? (
                      <foreignObject
                        x={nodeLeft + 8}
                        y={nodeTop + 8}
                        width={cardSize.width - 16}
                        height={cardSize.height - 16}
                        overflow="hidden"
                        pointerEvents="none"
                      >
                        <div className={nodeContentClass}>{nodeContent}</div>
                      </foreignObject>
                    ) : (
                      <foreignObject
                        x={nodeLeft}
                        y={nodeTop}
                        width={cardSize.width}
                        height={cardSize.height}
                        overflow="visible"
                        pointerEvents="none"
                      >
                        <Card
                          data-network-card={node.id}
                          hasError={isError}
                          className={cn(
                            'h-full w-full rounded-lg p-0 shadow-none group-focus-visible:ring-[3px] group-focus-visible:ring-[var(--ui-focus-primary)]',
                            variant === 'network'
                              ? 'border-0 bg-[var(--ui-background-surface-active)]'
                              : isError
                                ? 'border-[var(--ui-border-on-status-danger)] bg-[var(--ui-background-surface-primary)]'
                                : isDisabled
                                  ? 'border-[var(--ui-border-on-status-neutral)] bg-[var(--ui-background-surface-primary)]'
                                  : isActive
                                    ? 'border-[var(--ui-border-on-surface-border-active)] bg-[var(--ui-background-status-info-pressed)]'
                                    : isHovered
                                      ? 'border-[var(--ui-border-on-surface-divider)] bg-[var(--ui-background-status-info-hover)]'
                                      : 'border-[var(--ui-border-on-surface-divider)] bg-[var(--ui-background-surface-primary)]',
                            state === 'default' &&
                              !selected &&
                              'group-hover:bg-[var(--ui-background-status-info-hover)]',
                            state === 'focus' &&
                              'ring-[3px] ring-[var(--ui-focus-primary)]',
                            selected &&
                              'border-[var(--ui-border-on-surface-border-active)]'
                          )}
                          style={{
                            borderColor: isActive
                              ? SELECTED_STROKE
                              : (node.color ??
                                (isError
                                  ? 'var(--ui-border-on-status-danger)'
                                  : isDisabled
                                    ? 'var(--ui-border-on-status-neutral)'
                                    : isHovered
                                      ? DEFAULT_NODE_STROKE
                                      : variant === 'network'
                                        ? 'transparent'
                                        : DEFAULT_NODE_STROKE)),
                            borderWidth: variant === 'network' ? 0 : 1,
                          }}
                        >
                          <div
                            className={cn(
                              'h-full w-full',
                              variant === 'network'
                                ? 'px-2 py-4'
                                : 'py-2 ps-2 pe-3',
                              isDisabled &&
                                'text-[var(--ui-text-on-surface-disabled)]',
                              nodeContentClass
                            )}
                          >
                            {nodeContent}
                          </div>
                        </Card>
                      </foreignObject>
                    )}
                    {indicatorCount > 0 ? (
                      <foreignObject
                        x={nodeLeft}
                        y={nodeTop + cardSize.height}
                        width={nodeSize.width}
                        height={nodeSize.height - cardSize.height}
                        overflow="visible"
                        pointerEvents="none"
                      >
                        <div
                          className="flex w-full flex-wrap content-center items-center justify-center gap-1 py-2"
                          aria-hidden="true"
                          data-network-device-indicators={node.id}
                        >
                          {node.deviceIndicators?.map((indicator, index) => (
                            <span
                              key={`${node.id}-indicator-${index}`}
                              data-network-device-indicator={
                                typeof indicator === 'string'
                                  ? indicator
                                  : indicator.state
                              }
                              className={cn(
                                'shrink-0 rounded-[4px]',
                                typeof indicator === 'object' &&
                                  indicator.size === 14
                                  ? 'size-[14px]'
                                  : 'size-3',
                                (typeof indicator === 'string'
                                  ? indicator
                                  : indicator.state) === 'active'
                                  ? 'bg-[var(--ui-glyph-on-surface-primary)]'
                                  : (typeof indicator === 'string'
                                        ? indicator
                                        : indicator.state) === 'error'
                                    ? 'bg-[var(--ui-background-status-strong-danger)]'
                                    : (typeof indicator === 'string'
                                          ? indicator
                                          : indicator.state) === 'muted'
                                      ? 'bg-[var(--ui-border-on-surface-divider)]'
                                      : 'border border-[var(--ui-border-on-surface-divider)]'
                              )}
                            />
                          ))}
                        </div>
                      </foreignObject>
                    ) : null}
                    {node.alerts?.length ? (
                      <foreignObject
                        x={nodeLeft}
                        y={alertsTop}
                        width={nodeSize.width}
                        height={nodeSize.height - cardSize.height}
                        overflow="visible"
                        pointerEvents="none"
                      >
                        <div className="flex w-full flex-col gap-1">
                          {node.alerts.map((alert, index) => (
                            <div
                              key={alert.id ?? `${node.id}-alert-${index}`}
                              className="flex h-6 shrink-0 items-center justify-center gap-1 rounded-lg border border-[var(--ui-border-on-status-danger)] bg-[var(--ui-background-status-danger)] px-2 text-[10px] font-bold leading-4 tracking-[1px] text-[var(--ui-text-on-surface-primary)]"
                              data-network-node-alert={alert.label}
                              aria-hidden="true"
                            >
                              <DiamondWarningRedIcon size={16} />
                              <span className="truncate">{alert.label}</span>
                            </div>
                          ))}
                        </div>
                      </foreignObject>
                    ) : null}
                    {circle ? (
                      <circle
                        cx={point.x}
                        cy={nodeTop + cardSize.height / 2}
                        r={Math.min(cardSize.width, cardSize.height) / 2}
                        fill="transparent"
                        pointerEvents="all"
                      />
                    ) : (
                      <rect
                        x={nodeLeft}
                        y={nodeTop}
                        width={nodeSize.width}
                        height={nodeSize.height}
                        fill="transparent"
                        pointerEvents="all"
                      />
                    )}
                  </g>
                );
              })}
              {layout.nodes.map((node) => {
                if (!node.expandable || !treeChildren.get(node.id)?.length) {
                  return null;
                }
                const position = nodePosition(
                  node.id,
                  layout.positions,
                  movedPositions
                );
                const size = layout.nodeSizes.get(node.id)!;
                const expanded = !collapsedIds.includes(node.id);
                const y = position.y + size.height / 2 + 20;
                const toggle = () => {
                  const next = expanded
                    ? [...collapsedIds, node.id]
                    : collapsedIds.filter((id) => id !== node.id);
                  if (collapsedNodeIds === undefined)
                    setUncontrolledCollapsedIds(next);
                  onCollapsedNodeIdsChange?.(next);
                };
                return (
                  <g
                    key={`toggle-${node.id}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={expanded}
                    aria-label={getBranchToggleLabel(node, expanded)}
                    data-network-branch-toggle={node.id}
                    className="cursor-pointer focus-visible:outline-none [&:focus-visible>circle]:stroke-[var(--ui-focus-primary)] [&:focus-visible>circle]:stroke-[3px]"
                    onClick={toggle}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle();
                      }
                    }}
                  >
                    <circle
                      cx={position.x}
                      cy={y}
                      r={12}
                      fill="transparent"
                      pointerEvents="all"
                    />
                    <foreignObject
                      x={position.x - 8}
                      y={y - 8}
                      width={16}
                      height={16}
                      pointerEvents="none"
                    >
                      <span className="flex text-[var(--ui-glyph-on-surface-primary)]">
                        {expanded ? (
                          <ChevronUpIcon size={16} />
                        ) : (
                          <ChevronDownIcon size={16} />
                        )}
                      </span>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>
    );
  }
);

NetworkGraph.displayName = 'NetworkGraph';

export { NetworkGraph };
