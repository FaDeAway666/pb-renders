import { LoadingOutlined } from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';
import type { CSSProperties } from 'react';

import type { ItemConfig } from '@/types';
import './index.less';
import { Formatter } from '@/utils';

import Chart from '../chart';

interface ChartWrapperProps {
  chartConfig: ItemConfig;
  baseRect: { colWidth: number; rowHeight: number };
  colGutter?: number;
  rowGutter?: number;
  dataFetch?: () => Promise<any>;
  dataLabelMap?: { [key: string]: string };
}

const ChartWrapper = (props: ChartWrapperProps) => {
  const { chartConfig, baseRect, dataFetch, dataLabelMap } = props;
  const [wrappedConfig, setWrappedConfig] = useState(chartConfig);
  const [loading, setLoading] = useState(false);

  const {
    chartConfig: { row, col, rowSpan, colSpan },
    colGutter = 20,
    rowGutter = 20,
  } = props;

  const chartStyle = useMemo<CSSProperties>(() => {
    return {
      gridRow: rowSpan ? `${row} / span ${rowSpan}` : row,
      gridColumn: colSpan ? `${col} / span ${colSpan}` : col,
    };
  }, [col, row, colSpan, rowSpan]);

  useEffect(() => {
    if (dataFetch) {
      setLoading(true);
      dataFetch()
        .then((data) => {
          const options = Formatter[chartConfig.id as keyof typeof Formatter](
            chartConfig.chartOptions!,
            dataLabelMap || {},
            data,
          );
          setWrappedConfig({ ...wrappedConfig, chartOptions: options });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const options = wrappedConfig.chartOptions;
    setWrappedConfig({ ...chartConfig, chartOptions: options });
    console.log('config change');
  }, [rowSpan, colSpan]);

  return (
    <div className="chart-wrapper" style={chartStyle}>
      {loading && (
        <div className="loading-overlay">
          <LoadingOutlined />
        </div>
      )}
      <Chart
        baseRect={baseRect}
        chartConfig={wrappedConfig}
        colGutter={colGutter}
        rowGutter={rowGutter}
      />
    </div>
  );
};

export default ChartWrapper;
