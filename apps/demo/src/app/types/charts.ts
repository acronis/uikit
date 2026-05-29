export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

export type TimeSeriesData = TimeSeriesDataPoint[]

export interface CategoryDataPoint {
  category: string
  value: number
  fill?: string
}

export type CategoryData = CategoryDataPoint[]

export interface DistributionDataPoint {
  name: string
  value: number
  fill?: string
}

export type DistributionData = DistributionDataPoint[]
