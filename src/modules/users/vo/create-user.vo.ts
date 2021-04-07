export interface UserVo {
  uid: number;
  screenName: string;
}

export interface UserMapVo {
  [key: number]: UserVo;
}
