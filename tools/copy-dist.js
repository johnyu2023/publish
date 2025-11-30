/**
 * 复制构建后的文件到指定目录
 * 用法: node copy-dist.js [目标目录]
 * 示例: node copy-dist.js docs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ==============================
// 配置常量 - 定义需要拷贝的文件和目录
// ==============================

// 源目录和文件配置
const SOURCE_CONFIG = {
  // VitePress 构建生成的静态文件目录
  distDir: path.join('{rootDir}', 'docs-source', '.vitepress', 'dist'),
  // RSS 订阅文件
  rssSource: path.join('{rootDir}', 'docs-source', 'rss.xml'),
  // 文章列表数据文件
  listSource: path.join('{rootDir}', 'docs-source', 'data', 'list.json'),
  // 文章目录定义文件
  categorySource: path.join('{rootDir}', 'docs-source', 'data', 'category.json'),
  // 历史事件数据文件
  historySource: path.join('{rootDir}', 'docs-source', 'data', 'history.json')
};

// ==============================

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

// 解析源目录和文件的实际路径
const distDir = SOURCE_CONFIG.distDir.replace('{rootDir}', rootDir);
const targetPath = path.join(rootDir, targetDir);
const rssSource = SOURCE_CONFIG.rssSource.replace('{rootDir}', rootDir);
const rssTarget = path.join(targetPath, 'rss.xml');
const listSource = SOURCE_CONFIG.listSource.replace('{rootDir}', rootDir);
const listTarget = path.join(targetPath, 'data', 'list.json');
const listTargetDir = path.dirname(listTarget);
const categorySource = SOURCE_CONFIG.categorySource.replace('{rootDir}', rootDir);
const categoryTarget = path.join(targetPath, 'data', 'category.json');
const historySource = SOURCE_CONFIG.historySource.replace('{rootDir}', rootDir);
const historyTarget = path.join(targetPath, 'data', 'history.json');

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
    
    // 复制 category.json 文件
    execSync(`copy "${categorySource}" "${categoryTarget}" /Y`, { stdio: 'inherit' });
    
    // 复制 history.json 文件
    execSync(`copy "${historySource}" "${historyTarget}" /Y`, { stdio: 'inherit' });
    
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
    
    // 复制 category.json 文件
    execSync(`cp ${categorySource} ${categoryTarget}`, { stdio: 'inherit' });
    
    // 复制 history.json 文件
    execSync(`cp ${historySource} ${historyTarget}`, { stdio: 'inherit' });
    
    console.log(`✅ 成功将文件复制到 ${targetDir} 目录`);
  } catch (error) {
    console.error('❌ 复制文件时出错:', error);
    process.exit(1);
  }
}