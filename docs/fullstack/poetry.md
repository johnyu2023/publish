---
title: Python 项目中使用 Poetry
description: 
date: 2026-02-10
tags: [Python, Poetry]
---

## Poetry 概念

## Windows 11 安装 Poetry

### 官方安装脚本

```powershell
# 以普通用户身份打开 PowerShell（无需管理员）
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

+ 安装时控制台的输出信息

````powershell
Retrieving Poetry metadata

# Welcome to Poetry!

This will download and install the latest version of Poetry,
a dependency and package manager for Python.

It will add the `poetry` command to Poetry's bin directory, located at:

C:\Users\john\AppData\Roaming\Python\Scripts

You can uninstall at any time by executing this script with the --uninstall option,
and these changes will be reverted.

Installing Poetry (2.3.2)
Installing Poetry (2.3.2): Creating environment
Installing Poetry (2.3.2): Installing Poetry
Installing Poetry (2.3.2): Creating script
Installing Poetry (2.3.2): Done

Poetry (2.3.2) is installed now. Great!

To get started you need Poetry's bin directory (C:\Users\john\AppData\Roaming\Python\Scripts) in your `PATH`
environment variable.

You can choose and execute one of the following commands in PowerShell:

A. Append the bin directory to your user environment variable `PATH`:

```
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\john\AppData\Roaming\Python\Scripts", "User")
```

B. Try to append the bin directory to PATH every when you run PowerShell (>=6 recommended):

```
echo 'if (-not (Get-Command poetry -ErrorAction Ignore)) { $env:Path += ";C:\Users\john\AppData\Roaming\Python\Scripts" }' | Out-File -Append $PROFILE
```

Alternatively, you can call Poetry explicitly with `C:\Users\john\AppData\Roaming\Python\Scripts\poetry`.

You can test that everything is set up by executing:

`poetry --version`

PS D:\2025-code\ai-hub\10-CASE-FunctionCalling> 
````

### 配置 PATH
安装脚本会将 Poetry 安装到 `%APPDATA%\Python\Scripts`，**需手动添加到系统 PATH**：

1. 按 `Win + R` → 输入 `sysdm.cpl` → 回车
2. “高级” → “环境变量” → 在 **用户变量** → `Path` → 点击“编辑” → “新建”
3. 添加路径（根据你的用户名替换）：C:\Users\john\AppData\Roaming\Python\Scripts
4. 重启电脑

### PowerShell 启动报错

+ 重启系统后，打开 PowerShell，发现立即报错。

```powershell
// 在C盘根目录打开 powershell

Windows PowerShell
版权所有（C） Microsoft Corporation。保留所有权利。

安装最新的 PowerShell，了解新功能和改进！https://aka.ms/PSWindows

Set-Location : 路径中具有非法字符。
    + CategoryInfo          : InvalidArgument: (C:\WINDOWS\System32\":String) [Set-Location]，ArgumentException
    + FullyQualifiedErrorId : ItemExistsArgumentError,Microsoft.PowerShell.Commands.SetLocationCommand

Set-Location : 找不到路径“C:"”，因为该路径不存在。
    + CategoryInfo          : ObjectNotFound: (C:":String) [Set-Location], ItemNotFoundException
    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.SetLocationCommand

PS C:\WINDOWS\System32>
```

```powershell
// 在D盘根目录打开 powershell

Windows PowerShell
版权所有（C） Microsoft Corporation。保留所有权利。

安装最新的 PowerShell，了解新功能和改进！https://aka.ms/PSWindows

Set-Location : 路径中具有非法字符。
    + CategoryInfo          : InvalidArgument: (D:\":String) [Set-Location]，ArgumentException
    + FullyQualifiedErrorId : ItemExistsArgumentError,Microsoft.PowerShell.Commands.SetLocationCommand

Set-Location : 找不到路径“D:"”，因为该路径不存在。
    + CategoryInfo          : ObjectNotFound: (D:":String) [Set-Location], ItemNotFoundException
    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.SetLocationCommand

PS C:\WINDOWS\System32>
```

+ 检查环境变量中 PATH 的内容，没有`"`，也没有`\`

### 试验`$PROFILE`文件内容是否被污染


+ `$PROFILE`是 PowerShell 的一个内置变量，它指向你每次启动 PowerShell 时都会自动运行的那个配置文件。其实就是 `C:\Users\john\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`。

+ 你的错误信息（比如 `Set-Location : 路径中具有非法字符`）高度怀疑是由这个文件里的代码触发的。通过暂时屏蔽它，我们可以确定问题是出在**系统环境变量**，还是出在**你自定义的代码**里。可以采用**重命名文件（最简单的方法）：**

  * 打开文件夹：`C:\Users\john\Documents\WindowsPowerShell\`
  * 把 `Microsoft.PowerShell_profile.ps1` 改名为 `Microsoft.PowerShell_profile.ps1.bak`。
  * 这样 PowerShell 启动时就找不到它，也就不会加载那些自定义逻辑了。

+ 改名后，打开 PowerShell，发现报错消失了。确认就是 `$PROFILE` 文件内容被污染导致的。
  
### 修复`$PROFILE`文件内容

+ 现有 `$PROFILE` 文件内容如下：

```powershell
$env:PATH = "C:\Users\john\AppData\Local\fnm_multishells\21520_1766937133089;C:\Users\john\scoop\shims;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Program Files\Intel\WiFi\bin\;C:\Program Files\Common Files\Intel\WirelessCommon\;d:\Program Files\Git\cmd;d:\Users\john\AppData\Local\Programs\Trae CN\bin;C:\Users\john\.pyenv\pyenv-win\bin;C:\Users\john\.pyenv\pyenv-win\shims;C:\Users\john\AppData\Local\Microsoft\WindowsApps;d:\Users\john\AppData\Local\Programs\Microsoft VS Code\bin"
$env:FNM_MULTISHELL_PATH = "C:\Users\john\AppData\Local\fnm_multishells\21520_1766937133089"
$env:FNM_VERSION_FILE_STRATEGY = "local"
$env:FNM_DIR = "C:\Users\john\scoop\apps\fnm\current"
$env:FNM_LOGLEVEL = "info"
$env:FNM_NODE_DIST_MIRROR = "https://nodejs.org/dist"
$env:FNM_COREPACK_ENABLED = "false"
$env:FNM_RESOLVE_ENGINES = "true"
$env:FNM_ARCH = "x64"
function global:Set-FnmOnLoad { If ((Test-Path .nvmrc) -Or (Test-Path .node-version) -Or (Test-Path package.json)) { & fnm use --silent-if-unchanged }
 }
function global:Set-LocationWithFnm { param($path); if ($path -eq $null) {Set-Location} else {Set-Location $path}; Set-FnmOnLoad }
Set-Alias -Scope global cd_with_fnm Set-LocationWithFnm
Set-Alias -Option AllScope -Scope global cd Set-LocationWithFnm
Set-FnmOnLoad
```
+ AI 帮助修复的内容如下
  
```powershell
# 1. 自动初始化 fnm (代替你原来那一大堆手动设置的 $env:PATH)
# 这样不仅更整洁，还能自动处理环境变量，不会因为重启或版本更新失效
if (Get-Command fnm -ErrorAction SilentlyContinue) {
    fnm env --use-on-cd | Out-String | Invoke-Expression
}

# 2. 增强版的路径跳转函数
function global:Set-LocationWithFnm {
    param($path)
    if ($null -eq $path) {
        Set-Location ~
    } else {
        # 核心修复：去除路径字符串首尾可能存在的引号（解决转义引起的非法字符问题）
        $cleanPath = $path.ToString().Trim().Trim('"')
        if (Test-Path $cleanPath) {
            Set-Location $cleanPath
        } else {
            Set-Location $path # 如果路径不存在，交给系统报错
        }
    }
    
    # 执行 fnm 检查逻辑
    if (Get-Command fnm -ErrorAction SilentlyContinue) {
        if ((Test-Path .nvmrc) -Or (Test-Path .node-version) -Or (Test-Path package.json)) {
            & fnm use --silent-if-unchanged
        }
    }
}

# 3. 设置别名
Set-Alias -Option AllScope -Scope global cd Set-LocationWithFnm
```

### 验证 Poetry 安装是否成功

```powershell
# 验证 Poetry 安装是否成功
PS D:\2025-code\ai-hub> poetry --version
Poetry (version 2.3.2)
```

因为

---

### 如何操作？

你可以按照以下步骤“屏蔽”并测试：

1. 


2. **重新打开 PowerShell：**
* 关闭所有现有的 PowerShell 窗口。
* 重新打开一个新的 PowerShell。
* **观察是否还报错。**



---

### 结果判断

* **如果不报错了：** 恭喜！问题就在你的 `profile.ps1` 脚本里。大概率是因为你定义的 `cd` 别名和 `Set-LocationWithFnm` 函数无法正确处理带有转义引号的路径。
* **如果依然报错：** 那说明问题出在 Windows 系统的环境变量 `Path` 或者注册表的底层配置里，即便没有加载个人配置，系统也在尝试执行错误的路径。

### 补充一个小知识

如果你想在 PowerShell 里直接查看这个变量指向哪里，可以直接输入：

```powershell
echo $PROFILE

```

它会打印出那个文件的完整路径。

**你可以先尝试重命名文件并重启 PowerShell，看看那几行烦人的红色错误信息是否消失了？**





✅ 验证安装：

```powershell
poetry --version
# 应输出：Poetry (version 1.8.x)
```

> ⚠️ **避坑**：  
>
> - ❌ 不要用 `pip install poetry`（会导致依赖冲突）  
> - ❌ 不要以管理员身份运行安装脚本（权限问题）  
> - ✅ 安装后重启终端，否则 PATH 不生效

---

## 🛠️ 二、配置优化（提升 Windows 体验）

### 1️⃣ 将虚拟环境放在项目目录内（方便 VS Code 识别）

```powershell
poetry config virtualenvs.in-project true
```

→ 会在项目根目录生成 `.venv` 文件夹，而非全局位置

### 2️⃣ （可选）加速国内下载

```powershell
poetry config repositories.tuna https://pypi.tuna.tsinghua.edu.cn/simple
poetry config http-basic.tuna "" ""
poetry config pypi-url https://pypi.tuna.tsinghua.edu.cn/simple
```

---

## 🌱 三、实战：创建 FastAPI 项目（贴合你的技术栈）

### 步骤 1：初始化项目

```powershell
poetry new fastapi-demo
cd fastapi-demo
```

目录结构：

```
fastapi-demo/
├── pyproject.toml      # 项目配置（唯一核心文件）
├── README.md
├── fastapi_demo/       # 源码目录
│   └── __init__.py
└── tests/              # 测试目录
```

### 步骤 2：添加依赖

```powershell
# 生产依赖
poetry add fastapi uvicorn

# 开发依赖（自动重载 + 类型检查）
poetry add --group dev "uvicorn[standard]" httpx pytest
```

### 步骤 3：编写简单 API
编辑 `fastapi_demo/main.py`：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Poetry + FastAPI!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

### 步骤 4：运行项目

```powershell
# 方式 1：直接运行（推荐）
poetry run uvicorn fastapi_demo.main:app --reload --port 8000

# 方式 2：进入虚拟环境后运行
poetry shell
uvicorn fastapi_demo.main:app --reload --port 8000
```

✅ 访问 `http://localhost:8000` 和 `http://localhost:8000/docs`（自动生成 Swagger UI）

---

## 💡 四、VS Code 深度集成（Windows 首选）

1. 安装 VS Code 扩展：
   - **Python**（Microsoft 官方）
   - **Pylance**（类型提示）
2. 打开项目文件夹 → 按 `Ctrl+Shift+P` → 选择 **Python: Select Interpreter**
3. 选择 `.venv` 中的解释器（路径类似 `.\.venv\Scripts\python.exe`）
4. （可选）在项目根目录创建 `.vscode/settings.json`：

   ```json
   {
     "python.defaultInterpreterPath": "${workspaceFolder}/.venv/Scripts/python.exe",
     "python.terminal.activateEnvironment": true
   }
   ```

✅ 效果：自动补全、类型检查、调试全部生效

---

## 🔁 五、常用命令速查（Windows 友好版）

| 场景 | 命令 | 说明 |
|------|------|------|
| 安装所有依赖 | `poetry install` | 首次运行自动生成 `.venv` |
| 添加生产依赖 | `poetry add requests` | 自动更新 `pyproject.toml` + `poetry.lock` |
| 添加开发依赖 | `poetry add --group dev pytest` | 仅开发环境使用 |
| 运行脚本 | `poetry run python script.py` | 无需手动激活 venv |
| 进入虚拟环境 | `poetry shell` | 退出用 `exit` |
| 导出 requirements.txt | `poetry export -f requirements.txt --output requirements.txt --without-hashes` | 用于 Docker/Heroku |
| 查看依赖树 | `poetry show --tree` | 排查冲突神器 |

---

## ⚠️ 六、Windows 特有避坑指南

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `poetry : 无法识别命令` | PATH 未生效 | 重启 PowerShell，或手动添加 `%APPDATA%\Python\Scripts` 到 PATH |
| 安装包时卡住 | 网络问题 | 配置清华源（见上文） |
| `.venv` 未被 VS Code 识别 | 虚拟环境在全局位置 | 执行 `poetry config virtualenvs.in-project true` 后重装依赖 |
| 权限错误 | 以管理员身份运行过 poetry | 删除 `%APPDATA%\pypoetry` 重新安装（用普通用户） |
| 路径含空格报错 | 项目放在 `Program Files` 等路径 | 项目路径避免空格/中文（推荐 `D:\projects\`） |

---

## 📦 七、打包发布（可选，了解即可）

```powershell
# 构建 wheel 和 sdist
poetry build

# 本地测试安装
pip install dist/your-package-0.1.0-py3-none-any.whl

# 发布到 PyPI（需先配置 token）
poetry publish
```

---

## ✅ 总结：Windows 11 使用 Poetry 最佳实践

1. **安装** → 用官方脚本 + 配置 PATH  
2. **配置** → `virtualenvs.in-project true` + 国内源  
3. **开发** → `poetry add` 管理依赖 → `poetry run` 运行  
4. **IDE** → VS Code 选中 `.venv` 解释器  
5. **避坑** → 不用管理员、路径无空格、重启终端  

> 💡 **给你的建议**：  
> 作为 FastAPI 开发者，Poetry 能让你：  
>
> - 用 `pyproject.toml` 一份文件管理所有依赖（告别 `requirements.txt` + `setup.py`）  
> - 通过 `poetry.lock` 确保团队/部署环境完全一致  
> - 未来发布自己的 PyPI 包只需一条命令  
>
> **今天花 30 分钟配置，未来省下 100 小时调试依赖问题** 👍

遇到具体问题可随时追问，我会提供针对性解决方案！
