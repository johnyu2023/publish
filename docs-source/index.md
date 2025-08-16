---
layout: home
hero:
  name: 我的技术博客
  text: 分享技术心得和学习笔记
  tagline: 记录学习过程，分享技术见解
  actions:
    - theme: brand
      text: 开始阅读
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 📝
    title: 技术文章
    details: 分享前端、后端、DevOps 等技术领域的文章和心得
  - icon: 🚀
    title: 学习笔记
    details: 记录学习新技术的过程和遇到的问题
  - icon: 💡
    title: 经验分享
    details: 分享项目开发中的经验和最佳实践
---

## 最新文章

<div class="vp-raw">
  <div class="custom-block">
    <h3>📖 最近更新</h3>
    <ul>
      <li><a href="/ai/function_calling">Function Calling 的原始形态</a> - 2024-01-01</li>
      <li><a href="/posts/getting-started">开始使用 VitePress 搭建技术博客</a> - 2024-01-01</li>
      <li><a href="/posts/markdown-guide">Markdown 语法完全指南</a> - 2024-01-01</li>
    </ul>
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
</style>
