// docs/.vitepress/scripts/generate-nav-from-categories.js
// 用途：读取 blog-data.json 文件，提取每个目录的名字和最新文章的链接

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'public', 'data');
const OUTPUT_DIR = join(__dirname, '..', '..', 'public', 'data');

async function generateNavFromCategories() {
  try {
    // 读取 blog-data.json 文件（包含分类及其最新文章信息）
    const blogDataContent = await readFile(join(DATA_DIR, 'blog-data.json'), 'utf8');
    const blogData = JSON.parse(blogDataContent);
    
    // 提取每个目录的名字和最新文章的链接
    const navData = [];
    
    if (blogData.categories) {
      for (const [categoryKey, categoryInfo] of Object.entries(blogData.categories)) {
        if (categoryInfo && categoryInfo.latestArticle) {
          navData.push({
            text: categoryInfo.name || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1), // 使用名称或首字母大写的键名
            link: categoryInfo.latestArticle.url,
            category: categoryKey,
            description: categoryInfo.description,
            count: categoryInfo.count
          });
        }
      }
    }
    
    // 添加额外的导航项（如 Home、About）
    const fullNavData = [
      { text: 'Home', link: '/' },
      ...navData,
      { text: 'About', link: '/about' }
    ];
    
    // 保存到文件
    const outputFilePath = join(OUTPUT_DIR, 'nav-data.json');
    await writeFile(outputFilePath, JSON.stringify(fullNavData, null, 2), 'utf8');
    
    console.log('Navigation data generated successfully');
    return fullNavData;
    
  } catch (error) {
    console.error('Error generating navigation data:', error);
    throw error;
  }
}

// 立即执行
generateNavFromCategories().then(() => {
  console.log('Script completed successfully');
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});

export { generateNavFromCategories };