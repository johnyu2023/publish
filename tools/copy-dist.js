/**
 * 复制构建后的文件到指定目录
 * 用法: node copy-dist.js [目标目录]
 * 示例: node copy-dist.js docs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 获取目标目录参数
const targetDir = process.argv[2];

if (!targetDir) {
  console.error('错误: 请指定目标目录');
  console.log('用法: node copy-dist.js [目标目录]');
  console.log('示例: node copy-dist.js docs');
  process.exit(1);
}

const distDir = path.join(rootDir, 'docs-source', '.vitepress', 'dist');
const targetPath = path.join(rootDir, targetDir);
const rssSource = path.join(rootDir, 'docs-source', 'rss.xml');
const rssTarget = path.join(targetPath, 'rss.xml');
const listSource = path.join(rootDir, 'docs-source', 'data', 'list.json');
const listTarget = path.join(targetPath, 'data', 'list.json');
const listTargetDir = path.dirname(listTarget);

// 确保目标目录存在
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true });
}

// 在 Windows 上使用 xcopy 命令
if (process.platform === 'win32') {
  try {
    // 复制构建文件
    execSync(`xcopy "${distDir}\\*" "${targetPath}\\" /E /I /Y`, { stdio: 'inherit' });
    
    // 复制 RSS 文件
    execSync(`copy "${rssSource}" "${rssTarget}" /Y`, { stdio: 'inherit' });
    
    // 确保 data 目录存在
    if (!fs.existsSync(listTargetDir)) {
      fs.mkdirSync(listTargetDir, { recursive: true });
    }
    // 复制 list.json 文件
    execSync(`copy "${listSource}" "${listTarget}" /Y`, { stdio: 'inherit' });
    
    console.log(`✅ 成功将文件复制到 ${targetDir} 目录`);
  } catch (error) {
    console.error('❌ 复制文件时出错:', error);
    process.exit(1);
  }
} else {
  // 在类 Unix 系统上使用 cp 命令
  try {
    execSync(`cp -R ${distDir}/* ${targetPath}/`, { stdio: 'inherit' });
    execSync(`cp ${rssSource} ${rssTarget}`, { stdio: 'inherit' });
    
    // 确保 data 目录存在
    if (!fs.existsSync(listTargetDir)) {
      fs.mkdirSync(listTargetDir, { recursive: true });
    }
    // 复制 list.json 文件
    execSync(`cp ${listSource} ${listTarget}`, { stdio: 'inherit' });
    console.log(`✅ 成功将文件复制到 ${targetDir} 目录`);
  } catch (error) {
    console.error('❌ 复制文件时出错:', error);
    process.exit(1);
  }
}