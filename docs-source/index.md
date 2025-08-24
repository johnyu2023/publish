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
</script>

<div class="article-section">
  <h2><a :href="withBase('/list')">最新文章</a></h2>

  <div class="vp-raw">
  <div class="custom-block">
    <h3>📖 最近更新</h3>
    <ul>
      <li><a :href="withBase('/ai/data-cleaning')">浅谈数据清洗</a> - 2025-08-21</li>
      <li><a :href="withBase('/ai/data-science')">数据科学与AI应用开发的关系</a> - 2025-08-21</li>
      <li><a :href="withBase('/think/pm')">AI草莽时代，产品经理应该是怎样的人担当</a> - 2025-08-20</li>
      <li><a :href="withBase('/ai/function-calling-vs-mcp')">Function Calling vs MCP</a> - 2025-08-19</li>
      <li><a :href="withBase('/ai/coding-01')">AI 辅助编程的注意事项</a> - 2025-08-18</li>
    </ul>
    <div class="rss-subscribe">
      <p>📡 <a href="./rss.xml">订阅 RSS Feed</a> 获取最新文章更新</p>
    </div>
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