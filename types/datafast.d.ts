export {};

declare global {
  interface Window {
    datafast?: ((...args: unknown[]) => void) & {
      q?: unknown[][];
    };
  }
}
