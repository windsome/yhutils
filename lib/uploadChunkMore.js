'use strict';

exports.__esModule = true;
exports.hash$UploadDataURL = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.hash$UploadFile = hash$UploadFile;
exports.scale$hash$uploadFile = scale$hash$uploadFile;
exports.hash$UploadImgElement = hash$UploadImgElement;
exports.hash$UploadDataURLs = hash$UploadDataURLs;
exports.uploadFileInput = uploadFileInput;

var _md5sumFile = require('./md5sumFile');

var _md5sumFile2 = _interopRequireDefault(_md5sumFile);

var _dataUrlToBlob = require('./dataUrlToBlob');

var _dataUrlToBlob2 = _interopRequireDefault(_dataUrlToBlob);

var _imageFileScale = require('./imageFileScale');

var _imageFileScale2 = _interopRequireDefault(_imageFileScale);

var _dataUrlOfImage = require('./dataUrlOfImage');

var _dataUrlOfImage2 = _interopRequireDefault(_dataUrlOfImage);

var _uploadChunk = require('./uploadChunk');

var _uploadChunk2 = _interopRequireDefault(_uploadChunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function hash$UploadFile(file, opts) {
  var totalSize, _ref, chunkSize, _onprogress, name, hash, ret;

  return _regenerator2.default.async(function hash$UploadFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (file) {
            _context.next = 2;
            break;
          }

          throw new Error('no file!');

        case 2:
          totalSize = file.size;

          if (totalSize) {
            _context.next = 5;
            break;
          }

          throw new Error('no totalSize!');

        case 5:
          _ref = opts || {}, chunkSize = _ref.chunkSize, _onprogress = _ref.onprogress;
          name = file.name || opts.name || 'noname'; //blob类型没有名字,从opts的name中获取.

          _context.next = 9;
          return _regenerator2.default.awrap((0, _md5sumFile2.default)(file, {
            chunkSize: chunkSize,
            onprogress: function onprogress(percent) {
              _onprogress && _onprogress({ action: 'md5sum', percent: percent, name: name });
            }
          }));

        case 9:
          hash = _context.sent;
          _context.next = 12;
          return _regenerator2.default.awrap((0, _uploadChunk2.default)(file, {
            chunkSize: chunkSize,
            hash: hash,
            onprogress: function onprogress(evt) {
              console.log('uploadFileList progress:', evt);
              _onprogress && _onprogress(evt);
            }
          }));

        case 12:
          ret = _context.sent;
          return _context.abrupt('return', ret);

        case 14:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

/**
 * 将dataUrl转成File后hash并上传.
 * @param {json} data {dataUrl, name}
 * @param {*} opts {chunkSize, onprogress}
 */
var hash$UploadDataURL = exports.hash$UploadDataURL = function hash$UploadDataURL(data, opts) {
  var blob;
  return _regenerator2.default.async(function hash$UploadDataURL$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!data || !data.dataUrl)) {
            _context2.next = 2;
            break;
          }

          throw new Error('no dataUrl!');

        case 2:
          blob = (0, _dataUrlToBlob2.default)(data);
          _context2.next = 5;
          return _regenerator2.default.awrap(hash$UploadFile(blob, opts));

        case 5:
          return _context2.abrupt('return', _context2.sent);

        case 6:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, undefined);
};

/**
 * 将图片文件缩放后哈希并上传.
 * @param {File} file 图片文件
 * @param {json} opts 两部分参数缩放及哈希上传参数{
 *  maxWIdth, maxHeight, keepRatio
 *  chunkSize, onprogress
 * }
 */
function scale$hash$uploadFile(file, opts) {
  var fileScaled;
  return _regenerator2.default.async(function scale$hash$uploadFile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!opts) opts = {};
          _context3.next = 3;
          return _regenerator2.default.awrap((0, _imageFileScale2.default)(file, {
            maxWidth: opts.maxWidth,
            maxHeight: opts.maxWidth,
            keepRatio: opts.keepRatio
          }));

        case 3:
          fileScaled = _context3.sent;
          _context3.next = 6;
          return _regenerator2.default.awrap(hash$UploadFile(fileScaled, {
            chunkSize: opts.chunkSize,
            onprogress: opts.onprogress
          }));

        case 6:
          return _context3.abrupt('return', _context3.sent);

        case 7:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

/**
 * 将Image标签的图像数据通过dataUrl转成File并哈希上传.
 * TODO: 之前是用在微信公众号平台用于上传服务器端图片,但因存在跨域问题, 不能使用.
 * @param {Image} img Image元素
 * @param {json} opts 参数{name, chunkSize, onprogress}
 */
function hash$UploadImgElement(img, opts) {
  var dataUrl, _ref2, name, chunkSize, onprogress, blob;

  return _regenerator2.default.async(function hash$UploadImgElement$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (img) {
            _context4.next = 2;
            break;
          }

          throw new Error('no img!');

        case 2:
          dataUrl = (0, _dataUrlOfImage2.default)(img);

          if (dataUrl) {
            _context4.next = 5;
            break;
          }

          throw new Error('no dataUrl!');

        case 5:
          _ref2 = opts || {}, name = _ref2.name, chunkSize = _ref2.chunkSize, onprogress = _ref2.onprogress;

          name = name || 'wxmp';
          blob = (0, _dataUrlToBlob2.default)({ dataUrl: dataUrl, name: name });
          _context4.next = 10;
          return _regenerator2.default.awrap(hash$UploadFile(blob, { chunkSize: chunkSize, onprogress: onprogress }));

        case 10:
          return _context4.abrupt('return', _context4.sent);

        case 11:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
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

function hash$UploadDataURLs(datas, opts) {
  var resultList, i, data, result;
  return _regenerator2.default.async(function hash$UploadDataURLs$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(!datas || datas.length == 0)) {
            _context5.next = 2;
            break;
          }

          throw new Error('no datas!');

        case 2:
          resultList = [];
          i = 0;

        case 4:
          if (!(i < datas.length)) {
            _context5.next = 13;
            break;
          }

          data = datas[i];
          _context5.next = 8;
          return _regenerator2.default.awrap(hash$UploadDataURL(data, opts));

        case 8:
          result = _context5.sent;

          resultList.push(result);

        case 10:
          i++;
          _context5.next = 4;
          break;

        case 13:
          return _context5.abrupt('return', resultList);

        case 14:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

/**
 * 将FileInput中多个文件上传.
 * @param {Event} evt FileInput元素的的回调.其中有files用于上传.
 */
function uploadFileInput(evt) {
  var resultList, files, i, file, result;
  return _regenerator2.default.async(function uploadFileInput$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          resultList = [];
          files = evt.target.files;
          i = 0;

        case 3:
          if (!(i < files.length)) {
            _context6.next = 12;
            break;
          }

          file = files[i];
          _context6.next = 7;
          return _regenerator2.default.awrap((0, _uploadChunk2.default)(file, {
            onprogress: function onprogress(evt) {
              console.log('uploadFileInput', evt);
            }
          }));

        case 7:
          result = _context6.sent;

          resultList.push(result);

        case 9:
          i++;
          _context6.next = 3;
          break;

        case 12:
          return _context6.abrupt('return', resultList);

        case 13:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this);
}

exports.default = hash$UploadFile;