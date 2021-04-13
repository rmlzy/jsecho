import { MetaVo } from "../../metas/vo/meta.vo";

export interface ContentMetaMapVo {
  [key: number]: MetaVo[];
}

export interface ContentPageVo {
  cid: number;
  slug: string;
  title: string;
  excerpt: string;
  authorId: number;
  authorName: string;
  tags: MetaVo[];
  categories: MetaVo[];
  createdAt: string;
  modifiedAt: string;
}

export interface ContentVo extends ContentPageVo {
  text?: string;
  html?: string;
}
