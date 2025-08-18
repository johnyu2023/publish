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
            
            // 确保 URL 路径中使用连字符而不是下划线
            const fileName = path.basename(file, '.md');
            const urlPath = fileName.replace(/_/g, '-');
            
            posts.push({
              title: data.title || fileName,
              date: data.date ? new Date(data.date) : new Date(0),
              path: `/${dir.replace('docs-source/', '')}/${urlPath}`,
              filePath,
              category: dir.replace('docs-source/', '')
            });
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

// 更新 VitePress 配置中的 sidebar
async function updateSidebar() {
  const configPath = 'docs-source/.vitepress/config.ts';
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  const posts = await getAllPosts();
  
  // 按类别分组文章
  const postsByCategory = {};
  posts.forEach(post => {
    if (!postsByCategory[post.category]) {
      postsByCategory[post.category] = [];
    }
    postsByCategory[post.category].push(post);
  });
  
  // 更新 sidebar 配置
  for (const category in postsByCategory) {
    // 为每个类别生成 sidebar 项
    const categoryPosts = postsByCategory[category];
    let sidebarItems = categoryPosts.map(post => {
      return `            { text: '${post.title}', link: '/${category}/${path.basename(post.path)}' }`;
    }).join(',\n');
    
    // 查找并替换 sidebar 配置
    const categoryRegex = new RegExp(`sidebar:\\s*{[^}]*'\\/${category}\\/':.*?items:\\s*\\[(.*?)\\]`, 's');
    const match = configContent.match(categoryRegex);
    
    if (match) {
      // 找到现有的 sidebar 配置，替换 items 数组
      const itemsStartIndex = match.index + match[0].indexOf('[');
      const itemsEndIndex = match.index + match[0].indexOf(']') + 1;
      
      const newConfig = configContent.substring(0, itemsStartIndex) + 
                        '[\n' + sidebarItems + '\n          ]' + 
                        configContent.substring(itemsEndIndex);
      
      configContent = newConfig;
    }
  }
  
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('VitePress 配置中的 sidebar 已更新！');
}

// 执行更新
async function updateAll() {
  try {
    await updateIndex();
    await updateSidebar();
    console.log('所有更新完成！');
  } catch (err) {
    console.error('更新过程中出错:', err);
  }
}

updateAll();