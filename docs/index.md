---
layout: home
title: 主页
hero:
  name: publish2
  text: 个人技术博客
  tagline: 记录学习历程，分享技术心得
  image:
    src: /logo.png
    alt: publish2
  actions:
    - theme: brand
      text: 开始阅读
      link: /ai/future-of-ai
    - theme: alt
      text: 查看全部分类
      link: /categories
features:
  - title: 人工智能
    details: AI技术发展与应用
    icon: 🤖
  - title: 基础知识
    details: 计算机科学基础知识
    icon: 📘
  - title: 全栈开发
    details: 前后端开发实践
    icon: 💻
  - title: 技术思考
    details: 对技术发展的观察
    icon: 💭
  - title: 技术文档
    details: 实用技术参考文档
    icon: 📋
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