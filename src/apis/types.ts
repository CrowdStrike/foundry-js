export type QueryParam = string | number | string[] | number[] | boolean;

export interface BaseUrlParams {
  [key: string]: QueryParam | undefined;
}

export const PLATFORM_EVENTS = {
  READY: 'Ready',
} as const;
