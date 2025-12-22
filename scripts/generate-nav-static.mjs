// scripts/04-generate-nav-static.mjs
// 用途：从配置文件读取静态导航项，生成静态导航数据
// 依赖：scripts/nav-config.json
// 输出：docs/data/nav-static.json

import { readFile, writeFile, mkdir, unlink, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = __dirname;  // 配置文件在 scripts 目录
const OUTPUT_DIR = join(__dirname, '..', 'docs', 'data');

// 通用安全写入函数
async function writeJSONSafe(filePath, data) {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2));
  await rename(tmpPath, filePath); // 原子操作
}

async function generateNavStatic() {
  try {
    // 确保输出目录存在
    await mkdir(OUTPUT_DIR, { recursive: true });
    
    // 删除可能存在的旧文件
    const navStaticPath = join(OUTPUT_DIR, 'nav-static.json');
    try {
      await unlink(navStaticPath);
    } catch (e) {
      // 如果文件不存在，忽略错误
      if (e.code !== 'ENOENT') {
        console.warn(`Warning: Could not delete ${navStaticPath}:`, e.message);
      }
    }
    
    // 从配置文件读取静态导航项
    const configPath = join(CONFIG_DIR, 'nav-config.json');
    const configContent = await readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    // 添加 type 字段并生成静态导航数据
    const navStatic = config.staticNavItems.map(item => ({
      ...item,
      type: 'static'
    }));

    // 保存到文件
    const outputFilePath = join(OUTPUT_DIR, 'nav-static.json');
    await writeJSONSafe(outputFilePath, navStatic);
    console.log(`✅ Static navigation data saved to ${outputFilePath}`);

    return navStatic;

  } catch (error) {
    console.error('❌ Error generating static navigation data:', error);
    throw error;
  }
}

// 如果直接运行此脚本
const isMain = process.argv[1] && process.argv[1].endsWith('generate-nav-static.mjs');
if (isMain) {
  generateNavStatic().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
}

export { generateNavStatic };