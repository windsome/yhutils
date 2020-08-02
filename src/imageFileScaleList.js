import imageFileScale from './imageFileScale';

/**
 *
 * @param {[File]} files 由input=file获取到的file数组
 * @param {callback} onprogress 进度回调函数 ({name, percent}) => {}
 * @param {json} opts 选项
 * @returns [{ dataUrl, name, width, height }] 数组
 */
export async function imageFileScaleListAsync(files, onprogress, opts) {
  /* 
    output: [{ width, height, dataUrl, name }]
  */
  let list = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let name = file.name;
    //let dataUrl = await dataUrlOfFile (file);
    //let dest = await dataUrlScale (dataUrl, opts);

    let dest = await imageFileScale(file, opts);
    list.push(dest);
    let percent = (100 * (i + 1)) / files.length;
    onprogress && onprogress({ name, percent });
  }
  return list;
}

export default imageFileScaleListAsync;
