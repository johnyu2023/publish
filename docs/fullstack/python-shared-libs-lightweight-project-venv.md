---
title: Python虚拟环境-共享库+子项目
description: Python虚拟环境解决方案：共享大库 + 轻量项目虚拟环境
date: 2025-11-29
tags: [Python, 虚拟环境]
---



## 方案概述

### 目标

+ 在有限硬盘空间下高效管理多个依赖大型库（如 LangChain、PyTorch 等）的 Python 项目

### 目录结构

```plaintext
D:\2024-code\lesson2025\
├── shared-libs\                 ← 共享的大型依赖库（如 langchain, torch, openai）
├── 14-hotel_recommendation\
│   └── .venv\                   ← 仅包含小依赖的轻量虚拟环境
├── 17-Case-SQL-LangChain\
│   └── .venv\                   ← 仅包含小依赖的轻量虚拟环境
├── 18-CASE-LangChain\
    └── .venv\                   ← 仅包含小依赖的轻量虚拟环境
```

## 共享库的构建

```powershell
# 进入你的项目根目录
cd D:\2024-code\lesson2025

# 创建共享库目录（作为虚拟环境）
python -m venv shared-libs

# 激活共享环境并安装大型依赖
shared-libs\Scripts\activate
(shared-libs) PS D:\2024-code\lesson2025> pip install jupyterlab langchain dashscope  # 根据实际需求添加

# 按需安装其他库
(shared-libs) PS D:\2024-code\lesson2025> pip install scikit-learn
deactivate
```

## 子项目的构建

### 创建子项目

+ 子项目目录是在项目根目录下创建一个文件夹，文件夹名就是子项目的名称
+ 注意目录命名规范，不要出现中文，不要大小写字母混用，单词中间用中横线-连接，偶尔也允许用下划线_，如：`14-hotel_recommendation`

### 子项目的虚拟环境

+ 每个子项目都有自己的虚拟环境，环境内安装的库只对该项目可见。

```powershell
# 从项目根目录，进入子项目目录 14-hotel_recommendation
PS D:\2024-code\lesson2025> cd 14-hotel_recommendation 

# 创建子项目的虚拟环境
PS D:\2024-code\lesson2025\14-hotel_recommendation> python -m venv .venv
# 激活子项目的虚拟环境
PS D:\2024-code\lesson2025\14-hotel_recommendation> .venv\Scripts\activate
# (.venv) 意味着已经激活了子项目的虚拟环境
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation>

# 升级 pip 到最新版本 -- 推荐这么做，升级一下
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation> python -m pip install --upgrade pip

# 只安装项目特有小依赖（不要装 langchain 等大库！） - 
# 注：ipykernel 是 jupyter 才需要的
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation> python -m pip install ipykernel
# 注册子项目的 kernel 到 Jupyter
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation> python -m ipykernel install --user --name=14-hotel_recommendation --display-name="14-hotel_recommendation"
# name 是文件系统路径，电脑上全局唯一；display-name 是 Jupyter 中显示的名称，可自定义
# 执行命令后，ipykernel 会：
# 1. 在当前用户的 Jupyter 全局配置目录（即 %APPDATA%\jupyter\kernels\）下，
# 2. 创建一个以 --name 命名的子目录（如 1416-langchain-01），
# 3. 并在里面生成 kernel.json 文件。
# 无论 JupyterLab 装在系统、共享库、还是某个虚拟环境，所有通过 --user 注册的 kernel 都会放在这里。

# 退出子项目的虚拟环境
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation> deactivate
```

### 让子项目环境能访问共享库

+ 在每个项目的虚拟环境中创建 `.pth` 文件（自动继承共享库路径）
+ 验证正确性：激活任一项目环境后，执行 `python -c "import langchain; print(langchain.__file__)"` 应显示共享库路径

```powershell
# 偷懒的办法：将其他格式完好的 shared.pth 拷贝到目标目录即可

# 为子项目添加共享路径
echo D:\2024-code\lesson2025\shared-libs\Lib\site-packages > 14-hotel_recommendation\.venv\Lib\site-packages\shared.pth
# 通过这一句命令，将共享库路径添加到项目的 .pth 文件中，即完成创建+填充内容
# 注意，内容里的路径必须是绝对路径
# 实际有可能会碰到 【UnicodeDecodeError: 'gbk' codec can't decode byte 0xff in position 0: illegal multibyte sequence】
# 这是由于【某个 .pth 文件包含非法字节（很可能是 BOM 头 0xff 0xfe 或 0xff），导致 Python 在启动时无法正确解码它。】
# 解决办法：其实是windows写入该文件时错误。本质是不要用记事本打开 .pth 文件，而是用专业文本编辑器（如 VS Code）打开
```

## Jupyter 文件的显示方式

+ 激活共享库的虚拟环境，从那里启动 Jupyter Lab
+ 找到子项目的 ipynb 文件，打开
+ 切换 kernel，选择子项目已经注册好的 kernel
+ 如需安装第三方依赖，在共享库中激活它的虚拟环境，进行安装

### 从共享库启动 Jupyter Lab

```powershell
# 激活共享库的虚拟环境
PS D:\2024-code\lesson2025> shared-libs\Scripts\activate

# 启动 Jupyter Lab
(shared-libs) PS D:\2024-code\lesson2025> jupyter lab
```

### 显示子项目中的 ipynb 文件

+ 在 jupyter lab 中，打开子项目目录（如 14-hotel_recommendation），找到要打开的 ipynb 文件。
+ 打开 ipynb 文件，文件内容显示在右侧内容区域
+ 在右上角选择 kernel，选择子项目已经注册好的 kernel（如 14-hotel_recommendation）

![child-module-in-jupyter](/assets/fullstack/python-venv-share/child-module-in-jupyter.png)

### 缺失的依赖库，一律在共享库中安装

+ 子项目中发现缺失依赖库，就回到共享库中安装。
+ 安装后，重新执行子项目，就能正常运行了

![child-module-not-found](/assets/fullstack/python-venv-share/child-module-not-found.png)

## py 文件的显示方式

+ 直接在子项目目录下激活它的虚拟环境
+ 执行 py 文件
+ 如需安装第三方依赖，在共享库中激活它的虚拟环境，进行安装

```powershell
# 进入子项目目录
PS D:\2024-code\lesson2025> cd .\14-hotel_recommendation\
# 激活子项目的虚拟环境
PS D:\2024-code\lesson2025\14-hotel_recommendation> .venv\Scripts\activate
# 执行 py 文件
(.venv) PS D:\2024-code\lesson2025\14-hotel_recommendation> python .\hotel_rec.py
```
