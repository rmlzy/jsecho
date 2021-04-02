import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getTimestamp } from '../utils';

@Injectable()
export class BaseService<T> {
  constructor(private readonly repo: Repository<T>) {}

  getTimestamp(date) {
    return getTimestamp(date);
  }

  parsePaginateRes(pageRes) {
    const { items, meta } = pageRes;
    const { currentPage, itemsPerPage, totalItems } = meta;
    return {
      items,
      total: totalItems,
      pageIndex: currentPage,
      pageSize: itemsPerPage,
    };
  }

  asset(condition, errorMsg = '参数错误') {
    if (!condition) {
      throw new HttpException(errorMsg, 409);
    }
  }

  async ensureNotExist(where, errorMsg = '资源已存在') {
    const existed = await this.repo.findOne({ where });
    if (existed) {
      throw new HttpException(errorMsg, 409);
    }
  }

  async ensureExist(where, errorMsg = '资源不存在') {
    const existed = await this.repo.findOne({ where });
    if (existed) {
      throw new HttpException(errorMsg, 404);
    }
    return existed;
  }
}
