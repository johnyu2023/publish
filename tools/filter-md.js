#!/usr/bin/env node

/**
 * Markdown 文件过滤器
 * 功能：根据配置文件中的规则过滤 Markdown 文件内容
 * 用法：pnpm filter-md
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件所在目录的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 读取配置文件
 * @returns {Promise<Object>} 配置对象
 */
async function readConfig() {
  try {
    const configPath = path.join(__dirname, 'filter-config.json');
    const configContent = await fs.readFile(configPath, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error('读取配置文件失败:', error.message);
    process.exit(1);
  }
}

/**
 * 处理单个文件
 * @param {string} filePath 文件路径
 * @param {Array} rules 过滤规则数组
 */
async function processFile(filePath, rules) {
  try {
    // 构建绝对文件路径
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(__dirname, '..', filePath);
    
    // 读取文件内容
    console.log(`正在处理文件: ${filePath}`);
    let content = await fs.readFile(absolutePath, 'utf8');
    
    // 应用所有规则
    rules.forEach(rule => {
      console.log(`  应用规则: ${rule.name}`);
      const regex = new RegExp(rule.pattern, 'g');
      content = content.replace(regex, rule.replacement);
    });
    
    // 写回文件
    await fs.writeFile(absolutePath, content, 'utf8');
    console.log(`  处理完成: ${filePath}`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 失败:`, error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('=== Markdown 文件过滤器 ===');
  
  // 读取配置
  const config = await readConfig();
  
  // 检查配置是否有效
  if (!config.files || !Array.isArray(config.files)) {
    console.error('配置文件中缺少 files 字段或格式错误');
    process.exit(1);
  }
  
  if (!config.rules || !Array.isArray(config.rules)) {
    console.error('配置文件中缺少 rules 字段或格式错误');
    process.exit(1);
  }
  
  // 处理每个文件
  for (const file of config.files) {
    await processFile(file, config.rules);
  }
  
  console.log('\n=== 所有文件处理完成 ===');
}

// 执行主函数
main();