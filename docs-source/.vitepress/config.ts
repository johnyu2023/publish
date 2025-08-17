import { defineConfig } from 'vitepress'

// 根据部署环境设置不同的 base 路径
const isProd = process.env.NODE_ENV === 'production'
// 检查是否为预览模式（vitepress preview）
const isPreview = process.argv.includes('preview')
// 检查是否为 GitHub Pages 环境（通过环境变量或其他方式判断）
// 本地开发和预览时使用 '/'，GitHub Pages 使用 '/docs/'
const isGitHubPages = process.env.DEPLOY_ENV === 'GITHUB_PAGES'

export default defineConfig({
  title: "我的技术博客",
  description: "分享技术心得和学习笔记",
  lang: 'zh-CN',
  // 设置基础路径
  // 本地开发和预览使用 '/'，GitHub Pages 使用 '/docs/'
  base: isGitHubPages ? '/docs/' : '/',
  cleanUrls: true,
  
  themeConfig: {
    siteTitle: '我的技术博客',
    
    nav: [
      { text: '首页', link: './' },
      { text: '文章', link: './posts/' },
      { text: '关于', link: './about' }
    ],
    
    sidebar: {
      '/posts/': [
        {
          text: '文章列表',
          items: [
            { text: '开始使用 VitePress', link: './posts/getting-started' },
            { text: 'Markdown 语法指南', link: './posts/markdown-guide' }
          ]
        }
      ],
      '/ai/': [
        {
          text: 'AI 相关',
          items: [
            { text: 'Function Calling 的原始形态', link: './ai/function_calling' },
            { text: '代码相关', link: './ai/code' }
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
