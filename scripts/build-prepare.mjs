#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'docs', 'public', 'data');

const executeScript = async (scriptName, args = []) => {
  const scriptPath = join(__dirname, scriptName);
  const commandArgs = [scriptPath, ...args];
  
  return new Promise((resolve, reject) => {
    console.log(`🔄 Executing: ${scriptPath} with args: ${args.join(' ')}`);
    
    const child = spawn('node', commandArgs, { stdio: 'inherit' });
    
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
    await executeScript('./generate-all-articles.mjs', [DATA_DIR]);
    await executeScript('./build-search-index.mjs', [DATA_DIR]);
    await executeScript('./generate-blog-data.mjs', [DATA_DIR]);
    
    console.log('\n🎉 Build preparation completed successfully!');
  } catch (error) {
    console.error('\n💥 Build preparation failed:', error.message);
    process.exit(1);
  }
}

main();