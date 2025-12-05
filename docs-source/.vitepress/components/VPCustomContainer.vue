<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import ImageModal from './ImageModal.vue'

const { frontmatter } = useData()

// 格式化日期
const formattedDate = computed(() => {
  if (!frontmatter.value.date) return ''
  
  const date = new Date(frontmatter.value.date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}年${month}月${day}日`
})
</script>

<template>
  <div class="blog-post-container">
    <header class="blog-post-header">
      <h1 v-if="frontmatter.title" class="post-title">{{ frontmatter.title }}</h1>
      <div class="post-meta">
        <div v-if="frontmatter.date" class="post-date">
          <span class="date-icon">📅</span>
          <time :datetime="frontmatter.date">{{ formattedDate }}</time>
        </div>
        <p v-if="frontmatter.description" class="post-description">{{ frontmatter.description }}</p>
      </div>
    </header>
    <div class="post-content">
      <slot />
    </div>
    <!-- 图片弹窗组件 -->
    <ImageModal />
  </div>
</template>

<style scoped>
.blog-post-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 0;
}

.blog-post-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.post-meta {
  color: var(--vp-c-text-2);
}

.post-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.date-icon {
  display: inline-flex;
  align-items: center;
}

.post-description {
  margin: 0.5rem 0 0 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.post-content {
  line-height: 1.7;
}
</style>