---
layout: home
title: AI时代技术学习之旅
hero:
  name: AI 时代的技术笔记
  text: 探索技术，理解未来
  tagline: 记录思考 · 分享实践 · 拥抱 AI
  image:
    src: /assets/head-sport.webp
    alt: 爱技术爱健身
  actions:
    - theme: brand
      text: 开始阅读
      link: /ai/future-of-ai
    - theme: alt
      text: 查看所有分类
      link: /categories
---

<CategoryGrid />

<script setup>
import CategoryGrid from './CategoryGrid.vue'
</script>

<style>
.home-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.custom-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.custom-section h3 {
  margin-top: 0;
  color: #2c3e50;
}

.custom-section ul {
  padding-left: 1.5rem;
}
</style>