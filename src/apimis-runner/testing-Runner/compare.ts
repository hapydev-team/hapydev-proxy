import { gt, gte, includes, isNull, isUndefined, lt, lte } from 'lodash';

export const getCompareResult = (type, a, b) => {
  if (type === 'toEqual') {
    return a == b;
  }
  if (type === 'notEqual') {
    return a != b;
  }
  if (type === 'toBeLessThan') {
    return lt(Number(a), Number(b));
  }
  if (type === 'toBeLessThanOrEqual') {
    return lte(Number(a), Number(b));
  }
  if (type === 'toBeGreaterThan') {
    return gt(Number(a), Number(b));
  }
  if (type === 'toBeGreaterThanOrEqual') {
    return gte(Number(a), Number(b));
  }
  if (type === 'toContain') {
    return includes(a, b) || includes(a, Number(b));
  }
  if (type === 'notContain') {
    return !includes(a, b) && !includes(a, Number(b));
  }
  if (type === 'toBeNull') {
    return isNull(a);
  }
  if (type === 'notBeNull') {
    return !isNull(a);
  }

  if (type === 'notBeUndefined') {
    return !isUndefined(a);
  }
  if (type === 'toBeUndefined') {
    return isUndefined(a);
  }
  if (type === 'toMatch') {
    return new RegExp(b).test(a);
  }
};
