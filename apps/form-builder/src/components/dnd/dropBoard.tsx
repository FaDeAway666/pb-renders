import { useDroppable } from '@dnd-kit/core';
import './drop-board.less';
import classNames from 'classnames';

const DropBoard = () => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });
  return (
    <div className="drop-container" ref={setNodeRef}>
      <div className={classNames('empty', { 'is-over': isOver })}>拖拽组件到这里</div>
    </div>
  );
};

export default DropBoard;
