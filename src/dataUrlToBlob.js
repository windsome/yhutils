 /**
  * 将dataUrl及文件名转成Blob
  * @param {json} data dataUrl及name
 * @returns {json} {blob,name}
  */

 function dataURLtoBlob(data) {
  let {dataUrl,name} = data|| {};
  var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return {blob: new Blob([u8arr], {type:mime}), name};
}
export default dataURLtoBlob;