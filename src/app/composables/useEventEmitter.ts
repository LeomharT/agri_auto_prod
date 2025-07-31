const events: Record<string, ((...args: any) => void)[]> = {};

export default function useEventEmitter() {
  function on(event: string, listener: (...args: any) => void) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  }

  function off(event: string) {
    if (!events[event]) return;

    delete events[event];
  }

  function trigger(event: string, ...args: any) {
    if (!events[event]) return;

    events[event].forEach((listener) => listener(...args));
  }

  return {
    on,
    off,
    trigger,
  };
}
