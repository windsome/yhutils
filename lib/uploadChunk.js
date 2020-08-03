'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _xhrPost = require('./xhrPost');

var _xhrPost2 = _interopRequireDefault(_xhrPost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const PREFIX='http://localhost:3000'
var PREFIX = 'http://localhost:11717';
var CHUNKEDV2_URL_START = PREFIX + '/apis/v1/upload/chunked/start';
var CHUNKEDV2_URL_UPLOAD = PREFIX + '/apis/v1/upload/chunked/upload';
var CHUNKEDV2_URL_END = PREFIX + '/apis/v1/upload/chunked/end';
var DEFAULT_CHUNK_SIZE = 1024 * 1024;

var slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

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
function uploadFileStart(file) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref, _ref$hash, hash, _ref$onprogress, onprogress, size, name, formData, result;

  return _regenerator2.default.async(function uploadFileStart$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref = opts || {}, _ref$hash = _ref.hash, hash = _ref$hash === undefined ? null : _ref$hash, _ref$onprogress = _ref.onprogress, onprogress = _ref$onprogress === undefined ? null : _ref$onprogress;

          if (file) {
            _context.next = 3;
            break;
          }

          throw new Error('no file!');

        case 3:
          size = file.size;

          if (size) {
            _context.next = 6;
            break;
          }

          throw new Error('no file.size!');

        case 6:
          name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

          console.log('uploadFileInfo:', { name: name, size: size, hash: hash });

          formData = new FormData();

          formData.append('cmd', 'start');
          formData.append('name', name);
          formData.append('size', size);
          formData.append('hash', hash);
          _context.next = 15;
          return _regenerator2.default.awrap((0, _xhrPost2.default)(CHUNKEDV2_URL_START, formData, onprogress));

        case 15:
          result = _context.sent;

          if (!(result && result.errcode)) {
            _context.next = 18;
            break;
          }

          throw result;

        case 18:
          return _context.abrupt('return', result);

        case 19:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
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
function uploadFileChunk(file, destname, pos, count, opts) {
  var size, start, end, name, _ref2, _ref2$hash, hash, _ref2$onprogress, onprogress, blob, formData, result;

  return _regenerator2.default.async(function uploadFileChunk$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (file) {
            _context2.next = 2;
            break;
          }

          throw new Error('no file!');

        case 2:
          size = file.size;

          if (size) {
            _context2.next = 5;
            break;
          }

          throw new Error('no file.size!');

        case 5:
          start = pos;
          end = pos + count - 1;
          name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

          if (!(isNaN(start) || isNaN(end))) {
            _context2.next = 10;
            break;
          }

          throw new Error('not number! start=' + start + ', end=' + end);

        case 10:
          if (!(start > size || end > size)) {
            _context2.next = 12;
            break;
          }

          throw new Error('error position! ' + size + '[' + start + ',' + end + ']');

        case 12:
          _ref2 = opts || {}, _ref2$hash = _ref2.hash, hash = _ref2$hash === undefined ? null : _ref2$hash, _ref2$onprogress = _ref2.onprogress, onprogress = _ref2$onprogress === undefined ? null : _ref2$onprogress;

          console.log('uploadFileChunk start! ', { name: name, size: size, hash: hash, start: start, end: end });

          blob = slice.call(file, start, end);
          formData = new FormData();

          formData.append('cmd', 'upload');
          formData.append('name', name);
          formData.append('destname', destname);
          formData.append('size', size);
          formData.append('hash', hash);
          formData.append('chunk', blob);
          formData.append('start', start);
          formData.append('end', end);

          _context2.next = 26;
          return _regenerator2.default.awrap((0, _xhrPost2.default)(CHUNKEDV2_URL_UPLOAD, formData, onprogress));

        case 26:
          result = _context2.sent;

          if (!(result && result.errcode)) {
            _context2.next = 29;
            break;
          }

          throw result;

        case 29:
          return _context2.abrupt('return', result);

        case 30:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
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
function uploadFileEnd(file, destname, opts) {
  var size, name, _ref3, _ref3$hash, hash, _ref3$onprogress, onprogress, formData, result;

  return _regenerator2.default.async(function uploadFileEnd$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (file) {
            _context3.next = 2;
            break;
          }

          throw new Error('no file!');

        case 2:
          size = file.size;

          if (size) {
            _context3.next = 5;
            break;
          }

          throw new Error('no file.size!');

        case 5:
          name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

          _ref3 = opts || {}, _ref3$hash = _ref3.hash, hash = _ref3$hash === undefined ? null : _ref3$hash, _ref3$onprogress = _ref3.onprogress, onprogress = _ref3$onprogress === undefined ? null : _ref3$onprogress;

          console.log('uploadFileEnd:', { name: name, size: size, hash: hash });

          formData = new FormData();

          formData.append('cmd', 'end');
          formData.append('name', name);
          formData.append('destname', destname);
          formData.append('size', size);
          formData.append('hash', hash);
          _context3.next = 16;
          return _regenerator2.default.awrap((0, _xhrPost2.default)(CHUNKEDV2_URL_END, formData, onprogress));

        case 16:
          result = _context3.sent;

          if (!(result && result.errcode)) {
            _context3.next = 19;
            break;
          }

          throw result;

        case 19:
          return _context3.abrupt('return', result);

        case 20:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
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
function uploadFile(file, opts) {
  var _this = this;

  var size, name, _ref4, chunkSize, _ref4$onprogress, _onprogress, _ref4$hash, hash, count, info, destname, resultList, _loop, i, finalResult;

  return _regenerator2.default.async(function uploadFile$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (file) {
            _context5.next = 2;
            break;
          }

          throw new Error('no file!');

        case 2:
          size = file.size;

          if (size) {
            _context5.next = 5;
            break;
          }

          throw new Error('no file.size!');

        case 5:
          name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

          _ref4 = opts || {}, chunkSize = _ref4.chunkSize, _ref4$onprogress = _ref4.onprogress, _onprogress = _ref4$onprogress === undefined ? null : _ref4$onprogress, _ref4$hash = _ref4.hash, hash = _ref4$hash === undefined ? null : _ref4$hash;

          if (!chunkSize) chunkSize = DEFAULT_CHUNK_SIZE;
          count = Math.ceil(size / chunkSize);

          console.log('uploadFile:', { name: name, size: size, hash: hash, chunkSize: chunkSize, count: count });

          _context5.next = 12;
          return _regenerator2.default.awrap(uploadFileStart(file, { name: name, hash: hash }));

        case 12:
          info = _context5.sent;

          if (info) {
            _context5.next = 15;
            break;
          }

          throw new Error('uploadFileStart fail!');

        case 15:
          if (!(info.status === 'finish')) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt('return', info);

        case 17:
          if (!(info.status !== 'ready')) {
            _context5.next = 19;
            break;
          }

          throw new Error('uploadFile unknown status=' + info.status);

        case 19:
          destname = info.destname;
          resultList = [];

          _loop = function _loop(i) {
            var sliceSize, start, end, opts, result;
            return _regenerator2.default.async(function _loop$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    sliceSize = chunkSize;
                    start = i * chunkSize;
                    end = (i + 1) * chunkSize;

                    if (end > size) end = size;
                    sliceSize = end - start;
                    opts = {
                      hash: hash,
                      onprogress: function onprogress(_ref5) {
                        var loaded = _ref5.loaded,
                            total = _ref5.total;

                        var percent = parseInt(100 * (i * chunkSize + loaded / total * (end - start)) / size);
                        _onprogress && _onprogress({ action: 'upload', name: name, percent: percent });
                      }
                    };
                    _context4.next = 8;
                    return _regenerator2.default.awrap(uploadFileChunk(file, destname, start, sliceSize, opts));

                  case 8:
                    result = _context4.sent;

                    resultList.push(result);

                  case 10:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, null, _this);
          };

          i = 0;

        case 23:
          if (!(i < count)) {
            _context5.next = 29;
            break;
          }

          _context5.next = 26;
          return _regenerator2.default.awrap(_loop(i));

        case 26:
          i++;
          _context5.next = 23;
          break;

        case 29:
          _context5.next = 31;
          return _regenerator2.default.awrap(uploadFileEnd(file, destname, { hash: hash }));

        case 31:
          finalResult = _context5.sent;
          return _context5.abrupt('return', finalResult);

        case 33:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

exports.default = uploadFile;