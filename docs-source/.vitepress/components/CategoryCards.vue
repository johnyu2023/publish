<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">正在加载分类数据...</div>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="error-container">
    <div class="error-icon">⚠️</div>
    <div class="error-text">数据加载失败</div>
    <button @click="loadCategoryData" class="retry-button">重试</button>
  </div>

  <!-- 分类卡片网格 -->
  <div v-else class="category-grid">
    <div
      v-for="category in categories"
      :key="category.id"
      class="category-card"
      @click="navigateToCategory(category)"
    >
      <div class="card-content">
        <div class="category-icon">{{ getIconForCategory(category.directory) }}</div>
        <div class="category-info">
          <h3 class="category-title">{{ category.directory }}</h3>
          <p class="category-description">{{ getDescriptionForCategory(category.directory) }}</p>
          <div class="category-meta">
            <span class="article-count">{{ getArticleCount(category.title) }} 篇文章</span>
            <span class="latest-date">{{ getLatestDate(category.title) }}</span>
          </div>
        </div>
      </div>
      <div class="card-arrow">→</div>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { ref, onMounted } from 'vue'

// 响应式数据
const loading = ref(true)
const error = ref(false)
const categories = ref([])
const articles = ref([])

// 分类信息映射
const categoryInfo = {
  '基础知识': {
    icon: '📚',
    description: '计算机科学基础知识学习与总结'
  },
  '人工智能': {
    icon: '🤖',
    description: 'AI技术学习与实践记录'
  },
  '前端开发': {
    icon: '🌐',
    description: '前端开发技术与最佳实践分享'
  },
  '观察思考': {
    icon: '💡',
    description: '对技术趋势和行业发展的一些思考'
  },
  '技术文档': {
    icon: '📄',
    description: '工具使用、开发规范等技术文档'
  }
}

// 获取分类图标
function getIconForCategory(directory) {
  return categoryInfo[directory]?.icon || '📁'
}

// 获取分类描述
function getDescriptionForCategory(directory) {
  return categoryInfo[directory]?.description || '技术文章分享'
}

// 获取文章数量
function getArticleCount(categoryKey) {
  return articles.value.filter(article => article.directory === categoryKey).length
}

// 获取最新文章日期
function getLatestDate(categoryKey) {
  const categoryArticles = articles.value.filter(article => article.directory === categoryKey)
  if (categoryArticles.length === 0) return ''

  const latest = categoryArticles.reduce((prev, current) =>
    new Date(current.date) > new Date(prev.date) ? current : prev
  )

  return formatDate(latest.date)
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '昨天更新'
  if (diffDays <= 7) return `${diffDays}天前更新`
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}周前更新`

  return `${date.getMonth() + 1}月更新`
}

// 导航到分类最新文章
function navigateToCategory(category) {
  const categoryArticles = articles.value.filter(article => article.directory === category.title)
  if (categoryArticles.length > 0) {
    // 按日期排序，取最新的
    const sortedArticles = categoryArticles.sort((a, b) => new Date(b.date) - new Date(a.date))
    const latestArticle = sortedArticles[0]

    // 跳转到最新文章
    window.location.href = withBase(latestArticle.url)
  }
}

// 加载分类数据
async function loadCategoryData() {
  try {
    loading.value = true
    error.value = false

    // 并行加载分类和文章数据
    const [categoryResponse, articleResponse] = await Promise.all([
      fetch(withBase('/data/category.json')),
      fetch(withBase('/data/list.json'))
    ])

    if (!categoryResponse.ok || !articleResponse.ok) {
      throw new Error('无法加载数据文件')
    }

    const categoryData = await categoryResponse.json()
    const articleData = await articleResponse.json()

    // 按指定顺序过滤和排序分类
    const categoryOrder = ['foundation', 'ai', 'web', 'think', 'other']
    const orderedCategories = categoryOrder.map(id =>
      categoryData.categories.find(cat => cat.title === id)
    ).filter(Boolean)

    categories.value = orderedCategories
    articles.value = articleData.articles || []

    loading.value = false
  } catch (err) {
    console.error('加载分类数据失败:', err)
    loading.value = false
    error.value = true
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadCategoryData()
})
</script>

<style scoped>

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.75rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-error);
  color: var(--vp-c-text-1);
}

.error-icon {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.error-text {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.retry-button {
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: var(--vp-c-brand-dark);
}

/* 分类卡片网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 120px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-icon {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.3rem 0;
  line-height: 1.2;
}

.category-description {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.6rem 0;
  line-height: 1.3;
}

.category-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
}

.article-count {
  font-weight: 500;
}

.latest-date {
  color: var(--vp-c-brand);
  font-weight: 500;
}

.card-arrow {
  font-size: 1.2rem;
  color: var(--vp-c-brand);
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.category-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .category-grid {
    gap: 10px;
  }

  .category-card {
    padding: 14px;
    min-height: 130px;
  }

  .category-icon {
    font-size: 1.6rem;
  }

  .category-title {
    font-size: 0.9rem;
  }

  .category-description {
    font-size: 0.7rem;
  }
}

@media (max-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .category-card {
    min-height: 140px;
  }
}

@media (max-width: 768px) {
  .category-cards-section {
    padding: 0 16px;
    margin: 1.5rem 0;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .category-card {
    padding: 16px;
    min-height: 120px;
  }

  .category-icon {
    font-size: 1.4rem;
  }

  .category-title {
    font-size: 0.85rem;
  }

  .category-description {
    font-size: 0.7rem;
    margin: 0 0 0.4rem 0;
  }

  .card-arrow {
    display: none;
  }

  .category-meta {
    align-items: center;
    flex-direction: row;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .category-cards-section {
    padding: 0 12px;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .category-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    min-height: 110px;
  }

  .card-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-title {
    font-size: 0.9rem;
  }

  .category-description {
    font-size: 0.75rem;
  }
}
</style>