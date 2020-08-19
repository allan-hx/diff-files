#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const { version, description } = require('../package.json');
const diffFiles = require('../src/main');

commander
  .version(version)
  .description(description)
  .parse(process.argv);

if (!commander.args || !commander.args[0]) {
  console.log('diff-files: 对比文件目录不能为空');
  return;
}

if (commander.args.length == 1) {
  console.log('diff-files: 文件输出目录不能为空');
  return;
}

let diffDir = commander.args[0];
let outputDir = commander.args[1];

if (diffDir[0] == '.') {
  diffDir = path.join(process.cwd(), diffDir)
}

if (outputDir[1] == '.') {
  outputDir = path.join(process.cwd(), outputDir)
}

diffFiles(process.cwd(), diffDir, outputDir);
