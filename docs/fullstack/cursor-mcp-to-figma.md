---
title: Figma MCP 与 Cursor 配合使用
description: Cursor 中通过 MCP 访问 Figma ，目标是帮助用户还原设计稿，进而直接生成代码。
date: 2025-08-30
tags: [Cursor, MCP, Figma]
---

> AI 和 MCP 配合使用，将革命性地改变设计师和开发者之间的协作方式。

## Figma MCP 的用途

+ 让 AI 直接读取 Figma 设计的颜色、大小、字体、组件结构等
+ 提供标准化接口，以便不同的 AI 工具能够以相同的方式理解设计数据
+ 支持图片和图标的自动下载
+ 传输结构化数据，大幅提高AI生成代码的准确性
+ 减少多轮修订的需要，加快设计到代码的过程

## Figma 官方提供的 MCP

### 官方描述

+ 2025-06，Figma 正式宣布推出其 Dev Mode MCP（Model Context Protocol）服务器的Beta版，标志着设计与开发工作流的进一步融合。这一服务通过标准化协议将Figma的设计数据直接传递给AI编码工具，显著提升了从设计到代码的转换效率与准确性。

### 官方说明

[Introducing our Dev Mode MCP server: Bringing Figma into your workflow](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/)

### 操作指南

如果你的 Figma 账号没有开启 Dev Mode MCP 服务器，请按照以下步骤启用：
![enable dev mode mcp server](/assets/fullstack/figma-mcp/figma-enable-dev-mode-mcp-server.webp)

### 重要说明

如果你看不到上图，说明你的账号不符合条件：

+ Pro 版本 Figma 账号，且 Dev or Full seat 才可以使用
+ 教育版该功能不可用

### MCP 工具

官方 MCP 服务提供了4个工具。下图是 Cursor 中 MCP 配置截图，绿色小圆表示该 MCP 工具已启用，截图中显示了4个工具：
![4 tools](/assets/fullstack/figma-mcp/mcp-4-tools.webp)

### 参考文章

![Figma MCP: Complete Guide](https://uxplanet.org/figma-mcp-complete-guide-c45af0975ab8)

## 第三方 MCP - Figma-Context-MCP

### 什么是 Figma-Context-MCP

+ Figma-Context-MCP 是一个开源项目，并非 Figma 官方产品。
+ 它是一个 MCP 服务器，允许 AI 工具（例如Cursor、Claude 等）以标准化方式访问 Figma 设计数据，让 AI 能理解设计文件的每一个细节。
+ 它的目标是解决 AI 在仅有截图的情况下难以准确将 Figma 设计转换为代码的问题。通过提供结构化的 Figma 布局数据（例如元素层级、样式属性、组件关系等），Figma-Context-MCP 极大地提高了 AI 的“一次性”准确率，使生成的代码更接近原始设计意图。

### Github 地址

![Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP/)

## 实践：使用 Cursor 和 Figma-Context-MCP 重现设计

### 1. Figma 中配置一个 token

+ 通过以下截图步骤生成一个 token ，注意设置权限的时候，可以全部设置为 read-only
![figma setting 01](/assets/fullstack/figma-mcp/figma-setting-01.png)

![figma setting 02](/assets/fullstack/figma-mcp/figma-setting-02.png)

![figma setting 03](/assets/fullstack/figma-mcp/figma-setting-03.webp)

+ 注意：如果是怕该 token 泄露，可以设置为本机的环境变量，如果不怕泄露，就直接设置也行

### 2. 全局安装 Figma-Context-MCP

+ 安装 node.js  (v16.0 or higher)
+ 安装 npm (v7.0 or higher) or pnpm (v8.0 or higher)
+ 全局安装 Figma-Context-MCP

``` shell
npm install -g figma-developer-mcp
```

### 2. Cursor 中配置 Figma Context MCP 服务器

+ 按官方文档的示例给 Cursor 配置 Figma Context MCP 服务器

``` shell
# 注意：YOUR-KEY 替换为你自己的 figma token
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

+ 安装成功后的截图，能看到其中提供2个 tools
<img src="../assets/web/figma-mcp/cursor-add-mcp-01.png" alt="add mcp" class="content-image" />

### 3. 在 Figma 桌面 App 中选择

+ 本地先打开 Figma 桌面 App，因为本质上 Figma-Context-MCP 是需要去连接这个桌面 App 的
+ Figma 桌面 App 中, 选择目标 frame, 鼠标右键点击, 选择 "Copy link to selection"

![select in figma](/assets/fullstack/figma-mcp/figma-select.png)

### 4. 在 Cursor 中告诉 AI 根据设计稿实现代码

+ 提示词里要清晰明确让它意识到要去调用这个 figma 的 MCP

```plaintext
@https://www.figma.com/design/bNc1sc9VLFjumKp1SpRR14/mini02?node-id=1-2&t=8mB8G0cLD046OKcF-4 请根据这个 figma 设计稿，检查我们的首页，是否符合设计稿的要求
```

+ 从它的响应来看，它已经正确连接上了 Figma，并能在合适的时机去调用这个 MCP 中提供的2个 tools
![cursor prompt](/assets/fullstack/figma-mcp/cursor-prompt.png)
