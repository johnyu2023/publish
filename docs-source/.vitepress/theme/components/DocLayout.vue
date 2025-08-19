<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { frontmatter, page } = useData()

// 检查是否为文章页面（非首页、非列表页）
const isPostPage = computed(() => {
  return page.value.relativePath.includes('/') && 
         !page.value.relativePath.endsWith('index.md') && 
         page.value.relativePath.endsWith('.md')
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <PostDate v-if="isPostPage && frontmatter.date" />
    </template>
  </Layout>
</template>