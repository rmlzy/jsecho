export type IGroup =
  | 'administrator'
  | 'editor'
  | 'contributor'
  | 'subscriber'
  | 'visitor';

export interface IJwtPayload {
  uid: number;
  name: string;
  group: IGroup;
}

export interface IPaginateResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
