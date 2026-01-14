<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import MiniSearch from 'minisearch'

const query = ref('')
const results = ref([])
const miniSearch = ref(null)
const loading = ref(true)

// 定义与构建索引时相同的分词函数（使用模拟的中文分词）
function tokenize(text) {
  // 更好地模拟中文分词逻辑，与构建索引时的 segmentit 分词保持一致
  if (!text) return []
  
  // 首先尝试按标点和空格基本分词
  const basicTokens = text
    .split(/[\s\-，。！？、；：""''（）【】\[\]<>]+/)
    .map(token => token.trim())
    .filter(token => token.length > 0)
  
  // 对中文字符进行额外处理，模拟中文分词效果
  const enhancedTokens = []
  for (const token of basicTokens) {
    if (token.length === 0) continue
    
    // 添加原始分词
    enhancedTokens.push(token)
    
    // 对中文内容进行更细粒度的处理
    if (/[\u4e00-\u9fa5]/.test(token)) {
      // 如果包含中文，尝试提取可能的词组
      // 添加单个字符
      for (let i = 0; i < token.length; i++) {
        const char = token[i]
        if (char.match(/[\u4e00-\u9fa5]/)) {
          enhancedTokens.push(char)
        }
      }
      
      // 添加双字符组合
      for (let i = 0; i < token.length - 1; i++) {
        const char1 = token[i]
        const char2 = token[i + 1]
        if (char1.match(/[\u4e00-\u9fa5]/) && char2.match(/[\u4e00-\u9fa5]/)) {
          enhancedTokens.push(char1 + char2)
        }
      }
      
      // 添加三字符组合（如果长度允许）
      for (let i = 0; i < token.length - 2; i++) {
        const chars = token.substring(i, i + 3)
        if (/^[\u4e00-\u9fa5]{3}$/.test(chars)) {
          enhancedTokens.push(chars)
        }
      }
      
      // 添加四字符组合（如成语等常见四字词组）
      for (let i = 0; i < token.length - 3; i++) {
        const chars = token.substring(i, i + 4)
        if (/^[\u4e00-\u9fa5]{4}$/.test(chars)) {
          enhancedTokens.push(chars)
        }
      }
      
      // 添加五字符组合
      for (let i = 0; i < token.length - 4; i++) {
        const chars = token.substring(i, i + 5)
        if (/^[\u4e00-\u9fa5]{5}$/.test(chars)) {
          enhancedTokens.push(chars)
        }
      }
      
      // 添加六字符组合
      for (let i = 0; i < token.length - 5; i++) {
        const chars = token.substring(i, i + 6)
        if (/^[\u4e00-\u9fa5]{6}$/.test(chars)) {
          enhancedTokens.push(chars)
        }
      }
    }
    
    // 对英文内容，保持原有处理方式
    if (token.match(/[a-zA-Z]/) && !token.match(/[\u4e00-\u9fa5]/)) {
      // 保持英文单词的完整性
      enhancedTokens.push(token.toLowerCase())
    }
  }
  
  return [...new Set(enhancedTokens)] // 去重
}

function processTerm(term) {
  const cleaned = term.trim().toLowerCase()  // 确保去除首尾空格后再转小写
  return cleaned.length > 1 ? cleaned : null
}

onMounted(async () => {
  try {
    console.log('开始加载搜索索引...')
    // 使用 BASE_URL + 绝对路径加载搜索索引，public 目录内容会映射到网站根路径
    const res = await fetch(import.meta.env.BASE_URL + 'data/search-index.json')
    console.log('HTTP响应状态：', res.status)
    // 使用 text() 而不是 json()，因为 MiniSearch.loadJSON 需要 JSON 字符串
    const jsonString = await res.text()
    console.log('JSON字符串加载成功')
    
    // 加载索引时需要传入与构建时相同的配置（包括 tokenize 和 processTerm！）
    miniSearch.value = MiniSearch.loadJSON(jsonString, {
      fields: ['title', 'description', 'tags', 'tokens'],
      storeFields: ['url', 'date', 'title', 'originalTags'],
      tokenize,
      processTerm,
      searchOptions: { 
        fuzzy: 0.2, 
        prefix: true,
        boost: { title: 2, description: 1, tags: 1.5, tokens: 1 },
        // 确保使用相同的分词器进行搜索
        tokenize: tokenize,
        processTerm: processTerm
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
  
  // 获取搜索结果，使用与构建索引时相同的分词函数
  let searchResults = miniSearch.value.search(query.value.trim(), {
    tokenize: tokenize,
    processTerm: processTerm,
    fuzzy: 0.2,
    prefix: true,
    boost: { title: 2, description: 1, tags: 1.5, tokens: 1 }
  })
  
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