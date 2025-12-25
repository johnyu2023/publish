<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import MiniSearch from 'minisearch'

const query = ref('')
const results = ref([])
const miniSearch = ref(null)
const loading = ref(true)

// 定义与构建索引时相同的分词函数（构建索引时使用的是简单按标点/空格分词）
function tokenize(text) {
  return text
    .split(/[\s\-，。！？、]+/)
    .map(token => token.trim())  // 确保去除每个分词的首尾空格
    .filter(token => token.length > 0)
}

function processTerm(term) {
  const cleaned = term.trim().toLowerCase()  // 确保去除首尾空格后再转小写
  return cleaned.length > 1 ? cleaned : null
}

onMounted(async () => {
  try {
    console.log('开始加载搜索索引...')
    // 使用 BASE_URL + 绝对路径加载搜索索引，public 目录内容会映射到网站根路径
    const res = await fetch(new URL(import.meta.env.BASE_URL + 'data/search-index.json', import.meta.url))
    console.log('HTTP响应状态：', res.status)
    // 使用 text() 而不是 json()，因为 MiniSearch.loadJSON 需要 JSON 字符串
    const jsonString = await res.text()
    console.log('JSON字符串加载成功')
    
    // 加载索引时需要传入与构建时相同的配置（包括 tokenize 和 processTerm！）
    miniSearch.value = MiniSearch.loadJSON(jsonString, {
      fields: ['title', 'description', 'tags'],
      storeFields: ['url', 'date', 'title', 'originalTags'],
      tokenize,
      processTerm,
      searchOptions: { 
        fuzzy: 0.2, 
        prefix: true,
        boost: { title: 2, description: 1, tags: 1.5 }
      }
    })
    
    console.log('MiniSearch 实例创建成功，文档数量：', miniSearch.value.documentCount)
    
    // 测试搜索 "ai"
    const testResults = miniSearch.value.search('ai')
    console.log('测试搜索 "ai" 的结果数量：', testResults.length)
    console.log('测试搜索结果：', testResults)
  } catch (e) {
    console.error('加载搜索索引失败', e.message || e)
    console.error('错误堆栈：', e.stack)
  } finally {
    loading.value = false
  }
})

function search() {
  if (!miniSearch.value || !query.value.trim()) {
    results.value = []
    return
  }
  
  // 获取搜索结果
  let searchResults = miniSearch.value.search(query.value)
  
  // 去重：根据 URL 去除重复项（保留第一个匹配的结果）
  const seenUrls = new Set()
  searchResults = searchResults.filter(result => {
    if (seenUrls.has(result.url)) {
      return false
    }
    seenUrls.add(result.url)
    return true
  })
  
  // 过滤掉首页（URL 为 "/" 或 "/index" 的文档）
  searchResults = searchResults.filter(result => {
    return result.url !== '/' && result.url !== '/index' && !result.url.includes('index.html')
  })
  
  // 按日期倒序排列（有日期的排在前面，日期越新的越靠前）
  searchResults.sort((a, b) => {
    // 如果两个结果都有日期，则比较日期
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date)
    }
    // 如果 a 有日期而 b 没有，则 a 排前面
    if (a.date && !b.date) return -1
    // 如果 b 有日期而 a 没有，则 b 排前面
    if (b.date && !a.date) return 1
    // 如果两个都没有日期，则保持原有顺序
    return 0
  })
  
  results.value = searchResults
}
</script>

<template>
  <div class="search-container">
    <div class="header">高级搜索</div>
    <input v-model="query" @input="search" placeholder="搜索文章..." class="search-input" />
    
    <div v-if="loading">加载中...</div>
    
    <ul v-else-if="results.length" class="results-list">
      <li v-for="(r, index) in results" :key="r.id">
        <span class="index">{{ index + 1 }}.</span>
        <a :href="withBase(r.url)">{{ r.title }}</a>
        <span v-if="r.date" class="date">{{ r.date }}</span>
      </li>
    </ul>
    
    <p v-else-if="!loading && query">未找到结果</p>
  </div>
</template>

<style scoped>
.search-container {
  padding: 10px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.header {
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.search-input {
  background-color: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.results-list {
  padding: 10px;
  flex-grow: 1;
}

.index {
  margin-right: 8px;
  color: #666;
  font-weight: bold;
}

.date {
  margin-left: 8px;
  color: #888;
  font-size: 0.9em;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

a {
  text-decoration: none;
  color: #2c3e50;
}

a:hover {
  text-decoration: underline;
}
</style>