import { useState, useEffect } from 'react';

import type { WatchHook } from '@/types';
import EventBus from '@/utils/event-bus';

export const useHidden = (hiddenConfig: boolean | WatchHook | undefined) => {
  const [hidden, setHidden] = useState(false);
  const bus = EventBus.getInstance();

  if (typeof hiddenConfig !== 'object') return hiddenConfig;

  for (const key in hiddenConfig) {
    bus.subscribe(key, (value, form) => {
      const result = hiddenConfig[key](value, form);
      console.log(result, 'change in useHidden');
      setHidden(result);
    });
  }
  console.log(bus, 'bus');

  useEffect(() => {
    return () => {
      if (typeof hiddenConfig !== 'object') return;
      for (const key in hiddenConfig) {
        bus.unsubscribe(key);
      }
    };
  }, []);

  return hidden;
};
