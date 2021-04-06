export type IGroup = 'administrator' | 'editor' | 'contributor' | 'subscriber' | 'visitor';

export interface IJwtPayload {
  uid: number;
  name: string;
  group: IGroup;
}

export interface IResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IPaginate<T> {
  pageIndex: number;
  pageSize: number;
  total: number;
  items: T[];
}

export interface IOptions {
  theme?: string;
  layout?: string;
  title?: string;
  description?: string;
  keywords?: string;
  charset?: string;
  generator?: string;
  pageSize?: string;
  postDateFormat?: string;
}

export interface ICategory {}
