<script setup>
import { useData } from 'vitepress'
import PostDate from './components/PostDate.vue'
import SidebarArticleList from './components/SidebarArticleList.vue'

const { frontmatter } = useData()
</script>

<template>
  <div class="post-layout">
    <!-- 左侧边栏 - 同目录文章列表 -->
    <aside class="post-sidebar">
      <SidebarArticleList />
    </aside>
    
    <!-- 主要内容区域 -->
    <div class="post-container">
      <h1 class="post-title">{{ frontmatter.title }}</h1>
      <PostDate v-if="frontmatter.date" :date="frontmatter.date" />
      <div v-if="frontmatter.description" class="post-description">
        {{ frontmatter.description }}
      </div>
      <div class="post-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-layout {
  display: flex;
  gap: 2rem;
}

.post-sidebar {
  width: 200px;
  flex-shrink: 0;
  padding-top: 1.5rem;
}

.post-container {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  margin: 0 auto;
}

.post-title {
  margin-bottom: 0.5rem;
}

.post-description {
  margin-top: 1rem;
  margin-bottom: 2rem;
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  font-style: italic;
}

.post-content {
  margin-top: 2rem;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .post-layout {
    flex-direction: column;
  }
  
  .post-sidebar {
    width: 100%;
    padding-top: 0;
    margin-bottom: 1.5rem;
  }
}
</style>
