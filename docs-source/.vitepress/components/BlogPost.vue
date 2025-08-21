<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

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
  <div class="blog-post">
    <div class="blog-post-header">
      <div v-if="frontmatter.title" class="post-title">
        <h1>{{ frontmatter.title }}</h1>
      </div>
      <div class="post-meta">
        <div v-if="frontmatter.date" class="post-date">
          <span class="date-icon">📅</span>
          <time :datetime="frontmatter.date">{{ formattedDate }}</time>
        </div>
      </div>
      <div v-if="frontmatter.description" class="post-description">
        {{ frontmatter.description }}
      </div>
    </div>
    <div class="post-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.blog-post {
  max-width: 100%;
  margin: 0 auto;
}
</style>