---
layout: home
hero:
  name: AI时代开发思考之旅
  text: Learn in Public
  tagline: 费曼学习法的实践
  actions:
    - theme: brand
      text: AI编程
      link: /ai/code
    - theme: alt
      text: github pages
      link: /posts/github-pages

features:
  - icon: 🚀
    title: 学习笔记
    details: 记录AI学习笔记
    link: /ai/code

  - icon: 📝
    title: 技术文章
    details: 分享传统技术的文章心得
    link: /posts/github-pages

  - icon: 💡
    title: 观察思考
    details: 分享对现在和未来的一些思考
    link: /think/pm

  - icon: 🌐
    title: 前端开发
    details: 分享前端开发技术和最佳实践
    link: /web/hybrid-rendering
---

<script setup>
import { withBase } from 'vitepress'
import RecentArticles from './.vitepress/components/RecentArticles.vue'
</script>

<RecentArticles />

<style>
.article-section {
  margin-top: 2rem;
}

.article-section h2 {
  margin-bottom: 1rem;
}

.rss-subscribe {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.rss-subscribe p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.rss-subscribe a {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
}

.rss-subscribe a:hover {
  text-decoration: underline;
}
</style>
