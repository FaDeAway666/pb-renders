export enum ItemType {
  CHART = 'chart',
  CUSTOM = 'custom',
  CONTAINER = 'container',
}

export interface ItemConfig {
  type: ItemType;
  id: string;
  key: string;
  height?: number;
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
  chartOptions?: Record<string, any>;
  customNode?: (...args: any[]) => JSX.Element;
  customProps?: Record<string, any>;
}

export interface RenderConfig {
  col?: number;
  row?: number;
  colGutter?: number;
  rowGutter?: number;
  background?: string;
  padding?: number | number[];
  colNum?: number;
  theme?: string;
  autofit?: boolean;
  children: Array<ItemConfig>;
}

export interface IRenderProps {
  config: RenderConfig;
  mode: 'grid' | 'free';
  data?: Record<string, () => Promise<unknown>>;
  dataLabelMap?: Record<string, string>;
}
