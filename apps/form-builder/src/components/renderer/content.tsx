import { FormRender, SchemaType, FieldCategory } from 'pb-form-render';
import type { Schema } from 'pb-form-render';
import type { CustomSchema } from 'pb-form-render/dist/typing/types';
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
import type { FormInstance } from 'antd';
import { Form, Input, Select, Space } from 'antd';

const TestCustom = (props: {
  properties: CustomSchema['properties'];
  form: FormInstance;
  id?: string;
  disabled?: boolean;
  value?: { name1: ''; name2: '' };
  onChange?: (value: any) => void;
}) => {
  const { id, value, onChange, disabled } = props;
  console.log(id, value, disabled, 'custom props');

  const onName1Change = (val: string) => {
    onChange?.({ ...value, name1: val });
  };

  const onName2Change = (val: string) => {
    onChange?.({ ...value, name2: val });
  };

  return (
    <Space id={id}>
      <Select
        style={{ width: 120 }}
        value={value?.name1}
        disabled={disabled}
        options={props.properties.props?.options1}
        onChange={onName1Change}
      />
      <Select
        style={{ width: 120 }}
        value={value?.name2}
        disabled={disabled}
        options={props.properties.props?.options2}
        onChange={onName2Change}
      />
    </Space>
  );
};

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
    depends: {
      formlist: (val: any[]) => {
        console.log(val, 'formlist depends change');
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
    type: SchemaType.CUSTOM,
    component: (props: any) => {
      return <TestCustom {...props} />;
    },
    properties: {
      label: 'custom123',
      name: 'custom',
      props: {},
      itemProps: {},
      disabled: {
        switch: (val: boolean, form: FormInstance) => {
          return !val;
        },
      },
    },
    depends: {
      switch: (val: boolean, form: FormInstance) => {
        console.log(val, 'custom depends change');
        if (!val) form.setFieldValue('custom', { name1: undefined, name2: undefined });
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
          label: '用户名ggg3',
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
          label: '用户名5',
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
  {
    type: SchemaType.FORM_LIST,
    properties: {
      label: 'fr',
      name: 'formlist',
    },
    children: [
      {
        type: 'custom',
        properties: {},
        customComponent(field) {
          return (
            <Space>
              <Form.Item noStyle name={[field.name, 'item1']}>
                <Input />
              </Form.Item>
              <span>-</span>
              <Form.Item noStyle name={[field.name, 'item2']}>
                <Input />
              </Form.Item>
            </Space>
          );
        },
      },
      // {
      //   type: 'normal',
      //   properties: {
      //     category: FieldCategory.INPUT,
      //     label: 'item',
      //     props: {
      //       placeholder: '请输1入',
      //       styles: {
      //         width: 350,
      //       },
      //     },
      //   },
      // },
      // {
      //   type: 'normal',
      //   properties: {
      //     category: FieldCategory.INPUT,
      //     name: 'f-name2',
      //     props: {
      //       placeholder: '请输2入',
      //       styles: {
      //         width: 350,
      //       },
      //     },
      //   },
      // },
    ],
  },
];

const LayoutContent = () => {
  const [form] = Form.useForm();
  const formRef = useRef<Record<string, any>>();

  useEffect(() => {
    const formIns = formRef.current;

    formIns?.updateSchemaByPath({
      custom: {
        props: {
          options1: [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
          ],
          options2: [
            { label: '3', value: 3 },
            { label: '4', value: 4 },
          ],
        },
      },
    });
  }, []);

  return (
    <div className="content-container">
      <Input
        onChange={(val) => {
          formRef.current?.updateSchemaByPath({
            username: {
              props: {
                placeholder: val.target.value,
              },
            },
          });
        }}
      />
      {/* <FormRender
        ref={formRef}
        form={form}
        initialValues={{ formlist: [], username: 'sdf' }}
        schema={testSchema}
        layout="vertical"
      /> */}
      {/* <button onClick={() => console.log(form.getFieldsValue())}>submit</button> */}
    </div>
  );
};

export default LayoutContent;
