---
title: Python 使用基础
description: Python 使用过程中一些值得记录的内容
date: 2025-06-01
tags: [Python]
---

<BlogPost>

## Python 虚拟环境

> **强烈建议在虚拟环境中安装！** 这是 Python 开发的最佳实践

### 为什么推荐使用虚拟环境？

#### 1. **依赖隔离**

- 每个项目可以有自己独立的包版本
- 避免不同项目之间的包版本冲突
- 例如：项目A需要 Django 3.2，项目B需要 Django 4.1

#### 2. **避免污染系统环境**

- 不会修改系统级别的 Python 包
- 防止意外破坏系统工具（很多 Linux 系统工具依赖特定版本的 Python 包）

#### 3. **便于项目管理**

- 可以清晰知道每个项目依赖哪些包
- 方便生成 `requirements.txt`
- 便于团队协作和部署

### 如何创建和使用虚拟环境？

#### 使用内置的 `venv`（推荐）

```bash
# 创建虚拟环境
python -m venv myproject_env

# 激活虚拟环境
# Windows:
myproject_env\Scripts\activate
# macOS/Linux:
source myproject_env/bin/activate

# 现在安装包（会安装到虚拟环境中）
pip install 你的包名

# 退出虚拟环境
deactivate
```

#### 使用 `conda`（如果你用 Anaconda/Miniconda）

```bash
# 创建环境
conda create -n myproject python=3.9

# 激活环境
conda activate myproject

# 安装包
pip install 你的包名

# 退出环境
conda deactivate
```

### 什么时候可以不用虚拟环境？

- 临时测试某个包的功能
- 安装全局工具（如 `black`, `flake8` 等代码格式化/检查工具）
- 确定不会与其他项目产生冲突的简单脚本

## Python 虚拟环境本质是一个目录

### 虚拟环境的位置

**`stock_env` 是在当前目录下创建的一个文件夹**，不是全局的。

```bash
# 如果你在 /home/user/myproject 目录下执行
python -m venv stock_env

# 那么会创建
/home/user/myproject/stock_env/
```

这个文件夹包含：

- Python 解释器的副本（或符号链接）
- 独立的 `site-packages` 目录（存放安装的包）
- pip、activate 脚本等工具

### 不同项目的虚拟环境可以同名吗？

**完全可以！** 因为它们是**不同路径下的不同文件夹**。

```bash
# 项目1
/home/user/project_a/stock_env/

# 项目2  
/home/user/project_b/stock_env/

# 这是两个完全独立的虚拟环境，互不影响
```

### 实际使用建议

虽然可以同名，但**建议使用有意义的名称**：

```bash
# 更好的命名方式
python -m venv myproject_env          # 通用
python -m venv .venv                  # 隐藏文件夹，很多开发者喜欢
python -m venv venv                   # 简短通用

# 或者直接用项目名
python -m venv trading-bot
python -m venv data-analysis
```

### 虚拟环境的管理技巧

#### 1. **通常将虚拟环境放在项目根目录**

```
my_project/
├── stock_env/           # 虚拟环境
├── src/
├── requirements.txt
└── README.md
```

#### 2. **记得添加到 .gitignore**

```gitignore
# .gitignore
stock_env/
venv/
.env/
__pycache__/
```

#### 3. **激活时注意路径**

```bash
# 必须在虚拟环境所在目录或使用完整路径
source ./stock_env/bin/activate    # Linux/macOS
# 或
source /full/path/to/stock_env/bin/activate
```

## 虚拟环境的空间占用问题

**实际情况：**

- 虚拟环境确实会在每个项目目录下创建独立的依赖库
- 但现代 Python 虚拟环境（如 venv、conda）会使用**符号链接**或**硬链接**来减少重复文件
- 相同版本的包在不同虚拟环境中通常不会完全复制，而是共享底层文件

**空间占用估算：**

- 一个基础的虚拟环境大约 10-20MB
- 如果项目依赖大型库（如 numpy、pandas、tensorflow），每个环境可能增加 100MB-1GB+
- 但如果你有 10 个项目都用相同的依赖，实际占用可能只有 1-2GB，而不是 10GB

## 硬盘空间分配实用解决方案

1. **创建专门的开发目录**（如 D:\PythonProjects）
2. **使用虚拟环境**，但集中管理在 D:\venvs
3. **每个项目保持独立**，避免依赖冲突
4. **定期清理**不用的项目和环境

## 对C盘清理的建议

你**不需要写 Python 程序**，直接在 **PowerShell 中用一条（或两行）命令**就能安全清空 C 盘中的第三方 Python 依赖库。

---

### ✅ 推荐方法：使用 PowerShell 一行命令卸载所有第三方包

```powershell
pip freeze | ForEach-Object { $pkg = $_.Split('==')[0]; if ($pkg -notin @('pip', 'setuptools', 'wheel', 'pkg-resources', '')) { pip uninstall -y $pkg } }
```

> 💡 **复制粘贴这一整行到 PowerShell 中运行即可。**

---

### 🔍 这条命令做了什么？

1. `pip freeze`：列出所有已安装的包（格式如 `numpy==1.24.0`）
2. `ForEach-Object`：遍历每一行
3. `Split('==')[0]`：提取包名（如 `numpy`）
4. 排除核心工具包：`pip`、`setuptools`、`wheel`、`pkg-resources`
5. 对其余所有包执行 `pip uninstall -y`（`-y` 表示自动确认）

---

### 🛡️ 安全建议（强烈推荐先做）

#### 1. **先备份包列表（以防万一）**
```powershell
pip freeze > D:\python_global_packages_backup.txt
```
这样万一误删了某个你其实需要的全局工具（比如 `black`、`jupyter`），还能恢复。

#### 2. **先预览要删除哪些包**
运行这个命令看看会删什么：
```powershell
pip freeze | ForEach-Object { $pkg = $_.Split('==')[0]; if ($pkg -notin @('pip', 'setuptools', 'wheel', 'pkg-resources', '')) { Write-Host "Will uninstall: $pkg" } }
```

---

### 🧹 额外清理（可选）

清空 pip 缓存，进一步释放 C 盘空间：
```powershell
pip cache purge
```

---

### ❌ 不要做的事

- **不要手动删除 `site-packages` 文件夹里的内容** → 可能导致 pip 状态不一致
- **不要卸载 `pip`、`setuptools`、`wheel`** → 虚拟环境创建会依赖它们

---

### ✅ 验证是否清理干净

清理后运行：
```powershell
pip list
```
正常输出应该只有：
```
Package    Version
---------- -------
pip        23.x.x
setuptools 65.x.x
wheel      0.x.x
```

如果有其他包，说明它们可能是通过 `--user` 安装的，你可以额外清理用户目录的包：

```powershell
# 清理用户级安装的包（如果存在）
pip uninstall -y --user (pip list --user | Select-String -Pattern '^[^P]' | ForEach-Object { ($_ -split ' ')[0] })
```

不过大多数情况下，第一条命令已经足够。

---

### 总结

- **用 PowerShell 一行命令即可完成**
- **无需写 Python 脚本**
- **先备份，再执行，很安全**

现在你就可以放心清理 C 盘的 Python 第三方库了！

</BlogPost>
