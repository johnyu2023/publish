// docs/.vitepress/config.js
import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { getSideBarData } from './sidebar-generator.js'

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

    sidebar: await getSideBarData(),

    footer: {
      message: '基于 MIT 许可发布。',
      copyright: 'Copyright © 2025-present'
    }
  }
})