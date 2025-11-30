<template>
  <div class="tabbed-section">
    <!-- 标签页头部 -->
    <div class="tab-header">
      <h2 class="section-title">
        <span
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="setActiveTab(index)"
        >
          {{ tab.title }}
        </span>
      </h2>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <!-- 最近文章标签页 -->
      <div v-if="activeTab === 0" class="tab-pane">
        <div class="recent-articles">
          <!-- 最近更新标题 -->
          <div class="recent-title">
            <span class="icon">📖</span> 最近更新
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-text">数据读取中...</div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="error-state">
            <div class="error-text">数据获取失败...</div>
            <button @click="loadArticlesData" class="retry-button">重试</button>
          </div>

          <!-- 数据加载成功 -->
          <div v-else class="article-list">
            <ul>
              <li v-for="article in recentArticles" :key="article.url">
                <span class="article-bullet">•</span>
                <a :href="withBase(article.url)" class="article-link">{{ article.title }} <span class="article-date">- {{ formatDate(article.date) }}</span></a>
              </li>
            </ul>
          </div>

          <!-- 查看全部文章链接 -->
          <div class="view-all-articles">
            <a :href="withBase('/list')" class="view-all-link">
              <span class="view-all-icon">👉</span>
              查看全部文章
            </a>
          </div>

          <!-- RSS订阅链接 -->
          <div class="rss-subscribe">
            <span class="rss-icon">📡</span>
            <a :href="withBase('rss.xml')" class="rss-link">订阅 RSS Feed</a>
            <span class="rss-text">获取最新文章更新</span>
          </div>
        </div>
      </div>

      <!-- 历史事件标签页 -->
      <div v-else-if="activeTab === 1" class="tab-pane">
        <div class="history-preview">
          <div class="history-title">
            <span class="icon">📅</span> 历史事件
          </div>

          <!-- 加载状态 -->
          <div v-if="historyLoading" class="loading-state">
            <div class="loading-text">数据读取中...</div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="historyError" class="error-state">
            <div class="error-text">历史数据获取失败...</div>
            <button @click="loadHistoryData" class="retry-button">重试</button>
          </div>

          <!-- 数据加载成功 -->
          <div v-else class="history-list">
            <ul>
              <li v-for="event in recentHistoryEvents" :key="event.date">
                <span class="history-date">{{ formatDate(event.date) }}</span>
                <a :href="withBase('/history')" class="history-link">{{ event.title }}</a>
              </li>
            </ul>
          </div>

          <!-- 查看更多链接 -->
          <div class="view-more">
            <a :href="withBase('/history')" class="view-more-link">
              <span class="view-more-icon">👉</span>
              查看完整历史时间轴
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Naive UI 模态框 -->
    <NModal
      v-model:show="showModal"
      :style="{ width: '80%', maxWidth: '1200px', height: '80%' }"
      preset="card"
      title="全部文章"
      size="huge"
      :bordered="false"
      :auto-focus="false"
      :trap-focus="false"
      @after-leave="restoreFocus"
    >
      <ShowAllTitle :inModal="true" />
    </NModal>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { ref, onMounted, onUnmounted } from 'vue'
import ShowAllTitle from './ShowAllTitle.vue'

// 标签页配置
const tabs = [
  { title: '最近文章' },
  { title: '历史事件' }
]

// 当前激活的标签页
const activeTab = ref(0)

// 设置当前激活的标签页
function setActiveTab(index) {
  activeTab.value = index
}

// 控制模态框显示状态
const showModal = ref(false)

// 打开文章列表模态框
function openArticlesModal() {
  // 保存触发元素的引用
  if (typeof window !== 'undefined') {
    window.lastTriggerElement = document.activeElement
  }
  showModal.value = true
}

// 恢复焦点到触发元素
function restoreFocus() {
  if (typeof window !== 'undefined' && window.lastTriggerElement) {
    // 确保元素仍然存在于 DOM 中
    if (document.contains(window.lastTriggerElement)) {
      window.lastTriggerElement.focus()
    }
    window.lastTriggerElement = null
  }
}

// 文章数据相关
const loading = ref(true)
const error = ref(false)
const recentArticles = ref([])

// 历史数据相关
const historyLoading = ref(true)
const historyError = ref(false)
const recentHistoryEvents = ref([])

// 格式化日期为 "YYYY-MM-DD" 格式
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

    // 对所有文章按日期降序排序
    const sortedArticles = (data.articles || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    // 只取前6篇文章
    recentArticles.value = sortedArticles.slice(0, 6)

    loading.value = false
  } catch (err) {
    console.error('加载文章数据失败:', err)
    loading.value = false
    error.value = true
  }
}

// 加载历史数据
async function loadHistoryData() {
  try {
    historyLoading.value = true
    historyError.value = false

    // 使用相对路径加载历史数据文件，添加时间戳避免缓存
    const response = await fetch(withBase(`/data/history.json?t=${Date.now()}`))

    if (!response.ok) {
      throw new Error('无法加载历史数据文件')
    }

    const data = await response.json()

    // 对历史事件按日期降序排序
    const sortedHistory = (data.history || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    // 只取前5个历史事件
    recentHistoryEvents.value = sortedHistory.slice(0, 5)

    historyLoading.value = false
  } catch (err) {
    console.error('加载历史数据失败:', err)
    historyLoading.value = false
    historyError.value = true
  }
}

// 处理模态框关闭事件
const handleCloseModal = () => {
  showModal.value = false
  restoreFocus()
}

// 页面加载时获取数据并添加事件监听器
onMounted(() => {
  loadArticlesData()
  loadHistoryData()
  window.addEventListener('close-modal', handleCloseModal)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('close-modal', handleCloseModal)
})
</script>

<style scoped>
/* 整个标签页区域 */
.tabbed-section {
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 标签页头部 */
.tab-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: baseline;
}

/* 标签页项目 */
.tab-item {
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
  position: relative;
  font-weight: normal;
}

.tab-item:hover {
  color: var(--vp-c-text-1);
}

.tab-item.active {
  color: var(--vp-c-brand);
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--vp-c-brand);
  border-radius: 1px;
}

/* 标签页内容区域 */
.tab-content {
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.tab-pane {
  min-height: 200px;
}

/* 最近文章区域样式 */
.recent-articles, .history-preview {
  width: 100%;
}

.recent-title, .history-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.1rem;
}

/* 文章和历史列表 */
.article-list ul, .history-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-list li, .history-list li {
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: flex;
  align-items: baseline;
  font-size: 0.9rem;
}

.article-bullet {
  color: var(--vp-c-brand);
  margin-right: 0.5rem;
  font-weight: bold;
}

.article-link, .history-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
  flex: 1;
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
}

.article-link:hover, .history-link:hover {
  color: var(--vp-c-brand);
}

.history-date {
  color: var(--vp-c-brand);
  font-weight: 500;
  margin-right: 0.5rem;
  white-space: nowrap;
  min-width: 80px;
}

.article-date {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  margin-left: 0.25rem;
  white-space: nowrap;
  font-weight: normal;
}

/* 查看全部文章和RSS订阅及查看更多区域 */
.view-all-articles, .rss-subscribe, .view-more {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  margin: 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.rss-icon, .view-more-icon {
  font-size: 0.9rem;
}

.rss-link, .view-more-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  margin: 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rss-link:hover, .view-more-link:hover {
  text-decoration: underline;
}

/* 加载和错误状态 */
.loading-state, .error-state {
  padding: 0.5rem 0;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .tab-item {
    font-size: 1.2rem;
  }

  .tab-item.active::after {
    bottom: -2px;
  }

  .article-list li, .history-list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-date {
    margin-bottom: 0.25rem;
    min-width: auto;
  }
}
</style>