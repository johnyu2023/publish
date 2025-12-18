# 构建项目

1. 使用 pnpm 构建一个web项目
2. 采用 vitepress 构建文档

## 

1. 我想定制首页、内容页
2. 加一篇内容页的示意文章，你帮我找个位置创建一篇，我看看效果
3. 首页我想要在默认的基础上放一个实验性的定制化的 VUE 组件，你帮我实现一个
4. 我就是想先看看效果，评估一下

如果我文章很多很多，分布在几个不同目录下：
ai - 人工智能
foundation - 基础知识
fullstack - 全栈开发
think - 观察思考
other - 技术文档
我该怎么在首页展示这几个分类，在文章的侧边栏该怎么展示。
你试着生成这5个文件夹，各放一篇文章，我看看效果

##

访问 <http://localhost:5173/publish/ai/future-of-ai.html>
右侧大纲区域可以配置展示更多层级的结构吗？

## 提交

一个 vitepress 项目，目前源代码在分支 v2 上。我能直接通过配置在 github pages 上展示吗？

##

分析 mermaid 图表的显示策略，我们是否能做进一步定制：
对于文档中的 mermaid 图表 图表，我们是否点击后弹框，在弹框UI中将之放大到适合弹框的大小或者屏幕的大小，可能性如何

对于文档中的 mermaid 图表，支持点击弹框显示功能：

1. 弹框宽度和高度可配置，默认值为 95% 宽度和 95% 高度。
2. 弹框中显示的 mermaid 图表内容进行放大。
3. 弹框中的 mermaid 图表内容支持鼠标滚轴缩放，鼠标拖拽移动。

对于文档中的 mermaid 图表，点击后弹框显示。弹框中显示的图表内容可通过鼠标滚轴缩放，问题在于缩小后原来看不到的部分现在还是空白，所以它只是可见区域的缩放，而不是全体的缩放。

访问： <http://localhost:5173/publish/test-mermaid-modal>
能看到只有第一个（流程图示例（默认尺寸））的 mermaid 图正常显示了。后面几个图都只能显示一段文本。这些有问题的图是属于下列章节的：
序列图示例（自定义尺寸 80% x 70%）
甘特图示例（自定义尺寸 90% x 85%）
复杂流程图示例（自定义尺寸 95% x 90%）

## 新需求

我想实现以下需求：

1. 部分文章可以在 md 文档头部插入一段标记，表达 标题、描述、发布日期、tag 等信息。
2. 这些信息可以在文章头部进行展示，最好能按我期望的格式展示（一个vue组件，后续可能要调整这些信息的展示方式，初期简单显示即可）
3. 能有个python程序，自动读取所有文章的头部信息，将其提取出来，生成一个 json 文件，后续可以在其他 vue 组件中读取这个 json 文件，展示一些聚合信息。

有什么合适的技术方案

docs\ai\future-of-ai.md 这篇 md 文档已插入 YAML frontmatter 的头部信息
如果这个页面想要能展示这些信息，要怎么办

访问 <http://localhost:5173/publish/ai/future-of-ai.html，页面空白，控制台报错>
[Vue warn]: Unhandled error during execution of setup function
  at <ArticleMeta>
  at <Ai/futureOfAi.md onVnodeMounted=fn<runCbs> onVnodeUpdated=fn<runCbs> onVnodeUnmounted=fn<runCbs> >
  at <VitePressContent class="vp-doc _publish_ai_future-of-ai" >
  at <VPDoc key=4 >
  at <VPContent>
  at <Layout>
  at <LayoutWrapper>
  at <VitePressApp>
warn$1 @ runtime-core.esm-bundler.js:51
ArticleMeta.vue:25 Uncaught (in promise) ReferenceError: computed is not defined
    at setup (ArticleMeta.vue:25:21)
    at callWithErrorHandling (runtime-core.esm-bundler.js:199:19)
    at setupStatefulComponent (runtime-core.esm-bundler.js:8014:25)
    at setupComponent (runtime-core.esm-bundler.js:7976:36)
    at mountComponent (runtime-core.esm-bundler.js:5929:7)
    at processComponent (runtime-core.esm-bundler.js:5895:9)
    at patch (runtime-core.esm-bundler.js:5401:11)
    at mountChildren (runtime-core.esm-bundler.js:5645:7)
    at mountElement (runtime-core.esm-bundler.js:5568:7)
    at processElement (runtime-core.esm-bundler.js:5523:7)

    每个需要用这个组件的 md 文件都需要显式地在文件头部引入这个组件，如下写法：

```html
<script setup>
import ArticleMeta from '../../.vitepress/components/ArticleMeta.vue'
</script>

<ArticleMeta />
```

能否改成更友好的，如：

```markdown
---
title: LLM 的训练
description: LLM 都是如何训练出来的
date: 2025-12-05
tags: [LLM，训练]
---

::: blog-post
这里是正文内容
:::
```

## 创建新的 Vue 组件

ArticleMeta 组件外观修改一下，展示的信息包括：标题、描述、发布日期、tag 等。
希望这些信息放在一个带有灰色背景的 div 中，每个信息项占一行。

##

帮我在 docs\ai\future-of-ai.md 中加入一个图片的显示，要求用到你刚刚的 vue 组件 。图片地址是：
docs\assets\ai\test\fight.png

vitepress 项目，如果想对于文章中的图片做额外的处理。
1. 点击图片，弹出一个弹框，弹框区域大概是屏幕的 95% 宽度和 95% 高度。
2. 弹框中可以用鼠标滚轴对图片进行缩放、鼠标拖拽移动等操作。
要怎么优雅地实现它，考虑到写文章的变量性，有哪些技术方案可以考虑？


vitepress 项目，如果想对于文章中的 yaml frontmatter 做额外的显示处理。
有什么比较优雅的方案
