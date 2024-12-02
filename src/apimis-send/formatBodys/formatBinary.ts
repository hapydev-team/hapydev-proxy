import { DataFile } from '../../types/collection/file';
import { isString } from 'lodash';
import mime from 'mime';
const fs = require('fs');
const isBase64 = require('js-base64');
const MIMEType = require('whatwg-mimetype');

const getBase64Mime = (dataurl: string) => {
  try {
    let arr: any = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1];

    if (mime) {
      let mimeType = new MIMEType(mime);
      return { ext: mimeType['_subtype'], mime: mimeType.essence };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const formatBinary = (fileInfo: DataFile) => {
  const result = {
    body: null,
    mime: null,
  };
  if (fs.existsSync(fileInfo?.file_path)) {
    result.body = fs.createReadStream(fileInfo?.file_path);
    result.mime = mime.getType(fileInfo?.file_path);
    return result;
  }
  if (
    isString(fileInfo?.data_url) &&
    isBase64(fileInfo?.data_url, { allowEmpty: false, allowMime: true })
  ) {
    result.body = Buffer.from(fileInfo?.data_url.replace(/^data:(.+?);base64,/, ''), 'base64');
    result.mime = getBase64Mime(fileInfo?.data_url)?.mime;
    return result;
  }
  return null;
};

export default formatBinary;
