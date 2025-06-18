import type { RenderConfig } from 'pb-bi-render';

import type { OptionsConfig } from '../options/options';

import type { ChartOptionCategory } from './chartMap';
import { ChartOptionCategoryLabel, ChartOptionMap } from './chartMap';
import type { FieldCategory } from './constant';
import { FieldMap, CategoryName, FieldType } from './constant';

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

export const formatFields = (config: OptionsConfig, renderConfig: RenderConfig) => {
  let fieldConfigs: Partial<
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
    if (key === 'chartOptions' && config[key]) {
      const chartFields = formatChartOptionFields(config[key]);
      fieldConfigs = {
        ...fieldConfigs,
        ...chartFields,
      };
    }
  }

  return fieldConfigs;
};
