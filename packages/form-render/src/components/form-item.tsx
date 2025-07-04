import type { FormInstance } from 'antd';
import { Row, Form, Input, Select, Switch, DatePicker, Col } from 'antd';
import { cloneElement, memo, useEffect, useState } from 'react';

import { useHidden } from '@/hooks/useHidden';
import type { CustomSchema, RowSchema, FormItemSchema, FormListSchema } from '@/types';
import { FieldCategory } from '@/types';
import EventBus from '@/utils/event-bus';

interface FormItemProps {
  schema: FormItemSchema | RowSchema | CustomSchema | FormListSchema;
  form: FormInstance;
}

export const renderFieldItem = (
  data: FormItemSchema['properties'],
): React.ReactElement => {
  console.log('field render');
  switch (data.category) {
    case FieldCategory.INPUT:
      return <Input {...data.props} />;
    case FieldCategory.TEXTAREA:
      return <Input.TextArea {...data.props} />;
    case FieldCategory.PASSWORD:
      return <Input.Password {...data.props} />;
    case FieldCategory.SELECT:
      return <Select {...data.props} />;
    // case FieldCategory.CONTROLLED_SELECT:
    //   return <ControlledSelect {...data.props} />;

    case FieldCategory.DATE_RANGE:
      return <DatePicker.RangePicker {...data.props} />;
    case FieldCategory.SWITCH:
      return <Switch {...data.props} />;
    default:
      return <></>;
  }
};

export const renderRowItem = (data: RowSchema, form: FormInstance) => {
  const { properties, children } = data;
  const { colNum, ...rest } = properties;
  if (colNum > 4 || colNum < 1) {
    throw new Error('colNum must be between 1 and 4');
  }
  return (
    <Row key={properties.name} {...rest}>
      {Array(colNum)
        .fill(0)
        .map((_, index) => {
          const childrenSchema = children[index];
          return (
            childrenSchema && (
              <Col key={children[index].properties.name} span={24 / colNum}>
                <MemoFieldItem schema={childrenSchema} form={form} />
              </Col>
            )
          );
        })}
    </Row>
  );
};

export const renderCustomItem = (data: CustomSchema, form: FormInstance) => {
  const { component, properties } = data;
  return component(properties, form);
};

export const FormItem = (props: {
  data: Omit<FormItemSchema['properties'], 'category'>;
  children: React.ReactElement;
  form?: FormInstance;
}) => {
  const { data, form, children } = props;
  const hidden = useHidden(data.hidden);
  const disabled = useHidden(data.disabled);
  // const [hidden, setHidden] = useState(typeof data.hidden === 'function' ? data.hidden );
  const enhancedChild = cloneElement(children, {
    onChange: (event: any) => {
      const value = event?.target?.value ?? event;

      // 调用原始 onChange
      if (children.props.onChange) {
        children.props.onChange(event);
      }

      // 判断当前FormItem是否需要派发更新
      const bus = EventBus.getInstance();
      console.log(data.name, bus);
      if (bus.getEvents().get(data.name)) {
        bus.publish(data.name, value, form);
      }
    },
    disabled,
  });

  return !hidden ? (
    <Form.Item
      name={data.name}
      label={data.label}
      required={data.itemProps?.required}
      {...data.itemProps}
    >
      {enhancedChild}
    </Form.Item>
  ) : (
    <></>
  );
};

const MemoFieldItem = memo(
  ({ schema, form }: { schema: FormItemSchema; form: FormInstance }) => {
    console.log('MemoFormItem render', schema);
    return (
      <FormItem key={schema.properties.name} data={schema.properties} form={form}>
        {renderFieldItem(schema.properties)}
      </FormItem>
    );
  },
  (prev, next) => {
    return (
      JSON.stringify(prev.schema.properties) === JSON.stringify(next.schema.properties)
    );
  },
);
MemoFieldItem.displayName = 'MemoFieldItem';

export const renderFormItem = (props: FormItemProps) => {
  const { schema, form } = props;
  switch (schema.type) {
    case 'formItem':
      return <MemoFieldItem key={schema.properties.name} schema={schema} form={form} />;
    case 'row':
      return renderRowItem(schema, form);
    case 'custom':
      return (
        <FormItem key={schema.properties.name} data={schema.properties} form={form}>
          {renderCustomItem(schema, form)}
        </FormItem>
      );
    default:
      return <></>;
  }
};
