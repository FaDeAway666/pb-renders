import type {
  Active,
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
  Over,
} from '@dnd-kit/core';
import { closestCenter, DndContext, pointerWithin, DragOverlay } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep } from 'lodash-es';
import type { Schema } from 'pb-form-render';
import type {
  FormItemSchema,
  FormListSchema,
  RowSchema,
} from 'pb-form-render/dist/typing/types';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuid } from 'uuid';

import type { ContainerID } from './components/dnd/drag-item';
import DndOverlay from './components/dnd/overlay';
import MainContent from './components/renderer/content';
import { defaultSchema } from './constant/schema';
import Layout from './layout';
import { HeaderContent } from './layout/headerContent';
import SideContent from './layout/sideContent';
import { useRendererStore } from './store';
import type { RenderSchema } from './store/render';
import {
  addIdByPath,
  deleteIdByPath,
  getPathById,
  updateSchemas,
} from './utils/schema';

function updateSchemaIds(
  ids: (string | ContainerID)[],
  idPath: number[],
  id?: string | ContainerID,
) {
  if (id) {
    return addIdByPath(ids, idPath, id);
  } else {
    return deleteIdByPath(ids, idPath);
  }
}

// 自定义碰撞检测
const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return closestCenter(args);
};

const moveContainerItemToRoot = (
  items: any[],
  newIndexPath: number[],
  oldIndexPath: number[], // > 1
) => {
  const container = items[oldIndexPath[0]];
  const old = container.children[oldIndexPath[1]];
  items.splice(newIndexPath[0] + 1, 0, old);
  container.children.splice(oldIndexPath[1], 1);
  return items;
};

const moveItemToContainer = (
  items: any[],
  newIndexPath: number[], // > 1
  oldIndexPath: number[],
) => {
  const old = items[oldIndexPath[0]];
  const container = items[newIndexPath[0]];
  container.children.splice(newIndexPath[1] + 1, 0, old);
  items.splice(oldIndexPath[0], 1);
  return items;
};

const moveContainerItemToOtherContainer = (
  items: any[],
  newIndexPath: number[], // > 1
  oldIndexPath: number[], // > 1
) => {
  const oldContainer = items[oldIndexPath[0]];
  const newContainer = items[newIndexPath[0]];
  const old = oldContainer.children[oldIndexPath[1]];
  newContainer.children.splice(newIndexPath[1] + 1, 0, old);
  oldContainer.children.splice(oldIndexPath[1], 1);
  return items;
};

function App() {
  const setSchemas = useRendererStore((state) => state.setSchemas);
  const getSchemas = useRendererStore((state) => state.getSchemas);
  const setSchemaIds = useRendererStore((state) => state.setSchemaIds);
  const getSchemaIds = useRendererStore((state) => state.getSchemaIds);
  const [activeComponent, setActiveComponent] = useState('');

  const handleSortDataChange = (
    schemas: RenderSchema[],
    schemaIds: (string | ContainerID)[],
    active: Active,
    over: Over,
  ) => {
    const oldIndexPath = getPathById(schemaIds, active.id as string);
    const newIndexPath = getPathById(schemaIds, over.id as string);
    console.log(oldIndexPath, newIndexPath, schemas, schemaIds, active, over, 'paths');

    if (
      (active.data.current?.sortType as string).includes('container') &&
      (over.data.current?.sortType as string).startsWith('rowFormItem')
    )
      return;

    if (
      (active.data.current?.sortType as string).includes('container') &&
      (over.data.current?.sortType as string).includes('container')
    ) {
      return;
    }

    if (
      (over.data.current?.sortType as string).startsWith('container') &&
      !(active.data.current?.sortType as string).includes('container')
    ) {
      if (newIndexPath[0] === -1) return;
      if ((schemaIds[newIndexPath[0]] as ContainerID).children.length === 0) {
        const newIds = [...schemaIds];
        const newSchemas = [...schemas];

        if (oldIndexPath.length > 1) {
          (newIds[newIndexPath[0]] as ContainerID).children.push(active.id as string);
          const oldContainer = newIds[oldIndexPath[0]] as ContainerID;
          oldContainer.children.splice(oldIndexPath[1], 1);

          (newSchemas[newIndexPath[0]] as RowSchema).children.push(
            (newSchemas[oldIndexPath[0]] as RowSchema).children[oldIndexPath[1]],
          );
          (newSchemas[oldIndexPath[0]] as RowSchema).children.splice(
            oldIndexPath[1],
            1,
          );
        } else {
          (newIds[newIndexPath[0]] as ContainerID).children.push(active.id as string);
          newIds.splice(oldIndexPath[0], 1);
          (newSchemas[newIndexPath[0]] as RowSchema).children.push(
            newSchemas[oldIndexPath[0]] as FormItemSchema,
          );
          newSchemas.splice(oldIndexPath[0], 1);
        }

        setSchemaIds(newIds);
        setSchemas(newSchemas);
        return;
      }
    }

    // 有一方的index 为-1，说明是子项
    // 如果oldIndex 为-1，说明是拖拽子项到外部
    if (oldIndexPath.length > 1 && newIndexPath.length === 1) {
      setSchemaIds(moveContainerItemToRoot(schemaIds, newIndexPath, oldIndexPath));
      setSchemas(moveContainerItemToRoot(schemas, newIndexPath, oldIndexPath));
    }
    // 如果newIndex 为-1，说明是拖拽子项到容器内部
    else if (oldIndexPath.length === 1 && newIndexPath.length > 1) {
      setSchemaIds(moveItemToContainer(schemaIds, newIndexPath, oldIndexPath));
      setSchemas(moveItemToContainer(schemas, newIndexPath, oldIndexPath));
    }
    // 如果都为-1，则说明是容器内部互相移动
    else if (oldIndexPath.length > 1 && newIndexPath.length > 1) {
      setSchemaIds(
        moveContainerItemToOtherContainer(schemaIds, newIndexPath, oldIndexPath),
      );
      setSchemas(
        moveContainerItemToOtherContainer(schemas, newIndexPath, oldIndexPath),
      );
    } else {
      setSchemaIds(arrayMove(schemaIds, oldIndexPath[0], newIndexPath[0]));
      setSchemas(arrayMove(schemas, oldIndexPath[0], newIndexPath[0]));
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    const schemas = getSchemas();
    const schemaIds = getSchemaIds();
    const schema = defaultSchema[active.id];

    if (active.id === over?.id) return;
    console.log(active, over, 'dragend');

    const newId =
      active.data.current?.sortType === 'container'
        ? {
            id: active.id + `-${uuid().slice(0, 8)}`,
            children: [],
          }
        : active.id + `-${uuid().slice(0, 8)}`;

    if (over?.id === 'droppable') {
      if (!schemas.length) {
        const newSchema = cloneDeep(schema) as RenderSchema;
        newSchema.properties.name = typeof newId === 'object' ? newId.id : newId;
        newSchema.id = typeof newId === 'object' ? newId.id : newId;
        schemas.push(newSchema);
        setSchemas(schemas);
        setSchemaIds([newId]);
      }
    } else if (over?.id) {
      if (active.data.current?.properties) {
        handleSortDataChange(schemas, schemaIds, active, over);
      } else {
        if (active.id === 'row' && over.data.current?.sortType === 'rowFormItem')
          return;
        const idPath = getPathById(schemaIds, over.id as string);
        const newSchema = cloneDeep(schema) as RenderSchema;
        newSchema.properties.name = typeof newId === 'object' ? newId.id : newId;
        newSchema.id = typeof newId === 'object' ? newId.id : newId;
        console.log(newId, newSchema, active.id, idPath, 'dragend');

        setSchemaIds(updateSchemaIds(schemaIds, idPath, newId));
        setSchemas(updateSchemas(schemas, idPath, newSchema));
      }
    }
  };

  const onDragStart = (e: DragStartEvent) => {
    console.log(e, 'dragstart');
    setActiveComponent(e.active.data.current?.label);
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={customCollisionDetection}
    >
      <Layout sidebarContent={<SideContent />} headerContent={<HeaderContent />}>
        <MainContent />
      </Layout>
      {createPortal(
        <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
          {activeComponent && <DndOverlay text={activeComponent} />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}

export default App;
