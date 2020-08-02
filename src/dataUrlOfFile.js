/**
 * 转换file为dataUrl, 同时将文件名传递出去.
 * @param {file} file html中input获取到的file,注意为单个file
 * @returns { name, data: dataUrl}
 */
function dataURLOfFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(e) {
      let imageData = e.target.result;
      let name = file.name;
      resolve({ name, dataUrl: imageData });
    };
    reader.onerror = function(e) {
      console.log('getFileDataURL error:', e);
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}

export default dataURLOfFile;
