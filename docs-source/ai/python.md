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

</BlogPost>
