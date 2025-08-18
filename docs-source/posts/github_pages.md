---
title: 使用 GitHub Pages 部署静态网页的网站
description: 如何使用 GitHub Pages 部署静态网页的网站
date: 2025-08-15
tags: [github, pages]
---

# 使用 GitHub Pages 部署静态网页的网站


## GitHub Pages 是什么

GitHub Pages 是 GitHub 提供的一项免费服务，用于托管静态网页。该服务于 2008 年推出，可谓是一个历史悠久的服务。

+ 你可以使用它来创建个人博客、展示项目或发布其他类型的静态内容 
+ 它是一项静态站点托管服务，直接从 GitHub 上获取 HTML、CSS 和 JavaScript 文件，然后发布网站 
+ 其原理是，GitHub 允许用户将仓库中的内容发布为在线网站 
+ 每个用户都会自动分配一个以用户名命名的特殊域名：`username.github.io` 
+ 当你在 GitHub 上创建一个名为 `username.github.io` 的仓库，并将你的静态网页文件（如 HTML, CSS, JavaScript）推送到这个仓库时，GitHub Pages 就会自动将这些文件托管起来，并通过分配的域名提供访问 
+ 这使得用户可以轻松地拥有一个个人网站 

## 部署静态内容网站的步骤

+ 创建仓库：在 GitHub 上创建一个新的仓库。为了使用你的用户名作为网站地址（`username.github.io`），你需要创建一个名为 `username.github.io` 的仓库（将 `username` 替换为你的实际 GitHub 用户名）。
+ 添加静态文件：将你的静态网页文件（如 index.html, style.css, script.js 等）添加到这个仓库中。你可以通过本地 Git 仓库推送文件，或者直接在 GitHub 网页上创建和上传文件 。
+ 启用 GitHub Pages：进入你刚刚创建的仓库，点击 "Settings"（设置）选项卡。在左侧菜单中找到并点击 "Pages"（页面）。在 "Pages" 设置页面中，选择包含你网站文件的分支（通常是 main 或 master）和文件夹（例如 / (root)），然后点击 "Save"（保存）。这个操作会启用 GitHub Pages 服务。
+ 等待部署：保存设置后，GitHub 会处理你的文件并部署网站。完成后，你会在设置页面看到一个绿色的消息，提示你的站点已发布，并提供访问网站的 URL（例如 `https://username.github.io`）。
+ 你还可以选择使用 GitHub Actions 来自动化部署流程，或者配置自定义域名。

## 推荐的最佳实践

+ 使用 vitepress 快色构建网站
+ 文章内容使用 md 格式
+ 将原始文章保存在 docs-source/ 目录下
+ 文章的侧边栏链接配置在 docs-source/.vitepress/config.ts
+ 首页的文章列表由 node 执行脚本更新
+ 编译后的内容保存在 docs 目录下
+ github 中 Pages 设置，指向 main 分支的 docs 目录
+ 每次提交后，自动出发 github 默认的 Action 将 docs 目录下的内容发布到 pages 里
