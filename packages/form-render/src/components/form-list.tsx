import type { FormInstance, FormListFieldData, FormListOperation } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { memo, useContext, useEffect } from 'react';

import type { FormListSchema, FormListItemSchema } from '@/types';
import EventBus from '@/utils/event-bus';

import { FormItem, renderFieldItem } from './form-item';

const renderFormListItem = (
  schema: FormListItemSchema,
  field: FormListFieldData,
  index: number,
  name?: string,
) => {
  console.log('render formlistitem', field, name);
  switch (schema.type) {
    case 'normal': {
      if (!schema.properties.category) throw new Error('category is required');
      return name ? (
        <Form.Item
          {...field}
          key={field.key + `${index}`}
          name={[field.name, name]}
          noStyle
        >
          {renderFieldItem({
            category: schema.properties.category,
            props: schema.properties.props || {},
          })}
        </Form.Item>
      ) : (
        <Form.Item {...field} key={field.key + `${index}`} noStyle>
          {renderFieldItem({
            category: schema.properties.category,
            props: schema.properties.props || {},
          })}
        </Form.Item>
      );
    }
    case 'custom':
      if (!schema.customComponent) throw new Error('customComponent is required');
      return <div key={field.key + `${index}`}>{schema.customComponent(field)}</div>;
    default:
      return <></>;
  }
};

interface FormListProps {
  form: FormInstance;
  schema: FormListSchema;
}

export const FormList = ({ schema, form }: FormListProps) => {
  const {
    properties: { name, label, rules },
    removeNode,
    addonNode,
    children,
  } = schema;
  const formlistValue = Form.useWatch(name, form);
  const bus = EventBus.getInstance();

  useEffect(() => {
    if (bus.getEvents().get(name)) {
      bus.publish(name, formlistValue, form);
    }
  }, [formlistValue]);
  // const initialValue = useContext(InitialValueContext);

  // useEffect(() => {
  //   form.setFieldValue(name, initialValue[name]);
  // }, [initialValue]);

  return (
    <FormItem data={{ label: label || '', name, props: {}, itemProps: { rules } }}>
      <Form.List name={name} rules={rules}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div style={{ marginBottom: 16 }} key={field.key}>
                <Space>
                  {children.map((item, index) =>
                    renderFormListItem(item, field, index, item.properties.name),
                  )}
                  {removeNode ? (
                    removeNode(remove, field.name)
                  ) : (
                    <Button
                      size="small"
                      type="link"
                      variant="link"
                      onClick={() => remove(field.name)}
                    >
                      删除
                    </Button>
                  )}
                </Space>
              </div>
            ))}
            {addonNode ? (
              addonNode(add)
            ) : (
              <Button type="dashed" onClick={() => add()}>
                添加
              </Button>
            )}
          </>
        )}
      </Form.List>
    </FormItem>
  );
};

export const MemoFormList = memo(
  ({ schema, form }: FormListProps) => {
    console.log('MemoFormList render', schema);
    return <FormList schema={schema} form={form} />;
  },
  (prev, next) => {
    return JSON.stringify(prev.schema) === JSON.stringify(next.schema);
  },
);
MemoFormList.displayName = 'MemoFormList';
