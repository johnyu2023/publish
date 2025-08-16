# 我的技术博客

基于 VitePress 构建的个人技术博客，分享技术心得和学习笔记。

## 🚀 特性

- ⚡️ **极速启动** - 基于 Vite 构建，启动和热更新速度极快
- 📝 **Markdown 优先** - 原生支持 Markdown，写作体验佳
- 🎨 **主题美观** - 内置默认主题，支持自定义样式
- 🔍 **SEO 友好** - 静态站点生成，对搜索引擎优化很好
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌐 **多语言支持** - 支持中文内容，国际化友好

## 📁 项目结构

```
.
├── docs/                    # 文档目录
│   ├── .vitepress/         # VitePress 配置
│   │   └── config.ts       # 配置文件
│   ├── posts/              # 博客文章
│   │   ├── index.md        # 文章列表页
│   │   ├── getting-started.md
│   │   └── markdown-guide.md
│   ├── about.md            # 关于页面
│   └── index.md            # 首页
├── .github/                # GitHub 配置
│   └── workflows/          # GitHub Actions
│       └── deploy.yml      # 自动部署配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 🛠️ 本地开发

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run docs:dev
```

访问 http://localhost:5173 查看效果。

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产版本

```bash
npm run docs:preview
```

## 📝 写作指南

### 创建新文章

1. 在 `docs/posts/` 目录下创建新的 `.md` 文件
2. 在文件开头添加 frontmatter：

```markdown
---
title: 文章标题
description: 文章描述
date: 2024-01-01
tags: [标签1, 标签2]
---
```

3. 在 `docs/.vitepress/config.ts` 中的 sidebar 配置中添加文章链接
4. 在 `docs/posts/index.md` 中添加文章到列表

### 文章格式规范

- 使用 Markdown 语法编写
- 合理使用标题层级（H1-H6）
- 添加适当的代码高亮
- 使用 VitePress 的扩展语法（如 tip、warning 等）

## 🚀 部署

### 自动部署（推荐）

项目已配置 GitHub Actions，推送代码到 main 分支会自动部署到 GitHub Pages。

### 手动部署

```bash
npm run deploy
```

## 🎨 自定义

### 修改配置

编辑 `docs/.vitepress/config.ts` 文件：

- 修改网站标题和描述
- 调整导航菜单
- 配置侧边栏
- 添加社交链接

### 自定义样式

在 `docs/.vitepress/theme/` 目录下创建自定义主题文件。

### 添加组件

在 `docs/.vitepress/theme/` 目录下创建 Vue 组件。

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://markdown.com.cn/)
- [GitHub Pages 文档](https://pages.github.com/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系

- 邮箱：johnyu2023@example.com
- GitHub：[@johnyu2023](https://github.com/johnyu2023)

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
