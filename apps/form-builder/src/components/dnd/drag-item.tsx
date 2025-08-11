import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import type { PointerActivationConstraint } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Col, Row, Space } from 'antd';
import type { FormInstance } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import { renderFormItem } from 'pb-form-render';
import type { RowSchema } from 'pb-form-render/dist/typing/types';
import React, { cloneElement, useEffect, useState } from 'react';

import { useRendererStore } from '@/store';
import { getPathById, deleteIdByPath, updateSchemas } from '@/utils/schema';
import './drag-item.less';

export type ContainerID = { id: string; children: string[] };

export function DragItem(props: {
  id: string;
  data: Record<string, any>;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
    data: props.data,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

export const RowDropItem = (props: { isOver?: boolean }) => {
  return (
    <div className={classNames('row-drop-item', { 'is-over': props.isOver })}>
      <div className="title">行容器</div>
      {props.isOver}
      <div className="desc">拖拽组件到这里</div>
    </div>
  );
};

export const DragTool = () => {
  const { detectingId, activeId } = useRendererStore();

  const [rect, setRect] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
  });
  const setDectectingRect = debounce((id: string) => {
    const ele = document.querySelector(`[data-component-id="${id}"]`);
    const boundingRect = ele?.getBoundingClientRect();
    const containerRect = document
      .querySelector('.content-container')
      ?.getBoundingClientRect();
    const newRect = {
      top: (boundingRect?.top || 0) - (containerRect?.top || 0),
      left: (boundingRect?.left || 0) - (containerRect?.left || 0),
      width: boundingRect?.width || 0,
      height: boundingRect?.height || 0,
      x: containerRect?.x || 0,
      y: containerRect?.y || 0,
    };
    setRect(newRect);
  }, 20);
  useEffect(() => {
    setDectectingRect(detectingId);
  }, [detectingId]);

  return (
    detectingId &&
    detectingId !== activeId && (
      <div
        style={{
          position: 'absolute',
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
          transform: `translate(${rect.x}px, ${rect.y}px)`,
          border: '1px solid red',
          zIndex: 0,
        }}
      ></div>
    )
  );
};

const BtnBar = ({ id }: { id: string }) => {
  const { getSchemas, getSchemaIds, setSchemaIds, setSchemas } = useRendererStore();

  const onDelete = () => {
    const schemaIds = getSchemaIds();
    const schemas = getSchemas();
    const idPath = getPathById(schemaIds, id);
    setSchemaIds(deleteIdByPath(schemaIds, idPath));
    setSchemas(updateSchemas(schemas, idPath));
  };
  return (
    <div className="active-tool-box">
      <div className="btn-wrapper">
        <Space>
          <div
            role="button"
            className="active-tool-btn"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={() => console.log('copy')}
          >
            <CopyOutlined />
          </div>
          <div
            role="button"
            className="active-tool-btn"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={() => {
              onDelete();
            }}
          >
            <DeleteOutlined />
          </div>
        </Space>
      </div>
    </div>
  );
};

export const SortableItem = ({
  id,
  data,
  children,
}: {
  id: string;
  data: Record<string, any>;
  children: React.ReactElement;
  activationConstraint?: PointerActivationConstraint;
}) => {
  // console.log(id, data, 'sortid');
  const { over, transform, attributes, listeners, isDragging, isOver, setNodeRef } =
    useSortable({
      id,
      data,
    });
  const { activeId, setIsDragging } = useRendererStore();
  // console.log(id, 'render sortitem');
  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging]);

  const deactiveElement = (
    <div
      ref={setNodeRef}
      {...attributes}
      className={data.sortType === 'container' ? 'sortable-row-item' : 'sortable-item'}
      data-component-id={id}
      style={
        {
          opacity: isDragging ? 0.3 : 1,
          border: activeId === id ? '2px solid blue' : 'none',
        } as React.CSSProperties
      }
    ></div>
  );

  const newProps =
    activeId === id
      ? {
          ...listeners,
        }
      : {};

  const wrapperChildren = () => {
    switch (data.type) {
      case 'row': {
        if (data.children.length) {
          return children;
        } else {
          return <RowDropItem isOver={isOver} />;
        }
      }
      default:
        return children;
    }
  };

  const element = cloneElement(
    deactiveElement,
    newProps,
    <>
      <div
        className={data.sortType === 'container' ? 'row-item-mask' : 'sort-item-mask'}
      >
        {isOver && <div className="sortable-over-indicator"></div>}
        {wrapperChildren()}
      </div>
      {activeId === id && <BtnBar id={id} />}
    </>,
  );
  return element;
};

export const SortableRowItem = (props: {
  id: string;
  data: RowSchema & { sortType: string };
  form: FormInstance;
}) => {
  const { id, data, form } = props;
  const schemaIds = useRendererStore((state) => state.schemaIds);

  const [rowIds, setRowIds] = useState<string[]>(
    (schemaIds.find((item) => (item as ContainerID).id === id) as ContainerID)
      .children || [],
  );
  console.log(rowIds, 'rowIds');

  useEffect(() => {
    setRowIds(
      (schemaIds.find((item) => (item as ContainerID).id === id) as ContainerID)
        .children || [],
    );
  }, [schemaIds]);
  return (
    <SortableItem id={id} data={data}>
      <SortableContext items={rowIds}>
        <Row {...data.properties}>
          {rowIds.map((rowId, index) => (
            <Col span={24 / data.properties.colNum} key={rowId}>
              <SortableItem
                key={rowId}
                id={rowId}
                data={{ ...data.children[index], sortType: 'rowFormItem' }}
              >
                {renderFormItem({ schema: data.children[index], form })}
              </SortableItem>
            </Col>
          ))}
        </Row>
      </SortableContext>
    </SortableItem>
  );
};
