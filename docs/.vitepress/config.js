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
    .sort((a, b) => b.date - a.date)

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
  title: 'AI时代的技术分享',
  description: 'AI时代的技术分享和感悟',

  // ⚠️ 注意：此处不设置顶层 locales（单语言中文站不需要）

  vite: {
    server: {
      fs: {
        allow: ['.']
      }
    }
  },

  markdown: {
    config(md) {
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

  transformPageData(pageData) {
    // 保留原逻辑
  },

  // === 主题配置 ===
  themeConfig: {
    // 全局启用深层大纲
    outline: 'deep',

    // ✅ 关键：覆盖默认语言（en）的 UI 文案
    locales: {
      en: {
        outline: {
          label: '本页内容' // ← 这里生效！
        },
        // 可选：其他 UI 中文化（提升体验）
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        lastUpdatedText: '最后更新于',
        darkModeSwitchLabel: '主题',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部'
      }
    },

    nav: (() => {
      try {
        const dataDir = path.join(__dirname, '..', 'data');
        const navDataPath = path.join(dataDir, 'nav-data.json');
        
        if (fs.existsSync(navDataPath)) {
          const navDataContent = fs.readFileSync(navDataPath, 'utf8');
          const navData = JSON.parse(navDataContent);
          
          if (Array.isArray(navData) && navData.length > 0) {
            return navData;
          }
        }
        
        return [
          { text: '首页', link: '/' },
          { text: '关于', link: '/about' }
        ];
      } catch (error) {
        console.error('Error reading nav-data.json:', error);
        return [
          { text: '首页', link: '/' },
          { text: '关于', link: '/about' }
        ];
      }
    })(),

    sidebar: {
      ...dynamicSidebar,
      '/': [
        {
          text: '本站相关',
          items: [
            { text: '版本历史', link: '/system/history' },
            { text: 'LaTeX 规范', link: '/system/latex-spec' },
            { text: 'Mermaid 弹框测试', link: '/system/test-mermaid-modal' },
            { text: '上海话示例', link: '/shanghai/appen' }
          ]
        }
      ]
    },

    footer: {
      message: '基于 MIT 许可发布。',
      copyright: 'Copyright © 2025-present'
    }
  }
})