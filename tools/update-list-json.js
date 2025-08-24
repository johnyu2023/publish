import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 JSON 文件
const jsonPath = path.join(__dirname, '../docs-source/data/list-test.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(jsonContent);

// 提取所有目录名并去重
const directories = [...new Set(data.map(item => item.directory))];

// 创建新的数据结构
const newData = {
  articles: data,
  directories: directories
};

// 写入 JSON 文件
fs.writeFileSync(jsonPath, JSON.stringify(newData, null, 2), 'utf-8');

console.log('JSON 文件已更新，添加了目录列表');
console.log('目录列表:', directories);