import { createContext } from 'react';

export const CallbacksContext = createContext<{
  callbacksRef: React.MutableRefObject<
    Record<string, (value: any, form: any) => void>
  > | null;
  setCallbacks: (fns: Record<string, (value: any, form: any) => void>) => void;
}>({
  callbacksRef: null,
  setCallbacks: () => {
    console.log(1);
  },
});
