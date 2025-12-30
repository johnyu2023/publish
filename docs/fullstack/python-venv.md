---
title: Python 的虚拟环境
description: Python 虚拟环境的使用思考
date: 2025-10-23
tags: [Python，虚拟环境]
---

## Python 虚拟环境的最佳实践-传统

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

#### 3. **激活时注意路径**

```bash
# 必须在虚拟环境所在目录或使用完整路径
source ./stock_env/bin/activate    # Linux/macOS
# 或
source /full/path/to/stock_env/bin/activate
```

## 虚拟环境激活后无需手动关闭

> **虚拟环境激活后不需要手动终止**。  
> 它只是一个“当前终端用哪个 Python”的开关，不是服务，不占资源。

在 PowerShell（或任何终端）中 **激活虚拟环境**（例如通过 `.\venv\Scripts\Activate.ps1`）**只是一个临时的 shell 状态变更**，它只影响当前终端会话，不会启动后台进程或服务。

---

### ✅ 详细说明

#### 1. **激活虚拟环境的本质**

运行：

```powershell
.\venv\Scripts\Activate.ps1
```

只是做了两件事：

- 修改当前终端的 `PATH` 环境变量，把 `venv\Scripts` 放到最前面；
- 修改命令行提示符（如加上 `(venv)` 前缀）。

> 它 **没有启动任何守护进程**，也没有“运行中”的服务需要关闭。

#### 2. **如何“退出”虚拟环境？**

- **方法一（推荐）**：在当前终端运行：

  ```powershell
  deactivate
  ```

  这会恢复原来的 `PATH` 和提示符。
  
- **方法二**：直接 **关闭终端窗口**。  
  虚拟环境的状态只存在于该终端会话中，窗口一关，一切自动还原。

#### 3. **如果你是在脚本中激活环境（如你的 `register_jupyter_kernel.ps1`）**

- 脚本结束后，**激活状态不会保留到父终端**（因为 PowerShell 脚本默认在子作用域运行）。
- 所以你运行完脚本后，看到的终端**仍然是未激活状态**，这是正常行为，无需处理。

> ✅ 换句话说：**你完全不需要“手动终止”虚拟环境**，除非你想在同一个终端里切换回全局 Python。

---

### 🚫 常见误解澄清

| 误解 | 事实 |
|------|------|
| “激活环境后要手动关闭，否则会占用资源” | ❌ 虚拟环境只是路径切换，不消耗额外资源 |
| “不 deactivate 会导致系统变慢” | ❌ 完全不会，只影响当前终端的命令解析 |
| “Jupyter 运行时需要保持终端激活” | ❌ Jupyter 内核一旦启动，就独立运行，与是否激活无关 |

---

### ✅ 最佳实践建议

- 如果你在**交互式终端**中工作，用完虚拟环境后可以运行 `deactivate` 保持清晰；
- 如果你在**脚本中激活环境**（如自动注册内核），**无需也不应该**在脚本末尾调用 `deactivate` —— 因为脚本结束后作用域自动消失；
- 如果你只是**临时运行一个命令**（如 `python train.py`），激活后运行完直接关终端即可。

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

## 虚拟环境的懒人版

> 我有很多个 python 的小项目，每个项目都在不同目录下，代码结构都比较简单。如果每个项目都遵循创建自己的虚拟环境，就会非常繁琐。
>我希望不用虚拟环境，直接用公共的配置环境。但以后如果有新的复杂项目，再在其中使用虚拟环境。

### ✅ 为什么可行？

1. **小项目依赖简单、冲突少**  
   如果你的小项目只用到一些通用、稳定的库（如 `requests`, `pandas`, `numpy` 等），且版本要求不苛刻，共用一个全局环境通常不会出问题。

2. **开发效率优先**  
   对于快速验证想法、写小工具来说，省去创建/激活虚拟环境的步骤能显著提升效率——这符合你“成本效益高”的偏好。

3. **复杂项目仍可隔离**  
   你计划在需要时（如大型项目、多版本依赖、团队协作）再启用虚拟环境，这是**最佳实践的灵活应用**，完全合理。

---

### ⚠️ 潜在风险与应对建议

| 风险 | 说明 | 建议 |
|------|------|------|
| **依赖冲突** | 某天两个小项目需要同一库的不同版本 | 记录每个项目的核心依赖（哪怕简单写个 `requirements.txt`），未来冲突时可快速重建虚拟环境 |
| **环境“污染”** | 安装太多无用包，难以管理 | 定期用 `pip list` 查看，或用 `pip-autoremove`（需安装）清理无依赖的包 |
| **硬盘空间** | 所有库装在一起，占用空间增长 | Python 包通常不大（除非含二进制如 `torch`, `tensorflow`），但若真空间紧张：<br>• 用 `pip cache purge` 清理 pip 缓存<br>• 删除不用的包<br>• 必要时迁移到虚拟环境再卸载全局包 |

---

### 💡 实用建议

1. **保持全局环境“干净”**  
   只安装**高频通用库**（如 `requests`, `click`, `pyyaml`），避免为一次性项目装重型库。

2. **记录依赖**  
   即使不用虚拟环境，也建议每个项目根目录放一个 `requirements.txt`（哪怕只有几行），例如：

   ```txt
   requests>=2.25.0
   pandas
   ```

   这样未来迁移或重装系统时非常方便。

3. **监控空间使用**  
   Python 第三方库一般安装在：
   - Linux/macOS: `~/.local/lib/python3.x/site-packages/` 或系统路径
   - Windows: `%LOCALAPPDATA%\Programs\Python\Python3x\Lib\site-packages\`

   你可以定期检查该目录大小。普通库几十 MB，即使上百个也通常不到 10GB。

4. **未来迁移容易**  
   如果某小项目变复杂了，你可以：

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   pip install -r requirements.txt
   ```

   然后从全局环境中卸载相关包（如果确定其他项目不用）。

---

### ✅ 总结

- **现在这样做没问题**：小项目共用全局环境 + 复杂项目用虚拟环境，是合理且高效的做法。
- **空间问题不必过度担心**：除非你大量安装 AI/科学计算类重型库，否则普通库占用有限。
- **保持简单记录**：用 `requirements.txt` 留痕，未来可进可退。

## 2025-10-25 解决方案

目标是在有限硬盘空间下高效管理多个依赖大型库（如 LangChain、PyTorch 等）的 Python 项目。结合目录结构和需求，**推荐采用“共享大库 + 轻量项目虚拟环境”方案**，具体操作如下：

---

### 最终目标结构

```plaintext
D:\2024-code\lesson2025\
├── shared-libs\                 ← 共享的大型依赖库（如 langchain, torch, openai）
├── 14-16-LangChain-01\
│   └── .venv\                   ← 仅包含小依赖的轻量虚拟环境
└── 17-Case-SQL-LangChain\
    └── .venv\                   ← 仅包含小依赖的轻量虚拟环境
```

### 实施步骤（Windows 环境）

#### 第 1 步：创建共享库环境

```powershell
# 进入你的项目根目录
cd D:\2024-code\lesson2025

# 创建共享库目录（作为虚拟环境）
python -m venv shared-libs

# 激活共享环境并安装大型依赖
shared-libs\Scripts\activate
pip install jupyterlab langchain dashscope  # 根据实际需求添加
deactivate
```

> 💡 提示：用 `pip freeze > shared-libs/requirements.txt` 保存共享依赖清单 (每次安装新的依赖库的时候重新执行此命令)

#### 第 2 步：为每个项目创建轻量虚拟环境

```powershell
# 处理第一个项目
cd 1416-LangChain-01 # 进入项目目录 1416-LangChain-01
python -m venv .venv # 创建虚拟环境
.venv\Scripts\activate  # 激活虚拟环境
python -m pip install --upgrade pip # 推荐这么做，升级一下
python -m pip install ipykernel  # 只安装项目特有小依赖（不要装 langchain 等大库！）
python -m ipykernel install --user --name=1416-LangChain-01 --display-name="1416-LangChain-01"
# name 是文件系统路径，电脑上全局唯一；display-name 是 Jupyter 中显示的名称，可自定义
# 执行命令后，ipykernel 会：
# 1. 在当前用户的 Jupyter 全局配置目录（即 %APPDATA%\jupyter\kernels\）下，
# 2. 创建一个以 --name 命名的子目录（如 1416-langchain-01），
# 3. 并在里面生成 kernel.json 文件。
# 无论 JupyterLab 装在系统、共享库、还是某个虚拟环境，所有通过 --user 注册的 kernel 都会放在这里。
deactivate # 退出虚拟环境

# 处理第二个项目，做法完全类似
cd ..\17-Case-SQL-LangChain
python -m venv .venv
.venv\Scripts\activate
python -m pip install --upgrade pip # 推荐这么做，升级一下
python -m pip install ipykernel  # 只安装项目特有小依赖
python -m ipykernel install --user --name=17-Case-SQL-LangChain --display-name="17-Case-SQL-LangChain"
deactivate
```

#### 第 3 步：让项目环境能访问共享库

在每个项目的虚拟环境中创建 `.pth` 文件（自动继承共享库路径）：

```powershell
# 为第一个项目添加共享路径
echo D:\2024-code\lesson2025\shared-libs\Lib\site-packages > 1416-LangChain-01\.venv\Lib\site-packages\shared.pth
# 通过这一句命令，将共享库路径添加到项目的 .pth 文件中，即完成创建+填充内容
# 注意，内容里的路径必须是绝对路径
# 实际有可能会碰到 【UnicodeDecodeError: 'gbk' codec can't decode byte 0xff in position 0: illegal multibyte sequence】
# 这是由于【某个 .pth 文件包含非法字节（很可能是 BOM 头 0xff 0xfe 或 0xff），导致 Python 在启动时无法正确解码它。】
# 解决办法：其实是windows写入该文件时错误。本质是不要用记事本打开 .pth 文件，而是用专业文本编辑器（如 VS Code）打开
# 偷懒的办法：将其他格式完好的 shared.pth 拷贝到目标目录即可

# 为第二个项目添加共享路径
echo D:\2024-code\lesson2025\shared-libs\Lib\site-packages > 17-Case-SQL-LangChain\.venv\Lib\site-packages\shared.pth
```

> ✅ 验证：激活任一项目环境后，执行 `python -c "import langchain; print(langchain.__file__)"` 应显示共享库路径

#### 第 4 步：启动 JupyterLab（从共享环境）

```powershell
cd D:\2024-code\lesson2025
shared-libs\Scripts\activate
jupyter lab
# jupyterlab 是一个 Jupyter 的前端插件，真正的命令行入口是 jupyter
# jupyter lab        # ✅ 标准用法
# jupyter notebook   # ✅ 也是 jupyter 的子命令
```

打开浏览器后，新建 Notebook 时，你就能在 “Kernel” → “Change kernel” 中看到：
1416-LangChain-01
17-Case-SQL-LangChain
每个 kernel 会使用对应项目的 .venv 中的依赖（包括共享大库 + 项目小依赖）。

---

### ⚠️ 关键注意事项（Windows 特别版）

1. **路径格式**  
   `.pth` 文件必须使用 **正斜杠 `/` 或双反斜杠 `\\`**，但 PowerShell 的 `echo` 会自动处理为单反斜杠（Windows 兼容），所以直接使用上述命令即可。

2. **Python 版本一致性**  
   确保所有环境（shared-libs 和项目 .venv）使用**完全相同的 Python 主版本**（如都是 3.13.5）。建议：

   ```powershell
   # 在项目根目录统一指定 Python 解释器
   py -3.13 -m venv shared-libs
   py -3.13 -m venv .venv  # 在每个项目中执行
   ```

3. **避免重复安装大库**  
   在项目虚拟环境中**绝对不要**执行 `pip install langchain` 等命令，否则会覆盖共享库！

4. **更新共享库**  
   当需要升级 langchain 等库时：

   ```powershell
   shared-libs\Scripts\activate
   pip install --upgrade langchain
   deactivate
   # 所有项目自动生效
   ```

---

### 📁 项目使用流程

1. 进入项目目录：`cd D:\2024-code\lesson2025\14-16-LangChain-01`
2. 激活环境：`.venv\Scripts\activate`
3. 直接运行代码（自动访问共享库 + 项目专属小依赖）
4. 退出：`deactivate`

---

### 本质理解

> ✅ **每个子项目只需安装 `ipykernel` 并注册自己的 kernel；  
> JupyterLab 本身只在共享库环境中安装一次；  
> 启动 JupyterLab 时使用共享库环境，但 Notebook 可以选择任意子项目的 kernel 运行。**

---

#### 🧠 为什么这样设计是优雅的？

| 角色 | 职责 | 安装位置 |
|------|------|--------|
| **JupyterLab** | 提供 Web UI、文件浏览器、终端等 | `shared-libs`（一次安装，全局使用）|
| **ipykernel** | 让某个 Python 环境能被 Jupyter 调用 | 每个项目的 `.venv`（轻量，<10 MB）|
| **项目依赖** | 业务代码所需的库（如 langchain, torch）| 共享大库 + 项目小依赖（通过 `.pth` 复用）|

这样：

- **不重复安装大库** → 节省硬盘
- **每个 Notebook 运行在正确的项目环境中** → 隔离安全
- **统一入口（一个 JupyterLab）** → 使用方便

---

#### 🔁 工作流程回顾（日常使用）

1. **开发前**（只需做一次/项目）：

   ```powershell
   # 在项目目录中
   .venv\Scripts\activate
   pip install ipykernel
   python -m ipykernel install --user --name=my-project --display-name="My Project"
   deactivate
   ```

2. **每天启动开发**：

   ```powershell
   cd D:\2024-code\lesson2025
   shared-libs\Scripts\activate
   jupyter lab
   ```

   → 浏览器打开后，新建 Notebook 时选择对应项目的 kernel。

3. **运行代码时**：
   - Notebook 使用的是**所选 kernel 对应的 `.venv` 环境**
   - 自动能访问：项目小依赖 + 共享大库（因为 `.pth` 已配置）

---

#### 💡 额外好处

- **切换环境无需重启 JupyterLab**：直接在 Notebook 菜单里换 kernel。
- **便于调试多个项目**：一个窗口里可以同时打开 LangChain 和 SQL 项目的 Notebook。
- **导出/分享 Notebook 时**：只需说明“使用 `langchain-01` kernel”，别人按同样方式注册即可复现。

---

#### ⚠️ 最后一个小提醒

确保你在注册 kernel 时，**当前激活的是该项目的 `.venv`**，否则 kernel 会指向错误的 Python 环境。

你可以验证 kernel 是否正确：

```powershell
jupyter kernelspec list
```

输出应类似：

```
Available kernels:
  langchain-01      C:\Users\...\AppData\Roaming\jupyter\kernels\langchain-01
  sql-langchain     C:\Users\...\AppData\Roaming\jupyter\kernels\sql-langchain
```

进入对应目录，查看 `kernel.json`，里面的 `argv` 应指向你项目 `.venv` 中的 `python.exe`。

## 删除 jupyter kernel

```powershell
# 列出 kernel 清单
PS D:\2024-code\lesson2025>jupyter kernelspec list
Available kernels:
  1416-langchain-01    C:\Users\John\AppData\Roaming\jupyter\kernels\1416-langchain-01
  case-langchain-01    C:\Users\John\AppData\Roaming\jupyter\kernels\case-langchain-01
  case-langchain__     C:\Users\John\AppData\Roaming\jupyter\kernels\case-langchain__
  langchain-01         C:\Users\John\AppData\Roaming\jupyter\kernels\langchain-01
  python3              C:\Users\John\.pyenv\pyenv-win\versions\3.13.5\share\jupyter\kernels\python3

# 删除一个 kernel
PS D:\2024-code\lesson2025> jupyter kernelspec remove case-langchain-01
Kernel specs to remove:
  case-langchain-01     C:\Users\John\AppData\Roaming\jupyter\kernels\case-langchain-01
Remove 1 kernel specs [y/N]: y
Removed C:\Users\John\AppData\Roaming\jupyter\kernels\case-langchain-01

# 列出 kernel 清单，验证删除是否成功
PS D:\2024-code\lesson2025> jupyter kernelspec list
Available kernels:
  1416-langchain-01    C:\Users\John\AppData\Roaming\jupyter\kernels\1416-langchain-01
  case-langchain__     C:\Users\John\AppData\Roaming\jupyter\kernels\case-langchain__
  langchain-01         C:\Users\John\AppData\Roaming\jupyter\kernels\langchain-01
  python3              C:\Users\John\.pyenv\pyenv-win\versions\3.13.5\share\jupyter\kernels\python3
```
