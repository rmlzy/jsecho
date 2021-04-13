import { PageListVo } from "@/modules/content/content.vo";
import { IOptions } from "@/modules/option/option.interface";

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
