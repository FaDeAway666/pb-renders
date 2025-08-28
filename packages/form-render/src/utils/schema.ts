import { cloneDeep } from 'lodash-es';

import type { FormItemSchema, Schema } from '@/types';

const updateValueByPath = (
  target: Schema['properties'],
  paths: string[],
  value: unknown,
) => {
  for (let i = 0; i < paths.length; i++) {
    if (i === paths.length - 1) {
      (target as any)[paths[i]] = value;
    } else {
      target = (target as any)[paths[i]];
    }
  }
};

/**
 * newSchemaConfig: {
 *   username: {
 *     properties: {
 *       label: 'XXX',
 *       props: {
 *         options: [
 *           {label: '123', value: 'abc'}
 *         ]
 *       }
 *     }
 *   },
 *   'password/disabled': true,
 *   'password/props/placeholder': 'mima'
 * }
 */
export const updateSchema = (
  schema: Schema[],
  newSchemaConfig: Record<string, unknown>,
) => {
  const newSchema: Schema[] = cloneDeep(schema);

  for (const path in newSchemaConfig) {
    if (path.includes('/')) {
      console.log(path);
      const paths = path.split('/');
      const target = newSchema.find(
        (item) => (item.properties as FormItemSchema['properties']).name === paths[0],
      );
      if (!target) continue;
      updateValueByPath(target.properties, paths.slice(1), newSchemaConfig[path]);
    } else {
      const target = newSchema.find(
        (item) => (item.properties as FormItemSchema['properties']).name === path,
      );
      if (!target) continue;
      target.properties = {
        ...target.properties,
        ...(newSchemaConfig[path] as Record<string, any>),
      };
    }
  }

  return newSchema;
};
