<script setup>
import { computed } from 'vue'

const props = defineProps({
  date: {
    type: String,
    required: true
  }
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  
  const date = new Date(props.date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}年${month}月${day}日`
})
</script>

<template>
  <div class="post-date">
    <span class="date-icon">📅</span>
    <time :datetime="date">{{ formattedDate }}</time>
  </div>
</template>

<style scoped>
.post-date {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.date-icon {
  margin-right: 0.25rem;
}
</style>