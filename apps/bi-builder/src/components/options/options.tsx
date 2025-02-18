import type { ChartConfig, RenderConfig } from '@pb-renders/bi-render';
import './options.less';
import { Collapse } from 'antd';

import { useRendererStore } from '@/store';
import { rearangeGrid } from '@/utils/grid';

import type { FieldCategory } from '../field/constant';
import { FieldItem } from '../field/fieldItem';
import { formatFields } from '../field/utils';

export type OptionsConfig = ChartConfig | Omit<RenderConfig, 'children'>;

interface OptionsWrapperProps {
  config?: ChartConfig | Omit<RenderConfig, 'children'>;
}

const rearrangeKeys = ['row', 'col', 'rowSpan', 'colSpan'];

const OptionsWrapper = ({ config }: OptionsWrapperProps) => {
  const renderConfig = useRendererStore((state) => state.config);
  const getGridArray = useRendererStore((state) => state.getGridArray);
  const setGridArray = useRendererStore((state) => state.setGridArray);
  const setPanelConfig = useRendererStore((state) => state.setPanelConfig);
  const setCharts = useRendererStore((state) => state.setChartsConfig);

  const fieldConfigs = config ? formatFields(config, renderConfig) : {};

  const updateGridArray = (chartConfig: ChartConfig, state: Record<string, number>) => {
    const charts = renderConfig.children;

    if (!chartConfig) return;
    // chartConfig.colSpan = 2;
    // chartConfig.rowSpan = 2;

    const gridArray = getGridArray();
    const originPosition = {
      row: chartConfig.row!,
      col: chartConfig.col!,
      rowSpan: chartConfig.rowSpan || 1,
      colSpan: chartConfig.colSpan || 1,
    };
    const targetPosition = { ...originPosition, ...state };
    console.log(originPosition, targetPosition, 'positions');
    const { colSpan } = targetPosition;

    if (targetPosition.col + colSpan - 1 > gridArray[0].length) {
      targetPosition.col = gridArray[0].length - colSpan + 1;
    }

    const { gridArray: newGridArray, charts: newCharts } = rearangeGrid(
      charts,
      gridArray,
      targetPosition,
      chartConfig.key,
      renderConfig.colNum || 3,
      originPosition,
    );
    // const gridArray = updateGridArrayWithSpan(
    //   config.children,
    //   getGridArray(),
    //   {
    //     row: chartConfig.row!,
    //     col: chartConfig.col!,
    //     rowSpan: chartConfig.rowSpan || 1,
    //     colSpan: chartConfig.colSpan || 1,
    //   },
    //   id,
    //   { rowSpan: 2, colSpan: 2 },
    // );
    setGridArray(newGridArray);
    setCharts(newCharts);

    // const charts = updateChartConfig(config.children, gridArray);
    // console.log('updated charts', charts);
    // setCharts(charts);
  };

  const onFieldChange = (type: string, key: string, value: any) => {
    console.log('onFieldChange', key, value);
    if (type === 'page') {
      (renderConfig as Record<string, any>)[key] = value;
      setPanelConfig(renderConfig);
    } else {
      const charts = renderConfig.children;
      const index = charts.findIndex(
        (chart) => chart.key === (config as ChartConfig).key,
      );
      if (index > -1) {
        if (rearrangeKeys.includes(key)) {
          updateGridArray(charts[index], { [key]: value });
        } else {
          charts[index] = {
            ...charts[index],
            [key]: value,
          };
          setCharts(charts);
        }
      }
    }
  };

  const generateFieldList = (
    fConfigs: Partial<
      Record<
        FieldCategory,
        {
          title: string;
          children: Record<string, any>[];
        }
      >
    >,
  ) => {
    const list: {
      key: string;
      label: string;
      children: React.ReactNode;
      style?: React.CSSProperties;
    }[] = [];
    for (const key in fConfigs) {
      const listItem = {
        key,
        label: fConfigs[key as FieldCategory]!.title,
        children: (
          <div>
            {fConfigs[key as FieldCategory]!.children.map((child) => (
              <FieldItem
                key={child.name}
                fieldConfig={{
                  type: child.fieldType,
                  props:
                    child.props instanceof Function
                      ? child.props(renderConfig.colNum)
                      : child.props,
                }}
                onChange={(value) => onFieldChange(key, child.name, value)}
              />
            ))}
          </div>
        ),
        style: {
          border: 'none',
          borderRadius: '5px',
        },
      };
      list.push(listItem);
    }

    return list;
  };

  const configList = generateFieldList(fieldConfigs);
  console.log(config, configList, fieldConfigs, 'configlist');

  return (
    <div className="options-wrapper">
      <Collapse items={configList} bordered={false} />
    </div>
  );
};

export default OptionsWrapper;
