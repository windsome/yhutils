"use strict";

exports.__esModule = true;
exports.filename = filename;
/**
 * 获取url地址中文件名部分. eg:
 * http://localhost/public/images/logo.jpg => logo.jpg
 * /home/dev/images/logo.jpg => logo.jpg
 * @param {string} url url地址或文件路径
 */
function filename(url) {
  if (url) {
    var m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return null;
}

exports.default = filename;