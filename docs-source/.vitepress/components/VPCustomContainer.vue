<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import ImageModal from './ImageModal.vue'
import TreeItem from './TreeItem.vue'

const { frontmatter } = useData()
const route = useRoute()

// 格式化日期
const formattedDate = computed(() => {
  if (!frontmatter.value.date) return ''
  
  const date = new Date(frontmatter.value.date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}年${month}月${day}日`
})

// 章节列表
const headings = ref([])
const showOutline = ref(true)  // 默认展开
const treeHeadings = ref([])

// 构建树形结构的章节数据
const buildTreeHeadings = () => {
  if (!headings.value.length) {
    treeHeadings.value = []
    return
  }
  
  const tree = []
  const stack = []
  
  for (const heading of headings.value) {
    const node = {
      ...heading,
      children: [],
      expanded: true, // 默认展开
      hasChildren: false
    }
    
    // 如果栈为空或者当前层级比栈顶层级更深，直接加入为子节点
    if (!stack.length || heading.level > stack[stack.length - 1].level) {
      if (stack.length) {
        // 添加为栈顶元素的子节点
        stack[stack.length - 1].children.push(node)
        stack[stack.length - 1].hasChildren = true
      } else {
        // 添加到根级
        tree.push(node)
      }
      stack.push(node)
    } else if (heading.level === stack[stack.length - 1].level) {
      // 同级节点，需要弹出栈直到找到父级
      stack.pop()
      if (stack.length) {
        stack[stack.length - 1].children.push(node)
        stack[stack.length - 1].hasChildren = true
      } else {
        tree.push(node)
      }
      stack.push(node)
    } else {
      // 当前节点层级更高（更浅），需要弹出栈直到找到正确的父级
      while (stack.length && stack[stack.length - 1].level >= heading.level) {
        stack.pop()
      }
      
      if (stack.length) {
        stack[stack.length - 1].children.push(node)
        stack[stack.length - 1].hasChildren = true
      } else {
        tree.push(node)
      }
      stack.push(node)
    }
  }
  
  treeHeadings.value = tree
}

// 切换节点展开/收起状态
const toggleNode = (node) => {
  node.expanded = !node.expanded
}

// 提取标题
const extractHeadings = () => {
  // 获取页面内容中的标题，尝试多种可能的类名
  let content = document.querySelector('.blog-post-container .post-content')
  if (!content) {
    content = document.querySelector('.blog-post .post-content')  // 如果使用BlogPost样式
  }
  if (!content) {
    content = document.querySelector('.post-content')  // 直接查找post-content
  }
  
  if (!content) return []
  
  const headingElements = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const result = []
  
  headingElements.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1))
    const text = heading.textContent.trim()
    const id = heading.getAttribute('id')
    
    if (id && text) {
      result.push({
        level,
        text,
        id
      })
    }
  })
  
  return result
}

// 更新章节列表
const updateHeadings = async () => {
  await nextTick()
  headings.value = extractHeadings()
  buildTreeHeadings()
}

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    // 更新URL hash
    history.pushState(null, '', `#${id}`)
  }
}

// 监听路由变化重新生成章节列表
watch(
  () => route.path,
  async () => {
    await updateHeadings()
  },
  { immediate: true }
)

onMounted(async () => {
  await updateHeadings()
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
    
    <div class="post-content-wrapper">
      <div class="post-content">
        <slot />
      </div>
    </div>
    
    <!-- 章节列表 - 悬浮在右侧 -->
    <div v-if="treeHeadings && treeHeadings.length > 0" class="outline-container floating">
      <!-- 展开/收起按钮 -->
      <button 
        class="outline-toggle" 
        :class="{ active: showOutline }"
        @click="showOutline = !showOutline"
      >
        <span class="vpi-list outline-icon"></span>
        <span class="outline-text">章节</span>
      </button>
      
      <!-- 章节目录内容 -->
      <div v-show="showOutline" class="outline-list">
        <TreeItem
          v-for="node in treeHeadings" 
          :key="node.id"
          :node="node"
          @scrollToHeading="scrollToHeading"
          @toggle-node="toggleNode"
        />
      </div>
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

.post-content-wrapper {
  position: relative;
  display: flex;
  gap: 2rem;
}

.post-content {
  flex: 1;
  line-height: 1.7;
}

.outline-container.floating {
  position: fixed;
  top: 100px; /* 与导航栏保持一定间距 */
  right: 20px; /* 悬浮在右侧 */
  width: 320px;
  z-index: 100;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.outline-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px 8px 0 0; /* 上方圆角 */
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.outline-toggle:hover {
  background: var(--vp-c-bg-soft-hover, var(--vp-c-bg-soft));
  color: var(--vp-c-brand-1);
}

.outline-toggle.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.outline-icon {
  font-size: 1rem;
}

.outline-text {
  font-weight: 500;
}

.outline-list {
  background: transparent; /* 透明背景，与容器区分 */
  padding: 0.5rem 1rem 1rem;
  margin: 0;
  max-height: calc(100vh - 150px); /* 调整高度适应按钮 */
  overflow-y: auto;
  border-top: 1px solid var(--vp-c-divider);
}

.outline-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.outline-list li {
  margin: 0.25rem 0;
}

.outline-list .level-1 {
  padding-left: 0;
  font-weight: 600;
}

.outline-list .level-2 {
  padding-left: 1rem;
  font-size: 0.95rem;
}

.outline-list .level-3 {
  padding-left: 2rem;
  font-size: 0.9rem;
}

.outline-list .level-4 {
  padding-left: 3rem;
  font-size: 0.85rem;
}

.outline-list .level-5,
.outline-list .level-6 {
  padding-left: 4rem;
  font-size: 0.8rem;
}

.outline-link {
  display: block;
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.25s, padding-left 0.25s;
}

.outline-link:hover {
  color: var(--vp-c-brand-1);
  padding-left: 0.25rem;
}

@media (max-width: 960px) {
  .post-content-wrapper {
    flex-direction: column;
  }
  
  .outline-container.floating {
    position: fixed;
    top: auto;
    bottom: 20px;
    right: 20px;
    width: calc(100% - 40px);
    max-height: 200px;
  }
  
  .outline-list {
    max-height: 150px;
  }
}

/* 针对较大的屏幕 */
@media (min-width: 1400px) {
  .outline-container.floating {
    right: calc((100% - var(--vp-layout-max-width))/2 + 20px);
  }
}
</style>