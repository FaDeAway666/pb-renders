import { cloneDeep } from 'lodash-es';

import type { FormItemSchema, Schema } from '@/types';

export const updateSchema = (
  schema: Schema[],
  newSchemaConfig: Record<string, Record<string, any>>,
) => {
  const newSchema: Schema[] = cloneDeep(schema);

  for (const path in newSchemaConfig) {
    if (path.includes('/')) {
      console.log(path);
    } else {
      const target = newSchema.find(
        (item) => (item.properties as FormItemSchema['properties']).name === path,
      );
      if (!target) continue;
      target.properties = {
        ...target.properties,
        ...newSchemaConfig[path],
      };
    }
  }

  return newSchema;
};
