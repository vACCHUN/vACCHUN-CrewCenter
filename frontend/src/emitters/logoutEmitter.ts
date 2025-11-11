let listeners: Array<(msg?: string) => void> = [];

export const onLogout = (fn: (msg?: string) => void) => {
  listeners.push(fn);
};

export const triggerLogout = (msg?: string) => {
  listeners.forEach((fn) => fn(msg));
};
