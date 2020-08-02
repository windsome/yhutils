'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.imageFileScaleAsync = imageFileScaleAsync;
exports.imageFileScaleSync = imageFileScaleSync;

var _dataUrlOfFile = require('./dataUrlOfFile');

var _dataUrlOfFile2 = _interopRequireDefault(_dataUrlOfFile);

var _imageDataUrlScale = require('./imageDataUrlScale');

var _imageDataUrlScale2 = _interopRequireDefault(_imageDataUrlScale);

var _dataUrlToFile = require('./dataUrlToFile');

var _dataUrlToFile2 = _interopRequireDefault(_dataUrlToFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 将图片压缩生成dataUrl. (async/await写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns File对象 // 从dataUrl对象{ dataUrl, name, width, height }而来.
 */
function imageFileScaleAsync(file, opts) {
  var data;
  return _regenerator2.default.async(function imageFileScaleAsync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regenerator2.default.awrap((0, _dataUrlOfFile2.default)(file));

        case 2:
          data = _context.sent;
          _context.next = 5;
          return _regenerator2.default.awrap((0, _imageDataUrlScale2.default)(data, opts));

        case 5:
          data = _context.sent;

          file = (0, _dataUrlToFile2.default)(data);
          file.width = data.width;
          file.height = data.height;
          return _context.abrupt('return', file);

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

/**
 * 将图片压缩生成dataUrl. (promise写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns File对象列表
 */
function imageFileScaleSync(file, opts) {
  return (0, _dataUrlOfFile2.default)(file).then(function (data) {
    return (0, _imageDataUrlScale2.default)(data, opts);
  }).then(function (data) {
    var file1 = (0, _dataUrlToFile2.default)(data);
    file1.width = data.width;
    file1.height = data.height;
    return file1;
  });
}

exports.default = imageFileScaleAsync;