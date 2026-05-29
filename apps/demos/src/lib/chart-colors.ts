/**
 * Chart Color Palette
 *
 * Provides a consistent color palette for charts across the application.
 * Colors are automatically assigned based on index.
 */

export const CHART_COLORS = [
  'var(--av-chart-blue)',
  'var(--av-chart-green)',
  'var(--av-chart-purple)',
  'var(--av-chart-turquoise)',
  'var(--av-chart-red)',
  'var(--av-chart-violet)',
  'var(--av-chart-yellow)',
  'var(--av-chart-brown)',
  'var(--av-chart-grey)',
] as const

export const CHART_COLORS_SEMANTIC = {
  primary: 'var(--av-chart-blue)',
  success: 'var(--av-chart-green)',
  warning: 'var(--av-chart-yellow)',
  danger: 'var(--av-chart-red)',
  info: 'var(--av-chart-info)',
  critical: 'var(--av-chart-critical)',
  neutral: 'var(--av-chart-grey)',
} as const

/**
 * Get a color from the palette by index
 * Automatically cycles through colors if index exceeds palette length
 */
export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

/**
 * Get multiple colors from the palette
 */
export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getChartColor(i))
}

/**
 * Create data with colors automatically assigned
 * Useful for pie charts and other charts that need color per data point
 */
export function addColorsToData<T extends Record<string, any>>(
  data: T[],
  colorKey: string = 'color',
  startIndex: number = 0
): T[] {
  return data.map((item, index) => ({
    ...item,
    [colorKey]: getChartColor(startIndex + index),
  }))
}
