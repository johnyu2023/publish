<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.date" class="post-date">
    <span class="date-icon">📅</span>
    <time :datetime="frontmatter.date">{{ formatDate(frontmatter.date) }}</time>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(date) {
      if (!date) return ''
      
      // 将日期格式化为 YYYY年MM月DD日
      const dateObj = new Date(date)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      
      return `${year}年${month}月${day}日`
    }
  }
}
</script>

<style scoped>
.post-date {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.date-icon {
  margin-right: 0.5rem;
}
</style>