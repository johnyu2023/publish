# publish2 项目开发文档

## 项目结构

```
publish2/
├── docs/                     # VitePress 源文件主目录
│   ├── .vitepress/           # VitePress 配置目录
│   │   ├── config.js         # 主要配置文件
│   │   └── theme/            # 自定义主题目录
│   │       ├── index.js      # 主题入口文件
│   │       ├── LayoutWrapper.vue # 自定义布局
│   │       └── components/   # 自定义 Vue 组件
│   │           ├── Modal.vue
│   │           ├── NavModalTrigger.vue
│   │           ├── MyCustomComponent.vue
│   │           └── VueDemo.vue
│   ├── ai/                   # 人工智能分类
│   │   └── future-of-ai.md
│   ├── foundation/           # 基础知识分类
│   │   └── data-structure.md
│   ├── fullstack/            # 全栈开发分类
│   │   └── fullstack-guide.md
│   ├── think/                # 观察思考分类
│   │   └── trends-analysis.md
│   ├── other/                # 技术文档分类
│   │   └── api-documentation.md
│   ├── index.md              # 首页
│   ├── sample-article.md     # 示例文章
│   ├── experiments.md        # 实验页面
│   ├── about.md              # 关于页面
│   └── CategoryGrid.vue      # 首页分类网格组件
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 自动部署配置
├── package.json             # 项目配置文件
├── pnpm-lock.yaml          # 依赖锁定文件
└── desc-v2.md              # 项目描述文件
```

## 文章目录

所有 Markdown 文章都保存在 `docs/` 目录下，按分类组织：

- `docs/ai/` - 人工智能相关文章
- `docs/foundation/` - 基础知识相关文章  
- `docs/fullstack/` - 全栈开发相关文章
- `docs/think/` - 观察思考相关文章
- `docs/other/` - 技术文档相关文章
- `docs/*.md` - 根目录下的通用页面（首页、示例、关于等）

## 本地编译目标

### 1. 开发模式 (开发服务器)
命令：`pnpm dev`
- 实时编译源文件
- 支持热重载
- 本地预览：http://localhost:5173
- 适合开发和调试

### 2. 生产构建 (静态文件)
命令：`pnpm build`
- 生成静态文件到 `docs/.vitepress/dist/`
- 优化资源加载
- 适合部署到生产环境

### 3. 本地预览 (生产构建预览)
命令：`pnpm serve`
- 预览 `docs/.vitepress/dist/` 中的构建结果
- 模拟生产环境

## GitHub 自动构建机制

### 工作流程文件
- 位置：`.github/workflows/deploy.yml`
- 触发条件：推送至 main 分支时

### 自动构建流程
1. 检出 main 分支代码
2. 安装 Node.js 和 pnpm
3. 执行 `pnpm install` 安装依赖
4. 执行 `pnpm build` 构建静态文件
5. 将 `docs/.vitepress/dist` 目录内容推送到 `gh-pages` 分支
6. GitHub Pages 自动从 `gh-pages` 分支部署网站

### 部署地址
- 访问地址：`https://<username>.github.io/<repository>/`
- 例如：`https://username.github.io/publish2/`

### 配置要点
- `base: '/publish2/'` - 在 config.js 中配置基础路径
- `publish_dir: ./docs/.vitepress/dist` - 指定要部署的目录
- `publish_branch: gh-pages` - 指定部署到的分支

## 项目特点

1. **高度定制化**：支持 Vue 组件和自定义主题
2. **分类管理**：使用多目录结构管理不同类型文章
3. **动态侧边栏**：不同分类有各自独立的侧边栏
4. **交互功能**：支持页面内的 Vue 组件交互
5. **自动化部署**：修改源码后自动构建和部署