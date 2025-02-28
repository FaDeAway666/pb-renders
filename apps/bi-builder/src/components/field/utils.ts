import type { RenderConfig } from 'pb-bi-render';
import type { ReactNode } from 'react';

import type { OptionsConfig } from '../options/options';

import type { FieldCategory } from './constant';
import { FieldMap, CategoryName } from './constant';
import { FieldItem, getFormItem } from './fieldItem';

const getFuncPropsResult = (
  name: string,
  propFunc: (...args: any[]) => Record<string, any>,
  renderConfig: RenderConfig,
) => {
  switch (name) {
    case 'col':
    case 'colSpan':
      return {
        ...propFunc(renderConfig.colNum),
      };
    default:
      return {};
  }
};

export const formatFields = (config: OptionsConfig, renderConfig: RenderConfig) => {
  const fieldConfigs: Partial<
    Record<
      FieldCategory,
      {
        title: string;
        children: Record<string, any>[];
      }
    >
  > = {};

  for (const key in config) {
    if (FieldMap[key]) {
      const category = FieldMap[key].category;

      const newField = {
        name: key,
        ...FieldMap[key],
        props: {
          ...(FieldMap[key].props instanceof Function
            ? getFuncPropsResult(
                key,
                FieldMap[key].props as (...args: any[]) => Record<string, any>,
                renderConfig,
              )
            : FieldMap[key].props),
          value: (config as Record<string, any>)[key],
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
