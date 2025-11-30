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
---

<script setup>
import { ref, onMounted } from 'vue'
import TabbedSection from './.vitepress/components/TabbedSection.vue'
import CategoryCards from './.vitepress/components/CategoryCards.vue'

// 组件挂载后不需要额外的数据加载，因为CategoryCards组件会自己处理
</script>

<CategoryCards />
<TabbedSection />

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
