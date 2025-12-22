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
      // 添加 KaTeX 支持
      import('markdown-it-katex').then(katex => {
        md.use(katex.default, { 
          throwOnError: false,
          errorColor: '#cc0000'
        })
      }).catch(err => {
        console.warn('Failed to load katex:', err)
      })

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

    // 从预生成的 nav-data.json 文件读取导航数据
    nav: (() => {
      try {
        // 修正路径：nav-data.json 现在位于 docs/data/ 而非 docs/public/data/
        const dataDir = path.join(__dirname, '..', 'data');
        const navDataPath = path.join(dataDir, 'nav-data.json');
        
        if (fs.existsSync(navDataPath)) {
          const navDataContent = fs.readFileSync(navDataPath, 'utf8');
          const navData = JSON.parse(navDataContent);
          
          if (Array.isArray(navData) && navData.length > 0) {
            return navData;
          }
        }
        
        // 如果 nav-data.json 不存在或为空，返回默认导航
        return [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' }
        ];
      } catch (error) {
        console.error('Error reading nav-data.json:', error);
        // 如果读取失败，返回默认导航
        return [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' }
        ];
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