import { ICategory } from '../../../common';

export interface IContent {
  title: string;
  slug: string;
  excerpt: string;
  categories: ICategory[];
  tags: string[];
  createdAt: string;
  modifiedAt: string;
  authorId: number;
  authorName: string;
}

export interface IPaginate<T> {
  maxPage: number;
  pageIndex: number;
  posts: T[];
}
