import * as React from 'react'
import type { DataRow } from '../types'
import { getStorage, updateDataStorage } from '../lib/storage'
import { generateSeedData } from '../lib/mock-data'
import { toast } from 'sonner'

interface UseTableDataReturn {
  data: DataRow[]
  isLoading: boolean
  addRow: (row: Omit<DataRow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DataRow>
  updateRow: (id: string, updates: Partial<Omit<DataRow, 'id' | 'createdAt'>>) => Promise<DataRow>
  deleteRow: (id: string) => Promise<void>
  deleteRows: (ids: string[]) => Promise<void>
  getRowById: (id: string) => DataRow | undefined
  refreshData: () => void
}

export function useTableData(): UseTableDataReturn {
  const [data, setData] = React.useState<DataRow[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const storage = getStorage()
    if (storage.data.rows.length === 0) {
      const seedData = generateSeedData()
      updateDataStorage({ rows: seedData, lastSync: new Date() })
      setData(seedData)
    } else {
      setData(storage.data.rows)
    }
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    if (!isLoading && data.length > 0) {
      const timeoutId = setTimeout(() => {
        updateDataStorage({ rows: data, lastSync: new Date() })
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [data, isLoading])

  const addRow = React.useCallback(
    async (row: Omit<DataRow, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataRow> => {
      try {
        const newRow: DataRow = {
          ...row,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setData((prev) => [...prev, newRow])
        toast.success('Row created successfully')
        return newRow
      } catch (error) {
        console.error('Failed to add row:', error)
        toast.error('Failed to create row')
        throw error
      }
    },
    []
  )

  const updateRow = React.useCallback(
    async (id: string, updates: Partial<Omit<DataRow, 'id' | 'createdAt'>>): Promise<DataRow> => {
      try {
        const rowIndex = data.findIndex((r) => r.id === id)
        if (rowIndex === -1) {
          throw new Error('Row not found')
        }

        const updatedRow: DataRow = {
          ...data[rowIndex],
          ...updates,
          updatedAt: new Date(),
        }

        setData((prev) => {
          const newData = [...prev]
          newData[rowIndex] = updatedRow
          return newData
        })

        toast.success('Row updated successfully')
        return updatedRow
      } catch (error) {
        console.error('Failed to update row:', error)
        toast.error('Failed to update row')
        throw error
      }
    },
    [data]
  )

  const deleteRow = React.useCallback(
    async (id: string): Promise<void> => {
      try {
        const exists = data.some((r) => r.id === id)
        if (!exists) {
          throw new Error('Row not found')
        }

        setData((prev) => prev.filter((r) => r.id !== id))
        toast.success('Row deleted successfully')
      } catch (error) {
        console.error('Failed to delete row:', error)
        toast.error('Failed to delete row')
        throw error
      }
    },
    [data]
  )

  const deleteRows = React.useCallback(async (ids: string[]): Promise<void> => {
    try {
      setData((prev) => prev.filter((r) => !ids.includes(r.id)))
      toast.success(`${ids.length} row(s) deleted successfully`)
    } catch (error) {
      console.error('Failed to delete rows:', error)
      toast.error('Failed to delete rows')
      throw error
    }
  }, [])

  const getRowById = React.useCallback(
    (id: string): DataRow | undefined => {
      return data.find((r) => r.id === id)
    },
    [data]
  )

  const refreshData = React.useCallback(() => {
    const storage = getStorage()
    setData(storage.data.rows)
  }, [])

  return {
    data,
    isLoading,
    addRow,
    updateRow,
    deleteRow,
    deleteRows,
    getRowById,
    refreshData,
  }
}
