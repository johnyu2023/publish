---
title: 在腾讯云中部署
description: 腾讯云部署全栈应用的记录
date: 2025-12-15
tags: [腾讯云]
---

## 轻量应用服务器 Lighthouse

+ 轻量应用服务器（Tencent Cloud Lighthouse）是新一代开箱即用、面向轻量应用场景的云服务器产品，助力中小企业和开发者便捷高效的在云端构建网站、Web应用、小程序/小游戏、游戏服、电商应用、云盘/图床和开发测试环境，相比普通云服务器更加简单易用且更贴近应用，以套餐形式整体售卖云资源并提供高带宽流量包，将热门软件打包实现一键构建应用，提供极简上云体验。

![轻量应用服务器](/assets/fullstack/set-up-on-tencent-cloud/lighthouse.png)

### 服务器默认是 windows 系统

+ 看文档说，用`PuTTY`连接服务器，但打开PuTTY后，点击open按钮，弹框报错：`Network error: Connection refused`
+ `轻量云AI助手`诊断结果如下

```plaintext
登录失败原因已明确：

协议错误：PuTTY是SSH工具，而您的实例为Windows系统，需使用远程桌面（RDP）协议登录。
正确登录方式：
Windows本地：按Win+R输入mstsc，连接1.117.233.30:3389
OrcaTerm：选择“远程桌面”方式（非SSH）
密码问题：若忘记密码，需通过控制台重置（当前实例支持密码重置）
下一步建议：
确认使用Administrator账号和正确密码
检查本地网络是否屏蔽3389端口
如仍失败，可尝试控制台VNC紧急登录
```

+ 分析：计划部署 PostgreSQL + Python (FastAPI) + Vue → 这是典型的 Linux 技术栈
+ 结论: 需要重新安装 Linux 系统，不能用 Windows 系统。

### 服务器重装系统 - Linux

+ 重装系统时，有多种系统可选，如`OpenCloudOS、CentOS、CentOS Stream、Ubuntu、Debian、Rocky Linux、Windows Server`。
+ 建议选择 Ubuntu，理由如下：
  + 社区支持极强：90% 以上开源项目（包括 FastAPI、PostgreSQL 官方文档）优先提供 Ubuntu 安装指南。
  + 包管理简单：apt 命令直观，软件源丰富，PostgreSQL、Python、Nginx 等一键安装。
  + LTS（长期支持）：22.04 版本支持到 2027 年，稳定可靠。
  + 资源占用低：默认安装仅占 ~300MB 内存，2核4G 完全够用。
  + 腾讯云优化：Ubuntu 是腾讯云/阿里云等厂商的主力镜像，驱动和内核兼容性最好。

## 安装相关软件

### 基础系统配置

```bash
# ubuntu 身份执行
sudo apt update && sudo apt upgrade -y

# 创建普通管理员用户（避免长期用 root）
# 创建用户（例如 deploy），当前是 ubuntu 身份，所以要加 sudo
sudo adduser deploy  

# 赋予 sudo 权限
sudo usermod -aG sudo deploy

# 切换到新用户（后续操作用此用户）
su - deploy

# 确认是否成功切换到 deploy 用户
echo $USER  # 输出 deploy 表示成功
```

### 安装 PostgreSQL

```bash
# deploy 身份执行，安装 PostgreSQL
deploy@VM-0-13-ubuntu:~$ sudo apt install postgresql postgresql-contrib -y
[sudo] password for deploy:  # 输入 deploy 用户的密码以验证身份

# 安装 PostgreSQL 成功后，借用 postgres 系统用户身份一次性执行操作，创建专用数据库和用户
sudo -u postgres psql

# 在 PostgreSQL 数据库中，创建一个独立的、受控的环境，让你的应用程序可以安全地连接和操作数据，而不影响其他数据库或使用权限过高
# 的账户。
# 在 psql 交互界面执行以下 SQL：- 记得换掉 your_strong_password_here
# 命令解析：
# 创建一个新的数据库用户 myapp，用于连接和操作 myapp_db 数据库。
# 创建一个新的数据库 myapp_db，将其所有权分配给 myapp 用户。
# 授予 myapp 用户对 myapp_db 数据库的所有权限。
CREATE USER myapp WITH PASSWORD 'your_strong_password_here';
CREATE DATABASE myapp_db OWNER myapp;
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp;
\q

```

```bash
# 验证连接
deploy@VM-0-13-ubuntu:~$ sudo -u postgres psql -U myapp -d myapp_db
[sudo] password for deploy:
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "myapp"

# 这个错误的核心原因是 PostgreSQL 的身份验证方式（Peer Authentication） 和你的连接方式不匹配
# Peer authentication 是一种特殊的身份验证方法。它的规则是：当发起连接的 Linux 系统用户名，与要登录的 PostgreSQL 数据库用户名相同时，才允许连接。
# 执行此命令时，真正在运行 psql 命令的 Linux 用户是 postgres，你想以 PostgreSQL 用户 myapp 的身份登录，二者名字不匹配，所以被拒绝了。
# 解决方案是换另一种验证方式，采用“验证密码”（md5 或 scram-sha-256）的方式。这样，只要密码正确，不管哪个 Linux 用户发起连接都可以。
# 找到 hba_file ，这是一个 PostgreSQL 配置文件，其中有关于设置客户端连接的验证方式。
deploy@VM-0-13-ubuntu:~$ sudo -u postgres psql -c 'SHOW hba_file;'
              hba_file
-------------------------------------
 /etc/postgresql/16/main/pg_hba.conf
(1 row)

# 使用 nano 编辑器打开 hba_file 配置文件
deploy@VM-0-13-ubuntu:~$ sudo nano /etc/postgresql/16/main/pg_hba.conf

# 找到 这一行
# "local" is for Unix domain socket connections only
local   all             all                                     peer

# 把 peer 替换为 md5
# "local" is for Unix domain socket connections only
local   all             all                                     md5

# 按 Ctrl+X 退出，保存修改（确认保存时按 Y）


deploy@VM-0-13-ubuntu:~$ sudo -u postgres psql -U myapp -d myapp_db
[sudo] password for deploy:
Password for user myapp:
psql (16.11 (Ubuntu 16.11-0ubuntu0.24.04.1))
Type "help" for help.


myapp_db=> \conninfo
You are connected to database "myapp_db" as user "myapp" via socket in "/var/run/postgresql" at port "5432".
myapp_db=>


```


## ✅ 第二步：安装 PostgreSQL（10 分钟）

### 1. **安装 PostgreSQL**
```bash
sudo apt install postgresql postgresql-contrib -y
```

### 2. **创建专用数据库和用户**
```bash
# 切换到 postgres 系统用户
sudo -u postgres psql

# 在 psql 交互界面执行以下 SQL：
CREATE USER myapp WITH PASSWORD 'your_strong_password_here';
CREATE DATABASE myapp_db OWNER myapp;
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp;
\q
```
> 🔒 将 `your_strong_password_here` 替换为 **强密码**（字母+数字+符号，12位以上）

### 3. **验证连接（可选）**
```bash
# 用新用户连接测试
sudo -u myapp psql -d myapp_db
\conninfo  # 查看连接信息
\q
```

---

## ✅ 第三步：安装 Python + FastAPI 环境（10 分钟）

### 1. **安装 Python 工具链**
```bash
sudo apt install python3 python3-pip python3-venv -y
```

### 2. **创建项目目录和虚拟环境**
```bash
mkdir -p ~/myapp/backend
cd ~/myapp/backend
python3 -m venv venv
source venv/bin/activate
```

### 3. **安装 FastAPI 依赖**
```bash
pip install "fastapi[all]" asyncpg python-dotenv uvicorn[standard]
```
> ✅ `asyncpg` 是异步 PostgreSQL 驱动，`uvicorn` 是 ASGI 服务器

### 4. **（可选）写一个测试 API**
```bash
nano main.py
```
粘贴以下内容：
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```
保存退出（`Ctrl+O` → 回车 → `Ctrl+X`）

### 5. **测试启动 FastAPI**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
> 🌐 在浏览器访问 `http://1.117.233.30:8000` 应看到 JSON 响应  
> 按 `Ctrl+C` 停止

---

## ✅ 第四步：配置生产级服务（systemd）

### 1. **创建 systemd 服务文件**
```bash
sudo nano /etc/systemd/system/myapp.service
```
粘贴以下内容：
```ini
[Unit]
Description=My FastAPI App
After=network.target

[Service]
User=deploy
WorkingDirectory=/home/deploy/myapp/backend
Environment="PATH=/home/deploy/myapp/backend/venv/bin"
ExecStart=/home/deploy/myapp/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```
> 🔒 注意：`--host 127.0.0.1` 表示只接受本地连接（更安全）

### 2. **启用服务**
```bash
sudo systemctl daemon-reload
sudo systemctl start myapp
sudo systemctl enable myapp
```

---

## ✅ 第五步：安装 Nginx（前端 + 反向代理）

### 1. **安装 Nginx**
```bash
sudo apt install nginx -y
sudo systemctl start nginx
```

### 2. **配置反向代理**
```bash
sudo nano /etc/nginx/sites-available/myapp
```
粘贴：
```nginx
server {
    listen 80;
    server_name _;  # 匹配任意域名/IP

    location / {
        # 前端静态文件目录（稍后上传 Vue 的 dist）
        root /home/deploy/myapp/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. **启用配置**
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## ✅ 第六步：上传你的代码

### 1. **本地构建 Vue 项目**
```bash
# 在你本地电脑
cd your-vue-project
npm run build  # 生成 dist 目录
```

### 2. **用 WinSCP 或 scp 上传**
- **推荐工具**：[WinSCP](https://winscp.net/)（图形化，支持拖拽）
  - 主机名：`1.117.233.30`
  - 用户名：`deploy`
  - 密码：你的 deploy 用户密码
  - 上传 `dist` 目录到 `/home/deploy/myapp/frontend/`

> 或用命令行（本地电脑执行）：
> ```bash
> scp -r dist deploy@1.117.233.30:/home/deploy/myapp/frontend/
> ```

---

## ✅ 最终验证

1. 访问 `http://1.117.233.30` → 应显示 Vue 前端
2. 前端调用 `/api/xxx` → 应返回 FastAPI 数据
3. 检查服务状态：
   ```bash
   sudo systemctl status myapp    # FastAPI
   sudo systemctl status nginx    # Web 服务器
   ```

---

## 📌 后续建议
- **不要开放 5432 端口**（PostgreSQL 仅本地访问）
- **定期备份数据库**：
  ```bash
  sudo -u postgres pg_dump myapp_db > /home/deploy/backup.sql
  ```
- **安全加固**（可选）：
  - 安装 `fail2ban` 防 SSH 暴力破解
  - 用腾讯云 SSL 证书启用 HTTPS

---

你现在可以：
1. 先完成 **PostgreSQL 安装**
2. 再部署 **FastAPI 测试 API**
3. 最后上传 **Vue 前端**

如果卡在任何步骤（比如 `pg_dump` 权限问题、Nginx 403 错误等），随时告诉我具体现象，我会提供针对性命令！ 🚀
