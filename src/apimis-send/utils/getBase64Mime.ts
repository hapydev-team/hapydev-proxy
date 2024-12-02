const MIMEType = require('whatwg-mimetype');

const getBase64Mime = (dataurl: string) => {
  //将base64转换为文件
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

export default getBase64Mime;
