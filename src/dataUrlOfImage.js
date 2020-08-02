/**
 * 将Image图片通过canvas转成dataUrl.
 * @param {Image} img 图片元素
 * @returns {dataUrl} 图片数据
 */
function dataUrlOfImage (img) {
  // TODO: 会遇到跨域问题,无效
  let canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  return canvas.toDataURL('image/png');
};


export default dataUrlOfImage;