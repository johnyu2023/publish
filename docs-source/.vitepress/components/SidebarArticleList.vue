<template>
  <div class="sidebar-articles" v-if="currentDirectory">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-text">加载中...</div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-text">加载失败</div>
      <button @click="loadArticlesData" class="retry-button">重试</button>
    </div>
    
    <!-- 数据加载成功 -->
    <div v-else class="article-list">
      <ul>
        <li 
          v-for="article in directoryArticles" 
          :key="article.url"
          :class="{ active: isCurrentArticle(article.url) }"
        >
          <a :href="withBase(article.url)" class="article-link">{{ article.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { withBase, useRoute, useData } from 'vitepress'

const route = useRoute()
const { page } = useData()

// 数据加载状态
const loading = ref(true)
// 数据加载错误状态
const error = ref(false)
// 所有文章
const articles = ref([])
// 当前文章所在目录
const currentDirectory = ref(null)

// 获取当前页面的路径
const currentPath = computed(() => {
  return page.value.relativePath
})

// 判断是否为当前文章
function isCurrentArticle(url) {
  return withBase(url) === route.path
}

// 获取当前文章所在的目录
function extractDirectory(path) {
  const parts = path.split('/')
  if (parts.length > 1) {
    return parts[0]
  }
  return null
}

// 根据当前目录筛选文章
const directoryArticles = computed(() => {
  if (!currentDirectory.value) return []
  
  return articles.value.filter(article => 
    article.directory === currentDirectory.value
  ).sort((a, b) => {
    // 按日期降序排序
    return new Date(b.date) - new Date(a.date)
  })
})

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
    articles.value = data.articles || []
    
    // 设置当前目录
    currentDirectory.value = extractDirectory(currentPath.value)
    
    loading.value = false
  } catch (err) {
    console.error('加载文章数据失败:', err)
    loading.value = false
    error.value = true
  }
}

// 监听路由变化，更新当前目录
watch(currentPath, (newPath) => {
  currentDirectory.value = extractDirectory(newPath)
})

// 页面加载时获取数据
onMounted(() => {
  loadArticlesData()
})
</script>

<style scoped>
.sidebar-articles {
  margin-bottom: 1.5rem;
}

.article-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-list li {
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.article-list li:hover {
  background-color: var(--vp-c-bg-soft);
}

.article-list li.active {
  background-color: var(--vp-c-bg-soft);
  font-weight: bold;
}

.article-list li.active a {
  color: var(--vp-c-brand);
}

.article-link {
  display: block;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
  line-height: 1.4;
}

.article-link:hover {
  color: var(--vp-c-brand);
}

.loading-state, .error-state {
  padding: 0.5rem;
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