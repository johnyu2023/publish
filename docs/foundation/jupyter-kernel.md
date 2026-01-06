---
title: Jupyter Kernel
description: 文章介绍了Jupyter生态系统，重点阐述了Jupyter Kernel作为执行引擎的架构和功能。涵盖Kernel与前端的通信机制、为特定Python环境注册Kernel的方法、虚拟环境管理，以及Restart Kernel的重要性。
date: 2025-10-24
tags: [Jupyter, JupyterLab, Kernel]
---

## Jupyter 和 JupyterLab

> **Jupyter 是一个项目生态，JupyterLab 是这个生态中用于交互式开发的主力前端应用之一。**

### **Jupyter 是一个项目生态系统**

- “Jupyter” 是一个**开源项目家族**的总称，目标是支持交互式计算。
- 它包含多个子项目，例如：
  - **Jupyter Notebook**（经典的 `.ipynb` 网页界面）
  - **JupyterLab**（新一代模块化集成开发环境）
  - **Jupyter Kernel**（执行代码的核心引擎，如 IPython kernel）
  - **Jupyter Server**（提供后端服务）
  - **JupyterHub**（多用户 Notebook 服务）
  - **Voilà**（将 Notebook 转为仪表盘）
  - **Jupyter Book**（生成静态文档）

### **JupyterLab 是 Jupyter 生态中的一个具体应用**

- 它是 Jupyter 官方推出的**下一代交互式开发环境**，用来替代传统的 Jupyter Notebook。
- 特点：
  - 支持多标签页、拖拽布局
  - 集成 Notebook、文本编辑器、终端、数据查看器等
  - 基于插件架构，可扩展性强
  - 仍然依赖 Jupyter Kernel 来执行代码

## Jupyter 架构

- JupyterLab 属于 Client 层
- ipykernel 是 Python 语言对应的 Jupyter Kernel 实现，它是整个 Jupyter 架构中负责执行 Python 代码的核心组件

<img src="../assets/foundation/jupyter02/jupyter-architecture.png" alt="Jupyter 架构" />

## Jupyter Kernel 介绍

> **Jupyter Kernel 是一个支持交互式计算的智能执行引擎，它通过标准化的消息协议与前端解耦，既能运行代码，又能提供补全、调试、输入等高级功能。**

### 1. **Kernel 是一个独立的后台进程**

- 它通常是一个 Unix 进程（比如 Python 的 `ipykernel`）。
- 负责接收你从 Notebook 或 JupyterLab 输入的代码，执行它，并把结果（输出、错误、图表等）返回给你。

### 2. **它支持多种交互功能**

Kernel 不只是“运行代码”，还提供：

- 代码自动补全（completion）
- 代码内省（比如查看函数签名、文档）
- 调试（debugging）
- 中断长时间运行的任务
- 执行历史记录
- 处理用户输入（如 `input()`）

> 注意：不是所有语言的 Kernel 都支持全部功能（比如 R 的 Kernel 不支持中断）。

### 3. **通过 ZeroMQ（ZMQ）与前端通信**

Kernel 通过 **5 个异步通信通道**（基于 ZMQ）与 Jupyter 前端交互：

- **shell**：主通道，处理执行、补全、检查等请求（REQ/REP）
- **iopub**：广播输出、状态变化（PUB/SUB）
- **control**：高优先级系统命令，如中断、调试控制（REQ/REP）
- **stdin**：处理 `input()` 等用户输入（REQ/REP）
- **heartbeat**：健康检测（ping/pong）

这种设计让关键操作（如中断）不会被普通代码执行阻塞。

### 4. **代码执行不是“直接运行”**

当你在单元格中输入 `print("hello")`，Kernel 会：

1. 先对代码做预处理（比如把 `%time` 转成 `get_ipython().run_line_magic(...)`）
2. 编译为 AST（可选转换）
3. 在一个隔离的 **用户命名空间**（user namespace）中用 `exec()` 执行
4. 把输出通过 iopub 发回前端，最后返回执行状态（`execute_reply`）

### 5. **调试和输入也是“虚拟化”的**

- 调试时，Kernel 会把单元格代码写入临时文件，再用 `debugpy`（基于 Microsoft DAP 协议）进行断点调试。
- `input()` 被替换成向 **stdin 通道** 发送请求，实现“虚拟键盘”。

## 为特定 Python 环境注册 Kernel

> **为特定 Python 环境注册 Kernel = 告诉 Jupyter：“当我选择这个 Kernel 时，请用这个 Python 解释器来运行代码。”**

- **将某个 Python 解释器（通常来自虚拟环境或 pyenv 管理的版本）作为 Jupyter 可选的执行内核（Kernel）**，这样你就可以在 JupyterLab 或 Jupyter Notebook 中选择并使用该环境中的 Python 及其安装的包。

### 1. **前提条件**

- 你已经有一个 **独立的 Python 环境**（例如通过 `pyenv`、`venv`、`conda` 创建的）。
- 该环境中已安装 **`ipykernel`** 包（它是 Jupyter Kernel 的 Python 实现）。

### 2. **安装 `ipykernel` 到目标环境中**

### 3. **注册 Kernel（关键步骤）**

运行以下命令来注册一个新的 Kernel：

```bash
python -m ipykernel install --user --name my-py3135 --display-name "Python 3.13.5 (my project)"
```

#### 参数说明

| 参数 | 作用 |
|------|------|
| `--user` | 将 Kernel 安装到当前用户的配置目录（`~/.local/share/jupyter/kernels/`），无需 root 权限 |
| `--name my-py3135` | **内部标识名**（文件夹名），必须唯一，不能有空格或特殊字符 |
| `--display-name "..."` | **在 JupyterLab/Notebook 界面中显示的名称**，可含空格和描述 |

> ✅ 注册后，会在 `~/.local/share/jupyter/kernels/my-py3135/` 下生成一个 `kernel.json` 文件。

---

### 📄 4. **`kernel.json` 文件内容示例**

```json
{
 "argv": [
  "D:\\2024-code\\ai-lesson\\14-16-LangChain\\CASE-LangChain\u4f7f\u7528\\venv\\Scripts\\python.exe",
  "-Xfrozen_modules=off",
  "-m",
  "ipykernel_launcher",
  "-f",
  "{connection_file}"
 ],
 "display_name": "Project: CASE-LangChain\u4f7f\u7528",
 "language": "python",
 "metadata": {
  "debugger": true
 }
}
```

- `argv[0]` 是**该 Kernel 启动时实际调用的 Python 解释器路径**。
- 这确保了 Jupyter 启动 Kernel 时，使用的是你指定的 Python 环境。
- 所有 `import` 都会从该环境的 `site-packages` 中加载。

### 5. **在 JupyterLab 中使用**

1. 启动 JupyterLab（可以从任意环境启动，不影响 Kernel 选择）：

```bash
   jupyter lab
```

1. 新建 Notebook 或打开现有 Notebook。
2. 点击右上角的 Kernel 名称（如 “Python 3”），选择你注册的 **“Python 3.13.5 (my project)”**。
3. 此时 Notebook 就运行在你指定的 Python 3.13.5 环境中！

### 6. **管理已注册的 Kernels**

- **查看所有已注册 Kernel**：

```bash
  jupyter kernelspec list
```

- **删除某个 Kernel**（例如 `my-py3135`）：

```bash
  jupyter kernelspec uninstall my-py3135
```

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

## JupyterLab 和 虚拟环境

### 虚拟环境

- 每个项目都应该建立自己的虚拟环境，可以避免`依赖地狱`
- jupyter lab 中可以选择不同的 kernel，每个 kernel 对应一个虚拟环境

### 在一个项目中创建虚拟环境

在你的项目目录下（当前已激活或未激活都可以）：

```powershell
# 1. 重新创建虚拟环境
python -m venv venv

# 2. 激活它
.\venv\Scripts\Activate.ps1

# 3. 升级 pip（可选但推荐）
python -m pip install --upgrade pip

# 4. 重新安装依赖（如果你有 requirements.txt）
pip install -r requirements.txt

# 或者只安装你需要的包，比如：
pip install jupyterlab langchain openai python-dotenv
```

### 在项目虚拟环境中启动 JupyterLab

- 在项目目录下打开终端 powershell

```powershell
# 激活项目虚拟环境
.\venv\Scripts\Activate.ps1

# 虚拟环境中启动 jupyter lab
# 确保你已在项目虚拟环境中激活（可以在命令行前看到 `(venv)` 字样）
(venv) PS> python -m jupyterlab
```

### 在项目虚拟环境中安装其他依赖库

- 如果发现有新的库要安装，之前的 powershell 窗口是无法接受命令输入的，因为 jupyter lab 已经启动了
- 你需要重新打开一个 powershell 窗口，激活项目虚拟环境，然后安装新的库。

```powershell
.\venv\Scripts\Activate.ps1

# 虚拟环境中安装 dashscope langchain-community
(venv) PS> pip install dashscope langchain-community
```

- 由于 jupyter lab 是在同一个虚拟环境中启动的，所以在另一个窗口安装完依赖库后， jupyter lab 中下一次执行片段时，会使用新安装的库。
