<script setup>
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const { Layout } = DefaultTheme
const { page } = useData()
const router = useRouter()

// 固定标题栏相关逻辑
const isVisible = ref(false)
const title = ref('')
let mainTitle = null
let scrollHandler = null

// 更新标题的函数
const updateTitle = async () => {
  await nextTick()
  // 等待DOM更新
  setTimeout(() => {
    mainTitle = document.querySelector('.VPDoc h1')
    if (mainTitle) {
      title.value = mainTitle.textContent
      
      // 重新设置滚动事件处理函数
      if (scrollHandler) {
        scrollHandler = () => {
          if (mainTitle) {
            const titleRect = mainTitle.getBoundingClientRect()
            isVisible.value = titleRect.bottom < 60
          }
        }
        
        // 初始检查
        scrollHandler()
      }
    }
  }, 500)
}

onMounted(() => {
  // 创建滚动事件处理函数
  scrollHandler = () => {
    if (mainTitle) {
      const titleRect = mainTitle.getBoundingClientRect()
      isVisible.value = titleRect.bottom < 60
    }
  }
  
  // 添加滚动事件监听
  window.addEventListener('scroll', scrollHandler)
  
  // 初始更新标题
  updateTitle()
})

// 监听路由变化，更新标题
watch(() => page.value.filePath, () => {
  updateTitle()
}, { immediate: true })

onUnmounted(() => {
  // 移除滚动事件监听
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <div class="fixed-article-title" :class="{ visible: isVisible }">
        {{ title }}
      </div>
    </template>
  </Layout>
</template>

<style>
.fixed-article-title {
  position: fixed;
  top: 0;
  left: 272px;
  width: calc((100vw - 272px - 280px) * 0.8);
  height: 64px;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: var(--vp-c-text-1);
  transition: opacity 0.3s;
  opacity: 0;
  pointer-events: none;
  box-sizing: border-box;
}

.fixed-article-title.visible {
  opacity: 1;
}

@media (max-width: 960px) {
  .fixed-article-title {
    left: 0;
    width: calc((100vw - 48px) * 0.8);
  }
}
</style>
