import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import sidebarConfig from './sidebar.js'
import { katex } from '@mdit/plugin-katex'

// 检测环境
const isProduction = process.env.NODE_ENV === 'production'
const deployEnv = process.env.DEPLOY_ENV || ''
const isLocalDev = !isProduction && deployEnv !== 'LOCAL_PREVIEW'

// 根据环境设置不同的基础路径
// 本地开发: '/'
// 本地预览和生产环境: '/publish/'
const base = isLocalDev ? '/' : '/publish/'

export default withMermaid(defineConfig({
  title: "AI时代的技术分享",
  description: "分享技术心得",
  lang: 'zh-CN',
  // 设置基础路径
  base,
  // 指定使用自定义主题
  theme: './theme',

  // 配置markdown选项，使用官方的katex插件支持LaTeX
  markdown: {
    config: (md) => {
      md.use(katex, {
        throwOnError: false,
        errorColor: '#cc0000'
      })
    }
  },

  // 添加RSS链接到HTML头部
  head: [
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: `${base}rss.xml`, title: 'RSS Feed for AI时代的技术分享' }],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    // 添加KaTeX的CSS样式
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css' }],
    // 添加 Mermaid 交互增强脚本
    ['script', { src: `${base}.vitepress/theme/assets/mermaid-interaction.js` }],
    // 添加 Mermaid 图表交互增强样式
    ['style', {}, `
      /* Mermaid 图表缩放和拖拽样式 */
      .mermaid {
        position: relative !important;
        overflow: visible !important;
        cursor: grab !important;
        user-select: none !important;
        display: inline-block !important;
        transform-origin: center center !important;
        transition: transform 0.1s ease-out !important;
      }

      .mermaid:active {
        cursor: grabbing !important;
      }

      .mermaid svg {
        display: block !important;
        margin: 0 auto !important;
        max-width: none !important;
        height: auto !important;
      }

      /* Mermaid 容器样式，确保有足够的空间 */
      .mermaid-wrapper {
        position: relative !important;
        overflow: auto !important;
        padding: 20px !important;
        border: 1px solid #e1e5e9 !important;
        border-radius: 8px !important;
        background-color: #fff !important;
        margin: 20px 0 !important;
        min-height: 200px !important;
      }

      /* 缩放控制提示 */
      .mermaid-wrapper::before {
        content: "💡 使用鼠标滚轮缩放，按住拖拽移动" !important;
        position: absolute !important;
        top: 5px !important;
        right: 45px !important;
        font-size: 12px !important;
        color: #666 !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        z-index: 10 !important;
        pointer-events: none !important;
      }

      /* 弹框中的 Mermaid 不显示提示 */
      .mermaid-modal .mermaid-wrapper::before {
        display: none !important;
      }

      /* 放大镜按钮样式 */
      .mermaid-zoom-btn {
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        width: 32px !important;
        height: 32px !important;
        border: none !important;
        border-radius: 6px !important;
        background-color: rgba(59, 130, 246, 0.9) !important;
        color: white !important;
        font-size: 16px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.2s ease !important;
        z-index: 100 !important;
      }

      .mermaid-zoom-btn:hover {
        background-color: rgba(59, 130, 246, 1) !important;
        transform: scale(1.1) !important;
      }

      /* VitePress 中的 Markdown 内容区域 */
      .vp-doc .mermaid {
        margin: 20px 0 !important;
        text-align: center !important;
      }

      /* 确保在大图中不会被截断 */
      .vp-doc .mermaid svg {
        max-width: none !important;
        width: 100% !important;
        height: auto !important;
      }

      /* 弹框样式 */
      .mermaid-modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
        z-index: 9999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: grab !important;
      }

      .mermaid-modal-content {
        position: relative !important;
        background-color: white !important;
        border-radius: 12px !important;
        padding: 20px !important;
        width: 90vw !important;
        height: 90vh !important;
        overflow: hidden !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
        cursor: default !important;
      }

      .mermaid-modal-chart {
        position: relative !important;
        overflow: visible !important;
        cursor: grab !important;
        user-select: none !important;
        display: inline-block !important;
        transform-origin: center center !important;
        transition: transform 0.1s ease-out !important;
      }

      .mermaid-modal-chart:active {
        cursor: grabbing !important;
      }

      .mermaid-modal-tip {
        position: absolute !important;
        bottom: 10px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        font-size: 14px !important;
        color: #666 !important;
        background-color: rgba(255, 255, 255, 0.9) !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        pointer-events: none !important;
      }
    `]
  ],

  // 添加全局变量，用于构建链接
  vite: {
    define: {
      __BASE__: JSON.stringify(base)
    }
  },
  cleanUrls: true,

  themeConfig: {
    siteTitle: 'AI时代开发之旅',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/list' },
      { text: '关于', link: '/about' }
    ],

    // 使用动态生成的侧边栏配置
    sidebar: sidebarConfig as DefaultTheme.Sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/johnyu2023' },
      { icon: 'rss', link: isProduction ? '/publish/rss.xml' : '/rss.xml' }
    ],

    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2024-present'
    }
  },

  // Mermaid 配置
  mermaid: {
    theme: 'default',
  }
}))