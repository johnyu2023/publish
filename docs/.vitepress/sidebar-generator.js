import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// === 工具函数：获取目录中文名 ===
function getDirectoryName(dirName) {
  const names = {
    ai: '人工智能',
    foundation: '基础知识',
    fullstack: '全栈开发',
    think: '观察思考',
    other: '杂七杂八',
    shanghai: '上海上海',
    system: '本站相关'
  }
  return names[dirName] || dirName.charAt(0).toUpperCase() + dirName.slice(1)
}

// === 默认侧边栏数据 ===
function getDefaultSideBar() {
  return [
    {
      text: '本站相关',
      items: [
        { text: '版本历史', link: '/system/history' },
        { text: 'LaTeX 规范', link: '/system/latex-spec' },
        { text: 'Mermaid 弹框测试', link: '/system/test-mermaid-modal' },
      ]
    }
  ]
}

// === 分类侧边栏数据 ===
async function getCategorySideBar(docsDir, category) {
  const targetDir = path.join(docsDir, category)
  const files = await fsPromises.readdir(targetDir)

  const mdFiles = files
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => {
      const filePath = path.join(targetDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(content)
      return {
        text: data.title || file.replace(/\.md$/, ''),
        link: `/${category}/${file.replace(/\.md$/, '')}`,
        date: data.date ? new Date(data.date).getTime() : 0
      }
    })
    .sort((a, b) => b.date - a.date)

  return [
    {
      text: getDirectoryName(category),
      items: mdFiles.map(({ text, link }) => ({ text, link }))
    }
  ]
}

// === 生成完整侧边栏数据的方法 ===
async function getSideBarData() {
  const docsDir = path.resolve(__dirname, '..')  // 修正路径，指向 docs 目录
  
  // 预生成所有可能的侧边栏配置
  const completeSidebar = {}
  
  // 根路径侧边栏
  completeSidebar['/'] = getDefaultSideBar()
  
  // 特定目录的侧边栏（只对存在的目录生成）
  const targetDirs = ['ai', 'foundation', 'fullstack', 'think', 'other', 'shanghai', 'system']
  for (const category of targetDirs) {
    const categoryDirPath = path.join(docsDir, category)
    if (fs.existsSync(categoryDirPath) && fs.statSync(categoryDirPath).isDirectory()) {
      const categoryPath = `/${category}/`
      completeSidebar[categoryPath] = await getCategorySideBar(docsDir, category)
    }
  }
  
  console.log('=== 完整侧边栏数据 ===')
  console.log(JSON.stringify(completeSidebar, null, 2))
  console.log('=====================')
  
  return completeSidebar
}

export { getSideBarData, getDefaultSideBar, getCategorySideBar }