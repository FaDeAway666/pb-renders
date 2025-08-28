import './options.less';
import { Collapse, Tabs } from 'antd';
import { cloneDeep } from 'lodash-es';
import { SchemaType } from 'pb-form-render';
import type { Schema } from 'pb-form-render';
import type { FormItemSchema, RowSchema } from 'pb-form-render/dist/typing/types';
import { useEffect, useState } from 'react';

import { useRendererStore } from '@/store';
import type { RenderSchema } from '@/store/render';
import { getPathById, getSchemaByIdPath, updateSchemas } from '@/utils/schema';

import { FieldCategory } from '../field/constant';
import { FieldItem } from '../field/fieldItem';
import { formatFields } from '../field/utils';
import { setValueByPath } from '../field/utils';

type ItemType = {
  key: string;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const specialProps = ['name', 'label', 'colNum'];

function stringToRegex(s: string) {
  // 支持 "/abc/i" 或 "abc" 两种输入
  const m = s.match(/^\/(.+)\/([gimsuy]*)$/);
  if (m) return new RegExp(m[1], m[2]);
  return new RegExp(s);
}

const OptionsWrapper = () => {
  const { activeId, schemas, getSchemas, getSchemaIds, setSchemas } =
    useRendererStore();
  const [fieldLists, setFieldLists] = useState<ItemType[]>();

  // let timeOut: unknown | null = null;
  // const dispatchChange = (type: string, value: any, item: Record<string, any>) => {
  //   if (timeOut) {
  //     clearTimeout(timeOut as number);
  //   }
  //   timeOut = setTimeout(() => {
  //     if (item.keyPath) {
  //       onChartFieldChange(value, item.keyPath);
  //     } else {
  //       onFieldChange(type, item.name, value);
  //     }
  //   }, 300);
  // };
  const onFieldChange = (value: any, keyName: string, type: FieldCategory) => {
    const schemaIds = getSchemaIds();
    const cSchemas = getSchemas();
    const idPath = getPathById(schemaIds, activeId);
    const currSchema =
      idPath.length > 1
        ? (cSchemas[idPath[0]] as RowSchema).children[idPath[1]]
        : cSchemas[idPath[0]];

    if (!currSchema) return;

    const newSchema = cloneDeep(currSchema);
    if (type === FieldCategory.PROPERTIES) {
      if (specialProps.includes(keyName)) {
        newSchema.properties[keyName as keyof Schema['properties']] = value;
      } else {
        (newSchema as FormItemSchema).properties.props[keyName] = value;
      }
    } else if (type === FieldCategory.RULES) {
      const formatValue = value.map((v: any) => {
        if (v.pattern) {
          v.pattern = stringToRegex(v.pattern);
        }
        return v;
      });

      (newSchema as FormItemSchema).properties.itemProps[
        keyName as keyof FormItemSchema['properties']['itemProps']
      ] = formatValue;
      //
    } else if (type === FieldCategory.LAYOUT) {
      //
      newSchema.properties[keyName as keyof Schema['properties']] = value;
    }

    if (idPath.length > 1) {
      (cSchemas[idPath[0]] as RowSchema).children.splice(
        idPath[1],
        1,
        newSchema as FormItemSchema,
      );
    } else {
      cSchemas.splice(idPath[0], 1, newSchema as RenderSchema);
    }
    setSchemas([...cSchemas]);
    console.log(value, keyName, 'field change');
  };

  const generateFieldList = (
    fieldConfigs: ReturnType<typeof formatFields>,
    id: string,
  ) => {
    const list: ItemType[] = [];
    for (const key in fieldConfigs) {
      const listItem = {
        key: key,
        label: fieldConfigs[key as FieldCategory]?.title || '',
        children: (
          <div style={{ padding: '0 16px' }}>
            {fieldConfigs[key as FieldCategory]!.children.map((child) => (
              <FieldItem
                key={id + '-' + child.name}
                fieldConfig={{
                  type: child.fieldType,
                  props: child.props,
                }}
                onChange={(value) => {
                  console.log(value, 'field change');
                  onFieldChange(value, child.name, key as FieldCategory);
                }}
              />
            ))}
          </div>
        ),
      };
      list.push(listItem);
    }

    return list;
  };

  useEffect(() => {
    const idPath = getPathById(getSchemaIds(), activeId);
    const cSchema = getSchemaByIdPath(schemas, idPath);
    console.log(cSchema, activeId, 'cshema');
    if (cSchema) {
      const fieldList = formatFields(cSchema);
      console.log(fieldList, 'fieldlist');
      setFieldLists(generateFieldList(fieldList, activeId));
    } else {
      setFieldLists([]);
    }
  }, [activeId, schemas]);

  // const configList = generateFieldList(fieldConfigs);

  return (
    <div className="options-wrapper">
      <Tabs type="card" items={fieldLists}></Tabs>
      {/* <Collapse items={fieldLists} bordered={false} /> */}
    </div>
  );
};

export default OptionsWrapper;
