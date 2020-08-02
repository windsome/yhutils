/**
 * XMLHttpRequest的基本post函数，向服务器发送formdata数据
 * @param {string} url
 * @param {FormData} data
 * @param {function} onprogress
 * @returns {json} 接口返回的数据.
 */
function xhrPost (url, data, onprogress = null) {
  return new Promise(function(resolve, reject) {
    if (!url || !data) {
      reject(new Error('error! url & data should not null!'));
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.upload.addEventListener('progress', evt => {
      if (evt.lengthComputable) {
        if (evt.total > 0) {
          onprogress && onprogress({ loaded: evt.loaded, total: evt.total });
        }
      } else {
        console.log('warning! total size is unknown:', evt);
      }
    });
    xhr.upload.addEventListener('load', evt => {
      //console.log('transfer complete.', evt);
      // if (evt.total > 0) {
      //   onprogress && onprogress({loaded: evt.loaded, total:evt.total});
      // }
    });
    xhr.upload.addEventListener('error', evt => {
      console.log('error: ', evt);
      reject(new Error('upload error'));
    });
    xhr.upload.addEventListener('abort', evt => {
      console.log('abort: ', evt);
      reject(new Error('user abort'));
    });
    xhr.onreadystatechange = evt => {
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
};

export default xhrPost;