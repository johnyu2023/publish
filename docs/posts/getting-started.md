# 开始使用 VitePress 搭建技术博客

::: info 文章信息
- **发布时间**: 2024-01-01
- **更新时间**: 2024-01-01
- **分类**: 技术教程
- **标签**: VitePress, 博客, 前端
:::

## 什么是 VitePress？

VitePress 是一个基于 Vite 的静态站点生成器，专门为创建技术文档而设计。它具有以下特点：

- ⚡️ **极快的启动速度** - 基于 Vite 构建
- 📝 **Markdown 优先** - 原生支持 Markdown
- 🎨 **主题丰富** - 内置默认主题，支持自定义
- 🔍 **SEO 友好** - 静态站点生成
- 📱 **响应式设计** - 完美适配移动端

## 为什么选择 VitePress？

相比其他静态站点生成器，VitePress 有以下优势：

1. **性能优秀** - 启动速度快，热更新迅速
2. **配置简单** - 开箱即用，配置灵活
3. **中文支持** - 对中文内容支持良好
4. **部署简单** - 可以轻松部署到各种平台

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run docs:dev
```

### 3. 构建生产版本

```bash
npm run docs:build
```

### 4. 预览生产版本

```bash
npm run docs:preview
```

## 项目结构

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress 配置文件
├── posts/                 # 博客文章目录
│   ├── index.md          # 文章列表页
│   ├── getting-started.md # 本文档
│   └── markdown-guide.md  # Markdown 指南
├── about.md              # 关于页面
└── index.md              # 首页
```

## 配置说明

### 基础配置

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的技术博客",
  description: "分享技术心得和学习笔记",
  lang: 'zh-CN',
  
  themeConfig: {
    siteTitle: '我的技术博客',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' }
    ]
  }
})
```

### 导航配置

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: '文章', link: '/posts/' },
  { text: '关于', link: '/about' }
]
```

### 侧边栏配置

```typescript
sidebar: {
  '/posts/': [
    {
      text: '文章列表',
      items: [
        { text: '开始使用 VitePress', link: '/posts/getting-started' },
        { text: 'Markdown 语法指南', link: '/posts/markdown-guide' }
      ]
    }
  ]
}
```

## 部署到 GitHub Pages

### 1. 创建 GitHub Actions 工作流

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with VitePress
        run: npm run docs:build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. 配置 GitHub Pages

1. 进入仓库设置
2. 找到 Pages 选项
3. 选择 "GitHub Actions" 作为部署源

### 3. 推送代码

```bash
git add .
git commit -m "feat: 初始化 VitePress 博客"
git push origin main
```

## 自定义主题

VitePress 支持深度自定义主题，你可以：

1. **修改颜色变量**
2. **自定义组件**
3. **添加自定义样式**
4. **集成第三方库**

## 总结

VitePress 是一个优秀的静态站点生成器，特别适合创建技术博客。它具有：

- 🚀 优秀的性能
- 📝 良好的写作体验
- 🎨 丰富的主题选项
- 🔧 灵活的配置
- 📱 完美的响应式设计

如果你正在寻找一个现代化的技术博客解决方案，VitePress 绝对是一个不错的选择！

## 相关链接

- [VitePress 官方文档](https://vitepress.dev/)
- [VitePress GitHub 仓库](https://github.com/vuejs/vitepress)
- [Markdown 语法指南](./markdown-guide.md)

---

::: tip 提示
如果你在使用过程中遇到任何问题，欢迎在评论区留言讨论！
:::
