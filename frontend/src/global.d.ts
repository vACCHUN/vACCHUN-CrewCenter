export {};

declare global {
  interface Window {
    env?: {
      isElectron: boolean;
    };
    electron: {
      openExternal: (url: string) => void;
      onDeepLink: (callback: (url: string) => void) => void;
    };
  }
}
