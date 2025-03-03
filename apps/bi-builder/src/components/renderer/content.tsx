import type { ItemConfig } from 'pb-bi-render';
import { GridRenderer, Chart, CustomEle } from 'pb-bi-render';
import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import DropBoard from '@/components/dnd/dropBoard';
import type { ChartType } from '@/constant/chart';
import { defaultChartOptions } from '@/constant/chart';
import { customOptions } from '@/constant/custom';
import { useRendererStore } from '@/store';
import {
  getGridLayout,
  initGridArray,
  rearangeGrid,
  rebuildGridArray,
} from '@/utils/grid';
import { deepClone } from '@/utils/json';

import ChartPanel from '../chart/panel';
import './content.less';
import OptionsWrapper from '../options/options';

const LayoutContent = () => {
  const config = useRendererStore((state) => state.config);
  const getConfig = useRendererStore((state) => state.getConfig);
  const getGridArray = useRendererStore((state) => state.getGridArray);
  const setGridArray = useRendererStore((state) => state.setGridArray);
  const setCharts = useRendererStore((state) => state.setChartsConfig);

  const [chartWidth, setChartWidth] = useState(0);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [, forceUpdate] = useState({});

  const previewPositionRef = useRef({
    col: 1,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    height: 300,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRect = useRef<DOMRect>();
  const baseChartRect = useRef<{
    colWidth: number;
    rowHeight: number;
  }>({
    colWidth: 0,
    rowHeight: 0,
  });
  const [baseChart, setBaseChart] = useState({ colWidth: 0, rowHeight: 0 });

  // dragging和onDrop两个函数存在闭包，因此都需要用ref保存状态
  const dragging = (offset: { x: number; y: number }, item: any) => {
    if (item.key) {
      if (!isDragging) setIsDragging(true);
      const { left, top } = panelRect.current!;
      const renderConfig = getConfig();

      const chartConf = renderConfig.children.find((c) => c.key === item.key);

      const { scrollTop, scrollLeft } = gridRef.current!;
      console.log(chartConf?.colSpan);
      const { row, col } = getGridLayout(
        { x: offset.x + scrollLeft - left, y: offset.y + scrollTop - top },
        baseChartRect.current.colWidth,
        baseChartRect.current.rowHeight,
        { colSpan: chartConf?.colSpan || 1, rowSpan: chartConf?.rowSpan || 1 },
        renderConfig.colNum,
      );
      if (
        row !== previewPositionRef.current.row ||
        col !== previewPositionRef.current.col
      ) {
        previewPositionRef.current = {
          row,
          col,
          colSpan: chartConf?.colSpan || 1,
          rowSpan: chartConf?.rowSpan || 1,
          height: (chartConf?.height || 300) * (chartConf?.rowSpan || 1),
        };
        forceUpdate({});
      }
    }
  };

  const onDrop = (offset: { x: number; y: number }, item: any) => {
    setIsDragging(false);
    const renderConfig = getConfig();
    const charts = renderConfig.children;
    console.log(offset, item);

    if (item.id) {
      const { left, top } = panelRect.current!;

      const { row, col } = getGridLayout(
        { x: offset.x - left, y: offset.y - top },
        baseChartRect.current.colWidth,
        baseChartRect.current.rowHeight,
      );
      console.log(row, col, baseChart);

      const key = item.id + '-' + uuid().slice(0, 8);
      const itemConfig: ItemConfig = {
        key,
        type: item.type,
        id: item.id,
        col,
        row,
        rowSpan: 1,
        colSpan: 1,
        height: baseChartRect.current.rowHeight,
        itemBackground: '#fff',
      };

      if (item.type === 'chart')
        itemConfig.chartOptions = defaultChartOptions[item.id as ChartType];
      else if (item.type === 'custom') {
        itemConfig.customNode = customOptions[item.id as string].node;
        itemConfig.customProps = customOptions[item.id as string].props;
        itemConfig.height = undefined;
      }
      charts.push(itemConfig);

      if (!getGridArray().length) {
        setGridArray(initGridArray(renderConfig.colNum || 3, col, row, key));
        console.log(getGridArray(), 'gridArray');
        setCharts(charts);
      } else {
        const { charts: newCharts, gridArray } = rearangeGrid(
          charts,
          getGridArray(),
          { row, col },
          key,
          renderConfig.colNum || 3,
        );
        // charts = updateItemConfig(charts, rearangedArray);
        setGridArray(gridArray);
        setCharts(newCharts);
      }
    } else {
      const chartConf = charts.find((c) => c.key === item.key);
      // if (index > -1) {
      //   charts[index].col = col;
      //   charts[index].row = row;
      //   setCharts([...charts]);
      if (chartConf) {
        const { row, col, rowSpan, colSpan } = previewPositionRef.current;
        const { charts: newCharts, gridArray } = rearangeGrid(
          charts,
          getGridArray(),
          { row, col, rowSpan, colSpan },
          item.key,
          renderConfig.colNum || 3,
          {
            row: chartConf.row!,
            col: chartConf.col!,
            rowSpan: chartConf.rowSpan!,
            colSpan: chartConf.colSpan!,
          },
        );
        // const newCharts = updateItemConfig(charts, rearangedArray);
        setCharts(newCharts);
        setGridArray(gridArray);
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

  const onChartSelect = (id: string) => {
    setSelectedId(id);
    const chartConfig = config.children.find((item) => item.key === id);
    if (chartConfig) {
      previewPositionRef.current = {
        col: chartConfig.col || 1,
        row: chartConfig.row || 1,
        colSpan: chartConfig.colSpan || 1,
        rowSpan: chartConfig.rowSpan || 1,
        height: (chartConfig.height || 300) * (chartConfig.rowSpan || 1),
      };
    }
  };

  const onChartDelete = (id: string) => {
    const charts = config.children.filter((item) => item.key !== id);
    setCharts(charts);
    const gridArray = rebuildGridArray(charts, config.colNum || 3);
    setGridArray(gridArray);
  };

  const onChartCopy = (id: string) => {
    const renderConfig = getConfig();
    const charts = renderConfig.children;
    const chartConfig = charts.find((item) => item.key === id);
    if (!chartConfig) return;
    const newKey = chartConfig.id + `-${uuid().slice(0, 8)}`;
    const newConfig = deepClone(chartConfig);
    newConfig.key = newKey;
    charts.push(newConfig);
    const { charts: newCharts, gridArray } = rearangeGrid(
      charts,
      getGridArray(),
      {
        row: newConfig.row!,
        col: newConfig.col!,
        rowSpan: newConfig.rowSpan,
        colSpan: newConfig.colSpan,
      },
      newKey,
      renderConfig.colNum || 3,
    );
    // charts = updateItemConfig(charts, rearangedArray);
    setGridArray(gridArray);
    setCharts(newCharts);
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
      setBaseChart({ rowHeight: rh, colWidth: cw });
    }
  }, [config.colNum]);

  const currentItem = useMemo(() => {
    if (selectedId === 'page')
      return {
        ...config,
        children: [],
      };
    return config.children.find((chart) => chart.key === selectedId);
  }, [selectedId, config]);

  return (
    <div className="content-container" ref={panelRef}>
      {/* <button onClick={() => setSpan(selectedId)}>set span</button>
      <button onClick={() => setSpan2(selectedId)}>set span -</button> */}
      <div className="grid-container" ref={gridRef}>
        <DropBoard
          onDrop={onDrop}
          dragging={dragging}
          onSelect={() => {
            setSelectedId('page');
          }}
        >
          <GridRenderer ref={containerRef} config={config}>
            {config.children.map(
              (chart) =>
                chartWidth !== 0 && (
                  <ChartPanel
                    id={chart.key}
                    selectedId={selectedId}
                    key={chart.key}
                    chartConfig={chart}
                    onSelect={(id) => onChartSelect(id)}
                    onDelete={(id) => onChartDelete(id)}
                    onCopy={(id) => onChartCopy(id)}
                  >
                    {chart.type === 'chart' && (
                      <Chart chartConfig={chart} baseRect={baseChart} />
                    )}
                    {chart.type === 'custom' && (
                      <CustomEle chartConfig={chart} baseRect={baseChart} />
                    )}
                  </ChartPanel>
                ),
            )}
            {isDragging && (
              <div
                className="preview-chart"
                style={{
                  gridRow: `${previewPositionRef.current.row} / span ${previewPositionRef.current.rowSpan}`,
                  gridColumn: `${previewPositionRef.current.col} / span ${previewPositionRef.current.colSpan}`,
                  height: previewPositionRef.current.height,
                }}
              ></div>
            )}
          </GridRenderer>
        </DropBoard>
      </div>
      <OptionsWrapper config={currentItem} />
    </div>
  );
};

export default LayoutContent;
