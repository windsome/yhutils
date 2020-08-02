import dataUrlOfFile from './dataUrlOfFile';
import dataUrlScale from './imageDataUrlScale';

/**
 * 将图片压缩生成dataUrl. (async/await写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns { dataUrl, name, width, height }
 */
export async function imageFileScaleAsync  ( file,opts) {
  /*
    output: { width, height, dataURL, name }
  */
  let data = await dataUrlOfFile(file);
  return await dataUrlScale(data,opts);
};

/**
 * 将图片压缩生成dataUrl. (promise写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns { dataUrl, name, width, height }
 */
export function imageFileScaleSync ( file, opts) {
  return dataUrlOfFile(file).then(data =>
    dataUrlScale(data, opts)
  );
};

export default imageFileScaleAsync;
