import type {
  RowSchema,
  FormItemSchema,
  FormListSchema,
} from 'pb-form-render/dist/typing/types';

import type { ContainerID } from '@/components/dnd/drag-item';
import type { RenderSchema } from '@/store/render';

export const getPathById = (ids: (string | ContainerID)[], id: string) => {
  const path: number[] = [];
  const index = ids.findIndex((item) => item === id);
  if (index > -1) path.push(index);
  else {
    const findex = ids.findIndex((item) => {
      if (typeof item === 'object') {
        const cIndex = item.children.findIndex((child) => child === id);
        if (cIndex > -1) {
          path.push(cIndex);
          return true;
        } else {
          return item.id === id;
        }
      }
    });
    path.unshift(findex);
  }

  return path;
};

export function addIdByPath(
  ids: (string | ContainerID)[],
  idPath: number[],
  id: string | ContainerID,
) {
  const newIds = [...ids];
  const target = newIds[idPath[0]];
  if (typeof target === 'string') {
    newIds.splice(idPath[0] + 1, 0, id);
  } else {
    if (idPath.length === 1) newIds.splice(idPath[0] + 1, 0, id);
    else target.children.splice(idPath[1] + 1, 0, id as string);
  }
  console.log(newIds, 'add id');
  return newIds;
}

export function deleteIdByPath(ids: (string | ContainerID)[], idPath: number[]) {
  const newIds = [...ids];
  const target = newIds[idPath[0]];
  if (typeof target === 'string') {
    newIds.splice(idPath[0], 1);
  } else {
    if (idPath.length === 1) {
      newIds.splice(idPath[0], 1);
    } else target.children.splice(idPath[1], 1);
  }
  console.log(newIds, 'delete id');
  return newIds;
}

export function updateSchemas(
  schemas: RenderSchema[],
  idPath: number[],
  schema?: RenderSchema,
) {
  const newSchemas = [...schemas];
  if (schema) {
    if (idPath.length > 1) {
      (newSchemas[idPath[0]] as RowSchema | FormListSchema).children.splice(
        idPath[1] + 1,
        0,
        schema as FormItemSchema,
      );
    } else {
      newSchemas.splice(idPath[0] + 1, 0, schema);
    }
  } else {
    if (idPath.length > 1) {
      (newSchemas[idPath[0]] as RowSchema | FormListSchema).children.splice(
        idPath[1],
        1,
      );
    } else {
      newSchemas.splice(idPath[0], 1);
    }
  }
  console.log(newSchemas, 'new schemas');
  return newSchemas;
}

export function getSchemaByIdPath(schemas: RenderSchema[], idPath: number[]) {
  if (idPath.length > 1) {
    return (schemas[idPath[0]] as RowSchema)?.children[idPath[1]];
  } else return schemas[idPath[0]];
}
