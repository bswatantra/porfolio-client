import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table'

export type SearchRecord = Record<string, unknown>

export type NavigateFn = (opts: {
  search:
    | true
    | SearchRecord
    | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord)
  replace?: boolean
}) => void

export type ColumnFilterConfig =
  | {
      columnId: string
      searchKey: string
      type?: 'string'
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }
  | {
      columnId: string
      searchKey: string
      type: 'array'
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }

export type UseTableUrlStateParams = {
  search: SearchRecord
  navigate: NavigateFn
  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    defaultPageSize?: number
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: ColumnFilterConfig[]
}

export type UseTableUrlStateReturn = {
  // Global filter
  globalFilter?: string
  onGlobalFilterChange?: OnChangeFn<string>
  // Column filters
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  // Pagination
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  // Helpers
  ensurePageInRange: (
    pageCount: number,
    opts?: { resetTo?: 'first' | 'last' }
  ) => void
}
