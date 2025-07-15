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
    id: 'row',
    type: 'contsoainer',
  },
  {
    id: 'input',
    type: 'formItem',
  },
  {
    id: 'select',
    type: 'formItem',
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
