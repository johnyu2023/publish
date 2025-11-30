<template>
  <div class="history-timeline">
    <!-- 页面标题 -->
    <h1>网站历史事件</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载历史数据中...</div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <div class="error-text">历史数据加载失败</div>
      <button @click="loadHistoryData" class="retry-button">重试</button>
    </div>

    <!-- 空数据状态 -->
    <div v-else-if="historyEvents.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <div class="empty-text">暂无历史事件记录</div>
    </div>

    <!-- 时间轴内容 -->
    <div v-else class="timeline-container">
      <div class="timeline">
        <div
          v-for="(event, index) in historyEvents"
          :key="event.date + index"
          class="timeline-item"
          :class="{ 'timeline-item-left': index % 2 === 0, 'timeline-item-right': index % 2 === 1 }"
        >
          <!-- 时间节点 -->
          <div class="timeline-dot">
            <div class="timeline-dot-inner"></div>
          </div>

          <!-- 事件卡片 -->
          <div class="timeline-card" @mouseenter="showTooltip(event)" @mouseleave="hideTooltip">
            <div class="event-date">{{ formatDate(event.date) }}</div>
            <div class="event-title">{{ event.title }}</div>

            <!-- Tooltip -->
            <div v-if="hoveredEvent === event" class="tooltip">
              <div class="tooltip-content">
                <div class="tooltip-date">{{ formatDate(event.date) }}</div>
                <div class="tooltip-title">{{ event.title }}</div>
                <div class="tooltip-desc">{{ event.desc }}</div>
              </div>
              <div class="tooltip-arrow"></div>
            </div>
          </div>

          <!-- 连接线 -->
          <div v-if="index < historyEvents.length - 1" class="timeline-line"></div>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top">
      <span class="back-to-top-icon">⬆️</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

// 数据状态
const loading = ref(true)
const error = ref(false)
const historyEvents = ref([])
const hoveredEvent = ref(null)

// 返回顶部按钮状态
const showBackToTop = ref(false)

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 显示工具提示
function showTooltip(event) {
  hoveredEvent.value = event
}

// 隐藏工具提示
function hideTooltip() {
  hoveredEvent.value = null
}

// 加载历史数据
async function loadHistoryData() {
  try {
    loading.value = true
    error.value = false

    // 使用绝对路径加载历史数据，添加时间戳避免缓存
    // 构建绝对路径确保正确请求资源
    const base = window?.__VP_STATIC_BASE__ || window?.__vitepress?.siteData?.base || '/';
    // 确保路径始终是绝对路径，以解决相对路径解析问题
    const absolutePath = base.endsWith('/') ? `${base}data/history.json` : `${base}/data/history.json`;
    const response = await fetch(`${withBase('/data/history.json')}?t=${Date.now()}`)

    if (!response.ok) {
      throw new Error('无法加载历史数据文件')
    }

    const data = await response.json()

    // 对历史事件按日期降序排序（最新的在前面）
    const sortedEvents = (data.history || []).sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    historyEvents.value = sortedEvents
    loading.value = false
  } catch (err) {
    console.error('加载历史数据失败:', err)
    loading.value = false
    error.value = true
  }
}

// 滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 处理滚动事件
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

// 组件挂载时加载数据并添加事件监听器
onMounted(() => {
  loadHistoryData()
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 整体容器 */
.history-timeline {
  position: relative;
  width: 100%;
  min-height: 400px;
  padding: 1rem 0;
}

/* 页面标题 */
h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--vp-c-text-1);
  font-size: 2rem;
  font-weight: 600;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  text-align: center;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.retry-button {
  padding: 0.5rem 1.5rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: var(--vp-c-brand-dark);
}

/* 空数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
  text-align: center;
}

/* 时间轴容器 */
.timeline-container {
  width: 100%;
  padding: 0 1rem;
}

/* 时间轴主体 */
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

/* 中心线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-divider);
  transform: translateX(-50%);
}

/* 时间轴项目 */
.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  min-height: 100px;
}

/* 时间节点圆点 */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 16px;
  height: 16px;
  background: var(--vp-c-brand);
  border: 3px solid var(--vp-c-bg);
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.2);
  box-shadow: 0 0 0 6px rgba(var(--vp-c-brand-rgb), 0.1);
}

.timeline-dot-inner {
  width: 100%;
  height: 100%;
  background: var(--vp-c-brand);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--vp-c-brand-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--vp-c-brand-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--vp-c-brand-rgb), 0);
  }
}

/* 事件卡片 */
.timeline-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  width: calc(50% - 3rem);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-item-left .timeline-card {
  margin-left: 0;
  margin-right: auto;
}

.timeline-item-right .timeline-card {
  margin-left: auto;
  margin-right: 0;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

/* 事件日期 */
.event-date {
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* 事件标题 */
.event-title {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  line-height: 1.4;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  max-width: 300px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.tooltip-content {
  position: relative;
  z-index: 1;
}

.tooltip-date {
  font-size: 0.85rem;
  color: var(--vp-c-brand);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tooltip-title {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.tooltip-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--vp-c-bg-alt);
}

/* 连接线 */
.timeline-line {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 2px;
  height: calc(100% + 3rem);
  background: var(--vp-c-divider);
  transform: translateX(-50%);
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 移动端隐藏中心线，改为左侧垂直线 */
  .timeline::before {
    left: 20px;
  }

  .timeline-item {
    margin-left: 40px;
    margin-bottom: 2rem;
  }

  .timeline-dot {
    left: 20px;
  }

  .timeline-card {
    width: calc(100% - 2rem);
    margin: 0 !important;
  }

  .timeline-line {
    left: 20px;
  }

  .timeline-item-left .timeline-card,
  .timeline-item-right .timeline-card {
    margin: 0;
  }

  /* 移动端简化样式 */
  h1 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .timeline-card {
    padding: 1rem;
  }

  .event-title {
    font-size: 1rem;
  }

  /* Tooltip 在移动端显示在顶部 */
  .tooltip {
    position: fixed;
    bottom: auto;
    top: 10px;
    left: 10px;
    right: 10px;
    transform: none;
    max-width: none;
    max-height: 50vh;
    overflow-y: auto;
  }

  .tooltip-arrow {
    display: none;
  }

  /* 返回顶部按钮调整 */
  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .timeline-card {
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-divider);
  }

  .tooltip {
    background: var(--vp-c-bg-alt);
    border-color: var(--vp-c-divider);
  }

  .tooltip-arrow {
    border-top-color: var(--vp-c-bg-alt);
  }
}
</style>