# AI时代的技术博客

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
├── docs/                    # 构建输出目录（GitHub Pages 部署目录）
├── docs-source/             # 源文件目录
│   ├── .vitepress/         # VitePress 配置
│   │   └── config.ts       # 配置文件
│   ├── posts/              # 博客文章
│   │   ├── index.md        # 文章列表页
│   │   ├── getting-started.md
│   │   └── markdown-guide.md
│   ├── ai/                 # AI 相关文章
│   │   ├── code.md
│   │   ├── coding_01.md
│   │   └── function_calling.md
│   ├── about.md            # 关于页面
│   └── index.md            # 首页
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
npm run dev
```

访问 <http://localhost:5173> 查看效果。

### 清理相关目录

```bash
npm run clean
```

- 清空目录: docs
- 清空目录: publish

### 构建预览版本

```bash
npm run preview
```

访问 <http://192.168.3.36:5174/publish/> 查看效果。

### 构建生产版本

```bash
npm run build
```

## 📝 写作指南

### 创建新文章

1. 在 `docs-source/posts/` 或 `docs-source/ai/` 目录下创建新的 `.md` 文件
2. 在文件开头添加 frontmatter：

```markdown
---
title: 文章标题
description: 文章描述
date: 2024-01-01
tags: [标签1, 标签2]
---
```

### 文章格式规范

- 使用 Markdown 语法编写
- 合理使用标题层级（H1-H6）
- 添加适当的代码高亮
- 使用 VitePress 的扩展语法（如 tip、warning 等）

## 🚀 部署

### 部署到 GitHub Pages

```bash
# 清理旧的构建文件（可选）
npm run clean

# 构建并部署到 GitHub Pages
npm run build

# 提交并推送到 GitHub
git add .
git commit -m "更新网站内容"
git push
```

## RSS 文件生成

- RSS 文件会在构建过程中自动生成，使用生产环境的域名和地址
- 在执行 npm run preview 或 npm run build 命令时，会自动更新 RSS 文件

- 手动更新 RSS：
`npm run update:rss`

- 部署网站（包含自动更新 RSS）：
`npm run build` 或 `npm run preview`

## 部署流程回顾

当你需要更新网站时，请按照以下步骤操作：

编辑或添加 Markdown 文件（注意：文件名最好使用连字符 - 而不是下划线 _）
运行 npm run deploy:github 命令（这会自动更新 RSS 文件并构建网站）
提交更改：git add . 和 git commit -m "更新信息"
推送到 GitHub：git push origin main
GitHub Pages 会自动部署 docs 目录中的内容，使你的网站保持最新状态。

现在你的网站应该完全正常工作了，所有链接都应该指向正确的页面。

## 🎨 自定义

### 修改配置

编辑 `docs-source/.vitepress/config.ts` 文件：

- 修改网站标题和描述
- 调整导航菜单
- 配置侧边栏
- 添加社交链接

### 自定义样式

在 `docs-source/.vitepress/theme/` 目录下创建自定义主题文件。

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://markdown.com.cn/)
- [GitHub Pages 文档](https://pages.github.com/)

## 📄 许可证

MIT License

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
