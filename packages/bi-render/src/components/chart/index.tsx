import { BarChart, LineChart } from 'echarts/charts';
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  // DatasetComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import {
  CanvasRenderer,
  // SVGRenderer,
} from 'echarts/renderers';
import type { ECBasicOption } from 'echarts/types/dist/shared';
import { useEffect, useMemo, useRef } from 'react';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

interface ChartProps {
  width: number;
  height: number;
  col?: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
  options: ECBasicOption;
}

const Chart = (props: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { width, height, options, col, row, colSpan, rowSpan } = props;

  const chartStyle = useMemo(() => {
    return {
      width: `${width}px`,
      height: `${height}px`,
      gridRow: rowSpan ? `${row} / span ${rowSpan}` : row,
      gridCol: colSpan ? `${col} / span ${colSpan}` : col,
    };
  }, [width, height, col, row, colSpan, rowSpan]);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption(options);
  }, []);

  return <div ref={chartRef} style={{ ...chartStyle }}></div>;
};

export default Chart;
