'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 从文件指定位置pos读取count个字节,返回为Blob.
 * @param {File} file File对象,表示文件.
 * @param {int} pos 读取的起始位置
 * @param {int} count 读取的字节数
 * @returns {ArrayBuffer} 读取的文件buffer
 */
function readFileBuffer(file, pos, count) {
  var slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice; // 为了使nextjs服务器端不报错,从外面移到这里.
  return new _promise2.default(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = function (error) {
      console.log('error! ', error);
      reject(error);
    };
    reader.onload = function (evt) {
      console.log('evt:', evt, ', loaded:', evt.loaded);
      var arraybuffer = evt.target.result;
      resolve(arraybuffer);
    };
    var blob = slice.call(file, pos, pos + count);
    reader.readAsArrayBuffer(blob);
  });
}

exports.default = readFileBuffer;