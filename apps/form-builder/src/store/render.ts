import type { Schema } from 'pb-form-render';
import { create } from 'zustand';

export type RenderSchema = Schema & { id: string };
interface RendererStore {
  schemas: RenderSchema[];
  activeId: string;
  detectingId: string;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  setDetectingId: (id: string) => void;
  setActiveId: (id: string) => void;
  setSchemas: (schemas: RenderSchema[]) => void;
  getSchemas: () => RenderSchema[];
  schemaIds: (string | { id: string; children: string[] })[];
  setSchemaIds: (schemaIds: (string | { id: string; children: string[] })[]) => void;
  getSchemaIds: () => (string | { id: string; children: string[] })[];
}

const useRendererStore = create<RendererStore>((set, get) => ({
  schemas: [],
  activeId: '',
  detectingId: '',
  isDragging: false,
  setIsDragging: (isDragging: boolean) => {
    set(() => ({ isDragging }));
  },
  setActiveId: (id: string) => {
    set(() => ({ activeId: id }));
  },
  setDetectingId: (id: string) => {
    set(() => ({ detectingId: id }));
  },
  getSchemas: () => {
    return get().schemas;
  },
  setSchemas: (schemas: RenderSchema[]) => {
    set(() => ({ schemas: [...schemas] }));
  },
  schemaIds: [],
  getSchemaIds: () => {
    return get().schemaIds;
  },
  setSchemaIds: (schemaIds: (string | { id: string; children: string[] })[]) => {
    set(() => ({ schemaIds: [...schemaIds] }));
  },
}));

export default useRendererStore;
