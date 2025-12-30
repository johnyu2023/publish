---
title: 在腾讯云中部署 - PostgreSQL
description: 记录在腾讯云部署 PostgreSQL 数据库的过程
date: 2025-12-27
tags: [腾讯云, PostgreSQL]
---

## 腾讯云轻量应用服务器

### 官网

+ [腾讯云官网](https://cloud.tencent.com/)，微信扫码可以登陆
+ [腾讯云控制台](https://console.cloud.tencent.com/)，在控制台，点击“轻量应用服务器”

![控制台](/assets/fullstack/set-up-on-tencent-cloud/tencent-cloud-console.png)

---

### 轻量应用服务器 Lighthouse

+ 轻量应用服务器（Tencent Cloud Lighthouse）是新一代开箱即用、面向**轻量应用场景**的云服务器产品，助力中小企业和开发者便捷高效的在云端构建网站、Web应用、小程序/小游戏、游戏服、电商应用、云盘/图床和开发测试环境，相比普通云服务器更加简单易用且更贴近应用，以套餐形式整体售卖云资源并提供高带宽流量包，将热门软件打包实现一键构建应用，提供极简上云体验。

![轻量应用服务器](/assets/fullstack/set-up-on-tencent-cloud/lighthouse.png)

---

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

---

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

+ 安装 PostgreSQL 数据库

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

+ 验证 PostgreSQL 安装成功

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

+ 想要删除 myapp 用户和 myapp_db 库 - 因为忘记了密码，且数据库是空的

```bash
# 以 deploy 用户身份登录系统执行
deploy@VM-0-13-ubuntu:~$ sudo -u postgres psql
[sudo] password for deploy:
psql (16.11 (Ubuntu 16.11-0ubuntu0.24.04.1))
Type "help" for help.

postgres=#
# 此时已经进入了 PostgreSQL 的超级用户（postgres）交互终端

# 删除数据库
postgres=# DROP DATABASE IF EXISTS myapp_db;
DROP DATABASE

# 删除用户
postgres=# DROP USER IF EXISTS myapp;
DROP ROLE

# 创建新用户，设置你记得住的密码（替换 'your_new_password'）
postgres=# CREATE USER myapp WITH PASSWORD 'your_new_password';
CREATE ROLE

# 创建数据库，并指定 myapp 为所有者
postgres=# CREATE DATABASE myapp_db OWNER myapp;
CREATE DATABASE

# 验证用户是否存在
postgres=# \du myapp
     List of roles
 Role name | Attributes
-----------+------------
 myapp     |

# 验证数据库是否存在
postgres=# \l myapp_db
                                                   List of databases
   Name   | Owner | Encoding | Locale Provider |   Collate   |    Ctype    | ICU Locale | ICU Rules | Access privileges
----------+-------+----------+-----------------+-------------+-------------+------------+-----------+-------------------
 myapp_db | myapp | UTF8     | libc            | en_US.UTF-8 | en_US.UTF-8 |            |           |
(1 row)

# 创建一个测试表 myapp_db ，属于 myapp 用户
postgres=# CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE
);
CREATE TABLE
postgres=# INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');
INSERT 0 3

# 验证测试表是否存在
postgres=# SELECT * FROM users;
 id |  name   |        email
----+---------+---------------------
  1 | Alice   | alice@example.com
  2 | Bob     | bob@example.com
  3 | Charlie | charlie@example.com
(3 rows)

# 退出 psql 交互终端
postgres=# \q
deploy@VM-0-13-ubuntu:~$
```

### 开放端口供开发机连接数据库

+ 要让你**本地 Windows 上的 DBeaver（或其他 PostgreSQL 客户端）成功连接腾讯云上的 PostgreSQL 服务**，你需要完成 **3 个关键配置**。缺一不可。

#### 第 1 步：修改 PostgreSQL 配置，允许远程连接

##### 编辑 `postgresql.conf`

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

找到这一行（通常在 `CONNECTIONS AND AUTHENTICATION` 区域）：

```ini
#listen_addresses = 'localhost'
```

→ **取消注释并改为**：

```ini
listen_addresses = '*'
```

> 表示监听所有 IP（包括公网）

保存退出（`Ctrl+O` → 回车 → `Ctrl+X`）。

---

##### 编辑 `pg_hba.conf`（客户端认证配置）

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

在文件**末尾**添加一行，允许你的用户从任意 IP 用密码登录：

```ini
# TYPE  DATABASE    USER    ADDRESS     METHOD
host    myapp_db    myapp   0.0.0.0/0   md5
```

> 🔒 **安全建议**：上线后应将 `0.0.0.0/0` 替换为你本机的公网 IP（如 `123.123.123.123/32`）。  
> 可通过访问 [https://ip.cn](https://ip.cn) 查看你的本地公网 IP。

保存退出。

---

##### 重启 PostgreSQL 服务

```bash
sudo systemctl restart postgresql
```

---

#### 第 2 步：配置腾讯云**安全组（防火墙）**

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 **云服务器 > 轻量应用服务器**
3. 找到你的服务器实例 → 点击 **「防火墙」**（或「安全组」）
4. 添加 **入站规则（放行端口）**：

| 协议 | 端口 | 源 IP | 策略 |
|------|------|--------|------|
| TCP  | 5432 | 你的本地公网 IP（或 `0.0.0.0/0` 临时测试） | 允许 |

> 🌐 示例：
>
> + 临时测试：源 IP 填 `0.0.0.0/0`
> + 安全做法：填 `123.123.123.123/32`（替换为你的实际 IP）

![防火墙设置](/assets/fullstack/set-up-on-tencent-cloud/firewall.png)

---

#### 第 3 步：本地 DBeaver 连接测试

在 DBeaver 中新建 PostgreSQL 连接，填写：

| 字段 | 值 |
|------|----|
| Host | 腾讯云服务器的**公网 IP**（不是内网 IP） |
| Port | `5432` |
| Database | `myapp_db` |
| Username | `myapp` |
| Password | 你设置的密码 |

点击 **「Test Connection」**，成功则显示 **“Connected”**。

![DBeaver 创建 PostgreSQL 连接](/assets/fullstack/set-up-on-tencent-cloud/dbeaver-create-postgresql.png)

![DBeaver 下载 PostgreSQL 驱动](/assets/fullstack/set-up-on-tencent-cloud/dbeaver-download.png)