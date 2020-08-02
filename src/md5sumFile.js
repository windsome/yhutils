import SparkMD5 from 'spark-md5';
import readFileBuffer from './readFileBufferPosCount';

const DEFAULT_CHUNK_SIZE = 1024 * 1024;

/**
 *
 * @param {File} file 文件File对象
 * @param {json} opts 选项 {
 *    chunkSize 分片大小,默认为DEFAULT_CHUNK_SIZE,
 *    onprogress回调函数.默认为空.
 *  }
 */
function calMd5sum(file, opts) {
  let { onprogress = null, chunkSize = DEFAULT_CHUNK_SIZE } = opts || {};
  if (!chunkSize) chunkSize = DEFAULT_CHUNK_SIZE;
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('no file!'));
    }
    if (!chunkSize) {
      reject(new Error('no chunkSize!'));
    }

    let totalSize = file.size;
    console.log('calMd5sum start! fileSize=' + totalSize);
    let startTime = new Date().getTime();
    let spark = new SparkMD5.ArrayBuffer();
    (async function loop() {
      let count = Math.ceil(totalSize / chunkSize);
      let pos = 0;
      for (let i = 0; i < count; i++) {
        let arraybuffer = await readFileBuffer(file, pos, chunkSize);
        if (arraybuffer) {
          spark.append(arraybuffer); // append array buffer
          pos += arraybuffer.length;
          let percent = Math.floor((100 * pos) / totalSize);
          onprogress && onprogress(percent);
        }
      }
      return pos;
    })()
      .then(readSize => {
        let hash = spark.end().toUpperCase();
        let endTime = new Date().getTime();
        console.log(
          'readSize:' +
            readSize +
            ', md5sum:' +
            hash +
            ', time:' +
            (endTime - startTime)
        );
        resolve(hash);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export default calMd5sum;
