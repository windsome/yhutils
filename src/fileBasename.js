/**
 * 取文件的基础名字. eg:
 * /home/dev/test.jpg => test
 * http://localhost/public/images/logo.jpg => logo
 *
 * @param {string} name 文件路劲或者文件名
 */
export function fileBasename(name) {
  if (name && name.lastIndexOf('.') > 0)
    return name.substr(0, name.lastIndexOf('.'));
  else return name;
}

export default fileBasename;
