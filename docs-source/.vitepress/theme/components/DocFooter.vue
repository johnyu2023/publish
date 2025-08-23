<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

const { theme, page } = useData()
const { sidebar } = useSidebar()

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

// 获取扁平化的侧边栏项目
const flatItems = computed(() => {
  return flattenSidebarItems(sidebar.value)
})

// 查找当前页面在侧边栏中的索引
const currentIndex = computed(() => {
  return flatItems.value.findIndex(item => item.link === page.value.relativePath.replace(/\.md$/, ''))
})

// 获取上一页和下一页
const prevItem = computed(() => {
  if (currentIndex.value > 0) {
    return flatItems.value[currentIndex.value - 1]
  }
  return null
})

const nextItem = computed(() => {
  if (currentIndex.value !== -1 && currentIndex.value < flatItems.value.length - 1) {
    return flatItems.value[currentIndex.value + 1]
  }
  return null
})
</script>

<template>
  <footer class="VPDocFooter">
    <div class="prev-next">
      <div class="pager">
        <a v-if="prevItem" class="pager-link prev" :href="prevItem.link">
          <span class="desc">Previous page</span>
          <span class="title">{{ prevItem.text }}</span>
        </a>
      </div>
      <div class="pager">
        <a v-if="nextItem" class="pager-link next" :href="nextItem.link">
          <span class="desc">Next page</span>
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