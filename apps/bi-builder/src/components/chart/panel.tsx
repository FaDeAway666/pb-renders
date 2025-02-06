import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import type { ChartConfig } from '@pb-renders/bi-render';
import { useMemo } from 'react';

import DragItem from '../dnd/dragItem';
import './panel.less';

interface IPanelProps {
  id: string;
  selectedId: string;
  chartDragging?: boolean;
  children: React.ReactNode;
  chartConfig: ChartConfig;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: (id: string) => void;
}

const ChartPanel: React.FC<IPanelProps> = (props: IPanelProps) => {
  const { children, id, selectedId, onSelect, onCopy, onDelete, chartConfig } = props;
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
        onMouseDown={() => onSelect(id)}
      >
        {isSelected && (
          <div className="icons">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onCopy?.(id);
              }}
            >
              <CopyOutlined />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
            >
              <DeleteOutlined />
            </div>
          </div>
        )}
        {children}
      </div>
    </DragItem>
  );
};

export default ChartPanel;
