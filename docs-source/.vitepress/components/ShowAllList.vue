<template>
  <div class="all-list-container">
    <div class="main-layout">
      <!-- Tab 切换（左侧） -->
      <div class="tabs">
        <button 
          :class="['tab-button', { active: activeTab === 'category' }]" 
          @click="activeTab = 'category'"
        >
          按分类显示
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'time' }]" 
          @click="activeTab = 'time'"
        >
          按时间显示
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 按分类显示 -->
        <div v-if="activeTab === 'category'" class="tab-content">
          <!-- 分类 Tabbar -->
          <div class="category-tabs">
            <button
              v-for="directory in directories"
              :key="directory"
              :class="['category-tab', { active: activeDirectory === directory }]"
              @click="activeDirectory = directory"
            >
              {{ getDirectoryName(directory) }}
            </button>
          </div>

          <!-- 分类文章列表 -->
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">加载失败: {{ error }}</div>
          <div v-else class="category-content">
            <div class="directory-group">
              <ul class="article-list" :style="articleListStyle">
                <li v-for="article in filteredArticles" :key="article.url" class="article-item">
                  <a :href="withBase(article.url)" class="article-link" @click="handleArticleClick(article)">{{ article.title }}</a>
                  <span class="article-date">{{ formatDate(article.date) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 按时间显示 -->
        <div v-else-if="activeTab === 'time'" class="tab-content">
          <TimeArticleList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'
import { useData, withBase } from 'vitepress'
import TimeArticleList from '/.vitepress/components/TimeArticleList.vue'

// 定义props，接收外部传入的高度值
const props = defineProps({
  height: {
    type: String,
    default: '400px' // 默认高度，保持原有样式
  }
})

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('category') // 默认显示按分类
const activeDirectory = ref('') // 当前选中的分类

// 获取当前页面数据
const { page } = useData()

// 所有目录
const directories = computed(() => {
  const dirs = [...new Set(articles.value.map(article => article.directory))]
  return dirs
})

// 按目录分组文章
const groupedArticles = computed(() => {
  const groups = {}
  articles.value.forEach(article => {
    if (!groups[article.directory]) {
      groups[article.directory] = []
    }
    groups[article.directory].push(article)
  })
  
  // 对每个目录内的文章按日期降序排列
  Object.keys(groups).forEach(directory => {
    groups[directory].sort((a, b) => new Date(b.date) - new Date(a.date))
  })
  
  return groups
})

// 过滤后的文章（当前选中分类的文章）
const filteredArticles = computed(() => {
  if (!activeDirectory.value) return []
  return groupedArticles.value[activeDirectory.value] || []
})

// 获取目录显示名称
const getDirectoryName = (directory) => {
  const directoryNames = {
    'ai': '学习笔记',
    'web': '前端开发',
    'think': '观察思考',
    'posts': '技术文章'
  }
  return directoryNames[directory] || directory
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 处理文章点击
const handleArticleClick = (article) => {
  // 触发自定义事件，通知父组件关闭模态框
  window.dispatchEvent(new CustomEvent('close-modal'))
}

// 加载文章数据
const loadArticles = async () => {
  try {
    const response = await fetch(withBase('/data/list.json'))
    const data = await response.json()
    articles.value = data.articles || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 设置默认选中的分类
const setDefaultDirectory = () => {
  // 如果有当前页面信息，尝试获取当前页面的分类
  if (page.value && page.value.relativePath) {
    const pathParts = page.value.relativePath.split('/')
    if (pathParts.length > 0) {
      const currentPageDirectory = pathParts[0]
      if (directories.value.includes(currentPageDirectory)) {
        activeDirectory.value = currentPageDirectory
        return
      }
    }
  }
  
  // 默认选中第一个分类
  if (directories.value.length > 0) {
    activeDirectory.value = directories.value[0]
  }
}

onMounted(() => {
  loadArticles().then(() => {
    // 等待数据加载完成后设置默认分类
    setTimeout(() => {
      setDefaultDirectory()
    }, 0)
  })
})

// 计算文章列表的高度样式
const articleListStyle = computed(() => ({
  maxHeight: props.height,
  height: props.height
}))
</script>

<style scoped>
.all-list-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.main-layout {
  display: flex;
  gap: 20px;
}

.tabs {
  display: flex;
  flex-direction: column;
  width: 200px;
  border-right: 1px solid #eee;
  padding-right: 20px;
}

.tab-button {
  padding: 15px 25px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  border-right: 3px solid transparent;
  text-align: left;
  margin-bottom: 10px;
}

.tab-button.active {
  color: var(--vp-c-brand);
  border-right: 3px solid var(--vp-c-brand);
}

.content-area {
  flex: 1;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.category-tab {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.category-tab.active {
  background: var(--vp-c-brand);
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.directory-group {
  margin-bottom: 30px;
}

.article-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
  /* 移除固定的max-height，由组件props动态设置 */
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
  color: #999;
  font-size: 14px;
  margin-left: 10px;
  white-space: nowrap;
}

/* 滚动条样式 */
.article-list::-webkit-scrollbar {
  width: 6px;
}

.article-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.article-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.article-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.tab-content {
  min-height: 300px;
}
</style>