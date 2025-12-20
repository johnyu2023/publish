// scripts/generate-blog-data.mjs
import { readFile, writeFile, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'docs', 'data');

// 通用安全写入函数
async function writeJSONSafe(filePath, data) {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2));
  await rename(tmpPath, filePath); // 原子操作
}

// 分类映射
const CATEGORY_NAMES = {
  'ai': '人工智能',
  'foundation': '基础知识',
  'fullstack': '全栈开发',
  'think': '观察思考',
  'other': '技术文档'
};

try {
  // 从 all-articles.json 读取数据
  const allArticlesContent = await readFile(join(DATA_DIR, 'all-articles.json'), 'utf8');
  const articles = JSON.parse(allArticlesContent);

  // 按分类组织文章
  const categoryMap = {};
  Object.keys(CATEGORY_NAMES).forEach(category => {
    categoryMap[category] = [];
  });

  articles.forEach(article => {
    // 从 URL 提取分类
    const pathParts = article.url.split('/');
    if (pathParts.length >= 2) {
      const category = pathParts[1]; // 获取第二部分作为分类
      if (categoryMap.hasOwnProperty(category)) {
        categoryMap[category].push(article);
      }
    }
  });

  // 生成分类统计信息
  const categoriesInfo = {};
  Object.entries(categoryMap).forEach(([category, articles]) => {
    // 按日期排序，获取最新的文章
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01')
    );

    categoriesInfo[category] = {
      name: CATEGORY_NAMES[category],
      description: `关于${CATEGORY_NAMES[category]}的文章`,
      count: sortedArticles.length,
      latestArticle: sortedArticles.length > 0 ? sortedArticles[0] : null
    };
  });

  // 获取全站最新5篇文章
  const latestArticles = articles
    .sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
    .slice(0, 5)
    .map(article => {
      // 从 URL 提取分类
      const pathParts = article.url.split('/');
      const category = pathParts.length >= 2 ? pathParts[1] : 'other';
      
      return {
        category: category,
        categoryName: CATEGORY_NAMES[category] || category,
        title: article.title,
        date: article.date,
        url: article.url
      };
    });

  // 生成 blog-data.json
  const blogData = {
    categories: categoriesInfo,
    latestArticles: latestArticles,
    totalArticles: articles.length,
    generatedAt: new Date().toISOString()
  };

  await writeJSONSafe(join(DATA_DIR, 'blog-data.json'), blogData);

  console.log(`✅ Generated blog-data.json with ${Object.keys(CATEGORY_NAMES).length} categories and ${articles.length} total articles`);
} catch (error) {
  console.error('Error generating blog-data.json:', error);
  process.exit(1);
}