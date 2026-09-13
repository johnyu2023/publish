// docs/.vitepress/config.js
import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { getSideBarData } from './sidebar-generator.js'
import texmath from 'markdown-it-texmath'
import katex from 'katex'

// `markdown-it` 会在少数中文标点边界（如 `”**`、`)**审核`）保留原始
// `**`。这个规则只接管默认 emphasis 规则未能识别的、非空且不含换行的片段。
function cjkStrongFallback(md) {
  md.core.ruler.after('inline', 'cjk_strong_fallback', (state) => {
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue

      const nextChildren = []
      for (const child of token.children) {
        // 已正确解析的加粗、代码和链接不会是 text token，因此不受影响。
        if (child.type !== 'text' || !child.content.includes('**')) {
          nextChildren.push(child)
          continue
        }

        const pattern = /\*\*([^\r\n]*?)\*\*/g
        let cursor = 0
        let match
        while ((match = pattern.exec(child.content))) {
          const [raw, content] = match
          if (!content || /^\s|\s$/.test(content)) continue

          if (match.index > cursor) {
            const text = new child.constructor('text', '', 0)
            text.content = child.content.slice(cursor, match.index)
            nextChildren.push(text)
          }

          const open = new child.constructor('strong_open', 'strong', 1)
          open.markup = '**'
          nextChildren.push(open)

          const contentTokens = []
          state.md.inline.parse(content, state.md, state.env, contentTokens)
          nextChildren.push(...contentTokens)

          const close = new child.constructor('strong_close', 'strong', -1)
          close.markup = '**'
          nextChildren.push(close)
          cursor = match.index + raw.length
        }

        if (cursor === 0) {
          nextChildren.push(child)
        } else if (cursor < child.content.length) {
          const text = new child.constructor('text', '', 0)
          text.content = child.content.slice(cursor)
          nextChildren.push(text)
        }
      }
      token.children = nextChildren
    }
  })
}

// === 导出配置 ===
export default defineConfig({
  base: '/publish/',
  title: 'AI时代的技术分享',
  description: 'AI时代的技术分享和感悟',

  head: [],

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
      md.use(cjkStrongFallback)
      md.use(texmath, {
        engine: katex,
        delimiters: ['dollars', 'brackets'],
        katexOptions: { throwOnError: false, errorColor: '#cc0000' }
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
