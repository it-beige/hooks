import { useRef, useEffect } from 'react';
import useCreation from '../useCreation';

type Subscription<T> = (val: T) => void;

export class EventEmitter<T> {
  private subscriptions = new Set<Subscription<T>>();

  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };

  useSubscription = (callback: Subscription<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const callbackRef = useRef<Subscription<T>>();
    callbackRef.current = callback;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      this.subscriptions.add(subscription);
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  };
}

export default function useEventEmitter<T = void>() {
  return useCreation<EventEmitter<T>>(() => new EventEmitter(), []);
}
