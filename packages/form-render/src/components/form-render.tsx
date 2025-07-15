import type { FormInstance, FormProps } from 'antd';
import { Form } from 'antd';
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';

import { CallbacksContext } from '@/store';
import type { FormItemSchema, RowSchema, Schema } from '@/types';
import EventBus from '@/utils/event-bus';
import { updateSchema } from '@/utils/schema';

import { renderFormItem } from './form-item';

interface FormBuilderProps extends FormProps {
  form: FormInstance;
  schema: Schema[];
}

const initEvents = (schemas: Schema[]) => {
  const bus = EventBus.getInstance();

  for (const schema of schemas) {
    const depends = (schema as FormItemSchema).depends;
    if (depends) {
      for (const key in depends) {
        bus.subscribe(key, depends[key]);
      }
    } else if ((schema as RowSchema).children) {
      initEvents((schema as RowSchema).children);
    }
  }
  console.log(bus.getEvents(), 'initEvents');
};

export const FormRender = forwardRef((props: FormBuilderProps, ref) => {
  const { schema, form, ...rest } = props;
  // 用于更新表单项
  const [schemaState, setSchemaState] = useState<Schema[]>(schema);
  // 用于在updateSchema中使用，保存所有对schema的更改，不影响props进来的schema
  const stateRef = useRef<Schema[]>(schema);
  const callbacks = useRef<Record<string, (value: any, form: any) => void>>({});
  const setCallbacks = (fns: Record<string, (value: any, form: any) => void>) => {
    callbacks.current = fns;
  };

  const updateSchemaByPath = (newSchemaConfig: Record<string, Record<string, any>>) => {
    const newSchema = updateSchema(stateRef.current, newSchemaConfig);
    console.log(schema, 'updateschema');
    setSchemaState(newSchema);
    stateRef.current = newSchema;
  };

  const getSchema = () => {
    return stateRef.current;
  };

  useImperativeHandle(ref, () => ({
    updateSchemaByPath,
    getSchema,
  }));

  useEffect(() => {
    setSchemaState([...schema]);
    stateRef.current = [...schema];
  }, [schema]);

  useEffect(() => {
    initEvents(schema);
    return () => {
      const bus = EventBus.getInstance();
      bus.unsubscribeAll();
    };
  }, []);

  return (
    <Form form={form} {...rest}>
      <CallbacksContext.Provider value={{ callbacksRef: callbacks, setCallbacks }}>
        {schemaState.map((item) => renderFormItem({ schema: item, form }))}
      </CallbacksContext.Provider>
    </Form>
  );
});

FormRender.displayName = 'FormRender';
