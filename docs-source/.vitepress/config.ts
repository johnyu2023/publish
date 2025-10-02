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
    // 添加测试用的全局样式
    ['style', {}, `
      body {
        background-color: #f0f0f0 !important;
      }
      .debug-message {
        position: fixed !important;
        top: 20px !important;
        left: 20px !important;
        background-color: purple !important;
        color: white !important;
        padding: 20px !important;
        font-size: 16px !important;
        z-index: 9999 !important;
      }
      
      /* 非常明显的全局测试样式 */
      .global-test-banner {
        position: fixed !important;
        top: 100px !important;
        left: 0 !important;
        right: 0 !important;
        background-color: yellow !important;
        color: black !important;
        padding: 30px !important;
        font-size: 24px !important;
        font-weight: bold !important;
        text-align: center !important;
        z-index: 9998 !important;
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
