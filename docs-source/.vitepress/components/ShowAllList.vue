<template>
  <div class="all-list-container" ref="containerRef">
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
              v-for="category in categories"
              :key="category.id"
              :class="['category-tab', { active: activeDirectory === category.title }]"
              @click="activeDirectory = category.title"
            >
              {{ category.directory }}
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useData, withBase } from 'vitepress'
import TimeArticleList from '/.vitepress/components/TimeArticleList.vue'

// 模板引用
const containerRef = ref(null)

// 定义props，接收外部传入的宽度和高度值
const props = defineProps({
  height: {
    type: String,
    default: '400px' // 默认高度，保持原有样式
  },
  width: {
    type: String,
    default: '100%' // 默认宽度，保持原有样式
  }
})

const articles = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('category') // 默认显示按分类
const activeDirectory = ref('') // 当前选中的分类

// 获取当前页面数据
const { page } = useData()

// 存储触发模态框的元素
const triggerElement = ref(null)

// 过滤后的文章（当前选中分类的文章）
const filteredArticles = computed(() => {
  if (!activeDirectory.value) return []
  return articles.value
    .filter(article => article.directory === activeDirectory.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 保存触发元素的引用
const saveTriggerElement = () => {
  triggerElement.value = document.activeElement
}

// 恢复焦点到触发元素
const restoreFocus = () => {
  if (triggerElement.value) {
    triggerElement.value.focus()
  }
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
  // 恢复焦点到触发元素
  restoreFocus()
}

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await fetch(withBase('/data/category.json'))
    const data = await response.json()
    categories.value = data.categories || []
  } catch (err) {
    error.value = err.message
  }
}

// 加载文章数据
const loadArticles = async () => {
  try {
    const response = await fetch(withBase('/data/list.json'))
    const data = await response.json()
    articles.value = data.articles || []
  } catch (err) {
    error.value = err.message
  }
}

// 设置默认选中的分类
const setDefaultDirectory = () => {
  // 如果有当前页面信息，尝试获取当前页面的分类
  if (page.value && page.value.relativePath) {
    const pathParts = page.value.relativePath.split('/')
    if (pathParts.length > 0) {
      const currentPageDirectory = pathParts[0]
      const matchingCategory = categories.value.find(cat => cat.title === currentPageDirectory)
      if (matchingCategory) {
        activeDirectory.value = currentPageDirectory
        return
      }
    }
  }
  
  // 默认选中第一个分类
  if (categories.value.length > 0) {
    activeDirectory.value = categories.value[0].title
  }
}

onMounted(() => {
  // 保存触发元素
  saveTriggerElement()
  
  Promise.all([loadCategories(), loadArticles()]).then(() => {
    // 等待数据加载完成后设置默认分类
    setTimeout(() => {
      setDefaultDirectory()
    }, 0)
  }).finally(() => {
    loading.value = false
    // 确保在下一个 DOM 更新周期后设置焦点
    nextTick(() => {
      if (containerRef.value) {
        // 将焦点设置到容器上，而不是让子元素保留焦点
        containerRef.value.setAttribute('tabindex', '-1')
        containerRef.value.focus()
        // 添加 aria-modal 和 role 属性以改善无障碍访问
        containerRef.value.setAttribute('role', 'dialog')
        containerRef.value.setAttribute('aria-modal', 'true')
        // 添加 aria-label 以提供模态框的描述
        containerRef.value.setAttribute('aria-label', '全部文章列表')
      }
    })
  })
})

onUnmounted(() => {
  // 组件卸载时恢复焦点
  restoreFocus()
})

// 计算文章列表的样式
const articleListStyle = computed(() => ({
  maxHeight: props.height,
  height: props.height,
  width: props.width
}))
</script>

<style scoped>
.all-list-container {
  max-width: 100%; /* 设置为100%以充分利用可用宽度 */
  width: 100%;
  min-width: 800px; /* 确保最小宽度 */
  margin: 0; /* 移除水平外边距 */
  background-color: #ffffff;
  padding: 10px 0; /* 减小垂直内边距，移除水平内边距 */
  border-radius: 0; /* 移除圆角 */
  box-shadow: none; /* 移除阴影 */
}

.main-layout {
  display: flex;
  gap: 10px; /* 进一步减小两列之间的间隙 */
  width: 100%;
}

.tabs {
  display: flex;
  flex-direction: column;
  width: 120px; /* 进一步减小左侧标签栏宽度 */
  border-right: 1px solid #eee;
  padding-right: 10px;
  padding-left: 20px;
}

.tab-button {
  padding: 10px 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-right: 3px solid transparent;
  text-align: left;
  margin-bottom: 5px;
}

.tab-button.active {
  color: var(--vp-c-brand);
  border-right: 3px solid var(--vp-c-brand);
}

.content-area {
  flex: 1;
  padding-right: 20px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.category-tab {
  padding: 5px 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.category-tab.active {
  background: var(--vp-c-brand);
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 15px;
}

.directory-group {
  margin-bottom: 15px;
}

.article-list {
  list-style: none;
  padding: 0;
  overflow-y: auto;
  width: 100%;
}

.article-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
}

.article-link {
  text-decoration: none;
  color: var(--vp-c-brand);
  flex: 1;
  font-size: 14px;
}

.article-link:hover {
  text-decoration: underline;
}

.article-date {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
  white-space: nowrap;
}

/* 滚动条样式 */
.article-list::-webkit-scrollbar {
  width: 4px;
}

.article-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.article-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.article-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.tab-content {
  min-height: 500px; /* 增加最小高度 */
  width: 100%;
}

.category-content {
  width: 100%;
}
</style>