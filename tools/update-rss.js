import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检测环境
const isProduction = process.env.NODE_ENV === 'production';
const deployEnv = process.env.DEPLOY_ENV || '';

// 直接从 package.json 的 scripts 中检测当前运行的命令
const runningCommand = process.env.npm_lifecycle_event || '';
const isPreview = runningCommand === 'preview' || process.argv.includes('preview');

// 检测是否存在 publish 目录，如果存在则可能是在预览或生产环境
const publishDirExists = fs.existsSync('publish') && fs.statSync('publish').isDirectory();

// 配置项
const config = {
  title: 'AI时代的技术分享',
  description: '分享技术心得',
  // 始终使用生产环境的站点URL，确保RSS链接一致
  siteUrl: 'https://johnyu2023.github.io/publish',
  language: 'zh-CN',
  ttl: 60,
  rssFile: 'docs-source/rss.xml',
  // 数据文件路径
  dataFile: path.join(__dirname, '../docs-source/data/list.json'),
  // 根据环境设置不同的基础路径
  base: isProduction || deployEnv === 'LOCAL_PREVIEW' ? '/publish/' : '/'
};

// 调试输出当前环境配置
console.log('环境变量:', {
  NODE_ENV: process.env.NODE_ENV,
  DEPLOY_ENV: process.env.DEPLOY_ENV,
  npm_lifecycle_event: process.env.npm_lifecycle_event,
  isProduction,
  deployEnv,
  isPreview,
  siteUrl: config.siteUrl
});

/**
 * 从 list.json 文件中获取文章数据
 * @returns {Array} 文章数据数组
 */
function getArticlesFromJson() {
  try {
    // 读取 list.json 文件
    const jsonData = JSON.parse(fs.readFileSync(config.dataFile, 'utf8'));
    console.log(`从 ${config.dataFile} 读取了 ${jsonData.articles.length} 篇文章数据`);
    return jsonData.articles;
  } catch (error) {
    console.error(`读取数据文件失败: ${error.message}`);
    return [];
  }
}

/**
 * 将文章数据转换为 RSS 项目格式
 * @param {Array} articles 文章数据数组
 * @returns {Array} RSS 项目数组
 */
function convertArticlesToRssItems(articles) {
  return articles.map(article => {
    // 从 URL 中提取相对路径（去掉开头的斜杠）
    const relativePath = article.url.startsWith('/') ? article.url.substring(1) : article.url;
    
    // 使用完整的站点URL
    const itemPath = `${config.siteUrl}/${relativePath}`;
    
    return {
      title: article.title,
      description: article.description || '',
      link: itemPath,
      guid: itemPath,
      pubDate: article.date ? new Date(article.date) : new Date(),
      categories: article.tags || []
    };
  });
}

/**
 * 生成 RSS XML 内容
 * @param {Array} items RSS 项目数组
 * @returns {string} RSS XML 内容
 */
function generateRssXml(items) {
  // 按日期排序，最新的在前面
  items.sort((a, b) => b.pubDate - a.pubDate);
  
  const now = new Date();
  
  // 格式化日期为 RSS 格式
  const formatDate = (date) => {
    return date.toUTCString();
  };
  
  // 使用完整的站点URL
  const siteUrl = config.siteUrl;
  const rssPath = `${siteUrl}/rss.xml`;
  
  let rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.title}</title>
    <description>${config.description}</description>
    <link>${siteUrl}</link>
    <atom:link href="${rssPath}" rel="self" type="application/rss+xml"/>
    <language>${config.language}</language>
    <lastBuildDate>${formatDate(now)}</lastBuildDate>
    <ttl>${config.ttl}</ttl>
    `;
    
  // 添加每个文章项
  for (const item of items) {
    const categories = item.categories.map(category => 
      `      <category>${category}</category>`
    ).join('\n');
    
    rssContent += `
    <item>
      <title>${item.title}</title>
      <description>${item.description}</description>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${formatDate(item.pubDate)}</pubDate>
${categories}
    </item>
    `;
  }
  
  rssContent += `
  </channel>
</rss>
`;

  return rssContent;
}

/**
 * 主函数 - 更新 RSS 文件
 */
function updateRss() {
  console.log('开始更新 RSS 文件...');
  console.log(`当前环境: ${isProduction ? '生产' : '开发'}, 基础路径: ${config.base}`);
  
  // 从 list.json 获取文章数据
  const articles = getArticlesFromJson();
  
  if (articles.length === 0) {
    console.error('没有找到文章数据，RSS 更新失败');
    return;
  }
  
  // 转换为 RSS 项目格式
  const rssItems = convertArticlesToRssItems(articles);
  console.log(`转换了 ${rssItems.length} 篇文章到 RSS 格式`);
  
  // 生成 RSS XML 内容
  const rssContent = generateRssXml(rssItems);
  
  // 写入 RSS 文件
  fs.writeFileSync(config.rssFile, rssContent, 'utf8');
  console.log(`RSS 文件已更新: ${config.rssFile}`);
  
  // 如果已经构建了网站，也更新 docs 和 publish 目录下的 RSS 文件
  const docsRssPath = 'docs/rss.xml';
  if (fs.existsSync('docs') && fs.statSync('docs').isDirectory()) {
    fs.writeFileSync(docsRssPath, rssContent, 'utf8');
    console.log(`已复制 RSS 文件到: ${docsRssPath}`);
  }
  
  const publishRssPath = 'publish/rss.xml';
  if (fs.existsSync('publish') && fs.statSync('publish').isDirectory()) {
    fs.writeFileSync(publishRssPath, rssContent, 'utf8');
    console.log(`已复制 RSS 文件到: ${publishRssPath}`);
  }
}

// 执行更新
updateRss();