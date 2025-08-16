import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的技术博客",
  description: "分享技术心得和学习笔记",
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: '我的技术博客',
    
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
            { text: '代码相关', link: '/ai/code' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/johnyu2023' }
    ],
    
    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2024-present'
    }
  }
})
