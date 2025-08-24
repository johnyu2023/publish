---
layout: doc
title: 全部文章列表
---

# 全部文章列表

<script setup>
import { withBase } from 'vitepress'
import { ref, onMounted } from 'vue'

// 用于存储每个年份区域的折叠状态
const yearCollapsed = ref({})

// 切换年份区域的折叠状态
function toggleYear(year) {
  yearCollapsed.value[year] = !yearCollapsed.value[year]
}

// 初始化时所有年份默认展开
onMounted(() => {
  const years = document.querySelectorAll('.year-title')
  years.forEach(year => {
    const yearText = year.textContent.trim()
    yearCollapsed.value[yearText] = false
  })
})
</script>

<div class="article-list">
  <!-- 此处内容将由 update-recent-posts.js 脚本自动生成 -->
<div class="year-section">
  <h2 class="year-title">2025年</h2>
  <div class="month-section">
    <h3 class="month-title">8月</h3>
    <ul>
      <li>
        <span class="article-date">8-21</span>
        <span class="article-title"><a :href="withBase('/ai/data-cleaning')">浅谈数据清洗</a></span>
      </li>
      <li>
        <span class="article-date">8-21</span>
        <span class="article-title"><a :href="withBase('/ai/data-science')">数据科学与AI应用开发的关系</a></span>
      </li>
      <li>
        <span class="article-date">8-20</span>
        <span class="article-title"><a :href="withBase('/think/pm')">AI草莽时代，产品经理应该是怎样的人担当</a></span>
      </li>
      <li>
        <span class="article-date">8-19</span>
        <span class="article-title"><a :href="withBase('/ai/function-calling-vs-mcp')">Function Calling vs MCP</a></span>
      </li>
      <li>
        <span class="article-date">8-18</span>
        <span class="article-title"><a :href="withBase('/ai/coding-01')">AI 辅助编程的注意事项</a></span>
      </li>
      <li>
        <span class="article-date">8-14</span>
        <span class="article-title"><a :href="withBase('/posts/github-pages')">使用 GitHub Pages 部署静态网站</a></span>
      </li>
      <li>
        <span class="article-date">8-01</span>
        <span class="article-title"><a :href="withBase('/web/hybrid-rendering')">web 网站的混合渲染</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">7月</h3>
    <ul>
      <li>
        <span class="article-date">7-16</span>
        <span class="article-title"><a :href="withBase('/ai/function-calling')">Function Calling 的原始形态</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">6月</h3>
    <ul>
      <li>
        <span class="article-date">6-15</span>
        <span class="article-title"><a :href="withBase('/ai/code')">AI 辅助编程</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">3月</h3>
    <ul>
      <li>
        <span class="article-date">3-01</span>
        <span class="article-title"><a :href="withBase('/ai/machine-learning')">机器学习，深度学习，强化学习</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">1月</h3>
    <ul>
      <li>
        <span class="article-date">1-16</span>
        <span class="article-title"><a :href="withBase('/posts/markdown-guide')">Markdown 语法完全指南</a></span>
      </li>
      <li>
        <span class="article-date">1-15</span>
        <span class="article-title"><a :href="withBase('/posts/getting-started')">开始使用 VitePress 搭建技术博客</a></span>
      </li>
    </ul>
  </div>
</div>
<div class="year-section">
  <h2 class="year-title">2024年</h2>
  <div class="month-section">
    <h3 class="month-title">11月</h3>
    <ul>
      <li>
        <span class="article-date">11-11</span>
        <span class="article-title"><a :href="withBase('/posts/ssh')">ssh 原理图</a></span>
      </li>
    </ul>
  </div>
</div>
</div>
  <div class="month-section">
    <h3 class="month-title">7月</h3>
    <ul>
      <li>
        <span class="article-date">7-16</span>
        <span class="article-title"><a :href="withBase('/ai/function-calling')">Function Calling 的原始形态</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">6月</h3>
    <ul>
      <li>
        <span class="article-date">6-15</span>
        <span class="article-title"><a :href="withBase('/ai/code')">AI 辅助编程</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">3月</h3>
    <ul>
      <li>
        <span class="article-date">3-01</span>
        <span class="article-title"><a :href="withBase('/ai/machine-learning')">机器学习，深度学习，强化学习</a></span>
      </li>
    </ul>
  </div>
  <div class="month-section">
    <h3 class="month-title">1月</h3>
    <ul>
      <li>
        <span class="article-date">1-16</span>
        <span class="article-title"><a :href="withBase('/posts/markdown-guide')">Markdown 语法完全指南</a></span>
      </li>
      <li>
        <span class="article-date">1-15</span>
        <span class="article-title"><a :href="withBase('/posts/getting-started')">开始使用 VitePress 搭建技术博客</a></span>
      </li>
    </ul>
  </div>
</div>
<div class="year-section">
  <h2 class="year-title">2024年</h2>
  <div class="month-section">
    <h3 class="month-title">11月</h3>
    <ul>
      <li>
        <span class="article-date">11-11</span>
        <span class="article-title"><a :href="withBase('/posts/ssh')">ssh 原理图</a></span>
      </li>
    </ul>
  </div>
</div>
</div>
      <div class="month-section">
        <h3 class="month-title">7月</h3>
        <ul>
          <li>
            <span class="article-date">7-16</span>
            <span class="article-title"><a :href="withBase('/ai/function-calling')">Function Calling 的原始形态</a></span>
          </li>
        </ul>
      </div>
      <div class="month-section">
        <h3 class="month-title">6月</h3>
        <ul>
          <li>
            <span class="article-date">6-15</span>
            <span class="article-title"><a :href="withBase('/ai/code')">AI 辅助编程</a></span>
          </li>
        </ul>
      </div>
      <div class="month-section">
        <h3 class="month-title">3月</h3>
        <ul>
          <li>
            <span class="article-date">3-01</span>
            <span class="article-title"><a :href="withBase('/ai/machine-learning')">机器学习，深度学习，强化学习</a></span>
          </li>
        </ul>
      </div>
      <div class="month-section">
        <h3 class="month-title">1月</h3>
        <ul>
          <li>
            <span class="article-date">1-16</span>
            <span class="article-title"><a :href="withBase('/posts/markdown-guide')">Markdown 语法完全指南</a></span>
          </li>
          <li>
            <span class="article-date">1-15</span>
            <span class="article-title"><a :href="withBase('/posts/getting-started')">开始使用 VitePress 搭建技术博客</a></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="year-section">
    <h2 class="year-title" @click="toggleYear('2024年')">
      2024年
      <span class="toggle-icon" :class="{ 'collapsed': yearCollapsed['2024年'] }">
        {{ yearCollapsed['2024年'] ? '▶' : '▼' }}
      </span>
    </h2>
    <div class="year-content" :class="{ 'hidden': yearCollapsed['2024年'] }">
      <div class="month-section">
        <h3 class="month-title">11月</h3>
        <ul>
          <li>
            <span class="article-date">11-11</span>
            <span class="article-title"><a :href="withBase('/posts/ssh')">ssh 原理图</a></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
.article-list {
  margin-top: 2rem;
}

.year-section {
  margin-bottom: 2rem;
}

.year-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.toggle-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.toggle-icon.collapsed {
  transform: rotate(-90deg);
}

.year-content {
  transition: max-height 0.5s ease, opacity 0.5s ease;
  max-height: 2000px;
  opacity: 1;
  overflow: hidden;
}

.year-content.hidden {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.month-section {
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.article-list ul {
  padding-left: 0;
  list-style-type: none;
}

.article-list li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
}

.article-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-right: 1rem;
  min-width: 5rem;
}

.article-title {
  flex: 1;
}

.article-list a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.article-list a:hover {
  text-decoration: underline;
}
</style>
