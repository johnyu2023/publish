---
title: Jupyter 使用
description: 文章介绍了Jupyter Notebook和JupyterLab的使用，涵盖启动方式、.ipynb与.py文件配合使用、虚拟环境配置、内核管理、模块安装等核心内容。重点阐述了如何将项目虚拟环境注册为Jupyter内核，以及解决ModuleNotFoundError的方法。
date: 2025-06-10
tags: [Jupyter]
---

## Jupyter Notebook 简介

Jupyter 是一个开源的 Web 应用程序，主要用于创建和共享包含**实时代码、数学公式、可视化图表和 Markdown 文本**的交互式文档（通常称为 Jupyter Notebook）。

## JupyterLab 简介

JupyterLab 是 Jupyter Notebook 的下一代、功能更强大的 Web 交互式开发环境。它不仅支持 Notebook，还能在一个浏览器窗口中同时打开终端、文本编辑器、Markdown 文件、CSV 数据表、图像等，非常适合数据科学、编程教学和探索性分析等场景。

## 启动 JupyterLab

- 如果你已安装 Jupyter（或通过 `pip install jupyterlab` 单独安装），只需在终端运行：

```bash
jupyter lab
```

它会启动一个更现代化的 Web 界面，默认地址通常是 `http://localhost:8888`（端口可能不同）。

- 如果是在一个目录中启动 cmd 或 power shell，直接运行 `jupyter lab` 即可。在 web 页面中左侧的文件列表中，显示的就是这个目录下的所有文件。

![Jupyter Lab](/assets/foundation/jupyter/jupyter-lab.png)

## `.ipynb 文件`和 `.py 文件`配合使用

### 1. `.ipynb` 和 `.py` 文件的定义

#### `.py` 文件

- 是标准的 **Python 脚本文件**。
- 纯文本格式，包含 Python 代码。
- 可直接通过命令行运行：`python script.py`
- 适合构建模块、库、应用程序等。

#### `.ipynb` 文件

- 是 **Jupyter Notebook** 文件。
- 采用 **JSON 格式** 存储，包含代码、文本（Markdown）、图像、输出结果等。
- 通常在 Jupyter 环境中交互式运行，适合数据分析、教学、探索性编程。
- 不能直接用 `python` 命令运行（除非转换）。

---

### 2. 它们的关系

- **功能互补**：`.ipynb` 适合探索和展示，`.py` 适合部署和复用。
- **可相互转换**：
  - 可将 `.ipynb` 转为 `.py`（只保留代码单元格）：

    ```bash
    jupyter nbconvert --to python notebook.ipynb
    ```

  - 也可将 `.py` 文件用特殊注释格式转换为 `.ipynb`（需使用工具如 `jupytext`）。

- **在项目中协同工作**：
  - 用 `.ipynb` 做数据探索和原型开发；
  - 将成熟逻辑提炼成 `.py` 模块供生产环境调用。

---

### 3. 举例说明

假设你正在做一个机器学习项目：

#### 步骤 1：探索性分析（使用 `.ipynb`）

文件：`exploration.ipynb`

```python
# Cell 1
import pandas as pd
df = pd.read_csv('data.csv')
df.head()

# Cell 2
df.describe()

# Cell 3
import matplotlib.pyplot as plt
df['target'].hist()
plt.show()
```

这个 Notebook 包含代码、输出图表和 Markdown 说明，便于理解数据。

#### 步骤 2：提炼核心逻辑（转为 `.py`）

你发现清洗数据的逻辑很稳定，于是创建一个模块：
文件：`data_utils.py`

```python
import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)
    df = df.dropna()
    return df
```

#### 步骤 3：在 Notebook 中调用 `.py` 模块

回到 `model_training.ipynb`：

```python
# Cell 1
from data_utils import load_and_clean_data

df = load_and_clean_data('data.csv')
# 后续训练模型...
```

这样，`.ipynb` 负责交互式实验和可视化，`.py` 负责封装可复用的函数。

---

### 总结

- `.ipynb` 和 `.py` **不是必须成对出现**，但可以**协同工作**。
- 它们共同服务于 **同一个 Python 项目或任务**，各自发挥优势：
  - `.ipynb`：交互、展示、探索；
  - `.py`：结构化、可复用、可部署。

> ✅ 简单说：你可以把 `.ipynb` 看作“实验笔记本”，把 `.py` 看作“正式代码库”。它们共同构成的是一个**完整的数据科学或软件开发工作流**。

## 代码示例

``` python
#!/usr/bin/env python
# coding: utf-8

# In[1]:


# 使用tsa对沪市指数进行分析：trend, seasonal, residual
import statsmodels.api as sm
import matplotlib.pyplot as plt
import pandas as pd

# 数据加载
data = pd.read_csv('shanghai_index_1990_12_19_to_2020_03_12.csv', usecols=['Timestamp', 'Price'])
data.Timestamp = pd.to_datetime(data.Timestamp)
data = data.set_index('Timestamp')
data['Price'] = data['Price'].apply(pd.to_numeric, errors='ignore')
# 进行线性插补缺漏值
data.Price.interpolate(inplace=True)
#  返回三个部分 trend（趋势），seasonal（季节性）和residual (残留)
result = sm.tsa.seasonal_decompose(data.Price, period=250)
result.plot()
plt.show()

# In[5]:

#help(sm.tsa.seasonal_decompose)
```

## 虚拟环境

- 使用虚拟环境，这是 Python 开发的最佳实践。
  - 全局污染会导致难以复现、调试和部署。
  - 虚拟环境能隔离依赖，保证项目可移植性和稳定性。

- 如果项目在 Trae 上运行，已创建虚拟环境，并激活该虚拟环境，安装了所有依赖库，能顺利运行。
- 此时打开 JupyterLab，大概率不会使用你已经创建的虚拟环境，而是是用全局的配置。
- 建议：将项目的虚拟环境注册为 Jupyter 内核

### 注册虚拟环境为 Jupyter 内核

- 脚本 register_jupyter_kernel.ps1

```powershell
# register_jupyter_kernel.ps1
# 用途: 将当前目录下的 venv 虚拟环境注册为 Jupyter 内核
# Usage: Register the venv virtual environment in current directory as a Jupyter kernel

# 获取当前目录名作为内核名称 | Get current directory name as kernel name
$projectDir = Get-Location
$projectName = (Split-Path -Leaf $projectDir.Path)
# 清理项目名: 只保留字母、数字、下划线、连字符 | Clean project name: Keep only letters, numbers, underscores, hyphens
$kernelName = $projectName -replace '[^a-zA-Z0-9_-]', '_'
if ([string]::IsNullOrWhiteSpace($kernelName)) {
    $kernelName = "venv_kernel"
}

# 虚拟环境路径 | Virtual environment path
$venvPath = Join-Path $projectDir "venv"
$pythonExecutable = Join-Path $venvPath "Scripts\python.exe"

# 检查虚拟环境是否存在 | Check if virtual environment exists
if (-Not (Test-Path $pythonExecutable)) {
    Write-Error "Virtual environment not found: $pythonExecutable"
    Write-Host "Please ensure a virtual environment named 'venv' has been created in the project root directory."
    exit 1
}

# 安装/升级 ipykernel | Install/upgrade ipykernel
Write-Host "Installing/upgrading ipykernel..."
& $pythonExecutable -m pip install -q --upgrade ipykernel
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install/upgrade ipykernel."
    exit 1
}

# 注册内核 | Register kernel
Write-Host "Registering Jupyter kernel..."
& $pythonExecutable -m ipykernel install --user --name="$kernelName" --display-name="Project: $projectName"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully registered Jupyter kernel: 'Project: $projectName' (Kernel name: $kernelName)" -ForegroundColor Green
    Write-Host "After starting Jupyter Lab, please select this kernel in your Notebook." -ForegroundColor Yellow
} else {
    Write-Error "Error registering kernel, please check permissions or dependencies."
    exit 1
}
```

- 在项目根目录下运行该脚本。

```powershell
PowerShell -ExecutionPolicy Bypass -File .\register_jupyter_kernel.ps1
```

✅ 这条命令会：

- 自动激活 venv；
- 安装 ipykernel（如果没装）；
- 将当前项目注册为 Jupyter 内核（内核名 = 文件夹名）。

- 在同一个终端中执行命令 `jupyter lab` 启动 Jupyter Lab。

- 在 jupyter lab 中选择该内核。

![select kernel](/assets/foundation/jupyter/select-kernel.png)

## Restart Kernel

### 概念解析

#### 1. **Jupyter 的“内核”（Kernel）是什么？**

- 内核是一个**独立的后台进程**（比如 Python 解释器），负责**真正执行你的代码**。
- 当你在单元格里写 `x = 5` 并运行，这个变量 `x` 是**保存在内核的内存中**，不是保存在 `.ipynb` 文件里。
- 即使你关闭浏览器标签页，只要内核没停，`x` 依然存在（下次打开还能用）。

#### 2. **为什么需要 “Restart Kernel”？**

在交互式开发中，你可能会：

- 修改了某个函数定义，但旧版本还在内存中；
- 误删了某个变量，但后续单元格还依赖它；
- 数据库连接没关，占着资源；
- 代码逻辑变了，但旧状态干扰新结果。

👉 这些**残留状态会导致“明明代码改对了，结果还是错的”**。

所以你需要：

- **Restart Kernel**：杀死旧的 Python 进程，启动一个全新的、干净的内核（所有变量清空）；
- **Run All**：从上到下重新执行所有单元格，确保逻辑完整、状态一致。

> 🔄 “刷新页面” ≠ “Restart Kernel”  
> 刷新浏览器只是重新加载网页，**内核仍在后台运行**！你必须手动点 “Restart Kernel” 才能重置 Python 状态。

---

### 类比理解

| 场景 | 类比 |
|------|------|
| **Jupyter 内核** | 一个开着的 Python REPL（交互式命令行） |
| **运行单元格** | 在 REPL 里输入一行代码并回车 |
| **Restart Kernel** | 按 `Ctrl+D` 退出 REPL，再重新打开一个新的 |
| **.ipynb 文件** | 一个记录你“曾经在 REPL 里输过什么”的笔记 |

即使你修改了笔记（`.ipynb` 文件），**REPL 里的状态不会自动变**——你得重新输入所有命令（Run All），或者干脆重启 REPL（Restart Kernel）。

---

### 常见误区澄清

- ❌ “我改了代码，刷新页面就应该生效”  
  → 刷新页面只重载前端，**内核状态不变**。

- ✅ 正确做法：  
  **Kernel → Restart & Run All**  
  这样才能确保：  
  1. 所有旧状态清除；  
  2. 所有单元格按顺序重新执行；  
  3. 结果可复现。

---

### 为什么叫 “Kernel” 而不叫 “Python Interpreter”？

因为 Jupyter 支持多种语言（R、Julia、Scala 等），每种语言都有自己的“内核”。  
“Kernel” 是 Jupyter 对**后端计算引擎**的通用称呼，Python 内核只是其中一种。

## Windows 系统下更新 JupyterLab

```powershell
pip install --upgrade jupyterlab
```

## 浏览器模式下 ModuleNotFoundError

### 报错信息

+ 在 JupyterLab 浏览器中运行脚本报错 `ModuleNotFoundError: No module named 'langchain'`，说明当前 Python 环境中未安装 `langchain` 包。

```plaintext
ModuleNotFoundError: No module named 'langchain' 
```

### 确认 JupyterLab 使用的是哪个 Python 环境

+ 在 JupyterLab 的 notebook 中运行以下代码，查看当前内核对应的 Python 路径：

```python
import sys
print(sys.executable)
```

+ 输出可能类似：
  - `C:\Users\John\.pyenv\pyenv-win\versions\3.12.10\python.exe`（系统 Python）
  - 或某个虚拟环境路径（如 `venv\Scripts\python.exe`）

+ 记下这个路径，它决定了你应该在哪里安装 `langchain`。

### 安装模块

+ 根据输出确认，我们的 Python 路径是：

``` plaintext
C:\Users\John\.pyenv\pyenv-win\versions\3.12.10\python.exe
```

+ 使用完整路径调用 pip（推荐，最可靠）

打开 **命令提示符（CMD）** 或 **PowerShell**，运行：

```cmd
C:\Users\John\.pyenv\pyenv-win\versions\3.12.10\python.exe -m pip install langchain
```

+  验证安装是否成功

回到 JupyterLab，运行：

```python
import langchain
print(langchain.__version__)
```

![verify install](/assets/foundation/jupyter/jupyter-module-not-found.png)