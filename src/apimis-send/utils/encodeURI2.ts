const encodeURI2 = (url: string) => {
  //对已经编码的url不重复编码
  var group = url.match(/([\w|\/|\.|\:|\-|\_|\?|\&]+)|((%[0-9|a-f]{2})+)/gi);
  if (!group) {
    //整个url不满足编码规范
    url = encodeURI(url);
  } else {
    //没有group直接encode
    let postUrl = group.join(''); //将满足规范部分还原为url
    if (postUrl != url) {
      //有不满足条件的url编码规范内容
      let pos = group[0].length;
      let postPos = 0;
      let needEncodeArr = [];
      for (let i = 1; i < group.length; i++) {
        postPos = url.indexOf(group[i], pos);
        if (postPos > pos) {
          //有空隙
          needEncodeArr.push([pos, postPos]);
        }
        pos = postPos + group[i].length;
      }

      if (pos != url.length) {
        //末尾还有数据
        needEncodeArr.push([pos, url.length]);
      }

      //替换
      let allArr = [];
      pos = 0;
      for (let i = 0; i < needEncodeArr.length; i++) {
        allArr.push(url.substring(pos, needEncodeArr[i][0]));
        allArr.push(encodeURI(url.substring(needEncodeArr[i][0], needEncodeArr[i][1])));
        pos = needEncodeArr[i][1];
      }
      if (pos != url.length) {
        //末尾还有数据
        allArr.push(url.substring(pos, url.length));
      }
      url = allArr.join('');
    }
  }

  return url;
};

export default encodeURI2;
