import type { DragSourceHookSpec } from 'react-dnd';
import { useDrag } from 'react-dnd';

interface DragItemProps extends Partial<DragSourceHookSpec<unknown, unknown, unknown>> {
  type: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
const DragItem: React.FC<DragItemProps> = (props: DragItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.type,
    item: props.item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const { children } = props;
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, ...props.style }}>
      {children}
    </div>
  );
};

export default DragItem;
