<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const title = ref('')
let mainTitle = null
let scrollHandler = null

onMounted(() => {
  // 等待DOM完全加载
  setTimeout(() => {
    // 获取主标题元素
    mainTitle = document.querySelector('.VPDoc h1')
    if (mainTitle) {
      title.value = mainTitle.textContent
      
      // 创建滚动事件处理函数
      scrollHandler = () => {
        if (mainTitle) {
          const titleRect = mainTitle.getBoundingClientRect()
          isVisible.value = titleRect.bottom < 60
        }
      }
      
      // 添加滚动事件监听
      window.addEventListener('scroll', scrollHandler)
      
      // 初始检查
      scrollHandler()
    }
  }, 1000)
})

onUnmounted(() => {
  // 移除滚动事件监听
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})
</script>

<template>
  <div class="fixed-article-title" :class="{ visible: isVisible }">
    {{ title }}
  </div>
</template>

<style>
.fixed-article-title {
  position: fixed;
  top: 60px;
  left: 272px;
  right: 0;
  height: 40px;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: opacity 0.3s;
  opacity: 0;
  pointer-events: none;
}

.fixed-article-title.visible {
  opacity: 1;
}

@media (max-width: 960px) {
  .fixed-article-title {
    left: 0;
  }
}
</style>