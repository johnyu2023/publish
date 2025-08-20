import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  contentDirs: ['docs-source/posts', 'docs-source/ai', 'docs-source/think'],
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

// 获取所有 Markdown 文件
function getAllMarkdownFiles() {
  let files = [];
  
  for (const dir of config.contentDirs) {
    if (fs.existsSync(dir)) {
      const dirFiles = fs.readdirSync(dir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(dir, file));
      files = [...files, ...dirFiles];
    }
  }
  
  return files;
}

// 解析 Markdown 文件的元数据
function parseMarkdownFiles(files) {
  return files.map(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { data } = matter(content);
    // 处理路径，确保使用正斜杠并移除 docs-source 前缀
    let relativePath = file
      .replace(/^docs-source[\/\\]/, '') // 移除开头的 docs-source/ 或 docs-source\
      .replace('.md', '')
      .replace(/\\/g, '/')
      .replace(/_/g, '-'); // 将下划线替换为连字符
    
    // 使用配置的 base 路径，而不是硬编码 'publish/'
    const urlPath = config.base.startsWith('/') 
      ? config.base.substring(1) + relativePath 
      : config.base + relativePath;
    
    // 跳过索引文件
    if (path.basename(file) === 'index.md') {
      return null;
    }
    
    return {
      title: data.title || path.basename(file, '.md'),
      description: data.description || '',
      link: `${config.siteUrl}/${urlPath}`,
      guid: `${config.siteUrl}/${urlPath}`,
      pubDate: data.date ? new Date(data.date) : new Date(),
      categories: data.tags || [],
      file: file
    };
  }).filter(item => item !== null); // 过滤掉空项
}

  // 生成 RSS XML 内容
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
    // 从完整URL中提取相对路径
    const relativePath = item.file
      .replace(/^docs-source[\/\\]/, '')
      .replace('.md', '')
      .replace(/\\/g, '/')
      .replace(/_/g, '-');
    
    // 使用完整的站点URL
    const itemPath = `${config.siteUrl}/${relativePath}`;
    
    const categories = item.categories.map(category => 
      `      <category>${category}</category>`
    ).join('\n');
    
    rssContent += `
    <item>
      <title>${item.title}</title>
      <description>${item.description}</description>
      <link>${itemPath}</link>
      <guid>${itemPath}</guid>
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

// 主函数
function updateRss() {
  console.log('开始更新 RSS 文件...');
  console.log(`当前环境: ${isProduction ? '生产' : '开发'}, 基础路径: ${config.base}`);
  
  const files = getAllMarkdownFiles();
  console.log(`找到 ${files.length} 个 Markdown 文件`);
  
  const items = parseMarkdownFiles(files);
  console.log('解析文件元数据完成');
  
  const rssContent = generateRssXml(items);
  
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