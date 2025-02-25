import './sideContent.less';
import DragItem from '@/components/dnd/dragItem';

interface ChartDragItemProps {
  children: React.ReactNode;
}
const ChartDragItem = ({ children }: ChartDragItemProps) => {
  return <div className="chart-drag-item">{children}</div>;
};

const data = [
  {
    id: 'bar',
    type: 'chart',
  },
  {
    id: 'line',
    type: 'chart',
  },
  {
    id: 'custom1',
    type: 'custom',
  },
];

const SideContent = () => {
  return (
    <div className="sideContent-drag-wrapper">
      {data.map((item) => (
        <DragItem key={item.id} item={item} type="item">
          <ChartDragItem>{item.id}</ChartDragItem>
        </DragItem>
      ))}
    </div>
  );
};

export default SideContent;
