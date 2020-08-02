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
  let { dataUrl, name } = data || {};
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, { type: mime });
}
export default dataURLtoFile;
