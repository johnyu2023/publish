// scripts/build-search-index.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import MiniSearch from 'minisearch'

const DOCS_DIR = 'docs'
const DATA_DIR = 'docs/data'  // 修改为新的数据目录
const EXCLUDE_FILES = ['about.md', 'sample-article.md', 'index.md', 'experiments.md']

function getAllMdFiles(dir) {
  let results = []
  const list = readdirSync(dir)
  for (const file of list) {
    const path = join(dir, file)
    const stat = statSync(path)
    if (stat.isDirectory() && file !== 'assets') {
      results = results.concat(getAllMdFiles(path))
    } else if (file.endsWith('.md')) {
      results.push(path)
    }
  }
  return results
}

// 1. 读取所有 .md 文件并解析 frontmatter
const files = getAllMdFiles(DOCS_DIR)
const articles = []

for (const file of files) {
  const relPath = file.replace(/^docs[\/\\]/, '')
  if (EXCLUDE_FILES.includes(relPath)) continue

  const content = readFileSync(file, 'utf8')
  const { data } = matter(content)

  if (!data.title) continue

  articles.push({
    id: relPath, // minisearch 需要唯一 id
    url: '/' + relPath.replace(/\.md$/, '').replace(/\\/g, '/'),
    title: data.title,
    date: data.date,
    tags: Array.isArray(data.tags) ? data.tags.join(' ') : '',
    description: data.description || ''
  })
}

// 2. 创建并填充 minisearch 索引
const miniSearch = new MiniSearch({
  fields: ['title', 'description', 'tags'],
  storeFields: ['url', 'date', 'title'],
  searchOptions: {
    fuzzy: 0.2,
    prefix: true,
    boost: { title: 2, description: 1, tags: 1.5 }
  },
  // 为中文内容添加适当的分词处理
  tokenize: (text) => text
    .split(/[\s\-，。！？、]+/)
    .map(token => token.trim())  // 确保去除每个分词的首尾空格
    .filter(token => token.length > 0),
  processTerm: (term) => {
    const cleaned = term.trim().toLowerCase()  // 确保去除首尾空格后再转小写
    return cleaned.length > 1 ? cleaned : null
  }
})

miniSearch.addAll(articles)

// 3. 保存到 docs/data 目录
writeFileSync(
  join(DATA_DIR, 'all-articles.json'),
  JSON.stringify(articles, null, 2)
)

writeFileSync(
  join(DATA_DIR, 'search-index.json'),
  JSON.stringify(miniSearch.toJSON())
)

console.log(`✅ 生成索引：共 ${articles.length} 篇文章`)