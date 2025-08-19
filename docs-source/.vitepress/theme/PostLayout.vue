<script setup>
import { useData } from 'vitepress'
import PostDate from '../components/PostDate.vue'

const { frontmatter } = useData()
</script>

<template>
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
</template>

<style scoped>
.post-container {
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
</style>