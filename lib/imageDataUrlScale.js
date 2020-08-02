'use strict';

exports.__esModule = true;
exports.DEFAULT_MAX_HEIGHT = exports.DEFAULT_MAX_WIDTH = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.calcDestRect = calcDestRect;
exports.dataUrlScale = dataUrlScale;

var _dataUrlName = require('./dataUrlName');

var _dataUrlName2 = _interopRequireDefault(_dataUrlName);

var _fileBasename = require('./fileBasename');

var _fileBasename2 = _interopRequireDefault(_fileBasename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_MAX_WIDTH = exports.DEFAULT_MAX_WIDTH = 720;
var DEFAULT_MAX_HEIGHT = exports.DEFAULT_MAX_HEIGHT = 720;

/**
 * 计算缩放转换后矩形大小
 * @param {json} srcRect 原始矩形宽高 {width, height}
 * @param {json} param1 选项参数{keepRatio:是否保持宽高比,maxWidth,maxHeight最大宽高,默认为720}
 */
function calcDestRect(srcRect, opts) {
  var _ref = opts || {},
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === undefined ? DEFAULT_MAX_WIDTH : _ref$maxWidth,
      _ref$maxHeight = _ref.maxHeight,
      maxHeight = _ref$maxHeight === undefined ? DEFAULT_MAX_HEIGHT : _ref$maxHeight,
      _ref$keepRatio = _ref.keepRatio,
      keepRatio = _ref$keepRatio === undefined ? true : _ref$keepRatio;

  if (!maxWidth && !maxHeight) {
    console.log('option missing! maxWidth=', maxWidth, ', maxHeight=', maxHeight);
    return srcRect;
  }
  var destWidth = srcRect.width;
  var destHeight = srcRect.height;
  if (keepRatio) {
    if (maxWidth && maxHeight) {
      var ratio = maxWidth / srcRect.width;
      var ratioH = maxHeight / srcRect.height;
      if (ratioH < ratio) ratio = ratioH;
      destWidth = srcRect.width * ratio;
      destHeight = srcRect.height * ratio;
    } else if (maxWidth) {
      var _ratio = maxWidth / srcRect.width;
      destWidth = srcRect.width * _ratio;
      destHeight = srcRect.height * _ratio;
    } else if (maxHeight) {
      var _ratio2 = maxHeight / srcRect.height;
      destWidth = srcRect.width * _ratio2;
      destHeight = srcRect.height * _ratio2;
    }
  } else {
    if (maxWidth && maxHeight) {
      destWidth = maxWidth;
      destHeight = maxHeight;
    } else if (maxWidth) {
      destWidth = maxWidth;
    } else if (maxHeight) {
      destHeight = maxHeight;
    }
  }
  return { width: Math.floor(destWidth), height: Math.floor(destHeight) };
}

/**
 * 将dataUrl类型图片缩放, 返回dataUrl及文件名.
 * @param {json} data 图片数据及名称, {dataUrl, name}
 * @param {json} opts 选项参数{keepRatio:是否保持宽高比,maxWidth,maxHeight最大宽高,默认为720}
 * @returns { dataUrl, name:[name], width, height }
 */
function dataUrlScale(data, opts) {
  var name = data.name;
  var dataUrl = data.dataUrl;
  if (!name) {
    name = dataUrl.indexOf(';base64,') < 0 ? (0, _dataUrlName2.default)(dataUrl) : 'noname';
  }

  var _ref2 = opts || {},
      _ref2$maxWidth = _ref2.maxWidth,
      maxWidth = _ref2$maxWidth === undefined ? DEFAULT_MAX_WIDTH : _ref2$maxWidth,
      _ref2$maxHeight = _ref2.maxHeight,
      maxHeight = _ref2$maxHeight === undefined ? DEFAULT_MAX_HEIGHT : _ref2$maxHeight,
      _ref2$keepRatio = _ref2.keepRatio,
      keepRatio = _ref2$keepRatio === undefined ? true : _ref2$keepRatio;

  /* 
    output: { width, height, dataUrl, [name] }
  */


  return new _promise2.default(function (resolve, reject) {
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function () {
      var destRect = calcDestRect({ width: this.width, height: this.height }, { maxWidth: maxWidth, maxHeight: maxHeight, keepRatio: keepRatio });
      var canvas = document.createElement('canvas');
      canvas.width = destRect.width;
      canvas.height = destRect.height;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0, destRect.width, destRect.height);

      //let dataUrlDest = canvas.toDataURL("image/png");
      //name = basename(name) + '.png';
      var dataUrlDest = canvas.toDataURL('image/jpeg', 0.8);
      name = (0, _fileBasename2.default)(name) + '.jpg';
      //console.log ("dataUrlDest:", dataUrlDest);

      //let blob = canvas.toBlob("image/png");
      //let blob = canvas.toBlob("image/jpeg", 0.5);
      resolve({
        name: name,
        dataUrl: dataUrlDest,
        width: destRect.width,
        height: destRect.height
      });
    };
    img.onerror = function (e) {
      console.log('error:', e);
      reject(e);
    };

    img.src = dataUrl;
  });
}

exports.default = dataUrlScale;