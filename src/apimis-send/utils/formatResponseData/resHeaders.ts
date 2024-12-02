export const getHeaders = (resHeaders) => {
  const headers: any = [];
  for (let k in resHeaders) {
    if (resHeaders[k] instanceof Array) {
      for (let h of resHeaders[k]) {
        headers.push({
          name: k,
          value: h,
        });
      }
    } else {
      headers.push({
        name: k,
        value: resHeaders[k],
      });
    }
  }
  return headers;
};
