<template>
  <div class="article-list-container" @wheel="handleMouseWheel" @touchmove="handleTouchMove">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else>
      <div v-for="yearData in sortedYearGroups" :key="yearData.year" class="year-section">
        <h2 class="year-title" @click="toggleYear(yearData.year)">
          {{ yearData.year }} 年
          <span class="toggle-icon">{{ expandedYears.has(yearData.year.toString()) ? '▼' : '▶' }}</span>
        </h2>
        <div v-show="expandedYears.has(yearData.year.toString())" class="month-sections">
          <div v-for="monthData in yearData.months" :key="monthData.month" class="month-section">
            <h3 class="month-title">{{ monthData.month }} 月</h3>
            <ul class="article-list">
              <li v-for="article in monthData.articles" :key="article.url" class="article-item">
                <a :href="withBase(article.url)" class="article-link">{{ article.title }}</a>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const expandedYears = ref(new Set())

// 处理鼠标滚轮事件，防止滚动传播
const handleMouseWheel = (event) => {
  const element = event.currentTarget;
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  const delta = event.deltaY;

  // 检查是否在滚动边界
  const isAtTop = scrollTop <= 0;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight;
  
  // 如果在滚动边界且试图继续滚动，则阻止默认行为和事件传播
  if ((isAtTop && delta < 0) || (isAtBottom && delta > 0)) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
  
  // 如果在滚动范围内，允许滚动但阻止事件传播到父元素
  event.stopPropagation();
  event.stopImmediatePropagation();
}

// 处理触摸滚动事件，防止滚动传播
const handleTouchMove = (event) => {
  const element = event.currentTarget;
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  
  // 检查是否在滚动边界
  const isAtTop = scrollTop <= 0;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight;
  
  // 如果在滚动边界，阻止事件传播
  if (isAtTop || isAtBottom) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
  
  // 如果在滚动范围内，阻止事件传播到父元素
  event.stopPropagation();
  event.stopImmediatePropagation();
}

// 按年份和月份分组文章并进行排序
const groupedArticlesByYear = computed(() => {
  const groups = {}
  
  // 按日期降序排列
  const sortedArticles = [...articles.value].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
  
  sortedArticles.forEach(article => {
    const date = new Date(article.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    
    if (!groups[year]) {
      groups[year] = {}
    }
    
    if (!groups[year][month]) {
      groups[year][month] = []
    }
    
    groups[year][month].push(article)
  })
  
  return groups
})

// 将分组后的数据转换为有序数组格式，确保排序顺序正确
const sortedYearGroups = computed(() => {
  const groups = groupedArticlesByYear.value
  
  // 先对年份进行降序排序
  const sortedYears = Object.keys(groups)
    .map(year => parseInt(year))
    .sort((a, b) => b - a)
  
  // 为每个年份创建包含有序月份数据的对象
  return sortedYears.map(year => {
    const yearGroups = groups[year]
    // 对月份进行降序排序
    const sortedMonths = Object.keys(yearGroups)
      .map(month => parseInt(month))
      .sort((a, b) => b - a)
    
    // 为每个月份创建包含文章数据的对象
    const monthsData = sortedMonths.map(month => ({
      month: month,
      articles: yearGroups[month]
    }))
    
    return {
      year: year,
      months: monthsData
    }
  })
})

// 切换年份展开/收起状态
const toggleYear = (year) => {
  const yearStr = year.toString() // 确保使用字符串类型作为Set的键
  if (expandedYears.value.has(yearStr)) {
    expandedYears.value.delete(yearStr)
  } else {
    expandedYears.value.add(yearStr)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 加载文章数据
const loadArticles = async () => {
  try {
    const response = await fetch(withBase('/data/list.json'))
    const data = await response.json()
    articles.value = data.articles || []
    
    // 默认展开最新年份
    if (data.articles && data.articles.length > 0) {
      const latestYear = new Date(data.articles[0].date).getFullYear()
      expandedYears.value.add(latestYear.toString())
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.article-list-container {
  max-width: 800px;
  margin: 0 auto;
  max-height: 500px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.year-section {
  margin-bottom: 20px;
}

.year-title {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.toggle-icon {
  font-size: 14px;
}

.month-section {
  margin: 15px 0;
}

.month-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.article-list {
  list-style: none;
  padding: 0;
}

.article-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.article-link {
  text-decoration: none;
  color: var(--vp-c-brand);
  flex: 1;
}

.article-link:hover {
  text-decoration: underline;
}

.article-date {
  color: #999 !important;
  font-size: 14px !important;
  margin-left: 10px !important;
  white-space: nowrap !important;
  padding-left: 10px !important;
  display: inline-block !important;
}
</style>