// scripts/06-merge-nav-data.mjs
// 用途：合并静态和动态导航数据
// 依赖：需要 nav-static.json 和 nav-dynamic.json 已存在
// 输出：docs/public/data/nav-data.json

import { readFile, writeFile, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'docs', 'data');
const OUTPUT_DIR = join(__dirname, '..', 'docs', 'data');

async function mergeNavData() {
  try {
    // 删除可能存在的旧文件
    const navDataPath = join(OUTPUT_DIR, 'nav-data.json');
    try {
      await unlink(navDataPath);
    } catch (e) {
      // 如果文件不存在，忽略错误
      if (e.code !== 'ENOENT') {
        console.warn(`Warning: Could not delete ${navDataPath}:`, e.message);
      }
    }
    
    console.log('Merging static and dynamic navigation data...');
    
    // 读取静态导航数据
    const navStaticContent = await readFile(join(DATA_DIR, 'nav-static.json'), 'utf8');
    const navStatic = JSON.parse(navStaticContent);
    
    // 读取动态导航数据
    const navDynamicContent = await readFile(join(DATA_DIR, 'nav-dynamic.json'), 'utf8');
    const navDynamic = JSON.parse(navDynamicContent);
    
    // 合并数据并按 order 排序
    const allNavItems = [...navStatic, ...navDynamic];
    allNavItems.sort((a, b) => a.order - b.order);
    
    console.log('Merged navigation data:');
    console.log(JSON.stringify(allNavItems, null, 2));
    
    // 保存合并后的数据
    const outputFilePath = join(OUTPUT_DIR, 'nav-data.json');
    await writeFile(outputFilePath, JSON.stringify(allNavItems, null, 2), 'utf8');
    console.log(`✅ Merged navigation data saved to ${outputFilePath}`);
    
    return allNavItems;
    
  } catch (error) {
    console.error('❌ Error merging navigation data:', error);
    throw error;
  }
}

// 如果直接运行此脚本
const isMain = process.argv[1] && process.argv[1].endsWith('06-merge-nav-data.mjs');
if (isMain) {
  mergeNavData().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export { mergeNavData };