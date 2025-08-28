import {
  Input,
  Select,
  Radio,
  InputNumber,
  ColorPicker,
  Switch,
  Form,
  Space,
  Button,
} from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

import { FieldType } from './constant';

import './field.less';

export const getFormItem = (
  type: FieldType,
  props: Record<string, any>,
): React.ReactNode => {
  const [form] = Form.useForm();
  switch (type) {
    case FieldType.INPUT:
      return <Input {...props} />;
    case FieldType.INPUT_NUMBER:
      return <InputNumber {...props} />;
    case FieldType.RADIO_GROUP:
      return <Radio.Group block optionType="button" buttonStyle="solid" {...props} />;
    case FieldType.TEXTAREA:
      return <Input.TextArea {...props} />;
    case FieldType.SELECT:
      return <Select {...props} />;
    case FieldType.COLOR:
      return <ColorPicker format="hex" {...props} />;
    case FieldType.SWITCH:
      return <Switch {...props} />;
    case FieldType.RULE_LIST:
      return (
        <Form form={form} initialValues={{ rules: props.defaultValue }}>
          <Form.List name="rules">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  if (index === 0) {
                    return (
                      <div key={field.key}>
                        <Form.Item name={[field.name, 'required']} label="必填">
                          <Switch />
                        </Form.Item>
                        <Form.Item name={[field.name, 'message']} label="校验信息">
                          <Input />
                        </Form.Item>
                      </div>
                    );
                  } else {
                    return (
                      <div style={{ marginBottom: 16 }} key={field.key}>
                        <div style={{ background: '#f3f3f3', padding: 16 }}>
                          <Form.Item name={[field.name, 'pattern']} label="正则">
                            <Input />
                          </Form.Item>
                          <Form.Item name={[field.name, 'message']} label="校验信息">
                            <Input />
                          </Form.Item>
                          <Button
                            size="small"
                            type="link"
                            variant="link"
                            onClick={() => remove(field.name)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    );
                  }
                })}
                <Button type="dashed" onClick={() => add()}>
                  添加
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                console.log(form.getFieldsValue());
                props.onChange(form.getFieldsValue().rules);
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      );
    default:
      return null;
  }
};

interface FieldItemProps {
  fieldConfig: {
    type: FieldType;
    props: Record<string, any>;
  };
  onChange: (value: any) => void;
}

export const FieldItem = (props: FieldItemProps) => {
  const { fieldConfig, onChange } = props;
  const { type, props: fieldProps } = fieldConfig;

  const onItemChange = (e: any) => {
    console.log(e, 'onchange');

    if (e instanceof AggregationColor) {
      onChange(e.toHexString());
    } else if (e?.target?.value !== undefined) {
      onChange(e?.target.value);
    } else onChange(e);
  };

  return type === FieldType.RULE_LIST ? (
    getFormItem(type, { ...fieldProps, onChange: onItemChange })
  ) : (
    <div className="field-item">
      <div className="label">{fieldProps.label}</div>
      <div className="field-content">
        {getFormItem(type, { ...fieldProps, onChange: onItemChange })}
      </div>
    </div>
  );
};
