import { Input, Select, Radio, InputNumber, ColorPicker, Switch } from 'antd';

import { FieldType } from './constant';

import './field.less';
import { AggregationColor } from 'antd/es/color-picker/color';

export const getFormItem = (
  type: FieldType,
  props: Record<string, any>,
): React.ReactNode => {
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

  return (
    <div className="field-item">
      <div className="label">{fieldProps.label}</div>
      <div className="field-content">
        {getFormItem(type, { ...fieldProps, onChange: onItemChange })}
      </div>
    </div>
  );
};
