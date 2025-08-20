import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import sidebarConfig from './sidebar.js'

// 检测环境
const isProduction = process.env.NODE_ENV === 'production'
const deployEnv = process.env.DEPLOY_ENV || ''
const isLocalDev = !isProduction && deployEnv !== 'LOCAL_PREVIEW'

// 根据环境设置不同的基础路径
// 本地开发: '/'
// 本地预览和生产环境: '/publish/'
const base = isLocalDev ? '/' : '/publish/'

export default defineConfig({
  title: "AI时代的技术分享",
  description: "分享技术心得",
  lang: 'zh-CN',
  // 设置基础路径
  base,
  
  // 添加RSS链接到HTML头部
  head: [
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: isLocalDev ? '/rss.xml' : '/publish/rss.xml', title: 'RSS Feed for AI时代的技术分享' }],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
  ],
  
  // 添加全局变量，用于构建链接
  vite: {
    define: {
      __BASE__: JSON.stringify(base)
    }
  },
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: 'AI时代的编程之路',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
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
  }
})