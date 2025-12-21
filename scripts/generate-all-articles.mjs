// scripts/generate-all-articles.mjs
// 用途：扫描 docs/ 下所有 Markdown 文件，提取 frontmatter，
//       清洗后生成 docs/public/data/all-articles.json，供搜索、首页聚合等功能使用。

import { readdir, readFile, writeFile, rename, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'docs');

// 从命令行参数获取 DATA_DIR，如果没有提供则使用默认路径
const DATA_DIR = process.argv[2] || join(__dirname, '..', 'docs', 'public', 'data');

// 排除非文章页面（这些页面不参与聚合或搜索）
const EXCLUDE_PATHS = [
  '/about',
  '/sample-article',
  '/experiments',
  '/mermaid-test',
  '/test-mermaid-modal',
  '/search'
];

/**
 * 安全写入 JSON 文件（使用临时文件 + 原子重命名，避免写入中断导致文件损坏）
 * @param {string} filePath - 目标文件路径
 * @param {any} data - 要写入的数据
 */
async function writeJSONSafe(filePath, data) {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  await rename(tmpPath, filePath);
}

/**
 * 清洗字符串字段：去除首尾空格，空值转为空字符串
 * @param {any} value - 待清洗的值
 * @returns {string}
 */
function cleanString(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
}

/**
 * 清洗标签数组：去除每个标签的空格，过滤空字符串
 * @param {any} tags - 原始 tags 字段（可能为字符串、数组或 undefined）
 * @returns {string[]}
 */
function cleanTags(tags) {
  if (!Array.isArray(tags)) {
    // 如果 tags 不是数组，尝试转为数组（兼容单个标签字符串的情况）
    if (typeof tags === 'string') {
      tags = [tags];
    } else {
      tags = [];
    }
  }
  return tags
    .map(tag => cleanString(tag))
    .filter(tag => tag.length > 0);
}

/**
 * 递归获取 docs/ 目录下所有 .md 文件（跳过 .vitepress 和 data 目录）
 * @param {string} dir - 当前目录路径
 * @returns {Promise<string[]>}
 */
async function getAllMarkdownFiles(dir) {
  let results = [];
  const files = await readdir(dir);
  const { stat } = await import('fs/promises');

  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      // 跳过特殊目录
      if (!['.vitepress', 'data'].includes(file)) {
        results = results.concat(await getAllMarkdownFiles(filePath));
      }
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

// ======================
// 主逻辑开始
// ======================
try {
  // 确保输出目录存在
  await mkdir(DATA_DIR, { recursive: true });

  // 获取所有 Markdown 文件路径
  const markdownFiles = await getAllMarkdownFiles(DOCS_DIR);
  const articles = [];

  for (const file of markdownFiles) {
    // 计算相对 URL 路径（如 /ai/future-of-ai）
    const relativePath = file.replace(DOCS_DIR, '').replace(/\\/g, '/');
    const content = await readFile(file, 'utf8');
    const { data } = matter(content);

    // 构建 URL 路径
    let urlPath = relativePath.replace(/\.md$/, '');
    if (urlPath.endsWith('/index')) {
      urlPath = urlPath.slice(0, -5); // 移除 /index
    }
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath;
    }

    // 跳过排除页面
    if (EXCLUDE_PATHS.some(p => urlPath.startsWith(p))) {
      continue;
    }

    // 将日期格式转换为 YYYY-MM-DD
    let formattedDate = data.date;
    if (data.date) {
      const dateObj = new Date(data.date);
      formattedDate = dateObj.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
    }

    // 清洗并构建文章对象
    const cleanedArticle = {
      url: cleanString(urlPath),
      title: cleanString(data.title) || 'Untitled',
      date: formattedDate,
      tags: cleanTags(data.tags),
      description: cleanString(data.description)
    };

    articles.push(cleanedArticle);
  }

  // 按 date 倒序排序（最新在前）
  articles.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  // 安全写入 JSON 文件
  await writeJSONSafe(join(DATA_DIR, 'all-articles.json'), articles);
  console.log(`✅ Generated all-articles.json with ${articles.length} articles`);

} catch (error) {
  console.error('❌ Error generating all-articles.json:', error);
  process.exit(1);
}