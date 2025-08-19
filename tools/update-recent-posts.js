// 用于自动更新首页上的最近更新文章列表
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 获取文件的 frontmatter 数据
function getFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    return data;
  } catch (error) {
    console.error(`读取文件 ${filePath} 失败:`, error);
    return {};
  }
}

// 扫描目录下的所有 Markdown 文件
function scanDirectory(dirPath) {
  const posts = [];
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过 .vitepress 目录
        if (path.basename(fullPath) === '.vitepress') continue;
        
        // 递归扫描子目录
        const subPosts = scanDirectory(fullPath);
        posts.push(...subPosts);
      } else if (file.endsWith('.md')) {
        // 跳过 index.md 和 about.md 文件
        if (file === 'index.md' || file === 'about.md') continue;
        
        const relativePath = path.relative(process.cwd(), fullPath)
          .replace(/\\/g, '/') // 将反斜杠替换为正斜杠
          .replace('docs-source/', ''); // 移除 docs-source/ 前缀
        
        const frontmatter = getFrontmatter(fullPath);
        const title = frontmatter.title || path.basename(file, '.md').replace(/-/g, ' ');
        const date = frontmatter.date ? new Date(frontmatter.date) : new Date(stat.mtime);
        
        posts.push({
          title,
          date,
          link: '/' + relativePath.replace(/\.md$/, ''),
          formattedDate: date.toISOString().split('T')[0]
        });
      }
    }
    
    return posts;
  } catch (error) {
    console.error(`扫描目录 ${dirPath} 失败:`, error);
    return [];
  }
}

// 更新首页上的最近更新文章列表
function updateRecentPosts() {
  const indexPath = path.join(process.cwd(), 'docs-source', 'index.md');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // 扫描文档目录
  const docsPath = path.join(process.cwd(), 'docs-source');
  const posts = scanDirectory(docsPath);
  
  // 按日期排序
  posts.sort((a, b) => b.date - a.date);
  
  // 取前 5 篇文章
  const recentPosts = posts.slice(0, 5);
  
  // 生成最近更新文章列表的 HTML，使用 withBase() 函数处理链接
  let recentPostsHtml = '<ul>\n';
  for (const post of recentPosts) {
    recentPostsHtml += `      <li><a :href="withBase('${post.link}')">${post.title}</a> - ${post.formattedDate}</li>\n`;
  }
  recentPostsHtml += '    </ul>';
  
  // 更新首页上的最近更新文章列表
  const recentPostsRegex = /<ul>[\s\S]*?<\/ul>/;
  const updatedIndexContent = indexContent.replace(recentPostsRegex, recentPostsHtml);
  
  // 写回首页文件
  fs.writeFileSync(indexPath, updatedIndexContent, 'utf8');
  
  console.log('已更新首页上的最近更新文章列表');
}

// 执行更新
updateRecentPosts();