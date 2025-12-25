当然可以！以下是一份**完整的开发部署文档**，专为你的 VitePress 项目（分支 `v2`）定制，涵盖了从构建到 GitHub Pages 部署的全部关键配置和踩坑解决方案，适合长期保存和团队参考。

---

# 📄 VitePress 项目 GitHub Pages 部署指南

> 项目仓库：`johnyu2023/publish`  
> 文档源分支：`v2`  
> 静态站点地址：`https://johnyu2023.github.io/publish/`  
> 最后更新：2025-12-18

---

## ✅ 1. 项目结构

```bash
publish/
├── docs/                     # Markdown 源文件目录
│   ├── .vitepress/config.js  # VitePress 配置
│   └── ...                   # 各类 .md 文档
├── package.json              # 构建脚本定义
├── pnpm-lock.yaml
└── .github/workflows/deploy.yml  # GitHub Actions 部署配置
```

---

## ✅ 2. 本地构建命令

### 构建脚本（推荐使用 Node API 避免 Windows 进程挂起）

创建 `build.mjs`：

```js
// build.mjs
import { build } from 'vitepress';

console.log('Starting VitePress build...');
await build('docs'); // 指定文档目录
console.log('Build completed successfully.');
process.exit(0); // 强制退出，解决 Windows 下进程不退出问题
```

更新 `package.json`：

```json
{
  "scripts": {
    "build": "node build.mjs"
  }
}
```

> ✅ **优势**：绕过 CLI 层，确保进程干净退出，解决本地和 CI 卡住问题。

---

## ✅ 3. GitHub Actions 部署配置

文件路径：`.github/workflows/deploy.yml`

```yaml
name: Deploy VitePress site to GitHub Pages

on:
  push:
    branches: [v2]  # 仅监听 v2 分支

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # ⚠️ 必须显式声明写权限，否则 403

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v3
        with:
          version: 9.x

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: node build.mjs  # 使用自定义构建脚本

      - name: Debug - verify dist
        run: |
          ls -la ./docs/.vitepress/dist
          echo "File count: $(find ./docs/.vitepress/dist -type f | wc -l)"

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
```

---

## ✅ 4. GitHub Pages 仓库设置（关键！）

### 步骤（必须手动操作一次）

1. 进入仓库 → **Settings → Pages**
2. 在 **Source** 区域：
   - **选择 “Deploy from a branch”**
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. **点击 Save**

> 📌 注意：不要选择 “GitHub Pages Jekyll” 或 “Static HTML” 模式，否则会忽略你的 `gh-pages` 分支内容。

---

## ⚠️ 5. 常见问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| **本地构建后终端卡住** | Node.js 事件循环未清空（Windows 常见） | 使用 `build.mjs` + `process.exit(0)` |
| **Action 卡在 Build 步骤** | 进程未退出，后续步骤被阻塞 | 同上，确保强制退出 |
| **403 Permission denied** | 缺少 `contents: write` 权限 | 在 job 中添加 `permissions: { contents: write }` |
| **Pages 显示旧内容** | GitHub 使用了内置部署流程 | **手动在 Settings → Pages 中选择 `gh-pages` 分支** |
| **Mermaid 导致构建挂起** | SSR 时执行了 mermaid 初始化 | 改用 `<ClientOnly>` + 动态导入，避免 SSR 执行 |

---

## ✅ 6. 验证部署成功

1. 修改任意 Markdown 文件（如首页加 “TEST 2025-12-18”）；
2. 提交并推送到 `v2` 分支；
3. 等待 GitHub Actions 成功完成；
4. 访问 `https://johnyu2023.github.io/publish/`；
5. 确认新内容已更新。

---

## 📦 7. 依赖说明

- **Node.js**: v20+
- **包管理器**: pnpm
- **VitePress**: v1.6.4（稳定版，不建议盲目升级 alpha）
- **部署 Action**: `peaceiris/actions-gh-pages@v4`

---

## 🔄 8. 后续维护建议

- **不要升级 VitePress 至 2.0 alpha**，除非正式版发布；
- **避免在 Markdown 中写未闭合 HTML 标签**（会触发 Vue 编译错误）；
- **Mermaid 图表务必用 `<ClientOnly>` 包裹**，防止 SSR 挂起；
- **定期清理无用分支和 Actions 日志**，节省 GitHub 配额。

---

> 🎉 本配置已在 `johnyu2023/publish` 项目中验证通过，可稳定自动部署。

---

**保存建议**：将本文档保存为 `DEPLOY.md` 或 `docs/deploy-guide.md`，纳入项目版本管理。

如需进一步自动化（如 PR 预览、定时部署），可扩展 `on.workflow_dispatch` 或 `on.schedule`。

---

祝你开发顺利！如有更新，记得同步此文档。
