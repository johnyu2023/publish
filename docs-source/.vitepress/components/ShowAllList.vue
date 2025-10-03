<template>
  <div class="show-all-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
      </div>
      <div class="loading-text">数据读取中...</div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="error-text">数据获取失败...</div>
      <button @click="loadArticlesData" class="retry-button">重试</button>
    </div>
    
    <!-- 数据加载成功 - 按目录分组显示所有文章 -->
    <div v-else class="content">
      <div v-for="directory in directories" :key="directory.key" class="directory-section">
        <h2 class="directory-title">{{ directory.title }}</h2>
        <ul class="article-list">
          <li v-for="article in directory.articles" :key="article.url" class="article-item">
            <span class="article-date">{{ formatDate(article.date) }}</span>
            <span class="article-title">
              <a :href="withBase(article.url)" @click="onArticleClick">{{ article.title }}</a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { ref, computed, onMounted } from 'vue'

// 目录名称映射
const directoryTitles = {
  'ai': '学习笔记',
  'posts': '技术文章',
  'think': '观察思考',
  'web': '前端开发'
}

// 数据加载状态
const loading = ref(true)
// 数据加载错误状态
const error = ref(false)
// 所有文章
const articles = ref([])

// 按目录分组文章
const directories = computed(() => {
  // 按目录分组
  const articlesByDirectory = {}
  
  articles.value.forEach(article => {
    if (!articlesByDirectory[article.directory]) {
      articlesByDirectory[article.directory] = []
    }
    articlesByDirectory[article.directory].push(article)
  })
  
  // 转换为数组格式并排序
  return Object.keys(articlesByDirectory).map(dir => ({
    key: dir,
    title: directoryTitles[dir] || dir,
    articles: articlesByDirectory[dir].sort((a, b) => new Date(b.date) - new Date(a.date))
  })).sort((a, b) => {
    // 按目录顺序排序
    const order = ['ai', 'posts', 'think', 'web']
    return order.indexOf(a.key) - order.indexOf(b.key)
  })
})

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 文章点击处理函数
function onArticleClick() {
  // 触发自定义事件，通知父组件关闭模态框
  window.dispatchEvent(new CustomEvent('close-modal'))
}

// 加载文章数据
async function loadArticlesData() {
  try {
    loading.value = true
    error.value = false
    
    // 使用相对路径加载 JSON 文件
    const response = await fetch(withBase('/data/list.json'))
    
    if (!response.ok) {
      throw new Error('无法加载数据文件')
    }
    
    const data = await response.json()
    
    // 存储所有文章
    articles.value = data.articles || []
    
    loading.value = false
  } catch (err) {
    console.error('加载文章数据失败:', err)
    loading.value = false
    error.value = true
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadArticlesData()
})
</script>

<style scoped>
.show-all-list {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.content {
  padding: 10px;
}

.directory-section {
  margin-bottom: 2rem;
}

.directory-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand);
  color: var(--vp-c-text-1);
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: baseline;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.article-item:hover {
  background-color: var(--vp-c-bg-mute);
}

.article-date {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-right: 1rem;
  min-width: 80px;
}

.article-title {
  flex: 1;
}

.article-title a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.article-title a:hover {
  text-decoration: underline;
}

/* 加载状态样式 */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--vp-c-text-2);
}

.loading-icon, .error-icon {
  margin-bottom: 1rem;
}

.loading-text, .error-text {
  font-size: 1.2rem;
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.retry-button:hover {
  background-color: var(--vp-c-brand-dark);
}

/* 滚动条样式 */
.show-all-list::-webkit-scrollbar {
  width: 6px;
}

.show-all-list::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 3px;
}

.show-all-list::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand);
  border-radius: 3px;
}

.show-all-list::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-dark);
}
</style>