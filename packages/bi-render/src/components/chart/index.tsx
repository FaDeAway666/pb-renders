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

import type { ChartConfig } from '@/types';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

interface ChartProps {
  baseRect: { colWidth: number; rowHeight: number };
  chartConfig: ChartConfig;
  colGutter?: number;
  rowGutter?: number;
}

const Chart = (props: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    baseRect,
    chartConfig: { options, row, col, rowSpan, colSpan },
    colGutter = 20,
    rowGutter = 20,
  } = props;

  const chartStyle = useMemo(() => {
    return {
      width: `${
        colSpan
          ? baseRect.colWidth * colSpan + colGutter * (colSpan - 1)
          : baseRect.colWidth
      }px`,
      height: `${
        rowSpan
          ? baseRect.rowHeight * rowSpan + rowGutter * (rowSpan - 1)
          : baseRect.rowHeight
      }px`,
      gridRow: rowSpan ? `${row} / span ${rowSpan}` : row,
      gridCol: colSpan ? `${col} / span ${colSpan}` : col,
    };
  }, [col, row, colSpan, rowSpan, colGutter, rowGutter, baseRect]);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption(options);

    console.log('init chart');
    return () => {
      chart.dispose();
    };
  }, [rowSpan, colSpan, baseRect]);

  return <div ref={chartRef} style={{ ...chartStyle }}></div>;
};

export default Chart;
