---
layout: home
hero:
  name: AI时代技术之旅
  text: 分享技术心得
  tagline: 记录学习过程，分享技术见解
  actions:
    - theme: brand
      text: AI编程
      link: /ai/code
    - theme: alt
      text: github pages
      link: /posts/github-pages
---

<script setup>
import { withBase } from 'vitepress'
</script>

## 最新文章

<div class="vp-raw">
  <div class="custom-block">
    <h3>📖 最近更新</h3>
    <ul>
      <li><a :href="withBase('/ai/function-calling-02')">Function Calling 详解</a> - 2025-08-19</li>
      <li><a :href="withBase('/ai/coding-01')">AI 辅助编程的注意事项</a> - 2025-08-18</li>
      <li><a :href="withBase('/posts/github-pages')">使用 GitHub Pages 部署静态网站</a> - 2025-08-14</li>
      <li><a :href="withBase('/ai/function-calling')">Function Calling 的原始形态</a> - 2025-07-16</li>
      <li><a :href="withBase('/ai/code')">AI 辅助编程</a> - 2025-06-15</li>
    </ul>
    <div class="rss-subscribe">
      <p>📡 <a href="./rss.xml">订阅 RSS Feed</a> 获取最新文章更新</p>
    </div>
  </div>
</div>

<style>
.custom-block {
  padding: 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.custom-block h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.custom-block ul {
  margin: 0;
  padding-left: 1.5rem;
}

.custom-block li {
  margin-bottom: 0.5rem;
}

.custom-block a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.custom-block a:hover {
  text-decoration: underline;
}

.rss-subscribe {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
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