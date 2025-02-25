export enum FieldCategory {
  PAGE = 'page',
  LAYOUT = 'layout',
  PAGE_STYLE = 'page-style',
}

export const CategoryName = {
  [FieldCategory.PAGE]: '页面',
  [FieldCategory.LAYOUT]: '布局',
  [FieldCategory.PAGE_STYLE]: '样式',
};

export enum FieldType {
  INPUT = 'input',
  INPUT_NUMBER = 'input-number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  TEXTAREA = 'textarea',
  RADIO_GROUP = 'radio-group',
  COLOR = 'color',
}

export const FieldMap: Record<
  string,
  {
    category: FieldCategory;
    fieldType: FieldType;
    props: Record<string, any>;
  }
> = {
  colNum: {
    category: FieldCategory.PAGE,
    fieldType: FieldType.RADIO_GROUP,
    props: {
      defaultValue: 3,
      label: '列数',
      options: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
      ],
    },
  },
  colGutter: {
    category: FieldCategory.PAGE,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '列间距',
      min: 10,
      step: 5,
    },
  },
  rowGutter: {
    category: FieldCategory.PAGE,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '行间距',
      min: 10,
      step: 5,
    },
  },
  padding: {
    category: FieldCategory.PAGE_STYLE,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '页边距',
      min: 10,
      step: 5,
    },
  },
  background: {
    category: FieldCategory.PAGE_STYLE,
    fieldType: FieldType.COLOR,
    props: {
      label: '背景色',
    },
  },
  col: {
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.RADIO_GROUP,
    props: (max: number) => {
      const options = Array(max)
        .fill(0)
        .map((_, index) => ({
          label: `${index + 1}`,
          value: index + 1,
        }));
      return {
        label: '列号',
        options,
      };
    },
  },
  row: {
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '行号',
      min: 1,
      step: 1,
    },
  },
  colSpan: {
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.INPUT_NUMBER,
    props: (max: number) => ({
      label: '列数',
      min: 1,
      max,
      step: 1,
    }),
  },
  rowSpan: {
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '行数',
      min: 1,
      step: 1,
    },
  },
  height: {
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '高度',
      min: 10,
      step: 10,
    },
  },
};
