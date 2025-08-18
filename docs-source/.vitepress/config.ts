import { defineConfig } from 'vitepress'

// 检测是否是生产构建环境
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  title: "AI时代的技术分享",
  description: "分享技术心得",
  lang: 'zh-CN',
  // 设置基础路径
  // 统一使用 '/publish/' 作为基础路径，确保链接一致性
  base: '/publish/',
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: 'AI时代的编程之路',
    
    nav: [
      { text: '首页', link: '/publish/' },
      { text: '文章', link: '/publish/posts/' },
      { text: '关于', link: '/publish/about' }
    ],
    
    sidebar: {
      '/posts/': [
            { text: '使用 GitHub Pages 部署静态网站', link: '/publish/posts/github-pages' },
            { text: 'Markdown 语法完全指南', link: '/publish/posts/markdown-guide' },
            { text: '开始使用 VitePress 搭建技术博客', link: '/publish/posts/getting-started' }
          ],
      '/ai/': [
        {
          text: 'AI 相关',
          items: [
            { text: 'Function Calling 的原始形态', link: '/publish/ai/function-calling' },
            { text: '代码相关', link: '/publish/ai/code' },
            { text: '编程实践', link: '/publish/ai/coding-01' }
          ]
        }
      ]
    },
    
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
