import './sideContent.less';
import DragItem from '@/components/dnd/dragItem';

interface ChartDragItemProps {
  children: React.ReactNode;
}
const ChartDragItem = ({ children }: ChartDragItemProps) => {
  return <div className="chart-drag-item">{children}</div>;
};

const SideContent = () => {
  const data = ['bar', 'line', 3, 4, 5];

  return (
    <div className="sideContent-drag-wrapper">
      {data.map((item) => (
        <DragItem key={item} item={{ id: item }} type="item">
          <ChartDragItem>{item}</ChartDragItem>
        </DragItem>
      ))}
    </div>
  );
};

export default SideContent;
