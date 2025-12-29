---
title: 开发环境的初始化
description: 开发环境的初始化，包括操作系统的安装，开发工具的安装，以及开发环境的配置。
date: 2025-12-29
tags: [fullstack, workflow]
---

## 源代码

### git 的安装

+ 前往 Git 官网 下载并安装最新版 Git。安装时建议保留默认选项（尤其是“Add Git to PATH”）。
+ 安装完成后，打开终端（Windows 用户可使用 git bash），输入 `git --version` 验证安装成功。
+ 自动配置环境变量（安装时可选），让你在任意终端使用 git

### clone 代码库

+ 输入 `git clone <代码库 URL>`，将代码库 clone 到本地。
+ 例如，`git clone https://github.com/yourusername/yourrepository.git`。

### 安装 SourceTree

+ 将之前 clone 的代码库, add 到 SourceTree 中。

## Python 环境

### 安装 pyenv-win

+ 多版本 Python 管理工具 - pyenv-win
+ Windows 上最接近 macOS/Linux pyenv 的工具

### 第 0 步：以普通用户身份打开 **PowerShell**

> 无需管理员权限，任何目录下都可以执行。

---

### 第 1 步：安装 `pyenv-win`

```powershell
# 进入用户主目录（可选，但整洁）
cd ~

# 下载并运行安装脚本
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "install-pyenv-win.ps1"
.\install-pyenv-win.ps1
```

> 安装完成后你会看到提示：  
> `pyenv-win is successfully installed. You may need to close and reopen your terminal before using it.`

---

### 第 2 步：**关闭并重新打开 PowerShell**  
（使 `pyenv` 命令和 PATH 生效）

---

### 第 3 步：设置国内镜像（以清华大学为例）

```powershell
# 永久设置镜像（对当前用户生效）
[Environment]::SetEnvironmentVariable('PYTHON_BUILD_MIRROR_URL_PREFIX', 'https://mirrors.tuna.tsinghua.edu.cn/python/', 'User')
[Environment]::SetEnvironmentVariable('PYTHON_BUILD_MIRROR_TOOLS_URL_PREFIX', 'https://mirrors.tuna.tsinghua.edu.cn/pyenv-win/tools/', 'User')
```

> ✅ 这两个变量分别用于：
>
> + `PYTHON_BUILD_MIRROR_URL_PREFIX`：Python 安装包（.exe）下载地址
> + `PYTHON_BUILD_MIRROR_TOOLS_URL_PREFIX`：pyenv-win 内部工具（如 get-pip.py）的镜像

---

### 第 4 步：**再次关闭并重新打开 PowerShell**  
（使镜像环境变量生效）

---

### 第 5 步：查看可安装的 Python 版本（可选）

```powershell
pyenv install --list
```

> 你会看到一大列版本，如 `3.8.10`, `3.9.18`, `3.10.13`, `3.11.9`, `3.12.3` 等。

---

### 第 6 步：安装你需要的 Python 版本（例如 3.10.13 和 3.12.3）

```powershell
pyenv install 3.10.13
pyenv install 3.12.3
```

> 🌟 因为设置了清华镜像，下载速度会很快（通常几秒到几十秒）。

---

### 第 7 步：设置全局默认 Python 版本（可选）

```powershell
pyenv global 3.12.3
```

现在运行 `python --version` 应该显示 `Python 3.12.3`。

---

### 第 8 步：为特定项目设置独立 Python 版本（推荐）

```powershell
# 进入你的项目目录
cd D:\2024-code\my-old-project

# 设置项目专属 Python 版本
pyenv local 3.10.13
```

> 这会在项目根目录生成 `.python-version` 文件，以后只要进入该目录，`python` 命令自动使用 3.10.13。

---

### 第 9 步：为每个项目创建虚拟环境（最佳实践）

```powershell
cd D:\2024-code\my-old-project
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> 虚拟环境 + pyenv 版本控制 = 完美隔离开发环境。

## 安装 node 环境

### Node.js 版本管理工具

> 是时候使用 fnm （Fast Node Manager）了。

#### **nvm-windows**

+ **优点**：
  + 成熟稳定，在 Windows 上长期使用广泛。
  + 安装简单（.exe 安装包），适合纯 Windows 用户。
  + 支持 `nvm install`, `nvm use`, `nvm list` 等熟悉命令。
+ **缺点**：
  + **仅限 Windows**，如果你未来用 WSL、macOS 或多平台开发，体验不一致。
  + **速度较慢**：切换版本或安装 Node 时较慢（尤其网络差时）。
  + **不支持自动版本切换**（如根据项目 `.nvmrc` 自动切换），需手动 `nvm use`。
  + **不再积极维护**：作者 [coreybutler](https://github.com/coreybutler/nvm-windows) 近年更新频率低，最后一次稳定版是 2021 年。
  + 安装的 Node 路径较深（如 `C:\Users\<user>\AppData\Roaming\nvm`），偶尔与某些工具链冲突。

---

#### **fnm（Fast Node Manager）**

+ **优点**：
  + **跨平台一致**：Windows（PowerShell/CMD）、WSL、macOS、Linux 命令完全相同。
  + **极快**：用 Rust 编写，安装/切换 Node 版本速度明显优于 nvm-windows。
  + **自动版本切换**：进入含 `.node-version` 或 `.nvmrc` 的项目目录时**自动切换 Node 版本**（需启用 shell 集成）。
  + **活跃维护**：更新频繁，社区活跃（Vercel 背书，Next.js 团队推荐）。
  + 与现代开发工具链（如 pnpm、Vite、VitePress）兼容性好。
  + 支持镜像加速（可配置 `--mirror` 使用淘宝源等）。
+ **缺点**：
  + Windows 上需通过 PowerShell/终端安装（无图形安装包）。
  + 首次配置需手动添加环境变量或启用 shell 集成（但一次设置，长期受益）。

### 安装 fnm

#### 以管理员身份打开 PowerShell

+ 虽然 **fnm 本身可以不用管理员安装**（它只写入当前用户目录），但在以下情况可能需要：
  + 首次运行脚本时，系统可能阻止 `.ps1` 执行（需管理员权限临时改策略）。
  + 某些旧版 Windows 默认执行策略较严，普通用户无法运行远程脚本。

+ 通过开始菜单打开
  + 点击 **开始按钮**（或按 `⊞ Win` 键）。
  + 输入 **`PowerShell`**。
  + 在搜索结果中看到 **“Windows PowerShell”**。
  + **右键点击它** → 选择 **“以管理员身份运行”**。
  + 如果弹出 **用户账户控制（UAC）** 提示框，点击 **“是”**。

+ 如何确认当前是“管理员”？ - 打开 PowerShell 后，看窗口标题栏：
  + 普通用户：`Windows PowerShell`
  + 管理员：**`管理员: Windows PowerShell`**

### 安装 Scoop

> + Scoop 是 Windows 上的命令行包管理器，fnm 官方明确支持。
> + Scoop 安装源在国内通常可访问（底层用 GitHub，但可配合代理）

+ 注意： **Scoop 默认不允许以管理员身份安装**，必须用普通用户权限打开 PowerShell。

+ **安装 Scoop**：

   ```powershell
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm https://get.scoop.sh | iex
   ```

+ **通过 Scoop 安装 fnm**：

   ```powershell
   scoop install fnm
   ```

+ **配置 PowerShell 集成**：

   ```powershell
   fnm env --use-on-cd | Out-File -Append -Encoding utf8 $PROFILE
   ```

  > 这条命令会把 fnm 的环境初始化脚本**追加到你的 PowerShell 配置文件**（`$PROFILE`）中。

+ **重启 PowerShell**

  > 这是为了让配置文件生效。

+ **在 PowerShell 中安装 LTS 版本 Node**：

   ```powershell
   fnm install --lts
   fnm use --lts
   fnm default --lts
   ```

### 验证 node 版本

```powershell
PS C:\Users\john> node -v
v24.12.0
PS C:\Users\john> npm -v
11.6.2
```

## 安装 pnpm

> pnpm 是一个快速、节省磁盘空间的包管理工具，与 npm 兼容。

```powershell

PS C:\Users\john> npm install -g pnpm

added 1 package in 6s
npm notice
npm notice New minor version of npm available! 11.6.2 -> 11.7.0
npm notice Changelog: <https://github.com/npm/cli/releases/tag/v11.7.0>
npm notice To update run: npm install -g npm@11.7.0
npm notice
PS C:\Users\john> pnpm -v
10.26.2
PS C:\Users\john> npm config set registry <https://registry.npmmirror.com>
```

## 安装 Trae CN

## 在 Trae CN 中打开项目，运行
