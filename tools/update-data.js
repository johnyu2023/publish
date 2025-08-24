/**
 * 更新数据文件
 * 遍历 docs-source 下的所有子目录，生成目录和文件信息
 * 从文件的 frontmatter 中提取 title, description, date, tags 等信息
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 要忽略的目录
const IGNORE_DIRS = ['.vitepress', 'data', 'assets'];
// 要忽略的文件
const IGNORE_FILES = ['index.md', 'list.md', 'about.md'];
// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.md', '.mdx'];

// 输出文件路径
const OUTPUT_FILE = path.join(__dirname, '../docs-source/data/list.json');

// 存储结果
const result = {
  directories: [],
  articles: []
};

/**
 * 从文件内容中提取 frontmatter 信息
 * @param {string} content 文件内容
 * @returns {Object} 提取的 frontmatter 信息
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s+([\s\S]*?)\s+---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {};
  }
  
  const frontmatterText = match[1];
  const frontmatter = {};
  
  // 提取 title
  const titleMatch = frontmatterText.match(/title:\s*(.+)$/m);
  if (titleMatch) {
    frontmatter.title = titleMatch[1].trim().replace(/['"]/g, '');
  }
  
  // 提取 description
  const descriptionMatch = frontmatterText.match(/description:\s*(.+)$/m);
  if (descriptionMatch) {
    frontmatter.description = descriptionMatch[1].trim().replace(/['"]/g, '');
  }
  
  // 提取 date
  const dateMatch = frontmatterText.match(/date:\s*(.+)$/m);
  if (dateMatch) {
    frontmatter.date = dateMatch[1].trim();
  }
  
  // 提取 tags
  const tagsMatch = frontmatterText.match(/tags:\s*\[(.*)\]/m);
  if (tagsMatch) {
    frontmatter.tags = tagsMatch[1].split(',')
      .map(tag => tag.trim().replace(/['"]/g, ''))
      .filter(tag => tag);
  } else {
    frontmatter.tags = [];
  }
  
  return frontmatter;
}

/**
 * 递归遍历目录
 * @param {string} dir 目录路径
 * @param {string} baseDir 基础目录路径
 */
function traverseDirectory(dir, baseDir) {
  const relativePath = path.relative(baseDir, dir);
  const dirName = path.basename(relativePath);
  
  // 如果不是根目录且不是被忽略的目录，则添加到目录列表
  if (relativePath && !IGNORE_DIRS.includes(dirName)) {
    result.directories.push(dirName);
  }

  // 读取目录内容
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    // 跳过被忽略的目录
    if (IGNORE_DIRS.includes(item)) {
      continue;
    }
    
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      traverseDirectory(itemPath, baseDir);
    } else if (stat.isFile() && SUPPORTED_EXTENSIONS.includes(path.extname(item))) {
      // 跳过被忽略的文件
      if (IGNORE_FILES.includes(item)) {
        continue;
      }
      
      // 处理 Markdown 文件
      const fileDir = path.dirname(itemPath);
      const dirRelativePath = path.relative(baseDir, fileDir);
      const directory = path.basename(dirRelativePath);
      
      // 如果是根目录下的文件，则跳过
      if (!dirRelativePath || dirRelativePath === '.') {
        continue;
      }
      
      // 如果是被忽略的目录，则跳过
      if (IGNORE_DIRS.includes(directory)) {
        continue;
      }
      
      const content = fs.readFileSync(itemPath, 'utf-8');
      
      // 提取 frontmatter 信息
      const frontmatter = extractFrontmatter(content);
      
      // 如果没有从 frontmatter 中提取到标题，则尝试从其他地方提取
      let title = frontmatter.title;
      if (!title) {
        // 尝试从 Markdown 标题中提取
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          // 使用文件名作为标题
          title = item.replace(/\.(md|mdx)$/, '');
        }
      }
      
      // 生成 URL
      const url = `/${directory}/${item.replace(/\.(md|mdx)$/, '')}`;
      
      // 添加到文章列表
      result.articles.push({
        directory: directory,
        title: title,
        url: url,
        date: frontmatter.date || "", // 如果没有日期，则留空，后面会设置
        description: frontmatter.description || "",
        tags: frontmatter.tags || []
      });
    }
  }
}

/**
 * 设置文章的日期
 * 如果文章没有日期，则使用默认日期
 */
function setArticleDates() {
  // 设置日期
  for (const article of result.articles) {
    // 如果文章已经有日期，则跳过
    if (article.date) {
      continue;
    }
    
    // 使用默认日期
    article.date = "2025-01-01";
  }
}

// 主函数
function main() {
  const baseDir = path.join(__dirname, '../docs-source');
  
  // 遍历目录
  traverseDirectory(baseDir, baseDir);
  
  // 设置文章日期
  setArticleDates();
  
  // 按日期倒序排序文章
  result.articles.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // 写入结果到文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  
  console.log(`已更新数据文件: ${OUTPUT_FILE}`);
  console.log(`- 目录数量: ${result.directories.length}`);
  console.log(`- 文章数量: ${result.articles.length}`);
}

// 执行主函数
main();
