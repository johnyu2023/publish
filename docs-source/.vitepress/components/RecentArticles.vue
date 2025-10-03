<template>
  <div class="latest-articles-section">
    <!-- 最新文章标题 -->
    <h2 class="section-title"><span style="color: inherit; cursor: pointer;" @click="openArticlesModal">最新文章</span></h2>
    
    <!-- 最近更新区域 -->
    <div class="recent-articles">
      <!-- 最近更新标题 -->
      <div class="recent-title">
        <span class="icon">📖</span> 最近更新
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-text">数据读取中...</div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-text">数据获取失败...</div>
        <button @click="loadArticlesData" class="retry-button">重试</button>
      </div>
      
      <!-- 数据加载成功 -->
      <div v-else class="article-list">
        <ul>
          <li v-for="article in recentArticles" :key="article.url">
            <span class="article-bullet">•</span>
            <a :href="withBase(article.url)" class="article-link">{{ article.title }} <span class="article-date">- {{ formatDate(article.date) }}</span></a>
          </li>
        </ul>
      </div>
      
      <!-- RSS订阅链接 -->
      <div class="rss-subscribe">
        <span class="rss-icon">📡</span>
        <a :href="withBase('rss.xml')" class="rss-link">订阅 RSS Feed</a>
        <span class="rss-text">获取最新文章更新</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { ref, onMounted } from 'vue'

// 打开文章列表模态框
function openArticlesModal() {
  // 触发自定义事件，让theme/index.js中的代码处理模态框的打开
  const event = new CustomEvent('open-articles-modal')
  window.dispatchEvent(event)
}

// 数据加载状态
const loading = ref(true)
// 数据加载错误状态
const error = ref(false)
// 最近的文章
const recentArticles = ref([])

// 格式化日期为 "YYYY-MM-DD" 格式
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 加载文章数据
async function loadArticlesData() {
  try {
    loading.value = true
    error.value = false
    
    // 使用相对路径加载 JSON 文件，添加时间戳避免缓存
    const response = await fetch(withBase(`/data/list.json?t=${Date.now()}`))
    
    if (!response.ok) {
      throw new Error('无法加载数据文件')
    }
    
    const data = await response.json()
    
    // 对所有文章按日期降序排序
    const sortedArticles = (data.articles || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    
    // 只取前6篇文章
    recentArticles.value = sortedArticles.slice(0, 6)
    
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
/* 整个最新文章区域 */
.latest-articles-section {
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 最新文章标题 */
.section-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

/* 最近更新区域 */
.recent-articles {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

/* 最近更新标题 */
.recent-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.1rem;
}

/* 文章列表 */
.article-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-list li {
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: flex;
  align-items: baseline;
  font-size: 0.9rem;
}

.article-bullet {
  color: var(--vp-c-brand);
  margin-right: 0.5rem;
  font-weight: bold;
}

.article-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  flex: 1;
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
}

.article-link:hover {
  color: var(--vp-c-brand);
}

.article-link:hover .article-date {
  color: var(--vp-c-text-2);
}

.article-date {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  margin-left: 0.25rem;
  white-space: nowrap;
  font-weight: normal;
}

/* RSS订阅区域 */
.rss-subscribe {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rss-icon {
  font-size: 0.9rem;
}

.rss-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  margin: 0 0.25rem;
}

.rss-link:hover {
  text-decoration: underline;
}

/* 加载和错误状态 */
.loading-state, .error-state {
  padding: 0.5rem 0;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.retry-button {
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.retry-button:hover {
  background-color: var(--vp-c-brand-dark);
}
</style>
