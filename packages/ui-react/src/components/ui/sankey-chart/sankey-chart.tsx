'use client';

import * as React from 'react';
import { Sankey as RechartsSankey, Rectangle } from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  type ChartConfig,
  type ChartPalette,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives — a flow
// diagram where link width is proportional to the value flowing between nodes.
// Like Treemap/Funnel it's a single recharts element (`<Sankey>`) themed through
// custom `node` / `link` renderers (recharts' defaults paint one flat grey and
// carry no token hooks). No CVA variant: a Sankey's expressiveness is the
// nodes/links graph + geometry (plain props), not a visual "mode".
//
// Node `name`s are the color keys: each must match a `config` entry, so they
// must be CSS-safe (they become part of a `--color-<name>` custom property).
// The human-readable text comes from `config[name].label`.

/** A node in the flow — `name` is its color/config key (CSS-safe, unique). */
export interface SankeyChartNode {
  name: string;
}

/** A directed flow between two nodes, referenced by their index in `nodes`. */
export interface SankeyChartLink {
  /** Index of the source node in `data.nodes`. */
  source: number;
  /** Index of the target node in `data.nodes`. */
  target: number;
  /** Flow magnitude — drives the link's width. */
  value: number;
  /**
   * Ribbon color (any CSS color, e.g. a `var(--ui-*)` token), rendered at **full
   * opacity** so it matches its node bar. Omit to use the target node's color at
   * 35% (the default tinted ribbon).
   */
  color?: string;
}

export interface SankeyChartProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /** The graph: `nodes` (color keys) + `links` (source/target indices + value). */
  data: {
    nodes: ReadonlyArray<SankeyChartNode>;
    links: ReadonlyArray<SankeyChartLink>;
  };
  /**
   * Per-node map of `label` / `color`, keyed by the node's `name` (imported from
   * the shared `Chart` primitives). Turned into `--color-<name>` custom
   * properties. Colors are caller-supplied — reference an existing semantic
   * `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Vertical gap between nodes in the same column. */
  nodePadding?: number;
  /** Thickness of each node bar. */
  nodeWidth?: number;
  /** Curviness of the links (0 = straight, 1 = fully curved). */
  linkCurvature?: number;
  /**
   * Sort nodes vertically to minimize link crossings (recharts' relaxation).
   * Defaults to `false` — nodes render in the order given by `data.nodes` within
   * each column, which keeps curated flows tidy; set `true` to auto-order.
   */
  sort?: boolean;
  /** Render each node's label (from `config[name].label`) beside its bar. */
  showLabels?: boolean;
  /** Render a legend (color dot + label + value + % per node) below the chart. */
  showLegend?: boolean;
  /** Show a hover tooltip on nodes and links (dot + `source → target` + value). */
  showTooltip?: boolean;
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting without composing recharts yourself. Ignored when
   * `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

// recharts injects these into the `node` / `link` render functions but doesn't
// export their prop types from the package root, so we type the fields we use
// (structurally compatible with recharts' internal NodeProps / LinkProps).
interface SankeyNodeShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: { name: string; value: number };
}

interface SankeyLinkShapeProps {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  // recharts spreads the original link onto `payload` (then overrides
  // source/target with node objects), so a custom `color` survives here.
  payload: {
    source: { name: string };
    target: { name: string };
    value: number;
    color?: string;
  };
}

// Node bar: a rect filled from `--color-<name>`, with the config label placed on
// whichever side keeps it inside the plot — to the right for nodes that have
// outgoing links (sources), to the left for terminal nodes (sinks).
function makeNodeRenderer(
  config: ChartConfig,
  sourceIndices: ReadonlySet<number>,
  showLabels: boolean
) {
  return function SankeyNodeShape({
    x,
    y,
    width,
    height,
    index,
    payload,
  }: SankeyNodeShapeProps) {
    const name = String(payload.name);
    const label = config[name]?.label ?? name;
    const isSource = sourceIndices.has(index);
    return (
      <g>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`var(--color-${name})`}
          radius={2}
        />
        {showLabels && (
          <text
            x={isSource ? x + width + 6 : x - 6}
            y={y + height / 2}
            textAnchor={isSource ? 'start' : 'end'}
            dominantBaseline="middle"
            className="fill-foreground text-xs"
          >
            {label}
          </text>
        )}
      </g>
    );
  };
}

// Link ribbon: a bezier stroked at 35% opacity in the link's own `color` if
// given (recharts preserves custom link fields on the render `payload`), else
// the **target** node's color (so a flow reads as "where it goes"). Drawn as a
// stroke, not a fill, so the ribbon width comes from `linkWidth`.
function SankeyLinkShape({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  payload,
}: SankeyLinkShapeProps) {
  const targetName = String(payload.target.name);
  const stroke = payload.color ?? `var(--color-${targetName})`;
  return (
    <path
      d={`M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
      fill="none"
      stroke={stroke}
      strokeWidth={Math.max(1, linkWidth)}
      // An explicit per-link color is the caller's exact choice — render it at
      // full opacity (so it matches its node bar); the default target-tint is
      // dimmed to 35% so ribbons don't overwhelm the nodes.
      strokeOpacity={payload.color ? 1 : 0.35}
    />
  );
}

// Default tooltip: recharts' Sankey payload carries no config color, and labels
// a hovered link "source - target" using the node keys (a node is a single key).
// Parse that name to a color dot (the target node's color) + the mapped config
// labels joined with an arrow + the value — driven by `config`, so it's reliable
// where the shared ChartTooltipContent can't resolve the Sankey payload.
//
// Exported (module-only, not from the package barrel) so its branches can be
// unit-tested directly: recharts can't lay out a Sankey in happy-dom, and its
// hover tooltip has no statically-open form the component exposes, so rendering
// `<SankeyChart>` never reaches this code.
export function makeSankeyTooltip(
  config: ChartConfig,
  links: ReadonlyArray<SankeyChartLink>,
  nodes: ReadonlyArray<SankeyChartNode>
) {
  const labelFor = (key: string): React.ReactNode => config[key]?.label ?? key;
  // Resolve each link's dot color by its "source - target" name (which is the
  // tooltip item's name): the link's own color if set, else the target's, via
  // the `--color-<name>` bridge so a per-theme config resolves too.
  const styleByName = new Map<string, { color: string; opacity: number }>();
  for (const link of links) {
    const source = nodes[link.source]?.name ?? '';
    const target = nodes[link.target]?.name ?? '';
    // Mirror the ribbon: an explicit color renders full-opacity; the default
    // target tint renders at 35%.
    styleByName.set(source + ' - ' + target, {
      color: link.color ?? `var(--color-${target})`,
      opacity: link.color ? 1 : 0.35,
    });
  }

  return function SankeyTooltipContent({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: ReadonlyArray<{
      name?: string | number;
      value?: number | string | ReadonlyArray<number | string>;
    }>;
  }) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const parts = String(item?.name ?? '').split(' - ');
    const targetKey = parts[parts.length - 1];
    const linkStyle = styleByName.get(String(item?.name ?? ''));
    const dotColor = linkStyle?.color ?? `var(--color-${targetKey})`;
    const dotOpacity = linkStyle?.opacity ?? 1;
    const value = item?.value;
    return (
      <div className="flex items-center gap-2 rounded-[var(--ui-tooltip-container-border-radius)] border border-border bg-background px-[var(--ui-tooltip-container-padding-x)] py-[var(--ui-tooltip-container-padding-y)] text-xs text-foreground shadow-md">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: dotColor, opacity: dotOpacity }}
        />
        <span className="text-muted-foreground">
          {/* A config label can be any ReactNode, so the arrow-joined label is
              built as nodes rather than stringified. */}
          {parts.map((key, index) => (
            <React.Fragment key={`${key}-${index}`}>
              {index > 0 && ' → '}
              {labelFor(key)}
            </React.Fragment>
          ))}
        </span>
        {value != null && (
          <span className="ms-2 font-medium tabular-nums">
            {formatTooltipValue(value)}
          </span>
        )}
      </div>
    );
  };
}

// recharts types a tooltip item's value as a scalar *or* a range tuple; a plain
// `String()` would print "1,2" for the tuple, so format each part and join.
function formatTooltipValue(
  value: number | string | ReadonlyArray<number | string>
): string {
  if (Array.isArray(value)) {
    return value.map((part) => formatTooltipValue(part)).join(' – ');
  }
  return typeof value === 'number'
    ? value.toLocaleString()
    : String(value as string);
}

const SankeyChart = React.forwardRef<HTMLDivElement, SankeyChartProps>(
  (
    {
      className,
      config,
      palette,
      data,
      nodePadding = 24,
      nodeWidth = 12,
      linkCurvature = 0.5,
      sort = false,
      showLabels = true,
      showLegend = false,
      showTooltip = true,
      tooltipContent,
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${uniqueId.replace(/:/g, '')}`;

    // Node indices that appear as a link `source` have outgoing flow — used by
    // the node renderer to place the label on the readable side.
    const sourceIndices = React.useMemo(
      () => new Set(data.links.map((link) => link.source)),
      [data.links]
    );

    const nodeRenderer = React.useMemo(
      () => makeNodeRenderer(config, sourceIndices, showLabels),
      [config, sourceIndices, showLabels]
    );

    const defaultTooltip = React.useMemo(
      () => makeSankeyTooltip(config, data.links, data.nodes),
      [config, data.links, data.nodes]
    );

    // Per-node value (incoming flow, or outgoing for a source with no incoming)
    // and its share of the largest node — drives the legend's count + %.
    const nodeStats = React.useMemo(() => {
      const incoming = new Map<number, number>();
      const outgoing = new Map<number, number>();
      for (const link of data.links) {
        outgoing.set(link.source, (outgoing.get(link.source) ?? 0) + link.value);
        incoming.set(link.target, (incoming.get(link.target) ?? 0) + link.value);
      }
      const values = data.nodes.map(
        (_, i) => incoming.get(i) ?? outgoing.get(i) ?? 0
      );
      const total = values.length ? Math.max(...values) : 0;
      return data.nodes.map((node, i) => ({
        name: node.name,
        value: values[i],
        pct: total > 0 ? Math.round((values[i] / total) * 100) : 0,
      }));
    }, [data]);

    return (
      <div
        ref={ref}
        // The legend sits outside `ChartContainer`, so the root carries its own
        // `--color-<name>` scope for it (the plot and the recharts-portaled
        // tooltip resolve theirs from ChartContainer's).
        data-chart={chartId}
        className={cn('flex flex-col', className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ChartContainer config={config} palette={palette} className="min-h-0 flex-1">
          <RechartsSankey
            data={data as { nodes: SankeyChartNode[]; links: SankeyChartLink[] }}
            node={nodeRenderer}
            link={SankeyLinkShape}
            nodePadding={nodePadding}
            nodeWidth={nodeWidth}
            linkCurvature={linkCurvature}
            sort={sort}
            // recharts defaults to `justify`, which right-aligns sink nodes to
            // the last column — so a terminal node like "No certification" would
            // jump to the far right instead of staying at its real depth. `left`
            // positions every node by its distance from the source, keeping the
            // flow's columns intact.
            align="left"
            // Node labels never extend past the plot's right edge: a node in the
            // last column has no outgoing links, so its label is drawn to the
            // LEFT of its bar (see the node renderer). Only a small gutter is
            // needed here — a wide reserve would just shrink the diagram.
            margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
          >
            {showTooltip && (
              <ChartTooltip content={tooltipContent ?? defaultTooltip} />
            )}
          </RechartsSankey>
        </ChartContainer>
        {showLegend && (
          <div
            data-slot="sankey-chart-legend"
            className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs"
          >
            {nodeStats.map(({ name, value, pct }) => (
              <div key={name} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: `var(--color-${name})` }}
                />
                <span className="truncate text-muted-foreground">
                  {config[name]?.label ?? name}
                </span>
                <span className="ms-auto font-semibold tabular-nums">
                  {value.toLocaleString()}
                </span>
                <span className="w-9 shrink-0 text-end tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
SankeyChart.displayName = 'SankeyChart';

export { SankeyChart };
