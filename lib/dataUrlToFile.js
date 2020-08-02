'use strict';

exports.__esModule = true;
/**
 * 转换file为dataUrl, 同时将文件名传递出去.
 * @param {file} file html中input获取到的file,注意为单个file
 * @returns { name, data: dataUrl}
 */

/**
 * 将dataUrl及文件名转成File
 * @param {json} data dataUrl及name
 * @returns File
 */
function dataURLtoFile(data) {
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
  return new File([u8arr], name, { type: mime });
}
exports.default = dataURLtoFile;