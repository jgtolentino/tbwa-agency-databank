import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DashboardState, GlobalFilters, DashboardLayout, ChartConfig } from '@/types'

interface DashboardStore extends DashboardState {
  setCurrentPage: (page: string) => void
  updateLayout: (page: string, layouts: DashboardLayout[]) => void
  updateCharts: (page: string, charts: ChartConfig[]) => void
  updateGlobalFilters: (filters: Partial<GlobalFilters>) => void
  resetFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialFilters: GlobalFilters = {
  dateRange: {
    start: null,
    end: null,
  },
  region: null,
  city: null,
  barangay: null,
  category: null,
  brand: null,
  sku: null,
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      currentPage: 'executive',
      layouts: {},
      charts: {},
      globalFilters: initialFilters,
      isLoading: false,
      error: null,

      setCurrentPage: (page) => set({ currentPage: page }),
      
      updateLayout: (page, layouts) => 
        set((state) => ({
          layouts: { ...state.layouts, [page]: layouts }
        })),
      
      updateCharts: (page, charts) =>
        set((state) => ({
          charts: { ...state.charts, [page]: charts }
        })),
      
      updateGlobalFilters: (filters) =>
        set((state) => ({
          globalFilters: { ...state.globalFilters, ...filters }
        })),
      
      resetFilters: () => set({ globalFilters: initialFilters }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'scout-dashboard-store',
      partialize: (state) => ({
        layouts: state.layouts,
        globalFilters: state.globalFilters,
      }),
    }
  )
)
