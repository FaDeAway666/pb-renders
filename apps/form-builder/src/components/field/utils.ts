import type { Schema } from 'pb-form-render';
import type { FormItemSchema } from 'pb-form-render/dist/typing/types';

import type { ChartOptionCategory } from './chartMap';
import { ChartOptionCategoryLabel, ChartOptionMap } from './chartMap';
import type { FieldCategory } from './constant';
import { FieldMap, CategoryName, FieldType } from './constant';

const getValueByPath = (options: Record<string, any>, path: string): any => {
  return path.split('/').reduce((acc, curr) => acc && acc[curr], options);
};

export const setValueByPath = (
  value: any,
  path: string,
  options: Record<string, any>,
) => {
  const keys = path.split('/');
  let current = options;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return options;
};

const formatChartOptionFields = (options: Record<string, any>) => {
  const fieldConfigs: Partial<
    Record<
      ChartOptionCategory,
      {
        title: string;
        children: Record<string, any>[];
      }
    >
  > = {};

  console.log(options, 'format chartoption');
  for (const key in ChartOptionMap) {
    const map = ChartOptionMap[key as ChartOptionCategory];
    if (map && Object.keys(map).length > 0) {
      if (!fieldConfigs[key as ChartOptionCategory]) {
        fieldConfigs[key as ChartOptionCategory] = {
          title: ChartOptionCategoryLabel[key as ChartOptionCategory],
          children: [],
        };
      }

      for (const mapKey in map) {
        const value = getValueByPath(options, map[mapKey].keyPath);
        const newField = {
          ...map[mapKey],
          props: {
            ...map[mapKey].props,
            // value,
            defaultValue: value,
          },
        };
        // if (map[mapKey].fieldType === FieldType.INPUT) {
        //   delete newField.props.value;
        // }
        fieldConfigs[key as ChartOptionCategory]?.children.push(newField);
      }
    }
  }

  return fieldConfigs;
};

export const formatFields = (schema: Schema) => {
  const fieldConfigs: Partial<
    Record<
      FieldCategory,
      {
        title: string;
        children: Record<string, any>[];
      }
    >
  > = {};

  for (const key in schema.properties) {
    if (FieldMap[key]) {
      const category = FieldMap[key].category;

      const newField = {
        name: key,
        ...FieldMap[key],
        props: {
          ...FieldMap[key].props,
          // value: (schema.properties as Record<string, any>)[key],
          defaultValue: (schema.properties as Record<string, any>)[key],
        },
      };
      if (!fieldConfigs[category]) {
        fieldConfigs[category] = {
          title: CategoryName[category],
          children: [newField],
        };
      } else {
        fieldConfigs[category].children.push(newField);
      }
    }
  }

  for (const key in (schema as FormItemSchema).properties.props) {
    if (FieldMap[key]) {
      const category = FieldMap[key].category;

      const newField = {
        name: key,
        ...FieldMap[key],
        props: {
          ...FieldMap[key].props,
          // value: ((schema as FormItemSchema).properties.props as Record<string, any>)[
          //   key
          // ],
          defaultValue: (
            (schema as FormItemSchema).properties.props as Record<string, any>
          )[key],
        },
      };

      fieldConfigs[category]!.children.push(newField);
    }
  }

  for (const key in (schema as FormItemSchema).properties.itemProps) {
    if (FieldMap[key]) {
      const category = FieldMap[key].category;

      const newField = {
        name: key,
        ...FieldMap[key],
        props: {
          ...FieldMap[key].props,
          // value: ((schema as FormItemSchema).properties.props as Record<string, any>)[
          //   key
          // ],
          defaultValue: (
            (schema as FormItemSchema).properties.itemProps as Record<string, any>
          )[key],
        },
      };

      if (!fieldConfigs[category]) {
        fieldConfigs[category] = {
          title: CategoryName[category],
          children: [newField],
        };
      } else {
        fieldConfigs[category].children.push(newField);
      }
    }
  }

  return fieldConfigs;
};
