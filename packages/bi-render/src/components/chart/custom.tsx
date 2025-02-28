import type { CSSProperties } from 'react';
import { useMemo, useRef } from 'react';

import type { ChartProps } from '.';

const CustomEle = (props: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    baseRect,
    chartConfig: { customNode, customProps, row, col, rowSpan, colSpan, height },
    colGutter = 20,
    rowGutter = 20,
  } = props;

  const chartStyle = useMemo<CSSProperties>(() => {
    console.log(baseRect, 'chart rect');
    return {
      height: height ? height : 'auto',
      gridRow: rowSpan ? `${row} / span ${rowSpan}` : row,
      gridColumn: colSpan ? `${col} / span ${colSpan}` : col,
    };
  }, [col, row, colSpan, rowSpan, colGutter, rowGutter, baseRect, height]);

  return (
    <div ref={chartRef} style={{ ...chartStyle }}>
      {customNode && customNode(customProps)}
    </div>
  );
};

export default CustomEle;
