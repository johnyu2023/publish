<script setup>
import { ref, onMounted } from 'vue'

/**
 * 分类最新文章链接组件
 * 用于动态显示指定分类的最新文章链接
 */
const props = defineProps({
  /**
   * 分类名称 - 必需参数
   * 指定要获取最新文章的分类名
   * 当前系统支持的分类包括：'ai', 'foundation', 'fullstack', 'shanghai', 'system', 'think'
   */
  category: {
    type: String,
    required: true
  },
  /**
   * 显示标题 - 可选参数
   * 指定链接显示的文本内容
   * 如果不提供，则使用最新文章的实际标题
   */
  title: {
    type: String,
    required: false,
    default: null
  }
})

const latestArticle = ref(null)
const loading = ref(true)
const error = ref(false)

// 确保URL包含正确的base路径
function ensureBaseUrl(url) {
  if (url && url.startsWith('/') && !url.startsWith('/publish/')) {
    return '/publish' + url
  }
  return url
}

onMounted(async () => {
  try {
    // 直接获取 all-categories.json 数据
    const response = await fetch('/publish/data/all-categories.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const categoriesData = await response.json()
    
    if (categoriesData && categoriesData[props.category] && categoriesData[props.category].latestArticle) {
      const rawArticle = categoriesData[props.category].latestArticle
      // 确保URL包含正确的base路径
      latestArticle.value = {
        ...rawArticle,
        url: ensureBaseUrl(rawArticle.url)
      }
    }
  } catch (err) {
    console.error('Error fetching latest article:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="category-latest-link">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败</div>
    <div v-else-if="latestArticle">
      <a :href="latestArticle.url">{{ title || latestArticle.title }}</a>
    </div>
    <div v-else class="no-article">暂无文章</div>
  </div>
</template>

<style scoped>
.category-latest-link {
  margin: 10px 0;
}
.loading, .error, .no-article {
  color: #666;
  font-style: italic;
}
</style>