<template>
  <div class="article-item" @click="handleClick">
    <div class="article-content">
      <span class="category">{{ getCategoryName(article.category) }}</span>
      <span class="date">{{ formatDate(article.date) }}</span>
      <h3 class="title">{{ article.title }}</h3>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  categoryConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.article)
}

const getCategoryName = (category) => {
  if (!category || !props.categoryConfig) {
    return category || '';
  }
  const config = props.categoryConfig[category];
  if (config) {
    return `${config.icon} ${config.name}`;
  }
  return category;
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}
</script>

<style scoped>
.article-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3eaf7c;
}

.article-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  flex-wrap: wrap; /* 允许换行，防止溢出 */
}

.article-content .category {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0; /* 防止收缩 */
}

.article-content .date {
  color: #999;
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0; /* 防止收缩 */
}

.article-content .title {
  margin: 0;
  color: #666;
  line-height: 1.3;
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 允许收缩 */
  white-space: normal;
}
</style>