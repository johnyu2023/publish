---
date: 2025-01-15
title: 开始使用 VitePress 搭建技术博客
description: 从零开始学习如何使用VitePress搭建个人技术博客
---

::: info 文章信息
- **发布时间**: 2025-01-15
- **更新时间**: 2025-01-15
- **分类**: 技术教程
- **标签**: VitePress, 博客, 前端
:::

# 开始使用 VitePress 搭建技术博客

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
docs-source/
├── .vitepress/
│   └── config.ts          # VitePress 配置文件
├── posts/                 # 博客文章目录
│   ├── index.md           # 文章列表页
│   ├── getting-started.md # 本文
│   └── markdown-guide.md  # Markdown 指南
├── about.md               # 关于页面
└── index.md               # 首页
```

## 配置说明

### 基础配置

在 `.vitepress/config.ts` 中配置网站的基本信息：

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

### 1. 构建静态文件

```bash
npm run docs:build
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 找到 "Pages" 选项
3. 选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/docs" 文件夹

### 3. 自动部署

使用我们配置的部署脚本：

```bash
npm run deploy
```

这个命令会：
1. 构建静态文件
2. 将构建结果复制到 `docs/` 目录
3. 推送到 GitHub

## 自定义主题

VitePress 支持深度自定义主题，你可以：

1. **修改 CSS 变量** - 改变颜色、字体等
2. **自定义组件** - 创建自己的 Vue 组件
3. **扩展功能** - 添加搜索、评论等功能

## 总结

VitePress 是一个优秀的技术博客解决方案，它：

- 🚀 **快速** - 基于 Vite 构建，性能优秀
- 📝 **简单** - Markdown 写作，配置简单
- 🎨 **美观** - 默认主题美观，支持自定义
- 🌐 **部署简单** - 一键部署到 GitHub Pages

如果你想要一个快速、简单、美观的技术博客，VitePress 绝对是一个不错的选择！
