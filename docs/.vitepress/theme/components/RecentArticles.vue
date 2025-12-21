<template>
  <div class="recent-articles">
    <div class="header-section">
      <div class="title-with-icon">
        <span class="icon">📰</span>
        <h2 class="title">最新文章</h2>
      </div>
      <div class="divider"></div>
    </div>
    <div class="articles-list">
      <ArticleItem
        v-for="(article, index) in recentArticles" 
        :key="index"
        :article="article"
        :index="index"
        :category-config="categoryConfig"
        @click="goToArticle(article.url)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress/client'
import ArticleItem from './ArticleItem.vue'

const router = useRouter()
const recentArticles = ref([])
const categoryConfig = ref({})

const goToArticle = (url) => {
  // 使用 BASE_URL 确保在子路径部署时正确跳转
  const fullPath = import.meta.env.BASE_URL + url.replace(/^\//, '')
  if (window && window.location) {
    window.location.href = fullPath
  } else {
    router.go(fullPath)
  }
}

onMounted(async () => {
  try {
    // 加载分类配置
    const configResponse = await fetch(import.meta.env.BASE_URL + 'data/categories.json');
    if (configResponse.ok) {
      const config = await configResponse.json();
      categoryConfig.value = config.categories || {};
    }

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
  max-width: 1400px;
  margin: 3rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.title-with-icon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  margin-bottom: 0.5rem;
}

.icon {
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
}

.title {
  text-align: left;
  margin: 0;
  padding: 0;
  color: #2c3e50;
  font-size: 1rem; /* 变小 */
  font-weight: bold;
  line-height: 1.4;
}

.divider {
  background: linear-gradient(to right, #999 50%, transparent 50%);
  background-size: 6px 2px;
  background-repeat: repeat-x;
  width: 100%;
  height: 2px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>