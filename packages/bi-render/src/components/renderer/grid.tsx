import { forwardRef, useCallback } from 'react';

import type { IRenderProps } from '@/types';

import './index.less';

export interface IGridRendererProps extends Omit<IRenderProps, 'mode' | 'data'> {
  children: React.ReactNode;
}

const GridRenderer = forwardRef<HTMLDivElement, IGridRendererProps>(
  (props: IGridRendererProps, ref) => {
    const { config, children } = props;
    const {
      colNum = 3,
      colGutter = 20,
      rowGutter = 20,
      padding = 20,
      background,
    } = config;

    const getPaddingStyle = useCallback(() => {
      if (typeof padding === 'number') {
        return `${padding}px`;
      } else if (Array.isArray(padding)) {
        return `${padding.join('px ')}`;
      }
      return padding;
    }, [padding]);
    // const containerRef = useRef<HTMLDivElement>(null);
    // const [chartWidth, setChartWidth] = useState(0);

    // useEffect(() => {
    //   if (containerRef.current) {
    //     setChartWidth(Math.floor(containerRef.current.clientWidth / colNum) - colGutter);
    //   }
    // }, []);
    return (
      <div
        ref={ref}
        className={`chart-render-container display-grid column-${colNum}`}
        style={{
          gap: `${colGutter}px ${rowGutter}px`,
          padding: getPaddingStyle(),
          background,
        }}
      >
        {children}
        {/* <div>{JSON.stringify(config)}</div> */}
        {/* {config.children.map(
        (chart) =>
          chartWidth && (
            <Chart
              width={chartWidth}
              height={chart.height || 300}
              options={chart.options}
              key={chart.key}
            />
          ),
      )} */}
      </div>
    );
  },
);
GridRenderer.displayName = 'GridRenderer';

export default GridRenderer;
