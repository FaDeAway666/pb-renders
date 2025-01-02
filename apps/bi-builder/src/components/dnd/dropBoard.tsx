import { useDrop } from 'react-dnd';
import './drop-board.less';

interface DropBoardProps {
  children: React.ReactNode;
  onDrop?: (offset: { x: number; y: number }, item: unknown) => void;
  dragging?: (offset: { x: number; y: number }, item: unknown) => void;
}

const DropBoard = ({ children, onDrop, dragging }: DropBoardProps) => {
  const [states, dropRef] = useDrop(() => {
    return {
      accept: ['item', 'chart'],
      canDrop: (item, monitor) => {
        if (monitor.isOver()) {
          dragging?.(monitor.getClientOffset()!, item);
        }
        return true;
      },
      drop: (item, monitor) => {
        console.log(
          'Dropped item:',
          item,
          monitor.getItem(),
          monitor.getClientOffset(),
          monitor.getInitialClientOffset(),
        );
        onDrop?.(monitor.getClientOffset()!, item);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        data: monitor.getItem(),
        canDrop: monitor.canDrop(),
      }),
    };
  });
  return (
    <div className="drop-container" ref={dropRef}>
      {children}
    </div>
  );
};

export default DropBoard;
