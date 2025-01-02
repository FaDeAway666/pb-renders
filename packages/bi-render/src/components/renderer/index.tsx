import { useCallback, useEffect, useRef, useState } from 'react';

import type { IRenderProps } from '@/types';

import Chart from '../chart';

import GridRenderer from './grid';

import './index.module.less';

const Renderer = (props: IRenderProps) => {
  const { config, mode = 'grid' } = props;
  const { colNum = 3, colGutter = 20, padding = 20, autofit } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

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

  const getChartHeight = useCallback(() => {
    if (autofit) {
      return Math.floor(chartWidth * 0.75);
    } else return 300;
  }, [autofit, chartWidth]);

  useEffect(() => {
    if (mode === 'grid' && containerRef.current) {
      setChartWidth(getChartWidth());
    }
  }, []);
  return mode === 'grid' ? (
    <GridRenderer ref={containerRef} config={config}>
      {/* <div>{JSON.stringify(config)}</div> */}
      {config.children.map(
        (chart) =>
          chartWidth !== 0 && (
            <Chart
              width={chartWidth}
              height={chart.height || getChartHeight()}
              options={chart.options}
              key={chart.key}
            />
          ),
      )}
    </GridRenderer>
  ) : (
    <div>free mode</div>
  );
};

export default Renderer;
