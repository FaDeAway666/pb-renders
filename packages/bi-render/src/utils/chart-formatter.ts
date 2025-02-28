/**
 * @labelMap {clothes: 衣服， tshirt：短袖}
 * @data {sales: {clothes: 10, tshirt: 20}}
 */
export const barFormatter = (
  labelMap: Record<string, string>,
  data: Record<string, Record<string, object>>,
): {
  xLabels: string[];
  series: any[];
} => {
  const keys = Object.keys(data);
  const xLabels = Object.keys(data[keys[0]]).map((key) => labelMap[key] || key);
  const series = keys.map((key) => ({
    name: labelMap[key] || key,
    data: Object.values(data[key]),
    type: 'bar',
  }));

  return {
    xLabels,
    series,
  };
};
