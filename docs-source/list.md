---
title: 文章列表
layout: page
---

<div class="list-full-width">
  <h1 class="page-title">文章列表</h1>
  <ShowAllTitle :inModal="false" />
</div>

<style>
.list-full-width {
  margin-top: calc(var(--vp-nav-height, 64px) + 20px);
  padding: 20px 40px;
  width: 100%;
  max-width: 100%;
}

.page-title {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2em;
  color: var(--vp-c-text-1);
}
</style>

<script setup>
// ShowAllTitle 组件已经在 .vitepress/theme/index.js 中全局注册
</script>