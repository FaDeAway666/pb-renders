import type { FormInstance } from 'antd';
import { useState, useEffect, useContext } from 'react';

import { CallbacksContext } from '@/store';
import type { WatchHook } from '@/types';
import EventBus from '@/utils/event-bus';

export const useBus = (
  hiddenConfig: boolean | WatchHook | undefined,
  curName: string,
  type: string,
) => {
  // 确定初始状态：如果是对象类型，默认为 false；如果是 boolean，使用其值；如果是 undefined，默认为 false
  const initialHidden = hiddenConfig === true ? true : false;

  const [hidden, setHidden] = useState(initialHidden);
  const bus = EventBus.getInstance();
  const { callbacksRef, setCallbacks } = useContext(CallbacksContext);

  // 判断是否为对象类型的配置
  const isObjectConfig = typeof hiddenConfig === 'object';

  // 使用 useEffect 来处理事件订阅，确保 hooks 调用顺序一致
  useEffect(() => {
    // 如果不是对象类型，直接返回，不进行事件订阅
    if (!isObjectConfig) {
      // 判断callbacksRef中是否有curName和Type相关的key，如果有，取消对应的订阅
      if (callbacksRef?.current) {
        for (const key in callbacksRef.current) {
          if (key.includes(curName) && key.includes(type)) {
            const [target] = key.split('-');
            bus.unsubscribe(target);
            delete callbacksRef.current[key];
          }
        }
      }
      return;
    }

    for (const key in hiddenConfig) {
      const fnKey = `${curName}-${key}-${type}`;
      console.log(fnKey, callbacksRef?.current, 'fnKey');
      // 控制不要反复添加事件监听
      if (callbacksRef?.current[fnKey]) continue;

      const fn = (value: any, form: FormInstance) => {
        const result = hiddenConfig[key](value, form);
        console.log(result, 'change in useHidde');
        setHidden(result);
      };
      setCallbacks({
        ...(callbacksRef?.current || {}),
        [fnKey]: fn,
      });
      bus.subscribe(key, fn);
    }

    // 清理函数
    return () => {
      const callbacks = callbacksRef?.current;
      for (const key in hiddenConfig) {
        bus.unsubscribe(key);
        if (callbacks) {
          delete callbacks[`${curName}-${key}-${type}`];
        }
      }
      console.log(callbacks, 'callbacks unsubscribe');
    };
  }, []);

  return hidden;
};
