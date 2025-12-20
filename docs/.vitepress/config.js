// docs/.vitepress/config.js
import { defineConfig } from 'vitepress'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

// === 工具函数：获取目录中文名 ===
function getDirectoryName(dirName) {
  const names = {
    ai: '人工智能',
    foundation: '基础知识',
    fullstack: '全栈开发',
    think: '观察思考',
    other: '技术文档'
  }
  return names[dirName] || dirName.charAt(0).toUpperCase() + dirName.slice(1)
}

// === 动态生成 sidebar（顶层 await）===
const docsDir = path.resolve(__dirname, '..')
const items = await fsPromises.readdir(docsDir)
const dynamicSidebar = {}

const targetDirs = ['ai', 'foundation', 'fullstack', 'think', 'other']

for (const item of items) {
  const itemPath = path.join(docsDir, item)
  const stat = await fsPromises.stat(itemPath)

  // 跳过非目录或特殊目录
  if (!stat.isDirectory() || ['.vitepress', '.vuepress'].includes(item)) continue
  if (!targetDirs.includes(item)) continue

  const dirPath = `/${item}/`
  const files = await fsPromises.readdir(itemPath)

  const mdFiles = files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const filePath = path.join(itemPath, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(content)
      return {
        text: data.title || file.replace(/\.md$/, ''),
        link: `/${item}/${file.replace(/\.md$/, '')}`,
        date: data.date ? new Date(data.date).getTime() : 0
      }
    })
    .sort((a, b) => b.date - a.date) // 按 date 倒序

  if (mdFiles.length > 0) {
    dynamicSidebar[dirPath] = [
      {
        text: getDirectoryName(item),
        items: mdFiles.map(({ text, link }) => ({ text, link }))
      }
    ]
  }
}

// === 全局数据收集（用于 buildEnd）===
if (!globalThis.vitepressPageData) {
  globalThis.vitepressPageData = {}
}

// === 导出配置 ===
export default defineConfig({
  base: '/publish/',
  title: 'AI时代的技术分享2025',
  description: 'AI时代的技术分享和感悟',

  vite: {
    server: {
      fs: {
        allow: ['.']
      }
    }
  },

  markdown: {
    config(md) {
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

  // 收集每页的 frontmatter 数据
  transformPageData(pageData) {
    globalThis.vitepressPageData[pageData.relativePath] = {
      title: pageData.title,
      frontmatter: pageData.frontmatter
    }
  },

  // 构建结束后生成 all-articles.json
  buildEnd: async (siteConfig) => {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const collectedData = globalThis.vitepressPageData || {}
    const docsDir = path.resolve(__dirname, '..')

    const getAllMarkdownFiles = async (dir) => {
      let results = []
      const files = await fs.readdir(dir)
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = await fs.stat(filePath)
        if (stat.isDirectory()) {
          results = results.concat(await getAllMarkdownFiles(filePath))
        } else if (file.endsWith('.md') && !filePath.includes('.vitepress')) {
          results.push(filePath)
        }
      }
      return results
    }

    try {
      const markdownFiles = await getAllMarkdownFiles(docsDir)
      const articles = []

      for (const file of markdownFiles) {
        const relativePath = path.relative(docsDir, file).split(path.sep).join('/')
        const pageData = collectedData[relativePath]

        let urlPath = relativePath.replace(/\.md$/, '')
        if (urlPath.endsWith('/index.md')) {
          urlPath = urlPath.replace(/\/index\.md$/, '/')
        } else {
          urlPath = urlPath.replace(/\.md$/, '')
        }
        if (!urlPath.startsWith('/')) urlPath = '/' + urlPath

        // 排除非文章页面
        const excludePaths = ['/about', '/sample-article', '/experiments', '/mermaid-test', '/test-mermaid-modal']
        if (excludePaths.some(p => urlPath.startsWith(p))) continue

        articles.push({
          url: urlPath,
          title: pageData?.frontmatter.title || pageData?.title || '',
          date: pageData?.frontmatter.date,
          tags: pageData?.frontmatter.tags || [],
          description: pageData?.frontmatter.description || ''
        })
      }

      const outputPath = path.resolve(__dirname, 'public/all-articles.json')
      await fs.writeFile(outputPath, JSON.stringify(articles, null, 2))
      console.log(`✅ Generated all-articles.json with ${articles.length} articles`)
    } catch (error) {
      console.error('Error generating all-articles.json:', error)
    }
  },

  // === 主题配置 ===
  themeConfig: {
    outline: { level: [2, 4] },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'AI', link: '/ai/future-of-ai' },
      { text: 'Foundation', link: '/foundation/data-structure' },
      { text: 'FullStack', link: '/fullstack/fullstack-guide' },
      { text: 'Think', link: '/think/trends-analysis' },
      { text: 'Other', link: '/other/api-documentation' },
      { text: 'About', link: '/about' }
    ],

    sidebar: {
      ...dynamicSidebar,
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
})