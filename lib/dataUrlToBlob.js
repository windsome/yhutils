'use strict';

exports.__esModule = true;
/**
 * 将dataUrl及文件名转成Blob
 * @param {json} data dataUrl及name
 * @returns {json} {blob,name}
 */

function dataURLtoBlob(data) {
  var _ref = data || {},
      dataUrl = _ref.dataUrl,
      name = _ref.name;

  var arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { blob: new Blob([u8arr], { type: mime }), name: name };
}
exports.default = dataURLtoBlob;