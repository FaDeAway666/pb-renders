import { barFormatter } from './chart-formatter';

export const Formatter = {
  bar(
    options: Record<string, any>,
    labelMap: Record<string, string>,
    data: Record<string, Record<string, object>>,
  ) {
    const { xLabels, series } = barFormatter(labelMap, data);
    return {
      ...options,
      xAxis: [
        {
          type: 'category',
          data: xLabels,
        },
      ],
      series,
    };
  },
};
