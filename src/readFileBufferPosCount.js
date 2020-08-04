
/**
 * 从文件指定位置pos读取count个字节,返回为Blob.
 * @param {File} file File对象,表示文件.
 * @param {int} pos 读取的起始位置
 * @param {int} count 读取的字节数
 * @returns {ArrayBuffer} 读取的文件buffer
 */
function readFileBuffer(file, pos, count) {
  let slice =
  File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice; // 为了使nextjs服务器端不报错,从外面移到这里.
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = error => {
      console.log('error! ', error);
      reject(error);
    };
    reader.onload = evt => {
      console.log('evt:', evt, ', loaded:', evt.loaded);
      let arraybuffer = evt.target.result;
      resolve(arraybuffer);
    };
    let blob = slice.call(file, pos, pos + count);
    reader.readAsArrayBuffer(blob);
  });
}

export default readFileBuffer;
