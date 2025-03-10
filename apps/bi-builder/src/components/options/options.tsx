import type { ItemConfig, RenderConfig } from 'pb-bi-render';
import './options.less';
import { Collapse } from 'antd';

import { useRendererStore } from '@/store';
import { rearangeGrid } from '@/utils/grid';

import type { FieldCategory } from '../field/constant';
import { FieldItem } from '../field/fieldItem';
import { formatFields, setValueByPath } from '../field/utils';

export type OptionsConfig = ItemConfig & Omit<RenderConfig, 'children'>;

interface OptionsWrapperProps {
  config?: OptionsConfig;
}

const rearrangeKeys = ['row', 'col', 'rowSpan', 'colSpan'];

const OptionsWrapper = ({ config }: OptionsWrapperProps) => {
  const renderConfig = useRendererStore((state) => state.config);
  const getGridArray = useRendererStore((state) => state.getGridArray);
  const setGridArray = useRendererStore((state) => state.setGridArray);
  const setPanelConfig = useRendererStore((state) => state.setPanelConfig);
  const setCharts = useRendererStore((state) => state.setChartsConfig);

  const fieldConfigs = config ? formatFields(config, renderConfig) : {};

  const updateGridArray = (itemConfig: ItemConfig, state: Record<string, number>) => {
    const charts = renderConfig.children;

    if (!itemConfig) return;
    // itemConfig.colSpan = 2;
    // itemConfig.rowSpan = 2;

    const gridArray = getGridArray();
    const originPosition = {
      row: itemConfig.row!,
      col: itemConfig.col!,
      rowSpan: itemConfig.rowSpan || 1,
      colSpan: itemConfig.colSpan || 1,
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
      itemConfig.key,
      renderConfig.colNum || 3,
      originPosition,
    );
    // const gridArray = updateGridArrayWithSpan(
    //   config.children,
    //   getGridArray(),
    //   {
    //     row: itemConfig.row!,
    //     col: itemConfig.col!,
    //     rowSpan: itemConfig.rowSpan || 1,
    //     colSpan: itemConfig.colSpan || 1,
    //   },
    //   id,
    //   { rowSpan: 2, colSpan: 2 },
    // );
    setGridArray(newGridArray);
    setCharts(newCharts);

    // const charts = updateItemConfig(config.children, gridArray);
    // console.log('updated charts', charts);
    // setCharts(charts);
  };

  const onFieldChange = (type: string, key: string, value: any) => {
    console.log('onFieldChange', key, value);
    if (type === 'page' || type === 'page-style') {
      (renderConfig as Record<string, any>)[key] = value;
      setPanelConfig(renderConfig);
    } else {
      const charts = renderConfig.children;
      const index = charts.findIndex(
        (chart) => chart.key === (config as ItemConfig).key,
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

  const onChartFieldChange = (value: any, path: string) => {
    const charts = renderConfig.children;
    const index = charts.findIndex((chart) => chart.key === (config as ItemConfig).key);
    if (index > -1) {
      const newOptions = setValueByPath(value, path, charts[index].chartOptions!);
      charts[index].chartOptions = { ...newOptions };
      setCharts(charts);
    }
  };

  const dispatchChange = (type: string, value: any, item: Record<string, any>) => {
    if (item.keyPath) {
      onChartFieldChange(value, item.keyPath);
    } else {
      onFieldChange(type, item.name, value);
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
                key={child.name || child.keyPath}
                fieldConfig={{
                  type: child.fieldType,
                  props:
                    child.props instanceof Function
                      ? child.props(renderConfig.colNum)
                      : child.props,
                }}
                onChange={(value) => dispatchChange(key, value, child)}
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
