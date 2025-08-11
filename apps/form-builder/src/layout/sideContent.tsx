import './sideContent.less';
import { DragItem } from '@/components/dnd/drag-item';

interface ChartDragItemProps {
  children: React.ReactNode;
}
const ChartDragItem = ({ children }: ChartDragItemProps) => {
  return <div className="chart-drag-item">{children}</div>;
};

const data = [
  {
    id: 'row',
    type: 'container',
    label: '行容器',
  },
  {
    id: 'input',
    type: 'formItem',
    label: '输入框',
  },
  {
    id: 'select',
    type: 'formItem',
    label: '下拉框',
  },
  {
    id: 'password',
    type: 'formItem',
    label: '密码框',
  },
  {
    id: 'textarea',
    type: 'formItem',
    label: '文本域',
  },
];

const SideContent = () => {
  return (
    <div className="sideContent-drag-wrapper">
      {data.map((item) => (
        <DragItem
          key={item.id}
          id={item.id}
          data={{
            sortType: item.type,
            label: item.label,
          }}
        >
          <ChartDragItem>{item.label}</ChartDragItem>
        </DragItem>
      ))}
    </div>
  );
};

export default SideContent;
