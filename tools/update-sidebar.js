/**
 * 自动生成 VitePress 侧边栏配置的脚本
 * 根据目录结构动态生成侧边栏配置
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsSourceDir = path.join(rootDir, 'docs-source');
const configPath = path.join(docsSourceDir, '.vitepress/sidebar.js');

/**
 * 从 Markdown 文件中提取标题和日期
 * @param {string} filePath - Markdown 文件路径
 * @returns {Object} 包含标题和日期的对象
 */
function extractInfoFromMarkdown(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let title = '';
    let date = '';
    
    // 尝试从 frontmatter 中提取 title 和 date
    const frontmatterMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatter = frontmatterMatch[1];
      
      // 提取标题
      const titleMatch = frontmatter.match(/title:\s*([^\n]*)/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
      
      // 提取日期
      const dateMatch = frontmatter.match(/date:\s*([^\n]*)/);
      if (dateMatch && dateMatch[1]) {
        date = dateMatch[1].trim();
      }
    }
    
    // 如果 frontmatter 中没有找到标题，尝试从第一个 # 标题中提取
    if (!title) {
      const headingMatch = content.match(/^#\s+(.*?)$/m);
      if (headingMatch && headingMatch[1]) {
        title = headingMatch[1].trim();
      }
    }
    
    // 如果都没找到标题，使用文件名作为标题
    if (!title) {
      title = path.basename(filePath, '.md').replace(/-/g, ' ');
    }
    
    // 如果没有找到日期，尝试从文件内容中查找日期格式
    if (!date) {
      const contentDateMatch = content.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/);
      if (contentDateMatch) {
        date = contentDateMatch[0];
      } else {
        // 使用文件修改时间作为备选
        const stats = fs.statSync(filePath);
        date = stats.mtime.toISOString().split('T')[0];
      }
    }
    
    return { title, date };
  } catch (error) {
    console.error(`提取文件 ${filePath} 的信息时出错:`, error);
    return { 
      title: path.basename(filePath, '.md').replace(/-/g, ' '),
      date: new Date().toISOString().split('T')[0]
    };
  }
}

/**
 * 生成目录的侧边栏配置
 * @param {string} dirPath - 目录路径
 * @param {string} basePath - 基础路径
 * @returns {Array} 侧边栏配置数组
 */
function generateSidebarForDir(dirPath, basePath) {
  const items = [];
  const files = fs.readdirSync(dirPath);
  
  // 收集文件信息
  const fileInfos = [];
  files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .forEach(file => {
      const filePath = path.join(dirPath, file);
      const relativePath = path.relative(docsSourceDir, filePath).replace(/\\/g, '/');
      const link = `/${relativePath.replace(/\.md$/, '')}`;
      const { title, date } = extractInfoFromMarkdown(filePath);
      
      fileInfos.push({
        title,
        link,
        date,
        filePath
      });
    });
  
  // 按日期倒序排序（最新的在前面）
  fileInfos.sort((a, b) => {
    // 将日期转换为时间戳进行比较
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA; // 倒序排列
  });
  
  // 生成侧边栏项目
  fileInfos.forEach(info => {
    items.push({
      text: info.title,
      link: info.link
    });
  });
  
  return items;
}

/**
 * 生成完整的侧边栏配置
 * @returns {Object} 侧边栏配置对象
 */
function generateSidebar() {
  const sidebar = {};
  
  // 处理 AI 相关文章
  const aiDir = path.join(docsSourceDir, 'ai');
  if (fs.existsSync(aiDir)) {
    sidebar['/ai/'] = [
      {
        text: 'AI 相关',
        collapsed: false,
        items: generateSidebarForDir(aiDir, '/ai/')
      }
    ];
  }
  
  // 处理博客文章
  const postsDir = path.join(docsSourceDir, 'posts');
  if (fs.existsSync(postsDir)) {
    sidebar['/posts/'] = [
      {
        text: '文章',
        collapsed: false,
        items: generateSidebarForDir(postsDir, '/posts/')
      }
    ];
  }
  
  return sidebar;
}

// 生成侧边栏配置
const sidebarConfig = generateSidebar();

// 确保 .vitepress 目录存在
const vitepressDir = path.join(docsSourceDir, '.vitepress');
if (!fs.existsSync(vitepressDir)) {
  fs.mkdirSync(vitepressDir, { recursive: true });
}

// 将配置写入文件
const configContent = `// 此文件由 update-sidebar.js 自动生成，请勿手动修改
export default ${JSON.stringify(sidebarConfig, null, 2)};
`;

fs.writeFileSync(configPath, configContent, 'utf-8');
console.log(`侧边栏配置已更新: ${configPath}`);

// 导出生成的侧边栏配置
export default sidebarConfig;