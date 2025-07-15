import type { FormInstance, FormItemProps, FormListFieldData, RowProps } from 'antd';
import type { FormListOperation, Rule } from 'antd/es/form';

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
    readOnly?: boolean | WatchHook;
  };
  depends?: WatchHook;
}

export interface RowSchema {
  type: SchemaType.ROW;
  properties: { colNum: number; name: string } & RowProps;
  children: FormItemSchema[];
}

export interface FormListItemSchema {
  type: 'normal' | 'custom';
  properties: {
    category?: FieldCategory;
    name?: string;
    label?: string;
    props?: Record<string, any>;
    itemProps?: FormItemProps;
  };
  customComponent?: (field: FormListFieldData) => React.ReactElement;
  children?: FormListItemSchema[];
}

export interface FormListSchema {
  type: SchemaType.FORM_LIST;
  properties: {
    name: string;
    label?: string;
    initialValue?: any[];
    rules?: any[];
  };
  children: FormListItemSchema[];
  addonNode?: (add: FormListOperation['add']) => React.ReactNode;
  removeNode?: (remove: FormListOperation['remove'], index: number) => React.ReactNode;
}

export interface CustomSchema {
  type: SchemaType.CUSTOM;
  component: (...args: any[]) => React.ReactElement;
  properties: Omit<FormItemSchema['properties'], 'category'>;
  depends?: WatchHook;
}

export type Schema = FormItemSchema | RowSchema | CustomSchema | FormListSchema;
