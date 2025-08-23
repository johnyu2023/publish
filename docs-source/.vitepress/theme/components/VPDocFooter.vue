<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

const { theme, page } = useData()
const { sidebar } = useSidebar()

import { useRoute } from 'vitepress'

const route = useRoute()

// 扁平化侧边栏项目
function flattenSidebarItems(items) {
  const result = []
  
  function flatten(items) {
    if (!items) return
    for (const item of items) {
      if (item.link) {
        result.push(item)
      }
      if (item.items) {
        flatten(item.items)
      }
    }
  }
  
  flatten(items)
  return result
}

// 获取当前页面所在的侧边栏分组
const currentSidebarItems = computed(() => {
  // 获取当前路径
  const path = route.path
  
  // 移除 /publish 前缀（如果存在）
  const normalizedPath = path.replace(/^\/publish/, '')
  
  // 确定当前页面所在的侧边栏分组
  let sidebarGroup = null
  
  // 从路径中提取分组名称（例如 /ai/xxx 对应 /ai/ 分组）
  const match = normalizedPath.match(/^\/([^/]+)\//)
  if (match) {
    sidebarGroup = `/${match[1]}/`
  }
  
  // 如果找到了分组，返回该分组的侧边栏项目
  if (sidebarGroup && sidebar.value[sidebarGroup]) {
    return sidebar.value[sidebarGroup]
  }
  
  // 否则返回空数组
  return []
})

// 获取扁平化的侧边栏项目
const flatItems = computed(() => {
  return flattenSidebarItems(currentSidebarItems.value)
})

// 查找当前页面在侧边栏中的索引
const currentIndex = computed(() => {
  // 获取当前页面的路径
  const currentPath = route.path
  
  // 在扁平化的侧边栏项目中查找匹配项
  return flatItems.value.findIndex(item => {
    // 确保链接格式一致进行比较
    // 移除开头的 /publish 以便于比较（如果存在）
    const normalizedItemLink = item.link.replace(/^\/publish/, '')
    return normalizedItemLink === currentPath
  })
})

// 获取上一页和下一页
const prevItem = computed(() => {
  if (currentIndex.value > 0) {
    const prev = flatItems.value[currentIndex.value - 1]
    return {
      text: prev.text,
      link: prev.link
    }
  }
  return null
})

const nextItem = computed(() => {
  if (currentIndex.value !== -1 && currentIndex.value < flatItems.value.length - 1) {
    const next = flatItems.value[currentIndex.value + 1]
    return {
      text: next.text,
      link: next.link
    }
  }
  return null
})

// 调试信息
console.log('当前路径:', route.path)
console.log('侧边栏项目:', flatItems.value)
console.log('当前索引:', currentIndex.value)
console.log('上一页:', prevItem.value)
console.log('下一页:', nextItem.value)
</script>

<template>
  <footer class="VPDocFooter">
    <div class="prev-next">
      <div class="pager">
        <a v-if="prevItem" class="pager-link prev" :href="prevItem.link">
          <span class="desc">上一页</span>
          <span class="title">{{ prevItem.text }}</span>
        </a>
      </div>
      <div class="pager">
        <a v-if="nextItem" class="pager-link next" :href="nextItem.link">
          <span class="desc">下一页</span>
          <span class="title">{{ nextItem.text }}</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.VPDocFooter {
  margin-top: 64px;
}

.prev-next {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
}

.pager {
  display: flex;
}

.pager-link {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  width: 100%;
  max-width: 368px;
  transition: border-color 0.25s;
}

.pager-link:hover {
  border-color: var(--vp-c-brand);
}

.pager-link.prev {
  margin-right: 8px;
}

.pager-link.next {
  margin-left: 8px;
  text-align: right;
}

.desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}

.title {
  font-weight: 500;
  color: var(--vp-c-brand);
}
</style>