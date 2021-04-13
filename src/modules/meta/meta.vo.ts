export interface MetaVo {
  mid: number;
  name: string;
  slug: string;
}

export interface MetaMapVo {
  [key: number]: MetaVo;
}
