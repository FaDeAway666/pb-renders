import { FormRender, SchemaType, FieldCategory } from 'pb-form-render';
import type { Schema } from 'pb-form-render';
import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import DropBoard from '@/components/dnd/dropBoard';
import type { ChartType } from '@/constant/chart';
import { defaultChartOptions } from '@/constant/chart';
import { customOptions } from '@/constant/custom';
import { useRendererStore } from '@/store';
import {
  getGridLayout,
  initGridArray,
  rearangeGrid,
  rebuildGridArray,
} from '@/utils/grid';
import { deepClone } from '@/utils/json';

import ChartPanel from '../chart/panel';
import './content.less';
import type { OptionsConfig } from '../options/options';
import OptionsWrapper from '../options/options';
import { Form, Input } from 'antd';

const testSchema: Schema[] = [
  {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '用户名',
      category: FieldCategory.INPUT,
      name: 'username',
      props: {
        placeholder: '请输入',
      },
      itemProps: {
        required: true,
        labelCol: {
          span: 4,
        },
      },
      disabled: {
        switch: (value) => !value,
      },
    },
  },
  {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '用户名用户名用户名用户名',
      category: FieldCategory.INPUT,
      name: 'gg',
      props: {
        placeholder: '请输入',
      },
      itemProps: {
        required: true,
      },
      hidden: {
        switch: (value) => !value,
      },
    },
  },
  {
    type: SchemaType.FORM_ITEM,
    properties: {
      label: 'switch',
      category: FieldCategory.SWITCH,
      name: 'switch',
      props: {},
      itemProps: {
        initialValue: true,
      },
    },
  },
  {
    type: SchemaType.ROW,
    properties: {
      name: 'row1',
      colNum: 3,
      gutter: 20,
    },
    children: [
      {
        type: SchemaType.FORM_ITEM,
        properties: {
          label: '用户名3',
          category: FieldCategory.INPUT,
          name: 'gg3',
          props: {
            placeholder: '请输入',
          },
          itemProps: {
            required: true,
          },
        },
      },
      {
        type: SchemaType.FORM_ITEM,
        properties: {
          label: '用户名4',
          category: FieldCategory.INPUT,
          name: 'gg4',
          props: {
            placeholder: '请输入',
          },
          itemProps: {
            required: true,
          },
        },
      },
    ],
  },
];

const LayoutContent = () => {
  const [form] = Form.useForm();
  const formRef = useRef<Record<string, any>>();

  return (
    <div className="content-container">
      <Input
        onChange={(val) => {
          console.log(val.target.value);
          formRef.current?.updateSchemaByPath({
            username: {
              props: {
                placeholder: val.target.value,
              },
            },
          });
        }}
      />
      <FormRender
        ref={formRef}
        form={form}
        schema={testSchema}
        displayType="vertical"
      />
    </div>
  );
};

export default LayoutContent;
