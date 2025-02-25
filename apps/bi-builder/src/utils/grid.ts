import type { ItemConfig } from '@pb-renders/bi-render';

/**
 * 根据指针位置获取当前指针的grid位置
 * 新增colSpan，rowSpan的情况
 * @param position 距离panel左上角的位置
 * @param colWidth
 * @param rowHeight
 */
export const getGridLayout = (
  position: { x: number; y: number },
  colWidth: number,
  rowHeight: number,
  span?: { colSpan: number; rowSpan: number },
  colNum?: number,
) => {
  const colMax = colNum || 3 - (span?.colSpan || 1) + 1;
  const colIndex = Math.floor(position.x / colWidth) + 1;
  return {
    col: colIndex <= colMax ? colIndex : colMax,
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

const extendGridArray = (gridArray: (string | null)[][], addRowNum: number) => {
  const newRows = Array.from({ length: addRowNum }, () =>
    Array(gridArray[0].length).fill(null),
  );
  const newGridArray = [...gridArray, ...newRows];
  return newGridArray;
};

const fillGridArray = (
  gridArray: (string | null)[][],
  col: number,
  row: number,
  key: string,
  colSpan?: number,
  rowSpan?: number,
) => {
  rowSpan = rowSpan || 1;
  colSpan = colSpan || 1;
  for (let i = row; i < row + rowSpan; i++) {
    for (let j = col; j < col + colSpan; j++) {
      let newKey = key;
      if (rowSpan > 1 || colSpan > 1) {
        const suffix = `#${row - 1},${col - 1},${rowSpan},${colSpan}`;
        newKey += suffix;
      }
      gridArray[i - 1][j - 1] = newKey;
    }
  }
};

const checkArea = (
  gridArray: (string | null)[][],
  targetArray: (string | null)[][],
  rowStart: number,
  colStart: number,
  visited: Record<string, number>,
): { row: number; col: number } | false => {
  let isFree = true;
  const tarRow = targetArray.length;
  const tarCol = targetArray[0].length;

  if (
    rowStart < 0 ||
    colStart < 0 ||
    rowStart + tarRow > gridArray.length ||
    colStart + tarCol > gridArray[0].length ||
    visited[rowStart]
  ) {
    return false;
  }

  for (let i = 0; i < tarRow; i++) {
    for (let j = 0; j < tarCol; j++) {
      if (
        targetArray[i][j] !== null &&
        gridArray[rowStart + i][colStart + j] !== null
      ) {
        isFree = false;
        break;
      }
    }
  }

  if (isFree) {
    return {
      row: rowStart,
      col: colStart,
    };
  }

  visited[rowStart] = 1;

  const top = checkArea(gridArray, targetArray, rowStart - 1, colStart, visited);
  if (top) return top;

  // if (rowStart > originRow) return false;
  // const bottom = checkArea(
  //   gridArray,
  //   targetArray,
  //   rowStart + 1,
  //   colStart,
  //   visited,
  //   originRow,
  // );
  // if (bottom) return bottom;
  return false;
};

// 找到能够容纳被占位区域的空余位置
const findNearestFreeArea = (
  gridArray: (string | null)[][],
  targetArray: (string | null)[][],
  rowStart: number,
  colStart: number,
  rowSpan: number,
  colSpan: number,
): { row: number; col: number } | false => {
  // 寻找最近的没有被占用的区域、优先级为上，左，右，下
  const visited: Record<string, number> = {};
  const cloneGrid = gridArray.map((item) => [...item]);

  // 标记目标区域为不可用
  for (let i = rowStart; i < rowStart + rowSpan; i++) {
    for (let j = colStart; j < colStart + colSpan; j++) {
      cloneGrid[i][j] = 'no';
    }
  }

  const result = checkArea(cloneGrid, targetArray, rowStart, colStart, visited);
  return result;

  // const top = findNearestFreeArea(gridArray, targetArray, rowStart - 1, colStart,);
  // if (top) return top;
  // const left =findNearestFreeArea(gridArray, targetArray, rowStart, colStart - 1);
  // if (left) return left;
  // const right = findNearestFreeArea(gridArray, targetArray, rowStart, colStart + 1);
  // if (right) return right;
  // const bottom = findNearestFreeArea(gridArray, targetArray, rowStart + 1, colStart);
  // if (bottom) return bottom;

  // return false;
};

// 创建target位置下的临时数组
const createMutedArray = (
  gridArray: (string | null)[][],
  rowStart: number,
  colStart: number,
  rowSpan: number,
  colSpan: number,
): (string | null)[][] => {
  const array = Array.from({ length: rowSpan }, () => Array(colSpan).fill(null));
  const tempArray = Array(rowSpan).fill(0);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[0].length; j++) {
      array[i][j] = gridArray[i + rowStart][j + colStart];
    }
    if (array[i].some((item) => item !== null)) {
      tempArray[i] = 1;
    }
  }

  // 如果是类似[[NULL,NULL],[KEY1,KEY2]]这种结构，需要删掉第一行全为null的数组
  if (tempArray.every((item) => item === 0)) {
    return array;
  } else {
    for (let k = 0; k < tempArray.length; k++) {
      if (tempArray[k] === 0) {
        array.splice(k, 1);
      } else if (tempArray[k] === 1) break;
    }
    return array;
  }
};

// 计算实际下移的距离
const getDownDistance = (
  gridArray: (string | null)[][],
  targetPosition: { col: number; row: number; colSpan?: number; rowSpan?: number },
) => {
  const { col, row, colSpan = 1, rowSpan = 1 } = targetPosition;
  const mutedArray = createMutedArray(gridArray, row - 1, col - 1, rowSpan, colSpan);
  let dis = 1;
  const set = new Set();
  for (let i = 0; i < mutedArray.length; i++) {
    for (let j = 0; j < mutedArray[0].length; j++) {
      if (mutedArray[i][j]?.includes('#')) {
        if (set.has(mutedArray[i][j])) continue;
        set.add(mutedArray[i][j]);
        const [, suffix] = mutedArray[i][j]!.split('#');
        const [rowStart] = suffix.split(',');
        dis = Math.max(dis, row + rowSpan - parseInt(rowStart) - 1);
      } else if (mutedArray[i][j]) {
        dis = Math.max(dis, row + rowSpan - 1 - (row - 1 + i));
      }
    }
  }
  return dis;
};

const rebuildGridArray = (charts: ItemConfig[], colNum: number) => {
  const configs = charts.toSorted((a, b) => (a.row || 1) - (b.row || 1));
  let array = [Array(colNum).fill(null)];

  for (const config of configs) {
    const { key, row, col, rowSpan = 1, colSpan = 1 } = config;

    if (array[row! + rowSpan - 1] === undefined) {
      array = array.concat(
        Array.from({ length: row! + rowSpan - array.length }, () =>
          Array(colNum).fill(null),
        ),
      );
    }
    const newKey =
      rowSpan > 1 || colSpan > 1
        ? `${key}#${row! - 1},${col! - 1},${rowSpan},${colSpan}`
        : key;
    for (let i = 0; i < rowSpan; i++) {
      for (let j = 0; j < colSpan; j++) {
        array[row! - 1 + i][col! - 1 + j] = newKey;
      }
    }
    // array[row! - 1][col! - 1] = newKey;
  }

  return array;
};

// 当grid需要进行扩展时，更新grid
const udpateChartsWhileMute = (
  charts: ItemConfig[],
  gridArray: (string | null)[][],
  targetPosition: { col: number; row: number; colSpan?: number; rowSpan?: number },
  realDis?: number,
  set?: Set<string>,
): ItemConfig[] => {
  const { col, row, colSpan = 1, rowSpan = 1 } = targetPosition;
  const tempArray: any[][] = gridArray.map((item) => [...item]);
  set = set || new Set<string>();

  realDis = realDis || getDownDistance(gridArray, targetPosition);
  console.log('mute');
  for (let i = row - 1; i < gridArray.length; i++) {
    for (let j = col - 1; j < col + colSpan - 1; j++) {
      if (tempArray[i][j] === null) continue;
      let config: ItemConfig | undefined;
      if (tempArray[i][j]?.includes('#')) {
        if (set.has(tempArray[i][j])) continue;
        set.add(tempArray[i][j]);
        const [key, suffix] = tempArray[i][j].split('#');
        let [rowStart, colStart] = suffix.split(',');
        rowStart = Number(rowStart);
        colStart = Number(colStart);
        config = charts.find((item) => item.key === key);
        const tColSpan = config?.colSpan || 1;
        // const dis = row - parseInt(rowStart) + rowSpan - 1;

        for (let m = rowStart; m < gridArray.length; m++) {
          for (let n = colStart; n < colStart + tColSpan; n++) {
            // if (m >= tRowSpan) break;
            // if (m < rowStart + realDis) gridArray[m][n] = null;
            if (n < col - 1 || n >= col + colSpan - 1) {
              if (tempArray[m][n]?.includes('#')) {
                udpateChartsWhileMute(
                  charts,
                  gridArray,
                  {
                    row: m + 1,
                    col: n + 1,
                    rowSpan: realDis,
                  },
                  realDis,
                  set,
                );
              }
              // else {
              //   gridArray[m + realDis][n] = tempArray[m][n];
              // }
            }
            // gridArray[m + realDis][n] = `${key}/${tRowSpan}/${tColSpan}#${
            //   parseInt(rowStart) + realDis
            // },${colStart}`;
          }
        }
      } else {
        config = charts.find((item) => item.key === tempArray[i][j]);
      }
      // else if (tempArray[i][j]) {
      //   // gridArray[i + realDis][j] = tempArray[i][j];
      //   // gridArray[i][j] = null;
      // }
      if (config) {
        config.row = config.row! + realDis;
      }
    }
  }

  console.log(charts, 'charts------');
  return charts;
};

const getRealTargetArray = (
  mutedArray: (string | null)[][],
  rowStart: number,
  colStart: number,
) => {
  const tempArray: any[] = [];
  const set = new Set<string>();
  for (let i = 0; i < mutedArray.length; i++) {
    for (let j = 0; j < mutedArray[i].length; j++) {
      if (mutedArray[i][j]?.includes('#')) {
        if (set.has(mutedArray[i][j]!)) {
          continue;
        }
        set.add(mutedArray[i][j]!);
        const [, suffix] = mutedArray[i][j]!.split('#');
        const [tRowStart, tColStart, tRowSpan, tColSpan] = suffix.split(',');

        tempArray.push({
          rowStart: Number(tRowStart),
          colStart: Number(tColStart),
          array: Array.from({ length: Number(tRowSpan) }, () =>
            Array(Number(tColSpan)).fill(mutedArray[i][j]),
          ),
        });
      } else {
        tempArray.push({
          rowStart: rowStart + i,
          colStart: colStart + j,
          array: [[mutedArray[i][j]]],
        });
      }
    }
  }

  tempArray.sort((a, b) => a.rowStart - b.rowStart);
  const topRowStart = tempArray[0].rowStart;
  const rowEnd = tempArray.at(-1).rowStart + tempArray.at(-1).array.length;
  tempArray.sort((a, b) => a.colStart - b.colStart);
  const leftColStart = tempArray[0].colStart;
  const colEnd = tempArray.at(-1).colStart + tempArray.at(-1).array[0].length;
  const colNum = colEnd - leftColStart;
  const result = Array.from({ length: rowEnd - topRowStart }, () =>
    Array(colNum).fill(null),
  );

  for (const temp of tempArray) {
    for (let i = 0; i < temp.array.length; i++) {
      for (let j = 0; j < temp.array[i].length; j++) {
        result[temp.rowStart - topRowStart + i][temp.colStart - leftColStart + j] =
          temp.array[i][j];
      }
    }
  }
  console.log(result, 'realtarget array');
  return result;
  // const;

  // const rowLen;
};

export const rearangeGrid = (
  charts: ItemConfig[],
  gridArray: (string | null)[][],
  targetPosition: { col: number; row: number; colSpan?: number; rowSpan?: number },
  key: string,
  colNum: number,
  sourcePosition?: { col: number; row: number; colSpan?: number; rowSpan?: number },
) => {
  console.log('rearange');
  // 先修改被移动的chartConfig
  const chart = charts.find((chart) => chart.key === key);
  const { row, col, rowSpan = 1, colSpan = 1 } = targetPosition;
  chart!.row = row;
  chart!.col = col;
  chart!.rowSpan = rowSpan;
  chart!.colSpan = colSpan;
  // 如果是原位置移动的重排，则先清空原位置
  if (sourcePosition) {
    const { colSpan: sColSpan, rowSpan: sRowSpan, row, col } = sourcePosition;
    for (let i = row; i < row + (sRowSpan || 1); i++) {
      for (let j = col; j < col + (sColSpan || 1); j++) {
        gridArray[i - 1][j - 1] = null;
      }
    }
  }

  if (row + rowSpan - 1 > gridArray.length) {
    const newGridArray = extendGridArray(
      gridArray,
      row + rowSpan - 1 - gridArray.length,
    );
    gridArray = newGridArray;
  }

  let targetArray = createMutedArray(gridArray, row - 1, col - 1, rowSpan, colSpan);

  if (targetArray.some((item) => item.some((c) => c?.includes('#')))) {
    targetArray = getRealTargetArray(targetArray, row - 1, col - 1);
  }
  const area = findNearestFreeArea(
    gridArray,
    targetArray,
    row - 1,
    col - 1,
    rowSpan,
    colSpan,
  );

  if (area) {
    const set = new Set<string>();
    for (let i = 0; i < targetArray.length; i++) {
      for (let j = 0; j < targetArray[i].length; j++) {
        const newKey = targetArray[i][j];
        if (!newKey) continue;
        // if (newKey?.includes('#')) {
        //   const [info, suffix] = newKey.split('#');
        //   const [nRowStart, nColStart, nRowSpan, nColSpan] = suffix
        //     .split(',')
        //     .map(Number);
        //   newKey = `${info}#${area.row + i},${area.col + j},${nRowSpan},${nColSpan}`;
        //   gridArray[i + nRowStart][j + nColStart] = null;
        // }
        // gridArray[i + area.row][j + area.col] = newKey;
        if (set.has(newKey)) continue;
        set.add(newKey);
        const [info] = newKey.split('#');
        const oldChart = charts.find((chart) => chart.key === info);
        if (oldChart) {
          oldChart.row = area.row + i + 1;
          oldChart.col = area.col + j + 1;
        }
      }
    }
    gridArray = rebuildGridArray(charts, colNum);
    // fillGridArray(gridArray, col, row, key, colSpan, rowSpan);
  } else {
    // 这里应该是原grid在row, col位置下的所有元素向下移动rowSpan行
    // 需要考虑这个位置下的元素存在span的情况，如果存在span，需要当前整行遍历并移动对应key
    // const newGridArray = extendGridArray(gridArray, gridArray.length + rowSpan);
    charts = udpateChartsWhileMute(charts, gridArray, targetPosition);
    // const tempArray = newGridArray.map((item) => [...item]);
    // for (let i = row - 1 + rowSpan; i < newGridArray.length; i++) {
    //   for (let j = col - 1; j < col - 1 + colSpan; j++) {
    //     newGridArray[i][j] = tempArray[i - rowSpan][j];
    //   }
    // }
    gridArray = rebuildGridArray(charts, colNum);
    // console.log(newGridArray, 'update while mute array');
    // fillGridArray(gridArray, col, row, key, colSpan, rowSpan);
  }
  // 如果新增了不必要的行，把他移除掉
  for (let r = gridArray.length - 1; r >= 0; r--) {
    if (gridArray[r].every((item) => !item)) {
      gridArray.pop();
    } else {
      break;
    }
  }

  return {
    charts,
    gridArray,
  };

  // if (!gridArray[row - 1][col - 1]) {
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // } else if (gridArray[row - 2] !== undefined && !gridArray[row - 2][col - 1]) {
  //   gridArray[row - 2][col - 1] = gridArray[row - 1][col - 1];
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // } else if (
  //   gridArray[row - 1][col - 2] !== undefined &&
  //   !gridArray[row - 1][col - 2]
  // ) {
  //   gridArray[row - 1][col - 2] = gridArray[row - 1][col - 1];
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // } else if (gridArray[row - 1][col] !== undefined && !gridArray[row - 1][col]) {
  //   gridArray[row - 1][col] = gridArray[row - 1][col - 1];
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // } else if (gridArray[row] !== undefined && !gridArray[row][col - 1]) {
  //   gridArray[row][col - 1] = gridArray[row - 1][col - 1];
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // } else {
  //   // 向下移动
  //   const tempArray = gridArray.map((item) => [...item]);
  //   for (let i = row; i < tempArray.length + 1; i++) {
  //     if (gridArray[i]) {
  //       gridArray[i][col - 1] = tempArray[i - 1][col - 1];
  //     } else {
  //       const newRows = [Array(tempArray[0].length).fill(null)];
  //       gridArray = [...gridArray, ...newRows];
  //       gridArray[i][col - 1] = tempArray[i - 1][col - 1];
  //     }
  //   }
  //   gridArray[row - 1][col - 1] = key;
  //   return gridArray;
  // }
};

export const updateItemConfig = (
  chartOptions: ItemConfig[],
  gridArray: (string | null)[][],
) => {
  const map = new Map<string, number>();

  for (let i = 0; i < gridArray.length; i++) {
    for (let j = 0; j < gridArray[i].length; j++) {
      if (gridArray[i][j]) {
        if (!map.has(gridArray[i][j] as string)) {
          map.set(gridArray[i][j] as string, 1);

          const [key, rowSpan, colSpan] = gridArray[i][j]!.split('#')[0].split('/');
          const index = chartOptions.findIndex((item) => item.key === key);
          if (index !== -1) {
            chartOptions[index].row = i + 1;
            chartOptions[index].col = j + 1;
            chartOptions[index].rowSpan = Number(rowSpan);
            chartOptions[index].colSpan = Number(colSpan);
          }
        }
      }
    }
  }
  return chartOptions;
};

export const updateGridArrayWithSpan = (
  charts: ItemConfig[],
  gridArray: (string | null)[][],
  originPosition: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  },
  key: string,
  newSpan: { rowSpan: number; colSpan: number },
) => {
  // 先清除掉需要变化span的原始位置，并用其他位置的值填充后，再用新的位置属性走rearange流程
  const targetPosition = { ...originPosition };
  const { colSpan, rowSpan } = newSpan;

  if (originPosition.col + colSpan - 1 > gridArray[0].length) {
    targetPosition.col = gridArray[0].length - colSpan + 1;
  }
  targetPosition.rowSpan = rowSpan;
  targetPosition.colSpan = colSpan;

  console.log('update span');

  // 移除原位置的值
  // for (let i = originPosition.row - 1; i < originPosition.row + rowSpan - 1; i++) {
  //   for (let j = originPosition.col; j < originPosition.col + colSpan - 1; j++) {
  //     gridArray[i][j] = null
  //   }
  // }

  // 将原位置下方的所有值覆盖原位置
  // const tempArray = gridArray.map((item) => [...item]);
  // const { col: oCol, row: oRow, colSpan: oColSpan, rowSpan: oRowSpan } = originPosition;
  // for (let i = oRow - 1; i < oRow + oRowSpan - 1; i++) {
  //   for (let j = oCol - 1; j < oCol + oColSpan - 1; j++) {
  //     // 如果原位置下方没有值，则把原位置清理掉
  //     if (tempArray[i + oRowSpan]) {
  //       gridArray[i][j] = tempArray[i + oRowSpan][j];
  //       gridArray[i + oRowSpan][j] = null;
  //     } else {
  //       gridArray[i][j] = null; // 清掉移动过的位置的值
  //     }
  //   }
  // }

  // const newGridArray = rearangeGrid(
  //   charts,
  //   gridArray,
  //   targetPosition,
  //   key,
  //   originPosition,
  // );
  // console.log(newGridArray, 'updated');

  // return newGridArray;
};
