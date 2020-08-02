import dataUrlOfFile from './dataUrlOfFile';
import dataUrlScale from './imageDataUrlScale';
import dataUrlToFile from './dataUrlToFile';

/**
 * 将图片压缩生成dataUrl. (async/await写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns File对象 // 从dataUrl对象{ dataUrl, name, width, height }而来.
 */
export async function imageFileScaleAsync  ( file,opts) {
  /*
    output: { width, height, dataURL, name }
  */
  let data = await dataUrlOfFile(file);
  data = await dataUrlScale(data,opts);
  file = dataUrlToFile(data);
  file.width = data.width;
  file.height = data.height;
  return file;
};

/**
 * 将图片压缩生成dataUrl. (promise写法)
 * @param {File} file input=file读取的file类型blob
 * @param {json} opts 参数选项,同imageDataUrlScale.
 * @returns File对象列表
 */
export function imageFileScaleSync ( file, opts) {
  return dataUrlOfFile(file).then(data =>
    dataUrlScale(data, opts)
  ).then(data => {
    let file1 = dataUrlToFile(data);
    file1.width = data.width;
    file1.height = data.height;
    return file1;
    });
};

export default imageFileScaleAsync;
