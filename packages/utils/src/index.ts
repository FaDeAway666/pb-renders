export * from './registry';

// 防抖函数
export function debounce(fn: (...args: any[]) => void, wait: number) {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

// 节流函数
export function throttle(fn: (...args: any[]) => void, wait: number) {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn(...args);
        timeout = null;
      }, wait);
    }
  };
}
