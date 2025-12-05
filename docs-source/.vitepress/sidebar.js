// 从 list.json 动态生成侧边栏配置
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 目录名称映射
const directoryTitles = {
  'ai': '学习笔记',
  'foundation': '基础知识',
  'other': '技术文档',
  'think': '观察思考',
  'web': '前端开发'
};

// 读取 list.json 文件
function generateSidebar() {
  try {
    // 读取 list.json 文件
    const jsonPath = path.resolve(__dirname, '../data/list.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // 按目录分组文章
    const articlesByDirectory = {};
    
    // 初始化目录
    jsonData.directories.forEach(dir => {
      articlesByDirectory[dir] = [];
    });
    
    // 将文章按目录分组
    jsonData.articles.forEach(article => {
      if (articlesByDirectory[article.directory]) {
        articlesByDirectory[article.directory].push({
          text: article.title,
          link: article.url
        });
      }
    });
    
    // 生成侧边栏配置
    const sidebar = {};
    
    // 为每个目录创建侧边栏配置
    Object.keys(articlesByDirectory).forEach(dir => {
      if (articlesByDirectory[dir].length > 0) {
        sidebar[`/${dir}/`] = [
          {
            text: directoryTitles[dir] || dir,
            collapsed: false,
            items: articlesByDirectory[dir]
          }
        ];
      }
    });
    
    return sidebar;
  } catch (error) {
    console.error('生成侧边栏配置时出错:', error);
    // 返回空配置作为后备
    return {};
  }
}

// 导出生成的侧边栏配置
export default generateSidebar();
