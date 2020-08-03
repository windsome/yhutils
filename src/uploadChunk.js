import xhrPost from './xhrPost';

// const PREFIX='http://localhost:3000'
const PREFIX = 'http://localhost:11717';
const CHUNKEDV2_URL_START = PREFIX + '/apis/v1/upload/chunked/start';
const CHUNKEDV2_URL_UPLOAD = PREFIX + '/apis/v1/upload/chunked/upload';
const CHUNKEDV2_URL_END = PREFIX + '/apis/v1/upload/chunked/end';
const DEFAULT_CHUNK_SIZE = 1024 * 1024;

let slice =
  File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

/**
 * 初始化上传信息，将文件及hash告知服务器，服务器判断是否上传。
 *
 * 返回：{status, url, destname}, 服务器端url及status状态信息。
 * TODO: 注意是否返回事务号tid, 用来标识一次文件上传.
 * status：
 *   finish, 文件已经存在，没必要再上传。
 *   ready, 服务器端已准备好，等待上传。
 *   ..., 其他值，表示错误。
 * destname: 目标文件名称.
 * url: 目标文件地址.
 * @param {file/blob} file 文件数据
 * @param {json} opts 选项参数
 * {
 *  hash文件哈希值,
 *  name文件名称,对于Blob类型无法在file中设置名称的有效,
 *  onprogress进度回调
 * }
 * @returns {json} 上传结果 {status, url}
 */
async function uploadFileStart(file, opts = {}) {
  let { hash = null, onprogress = null } = opts || {};
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  let name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.
  console.log('uploadFileInfo:', { name, size, hash });

  let formData = new FormData();
  formData.append('cmd', 'start');
  formData.append('name', name);
  formData.append('size', size);
  formData.append('hash', hash);
  let result = await xhrPost(CHUNKEDV2_URL_START, formData, onprogress);
  if (result && result.errcode) {
    throw result;
  }

  return result;
}

/**
 * 上传文件的一块数据chunk
 * @param {file/blob} file 文件数据
 * @param {string} destname 服务器端文件名称,用于服务器端控制,类似事务号,标识本次文件上传整过程.
 * @param {number} pos 本块在文件中的位置.
 * @param {number} count 本块大小
 * @param {json} opts 选项参数
 * {
 *  hash文件哈希值,
 *  name文件名称,对于Blob类型无法在file中设置名称的有效,
 *  onprogress进度回调
 * }
 */
async function uploadFileChunk(file, destname, pos, count, opts) {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  let start = pos;
  let end = pos + count - 1;
  let name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.
  if (isNaN(start) || isNaN(end)) {
    throw new Error('not number! start=' + start + ', end=' + end);
  }
  if (start > size || end > size) {
    throw new Error('error position! ' + size + '[' + start + ',' + end + ']');
  }
  let { hash = null, onprogress = null } = opts || {};
  console.log('uploadFileChunk start! ', { name, size, hash, start, end });

  let blob = slice.call(file, start, end);
  let formData = new FormData();
  formData.append('cmd', 'upload');
  formData.append('name', name);
  formData.append('destname', destname);
  formData.append('size', size);
  formData.append('hash', hash);
  formData.append('chunk', blob);
  formData.append('start', start);
  formData.append('end', end);

  let result = await xhrPost(CHUNKEDV2_URL_UPLOAD, formData, onprogress);
  if (result && result.errcode) {
    throw result;
  }
  return result;
}

/**
 * 结束上传，通知服务器结束此文件上传
 *
 * 返回：{url, status, message}, 服务器端url, status状态信息, message描述信息
 * status：
 *   finish, 文件已经存在，没必要再上传。
 *   ready, 服务器端已准备好，等待上传。
 *   ..., 其他值，表示错误。
 * @param {file/blob} file 文件数据
 * @param {string} destname 服务器端文件名称,用于服务器端控制,类似事务号,标识本次文件上传整过程.
 * @param {json} opts 选项参数
 * {
 *  hash文件哈希值,
 *  name文件名称,对于Blob类型无法在file中设置名称的有效,
 *  onprogress进度回调
 * }
 */
async function uploadFileEnd(file, destname, opts) {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  let name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.
  let { hash = null, onprogress = null } = opts || {};
  console.log('uploadFileEnd:', { name, size, hash });

  let formData = new FormData();
  formData.append('cmd', 'end');
  formData.append('name', name);
  formData.append('destname', destname);
  formData.append('size', size);
  formData.append('hash', hash);
  let result = await xhrPost(CHUNKEDV2_URL_END, formData, onprogress);
  if (result && result.errcode) {
    throw result;
  }

  return result;
}

///////////////////////////////////////////////////////////////////////////////
// 使用 async/await模式，比较容易理解
///////////////////////////////////////////////////////////////////////////////
/**
 *
 * @param {File} file 待上传的文件数据
 * @param {json} opts 选项参数
 * {
 *  hash文件哈希值,
 *  name文件名称,对于Blob类型无法在file中设置名称的有效,
 *  chunkSize 分块大小,默认为DEFAULT_CHUNK_SIZE
 *  onprogress进度回调
 * }
 */
async function uploadFile(file, opts) {
  if (!file) {
    throw new Error('no file!');
  }
  let size = file.size;
  if (!size) {
    throw new Error('no file.size!');
  }
  let name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.
  let { chunkSize, onprogress = null, hash = null } = opts || {};
  if (!chunkSize) chunkSize = DEFAULT_CHUNK_SIZE;
  let count = Math.ceil(size / chunkSize);
  console.log('uploadFile:', { name, size, hash, chunkSize, count });

  let info = await uploadFileStart(file, { name, hash });
  if (!info) {
    throw new Error('uploadFileStart fail!');
  }
  if (info.status === 'finish') return info;
  if (info.status !== 'ready') {
    throw new Error('uploadFile unknown status=' + info.status);
  }
  let { destname } = info;
  let resultList = [];
  for (let i = 0; i < count; i++) {
    let sliceSize = chunkSize;
    let start = i * chunkSize;
    let end = (i + 1) * chunkSize;
    if (end > size) end = size;
    sliceSize = end - start;
    let opts = {
      hash,
      onprogress: ({ loaded, total }) => {
        let percent = parseInt(
          (100 * (i * chunkSize + (loaded / total) * (end - start))) / size
        );
        onprogress && onprogress({ action: 'upload', name, percent });
      }
    };
    let result = await uploadFileChunk(file, destname, start, sliceSize, opts);
    resultList.push(result);
  }
  // if (resultList) {
  //   // check every slice is right.
  // }
  // let lastResult =
  //   resultList.length > 0 ? resultList[resultList.length - 1] : null;
  // return lastResult;
  let finalResult = await uploadFileEnd(file, destname, { hash });
  return finalResult;
}

export default uploadFile;
