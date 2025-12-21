<template>
  <div class="category-grid">
    <template 
      v-for="(category, key) in categories" 
      :key="key"
    >
      <div 
        v-if="category && category.count > 0"
        class="category-card" 
        @click="goTo(category.latestArticle ? category.latestArticle.url : `/${key}/`)"
      >
        <h3>{{ getEmojiByCategory(key) }} {{ category.name }}</h3>
        <p>{{ category.description }}</p>
        <div class="article-preview" v-if="category.latestArticle">
          <h4>最新文章</h4>
          <ul>
            <li>{{ category.latestArticle.title }}</li>
          </ul>
          <small v-if="category.latestArticle.date" class="date">{{ formatDate(category.latestArticle.date) }}</small>
        </div>
        <div class="count-info">
          共 {{ category.count }} 篇文章
        </div>
      </div>
    </template>
    <div v-if="Object.keys(categories).length === 0" class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress/client'

const router = useRouter()
const categories = ref({})

const goTo = (path) => {
  // 使用 BASE_URL 确保在子路径部署时正确跳转
  const fullPath = import.meta.env.BASE_URL + path.replace(/^\//, '')
  if (window && window.location) {
    window.location.href = fullPath
  } else {
    router.go(fullPath)
  }
}

const getEmojiByCategory = (category) => {
  const emojiMap = {
    'ai': '🤖',
    'foundation': '📘',
    'fullstack': '💻',
    'think': '💭',
    'other': '📋'
  }
  return emojiMap[category] || '📄'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  try {
    // 使用 BASE_URL + 绝对路径加载数据文件，public 目录内容会映射到网站根路径
    const response = await fetch(import.meta.env.BASE_URL + 'data/blog-data.json')
    if (response.ok) {
      const data = await response.json()
      categories.value = data.categories
    } else {
      console.error('Failed to load blog data:', response.statusText)
    }
  } catch (error) {
    console.error('Error loading blog data:', error)
  }
})
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 300px));
  gap: 1.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 1rem;
  justify-content: center; /* 使整个网格居中 */
}

.category-card {
  background: #fff;
  border: 1px solid #eaecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-color: #3eaf7c;
}

.category-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-card p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.article-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #eaecef;
}

.article-preview h4 {
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 0.5rem 0;
}

.article-preview ul {
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: disc;
  color: #666;
}

.count-info {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #888;
  text-align: right;
}

.date {
  color: #999;
  font-size: 0.8em;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2em;
}

@media (max-width: 1100px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
}
</style>