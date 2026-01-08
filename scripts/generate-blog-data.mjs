// scripts/generate-blog-data.mjs
import { readFile, writeFile, rename } from 'fs/promises';
import { join, dirname } from 'path';
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

// 从配置文件加载分类信息
const categoriesConfig = JSON.parse(await readFile(join(DATA_DIR, 'categories.json'), 'utf8'));
const CATEGORY_NAMES = {};
Object.entries(categoriesConfig.categories).forEach(([key, value]) => {
  CATEGORY_NAMES[key] = value.name;
});

try {
  // 从 all-articles.json 读取数据
  const allArticlesContent = await readFile(join(DATA_DIR, 'all-articles.json'), 'utf8');
  const articles = JSON.parse(allArticlesContent);

  // 按分类组织文章 - 先处理预定义分类
  const categoryMap = {};
  Object.keys(CATEGORY_NAMES).forEach(category => {
    categoryMap[category] = [];
  });

  // 同时收集所有分类（用于所有目录的最新文章映射）
  const allCategoryMap = {};

  articles.forEach(article => {
    // 从 URL 提取分类
    const pathParts = article.url.split('/');
    if (pathParts.length >= 2) {
      const category = pathParts[1]; // 获取第二部分作为分类
      
      // 只处理非空分类
      if (category && category.trim() !== '') {
        // 添加到预定义分类映射（用于现有逻辑）
        if (categoryMap.hasOwnProperty(category)) {
          categoryMap[category].push(article);
        }
        
        // 添加到所有分类映射（用于所有目录的最新文章）
        if (!allCategoryMap.hasOwnProperty(category)) {
          allCategoryMap[category] = [];
        }
        allCategoryMap[category].push(article);
      }
    }
  });

  // 生成预定义分类的统计信息（保持现有逻辑不变）
  const categoriesInfo = {};
  Object.entries(categoryMap).forEach(([category, articles]) => {
    // 按日期排序，获取最新的文章
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01')
    );

    // 从配置中获取描述，如果是新分类则使用默认格式
    const configDescription = categoriesConfig.categories[category]?.description;
    const fallbackDescription = category === 'dev' ? '本站开发相关的文档' : `关于${CATEGORY_NAMES[category]}的文章`;
    
    categoriesInfo[category] = {
      name: CATEGORY_NAMES[category],
      description: configDescription || fallbackDescription,
      count: sortedArticles.length,
      latestArticle: sortedArticles.length > 0 ? sortedArticles[0] : null
    };
  });

  // 生成所有分类的最新文章映射（新增功能）
  const allCategoriesLatest = {};
  Object.entries(allCategoryMap).forEach(([category, articles]) => {
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01')
    );
    
    // 获取分类名称，优先使用预定义名称，否则使用分类名本身
    const categoryName = CATEGORY_NAMES[category] || category.charAt(0).toUpperCase() + category.slice(1);
    
    allCategoriesLatest[category] = {
      name: categoryName,
      description: categoriesConfig.categories[category]?.description || `关于${categoryName}的文章`,
      count: sortedArticles.length,
      latestArticle: sortedArticles.length > 0 ? sortedArticles[0] : null
    };
  });

  // 保存所有分类的最新文章映射
  await writeJSONSafe(join(DATA_DIR, 'all-categories.json'), allCategoriesLatest);

  // 获取全站最新10篇文章（只包含已定义分类的文章）
  const filteredArticles = articles.filter(article => {
    // 从 URL 提取分类
    const pathParts = article.url.split('/');
    const category = pathParts.length >= 2 ? pathParts[1] : 'other';
    // 只包含在 categories.json 中定义的分类
    return categoryMap.hasOwnProperty(category);
  });
  
  const latestArticles = filteredArticles
    .sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
    .slice(0, 10)
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
  console.log(`✅ Generated all-categories.json with ${Object.keys(allCategoryMap).length} total categories`);

} catch (error) {
  console.error('Error generating blog-data.json:', error);
  process.exit(1);
}