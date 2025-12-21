// scripts/build-search-index.mjs
import { readFile, writeFile, rename } from 'fs/promises';
import { join, dirname } from 'path';
import MiniSearch from 'minisearch';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 从命令行参数获取 DATA_DIR，如果没有提供则使用默认路径
const DATA_DIR = process.argv[2] || join(__dirname, '..', 'docs', 'public', 'data');

// 通用安全写入函数
async function writeJSONSafe(filePath, data) {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2));
  await rename(tmpPath, filePath); // 原子操作
}

try {
  // 从 all-articles.json 读取数据
  const allArticlesContent = await readFile(join(DATA_DIR, 'all-articles.json'), 'utf8');
  const articles = JSON.parse(allArticlesContent);

  // 创建并填充 minisearch 索引
  const miniSearch = new MiniSearch({
    fields: ['title', 'description', 'tags'], // fields to index for searching
    storeFields: ['url', 'date', 'title', 'originalTags'], // fields to return with search results
    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 2, description: 1, tags: 1.5 }
    },
    // 适配中文内容的分词处理
    tokenize: (text) => text
      .split(/[\s\-，。！？、]+/)
      .map(token => token.trim())
      .filter(token => token.length > 0),
    processTerm: (term) => {
      const cleaned = term.trim().toLowerCase();
      return cleaned.length > 1 ? cleaned : null;
    }
  });

  // 添加所有文章到搜索索引
  miniSearch.addAll(articles.map((article, index) => ({
    ...article,
    id: index, // MiniSearch 需要唯一 ID
    tags: Array.isArray(article.tags) ? article.tags.join(' ') : '', // 用于搜索的字符串格式
    originalTags: article.tags || []  // 用于存储的原始标签数组
  })));

  // 生成搜索索引文件
  await writeJSONSafe(join(DATA_DIR, 'search-index.json'), miniSearch.toJSON());

  console.log(`✅ Generated search-index.json with ${articles.length} articles`);
} catch (error) {
  console.error('Error generating search-index.json:', error);
  process.exit(1);
}