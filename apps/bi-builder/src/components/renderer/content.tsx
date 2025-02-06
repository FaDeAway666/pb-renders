import { GridRenderer, Chart } from '@pb-renders/bi-render';
import { throttle } from '@pb-renders/utils';
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import DropBoard from '@/components/dnd/dropBoard';
import type { ChartType } from '@/constant/chart';
import { defaultChartOptions } from '@/constant/chart';
import { useRendererStore } from '@/store';
import {
  getGridLayout,
  initGridArray,
  rearangeGrid,
  updateChartConfig,
} from '@/utils/grid';

import ChartPanel from '../chart/panel';
import './content.less';

const LayoutContent = () => {
  const config = useRendererStore((state) => state.config);
  const getGridArray = useRendererStore((state) => state.getGridArray);
  const setGridArray = useRendererStore((state) => state.setGridArray);
  const setCharts = useRendererStore((state) => state.setChartsConfig);

  const [chartWidth, setChartWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [, forceUpdate] = useState({});

  const previewPositionRef = useRef({ col: 1, row: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelRect = useRef<DOMRect>();
  const baseChartRect = useRef<{
    colWidth: number;
    rowHeight: number;
  }>({
    colWidth: 0,
    rowHeight: 0,
  });

  const dragging = (offset: { x: number; y: number }, item: any) => {
    if (item.key) {
      if (!isDragging) setIsDragging(true);
      const { left, top } = panelRect.current!;

      const { row, col } = getGridLayout(
        { x: offset.x - left, y: offset.y - top },
        baseChartRect.current.colWidth,
        baseChartRect.current.rowHeight,
      );
      console.log(row, col);
      if (
        row !== previewPositionRef.current.row ||
        col !== previewPositionRef.current.col
      ) {
        previewPositionRef.current = { row, col };
        forceUpdate({});
      }
    }
  };

  const onDrop = (offset: { x: number; y: number }, item: any) => {
    setIsDragging(false);
    const charts = config.children;
    console.log(offset, item);

    if (item.id) {
      const { left, top } = panelRect.current!;

      const { row, col } = getGridLayout(
        { x: offset.x - left, y: offset.y - top },
        baseChartRect.current.colWidth,
        baseChartRect.current.rowHeight,
      );

      const key = uuid().slice(0, 8);
      charts.push({
        key,
        type: item.id as string,
        col,
        row,
        options: defaultChartOptions[item.id as ChartType],
      });
      setCharts(charts);

      if (!getGridArray().length) {
        setGridArray(initGridArray(config.colNum || 3, col, row, key));
        console.log(getGridArray(), 'gridArray');
      } else {
        const rearangedArray = rearangeGrid(getGridArray(), { row, col }, key);
        const newCharts = updateChartConfig(charts, rearangedArray);
        setCharts(newCharts);
        setGridArray(rearangedArray);
      }
    } else {
      const chartConf = charts.find((c) => c.key === item.key);
      // if (index > -1) {
      //   charts[index].col = col;
      //   charts[index].row = row;
      //   setCharts([...charts]);
      if (chartConf) {
        const { row, col } = previewPositionRef.current;
        const rearangedArray = rearangeGrid(getGridArray(), { row, col }, item.key, {
          row: chartConf.row!,
          col: chartConf.col!,
        });
        const newCharts = updateChartConfig(charts, rearangedArray);
        setCharts(newCharts);
        setGridArray(rearangedArray);
      }
      // }
    }

    // setDragItem((item as any).key);
  };

  const getChartWidth = () => {
    let padWidth = 0;
    const { padding, colNum = 3, colGutter = 20 } = config;
    if (typeof padding === 'number') {
      padWidth = padding * 2;
    } else if (Array.isArray(padding)) {
      padWidth = padding[0] * 2;
    }
    return Math.floor(
      (containerRef.current!.clientWidth - padWidth - (colNum - 1) * colGutter) /
        colNum,
    );
  };

  const getChartHeight = (cWidth: number) => {
    if (config.autofit) {
      return Math.floor(cWidth * 0.75);
    } else return 300;
  };

  useEffect(() => {
    if (panelRef.current && containerRef.current) {
      panelRect.current = panelRef.current.getBoundingClientRect();
      const cw = getChartWidth();
      setChartWidth(cw);
      const rh = getChartHeight(cw);
      baseChartRect.current = {
        rowHeight: rh,
        colWidth: cw,
      };
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
                  key={chart.key}
                  chartConfig={chart}
                  onSelect={(id) => setSelectedId(id)}
                >
                  <Chart chartConfig={chart} baseRect={baseChartRect.current} />
                </ChartPanel>
              ),
          )}
          {isDragging && (
            <div
              className="preview-chart"
              style={{
                gridRow: previewPositionRef.current.row,
                gridColumn: previewPositionRef.current.col,
              }}
            ></div>
          )}
        </GridRenderer>
      </DropBoard>
    </div>
  );
};

export default LayoutContent;
