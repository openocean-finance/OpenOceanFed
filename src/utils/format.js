import {
  getFixed, getTimes, isGte, isLte, isNumber,
} from '@/utils/number';

// formatAmount
export const formatUsdt = (val) => getFixed(val, 4);

export const formatPrice = (val) => {
  if (isLte(val, 1) && isGte(val, -1)) { // -1 -> 1
    return getFixed(val, 6);
  }
  return getFixed(val, 4);
};

export const formatBalance = (val) => {
  if (!isNumber(val)) {
    return '--';
  }
  return getFixed(val, 6);
};

export const formatLongStr = (val, start = 6, end = 6, mid = '...') => {
  if (val.length > start + end) {
    return `${val.substr(0, start)}${mid}${val.substr(val.length - end, end)}`;
  }
  return val;
};

export const formatPercent = (val) => `${getTimes(val, 100)}%`;

export const formatDateLabel = (date, fmt) => {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  // eslint-disable-next-line no-param-reassign
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  // eslint-disable-next-line
  for (const k in o) if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
  return fmt;
};

export const formatDate = (time, Delimiter) => {
  // eslint-disable-next-line no-param-reassign
  Delimiter = Delimiter || '-';
  const now = new Date(time * 1000);
  const year = `${now.getFullYear()}`;
  let month = `${now.getMonth() + 1}`;
  let date = `${now.getDate()}`;
  let hour = `${now.getHours()}`;
  let minute = `${now.getMinutes()}`;
  let second = `${now.getSeconds()}`;
  month = month.length < 2 ? `0${month}` : month;
  date = date.length < 2 ? `0${date}` : date;
  hour = hour.length < 2 ? `0${hour}` : hour;
  minute = minute.length < 2 ? `0${minute}` : minute;
  second = second.length < 2 ? `0${second}` : second;

  return `${year + Delimiter + month + Delimiter + date} ${hour}:${minute}:${second}`;
};

export default {
  install(Vue) {
    Vue.filter('formatUsdt', formatUsdt);
    Vue.filter('formatPrice', formatPrice);
    Vue.filter('formatBalance', formatBalance);
    Vue.filter('formatLongStr', formatLongStr);
    Vue.filter('formatPercent', formatPercent);
    Vue.filter('formatDate', formatDate);
  },
};
