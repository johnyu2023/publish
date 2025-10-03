<template>
  <div class="article-list">
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
    
    <!-- 数据加载成功 - 按年月分组显示文章 -->
    <div v-else>
      <!-- 先按年份分组 -->
      <div v-for="year in sortedYears" :key="year" class="year-section">
        <h2 class="year-title" @click="toggleYear(`${year}年`)">
          {{ year }}年
          <span class="toggle-icon" :class="{ 'collapsed': yearCollapsed[`${year}年`] }">
            {{ yearCollapsed[`${year}年`] ? '▶' : '▼' }}
          </span>
        </h2>
        <div class="year-content" :class="{ 'hidden': yearCollapsed[`${year}年`] }">
          <!-- 再按月份分组 -->
          <div v-for="month in getMonthsForYear(year)" :key="`${year}-${month}`" class="month-section">
            <h3 class="month-title">{{ month }}月</h3>
            <ul>
              <li v-for="article in getArticlesForYearMonth(year, month)" :key="article.url">
                <div class="date-container">
                  <span class="article-date">{{ formatDateShort(article.date) }}</span>
                  <span class="date-spacing"></span>
                </div>
                <span class="article-title"><a :href="withBase(article.url)">{{ article.title }}</a></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { ref, computed, onMounted } from 'vue'

// 用于存储每个年份区域的折叠状态
const yearCollapsed = ref({})
// 数据加载状态
const loading = ref(true)
// 数据加载错误状态
const error = ref(false)
// 所有文章按日期排序
const articles = ref([])

// 切换年份区域的折叠状态
function toggleYear(year) {
  yearCollapsed.value[year] = !yearCollapsed.value[year]
}

// 从日期字符串中提取年月
function extractYearMonth(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return { year, month }
}

// 格式化日期为 "M-DD" 格式
function formatDateShort(dateStr) {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}

// 计算所有年份（降序排列）
const sortedYears = computed(() => {
  const years = new Set()
  articles.value.forEach(article => {
    const { year } = extractYearMonth(article.date)
    years.add(year)
  })
  return Array.from(years).sort((a, b) => b - a) // 降序排列，最新年份在前
})

// 获取指定年份的所有月份（降序排列）
function getMonthsForYear(year) {
  const months = new Set()
  articles.value.forEach(article => {
    const { year: articleYear, month } = extractYearMonth(article.date)
    if (articleYear === year) {
      months.add(month)
    }
  })
  return Array.from(months).sort((a, b) => b - a) // 降序排列，最新月份在前
}

// 获取指定年份和月份的所有文章（按日期降序排列）
function getArticlesForYearMonth(year, month) {
  return articles.value.filter(article => {
    const { year: articleYear, month: articleMonth } = extractYearMonth(article.date)
    return articleYear === year && articleMonth === month
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) // 降序排列，最新文章在前
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
    
    // 对所有文章按日期降序排序
    articles.value = (data.articles || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    
    // 初始化所有年份默认展开
    sortedYears.value.forEach(year => {
      yearCollapsed.value[`${year}年`] = false
    })
    
    // 打印排序后的结果，用于调试
    console.log('Sorted years:', sortedYears.value);
    console.log('Articles:', articles.value);
    
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
.article-list {
  margin-top: 2rem;
  height: calc(100vh - 200px); /* 固定高度，可根据需要调整 */
  overflow-y: auto; /* 添加垂直滚动条 */
  padding-right: 30px; /* 进一步增加右侧内边距，为滚动条留出更多空间 */
}

/* 美化滚动条 */
.article-list::-webkit-scrollbar {
  width: 8px;
}

.article-list::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.article-list::-webkit-scrollbar-thumb {
  background: var(--vp-c-border);
  border-radius: 4px;
}

.article-list::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.year-section {
  margin-bottom: 2rem;
}

.year-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.toggle-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.toggle-icon.collapsed {
  transform: rotate(-90deg);
}

.year-content {
  transition: max-height 0.5s ease, opacity 0.5s ease;
  max-height: 2000px;
  opacity: 1;
  overflow: hidden;
}

.year-content.hidden {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.month-section {
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.article-list ul {
  padding-left: 0;
  list-style-type: none;
}

.article-list li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
}

.article-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-right: 0.5rem;
}

.date-container {
  display: flex;
  align-items: center;
  min-width: 12rem; /* 大幅增加最小宽度，确保与滚动条有足够距离 */
}

.date-spacing {
  width: 3rem; /* 大幅增加额外的间距，确保日期和滚动轴之间有足够空间 */
}

.article-title {
  flex: 1;
}

.article-list a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.article-list a:hover {
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
</style>