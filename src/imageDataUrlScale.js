import dataUrlName from './dataUrlName';
import getFileBasename from './fileBasename';

export const DEFAULT_MAX_WIDTH = 720;
export const DEFAULT_MAX_HEIGHT = 720;

/**
 * 计算缩放转换后矩形大小
 * @param {json} srcRect 原始矩形宽高 {width, height}
 * @param {json} param1 选项参数{keepRatio:是否保持宽高比,maxWidth,maxHeight最大宽高,默认为720}
 */
export function calcDestRect  ( srcRect, opts)  {
  let {maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT,keepRatio = true} = opts||{};
  if (!maxWidth && !maxHeight) {
    console.log(
      'option missing! maxWidth=',
      maxWidth,
      ', maxHeight=',
      maxHeight
    );
    return srcRect;
  }
  let destWidth = srcRect.width;
  let destHeight = srcRect.height;
  if (keepRatio) {
    if (maxWidth && maxHeight) {
      let ratio = maxWidth / srcRect.width;
      let ratioH = maxHeight / srcRect.height;
      if (ratioH < ratio) ratio = ratioH;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    } else if (maxWidth) {
      let ratio = maxWidth / srcRect.width;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    } else if (maxHeight) {
      let ratio = maxHeight / srcRect.height;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    }
  } else {
    if (maxWidth && maxHeight) {
      destWidth = maxWidth;
      destHeight = maxHeight;
    } else if (maxWidth) {
      destWidth = maxWidth;
    } else if (maxHeight) {
      destHeight = maxHeight;
    }
  }
  return { width: Math.floor(destWidth), height: Math.floor(destHeight) };
};

/**
 * 将dataUrl类型图片缩放, 返回dataUrl及文件名.
 * @param {json} data 图片数据及名称, {dataUrl, name}
 * @param {json} opts 选项参数{keepRatio:是否保持宽高比,maxWidth,maxHeight最大宽高,默认为720}
 * @returns { dataUrl, name:[name], width, height }
 */
export function dataUrlScale ( data, opts) {
  let name = data.name;
  let dataUrl = data.dataUrl;
  if (!name) {
    name = dataUrl.indexOf(';base64,') < 0 ? dataUrlName(dataUrl) : 'noname';
  }
  let {maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT,keepRatio = true} = opts || {};

  /* 
    output: { width, height, dataUrl, [name] }
  */
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {

      let destRect = calcDestRect(
        { width: this.width, height: this.height },
        { maxWidth, maxHeight, keepRatio }
      );
      let canvas = document.createElement('canvas');
      canvas.width = destRect.width;
      canvas.height = destRect.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0, destRect.width, destRect.height);

      //let dataUrlDest = canvas.toDataURL("image/png");
      //name = basename(name) + '.png';
      let dataUrlDest = canvas.toDataURL('image/jpeg', 0.8);
      name = getFileBasename(name) + '.jpg';
      //console.log ("dataUrlDest:", dataUrlDest);

      //let blob = canvas.toBlob("image/png");
      //let blob = canvas.toBlob("image/jpeg", 0.5);
      resolve({
        name,
        dataUrl: dataUrlDest,
        width: destRect.width,
        height: destRect.height
      });
    };
    img.onerror = function(e) {
      console.log('error:', e);
      reject(e);
    };

    img.src = dataUrl;
  });
};

export default dataUrlScale;
