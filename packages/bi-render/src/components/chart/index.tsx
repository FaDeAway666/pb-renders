import { BarChart, LineChart, PieChart } from 'echarts/charts';
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
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import type { ItemConfig } from '@/types';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer,
]);

export interface ChartProps {
  baseRect: { colWidth: number; rowHeight: number };
  chartConfig: ItemConfig;
  colGutter?: number;
  rowGutter?: number;
}

const Chart = (props: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    baseRect,
    chartConfig: { chartOptions, rowSpan, colSpan, height },
    colGutter = 20,
    rowGutter = 20,
  } = props;

  const chartStyle = useMemo<CSSProperties>(() => {
    const chartHeight = height ? height : baseRect.rowHeight;
    console.log(baseRect, 'chart rect');
    return {
      width: `${
        colSpan
          ? baseRect.colWidth * colSpan + colGutter * (colSpan - 1)
          : baseRect.colWidth
      }px`,
      height: `${
        rowSpan ? chartHeight * rowSpan + rowGutter * (rowSpan - 1) : chartHeight
      }px`,
    };
  }, [colSpan, rowSpan, colGutter, rowGutter, baseRect, height]);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption(chartOptions as ECBasicOption);

    console.log('init chart');
    return () => {
      chart.dispose();
    };
  }, [rowSpan, colSpan, baseRect, height, chartOptions]);

  return <div ref={chartRef} style={{ ...chartStyle }}></div>;
};

export default Chart;
