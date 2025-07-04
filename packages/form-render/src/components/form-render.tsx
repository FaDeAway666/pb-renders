import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';

import type { Schema } from '@/types';
import { updateSchema } from '@/utils/schema';

import { renderFormItem } from './form-item';

interface FormBuilderProps {
  form: FormInstance;
  schema: Schema[];
  displayType?: 'horizontal' | 'vertical' | 'inline';
}

export const FormRender = forwardRef((props: FormBuilderProps, ref) => {
  const { displayType, schema, form } = props;
  const [schemaState, setSchemaState] = useState(schema);

  const updateSchemaByPath = (newSchemaConfig: Record<string, Record<string, any>>) => {
    const newSchema = updateSchema(schemaState, newSchemaConfig);
    setSchemaState(newSchema);
  };

  const getSchema = () => {
    console.log(schemaState);
  };

  useImperativeHandle(ref, () => ({
    updateSchemaByPath,
    getSchema,
  }));

  return (
    <Form layout={displayType} form={form}>
      {schemaState.map((item) => renderFormItem({ schema: item, form }))}
    </Form>
  );
});

FormRender.displayName = 'FormRender';
