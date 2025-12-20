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
    // 从新位置加载索引 - 通过 base 路径访问
    const res = await fetch('/publish/data/search-index.json')
    console.log('HTTP响应状态：', res.status)
    // 使用 text() 而不是 json()，因为 MiniSearch.loadJSON 需要 JSON 字符串
    const jsonString = await res.text()
    console.log('JSON字符串加载成功')
    
    // 加载索引时需要传入与构建时相同的配置（包括 tokenize 和 processTerm！）
    miniSearch.value = MiniSearch.loadJSON(jsonString, {
      fields: ['title', 'description', 'tags'],
      storeFields: ['url', 'date', 'title'],
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
  results.value = miniSearch.value.search(query.value)
}
</script>

<template>
  <div>
    <input v-model="query" @input="search" placeholder="搜索文章..." />
    
    <div v-if="loading">加载中...</div>
    
    <ul v-else-if="results.length">
      <li v-for="r in results" :key="r.id">
        <a :href="withBase(r.url)">{{ r.title }}</a>
        <span>{{ r.date }}</span>
      </li>
    </ul>
    
    <p v-else-if="!loading && query">未找到结果</p>
  </div>
</template>