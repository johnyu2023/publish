
## 项目配置文件
docs-source\.vitepress\config.ts

## 下一步操作（本地执行后提交）：

安装依赖：npm i
生产构建：npm run docs:build:prod
将构建产物同步到你线上使用的目录：
如果线上访问路径是 https://johnyu2023.github.io/publish/，请把 docs-source/.vitepress/dist 全量拷贝到仓库根目录的 publish 文件夹并提交。
当前 npm run deploy 会拷贝到 docs 目录，若保留此脚本则对应的访问路径应改为 https://johnyu2023.github.io/docs/。建议新增一个拷贝到 publish 的脚本或手动复制一次，保持与你的线上路径一致。
验证：

打开 https://johnyu2023.github.io/publish/，检查网络面板，资源应以 /publish/... 开头且返回 200。


## 部署

### github Pages 设置
+  github 仓库设置中选择了 “Deploy from a branch”，并指定从 main 分支的 docs 目录进行部署。

### github Action 自动部署
Github 系统默认行为：当用户选择“从分支部署”时，GitHub 会使用其内部的、不可见的构建系统来处理部署。这个系统会：
* 监听您指定的分支（main）上的推送。
* 当检测到 docs 目录有更新时，自动触发构建。
* 对于纯静态网站（HTML, CSS, JS），它通常只是直接发布 docs 目录下的文件。
* 对于使用 Jekyll 的项目，它会自动运行 Jekyll 构建过程。

### 项目在本地的操作
+ 进行生产环境的构建，将最终生成的静态文件（如 index.html）放入 main 分支的 docs 目录
+ 推送所有文件到 main 分支，触发自动部署

### 执行 script
本地开发：npm run docs:dev
构建并部署：npm run deploy
推送到 GitHub：git add . && git commit -m "更新博客" && git push
如果你想清理旧的构建产物，可以运行 npm run clean。



如果你想继续添加新博客，只需要：
在 docs-source 目录下创建新的 Markdown 文件
在 VitePress 配置文件中添加新博客的链接
在 RSS 文件中添加新博客的信息
执行部署脚本，重新构建项目并部署
提交并推送更改到 GitHub 仓库

如果您想在未来添加新文章，只需要：

在文章开头添加 frontmatter（包含日期、标题和描述）
运行 node update-index.js 脚本来自动更新首页的文章列表

# 目录问题

参考 @spec.md 中的 ## 7. BlogPost 组件替代方案 这个部分。我们这个方案里，缺失一个功能，那就是博客文章内的章节功能。请修复此问题。
可以参考 BlogPost 组件的实现，实现添加一个章节列表的功能

章节列表功能确实实现了，但是希望在显示上做一些修改：
1. 章节列表区域应悬浮在页面，而不是只在文章顶部。当文章滚动浏览时，章节列表应保持在页面的固定位置，不随文章滚动而移动。
2. 章节列表区域应放在屏幕的右上方。
3. 章节列表区域内容默认应该是展开的，现在却是默认收缩的。


章节列表区域 里加一个小图标吧，点击可以实现展开/收起的功能

D:\2024-code\publish\docs-source\.vitepress\components\VPCustomContainer.vue 里有个 章节列表区域 ，外观上做些修改，变得宽一些。顺便检查它的数据来源，能支持到几级标题的显示。


### 优化章节列表区域的显示

D:\2024-code\publish\docs-source\.vitepress\components\VPCustomContainer.vue 里有个 章节列表区域 ，外观上做些修改。
由于章节数据可能会很多，所以希望能用一个树状结构来显示，这样可以很方便地展开或收缩某个节点。

现在有树状结构了，但节点无法收缩或展开，点击后无反应。不过点击节点的标题，会跳转到对应的位置。