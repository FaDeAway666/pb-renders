export enum FieldCategory {
  PROPERTIES = 'properties',
  LAYOUT = 'layout',
  RULES = 'rules',
}

export const CategoryName = {
  [FieldCategory.PROPERTIES]: '属性',
  [FieldCategory.LAYOUT]: '布局',
  [FieldCategory.RULES]: '校验',
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
  SWITCH = 'switch',
  RULE_LIST = 'rule-list',
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
    category: FieldCategory.LAYOUT,
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
    category: FieldCategory.LAYOUT,
    fieldType: FieldType.INPUT_NUMBER,
    props: {
      label: '列间距',
      min: 10,
      step: 5,
    },
  },
  name: {
    category: FieldCategory.PROPERTIES,
    fieldType: FieldType.INPUT,
    props: {
      label: '字段名',
    },
  },
  placeholder: {
    category: FieldCategory.PROPERTIES,
    fieldType: FieldType.INPUT,
    props: {
      label: '占位符',
    },
  },
  label: {
    category: FieldCategory.PROPERTIES,
    fieldType: FieldType.INPUT,
    props: {
      label: '标签',
    },
  },
  rules: {
    category: FieldCategory.RULES,
    fieldType: FieldType.RULE_LIST,
    props: {
      label: '校验规则',
    },
  },
};
