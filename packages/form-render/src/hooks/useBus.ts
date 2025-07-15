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
  const [hidden, setHidden] = useState(false);
  const bus = EventBus.getInstance();
  const { callbacksRef, setCallbacks } = useContext(CallbacksContext);

  if (typeof hiddenConfig !== 'object') return hiddenConfig;

  for (const key in hiddenConfig) {
    const fnKey = `${curName}-${key}-${type}`;
    console.log(fnKey, callbacksRef?.current, 'fnKey');
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

  useEffect(() => {
    return () => {
      if (typeof hiddenConfig !== 'object') return;
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
