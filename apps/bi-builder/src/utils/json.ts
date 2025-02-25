const ignoreKeys = ['customNode', 'customProps'];

export const deepToString = (obj: Record<string, any>): string => {
  if (obj === null || obj === undefined) return String(obj); // 处理 null 或 undefined
  if (typeof obj === 'function') return obj.toString(); // 如果是函数，返回函数的字符串表示

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return `[${obj.map(deepToString).join(', ')}]`; // 递归数组
    } else {
      let result = '{';
      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key) && !ignoreKeys.includes(key)) {
          result += `${JSON.stringify(key)}: ${deepToString(obj[key])}, `;
        }
      }
      if (result.length > 1) {
        result = result.slice(0, -2); // 去掉最后一个多余的逗号和空格
      }
      result += '}';
      return result;
    }
  }

  if (typeof obj === 'string') {
    return JSON.stringify(obj); // 对于字符串，使用 JSON.stringify 进行转义
  }

  return String(obj); // 基本数据类型直接转为字符串
};
