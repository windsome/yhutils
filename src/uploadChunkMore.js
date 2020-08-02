import calMd5sum from './md5sumFile';
import dataURL2Blob from './dataUrlToBlob';
import imageFileScaleAsync from './imageFileScale';
import readImgToDataUrl from './dataUrlOfImage';
import uploadFile from './uploadChunk';
// import { imageFileScaleAsync, readImgToDataUrl } from './imageScale';

///////////////////////////////////////////////////////////////////////////////
// 快捷组合函数! (scale, hash, upload)(wx:localId, serverId) support dataUrls.
///////////////////////////////////////////////////////////////////////////////
/**
 * hash某个文件并上传.
 * @param {File} file 文件对象
 * @param {json} opts 选项参数 {
 *  chunkSize分片大小,默认为DEFAULT_CHUNK_SIZE
 *  onprogress 进度函数
 * }
 */
export async function hash$UploadFile(file, opts) {
  if (!file) {
    throw new Error('no file!');
  }
  let totalSize = file.size;
  if (!totalSize) {
    throw new Error('no totalSize!');
  }
  let { chunkSize, onprogress } = opts || {};
  let name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

  let hash = await calMd5sum(file, {
    chunkSize,
    onprogress: percent => {
      onprogress && onprogress({ action: 'md5sum', percent, name });
    }
  });
  let ret = await uploadFile(file, {
    chunkSize,
    hash,
    onprogress: evt => {
      console.log('uploadFileList progress:', evt);
      onprogress && onprogress(evt);
    }
  });
  return ret;
}

/**
 * 将dataUrl转成File后hash并上传.
 * @param {json} data {dataUrl, name}
 * @param {*} opts {chunkSize, onprogress}
 */
export const hash$UploadDataURL = async (data, opts) => {
  if (!data || !data.dataUrl) {
    throw new Error('no dataUrl!');
  }
  let blob = dataURL2Blob(data);
  return await hash$UploadFile(blob, opts);
};

/**
 * 将图片文件缩放后哈希并上传.
 * @param {File} file 图片文件
 * @param {json} opts 两部分参数缩放及哈希上传参数{
 *  maxWIdth, maxHeight, keepRatio
 *  chunkSize, onprogress
 * }
 */
export async function scale$hash$uploadFile(file, opts) {
  if (!opts) opts = {};
  let fileScaled = await imageFileScaleAsync(file, {
    maxWidth: opts.maxWidth,
    maxHeight: opts.maxWidth,
    keepRatio: opts.keepRatio
  });
  return await hash$UploadFile(fileScaled, {
    chunkSize: opts.chunkSize,
    onprogress: opts.onprogress
  });
}

/**
 * 将Image标签的图像数据通过dataUrl转成File并哈希上传.
 * TODO: 之前是用在微信公众号平台用于上传服务器端图片,但因存在跨域问题, 不能使用.
 * @param {Image} img Image元素
 * @param {json} opts 参数{name, chunkSize, onprogress}
 */
export async function hash$UploadImgElement(img, opts) {
  // TODO: 这个方法无效,会涉及跨域,用服务器端上传替代.
  if (!img) {
    throw new Error('no img!');
  }
  let dataUrl = readImgToDataUrl(img);
  if (!dataUrl) {
    throw new Error('no dataUrl!');
  }

  let { name, chunkSize, onprogress } = opts || {};
  name = name || 'wxmp';
  let blob = dataURL2Blob({ dataUrl, name });
  return await hash$UploadFile(blob, { chunkSize, onprogress });
}

///////////////////////////////////////////////////////////////////////////////
// List组合函数!
///////////////////////////////////////////////////////////////////////////////
/**
 * 将一组dataUrl哈希上传
 * TODO: 未使用
 * @param {Array} datas dataUrl数组 [{dataUrl,name}...]
 * @param {json} 参数选项 {chunkSize, onprogress}
 */

export async function hash$UploadDataURLs(datas, opts) {
  if (!datas || datas.length == 0) {
    throw new Error('no datas!');
  }
  let resultList = [];
  for (let i = 0; i < datas.length; i++) {
    let data = datas[i];
    let result = await hash$UploadDataURL(data, opts);
    resultList.push(result);
  }
  return resultList;
}

/**
 * 将FileInput中多个文件上传.
 * @param {Event} evt FileInput元素的的回调.其中有files用于上传.
 */
export async function uploadFileInput(evt) {
  let resultList = [];
  let files = evt.target.files;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let result = await uploadFile(file, {
      onprogress: evt => {
        console.log('uploadFileInput', evt);
      }
    });
    resultList.push(result);
  }
  return resultList;
}

export default hash$UploadFile;
