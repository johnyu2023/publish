// 用于自动更新首页上的最近更新文章列表和全部文章列表页面
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
        // 跳过 index.md、about.md 和 list.md 文件
        if (file === 'index.md' || file === 'about.md' || file === 'list.md') continue;
        
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
  
  // 更新全部文章列表页面
  updateAllPostsList(posts);
}

// 更新全部文章列表页面
function updateAllPostsList(posts) {
  const listPath = path.join(process.cwd(), 'docs-source', 'list.md');
  let listContent = fs.readFileSync(listPath, 'utf8');
  
  // 按年份和月份对文章进行分组
  const groupedPosts = {};
  
  for (const post of posts) {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以+1
    
    if (!groupedPosts[year]) {
      groupedPosts[year] = {};
    }
    
    if (!groupedPosts[year][month]) {
      groupedPosts[year][month] = [];
    }
    
    groupedPosts[year][month].push(post);
  }
  
  // 生成按年份和月份分组的文章列表HTML，添加折叠功能
  let allPostsHtml = '';
  
  // 获取所有年份并降序排序
  const years = Object.keys(groupedPosts).sort((a, b) => b - a);
  
  for (const year of years) {
    allPostsHtml += `  <div class="year-section">\n`;
    allPostsHtml += `    <h2 class="year-title" @click="toggleYear('${year}年')">\n`;
    allPostsHtml += `      ${year}年\n`;
    allPostsHtml += `      <span class="toggle-icon" :class="{ 'collapsed': yearCollapsed['${year}年'] }">\n`;
    allPostsHtml += `        {{ yearCollapsed['${year}年'] ? '▶' : '▼' }}\n`;
    allPostsHtml += `      </span>\n`;
    allPostsHtml += `    </h2>\n`;
    allPostsHtml += `    <div class="year-content" :class="{ 'hidden': yearCollapsed['${year}年'] }">\n`;
    
    // 获取当前年份的所有月份并降序排序
    const months = Object.keys(groupedPosts[year]).sort((a, b) => b - a);
    
    for (const month of months) {
      allPostsHtml += `      <div class="month-section">\n`;
      allPostsHtml += `        <h3 class="month-title">${month}月</h3>\n`;
      allPostsHtml += `        <ul>\n`;
      
      // 当月的所有文章
      const monthPosts = groupedPosts[year][month];
      
      // 按日期降序排序
      monthPosts.sort((a, b) => b.date - a.date);
      
      for (const post of monthPosts) {
        const day = new Date(post.date).getDate();
        allPostsHtml += `          <li>\n`;
        allPostsHtml += `            <span class="article-date">${month}-${day.toString().padStart(2, '0')}</span>\n`;
        allPostsHtml += `            <span class="article-title"><a :href="withBase('${post.link}')">${post.title}</a></span>\n`;
        allPostsHtml += `          </li>\n`;
      }
      
      allPostsHtml += `        </ul>\n`;
      allPostsHtml += `      </div>\n`;
    }
    
    allPostsHtml += `    </div>\n`;
    allPostsHtml += `  </div>\n`;
  }
  
  // 更新全部文章列表页面
  const contentRegex = /<div class="article-list">[\s\S]*?<\/div>/;
  const updatedContent = `<div class="article-list">\n  <!-- 此处内容将由 update-recent-posts.js 脚本自动生成 -->\n${allPostsHtml}</div>`;
  const updatedListContent = listContent.replace(contentRegex, updatedContent);
  
  // 写回列表文件
  fs.writeFileSync(listPath, updatedListContent, 'utf8');
  
  console.log('已更新全部文章列表页面');
}

// 执行更新
updateRecentPosts();