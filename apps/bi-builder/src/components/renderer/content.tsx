import { GridRenderer, Chart } from '@pb-renders/bi-render';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import DropBoard from '@/components/dnd/dropBoard';
import type { ChartType } from '@/constant/chart';
import { defaultChartOptions } from '@/constant/chart';
import { useRendererStore } from '@/store';

import ChartPanel from '../chart/panel';

const LayoutContent = () => {
  const config = useRendererStore((state) => state.config);
  const setCharts = useRendererStore((state) => state.setChartsConfig);
  const onDrop = (offset: { x: number; y: number }, item: any) => {
    const charts = config.children;
    console.log(offset, item);
    if (item.id) {
      charts.push({
        key: uuid().slice(0, 8),
        type: item.id as string,
        col: 2,
        row: 2,
        options: defaultChartOptions[item.id as ChartType],
      });
      setCharts(charts);
    }
    // setDragItem((item as any).key);
  };

  const dragging = (offset: { x: number; y: number }, item: any) => {
    if (item.key) {
      console.log(panelRef.current!.getBoundingClientRect());
      const rect = panelRef.current!.getBoundingClientRect();
    }
    // console.log(offset);
  };

  const [chartWidth, setChartWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const getChartWidth = () => {
    if (containerRef.current) {
      let padWidth = 0;
      const { padding, colNum = 3, colGutter = 20 } = config;
      if (typeof padding === 'number') {
        padWidth = padding * 2;
      } else if (Array.isArray(padding)) {
        padWidth = padding[0] * 2;
      }
      return (
        Math.floor((containerRef.current.clientWidth - padWidth) / colNum) - colGutter
      );
    }
    return 0;
  };

  const getChartHeight = () => {
    if (config.autofit) {
      return Math.floor(chartWidth * 0.75);
    } else return 300;
  };

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(getChartWidth());
    }
  }, []);
  return (
    <div ref={panelRef} style={{ height: '100%' }}>
      <DropBoard onDrop={onDrop} dragging={dragging}>
        <GridRenderer ref={containerRef} config={config}>
          {config.children.map(
            (chart) =>
              chartWidth !== 0 && (
                <ChartPanel
                  id={chart.key}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                  key={chart.key}
                  chartConfig={chart}
                >
                  <Chart
                    width={chartWidth}
                    height={chart.height || getChartHeight()}
                    options={chart.options}
                  />
                </ChartPanel>
              ),
          )}
        </GridRenderer>
      </DropBoard>
    </div>
  );
};

export default LayoutContent;
