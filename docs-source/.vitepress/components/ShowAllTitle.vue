<template>
  <div class="all-title-container" ref="containerRef">
    <n-layout has-sider style="height: 100%;">
      <!-- Tab 切换（左侧） -->
      <n-layout-sider
        bordered
        width="120"
        style="padding: 10px;"
      >
        <n-space vertical>
          <n-button 
            :type="activeTab === 'category' ? 'primary' : 'default'"
            block
            @click="activeTab = 'category'"
          >
            按分类显示
          </n-button>
          <n-button 
            :type="activeTab === 'time' ? 'primary' : 'default'"
            block
            @click="activeTab = 'time'"
          >
            按时间显示
          </n-button>
        </n-space>
      </n-layout-sider>

      <!-- 内容区域 -->
      <n-layout>
        <n-layout-content style="padding: 10px;">
          <!-- 按分类显示 -->
          <div v-if="activeTab === 'category'">
            <!-- 分类 Tabbar -->
            <n-space style="margin-bottom: 10px;">
              <n-button
                v-for="category in categories"
                :key="category.id"
                :type="activeDirectory === category.title ? 'primary' : 'default'"
                @click="activeDirectory = category.title"
                size="small"
              >
                {{ category.directory }}
              </n-button>
            </n-space>

            <!-- 分类文章列表 -->
            <div v-if="loading" class="loading">
              <n-spin size="large" />
            </div>
            <div v-else-if="error" class="error">
              <n-alert title="加载失败" type="error">
                {{ error }}
              </n-alert>
              <n-button @click="retryLoad" style="margin-top: 10px;">重试</n-button>
            </div>
            <div v-else>
              <n-list style="max-height: 500px; overflow-y: auto;">
                <n-list-item v-for="article in filteredArticles" :key="article.url">
                  <n-thing>
                    <template #header>
                      <a :href="withBase(article.url)" class="article-link" @click="handleArticleClick(article)">
                        {{ article.title }}
                      </a>
                    </template>
                    <template #description>
                      <n-space>
                        <n-tag type="info" size="small">{{ formatDate(article.date) }}</n-tag>
                        <n-tag v-for="tag in parseTags(article.tags)" :key="tag" type="success" size="small">{{ tag }}</n-tag>
                        <n-tag type="warning" size="small">{{ article.directory }}</n-tag>
                      </n-space>
                    </template>
                  </n-thing>
                </n-list-item>
              </n-list>
            </div>
          </div>

          <!-- 按时间显示 -->
          <div v-else-if="activeTab === 'time'">
            <TimeArticleList />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import TimeArticleList from '/.vitepress/components/TimeArticleList.vue'
import naive from 'naive-ui'
const { NSpace, NButton, NLayout, NLayoutSider, NLayoutContent, NSpin, NAlert, NList, NListItem, NThing, NTag } = naive

// 模板引用
const containerRef = ref(null)

// 定义props，接收外部传入的宽度和高度值
const props = defineProps({
  height: {
    type: String,
    default: '400px' // 默认高度，保持原有样式
  },
  width: {
    type: String,
    default: '100%' // 默认宽度，保持原有样式
  }
})

const articles = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('category') // 默认显示按分类
const activeDirectory = ref('') // 当前选中的分类

// 获取当前页面数据
const { page } = useData()

// 存储触发模态框的元素
const triggerElement = ref(null)

// 过滤后的文章（当前选中分类的文章）
const filteredArticles = computed(() => {
  if (!activeDirectory.value) return []
  return articles.value
    .filter(article => article.directory === activeDirectory.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 解析文章标签，处理逗号分隔的情况
const parseTags = (tags) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return []
  
  // 处理标签数组中的每个标签，如果包含逗号则分割
  const parsedTags = []
  tags.forEach(tag => {
    if (tag.includes('，')) {
      // 处理中文逗号
      parsedTags.push(...tag.split('，').map(t => t.trim()).filter(t => t))
    } else if (tag.includes(',')) {
      // 处理英文逗号
      parsedTags.push(...tag.split(',').map(t => t.trim()).filter(t => t))
    } else {
      // 单个标签
      parsedTags.push(tag.trim())
    }
  })
  
  return parsedTags.filter(tag => tag) // 过滤掉空标签
}

// 保存触发元素的引用
const saveTriggerElement = () => {
  triggerElement.value = document.activeElement
}

// 恢复焦点到触发元素
const restoreFocus = () => {
  if (triggerElement.value) {
    triggerElement.value.focus()
  }
}

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 处理文章点击
const handleArticleClick = (article) => {
  // 触发自定义事件，通知父组件关闭模态框
  window.dispatchEvent(new CustomEvent('close-modal'))
  // 恢复焦点到触发元素
  restoreFocus()
}

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await fetch(withBase('/data/category.json'))
    const data = await response.json()
    categories.value = data.categories || []
  } catch (err) {
    error.value = err.message
  }
}

// 加载文章数据
const loadArticles = async () => {
  try {
    const response = await fetch(withBase('/data/list.json'))
    const data = await response.json()
    articles.value = data.articles || []
  } catch (err) {
    error.value = err.message
  }
}

// 重试加载数据
const retryLoad = () => {
  loading.value = true
  error.value = null
  Promise.all([loadCategories(), loadArticles()]).finally(() => {
    loading.value = false
  })
}

// 设置默认选中的分类
const setDefaultDirectory = () => {
  // 如果已经有选中的分类，不更改
  if (activeDirectory.value) return
  
  // 如果有当前页面信息，尝试获取当前页面的分类
  if (page.value && page.value.relativePath) {
    const pathParts = page.value.relativePath.split('/')
    if (pathParts.length > 0) {
      const currentPageDirectory = pathParts[0]
      const matchingCategory = categories.value.find(cat => cat.title === currentPageDirectory)
      if (matchingCategory) {
        activeDirectory.value = currentPageDirectory
        return
      }
    }
  }
  
  // 默认选中第一个分类
  if (categories.value.length > 0) {
    activeDirectory.value = categories.value[0].title
  }
}

onMounted(() => {
  // 保存触发元素
  saveTriggerElement()
  
  Promise.all([loadCategories(), loadArticles()]).then(() => {
    // 等待数据加载完成后设置默认分类
    setTimeout(() => {
      setDefaultDirectory()
    }, 0)
  }).finally(() => {
    loading.value = false
    // 确保在下一个 DOM 更新周期后设置焦点
    nextTick(() => {
      if (containerRef.value) {
        // 将焦点设置到容器上，而不是让子元素保留焦点
        containerRef.value.setAttribute('tabindex', '-1')
        containerRef.value.focus()
        // 添加 aria-modal 和 role 属性以改善无障碍访问
        containerRef.value.setAttribute('role', 'dialog')
        containerRef.value.setAttribute('aria-modal', 'true')
        // 添加 aria-label 以提供模态框的描述
        containerRef.value.setAttribute('aria-label', '全部文章列表')
      }
    })
  })
})

// 监听分类数据变化，确保在分类数据加载完成后设置默认分类
watch(categories, (newCategories) => {
  if (newCategories.length > 0 && !activeDirectory.value) {
    setDefaultDirectory()
  }
})

onUnmounted(() => {
  // 组件卸载时恢复焦点
  restoreFocus()
})
</script>

<style scoped>
.all-title-container {
  width: 100%;
  height: 100%;
}

.article-link {
  text-decoration: none;
  color: var(--vp-c-brand);
}

.article-link:hover {
  text-decoration: underline;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}
</style>