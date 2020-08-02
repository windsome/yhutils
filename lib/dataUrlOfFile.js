'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 转换file为dataUrl, 同时将文件名传递出去.
 * @param {file} file html中input获取到的file,注意为单个file
 * @returns { name, data: dataUrl}
 */
function dataURLOfFile(file) {
  return new _promise2.default(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var imageData = e.target.result;
      var name = file.name;
      resolve({ name: name, dataUrl: imageData });
    };
    reader.onerror = function (e) {
      console.log('getFileDataURL error:', e);
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}

exports.default = dataURLOfFile;