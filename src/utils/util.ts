const xss = require('xss');
const dayjs = require('dayjs');

export const isXss = (text: string) => {
  const filtered = xss(text);
  return filtered !== text;
};

export const isDevelop = () => process.env.NODE_ENV === 'development';

export const getEnvFilePath = () => {
  let filePath = '.env.development';
  if (process.env.NODE_ENV === 'development') {
    filePath = '.env.development';
  }
  if (process.env.NODE_ENV === 'production') {
    filePath = '.env.production';
  }
  return filePath;
};

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
