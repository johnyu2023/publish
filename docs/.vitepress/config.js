import { writeFileSync } from 'fs'
import { resolve } from 'path'

export default {
  base: '/publish/',  // 如果是发布到 GitHub Pages 项目站点，请保留此行；如果是用户站点则删除此行
  vite: {
    server: {
      fs: {
        allow: ['.']
      }
    }
  },
  title: 'AI时代的技术分享-v2',
  description: 'AI时代的技术分享和感悟',
  markdown: {
    config: (md) => {
      // 配置 mermaid 渲染为自定义组件
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args
        const token = tokens[idx]
        const info = token.info.trim()
        
        if (info.startsWith('mermaid')) {
          // 将 mermaid 代码块渲染为自定义组件
          return `<Mermaid code="${encodeURIComponent(token.content)}" />`
        }
        
        return defaultFence(...args)
      }
    }
  },
  // 使用 transformPageData 钩子收集页面数据
  transformPageData(pageData) {
    // 在全局对象中存储页面数据，供 buildEnd 使用
    if (!globalThis.vitepressPageData) {
      globalThis.vitepressPageData = {};
    }
    
    // 使用相对 URL 作为键存储页面数据
    globalThis.vitepressPageData[pageData.relativePath] = {
      title: pageData.title,
      frontmatter: pageData.frontmatter
    };
  },
  
  buildEnd: async (siteConfig) => {
    // 导入必要的模块
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // 获取收集的页面数据
    const collectedData = globalThis.vitepressPageData || {};
    
    // 获取 docs 目录路径
    const docsDir = path.resolve(__dirname, '..');
    
    // 读取所有 Markdown 文件
    const getAllMarkdownFiles = async (dir) => {
      let results = [];
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          // 递归读取子目录
          results = results.concat(await getAllMarkdownFiles(filePath));
        } else if (file.endsWith('.md') && !filePath.includes('.vitepress')) {
          results.push(filePath);
        }
      }
      
      return results;
    };
    
    try {
      // 获取所有 Markdown 文件
      const markdownFiles = await getAllMarkdownFiles(docsDir);
      
      const articles = [];
      
      for (const file of markdownFiles) {
        const relativePath = path.relative(docsDir, file).split(path.sep).join('/');
        
        // 查找收集的页面数据
        const pageData = collectedData[relativePath];
        
        // 为非 index 文件生成 URL 路径
        let urlPath = relativePath.replace(/\.md$/, '');
        if (urlPath.endsWith('/index.md')) {
          urlPath = urlPath.replace(/\/index\.md$/, '/');
        } else {
          urlPath = urlPath.replace(/\.md$/, '');
        }
        
        // 不以 / 开头的情况要加上
        if (!urlPath.startsWith('/')) {
          urlPath = '/' + urlPath;
        }
        
        // 排除特定页面
        if (
          urlPath.startsWith('/about') || 
          urlPath.startsWith('/sample-article') || 
          urlPath.startsWith('/experiments') || 
          urlPath.startsWith('/mermaid-test') || 
          urlPath.startsWith('/test-mermaid-modal')
        ) {
          continue;
        }
        
        articles.push({
          url: urlPath,
          title: pageData?.frontmatter.title || pageData?.title || '',
          date: pageData?.frontmatter.date,
          tags: pageData?.frontmatter.tags || [],
          description: pageData?.frontmatter.description || ''
        });
      }
      
      // 写入 public 目录（构建后可通过 /all-articles.json 访问）
      const outputPath = path.resolve(__dirname, 'public/all-articles.json');
      await fs.writeFile(outputPath, JSON.stringify(articles, null, 2));
      console.log(`✅ Generated all-articles.json with ${articles.length} articles using transformPageData hook`);
    } catch (error) {
      console.error('Error generating all-articles.json:', error);
    }
  },
  themeConfig: {
    outline: {
      level: [2, 4]  // 显示从h2到h4的所有层级
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Mermaid Test', link: '/mermaid-test' },
      { text: 'Mermaid Modal Test', link: '/test-mermaid-modal' },
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