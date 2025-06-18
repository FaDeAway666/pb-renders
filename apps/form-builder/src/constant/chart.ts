const defaultBarChartOptions = {
  title: {
    text: 'BarChart',
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
}

const defaultLineChartOptions = {
  title: {
    text: 'LineChart',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}

export const defaultChartOptions: {
  [K in ChartType]: Record<string, any>
} = {
  bar: {...defaultBarChartOptions},
  line: {...defaultLineChartOptions}
}

export enum ChartType {
  BAR = 'bar',
  LINE = 'line'
}
