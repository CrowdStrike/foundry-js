export type QueryParam = string | number | string[] | number[] | boolean;

export interface BaseUrlParams {
  [key: string]: QueryParam | undefined;
}
