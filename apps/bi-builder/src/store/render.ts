import type { ChartConfig, RenderConfig } from "@pb-renders/bi-render"
import { create } from 'zustand'

interface RendererStore {
  config: RenderConfig,
  setPanelConfig: (config: Omit<RenderConfig, 'children'>) => void,
  setChartsConfig: (charts: ChartConfig[]) => void,
}

const useRendererStore = create<RendererStore>((set) => ({
  config: {
    col: 3,
    padding: 20,
    colGutter: 24,
    rowGutter: 24,
    children: []
  },
  setPanelConfig: (config) => set((state) => ({ config: { ...config, children: state.config.children } })),
  setChartsConfig: (charts: ChartConfig[]) => set((state) => ({ config: { ...state.config, children: charts } }))
}))

export default useRendererStore
