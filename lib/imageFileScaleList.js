'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.imageFileScaleListAsync = imageFileScaleListAsync;

var _imageFileScale = require('./imageFileScale');

var _imageFileScale2 = _interopRequireDefault(_imageFileScale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {[File]} files 由input=file获取到的file数组
 * @param {callback} onprogress 进度回调函数 ({name, percent}) => {}
 * @param {json} opts 选项
 * @returns [{ dataUrl, name, width, height }] 数组
 */
function imageFileScaleListAsync(files, onprogress, opts) {
  var list, i, file, name, dest, percent;
  return _regenerator2.default.async(function imageFileScaleListAsync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          /* 
            output: [{ width, height, dataUrl, name }]
          */
          list = [];
          i = 0;

        case 2:
          if (!(i < files.length)) {
            _context.next = 14;
            break;
          }

          file = files[i];
          name = file.name;
          //let dataUrl = await dataUrlOfFile (file);
          //let dest = await dataUrlScale (dataUrl, opts);

          _context.next = 7;
          return _regenerator2.default.awrap((0, _imageFileScale2.default)(file, opts));

        case 7:
          dest = _context.sent;

          list.push(dest);
          percent = 100 * (i + 1) / files.length;

          onprogress && onprogress({ name: name, percent: percent });

        case 11:
          i++;
          _context.next = 2;
          break;

        case 14:
          return _context.abrupt('return', list);

        case 15:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

exports.default = imageFileScaleListAsync;