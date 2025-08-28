import { SortableContext } from '@dnd-kit/sortable';
import type { FormInstance } from 'antd';
import { Form, Input, Select, Space } from 'antd';
import { FormRender, SchemaType, FieldCategory, renderFormItem } from 'pb-form-render';
import type { FormRenderRef, Schema } from 'pb-form-render';
import type { CustomSchema, RowSchema } from 'pb-form-render/dist/typing/types';
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

import DropBoard from '@/components/dnd/dropBoard';
import { useRendererStore } from '@/store';

import './content.less';
import { DragTool, SortableItem, SortableRowItem } from '../dnd/drag-item';
import OptionsWrapper from '../options/options';

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
    type: SchemaType.FORM_ITEM,
    properties: {
      label: '选择',
      category: FieldCategory.SELECT,
      name: 'select',
      props: {},
      itemProps: {},
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
  const formRef = useRef<FormRenderRef>(null);
  const {
    schemaIds,
    schemas,
    isDragging,
    activeId,
    detectingId,
    setActiveId,
    setDetectingId,
  } = useRendererStore();

  const handleMouseOver = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath();
    if (isDragging) return;

    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;
      if (activeId === ele.dataset?.componentId) {
        setDetectingId('');
        return;
      }
      if (ele.dataset?.componentId) {
        setDetectingId(ele.dataset.componentId);
        return;
      }
    }

    // e.stopPropagation();
    // e.preventDefault();
    // setDetectingId('');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;
      if (detectingId === ele.dataset?.componentId) {
        setActiveId(detectingId);
        return;
      }
    }
  };

  const DndMask = createPortal(<DragTool />, document.body);

  return (
    <div className="content-container">
      <div
        className="render-content"
        onMouseOver={handleMouseOver}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => {
          setDetectingId('');
        }}
      >
        {!schemaIds.length ? (
          <DropBoard></DropBoard>
        ) : (
          <Form style={{ height: '100%', position: 'relative' }} form={form}>
            <SortableContext items={schemaIds}>
              {schemaIds.map((id, index) => {
                if (typeof id === 'object') {
                  return (
                    <SortableRowItem
                      key={id.id}
                      id={id.id}
                      data={{ ...(schemas[index] as RowSchema), sortType: 'container' }}
                      form={form}
                    ></SortableRowItem>
                  );
                } else {
                  return (
                    <SortableItem
                      key={id}
                      id={id}
                      data={{ ...schemas[index], sortType: 'item' }}
                    >
                      {renderFormItem({ schema: schemas[index], form })}
                    </SortableItem>
                  );
                }
              })}
            </SortableContext>
            {DndMask}
          </Form>
        )}
      </div>
      <OptionsWrapper />
    </div>
    // <FormRender
    //   ref={formRef}
    //   initialValues={{ username: '123' }}
    //   form={form}
    //   schema={testSchema}
    // ></FormRender>
  );
};

export default LayoutContent;
