// scripts/build-search-index.mjs
import { readFile, writeFile, rename } from 'fs/promises';
import { join, dirname } from 'path';
import segmentitPkg from 'segmentit';
import MiniSearch from 'minisearch';
import { fileURLToPath } from 'url';

const { Segment, useDefault } = segmentitPkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

// 初始化中文分词器
const segmentit = useDefault(new Segment());

// 从命令行参数获取 DATA_DIR，如果没有提供则使用默认路径
const DATA_DIR = process.argv[2] || join(__dirname, '..', 'docs', 'public', 'data');

// 通用安全写入函数
async function writeJSONSafe(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

try {
  // 从 all-articles.json 读取数据
  const allArticlesContent = await readFile(join(DATA_DIR, 'all-articles.json'), 'utf8');
  const articles = JSON.parse(allArticlesContent);

  // 创建并填充 minisearch 索引
  const miniSearch = new MiniSearch({
    fields: ['title', 'description', 'tags', 'tokens'], // fields to index for searching, including tokens
    storeFields: ['url', 'date', 'title', 'originalTags'], // fields to return with search results
    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 2, description: 1, tags: 1.5, tokens: 1 }
    }
  });

  // 添加所有文章到搜索索引
  miniSearch.addAll(articles.map((article, index) => {
    // 使用 segmentit 对标题、描述和标签进行中文分词
    const titleTokens = segmentit.doSegment(article.title || '', { simple: true });
    const descriptionTokens = segmentit.doSegment(article.description || '', { simple: true });
    const tagTokens = [];
    if (Array.isArray(article.tags)) {
      for (const tag of article.tags) {
        tagTokens.push(...segmentit.doSegment(tag || '', { simple: true }));
      }
    }
    
    return {
      ...article,
      id: index, // MiniSearch 需要唯一 ID
      tags: Array.isArray(article.tags) ? article.tags.join(' ') : '', // 用于搜索的字符串格式
      originalTags: article.tags || [],  // 用于存储的原始标签数组
      tokens: [...titleTokens, ...descriptionTokens, ...tagTokens].join(' ') // 预分词结果，用于搜索匹配
    };
  }));

  // 生成搜索索引文件
  await writeJSONSafe(join(DATA_DIR, 'search-index.json'), miniSearch.toJSON());

  console.log(`✅ Generated search-index.json with ${articles.length} articles`);
} catch (error) {
  console.error('Error generating search-index.json:', error);
  process.exit(1);
}