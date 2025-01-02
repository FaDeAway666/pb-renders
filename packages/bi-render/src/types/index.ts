export interface ChartConfig {
  type: string;
  key: string;
  height?: number;
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
  options: Record<string, any>;
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
  children: Array<ChartConfig>
}

export interface IRenderProps {
  config: RenderConfig;
  mode: 'grid' | 'free',
  data: Record<string, () => unknown>
}
