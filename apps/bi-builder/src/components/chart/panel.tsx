import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import type { ChartConfig } from '@pb-renders/bi-render';
import { useMemo } from 'react';

import DragItem from '../dnd/dragItem';
import './panel.less';

interface IPanelProps {
  id: string;
  selectedId: string;
  chartDragging?: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  chartConfig: ChartConfig;
}

const ChartPanel: React.FC<IPanelProps> = (props: IPanelProps) => {
  const { children, id, selectedId, onSelect, chartConfig } = props;
  const isSelected = useMemo(() => id === selectedId, [id, selectedId]);

  const { row, col, rowSpan, colSpan } = chartConfig;
  console.log(chartConfig, 'chartconfig');
  const gridStyle = useMemo(
    () => ({
      gridRow: rowSpan ? `${row} / span ${rowSpan}` : row,
      gridColumn: colSpan ? `${col} / span ${colSpan}` : col,
    }),
    [row, col, rowSpan, colSpan],
  );
  return (
    <DragItem type="chart" item={{ key: id }} style={{ ...gridStyle }}>
      <div
        className={`chart-panel ${isSelected ? 'panel-selected' : ''}`}
        onClick={() => onSelect(id)}
      >
        {isSelected && (
          <div className="icons">
            <CopyOutlined />
            <DeleteOutlined />
          </div>
        )}
        {children}
      </div>
    </DragItem>
  );
};

export default ChartPanel;
