import { FastifyReply } from 'fastify';

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

export interface Reply {
  view(page: string, data?: object): FastifyReply;
  locals?: object;
}
