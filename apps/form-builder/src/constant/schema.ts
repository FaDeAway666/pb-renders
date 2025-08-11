import type { Schema } from 'pb-form-render';
import { SchemaType, FieldCategory } from 'pb-form-render';

export const defaultSchema: Record<string, Schema> = {
  input: {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '用户名',
      category: FieldCategory.INPUT,
      name: 'username',
      props: {
        placeholder: '请输入',
      },
      itemProps: {
        rules: [{ required: true }],
      },
    },
  },
  select: {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '下拉框',
      category: FieldCategory.SELECT,
      name: 'username',
      props: {
        placeholder: '请选择',
      },
      itemProps: {
        rules: [{ required: true }],
      },
    },
  },
  password: {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '密码',
      category: FieldCategory.PASSWORD,
      name: 'password',
      props: {
        placeholder: '请输入',
      },
      itemProps: {
        rules: [{ required: true }],
      },
    },
  },
  textarea: {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '文本域',
      category: FieldCategory.TEXTAREA,
      name: 'username',
      props: {
        placeholder: '请输入',
      },
      itemProps: {
        rules: [{ required: true }],
      },
    },
  },
  row: {
    type: SchemaType.ROW,
    properties: {
      name: 'row1',
      colNum: 3,
    },
    children: [],
  },
};
