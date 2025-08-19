/**
 * 清理脚本 - 删除 docs 和 publish 目录中的所有文件
 * 使用 Node.js 原生 fs 模块代替 rimraf，避免 Windows 路径中通配符的问题
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * 递归删除目录中的所有文件和子目录，但保留目录本身
 * @param {string} dirPath - 要清空的目录路径
 */
function emptyDirectory(dirPath) {
  // 检查目录是否存在
  if (!fs.existsSync(dirPath)) {
    console.log(`目录不存在: ${dirPath}`);
    return;
  }

  // 读取目录内容
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 递归删除子目录中的内容
      emptyDirectory(filePath);
      // 删除空目录
      fs.rmdirSync(filePath);
    } else {
      // 删除文件
      fs.unlinkSync(filePath);
    }
  }
}

// 要清空的目录
const dirsToClean = [
  path.join(rootDir, 'docs'),
  path.join(rootDir, 'publish')
];

// 清空每个目录
for (const dir of dirsToClean) {
  console.log(`清空目录: ${dir}`);
  try {
    emptyDirectory(dir);
    console.log(`成功清空目录: ${dir}`);
  } catch (error) {
    console.error(`清空目录时出错 ${dir}:`, error);
  }
}

console.log('清理完成');