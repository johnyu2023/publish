---
title: PostgreSQL 数据库设计
description: 记录在 PostgreSQL 数据库设计的过程
date: 2025-12-27
tags: [PostgreSQL, 数据库设计]
---

## 测试库和正式库分离

> 2个名字意义明确的数据库，一个用于测试，一个用于正式环境。这是符合工程规范和安全最佳实践的。

+ 将用户命名为 `kpfit_test` 和 `kpfit_prod`

---

### 这个命名方案的意义

| 优点 | 说明 |
|------|------|
| **语义清晰** | 一看就知道 `kpfit_test` 是测试用，`kpfit_prod` 是正式用 |
| **与应用名绑定** | 前缀 `kpfit` 表明这是专属于你应用的数据库账号，避免与其他项目混淆 |
| **环境隔离明确** | 开发、测试、部署时不容易连错库（比如不会在 prod 用户下跑测试脚本） |
| **便于自动化** | CI/CD 脚本、配置文件（如 `.env`）可以明确区分 `DB_USER_TEST` vs `DB_USER_PROD` |

---

### 配套命名（保持一致性）

| 对象 | 建议名称 |
|------|--------|
| 正式数据库 | `kpfit_prod_db` |
| 测试数据库 | `kpfit_test_db` |
| 正式用户 | `kpfit_prod` |
| 测试用户 | `kpfit_test` |

---

### 安全与权限

虽然 PostgreSQL 默认已隔离（用户只能操作自己拥有的数据库），但你可以额外加固：

```sql
-- 创建正式用户（强密码）
CREATE USER kpfit_prod WITH PASSWORD 'YourStrong!ProdPassword2025';
CREATE DATABASE kpfit_prod_db OWNER kpfit_prod;

-- 创建测试用户（可稍简单，但别用 123456）
CREATE USER kpfit_test WITH PASSWORD 'KpFitTestPass';
CREATE DATABASE kpfit_test_db OWNER kpfit_test;
```

> ⚠️ 切记：**正式库密码不要和测试库相同**，避免凭据泄露导致生产事故。

---

### DBeaver 连接命名

在 DBeaver 中创建两个连接，命名如：

+ `kpfit - PROD` → 连 `kpfit_prod_db` / 用户 `kpfit_prod`
+ `kpfit - TEST` → 连 `kpfit_test_db` / 用户 `kpfit_test`

这样在左侧导航器中一目了然，大幅降低误操作风险。

## postgres 用户

> 你**不需要“创建 `postgres` 用户”** —— 因为 **`postgres` 是 PostgreSQL 安装时自动创建的超级用户**，它一定存在，只是你可能还没给它设置密码。

---
### 2个 postgres 用户

+ 安装 PostgreSQL（无论是 `apt install postgresql` 还是其他方式）时，系统会**自动创建**：
  + 一个**操作系统用户**：`postgres` - Linux 系统用户（操作系统层面）
  + 一个**数据库用户（角色）**：`postgres` - PostgreSQL 数据库角色（数据库内部层面）

---
### 操作系统用户`postgres`

+ 这个 Linux 系统用户 postgres 是个普通用户，它存在的核心意义是 —— 安全隔离（Security Isolation）。
+ PostgreSQL 数据库服务必须以一个非 root 的专用系统用户（postgres）运行，这是操作系统安全的基本原则。

---
#### 系统用户`postgres`的作用详解

| 作用 | 说明 |
|------|------|
| **1. 服务进程身份** | PostgreSQL 的主进程 (`postmaster`) 和子进程都以 `postgres` 用户身份运行 |
| **2. 文件所有权** | 所有数据库数据文件（在 `/var/lib/postgresql/...`）都属于 `postgres` 用户，其他用户无法读写 |
| **3. 权限最小化** | 即使数据库被攻破，攻击者也只能在这个普通用户的权限内活动（不能删系统文件、不能改网络配置等） |
| **4. 支持 peer 认证** | Linux 用户 `deploy` 想无密码登录数据库？不行！但 `postgres` 系统用户可以无密码登录 `postgres` 数据库角色 —— 这是通过 **peer 认证** 实现的，依赖系统用户身份 |

---
#### 为何不能使用 `deploy` 来操作

理论上可以，但**强烈不建议**，原因：

1. **职责分离原则**：应用用户（`deploy`）≠ 数据库用户（`postgres`）
2. **避免权限污染**：如果 PostgreSQL 用 `deploy` 运行，一旦数据库崩溃，可能会影响你部署的其他程序
3. **安全审计困难**：无法区分“是 deploy 用户操作了系统，还是数据库进程操作了系统”
4. **包管理器依赖**：`apt install postgresql` 会自动创建 `postgres` 用户，并硬编码在服务配置中

> 💡 简单说：**专用服务 → 专用用户**，这是 Linux 世界的黄金法则。

---
### 数据库用户 postgres

+ 这个 `postgres` 数据库用户默认是数据库的**超级用户（SUPERUSER）**，拥有数据库的所有权限。
+ **默认没有设置密码**（因为本地通过 `peer` 认证，无需密码即可登录）。

---
#### 设置 postgres 的密码

> 目标：让 `postgres` 数据库用户有密码，以便在 DBeaver 中用它执行管理操作（如创建 `kpfit_prod` 等用户）

+ 步骤（在腾讯云服务器上操作）

```bash
# 1. 切换到 postgres 系统用户（无需密码，只要你有 sudo）
deploy@VM-0-13-ubuntu:~$ sudo -u postgres psql
[sudo] password for deploy:
psql (16.11 (Ubuntu 16.11-0ubuntu0.24.04.1))
Type "help" for help.

postgres=#

# 2. 在 psql 中为 postgres 角色设置密码
# 3. 按提示输入一个强密码（比如 YourPostgres!Admin2025）
#    输入时不会显示字符，输完回车即可
postgres=# \password postgres
Enter new password for user "postgres":
Enter it again:
postgres=#

# 4. 退出
postgres=# \q
deploy@VM-0-13-ubuntu:~$
```

---
#### 在 DBeaver 中使用

+ 你就可以在 DBeaver 中创建一个**管理员连接**：

+ Host: 你的公网 IP  
+ Port: 5432  
+ Database: `postgres`（或留空）  
+ Username: `postgres`  
+ Password: 你刚设置的密码  

用这个连接去执行：

```sql
CREATE USER kpfit_prod ...;
CREATE DATABASE kpfit_prod_db ...;
-- 等管理命令
```

---
#### 超级用户不暴露在远程连接中

你**完全可以在服务器上用 `sudo -u postgres psql` 直接执行所有管理命令**（就像你之前做的那样），**不需要 DBeaver 连 `postgres`**。

也就是说：
+ **日常开发**：用 `kpfit_test` / `kpfit_prod` 连接
+ **数据库管理（建用户/库）**：直接在服务器终端用 `sudo -u postgres psql` 操作

> ✅ 这其实是**更安全的做法** —— 超级用户不暴露在远程连接中。

---
## 创建数据库

### postgres 用户连接数据库报错

+ DBeaver 中用 `postgres` 用户连接数据库时，连接数据库时的报错：

```bash
FATAL: no pg_hba.conf entry for host "124.79.8.217", user "postgres", database "postgres", SSL encryption
# 这个错误非常典型，说明 PostgreSQL 拒绝了你从本地 IP 124.79.8.217 的连接请求.
# 因为 pg_hba.conf 中没有允许该 IP 用 postgres 用户访问。
```

---
### 解决 postgres 无法远程连接

#### 第 1 步：确认你的本地公网 IP

你已经知道是 `124.79.8.217`（从错误信息中看出），但建议再次确认：
- 在本地电脑访问 [https://ip.cn](https://ip.cn) 或 [https://whatismyipaddress.com](https://whatismyipaddress.com)
- 确保 IP 没变（家庭宽带 IP 可能会变）

#### 第 2 步：编辑服务器上的 `pg_hba.conf`

登录腾讯云服务器，执行：

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

在文件**末尾**添加一行（允许你的 IP 用密码登录 `postgres` 用户）：

```conf
# 允许特定 IP 使用 postgres 用户远程登录（仅用于管理！）
host    postgres    postgres    124.79.8.217/32    md5
```

> 🔒 **安全提醒**：  
> - **不要用 `0.0.0.0/0`**，除非临时测试（测试完立刻改回）  
> - `md5` 表示使用密码认证（你已为 `postgres` 设置密码）

---

#### 第 3 步：确保 `postgresql.conf` 允许远程连接

检查：
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

确保有：
```conf
listen_addresses = '*'
```

---

#### 第 4 步：重启 PostgreSQL 服务

```bash
sudo systemctl restart postgresql
```

---

#### 第 5 步：DBeaver 连接配置

在 DBeaver 中，你的连接应设置为：

| 字段 | 值 |
|------|----|
| Host | 腾讯云服务器公网 IP |
| Port | 5432 |
| Database | `postgres` |
| Username | `postgres` |
| Password | 你设置的 `postgres` 密码 |
| SSL | **建议设为 `disable` 临时测试**（或选 `allow`）|

> 💡 关于 SSL：  
> 错误信息中提到 `SSL encryption`，说明 DBeaver 默认尝试 SSL 连接，但你的 PG 可能未配置 SSL。  
> **临时解决**：在 DBeaver 连接设置 → **「SSL」标签页 → 勾选 “Disable SSL”**  
> （生产环境建议配 SSL，但现在先通再说）

---

#### 安全建议（重要！）

- **`postgres` 超级用户不要长期开放远程访问！**
- 建议：
  1. 用 `postgres` 连接创建好 `kpfit_prod` / `kpfit_test` 用户和库
  2. **立即从 `pg_hba.conf` 中删除 `postgres` 的远程规则**
  3. 日常只用 `kpfit_*` 用户连接
- 或者至少：**只允许你的固定 IP 访问**

---

### 替代方案（更安全）：不用远程连 `postgres`

你其实**不需要在 DBeaver 中连 `postgres`**！  
所有管理操作都可以在服务器上用 `sudo -u postgres psql` 完成：

```bash
# 创建用户和库（在服务器执行）
sudo -u postgres psql -c "
CREATE USER kpfit_prod WITH PASSWORD 'xxx';
CREATE DATABASE kpfit_prod_db OWNER kpfit_prod;
"
```

这样就**完全不需要开放 `postgres` 远程权限**，更安全！

---








![DBeaver 下创建数据库](/assets/fullstack/set-up-on-tencent-cloud/create-db-for-user.png)
