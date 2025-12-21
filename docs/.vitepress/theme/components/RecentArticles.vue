<template>
  <div class="recent-articles">
    <h2>📰 最新文章</h2>
    <div class="articles-list">
      <div 
        v-for="(article, index) in recentArticles" 
        :key="index"
        class="article-item"
        @click="goToArticle(article.url)"
      >
        <div class="article-index">{{ index + 1 }}</div>
        <div class="article-content">
          <h3>{{ article.title }}</h3>
          <div class="article-meta">
            <span class="category">{{ getCategoryName(article.category) }}</span>
            <span class="date">{{ formatDate(article.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress/client'

const router = useRouter()
const recentArticles = ref([])

const goToArticle = (url) => {
  // 使用 BASE_URL 确保在子路径部署时正确跳转
  const fullPath = import.meta.env.BASE_URL + url.replace(/^\//, '')
  if (window && window.location) {
    window.location.href = fullPath
  } else {
    router.go(fullPath)
  }
}

const getCategoryName = (category) => {
  const categoryNames = {
    'ai': '🤖 人工智能',
    'foundation': '📘 基础知识',
    'fullstack': '💻 全栈开发',
    'think': '💭 观察思考',
    'other': '📋 技术文档'
  }
  return categoryNames[category] || category
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  try {
    // 使用 BASE_URL + 相对路径加载数据文件
    const response = await fetch(import.meta.env.BASE_URL + 'data/blog-data.json')
    if (response.ok) {
      const data = await response.json()
      recentArticles.value = data.latestArticles || []
    } else {
      console.error('Failed to load recent articles:', response.statusText)
    }
  } catch (error) {
    console.error('Error loading recent articles:', error)
  }
})
</script>

<style scoped>
.recent-articles {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1rem;
}

.recent-articles h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border: 1px solid #eaecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3eaf7c;
}

.article-index {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3eaf7c;
  min-width: 3rem;
  text-align: center;
  margin-right: 1rem;
}

.article-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.category {
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.date {
  color: #888;
}
</style>