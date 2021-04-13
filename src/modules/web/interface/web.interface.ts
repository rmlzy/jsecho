import { PageListVo } from "@/modules/contents/vo/content.vo";
import { IOptions } from "@/modules/options/interface/option.interface";

export interface IContent {
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IPaginate<T> {
  hasPrevPage: boolean;
  hasNextPage: boolean;
  posts: T[];
}

export interface ISharedVars extends IOptions {
  pages?: PageListVo;
}
