// Documentation-only types for AutoTypeTable (apps/docs). The real
// BarChartProps is a discriminated union (BarChartVerticalProps |
// BarChartHorizontalProps), which AutoTypeTable can't resolve — it only
// shows properties common to every union member. These flatten the two
// variants into standalone interfaces. Keep in sync with bar-chart.tsx.
import type * as React from 'react';

// ---------------------------------------------------------------------------
// Shared helper types (inlined so AutoTypeTable can resolve them)
// ---------------------------------------------------------------------------

type BarChartBarShape = 'rounded' | 'pill' | 'gradient' | 'pattern';

type CartesianLabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'insideTop'
  | 'insideBottom'
  | 'insideLeft'
  | 'insideRight'
  | 'insideStart'
  | 'insideEnd';

// ---------------------------------------------------------------------------
// BarChartItem — one row of the horizontal bar list
// ---------------------------------------------------------------------------

export interface BarChartItem {
  /** Row label, shown at the start of the row. */
  label: string;
  /** The value this row represents. */
  value: number;
  /** Fill color — any CSS color; prefer an existing `--ui-*` token. Required when no `palette` is passed to the chart. */
  color?: string;
  /** Palette tone for this row. Resolved against the `palette` prop on the enclosing `BarChart`. */
  tone?: { status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' };
  /** Projected/forecast total. When greater than `value`, renders a translucent bar (30% opacity) extending from `value` to `forecast`. */
  forecast?: number;
}

// ---------------------------------------------------------------------------
// BarChartVerticalProps — the recharts bar chart (orientation="vertical")
// ---------------------------------------------------------------------------

export interface BarChartVerticalProps {
  /** Selects the recharts bar chart. Omit it — this is the default. */
  orientation?: 'vertical';
  /** Row-per-category data. Each object holds the category key + one numeric field per series. */
  data: ReadonlyArray<Record<string, string | number>>;
  /** Per-series map of `label` / `icon` / `tone`. */
  config: Record<string, { label: string; icon?: React.ComponentType; color?: string; tone?: string }>;
  /** Series to plot — one `<Bar>` per key. Each must exist in `config` and in every data row. */
  dataKeys: string[];
  /** Category axis key (the shared dimension across rows, e.g. `"month"`). */
  xKey: string;
  /** Dataviz palette for series colors. Series that state no `color` of their own take a stop from it. */
  palette?: string;
  /** `"grouped"` (side-by-side, default) or `"stacked"` (summed into one column). */
  layout?: 'grouped' | 'stacked';
  /** One or more dashed reference/average lines on the value (Y) axis. */
  referenceLine?: object | object[];
  /** One or more shaded bands behind a range of categories. */
  referenceArea?: object | object[];
  /** Per-series style override for a range of categories, keyed by `dataKeys` entry. */
  barSettings?: Record<string, object>;
  /** Corner radius applied to the growing end of each bar. */
  barRadius?: number;
  /** How every bar is painted. Per-range overrides come from `barSettings`. */
  barShape?: BarChartBarShape;
  /** Fixed bar thickness, in px. */
  barSize?: number;
  /** Upper bound on the computed bar thickness, in px. */
  maxBarSize?: number;
  /** Gap between bars of the same category, in px or a percentage string. */
  barGap?: number | string;
  /** Gap between category groups, in px or a percentage string. */
  barCategoryGap?: number | string;
  /** Minimum rendered length for a bar, in px, so a tiny value stays visible. */
  minPointSize?: number;
  /** Draw a full-height track behind every bar. */
  showBackground?: boolean;
  /** Fill for the track background. Defaults to the secondary surface. */
  backgroundFill?: string;
  /** Highlight the hovered bar. */
  showActiveBar?: boolean;
  /** Painting of the hovered bar. */
  activeBar?: { fill?: string; opacity?: number };
  /** Show the legend. */
  showLegend?: boolean;
  /** Position of the value labels when `showLabels` is on. */
  labelPosition?: CartesianLabelPosition;
  // --- CartesianChartProps ---
  /** Render the CartesianGrid. Defaults to `true`. */
  showGrid?: boolean;
  /** Render the hover tooltip. Defaults to `true`. */
  showTooltip?: boolean;
  /** Replace the default tooltip content. */
  tooltipContent?: React.ReactNode;
  /** Title rendered beneath the X axis. */
  xAxisLabel?: string;
  /** Title rendered beside the Y axis (rotated). */
  yAxisLabel?: string;
  /** Unit suffix appended to the Y axis's tick values. */
  yUnit?: string;
  /** Show the X axis. Defaults to `true`. */
  showXAxis?: boolean;
  /** Show the Y axis. Defaults to `true`. */
  showYAxis?: boolean;
  /** Format each X-axis tick value. */
  xTickFormatter?: (value: string | number, index: number) => string;
  /** Format each Y-axis tick value. */
  yTickFormatter?: (value: string | number, index: number) => string;
  /** Rotate the X-axis tick labels by this many degrees. */
  xAxisAngle?: number;
  /** X-axis tick density. */
  xAxisInterval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | 'equidistantPreserveStart';
  /** Desired number of ticks on the value axis. */
  yAxisTickCount?: number;
  /** Value-axis domain preset. */
  yAxisDomain?: 'auto' | 'dataMin-dataMax' | 'zero';
  /** Draw grid lines dashed instead of solid. Defaults to `true`. */
  gridDashed?: boolean;
  /** Show horizontal grid lines. */
  gridHorizontal?: boolean;
  /** Show vertical grid lines. */
  gridVertical?: boolean;
  // --- ChartAnimationProps ---
  /** Enable entrance animation. Defaults to `false`. */
  animate?: boolean;
  /** Animation duration in ms. */
  animationDuration?: number;
  /** Delay before the animation starts, in ms. */
  animationBegin?: number;
  /** Easing curve. */
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  // --- ChartBrushProps ---
  /** Render a range brush beneath the chart. */
  showBrush?: boolean;
  /** Height of the brush strip in px. Defaults to 28. */
  brushHeight?: number;
  /** Accessible name for the brush's range handles. */
  brushAriaLabel?: string;
  // --- ChartDataLabelProps ---
  /** Render a value label on each data point. Defaults to `false`. */
  showLabels?: boolean;
  /** Format each label value. */
  labelFormatter?: (value: string | number, index: number) => string;
  /** Additional CSS class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// BarChartHorizontalProps — the labelled proportional bar list
// ---------------------------------------------------------------------------

export interface BarChartHorizontalProps {
  /** Selects the labelled bar list. */
  orientation: 'horizontal';
  /** Rows to render — one labelled bar per item. */
  items: BarChartItem[];
  /** Upper bound the values are shares of. Defaults to the sum of every item's value. */
  max?: number;
  /** Format the numeric value in the label. Defaults to `toLocaleString()`. */
  valueFormatter?: (value: number) => string;
  /** Show the hover tooltip per row. On by default. */
  showTooltip?: boolean;
  /** Tooltip content shared by every row (replaces the default). */
  tooltip?: React.ReactNode;
  /** Dataviz palette to resolve each item's color from. Items should carry a `tone` when a palette is set. */
  palette?: string;
  /** Additional CSS class names. */
  className?: string;
}
