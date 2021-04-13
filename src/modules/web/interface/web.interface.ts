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
