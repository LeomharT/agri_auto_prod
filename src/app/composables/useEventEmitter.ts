const events: Record<string, ((...args: any) => void)[]> = {};

export default function useEventEmitter() {
  function on(event: string, listener: (...args: any) => void) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(listener);
  }

  function off(event: string, listener: (...args: any) => void) {
    if (!events[event]) return;

    const index = events[event].findIndex((fn) => fn === listener);

    if (index !== -1) {
      events[event].splice(index, 1);
    }
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
