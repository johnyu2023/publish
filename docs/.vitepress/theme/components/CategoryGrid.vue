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
        <div class="category-header">
          <h3>{{ getEmojiByCategory(key) }} {{ category.name }}</h3>
          <p>{{ category.description }}</p>
          <div class="divider"></div>
        </div>
        
        <div class="latest-article" v-if="category.latestArticle">
          <div class="latest-header">
            <h4>最新文章</h4>
            <small v-if="category.latestArticle.date" class="date">{{ formatDate(category.latestArticle.date) }}</small>
          </div>
          <p class="article-title">{{ category.latestArticle.title }}</p>
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

const emojiMap = ref({});

const getEmojiByCategory = (category) => {
  return emojiMap.value[category] || '📄'
}

onMounted(async () => {
  try {
    // 加载分类配置
    const configResponse = await fetch(import.meta.env.BASE_URL + 'data/categories.json');
    if (configResponse.ok) {
      const config = await configResponse.json();
      
      // 提取 emoji 映射
      Object.entries(config.categories).forEach(([key, value]) => {
        emojiMap.value[key] = value.icon;
      });
    }

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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}


</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.625rem;
  margin: 2rem auto;
  max-width: 1400px;
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
  display: flex;
  flex-direction: column;
  height: 260px; /* 固定高度 */
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-color: #3eaf7c;
}

.category-header {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-bottom: 0;
  height: 70px; /* 固定高度 */
  justify-content: flex-start; /* 从顶部开始排列 */
}

.category-header h3 {
  margin: 0 0 0.1rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-align: left;
  flex: 0 0 auto;
}

.category-header p {
  color: #666;
  line-height: 1.25;
  margin: 0 0 0.1rem 0;
  text-align: left;
  font-size: 0.9em;
  flex: 0 0 auto;
  min-height: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.divider {
  background: linear-gradient(to right, #999 50%, transparent 50%);
  background-size: 6px 2px;
  background-repeat: repeat-x;
  margin: 0.1rem 0;
  width: 100%;
  height: 2px;
  flex: 0 0 auto;
  align-self: stretch;
}

.latest-article {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-bottom: 0;
  height: 110px; /* 固定高度 */
  overflow: hidden;
}

.latest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.25rem;
}

.latest-article h4 {
  font-size: 0.9rem;
  color: #888;
  margin: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  line-height: 1.2;
}

.article-title {
  margin: 0;
  color: #666;
  line-height: 1.3;
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.date {
  color: #999;
  font-size: 0.8em;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 0 auto;
  min-width: 60px;
  margin-left: 0.5rem;
}

.count-info {
  font-size: 0.8em;
  color: #888;
  text-align: right;
  padding: 0.5rem;
  height: 30px; /* 固定高度 */
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2em;
}
</style>