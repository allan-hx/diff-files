const fs = require('fs-extra');
const path = require('path');
const { getFiles, getFileMd5, mkdirs } = require('./utils/index');

module.exports = async function diffFiles(newDirname, oldDirname, outputPath) {
  try {
    const files = await getFiles(newDirname);

    for (let index in files) {
      // 新文件路径
      const filePath = files[index];
      // 老文件路径
      const oldFilePath = filePath.replace(newDirname, oldDirname);
      // 判断老目录是否存在当前文件
      const isExist = await fs.exists(oldFilePath);

      // 老文件夹未存在
      if (!isExist) {
        const dirPath = path.dirname(filePath).replace(newDirname, outputPath);

        mkdirs(dirPath);
        await fs.copyFile(filePath, filePath.replace(newDirname, outputPath));
        continue;
      }

      const newFileMd5 = await getFileMd5(filePath);
      const oldFileMd5 = await getFileMd5(oldFilePath);

      if (newFileMd5 != oldFileMd5) {
        await fs.copyFile(filePath, filePath.replace(newDirname, outputPath));
      }
    }

    console.log('对比完成');
  } catch(err) {
    console.error('对比失败: \n');
    console.error(err);
  }
}
