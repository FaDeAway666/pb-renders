import type { FormInstance, FormItemProps, RowProps } from 'antd';

export enum SchemaType {
  FORM_ITEM = 'formItem',
  ROW = 'row',
  FORM_LIST = 'formList',
  CUSTOM = 'custom',
}

export enum FieldCategory {
  INPUT = 'input',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  TEXTAREA = 'textarea',
  PASSWORD = 'password',
  RADIO_GROUP = 'radio-group',
  COLOR = 'color',
  SWITCH = 'switch',
  DATE = 'date',
  DATE_RANGE = 'date-range',
}

export type WatchHook = Record<string, (value: any, formInstance: FormInstance) => any>;

export interface FormItemSchema {
  type: SchemaType.FORM_ITEM;
  properties: {
    label: string;
    category: FieldCategory;
    name: string;
    props: Record<string, any>;
    itemProps: FormItemProps;
    disabled?: boolean | WatchHook;
    hidden?: boolean | WatchHook;
    depends?: WatchHook;
  };
}

export interface RowSchema {
  type: SchemaType.ROW;
  properties: { colNum: number; name: string } & RowProps;
  children: FormItemSchema[];
}

export interface FormListSchema {
  type: SchemaType.FORM_LIST;
  properties: {
    name: string;
  };
}

export interface CustomSchema {
  type: SchemaType.CUSTOM;
  component: (...args: any[]) => JSX.Element;
  properties: Omit<FormItemSchema['properties'], 'category'>;
}

export type Schema = FormItemSchema | RowSchema | FormListSchema | CustomSchema;
