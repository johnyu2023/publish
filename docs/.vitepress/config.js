export default {
  base: '/publish/',  // 如果是发布到 GitHub Pages 项目站点，请保留此行；如果是用户站点则删除此行
  title: 'AI时代的技术分享-v2',
  description: 'AI时代的技术分享和感悟',
  themeConfig: {
    outline: {
      level: [2, 4]  // 显示从h2到h4的所有层级
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'AI', link: '/ai/future-of-ai' },
      { text: 'Foundation', link: '/foundation/data-structure' },
      { text: 'FullStack', link: '/fullstack/fullstack-guide' },
      { text: 'Think', link: '/think/trends-analysis' },
      { text: 'Other', link: '/other/api-documentation' },
      { text: 'Sample Article', link: '/sample-article' },
      { text: 'Experiments', link: '/experiments' },
      { text: 'About', link: '/about' }
    ],
    sidebar: {
      '/ai/': [
        {
          text: '人工智能',
          items: [
            { text: '人工智能的未来发展', link: '/ai/future-of-ai' }
          ]
        }
      ],
      '/foundation/': [
        {
          text: '基础知识',
          items: [
            { text: '计算机基础知识', link: '/foundation/data-structure' }
          ]
        }
      ],
      '/fullstack/': [
        {
          text: '全栈开发',
          items: [
            { text: '全栈开发指南', link: '/fullstack/fullstack-guide' }
          ]
        }
      ],
      '/think/': [
        {
          text: '观察思考',
          items: [
            { text: '技术观察与思考', link: '/think/trends-analysis' }
          ]
        }
      ],
      '/other/': [
        {
          text: '技术文档',
          items: [
            { text: '技术文档示例', link: '/other/api-documentation' }
          ]
        }
      ],
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Sample Article', link: '/sample-article' },
            { text: 'Experiments', link: '/experiments' },
            { text: 'About', link: '/about' }
          ]
        }
      ]
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present'
    }
  }
}