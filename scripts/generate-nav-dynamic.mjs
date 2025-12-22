// scripts/05-generate-nav-dynamic.mjs
// 用途：读取 blog-data.json 文件，生成动态导航数据
// 依赖：需要 blog-data.json 已存在
// 输出：docs/data/nav-dynamic.json

import { readFile, writeFile, unlink, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'docs', 'public', 'data');
const OUTPUT_DIR = join(__dirname, '..', 'docs', 'data');

// 通用安全写入函数
async function writeJSONSafe(filePath, data) {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2));
  await rename(tmpPath, filePath); // 原子操作
}

async function generateNavDynamic() {
  try {
    // 删除可能存在的旧文件
    const navDynamicPath = join(OUTPUT_DIR, 'nav-dynamic.json');
    try {
      await unlink(navDynamicPath);
    } catch (e) {
      // 如果文件不存在，忽略错误
      if (e.code !== 'ENOENT') {
        console.warn(`Warning: Could not delete ${navDynamicPath}:`, e.message);
      }
    }
    
    console.log('Reading blog-data.json for dynamic navigation...');
    
    // 读取 blog-data.json 文件（包含分类及其最新文章信息）
    const blogDataContent = await readFile(join(DATA_DIR, 'blog-data.json'), 'utf8');
    const blogData = JSON.parse(blogDataContent);
    
    // 提取每个目录的名字和最新文章的链接
    const navDynamic = [];
    
    if (blogData.categories) {
      for (const [categoryKey, categoryInfo] of Object.entries(blogData.categories)) {
        if (categoryInfo && categoryInfo.latestArticle) {
          navDynamic.push({
            text: categoryInfo.name || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
            link: categoryInfo.latestArticle.url,
            category: categoryKey,
            description: categoryInfo.description,
            count: categoryInfo.count,
            order: categoryInfo.order || 50, // 默认顺序值
            type: 'dynamic'
          });
        }
      }
    }
    
    // 按 order 字段排序
    navDynamic.sort((a, b) => a.order - b.order);
    
    console.log('Generated dynamic navigation data:');
    console.log(JSON.stringify(navDynamic, null, 2));
    
    // 保存到文件
    const outputFilePath = join(OUTPUT_DIR, 'nav-dynamic.json');
    await writeJSONSafe(outputFilePath, navDynamic);
    console.log(`✅ Dynamic navigation data saved to ${outputFilePath}`);
    
    return navDynamic;
    
  } catch (error) {
    console.error('❌ Error generating dynamic navigation data:', error);
    throw error;
  }
}

// 如果直接运行此脚本
const isMain = process.argv[1] && process.argv[1].endsWith('generate-nav-dynamic.mjs');
if (isMain) {
  generateNavDynamic().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export { generateNavDynamic };