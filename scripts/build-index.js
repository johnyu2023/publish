// scripts/build-index.js
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const DOCS_DIR = 'docs'
const PUBLIC_DIR = 'docs/.vitepress/public'

// 确保目录存在
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true })
}

function getAllMdFiles(dir) {
  let results = []
  const list = readdirSync(dir)
  list.forEach(file => {
    const pathToFile = join(dir, file)
    const stat = statSync(pathToFile)
    if (stat && stat.isDirectory() && file !== 'assets') {
      results = results.concat(getAllMdFiles(pathToFile))
    } else if (file.endsWith('.md')) {
      results.push(pathToFile)
    }
  })
  return results
}

export function buildIndex() {
  const files = getAllMdFiles(DOCS_DIR)
  console.log(`Found ${files.length} markdown files`)
  const articles = []
  let processedCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const relPath = file.replace(/^docs[\/\\]/, '').replace(/\\/g, '/')
      // 排除不需要的页面
      if (['about.md', 'sample-article.md', 'index.md'].includes(relPath)) {
        console.log(`Skipping excluded file: ${relPath}`)
        continue
      }

      const content = readFileSync(file, 'utf8')
      const { data } = matter(content)

      if (!data.title) {
        console.log(`Skipping file without title: ${relPath}`)
        continue
      }

      articles.push({
        url: '/' + relPath.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        description: data.description || ''
      })
      
      processedCount++
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message)
      errorCount++
    }
  }

  const outputPath = join(PUBLIC_DIR, 'all-articles.json')
  writeFileSync(outputPath, JSON.stringify(articles, null, 2))
  console.log(`✅ Generated index with ${articles.length} articles (${processedCount} processed, ${errorCount} errors)`)
}

// 直接执行
buildIndex()