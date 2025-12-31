---
title: Python 多项目共享虚拟环境
description: 
date: 2025-12-30
tags: [Python, 虚拟环境]
---

## 背景

+ 有多个 Python 项目，每个项目都依赖于大型库（如 LangChain、PyTorch 等），而这些库的安装占用了大量硬盘空间。
+ 每个项目的依赖都是相同的，只是版本可能不同。

## 创建私有代码库

+ 太复杂，且配置代价高，需要用代码库来管理
+ 创建了一个私有代码库 <https://github.com/johnyu2023/ai-hub.git>
+ 本地 source 中 clone 了该代码库

## 目录结构示意

```plaintext
D:\2025-code\ai-hub
├─── shared-libs
├─── 00-api          # API 示例目录
├─── 01-hotel_recommendation/    # 酒店推荐系统
```

## 共享库的构建

```powershell
# 进入项目根目录 D:\2025-code\ai-hub
# 创建共享库目录（作为虚拟环境）
PS D:\2025-code\ai-hub> python -m venv shared-libs

# 激活共享库的虚拟环境
PS D:\2025-code\ai-hub> shared-libs\Scripts\activate

# 安装大型依赖
(shared-libs) PS D:\2025-code\ai-hub> pip install jupyterlab langchain dashscope

# 退出虚拟环境
(shared-libs) PS D:\2025-code\ai-hub>deactivate
```

## 子项目的构建

### 创建子项目

+ 子项目目录是在项目根目录下创建一个文件夹，文件夹名就是子项目的名称
+ 注意目录命名规范，不要出现中文，不要大小写字母混用，单词中间用中横线-连接，偶尔也允许用下划线_，如：`14-hotel_recommendation`

### 子项目的虚拟环境

+ 每个子项目都有自己的虚拟环境，环境内安装的库只对该项目可见。

```powershell
# 进入子项目根目录 D:\2025-code\ai-hub\00-api
# 创建子项目的虚拟环境
PS D:\2025-code\ai-hub\00-api> python -m venv .venv
# 激活子项目的虚拟环境
PS D:\2025-code\ai-hub\00-api> .venv\Scripts\activate
# (.venv) 意味着已经激活了子项目的虚拟环境
# 升级 pip 到最新版本 -- 推荐这么做，升级一下
(.venv) PS D:\2025-code\ai-hub\00-api> python -m pip install --upgrade pip
# 只安装项目特有小依赖（不要装 langchain 等大库！）
# 注：ipykernel 是 jupyter 才需要的
(.venv) PS D:\2025-code\ai-hub\00-api> python -m pip install ipykernel
# 注册子项目的 kernel 到 Jupyter
(.venv) PS D:\2025-code\ai-hub\00-api> python -m ipykernel install --user --name=00-api --display-name="00-api"
Installed kernelspec 00-api in C:\Users\john\AppData\Roaming\jupyter\kernels\00-api
# name 是文件系统路径，电脑上全局唯一；display-name 是 Jupyter 中显示的名称，可自定义
# 执行命令后，ipykernel 会：
# 1. 在当前用户的 Jupyter 全局配置目录（即 %APPDATA%\jupyter\kernels\）下，
# 2. 创建一个以 --name 命名的子目录（如 00-api），
# 3. 并在里面生成 kernel.json 文件。
# 无论 JupyterLab 装在系统、共享库、还是某个虚拟环境，所有通过 --user 注册的 kernel 都会放在这里。

# 退出子项目的虚拟环境
(.venv) PS D:\2025-code\ai-hub\00-api> deactivate
```

### 让子项目环境能访问共享库

+ **有一个现成的共享库 `shared-libs`存在的话，其他子项目可以直接拷贝这个文件使用！**
  
+ 在每个项目的虚拟环境中创建 `.pth` 文件（自动继承共享库路径）
+ 实际操作中，发现如果用 powershell 生成该文件，会出现字符编码错误。解决办法：用专业文本编辑器（如 VS Code）打开，保存时选择【UTF-8 无 BOM】编码。

+ 建议 VS Code 中直接手工操作。在子项目中，如`00-api\.venv\Lib\site-packages`目录下，创建一个名为 `shared.pth` 的文件，内容为共享库路径（如 `D:\2025-code\ai-hub\shared-libs\Lib\site-packages`）。

+ 验证正确性 - 在子项目目录下执行如下命令，应显示共享库路径

```powershell
(.venv) PS D:\2025-code\ai-hub\00-api> python -c "import langchain; print(langchain.__file__)"
D:\2025-code\ai-hub\shared-libs\Lib\site-packages\langchain\__init__.py
```

## Jupyter 文件的显示方式

+ 激活共享库的虚拟环境，从那里启动 Jupyter Lab
+ 找到子项目的 ipynb 文件，打开
+ 切换 kernel，选择子项目已经注册好的 kernel
+ 如需安装第三方依赖，在共享库中激活它的虚拟环境，进行安装

![Jupyter 中显示子项目的内容](/assets/fullstack/python-shared-venv/jupyter-show-child.png)

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
