// docs/.vitepress/config.js
import { defineConfig } from 'vitepress'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

// === 工具函数：获取目录中文名 ===
function getDirectoryName(dirName) {
  const names = {
    ai: '人工智能',
    foundation: '基础知识',
    fullstack: '全栈开发',
    think: '观察思考',
    other: '技术文档'
  }
  return names[dirName] || dirName.charAt(0).toUpperCase() + dirName.slice(1)
}

// === 动态生成 sidebar（顶层 await）===
const docsDir = path.resolve(__dirname, '..')
const items = await fsPromises.readdir(docsDir)
const dynamicSidebar = {}

const targetDirs = ['ai', 'foundation', 'fullstack', 'think', 'other']

for (const item of items) {
  const itemPath = path.join(docsDir, item)
  const stat = await fsPromises.stat(itemPath)

  // 跳过非目录或特殊目录
  if (!stat.isDirectory() || ['.vitepress', '.vuepress'].includes(item)) continue
  if (!targetDirs.includes(item)) continue

  const dirPath = `/${item}/`
  const files = await fsPromises.readdir(itemPath)

  const mdFiles = files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const filePath = path.join(itemPath, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(content)
      return {
        text: data.title || file.replace(/\.md$/, ''),
        link: `/${item}/${file.replace(/\.md$/, '')}`,
        date: data.date ? new Date(data.date).getTime() : 0
      }
    })
    .sort((a, b) => b.date - a.date) // 按 date 倒序

  if (mdFiles.length > 0) {
    dynamicSidebar[dirPath] = [
      {
        text: getDirectoryName(item),
        items: mdFiles.map(({ text, link }) => ({ text, link }))
      }
    ]
  }
}

// === 导出配置 ===
export default defineConfig({
  base: '/publish/',
  title: 'AI时代的技术分享2025',
  description: 'AI时代的技术分享和感悟',

  vite: {
    server: {
      fs: {
        allow: ['.']
      }
    }
  },

  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args
        const info = tokens[idx].info.trim()
        if (info.startsWith('mermaid')) {
          return `<Mermaid code="${encodeURIComponent(tokens[idx].content)}" />`
        }
        return defaultFence(...args)
      }
    }
  },

  // 保留 transformPageData，如果首页仍用 useData() 注入数据
  transformPageData(pageData) {
    // 数据生成现在通过外部 build:prepare 脚本完成
    // 此处保留原函数如果其他地方有使用
  },

  // === 主题配置 ===
  themeConfig: {
    outline: { level: [2, 4] },

    // 从生成的 nav-data.json 文件读取导航数据
    nav: (() => {
      try {
        // 同步读取 nav-data.json 文件
        const navDataPath = path.resolve(__dirname, 'public', 'data', 'nav-data.json');
        if (fs.existsSync(navDataPath)) {
          const navDataContent = fs.readFileSync(navDataPath, 'utf8');
          const navData = JSON.parse(navDataContent);
          return navData;
        } else {
          // 如果 nav-data.json 不存在，使用动态生成的侧边栏数据
          const navItems = [
            { text: 'Home', link: '/' }
          ];
          
          // 定义分类映射
          const categoryMap = {
            'ai': 'AI',
            'foundation': 'Foundation', 
            'fullstack': 'FullStack',
            'think': 'Think',
            'other': 'Other'
          };

          // 从 dynamicSidebar 获取最新文章链接
          Object.entries(categoryMap).forEach(([key, text]) => {
            if (dynamicSidebar[`/${key}/`]) {
              // 如果存在该分类的侧边栏，使用该分类下最新文章的链接
              const categorySidebar = dynamicSidebar[`/${key}/`];
              if (categorySidebar && categorySidebar[0] && categorySidebar[0].items && categorySidebar[0].items.length > 0) {
                const firstArticle = categorySidebar[0].items[0];
                navItems.push({ text, link: firstArticle.link });
              } else {
                // 使用默认链接
                const defaultLinks = {
                  'ai': '/ai/future-of-ai',
                  'foundation': '/foundation/data-structure', 
                  'fullstack': '/fullstack/fullstack-guide',
                  'think': '/think/trends-analysis',
                  'other': '/other/api-documentation'
                };
                navItems.push({ text, link: defaultLinks[key] || `/${key}/` });
              }
            } else {
              // 使用默认链接
              const defaultLinks = {
                'ai': '/ai/future-of-ai',
                'foundation': '/foundation/data-structure', 
                'fullstack': '/fullstack/fullstack-guide',
                'think': '/think/trends-analysis',
                'other': '/other/api-documentation'
              };
              navItems.push({ text, link: defaultLinks[key] || `/${key}/` });
            }
          });

          // 添加 About 链接
          navItems.push({ text: 'About', link: '/about' });

          return navItems;
        }
      } catch (error) {
        console.error('Error reading nav-data.json:', error);
        // 如果读取失败，回退到之前的动态生成逻辑
        const navItems = [
          { text: 'Home', link: '/' }
        ];
        
        const categoryMap = {
          'ai': 'AI',
          'foundation': 'Foundation', 
          'fullstack': 'FullStack',
          'think': 'Think',
          'other': 'Other'
        };

        Object.entries(categoryMap).forEach(([key, text]) => {
          if (dynamicSidebar[`/${key}/`]) {
            const categorySidebar = dynamicSidebar[`/${key}/`];
            if (categorySidebar && categorySidebar[0] && categorySidebar[0].items && categorySidebar[0].items.length > 0) {
              const firstArticle = categorySidebar[0].items[0];
              navItems.push({ text, link: firstArticle.link });
            } else {
              const defaultLinks = {
                'ai': '/ai/future-of-ai',
                'foundation': '/foundation/data-structure', 
                'fullstack': '/fullstack/fullstack-guide',
                'think': '/think/trends-analysis',
                'other': '/other/api-documentation'
              };
              navItems.push({ text, link: defaultLinks[key] || `/${key}/` });
            }
          } else {
            const defaultLinks = {
              'ai': '/ai/future-of-ai',
              'foundation': '/foundation/data-structure', 
              'fullstack': '/fullstack/fullstack-guide',
              'think': '/think/trends-analysis',
              'other': '/other/api-documentation'
            };
            navItems.push({ text, link: defaultLinks[key] || `/${key}/` });
          }
        });

        navItems.push({ text: 'About', link: '/about' });

        return navItems;
      }
    })(),

    sidebar: {
      ...dynamicSidebar,
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Sample Article', link: '/sample-article' },
            { text: 'Experiments', link: '/experiments' },
            { text: 'About', link: '/about' }
          ]
        }
      ]
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present'
    }
  }
})