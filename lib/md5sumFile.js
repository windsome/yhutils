'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.calMd5sum = calMd5sum;
exports.calMd5sumAsync = calMd5sumAsync;

var _sparkMd = require('spark-md5');

var _sparkMd2 = _interopRequireDefault(_sparkMd);

var _readFileBufferPosCount = require('./readFileBufferPosCount');

var _readFileBufferPosCount2 = _interopRequireDefault(_readFileBufferPosCount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_CHUNK_SIZE = 1024 * 1024;

/**
 *
 * @param {File} file 文件File对象
 * @param {json} opts 选项 {
 *    chunkSize 分片大小,默认为DEFAULT_CHUNK_SIZE,
 *    onprogress回调函数.默认为空.
 *  }
 */
function calMd5sum(file, opts) {
  var _ref = opts || {},
      _ref$onprogress = _ref.onprogress,
      onprogress = _ref$onprogress === undefined ? null : _ref$onprogress,
      _ref$chunkSize = _ref.chunkSize,
      chunkSize = _ref$chunkSize === undefined ? DEFAULT_CHUNK_SIZE : _ref$chunkSize;

  if (!chunkSize) chunkSize = DEFAULT_CHUNK_SIZE;
  return new _promise2.default(function (resolve, reject) {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!chunkSize) {
      reject(new Error('no chunkSize!'));
    }

    var totalSize = file.size;
    console.log('calMd5sum start! fileSize=' + totalSize);
    var startTime = new Date().getTime();
    var spark = new _sparkMd2.default.ArrayBuffer();
    (function loop() {
      var count, pos, i, arraybuffer, percent;
      return _regenerator2.default.async(function loop$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              count = Math.ceil(totalSize / chunkSize);
              pos = 0;
              i = 0;

            case 3:
              if (!(i < count)) {
                _context.next = 11;
                break;
              }

              _context.next = 6;
              return _regenerator2.default.awrap((0, _readFileBufferPosCount2.default)(file, pos, chunkSize));

            case 6:
              arraybuffer = _context.sent;

              if (arraybuffer) {
                spark.append(arraybuffer); // append array buffer
                pos += arraybuffer.length;
                percent = Math.floor(100 * pos / totalSize);

                onprogress && onprogress(percent);
              }

            case 8:
              i++;
              _context.next = 3;
              break;

            case 11:
              return _context.abrupt('return', pos);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    })().then(function (readSize) {
      var hash = spark.end().toUpperCase();
      var endTime = new Date().getTime();
      console.log('readSize:' + readSize + ', md5sum:' + hash + ', time:' + (endTime - startTime));
      resolve(hash);
    }).catch(function (error) {
      reject(error);
    });
  });
}

function calMd5sumAsync(file, opts) {
  var _ref2, _ref2$onprogress, onprogress, _ref2$chunkSize, chunkSize, totalSize, startTime, spark, loop, lastPos, hash, endTime;

  return _regenerator2.default.async(function calMd5sumAsync$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          loop = function loop() {
            var count, pos, i, arraybuffer, percent;
            return _regenerator2.default.async(function loop$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    count = Math.ceil(totalSize / chunkSize);
                    pos = 0;
                    i = 0;

                  case 3:
                    if (!(i < count)) {
                      _context2.next = 11;
                      break;
                    }

                    _context2.next = 6;
                    return _regenerator2.default.awrap((0, _readFileBufferPosCount2.default)(file, pos, chunkSize));

                  case 6:
                    arraybuffer = _context2.sent;

                    if (arraybuffer) {
                      spark.append(arraybuffer); // append array buffer
                      pos += arraybuffer.length;
                      percent = Math.floor(100 * pos / totalSize);

                      onprogress && onprogress(percent);
                    }

                  case 8:
                    i++;
                    _context2.next = 3;
                    break;

                  case 11:
                    return _context2.abrupt('return', pos);

                  case 12:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, null, this);
          };

          _ref2 = opts || {}, _ref2$onprogress = _ref2.onprogress, onprogress = _ref2$onprogress === undefined ? null : _ref2$onprogress, _ref2$chunkSize = _ref2.chunkSize, chunkSize = _ref2$chunkSize === undefined ? DEFAULT_CHUNK_SIZE : _ref2$chunkSize;

          if (!chunkSize) chunkSize = DEFAULT_CHUNK_SIZE;

          if (file) {
            _context3.next = 5;
            break;
          }

          throw new Error('no file!');

        case 5:
          if (chunkSize) {
            _context3.next = 7;
            break;
          }

          throw new Error('no chunkSize!');

        case 7:
          totalSize = file.size;
          // console.log('calMd5sum start! fileSize=' + totalSize);

          startTime = new Date().getTime();
          spark = new _sparkMd2.default.ArrayBuffer();
          _context3.next = 12;
          return _regenerator2.default.awrap(loop());

        case 12:
          lastPos = _context3.sent;
          hash = spark.end().toUpperCase();
          endTime = new Date().getTime();

          console.log('calMd5sumAsync:', { totalSize: totalSize, lastPos: lastPos, hash: hash, duration: endTime - startTime });
          return _context3.abrupt('return', hash);

        case 17:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

exports.default = calMd5sumAsync;