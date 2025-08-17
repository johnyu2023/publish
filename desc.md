
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





