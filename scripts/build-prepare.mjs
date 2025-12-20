#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const executeScript = async (scriptName) => {
  const scriptPath = join(__dirname, scriptName);
  return new Promise((resolve, reject) => {
    console.log(`🔄 Executing: ${scriptPath}`);
    
    const child = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Success: ${scriptPath}`);
        resolve();
      } else {
        console.error(`❌ Failed: ${scriptPath} with code ${code}`);
        reject(new Error(`${scriptPath} failed with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      console.error(`❌ Error executing ${scriptPath}:`, err);
      reject(err);
    });
  });
};

async function main() {
  console.log('🚀 Starting build preparation...\n');
  
  try {
    // 按顺序执行各个数据生成脚本
    await executeScript('./generate-all-articles.mjs');
    await executeScript('./build-search-index.mjs');
    await executeScript('./generate-blog-data.mjs');
    
    console.log('\n🎉 Build preparation completed successfully!');
  } catch (error) {
    console.error('\n💥 Build preparation failed:', error.message);
    process.exit(1);
  }
}

main();