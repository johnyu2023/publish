import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章目录
const directories = ['docs-source/posts', 'docs-source/ai'];

// 获取所有文章
async function getAllPosts() {
  let posts = [];
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && path.extname(file) === '.md' && file !== 'index.md') {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            
            if (data.date) {
              posts.push({
                title: data.title || path.basename(file, '.md'),
                date: new Date(data.date),
                path: `/${dir.replace('docs-source/', '')}/${path.basename(file, '.md')}`,
                filePath
              });
            }
          } catch (e) {
            console.error(`Error processing ${filePath}:`, e);
          }
        }
      }
    }
  }
  
  // 按日期排序（最新的在前）
  posts.sort((a, b) => b.date - a.date);
  
  return posts;
}

// 更新首页
async function updateIndex() {
  const indexPath = 'docs-source/index.md';
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const posts = await getAllPosts();
  
  // 生成最近更新列表
  let recentPostsList = posts.slice(0, 5).map(post => {
    const dateStr = post.date.toISOString().split('T')[0];
    return `      <li><a href="${post.path}">${post.title}</a> - ${dateStr}</li>`;
  }).join('\n');
  
  // 替换最近更新列表
  const startMarker = '<ul>';
  const endMarker = '</ul>';
  
  const startIndex = indexContent.indexOf(startMarker, indexContent.indexOf('<h3>📖 最近更新</h3>'));
  const endIndex = indexContent.indexOf(endMarker, startIndex) + endMarker.length;
  
  if (startIndex !== -1 && endIndex !== -1) {
    const newContent = indexContent.substring(0, startIndex) + 
                      '<ul>\n' + recentPostsList + '\n    </ul>' + 
                      indexContent.substring(endIndex);
    
    fs.writeFileSync(indexPath, newContent, 'utf8');
    console.log('首页最近更新列表已更新！');
  } else {
    console.error('无法在首页找到最近更新列表的位置');
  }
}

// 执行更新
updateIndex().catch(err => {
  console.error('更新首页时出错:', err);
});
