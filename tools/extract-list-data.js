import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 list.md 文件
const listMdPath = path.join(__dirname, '../docs-source/list.md');
const listMdContent = fs.readFileSync(listMdPath, 'utf-8');

// 解析 Markdown 内容
function parseListMd(content) {
  const lines = content.split('\n');
  const result = [];
  
  // 当前年份
  let currentYear = '';
  // 当前月份
  let currentMonth = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 提取年份
    const yearMatch = line.match(/toggleYear\('(\d+)年'\)/);
    if (yearMatch) {
      currentYear = yearMatch[1];
      continue;
    }
    
    // 提取月份
    const monthMatch = line.match(/<h3 class="month-title">(\d+)月<\/h3>/);
    if (monthMatch) {
      currentMonth = monthMatch[1];
      continue;
    }
    
    // 提取文章信息
    if (line.includes('<span class="article-date">') && i + 1 < lines.length) {
      // 提取日期
      const dateMatch = line.match(/<span class="article-date">(\d+)-(\d+)<\/span>/);
      if (!dateMatch) continue;
      
      const day = dateMatch[2];
      const month = dateMatch[1];
      const date = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      // 提取标题和URL（在下一行）
      const nextLine = lines[i + 1].trim();
      const titleUrlMatch = nextLine.match(/:href="withBase\('([^']+)'\)">([^<]+)<\/a>/);
      
      if (titleUrlMatch) {
        const url = titleUrlMatch[1];
        const title = titleUrlMatch[2];
        
        // 提取目录名
        const dirMatch = url.match(/^\/([^/]+)\//);
        const directory = dirMatch ? dirMatch[1] : '';
        
        // 标签暂时为空数组，因为原始数据中没有标签信息
        const tags = [];
        
        result.push({
          directory,
          title,
          url,
          date,
          tags
        });
      }
    }
  }
  
  return result;
}

// 按日期倒序排序
function sortByDateDesc(items) {
  return items.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
}

// 主函数
async function main() {
  try {
    // 解析数据
    const parsedData = parseListMd(listMdContent);
    
    // 按日期倒序排序
    const sortedData = sortByDateDesc(parsedData);
    
    // 确保目录存在
    const dataDir = path.join(__dirname, '../docs-source/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 写入 JSON 文件
    const outputPath = path.join(dataDir, 'list-test.json');
    fs.writeFileSync(outputPath, JSON.stringify(sortedData, null, 2), 'utf-8');
    
    console.log(`数据已成功提取并保存到 ${outputPath}`);
    console.log(`共提取了 ${sortedData.length} 篇文章`);
  } catch (error) {
    console.error('处理数据时出错:', error);
  }
}

main();