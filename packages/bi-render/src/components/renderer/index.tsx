import { useCallback, useEffect, useRef, useState } from 'react';

import type { IRenderProps } from '@/types';

import Chart from '../chart';

import GridRenderer from './grid';

import './index.less';

const Renderer = (props: IRenderProps) => {
  const { config, mode = 'grid' } = props;
  const { colNum = 3, colGutter = 20, padding = 20, autofit } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseRect, setBaseRect] = useState({ rowHeight: 0, colWidth: 0 });

  const getChartWidth = useCallback(() => {
    if (containerRef.current) {
      let padWidth = 0;
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
  }, [padding, colNum, colGutter]);

  const getChartHeight = useCallback(
    (width: number) => {
      if (autofit) {
        return Math.floor(width * 0.75);
      } else return 300;
    },
    [autofit],
  );

  useEffect(() => {
    if (mode === 'grid' && containerRef.current) {
      const cw = getChartWidth();
      const rh = getChartHeight(cw);
      const rect = {
        rowHeight: rh,
        colWidth: cw,
      };
      setBaseRect(rect);
    }
  }, [colNum]);

  console.log(config, 'refresh');
  return mode === 'grid' ? (
    <GridRenderer key="grid" ref={containerRef} config={config}>
      {/* <div>{JSON.stringify(config)}</div> */}
      {config.children.map(
        (chart) =>
          baseRect.colWidth !== 0 && (
            <>
              {chart.type === 'chart' && (
                <Chart key={chart.key} chartConfig={chart} baseRect={baseRect} />
              )}
              {chart.type === 'custom' && chart.customNode && (
                <div style={{ height: chart.height }}>
                  <chart.customNode key={chart.key} {...chart.customProps} />
                </div>
              )}
            </>
          ),
      )}
    </GridRenderer>
  ) : (
    <div>free mode</div>
  );
};

export default Renderer;
