const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// 获取文件夹文件
exports.getFiles = async (dir) => {
  let fileList = [];

  try {
    const list = await eachDirectory(dir);

    // 遍历
    for (let item of list) {
      // 判断是否是文件
      const _isFile = await isFile(item);

      if (_isFile) {
        fileList.push(item);
      } else {
        const files = await exports.getFiles(item);
        fileList = fileList.concat(files);
      }
    }
  } catch(err) {
    console.error(err);
  }

  return fileList;
}

// 获取文件MD5
exports.getFileMd5 = function(filePath) {
  return new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(filePath);
    const fsHash = crypto.createHash('md5');

    stream.on('end', function() {
      const md5 = fsHash.digest('hex');
      resolve(md5);
    });

    stream.on('data', function(data) {
      fsHash.update(data);
    });
  });
}

// 文件夹目录创建
exports.mkdirs = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (exports.mkdirs(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 获取目录下的所有文件和文件夹
function eachDirectory (filePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        console.error(`==> 读取目录失败: ${filePath}`);
        reject(err);
        return;
      }

      // 拼接文件目录
      const filesPath = files.map((name) => {
        return path.join(filePath, name);
      });

      resolve(filesPath);
    });
  });
}

// 判断是否是图片文件
function isFile(_path) {
  return new Promise((resolve, reject) => {
    fs.stat(_path, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stats.isFile());
    });
  });
}
