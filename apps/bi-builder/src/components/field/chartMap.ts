import { FieldType } from './constant';

export enum ChartOptionCategory {
  AXIS = 'axis',
  TITLE = 'title',
  TOOLTIP = 'tooltip',
  SERIES = 'series',
  GRID = 'grid',
}

export const ChartOptionCategoryLabel = {
  [ChartOptionCategory.AXIS]: '坐标轴',
  [ChartOptionCategory.TITLE]: '标题',
  [ChartOptionCategory.TOOLTIP]: '提示工具',
  [ChartOptionCategory.SERIES]: '数据集',
  [ChartOptionCategory.GRID]: '网格',
};

const ChartTitleMap: Record<
  string,
  {
    category: ChartOptionCategory;
    fieldType: FieldType;
    keyPath: string;
    props: Record<string, any>;
  }
> = {
  show: {
    category: ChartOptionCategory.TITLE,
    fieldType: FieldType.SWITCH,
    keyPath: 'title/show',
    props: {
      label: '显示',
      defaultValue: true,
    },
  },
  text: {
    category: ChartOptionCategory.TITLE,
    fieldType: FieldType.INPUT,
    keyPath: 'title/text',
    props: {
      label: '标题名称',
    },
  },
  fontSize: {
    category: ChartOptionCategory.TITLE,
    fieldType: FieldType.INPUT_NUMBER,
    keyPath: 'title/textStyle/fontSize',
    props: {
      label: '字体大小',
      step: 1,
      min: 12,
      max: 24,
    },
  },
  align: {
    category: ChartOptionCategory.TITLE,
    fieldType: FieldType.RADIO_GROUP,
    keyPath: 'title/left',
    props: {
      label: '对齐方式',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
    },
  },
};

const ChartGridMap: Record<
  string,
  {
    category: ChartOptionCategory;
    fieldType: FieldType;
    keyPath: string;
    props: Record<string, any>;
  }
> = {
  show: {
    category: ChartOptionCategory.TITLE,
    fieldType: FieldType.SWITCH,
    keyPath: 'grid/show',
    props: {
      label: '显示',
      defaultValue: true,
    },
  },
  left: {
    category: ChartOptionCategory.GRID,
    fieldType: FieldType.INPUT,
    keyPath: 'grid/left',
    props: {
      label: '左边距',
    },
  },
  top: {
    category: ChartOptionCategory.GRID,
    fieldType: FieldType.INPUT,
    keyPath: 'grid/top',
    props: {
      label: '上边距',
    },
  },
  right: {
    category: ChartOptionCategory.GRID,
    fieldType: FieldType.INPUT,
    keyPath: 'grid/right',
    props: {
      label: '右边距',
    },
  },
  bottom: {
    category: ChartOptionCategory.GRID,
    fieldType: FieldType.INPUT,
    keyPath: 'grid/bottom',
    props: {
      label: '下边距',
    },
  },
};

export const ChartOptionMap: {
  [x in ChartOptionCategory]: typeof ChartTitleMap;
} = {
  title: {
    ...ChartTitleMap,
  },
  axis: {},
  tooltip: {},
  series: {},
  grid: {
    ...ChartGridMap,
  },
};
