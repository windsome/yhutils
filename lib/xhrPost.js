'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * XMLHttpRequest的基本post函数，向服务器发送formdata数据
 * @param {string} url
 * @param {FormData} data
 * @param {function} onprogress
 * @returns {json} 接口返回的数据.
 */
function xhrPost(url, data) {
  var onprogress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return new _promise2.default(function (resolve, reject) {
    if (!url || !data) {
      reject(new Error('error! url & data should not null!'));
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.upload.addEventListener('progress', function (evt) {
      if (evt.lengthComputable) {
        if (evt.total > 0) {
          onprogress && onprogress({ loaded: evt.loaded, total: evt.total });
        }
      } else {
        console.log('warning! total size is unknown:', evt);
      }
    });
    xhr.upload.addEventListener('load', function (evt) {
      //console.log('transfer complete.', evt);
      // if (evt.total > 0) {
      //   onprogress && onprogress({loaded: evt.loaded, total:evt.total});
      // }
    });
    xhr.upload.addEventListener('error', function (evt) {
      console.log('error: ', evt);
      reject(new Error('upload error'));
    });
    xhr.upload.addEventListener('abort', function (evt) {
      console.log('abort: ', evt);
      reject(new Error('user abort'));
    });
    xhr.onreadystatechange = function (evt) {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        try {
          console.log('onreadystatechange: 200 DONE!', evt);
          var res = JSON.parse(xhr.responseText);
          if (!res.errcode) {
            resolve(res);
            return;
          } else {
            reject(new Error('upload error: ' + res.message));
          }
        } catch (e) {
          reject(new Error('upload error! ' + e.message));
        }
      }
    };
    xhr.send(data);
  });
}

exports.default = xhrPost;