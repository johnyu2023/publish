// build.mjs
import { build } from 'vitepress';

console.log('Starting VitePress build...');
await build('docs'); // 指定你的文档目录
console.log('Build completed successfully.');

// 强制退出，避免 Windows 上的进程挂起
process.exit(0);