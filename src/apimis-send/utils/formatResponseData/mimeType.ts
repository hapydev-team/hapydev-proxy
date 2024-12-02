const { isUndefined, mapKeys } = require('lodash');
const isSvg = require('is-svg');
const MIMEType = require('whatwg-mimetype');
const FileType = require('file-type');

export const getmimeType = async (stream: any, headers: any) => {
  const rawBody = stream.toString();

  const fileMime = await FileType.fromBuffer(stream);
  if (!isUndefined(fileMime)) {
    return fileMime;
  }
  if (isSvg(rawBody)) {
    return { ext: 'svg', mime: 'image/svg+xml' };
  }

  try {
    const mimeType = new MIMEType(
      mapKeys(headers, function (v: any, k: any) {
        return k.toLowerCase();
      })['content-type']
    );
    return { ext: mimeType['_subtype'], mime: mimeType.essence };
  } catch (e) {}
};
