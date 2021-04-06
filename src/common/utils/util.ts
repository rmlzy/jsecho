const xss = require('xss');
const dayjs = require('dayjs');
const _ = require('lodash');
const MarkdownIt = require('markdown-it');
import * as hljs from 'highlight.js';
const pkg = require('../../../package.json');

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  },
});

export const md2html = (markdown) => {
  return md.render(markdown);
};

export const getVersion = () => {
  return `${pkg.name} ${pkg.version}/${pkg.publishAt}`;
};

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

export const getExcerpt = (text) => {
  let subIndex = text.indexOf('<!--more-->');
  if (subIndex === -1) {
    subIndex = text.indexOf('<!-- more -->');
  }
  const excerpt = text.substring(0, subIndex);
  return md2html(excerpt);
};
