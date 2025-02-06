import type { ChartConfig } from '@pb-renders/bi-render';

/**
 * 根据指针位置获取当前指针的grid位置
 * @param position 距离panel左上角的位置
 * @param colWidth
 * @param rowHeight
 */
export const getGridLayout = (
  position: { x: number; y: number },
  colWidth: number,
  rowHeight: number,
) => {
  return {
    col: Math.floor(position.x / colWidth) + 1,
    row: Math.floor(position.y / rowHeight) + 1,
  };
};

// 初始化grid对应的位置数组
export const initGridArray = (
  colNum: number,
  col: number,
  row: number,
  key: string,
): (string | null)[][] => {
  const arr = Array.from({ length: row }, () => Array(colNum).fill(null));
  arr[row - 1][col - 1] = key;
  return arr;
};

export const rearangeGrid = (
  gridArray: (string | null)[][],
  targetPosition: { col: number; row: number },
  key: string,
  sourcePosition?: { col: number; row: number },
) => {
  // 当前位置即将被占用，寻找grid数组中最近的一个为0的位置，优先级为上，左，右，下
  // 如果上下左右都没有空位置，则当前一列位于目标位置下面的所有item向下移动一格
  console.log('rearange');
  if (sourcePosition) {
    gridArray[sourcePosition.row - 1][sourcePosition.col - 1] = null;
  }

  const { row, col } = targetPosition;
  if (row > gridArray.length) {
    const newRows = Array.from({ length: row - gridArray.length }, () =>
      Array(gridArray[0].length).fill(null),
    );
    const newGridArray = [...gridArray, ...newRows];
    newGridArray[row - 1][col - 1] = key;
    return newGridArray;
  }

  if (!gridArray[row - 1][col - 1]) {
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  } else if (gridArray[row - 2] !== undefined && !gridArray[row - 2][col - 1]) {
    gridArray[row - 2][col - 1] = gridArray[row - 1][col - 1];
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  } else if (
    gridArray[row - 1][col - 2] !== undefined &&
    !gridArray[row - 1][col - 2]
  ) {
    gridArray[row - 1][col - 2] = gridArray[row - 1][col - 1];
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  } else if (gridArray[row - 1][col] !== undefined && !gridArray[row - 1][col]) {
    gridArray[row - 1][col] = gridArray[row - 1][col - 1];
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  } else if (gridArray[row] !== undefined && !gridArray[row][col - 1]) {
    gridArray[row][col - 1] = gridArray[row - 1][col - 1];
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  } else {
    // 向下移动
    const tempArray = gridArray.map((item) => [...item]);
    for (let i = row; i < tempArray.length + 1; i++) {
      if (gridArray[i]) {
        gridArray[i][col - 1] = tempArray[i - 1][col - 1];
      } else {
        const newRows = [Array(tempArray[0].length).fill(null)];
        gridArray = [...gridArray, ...newRows];
        gridArray[i][col - 1] = tempArray[i - 1][col - 1];
      }
    }
    gridArray[row - 1][col - 1] = key;
    return gridArray;
  }
};

export const updateChartConfig = (
  chartOptions: ChartConfig[],
  gridArray: (string | null)[][],
) => {
  const map = new Map<string, number>();

  for (let i = 0; i < gridArray.length; i++) {
    for (let j = 0; j < gridArray[i].length; j++) {
      if (gridArray[i][j]) {
        if (!map.has(gridArray[i][j] as string)) {
          map.set(gridArray[i][j] as string, 1);

          const index = chartOptions.findIndex((item) => item.key === gridArray[i][j]);
          if (index !== -1) {
            chartOptions[index].row = i + 1;
            chartOptions[index].col = j + 1;
          }
        }
      } else {
        continue;
      }
    }
  }
  return chartOptions;
};
