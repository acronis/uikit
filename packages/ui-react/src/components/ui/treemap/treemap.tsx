'use client';

import * as React from 'react';
import { Treemap as RechartsTreemap } from 'recharts';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. A treemap is
// the odd one out: a single `Treemap` element with no axes/grid/legend, themed
// through a custom `content` cell renderer (recharts' default paints every cell
// the same fill and has no token hooks). Like Scatter/Composed/RadialBar there's
// no CVA variant — a treemap's knobs are geometry (`aspectRatio`) and the data,
// not a visual "mode". v1 is a flat treemap (a list of leaves).

interface TreemapCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // recharts injects the node's resolved `name` (from nameKey) + value.
  name?: string;
  showLabels?: boolean;
}

// Cell renderer: fill each rect from its `--color-<name>` var, separate cells
// with the surface color, and center a white label (readable over the saturated
// series colors) when the cell is big enough. Passed to `Treemap.content`;
// recharts clones it with each node's geometry + `name`.
export function TreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  showLabels = true,
}: TreemapCellProps) {
  // recharts invokes `content` for the synthetic root node too (full chart
  // dimensions, empty name). Skip any name-less node — otherwise its rect has no
  // `--color-<name>` fill and paints the SVG-default black behind everything
  // (invisible when leaves cover it, a black box on empty data).
  if (!name) return <g />;
  const canLabel = showLabels && width > 64 && height > 28;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        strokeWidth={2}
        className="stroke-background"
        style={{ fill: `var(--color-${name})` }}
      />
      {canLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          // The design system's "text on a strong colored surface" token
          // (constant white in both themes) — reads over the saturated series
          // colors without hardcoding a color.
          className="fill-[var(--ui-text-on-status-strong-neutral)] text-xs"
        >
          {name}
        </text>
      )}
    </g>
  );
}

export interface TreemapProps
  extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Row-per-leaf data. Each object holds the leaf's `nameKey` label + its `dataKey` numeric size. */
  data: ReadonlyArray<Record<string, string | number>>;
  /**
   * Per-leaf map of `label` / `color`, keyed by the leaf's `nameKey` value
   * (imported from the shared `Chart` primitives). Turned into `--color-<name>`
   * custom properties. Colors are caller-supplied — reference an existing
   * semantic `--ui-*` token; there is no chart palette tier yet.
   */
  config: ChartConfig;
  /** Numeric field that sizes each leaf's rectangle. */
  dataKey: string;
  /**
   * Label field that names each leaf (drives the on-cell label, tooltip, and
   * `--color-<name>` lookup). Values should be unique and CSS-safe (they become
   * part of a custom-property name).
   */
  nameKey: string;
  /** Width-to-height ratio the tiling targets. */
  aspectRatio?: number;
  /** Render each leaf's name inside its cell (when it fits). */
  showLabels?: boolean;
  showTooltip?: boolean;
}

const Treemap = React.forwardRef<HTMLDivElement, TreemapProps>(
  (
    {
      className,
      config,
      data,
      dataKey,
      nameKey,
      aspectRatio = 4 / 3,
      showLabels = true,
      showTooltip = true,
      ...props
    },
    ref
  ) => {
    // Stamp each row with its `fill` (the shadcn data-driven pattern) so a real
    // hover resolves the cell color in the tooltip — recharts' Treemap carries no
    // per-cell color on the tooltip payload item.
    const seriesData: Record<string, string | number>[] = data.map((row) => ({
      ...row,
      fill: `var(--color-${row[nameKey]})`,
    }));

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <ChartContainer config={config} className="size-full">
          <RechartsTreemap
            data={seriesData}
            dataKey={dataKey}
            nameKey={nameKey}
            aspectRatio={aspectRatio}
            isAnimationActive={false}
            content={<TreemapCell showLabels={showLabels} />}
          >
            {showTooltip && (
              <ChartTooltip
                content={<ChartTooltipContent nameKey={nameKey} hideLabel />}
              />
            )}
          </RechartsTreemap>
        </ChartContainer>
      </div>
    );
  }
);
Treemap.displayName = 'Treemap';

export { Treemap };
