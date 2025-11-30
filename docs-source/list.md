---
title: 文章列表
layout: page
---

<div class="list-full-width">
  <h1 class="page-title">文章列表</h1>
  <ShowAllTitle />
</div>

<style>
.list-full-width {
  margin-top: calc(var(--vp-nav-height, 64px) + 20px);
  padding: 20px 40px;
  width: 100%;
}

.page-title {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2em;
  color: var(--vp-c-text-1);
}

/* 隐藏本页面的侧边栏 */
:root {
  --vp-sidebar-width: 0px !important;
}

.VPContent.has-sidebar {
  padding-left: 0 !important;
}

/* 隐藏侧边栏导航 */
.VPLocalNav.has-sidebar {
  display: none;
}

/* 隐藏侧边栏 */
.VPSidebar {
  display: none !important;
}

/* 确保主要内容区域使用全部宽度 */
.VPDoc {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.VPDoc .container {
  max-width: 100% !important;
  padding: 0 24px;
}
</style>

<script setup>
// ShowAllTitle 组件已经在 .vitepress/theme/index.js 中全局注册
</script>