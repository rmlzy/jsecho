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
