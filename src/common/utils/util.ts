const xss = require('xss');
const dayjs = require('dayjs');
const _ = require('lodash');

export const isNotXss = (text: string) => {
  // @ts-ignore
  const filtered = xss(text);
  return filtered === text;
};

export const isDevelop = () => process.env.NODE_ENV === 'development';

export const getTimestamp = (date?: string) => {
  const d = dayjs(date);
  return d.unix();
};

export const removeEmptyColumns = (obj) => {
  const output = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== '' && value !== undefined) {
      output[key] = value;
    }
  });
  return output;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const optionsToMap = (options) => {
  const output = {};
  options.forEach((option) => {
    output[option.name] = option.value;
  });
  return output;
};

export const paginateToRes = (pageRes) => {
  const { items, meta } = pageRes;
  const { currentPage, itemsPerPage, totalItems } = meta;
  return {
    items,
    total: totalItems,
    pageIndex: currentPage,
    pageSize: itemsPerPage,
  };
};

export const queryToPaginate = (query) => {
  const { pageIndex, pageSize, ...rest } = query;
  return { page: pageIndex, limit: pageSize, ...rest };
};
