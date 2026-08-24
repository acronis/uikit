'use client';

import * as React from 'react';
import { Treemap as RechartsTreemap } from 'recharts';
import type { LegendPayload } from 'recharts/types/component/DefaultLegendContent';

import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  resolveAnimation,
  CHART_LABEL_FONT_SIZE,
  type ChartConfig,
  type ChartPalette,
  type ChartAnimationProps,
  type TickFormatter,
} from '../chart';

// A typed recharts composition over the shared `Chart` primitives. A treemap is
// the odd one out: a single `Treemap` element with no axes/grid, themed through a
// custom `content` cell renderer (recharts' default paints every cell the same
// fill and has no token hooks) — and that renderer, not a `LabelList`, owns the
// on-cell labels, so the fit/clamp logic lives here. Like Scatter/Composed/
// RadialBar there's no CVA variant — a treemap's knobs are geometry
// (`aspectRatio`) and the data, not a visual "mode". v1 is a flat treemap (a list
// of leaves).

/**
 * Where a cell's label block sits inside its rectangle. Named logically, not
 * physically: the corner variants anchor to the tile's *start* edge, so they
 * mirror under `dir="rtl"`. `bottom-start` is the design's placement; `center`
 * is what the chart drew before the block had a second line.
 */
export type TreemapLabelAlign = 'bottom-start' | 'top-start' | 'center';

// Cell shape: each tile is inset by the gap on every side, so neighbouring tiles
// are separated by the surface showing through rather than by a stroke, and the
// corners are rounded.
const CELL_GAP = 2;
const CELL_RADIUS = 6;

// Label geometry, in px. The block's own layout is CSS (see the renderer); these
// are the heights the tile has to clear for a label to fit *without being
// clipped* — one line, or two.
//
// Line boxes, not font sizes: Tailwind's `--text-xs--line-height` is 4/3, so the
// `text-xs` title renders a 16px line box, and the second line inherits that same
// ratio (an arbitrary `text-[11px]` sets font-size only) for ~14.7px. Measuring by
// font size instead would let a tile pass the threshold and still have the block's
// `overflow-hidden` eat the top of the first line.
const CELL_PADDING = 12;
const LINE_HEIGHT_RATIO = 4 / 3;
const SECONDARY_FONT_SIZE = 11;
const TITLE_LINE_HEIGHT = Math.ceil(CHART_LABEL_FONT_SIZE * LINE_HEIGHT_RATIO);
const SECONDARY_LINE_HEIGHT = Math.ceil(
  SECONDARY_FONT_SIZE * LINE_HEIGHT_RATIO
);

// The smallest tile that gets a label at all, and the height a second line
// additionally needs. Below the first threshold a cell stays blank rather than
// showing a stub — the label would be wider than the tile it names.
const MIN_LABEL_WIDTH = 64;
const MIN_LABEL_HEIGHT = CELL_PADDING * 2 + TITLE_LINE_HEIGHT;
const MIN_TWO_LINE_HEIGHT = MIN_LABEL_HEIGHT + SECONDARY_LINE_HEIGHT;

/**
 * Compose a cell's second line out of the caller's `secondaryKeys`. Empty and
 * missing fields are skipped rather than printed as a gap, so one row without
 * the field doesn't leave a dangling separator.
 */
export function treemapSecondaryLabel(options: {
  row: Record<string, string | number>;
  keys: readonly string[];
  separator: string;
  formatter?: TickFormatter;
}): string | undefined {
  const { row, keys, separator, formatter } = options;
  const parts = keys.flatMap((key, index) => {
    const value = row[key];
    if (value == null || value === '') return [];
    // Emptiness is re-checked *after* formatting, not just on the raw value: a
    // formatter that blanks a field it doesn't want to show (a zero, a sentinel)
    // would otherwise contribute an empty part and put back the dangling
    // separator this function exists to avoid.
    const part = formatter ? formatter(value, index) : String(value);
    return part === '' ? [] : [part];
  });
  return parts.length ? parts.join(separator) : undefined;
}

interface TreemapCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // recharts injects the node's resolved `name` (from nameKey) + value, plus
  // every other field on the row — which is how the two stamped labels arrive.
  name?: string;
  /** The leaf's display name — its `config` label, stamped onto the row by `Treemap`. */
  primaryLabel?: string;
  /** The label's precomputed second line, stamped onto each row by `Treemap`. */
  secondaryLabel?: string;
  showLabels?: boolean;
  labelAlign?: TreemapLabelAlign;
}

// How the label block sits in its tile. `text-start`/`text-center` and the
// block-axis `justify-*` are what make the corner-anchored variants mirror under
// `dir="rtl"` — the same logical utilities every other component uses, which is
// why the label is HTML in a `foreignObject` rather than SVG `<text>`:
// `x`/`text-anchor` are physical, so a mirrored label would need the direction
// read in JS and applied by hand.
//
// Every variant leaves the cross axis on the default `items-stretch`, including
// `center`. Centering the line is `text-center`'s job, not `items-center`'s:
// `items-center` would size each line to its own text instead of to the tile, and
// a `truncate` line only ellipsizes when it is the *tile* that constrains it — a
// shrink-to-fit line is never narrower than its text, so it would silently
// overflow and be hard-clipped on both edges instead.
const LABEL_ALIGN_CLASS: Record<TreemapLabelAlign, string> = {
  'bottom-start': 'justify-end text-start',
  'top-start': 'justify-start text-start',
  center: 'justify-center text-center',
};

// Cell renderer: fill each rounded rect from its `--color-<name>` var, inset it so
// the surface shows through between tiles, and lay the label block over it — the
// leaf's name, plus the stamped second line when the tile is tall enough. Passed to
// `Treemap.content`; recharts clones it with each node's geometry + row fields.
export function TreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  primaryLabel,
  secondaryLabel,
  showLabels = true,
  labelAlign = 'bottom-start',
}: TreemapCellProps) {
  // recharts invokes `content` for the synthetic root node too (full chart
  // dimensions, empty name). Skip any name-less node — otherwise its rect has no
  // `--color-<name>` fill and paints the SVG-default black behind everything
  // (invisible when leaves cover it, a black box on empty data).
  if (!name) return <g />;
  // The tile, not the node: the label sits inside the inset rect, so the gutter
  // never eats into its padding.
  const tileX = x + CELL_GAP;
  const tileY = y + CELL_GAP;
  const tileWidth = Math.max(0, width - CELL_GAP * 2);
  const tileHeight = Math.max(0, height - CELL_GAP * 2);

  // `>=` on the heights: they are exact fits (padding + line boxes), so a tile
  // that measures one of them exactly has room for that label. The width is a
  // judgement call about how narrow a label is still worth reading, not a fit, so
  // it stays a strict `>`.
  const canLabel =
    showLabels && tileWidth > MIN_LABEL_WIDTH && tileHeight >= MIN_LABEL_HEIGHT;
  const secondary =
    canLabel && secondaryLabel && tileHeight >= MIN_TWO_LINE_HEIGHT
      ? secondaryLabel
      : undefined;

  return (
    <g>
      <rect
        x={tileX}
        y={tileY}
        width={tileWidth}
        height={tileHeight}
        rx={CELL_RADIUS}
        style={{ fill: `var(--color-${name})` }}
      />
      {canLabel && (
        // Decorative: the hover that opens the tooltip belongs to the tile, so the
        // label must not swallow it.
        <foreignObject
          x={tileX}
          y={tileY}
          width={tileWidth}
          height={tileHeight}
          className="pointer-events-none"
        >
          <div
            className={cn(
              // Each line truncates with a real ellipsis — CSS measures the text,
              // so nothing has to estimate how much of it fits.
              'flex size-full flex-col overflow-hidden p-3',
              // The design system's "text on a strong colored surface" token
              // (constant white in both themes) — reads over the saturated series
              // colors without hardcoding a color. The weight, not a second color,
              // carries the hierarchy over the second line: the on-strong
              // *secondary* text token resolves to a dark grey in dark mode, which
              // a cell's fill stays saturated behind.
              'text-[var(--ui-text-on-status-strong-neutral)]',
              LABEL_ALIGN_CLASS[labelAlign]
            )}
          >
            <span className="truncate text-xs font-semibold">
              {primaryLabel ?? name}
            </span>
            {secondary && (
              <span className="truncate text-[11px]">{secondary}</span>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export interface TreemapProps
  extends Omit<React.ComponentProps<'div'>, 'children'>, ChartAnimationProps {
  /**
   * The dataviz palette this chart's series are painted from. Series that
   * state no `color` of their own take a stop of it. See `ChartPalette`.
   */
  palette?: ChartPalette;
  /**
   * Row-per-leaf data. Each object holds the leaf's `nameKey` label + its
   * `dataKey` numeric size.
   *
   * `fill`, `primaryLabel` and `secondaryLabel` are reserved: the chart stamps
   * them onto a copy of each row to carry the cell color and the two label lines
   * through to the renderer (recharts hands the whole row to `content`, so
   * anything the cell needs has to be on it). A row of your own carrying one of
   * those names may end up driving what the tile paints.
   */
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
   * Label field that names each leaf (drives the on-cell label, legend, tooltip,
   * and `--color-<name>` lookup). Values should be unique and CSS-safe (they
   * become part of a custom-property name).
   */
  nameKey: string;
  /** Width-to-height ratio the tiling targets. */
  aspectRatio?: number;
  /** Render each leaf's label inside its cell (when it fits). */
  showLabels?: boolean;
  /**
   * Where a cell's label sits. Defaults to `bottom-start` — the design's
   * placement, which keeps the label anchored to a tile corner as the tiling
   * reflows. `top-start` anchors it to the opposite corner; `center` centers the
   * block in the tile. The corner variants are named for the tile's *start* edge
   * because they mirror under `dir="rtl"`.
   */
  labelAlign?: TreemapLabelAlign;
  /**
   * Fields whose values make up a second label line under the leaf's name — e.g.
   * `[dataKey]` for the size, or `['size', 'count']` for a value and a count. The
   * line is dropped on cells too short to hold it.
   */
  secondaryKeys?: readonly string[];
  /**
   * Format each secondary value. Receives the field's index in `secondaryKeys`
   * as its second argument, so one formatter can cover fields of different kinds.
   */
  secondaryFormatter?: TickFormatter;
  /** Separator drawn between multiple secondary values. */
  secondarySeparator?: string;
  showTooltip?: boolean;
  /**
   * Render the legend — one entry per leaf. Off by default: a treemap labels its
   * cells, so the legend is for the case where the tiles are too small to.
   */
  showLegend?: boolean;
  /** Which edge the legend sits on. */
  legendPos?: 'top' | 'bottom';
  /**
   * Replace the default tooltip. Pass a configured `ChartTooltipContent`
   * (imported from this library) — e.g. with a `formatter` / `labelFormatter` —
   * to customize formatting, per-cell rows, or extra fields without composing
   * recharts yourself. Ignored when `showTooltip` is false.
   */
  tooltipContent?: React.ComponentProps<typeof ChartTooltip>['content'];
}

const Treemap = React.forwardRef<HTMLDivElement, TreemapProps>(
  (
    {
      className,
      config,
      palette,
      data,
      dataKey,
      nameKey,
      aspectRatio = 4 / 3,
      showLabels = true,
      labelAlign = 'bottom-start',
      secondaryKeys,
      secondaryFormatter,
      secondarySeparator = ' · ',
      showTooltip = true,
      showLegend = false,
      legendPos = 'bottom',
      tooltipContent,
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
      ...props
    },
    ref
  ) => {
    const animation = resolveAnimation({
      animate,
      animationDuration,
      animationBegin,
      animationEasing,
    });
    // Stamp each row with its `fill` (the shadcn data-driven pattern) so a real
    // hover resolves the cell color in the tooltip — recharts' Treemap carries no
    // per-cell color on the tooltip payload item — and with its `secondaryLabel`,
    // which reaches the cell renderer the same way: recharts hands the whole row
    // to `content`, so a composed label has to be on the row before it gets there.
    const seriesData: Record<string, string | number>[] = React.useMemo(
      () =>
        data.map((row) => {
          const name = String(row[nameKey]);
          const secondaryLabel = secondaryKeys?.length
            ? treemapSecondaryLabel({
                row,
                keys: secondaryKeys,
                separator: secondarySeparator,
                formatter: secondaryFormatter,
              })
            : undefined;
          // The on-cell name is the leaf's `config` label, so a cell reads like its
          // legend entry and tooltip row do. It matters more here than elsewhere:
          // the raw `nameKey` value has to be CSS-safe (it becomes part of
          // `--color-<name>`), so a leaf whose display name has a space in it is
          // keyed by a slug — and the slug is not what belongs on the tile. Only a
          // string label can go in SVG text; a `ReactNode` one falls back to the key.
          const label = config[name]?.label;
          return {
            ...row,
            fill: `var(--color-${name})`,
            ...(typeof label === 'string' ? { primaryLabel: label } : {}),
            ...(secondaryLabel ? { secondaryLabel } : {}),
          };
        }),
      [
        config,
        data,
        nameKey,
        secondaryFormatter,
        secondaryKeys,
        secondarySeparator,
      ]
    );

    // recharts 3 builds the legend payload from the graphical item, and `Treemap`
    // — unlike Bar/Line/Area/Pie/Radar/RadialBar/Scatter — never registers one,
    // so a `<Legend>` inside a `Treemap` renders empty. The payload is synthesized
    // from the leaves instead and handed to the shared `ChartLegendContent`, which
    // keeps the treemap on the same legend markers, labels and `config` lookup as
    // every other chart. `payload` carries the row so each entry resolves its own
    // `config` entry via `nameKey`.
    //
    // One entry per *distinct* leaf name: same-named leaves deliberately share a
    // `--color-<name>`/`config` entry, so a second entry would repeat the first
    // verbatim — and `ChartLegendContent` keys its entries on `value`, so it would
    // also be a duplicate React key.
    const legendPayload = React.useMemo<LegendPayload[]>(() => {
      const seen = new Set<string>();
      return seriesData.flatMap((row) => {
        const value = String(row[nameKey]);
        if (seen.has(value)) return [];
        seen.add(value);
        return [
          {
            value,
            dataKey: nameKey,
            type: 'rect' as const,
            color: String(row.fill),
            payload: row,
          },
        ];
      });
    }, [nameKey, seriesData]);

    // Every other chart type lets recharts shrink the plot area by the legend's
    // measured size, but recharts' `Treemap` tiles the *full* chart surface and
    // ignores the legend entirely — a `<Legend>` inside one paints over the tiles.
    // So the legend is not a `<Legend>` at all: the shared `ChartLegendContent` is
    // rendered straight into a row of its own beside the plot, on the same markers,
    // labels and `config` lookup as every other chart's legend, and normal flow
    // gives it the height it needs (one row, or several once it wraps) and takes
    // that height off the tiled surface.
    //
    // Rendering it here rather than inside the plot is also what keeps the tiling
    // correct: recharts' `Treemap` reads its container **once** (it opts out of the
    // responsive path, because its own stroke-width rounding makes that loop), and a
    // `<Legend>` can only render after the chart has a size — so the box it read
    // would always be the one from before its own legend existed, a legend-row too
    // tall, and the bottom row of tiles would be laid out under the clip. The row is
    // its final height on the first render instead, so that one read is the right one.
    //
    // The row sits outside `ChartContainer`, so it takes `config` as a prop (the
    // container's context doesn't reach it) and re-emits the `--color-<name>`
    // properties its swatches resolve against under its own `data-chart` id.
    const legendChartId = `chart-${React.useId().replace(/:/g, '')}`;
    const legendRow = showLegend ? (
      <div data-chart={legendChartId} className="text-xs">
        <ChartStyle id={legendChartId} config={config} />
        <ChartLegendContent
          config={config}
          payload={legendPayload}
          verticalAlign={legendPos}
          nameKey={nameKey}
        />
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(showLegend && 'flex flex-col', className)}
        {...props}
      >
        {legendPos === 'top' && legendRow}
        <ChartContainer
          config={config}
          palette={palette}
          // `size-full` fills the caller's box; with a legend row beside it the
          // height comes from the flex line instead, so the tiles give up exactly
          // the room the legend takes.
          className={showLegend ? 'min-h-0 w-full flex-1' : 'size-full'}
        >
          <RechartsTreemap
            data={seriesData}
            dataKey={dataKey}
            nameKey={nameKey}
            aspectRatio={aspectRatio}
            {...animation}
            content={
              <TreemapCell showLabels={showLabels} labelAlign={labelAlign} />
            }
          >
            {showTooltip && (
              <ChartTooltip
                content={
                  tooltipContent ?? (
                    <ChartTooltipContent nameKey={nameKey} hideLabel />
                  )
                }
              />
            )}
          </RechartsTreemap>
        </ChartContainer>
        {legendPos === 'bottom' && legendRow}
      </div>
    );
  }
);
Treemap.displayName = 'Treemap';

export { Treemap };
