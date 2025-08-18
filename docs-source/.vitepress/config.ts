import { defineConfig } from 'vitepress'

// 检测是否是生产构建环境
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  title: "AI时代的技术分享",
  description: "分享技术心得和学习笔记",
  lang: 'zh-CN',
  // 设置基础路径
  // 开发时 base 为 '/'，生产构建时 base 为 '/'
  base: '/',
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: 'AI时代的编程之路',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' }
    ],
    
    sidebar: {
      '/posts/': [
        {
          text: '文章列表',
          items: [
            { text: '开始使用 VitePress', link: '/posts/getting-started' },
            { text: 'Markdown 语法指南', link: '/posts/markdown-guide' }
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI 相关',
          items: [
            { text: 'Function Calling 的原始形态', link: '/ai/function_calling' },
            { text: '代码相关', link: '/ai/code' },
            { text: '编程实践', link: '/ai/coding_01' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/johnyu2023' },
      { icon: 'rss', link: './rss.xml' }
    ],
    
    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2024-present'
    }
  }
})
