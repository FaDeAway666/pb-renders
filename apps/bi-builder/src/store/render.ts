import type { ItemConfig, RenderConfig } from '@pb-renders/bi-render';
import { create } from 'zustand';

interface RendererStore {
  config: RenderConfig;
  gridArray: (string | null)[][];
  rowHeightArray: number[];
  setRowHeightArray: (rowHeightArray: number[]) => void;
  getRowHeightArray: () => number[];
  setGridArray: (gridArray: (string | null)[][]) => void;
  getGridArray: () => (string | null)[][];
  getConfig: () => RenderConfig;
  setPanelConfig: (config: Omit<RenderConfig, 'children'>) => void;
  setChartsConfig: (charts: ItemConfig[]) => void;
}

const useRendererStore = create<RendererStore>((set, get) => ({
  config: {
    colNum: 3,
    padding: 20,
    colGutter: 24,
    rowGutter: 24,
    background: '#fcfcfc',
    children: [],
  },
  getConfig: () => {
    return get().config;
  },
  rowHeightArray: [],
  getRowHeightArray: () => {
    return get().rowHeightArray;
  },
  setRowHeightArray: (rowHeightArray: number[]) =>
    set(() => ({ rowHeightArray: [...rowHeightArray] })),
  gridArray: [],
  setGridArray: (gridArray: (string | null)[][]) =>
    set(() => {
      console.log(gridArray, 'set gridarray');
      return { gridArray: [...gridArray] };
    }),
  getGridArray: () => {
    return get().gridArray;
  },
  setPanelConfig: (config) =>
    set((state) => ({ config: { ...config, children: state.config.children } })),
  setChartsConfig: (charts: ItemConfig[]) =>
    set((state) => ({ config: { ...state.config, children: charts } })),
}));

export default useRendererStore;
