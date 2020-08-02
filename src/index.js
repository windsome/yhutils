// 获取文件名中除扩展名部分
export { default as fileBasename } from './fileBasename';

// dataUrl相关
export { default as dataUrlName } from './dataUrlName';
export { default as dataUrlOfFile } from './dataUrlOfFile';
export { default as dataUrlOfImage } from './dataUrlOfImage';
export { default as dataUrlToFile } from './dataUrlToFile';
export { default as dataUrlToBlob } from './dataUrlToBlob';

// 图片压缩转换相关
export { default as imageDataUrlScale } from './imageDataUrlScale';
export { default as imageFileScale } from './imageFileScale';
export { default as imageFileScaleList } from './imageFileScaleList';

// md5文件
export { default as md5sumFile } from './md5sumFile';

// 文件上传相关
export { default as readFileBufferPosCount } from './readFileBufferPosCount';
export { default as xhrPost } from './xhrPost';
export { default as uploadFile } from './uploadChunk';
export {
  hash$UploadFile,
  hash$UploadDataURL,
  scale$hash$uploadFile,
  hash$UploadDataURLs,
  uploadFileInput
} from './uploadChunkMore';

// User-Agent解析
export {
  parseUserAgent,
  parseUserAgentV2,
  parseUserAgentV3
} from './userAgent';
