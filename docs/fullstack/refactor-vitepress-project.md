---
title: 重构 Vitepress 项目
description: 重构 Vitepress 项目心得：使用稳定版 v1.6.4，pnpm 管理依赖，文章放 docs 目录，静态资源放 docs/public。通过自定义脚本生成文章索引、搜索功能和导航配置，实现自动化部署到 GitHub Pages。采用 MiniSearch 实现前端搜索，配置分类和动态数据展示。
date: 2025-12-22
tags: [Vitepress, SSG]
---

<img src="/assets/fullstack/refactor-vitepress/future.webp" width="600" alt="无尽的坑" />

## vitepress 版本

+ `v1.6.4`是当前最稳定的正式版本，推荐使用。
+ `v2.0.0`还不是正式版本，不建议使用。

## 使用 pnpm 管理依赖

+ 这是因为 `pnpm` 有更好的性能和磁盘空间利用率

## 文章放在哪里

> `docs`

+ 官方推荐且默认的做法是**将 Markdown 内容文件（即文档）放在 `docs` 目录下**。
  + 这是 VitePress 的标准约定，`docs` 被视为站点的“项目根目录”，而 `.vitepress` 目录（包含配置、主题、构建输出等）则位于 `docs` 内部或与其同级，取决于项目结构 。
+ 使用 `docs-source`（或其他如 `src`, `content` 等）通常不是 VitePress 官方规范，而是出于以下原因的**自定义实践**：
  + 构建流程需要 - 某些项目希望将“源文档”和“构建产物”分离
  + 多语言/多版本文档管理 - 为了更清晰的结构，将源内容单独隔离。
  + 与 CI/CD 或其他工具集成 - 例如先对 `docs-source` 做预处理（翻译、校验、注入元数据等），再复制/转换到 VitePress 能识别的目录。

## GitHub Pages 自动部署

> 一提交代码，网站就自动更新

+ GitHub Pages - GitHub 提供的静态网站托管服务，免费！
+ GitHub Actions - GitHub 提供的自动化服务，用于在代码变更时自动触发构建和部署
+ `.github/workflows/deploy.yml` -  GitHub Actions 的配置文件，用于定义自动部署流程。
+ deploy.yml 的作用：
  + 每当你把代码推（push）到 GitHub 仓库  
  + GitHub Actions 会自动运行这个脚本  
  + 脚本会：
     ✅ 安装依赖  
     ✅ 构建你的 VitePress 站点（生成静态文件，输出到 `docs/.vitepress/dist`）  
     ✅ 把这些生成的文件 **自动推送到你仓库的 `gh-pages` 分支**

+ GitHub Pages 中的设置 - “用 `gh-pages` 分支的内容当作网站” → 这样 GitHub Pages 就会托管你的网站。
![github pages 设置](/assets/fullstack/refactor-vitepress/github-pages.png)

+ GitHub Actions - 会在每次你推（push）代码时自动运行 `deploy.yml` 脚本，将构建好的静态文件推送到 `gh-pages` 分支。
![github actions 设置](/assets/fullstack/refactor-vitepress/github-actions.png)

## 静态资源放在哪里

> `docs/public`

+ VitePress 默认以 `docs` 作为项目“根目录”（也就是你的 Markdown 文件所在的地方）。  
+ VitePress 基于 **Vite** 构建系统，Vite 规定：**`public` 目录下的文件会被直接复制到最终输出目录（`dist`）的根路径**，不做任何打包或哈希处理。

```plaintext
一个文件：docs/public/logo.png
构建后，它会出现在：docs/.vitepress/dist/logo.png
在网站中访问路径就是：/logo.png
```

+ 注意：Markdown 或 Vue 组件中通过**相对路径**引用的图片（比如 `![img](./img.png)`）→ 这类图片应和 Markdown 文件放在一起，Vite 会自动处理它们（可能转为 base64 或带 hash 的文件名）。

## 所有文章信息汇总

### yaml frontmatter

+ 每个 Markdown 文件的顶部都有一个 yaml 格式的 frontmatter，用于定义文章的元数据。

``` yaml
---
title: 重构 Vitepress 项目
description: 在重构 Vitepress 项目时的一些心得
date: 2025-12-22
tags: [Vitepress]
---
```

### `docs\public\data\all-articles.json`

+ 这个文件包含了所有文章的元数据（如标题、描述、日期、标签等），是后续一系列功能的基础。
+ 每次构建时，我们的脚本会遍历 `docs` 目录下的所有 Markdown 文件，提取它们的 yaml frontmatter 并生成这个 JSON 文件。

## 所有文章信息的检索索引

### `docs\public\data\search-index.json`

+ 文章数量急剧增加后，需要提供搜索功能。但 vitepress 项目是纯前端项目，没有后端支持，所以搜索必须在前端实现。
+ 搜索索引文件 `search-index.json` 包含了所有文章的标题、描述、标签等信息，它是前端搜索的“数据库“。
+ 基于 MiniSearch 这个轻量、高性能、支持相关性排序的前端全文搜索引擎库，我们可以在前端实现搜索功能。
+ 在构建时，我们的脚本会根据 `docs\public\data\all-articles.json` 生成 `search-index.json` 文件。
+ 注意：构建索引和加载索引时使用完全相同的 tokenize 和 processTerm 函数，否则会导致搜索结果找不到。

### MiniSearch 库

> MiniSearch 是一个 **轻量、高性能、支持相关性排序的前端全文搜索引擎库**。

> **MiniSearch 的价值 = 用 10 行配置代码，换取专业级搜索体验，避免重复造轮子。**

+ MiniSearch 和手写方案相比能解决哪些问题

| 问题 | 手写方案 | MiniSearch 方案 |
|------|--------|----------------|
| **1. 分词（Tokenization）** | 需自己写正则切分中文/英文 | 内置智能分词器，支持中文（需配合 `jieba` 或自定义） |
| **2. 模糊匹配（Fuzzy Search）** | 需实现编辑距离算法（如 Levenshtein） | 一行配置开启 `fuzzy: true` |
| **3. 相关性排序（Relevance Ranking）** | 需实现 TF-IDF / BM25 算法 | 默认使用 BM25，自动按匹配度排序 |
| **4. 多字段权重** | 需手动给 title > tags > description 加权 | 配置 `boost` 即可（如 `title: 3, tags: 1`） |
| **5. 前缀搜索 / 自动补全** | 需额外构建前缀树（Trie） | 支持 `prefix: true` |
| **6. 索引压缩与性能** | JSON 遍历 O(n) 慢 | 倒排索引 + 优化结构，万级文档仍流畅 |

+ MiniSearch 和手写方案相比，是最佳实践

| 对比项 | 手写搜索 | MiniSearch |
|--------|--------|-----------|
| 开发速度 | 快（初期） | 快（有成熟方案） |
| 功能完整性 | 弱 | 强 |
| 中文支持 | 差（需额外处理） | 可配合分词器 |
| 可维护性 | 低（逻辑分散） | 高（封装良好） |
| 用户体验 | 一般 | 优秀 |

## 栏目的静态和动态配置

### 静态配置

+ `docs\public\data\categories.json`，放在公开目录下是为了便于调试
+ 静态配置只是供其他脚本程序参考的，不被项目直接调用
+ 本项目一共有4个分类目录，它们的信息都定义在配置文件中

```json
{
  "categories": {
    "ai": {
      "name": "人工智能",
      "description": "关于人工智能的文章",
      "icon": "🤖",
      "order": 1,
      "color": "#3eaf7c",
      "enabled": true
    },
    "foundation": {
      "name": "基础知识",
      "description": "不积跬步无以至千里",
      "icon": "📘",
      "order": 2,
      "color": "#476582",
      "enabled": true
    },
    "fullstack": {
      "name": "全栈开发",
      "description": "全栈开发势不可挡",
      "icon": "💻",
      "order": 3,
      "color": "#f5a623",
      "enabled": true
    },
    "think": {
      "name": "观察思考",
      "description": "洞察未来的趋势",
      "icon": "💭",
      "order": 4,
      "color": "#d35400",
      "enabled": true
    }
  }
}
```

### 动态配置

+ `docs\public\data\blog-data.json`，放在公开目录下是为了便于调试
+ 每次构建时，动态配置是基于`docs\public\data\all-articles.json`，结合静态配置，动态生成每个分类目录的信息。
+ 包含：每个分类名称、描述、图标、顺序、文章数量、最新文章（url、标题、日期、标签、描述），最新的10篇文章（url、标题、日期、标签、描述），总文章数

```json
{
  "categories": {
    "ai": {
      "name": "人工智能",
      "description": "关于人工智能的文章",
      "count": 2,
      "latestArticle": {
        "url": "/ai/future-of-ai",
        "title": "人工智能的未来发展",
        "date": "2025-12-20",
        "tags": [
          "AI",
          "未来科技"
        ],
        "description": "这是一篇测试文档"
      }
    },
    "foundation": {
      ...
      }
    },
    "fullstack": {
      ...
      }
    },
    "think": {
      ...
      }
    }
  },
  "latestArticles": [
    {
      "category": "fullstack",
      "categoryName": "全栈开发",
      "title": "重构 Vitepress 项目",
      "date": "2025-12-22",
      "url": "/fullstack/refactor-vitepress-project"
    },
    {
      "category": "foundation",
      "categoryName": "基础知识",
      "title": "计算机基础知识",
      "date": "2025-12-21",
      "url": "/foundation/data-structure"
    },
    ...
  ],
  "totalArticles": 28,
  "generatedAt": "2025-12-22T13:39:38.165Z"
}
```

## 顶部导航信息配置

### 导航信息的静态配置

+ `docs\data\nav-static.json`，被脚本调用的，不被项目直接调用
+ 是`scripts\nav-config.json`的内容，被脚本直接复制到这里的，不做任何修改
+ 定义了固定的导航项，包括首页、搜索、关于
+ 根据 order 字段排序，留出后续的灵活性

```json
[
  {
    "text": "首页",
    "link": "/",
    "order": 1,
    "type": "static"
  },
  {
    "text": "搜索",
    "link": "/search.html",
    "order": 25,
    "type": "static"
  },
  {
    "text": "关于",
    "link": "/about",
    "order": 99,
    "type": "static"
  }
]
```

### 导航信息的动态配置

+ `docs\data\nav-dynamic.json`，被脚本调用的，不被项目直接调用
+ 根据`docs\public\data\blog-data.json`动态生成
+ 定义了每个分类的名称、最新文章链接
+ 根据 order 字段排序（相同的order，按配置文件中的先后排序），留出后续的灵活性

```json
[
  {
    "text": "人工智能",
    "link": "/ai/future-of-ai",
    "category": "ai",
    "description": "关于人工智能的文章",
    "count": 2,
    "order": 50,
    "type": "dynamic"
  },
  {
    "text": "基础知识",
    "link": "/foundation/data-structure",
    "category": "foundation",
    "description": "不积跬步无以至千里",
    "count": 2,
    "order": 50,
    "type": "dynamic"
  },
  {
    "text": "全栈开发",
    "link": "/fullstack/ai-images-01",
    "category": "fullstack",
    "description": "全栈开发势不可挡",
    "count": 12,
    "order": 50,
    "type": "dynamic"
  },
  {
    "text": "观察思考",
    "link": "/think/ai-coding-03",
    "category": "think",
    "description": "洞察未来的趋势",
    "count": 8,
    "order": 50,
    "type": "dynamic"
  }
]
```

### 导航信息的最终合并配置

+ `docs\data\nav-data.json`，供`docs\.vitepress\config.js`同步读取（`fs.readFileSync(navDataPath, 'utf8')`）的
+ 内容是合并了静态配置和动态配置，并按 order 字段排序
+ 定义了每个导航 item 的名称、链接

## 编译脚本说明

### `build:prepare` 命令

+ 命令入口是 `scripts\build-prepare.mjs`
+ 在执行 pnpm dev 或 pnpm build 之前，必须先执行 build:prepare 命令，生成一系列 json 文件
+ 它包含了一系列子命令的调用，必须严格遵守先后顺序

```javascript
    await executeScript('./generate-all-articles.mjs', [DATA_DIR]);
    await executeScript('./generate-blog-data.mjs', [DATA_DIR]);
    await executeScript('./generate-nav-static.mjs', [DATA_DIR]);
    await executeScript('./generate-nav-dynamic.mjs', [DATA_DIR]);
    await executeScript('./merge-nav-data.mjs', [DATA_DIR]);
    await executeScript('./build-search-index.mjs', [DATA_DIR]);
```

### 生成所有文章的汇总信息

+ `scripts\generate-all-articles.mjs` -> `docs\public\data\all-articles.json`

### 生成每个分类下文章信息

+ `scripts\generate-blog-data.mjs` -> `docs\public\data\blog-data.json`

### 生成导航信息

+ 静态信息 - `scripts\generate-nav-static.mjs` -> `docs\data\nav-static.json`
+ 动态信息 - `scripts\generate-nav-dynamic.mjs` -> `docs\data\nav-dynamic.json`
+ 合并汇总 - `scripts\merge-nav-data.mjs` -> `docs\data\nav-data.json`

### 生成检索索引

+ `scripts\build-search-index.mjs` -> `docs\public\data\search-index.json`

## 自定义组件

### 组件关系概述

+ LayoutWrapper 是主要布局组件，负责整合其他组件
+ CategoryGrid 和 RecentArticles 展示内容组织，ArticleItem 作为内容展示的基础单元
+ Modal 和其触发器负责交互体验
+ Mermaid 组件提供技术图表支持

### 主题组件（位于 docs/.vitepress/theme/）

+ LayoutWrapper.vue
  + 位置：docs/.vitepress/theme/LayoutWrapper.vue
  + 用途：VitePress 默认布局的包装器，用于在文档内容前插入 frontmatter
       信息（如标题、描述、作者、发布日期、标签、摘要等）

+ SearchView.vue
  + 位置：docs/.vitepress/theme/SearchView.vue
  + 用途：全文搜索视图组件，使用 MiniSearch 实现站内搜索功能，支持模糊搜索和关键词高亮

### 可复用组件（位于 docs/.vitepress/theme/components/）

+ Modal.vue
  + 位置：docs/.vitepress/theme/components/Modal.vue
  + 用途：模态框组件，提供可关闭的浮层，用于展示额外内容

+ ArticleItem.vue
  + 位置：docs/.vitepress/theme/components/ArticleItem.vue
  + 用途：文章列表项组件，展示单篇文章的基本信息（类别、日期、标题），支持点击跳转

+ CategoryGrid.vue
  + 位置：docs/.vitepress/theme/components/CategoryGrid.vue
  + 用途：分类网格组件，按照类别展示文章统计，包括每个分类的最新文章和文章总数

+ Mermaid.vue
  + 位置：docs/.vitepress/theme/components/Mermaid.vue
  + 用途：流程图渲染组件，支持 Mermaid
       图表（如流程图、序列图、甘特图），具有缩放和平移功能，并可在点击时放大查看

+ MyCustomComponent.vue
  + 位置：docs/.vitepress/theme/components/MyCustomComponent.vue
  + 用途：实验性 Vue 组件，演示了如何在 VitePress 中集成 Vue 功能，包含计数器和颜色切换功能

+ NavModalTrigger.vue
  + 位置：docs/.vitepress/theme/components/NavModalTrigger.vue
  + 用途：导航模态框触发器组件，点击后触发打开导航模态框事件

+ RecentArticles.vue
  + 位置：docs/.vitepress/theme/components/RecentArticles.vue
  + 用途：最新文章列表组件，展示最近发布的文章，利用 ArticleItem 组件展示每篇文档

+ VueDemo.vue
  + 位置：docs/.vitepress/theme/components/VueDemo.vue
  + 用途：Vue 功能演示组件，展示了多种 Vue 功能，包括响应式数据绑定、v-model、复选框组、动态样式和进度条

## 经验教训

+ 放弃对文章进行进一步扩展，太复杂，效果差
+ 放弃对样式的进一步定制，太复杂，无法生效
+ 放弃侧边栏的深度定制，太负责，性价比低
+ 放弃高级导航定制，太复杂，无法实现预期效果
+ 放弃对文章头部的进一步定制，太复杂，无法生效
+ 放弃对图片的进一步功能扩展，改成点击弹框放大显示，支持鼠标滚轮缩放，鼠标拖拽移动
+ 放弃对 Mermaid 组件的深度定制，改成点击弹框放大显示，支持鼠标滚轮缩放，鼠标拖拽移动
