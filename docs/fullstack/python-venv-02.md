---
title: Python 的虚拟环境-精简
description: Python 虚拟环境的使用思考
date: 2025-12-29
tags: [Python，虚拟环境]
---

## Python 虚拟环境

> **强烈建议在虚拟环境中安装依赖包！** 这是 Python 开发的最佳实践

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

- 使用内置的 `venv`

```bash
# 示例项目，python 项目目录为 D:\2025-code\keepfit\server

# 进入 python 项目目录
PS D:\2025-code\keepfit> cd server

# 创建虚拟环境
# 在当前目录下创建一个名为 venv 的目录，它里面放着虚拟环境
PS D:\2025-code\keepfit\server> python -m venv venv

# 激活虚拟环境
PS D:\2025-code\keepfit\server> venv\Scripts\activate

# (venv) 表示当前终端处于虚拟环境中，这个虚拟环境的名字就叫 venv
(venv) PS D:\2025-code\keepfit\server> 

# 现在安装包（会安装到虚拟环境中）
pip install 你的包名

# 退出虚拟环境
deactivate
```

### 什么时候可以不用虚拟环境？

- 临时测试某个包的功能
- 安装全局工具（如 `black`, `flake8` 等代码格式化/检查工具）
- 确定不会与其他项目产生冲突的简单脚本

## Python 虚拟环境本质是一个目录

### 虚拟环境的位置

**虚拟环境其实是在当前目录下创建的一个文件夹**，不是全局的。

```bash
# 如果你在 /home/user/myproject 目录下执行
python -m venv stock_env

# 那么会创建
/home/user/myproject/stock_env/
```

- 这个文件夹包含：
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

### 虚拟环境的管理技巧

#### 1. **通常将虚拟环境放在项目根目录**

```plaintext
my_project/
├── stock_env/           # 虚拟环境
├── src/
├── requirements.txt
└── README.md
```

#### 2. **记得添加到 .gitignore**

```plaintext
# .gitignore
stock_env/
venv/
.env/
__pycache__/
```

## 虚拟环境激活后无需手动关闭

> **虚拟环境激活后不需要手动终止**。  
> 它只是一个“当前终端用哪个 Python”的开关，不是服务，不占资源。

在 PowerShell（或任何终端）中 **激活虚拟环境**（例如通过 `.\venv\Scripts\Activate.ps1`）**只是一个临时的 shell 状态变更**，它只影响当前终端会话，不会启动后台进程或服务。

## 虚拟环境的空间占用问题

**实际情况：**

- 虚拟环境确实会在每个项目目录下创建独立的依赖库
- 但现代 Python 虚拟环境（如 venv、conda）会使用**符号链接**或**硬链接**来减少重复文件
- 相同版本的包在不同虚拟环境中通常不会完全复制，而是共享底层文件

**空间占用估算：**

- 一个基础的虚拟环境大约 10-20MB
- 如果项目依赖大型库（如 numpy、pandas、tensorflow），每个环境可能增加 100MB-1GB+
- 但如果你有 10 个项目都用相同的依赖，实际占用可能只有 1-2GB，而不是 10GB
