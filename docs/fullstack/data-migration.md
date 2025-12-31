---
title: 数据迁移记录
description: 描述了从SQLite到PostgreSQL的数据迁移过程：使用DBeaver导出DDL脚本，通过AI修正SQL语法，人工审查后执行建表；按外键依赖顺序导入多个表数据；最后重置PostgreSQL序列确保ID连续性。
date: 2025-12-30
tags: [数据迁移]
---

## 目标

+ 本地数据库迁移到远程的数据库（SQLite 到 PostgreSQL）
+ 本地数据库生成过程中，经历过多次迭代修改，可能会存在瑕疵，需要一次性修正
+ 借助 DBeaver 等数据库工具，将本地数据库导出为 SQL 脚本
+ 远程数据库导入 SQL 脚本，完成数据迁移
+ 数据库中表8张，总的数据量也不大

## DDL 脚本

### 导出现有数据库的 DDL 脚本

+ 通过 DBeaver 将本地数据库中表的 DDL 脚本导出

### 修正 DDL 脚本

+ 将现有 DDL 脚本，交给 [Qwen](https://chat.qwen.ai/) 来修正, 要求符合 PostgreSQL 的语法规范

```sql
-- 原始 DDL 脚本
-- classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    class_name TEXT NOT NULL,
    instructor TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    notes TEXT,
    sport_type_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- exercise_types
CREATE TABLE exercise_types (
    id INTEGER NOT NULL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    notes TEXT
);
-- 注意：主键 id 非自增（原表无 AUTOINCREMENT），保留 INTEGER NOT NULL PRIMARY KEY

-- fitness_knowledge
CREATE TABLE fitness_knowledge (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    title TEXT,
    knowledge_content TEXT NOT NULL,
    notes TEXT,
    is_public BOOLEAN DEFAULT true,  -- SQLite 的 1 → PostgreSQL 的 true
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- fitness_locations
CREATE TABLE fitness_locations (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
-- 原表 id 非自增，故保留 INTEGER PRIMARY KEY（需确保数据插入时提供 id）

-- training_sessions
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    session_name TEXT NOT NULL,
    session_target TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_id INTEGER,
    exercise_type_id INTEGER,
    is_group_training BOOLEAN DEFAULT false  -- SQLite 的 0 → PostgreSQL 的 false
);

-- users
CREATE TABLE users (
    id INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,   -- 补全长
    nickname VARCHAR(100) NOT NULL,   -- 补全长
    password_hash TEXT NOT NULL,      -- 密码哈希通常较长，建议用 TEXT
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- 唯一索引（PostgreSQL 支持）
CREATE UNIQUE INDEX ix_users_username ON users (username);
-- 主键 id 自动有索引，无需 ix_users_id

-- weight_records
CREATE TABLE weight_records (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT,
    weight REAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- training_sets
CREATE TABLE training_sets (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL,
    reps INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
);
```

+ 对修正的后的 DDL 脚本，进行人工审查，找出不合理的地方，跟 Qwen 进行讨论，确认修正
+ 经过多轮讨论后，觉得 DDL 脚本修正的结果，已经满足审查者的审美要求，定稿

```sql
-- 1. exercise_types: 训练类型表
CREATE TABLE exercise_types (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    notes TEXT
);

COMMENT ON TABLE exercise_types IS '训练类型定义表，如力量、有氧、柔韧等';
COMMENT ON COLUMN exercise_types.type_name IS '类型名称，如“力量训练”、“HIIT”';
COMMENT ON COLUMN exercise_types.description IS '类型详细说明';
COMMENT ON COLUMN exercise_types.notes IS '备注信息';


-- 2. fitness_locations: 训练场地信息
CREATE TABLE fitness_locations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE fitness_locations IS '健身场地信息表';
COMMENT ON COLUMN fitness_locations.name IS '场地全称，如“力美健徐汇店”';
COMMENT ON COLUMN fitness_locations.city IS '所在城市';
COMMENT ON COLUMN fitness_locations.description IS '场地详细描述，如设施、特色';
COMMENT ON COLUMN fitness_locations.notes IS '备注信息';
COMMENT ON COLUMN fitness_locations.created_at IS '记录创建时间';
COMMENT ON COLUMN fitness_locations.updated_at IS '记录最后更新时间';


-- 3. users: 用户账户表（含 UNIQUE CONSTRAINT）
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL CHECK (username <> ''),
    nickname VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_username UNIQUE (username)
);

COMMENT ON TABLE users IS '系统用户账户表';
COMMENT ON COLUMN users.username IS '登录用户名（唯一，不可重复）';
COMMENT ON COLUMN users.nickname IS '用户昵称';
COMMENT ON COLUMN users.password_hash IS '密码哈希值（bcrypt等）';
COMMENT ON COLUMN users.role IS '用户角色：如“user”、“coach”、“admin”';
COMMENT ON COLUMN users.created_at IS '账户创建时间';
COMMENT ON COLUMN users.updated_at IS '账户最后更新时间';


-- 4. classes: 课程安排表
CREATE TABLE classes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    notes TEXT,
    sport_type_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_type_id) REFERENCES exercise_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES fitness_locations(id) ON DELETE RESTRICT
);

COMMENT ON TABLE classes IS '课程安排表，记录每节课程的基本信息';
COMMENT ON COLUMN classes.date IS '课程日期（YYYY-MM-DD）';
COMMENT ON COLUMN classes.class_name IS '课程名称，如“周六臀腿强化班”';
COMMENT ON COLUMN classes.instructor IS '教练姓名';
COMMENT ON COLUMN classes.start_time IS '课程开始时间（HH:MM:SS）';
COMMENT ON COLUMN classes.end_time IS '课程结束时间（HH:MM:SS）';
COMMENT ON COLUMN classes.notes IS '课程备注，如特殊要求、变更说明等';
COMMENT ON COLUMN classes.sport_type_id IS '关联 exercise_types.id，表示课程类型';
COMMENT ON COLUMN classes.location_id IS '关联 fitness_locations.id，表示上课地点';
COMMENT ON COLUMN classes.created_at IS '记录创建时间';
COMMENT ON COLUMN classes.updated_at IS '记录最后更新时间';


-- 5. fitness_knowledge: 健身知识库
CREATE TABLE fitness_knowledge (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    title VARCHAR(200),
    knowledge_content TEXT NOT NULL,
    notes TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE fitness_knowledge IS '健身知识文章库';
COMMENT ON COLUMN fitness_knowledge.date IS '知识发布或记录日期';
COMMENT ON COLUMN fitness_knowledge.title IS '文章标题';
COMMENT ON COLUMN fitness_knowledge.knowledge_content IS '知识正文内容';
COMMENT ON COLUMN fitness_knowledge.notes IS '附加备注';
COMMENT ON COLUMN fitness_knowledge.is_public IS '是否公开：true=公开，false=仅自己可见';
COMMENT ON COLUMN fitness_knowledge.created_at IS '记录创建时间';
COMMENT ON COLUMN fitness_knowledge.updated_at IS '记录最后更新时间';


-- 6. training_sessions: 训练会话记录
CREATE TABLE training_sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    session_name VARCHAR(100) NOT NULL,
    session_target VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_id INTEGER,
    exercise_type_id INTEGER,
    is_group_training BOOLEAN DEFAULT false,
    FOREIGN KEY (location_id) REFERENCES fitness_locations(id) ON DELETE SET NULL,
    FOREIGN KEY (exercise_type_id) REFERENCES exercise_types(id) ON DELETE SET NULL
);

COMMENT ON TABLE training_sessions IS '单次训练会话记录（可为个人或团体）';
COMMENT ON COLUMN training_sessions.date IS '训练日期';
COMMENT ON COLUMN training_sessions.session_name IS '训练计划名称';
COMMENT ON COLUMN training_sessions.session_target IS '训练目标肌群或目的，如“肩后束激活”';
COMMENT ON COLUMN training_sessions.start_time IS '训练开始时间';
COMMENT ON COLUMN training_sessions.end_time IS '训练结束时间';
COMMENT ON COLUMN training_sessions.location IS '训练地点（自由文本）';
COMMENT ON COLUMN training_sessions.notes IS '本次训练备注';
COMMENT ON COLUMN training_sessions.location_id IS '关联 fitness_locations.id（可选）';
COMMENT ON COLUMN training_sessions.exercise_type_id IS '关联 exercise_types.id（可选）';
COMMENT ON COLUMN training_sessions.is_group_training IS '是否团体训练：false=个人，true=团体';
COMMENT ON COLUMN training_sessions.created_at IS '记录创建时间';
COMMENT ON COLUMN training_sessions.updated_at IS '记录最后更新时间';


-- 7. weight_records: 体重记录
CREATE TABLE weight_records (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL,
    time TIME,
    weight NUMERIC(5,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE weight_records IS '用户体重记录表';
COMMENT ON COLUMN weight_records.date IS '记录日期';
COMMENT ON COLUMN weight_records.time IS '记录时间（可选）';
COMMENT ON COLUMN weight_records.weight IS '体重值（单位：kg，精确到 0.01）';
COMMENT ON COLUMN weight_records.notes IS '备注，如“晨起空腹”';
COMMENT ON COLUMN weight_records.created_at IS '记录创建时间';
COMMENT ON COLUMN weight_records.updated_at IS '记录最后更新时间';


-- 8. training_sets: 训练组详情
CREATE TABLE training_sets (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id INTEGER NOT NULL,
    exercise_name VARCHAR(100) NOT NULL,
    set_number INTEGER NOT NULL,
    weight NUMERIC(5,2),
    reps INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE
);

COMMENT ON TABLE training_sets IS '训练组详细数据，属于某次 training_sessions';
COMMENT ON COLUMN training_sets.session_id IS '关联 training_sessions.id';
COMMENT ON COLUMN training_sets.exercise_name IS '训练动作名称，如“杠铃深蹲”';
COMMENT ON COLUMN training_sets.set_number IS '组编号（从1开始）';
COMMENT ON COLUMN training_sets.weight IS '使用的重量（kg，精确到 0.01，可为空）';
COMMENT ON COLUMN training_sets.reps IS '完成次数（可为空）';
COMMENT ON COLUMN training_sets.notes IS '本组备注，如“力竭”、“动作变形”';
COMMENT ON COLUMN training_sets.created_at IS '记录创建时间';
COMMENT ON COLUMN training_sets.updated_at IS '记录最后更新时间';
```

### DBeaver 中执行 DDL 脚本

+ 打开 DBeaver，连接到数据库
+ 点击“文件” -> “新建” -> “SQL 脚本”
+ 粘贴 DDL 脚本内容
+ 点击“运行”（或 F5）执行脚本
+ 检查数据库中，如果生成了8张表，说明脚本执行成功

![在 DBeaver 中执行 DDL 脚本](/assets/fullstack/data-migration/dbeaver-call-sql.png)

## 迁移数据到 PostgreSQL

### 导入顺序（处理外键依赖）

+ 由于表之间有外键（Foreign Key），必须按照“先父后子”的顺序导入，否则会报错。顺序如下：

1. `exercise_types` (练习类型，基础表)
2. `fitness_locations` (健身场地，基础表)
3. `users` (独立表)
4. `fitness_knowledge` (独立表)
5. `weight_records` (独立表)
6. `classes` (依赖 1 和 2)
7. `training_sessions` (依赖 1 和 2)
8. `training_sets` (依赖 7)

### 导出数据

+ 同时连接上本地 SQLite 数据库和远程 PostgreSQL 数据库
+ 在 SQLite 数据库的连接上鼠标右键选择【导出数据】。操作步骤如图所示 - 注意要勾选【使用批量加载】

![在 DBeaver 中开始导出数据](/assets/fullstack/data-migration/select-table-right-click.png)
![在 DBeaver 中执行 DDL 脚本](/assets/fullstack/data-migration/export-to-db.png)
![在 DBeaver 中执行 DDL 脚本](/assets/fullstack/data-migration/map-to-table.png)
![在 DBeaver 中执行 DDL 脚本](/assets/fullstack/data-migration/batch-export.png)
![在 DBeaver 中执行 DDL 脚本](/assets/fullstack/data-migration/confirm.png)

### 序列重置（关键步骤）

> 数据导入完成后，你需要告诉 PostgreSQL：“嘿，ID 已经用到 100 了，下次请从 101 开始计数”。

+ 在 PostgreSQL 数据库连接的 SQL 编辑器中执行以下脚本：

```sql
-- 自动重置所有表的自增序列到当前最大 ID

-- 重置 exercise_types 表序列
SELECT setval(pg_get_serial_sequence('exercise_types', 'id'), COALESCE(MAX(id), 1)) FROM exercise_types;

-- 重置 fitness_locations 表序列
SELECT setval(pg_get_serial_sequence('fitness_locations', 'id'), COALESCE(MAX(id), 1)) FROM fitness_locations;

-- 重置 users 表序列
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;

-- 重置 classes 表序列
SELECT setval(pg_get_serial_sequence('classes', 'id'), COALESCE(MAX(id), 1)) FROM classes;

-- 重置 fitness_knowledge 表序列
SELECT setval(pg_get_serial_sequence('fitness_knowledge', 'id'), COALESCE(MAX(id), 1)) FROM fitness_knowledge;

-- 重置 training_sessions 表序列
SELECT setval(pg_get_serial_sequence('training_sessions', 'id'), COALESCE(MAX(id), 1)) FROM training_sessions;

-- 重置 weight_records 表序列
SELECT setval(pg_get_serial_sequence('weight_records', 'id'), COALESCE(MAX(id), 1)) FROM weight_records;

-- 重置 training_sets 表序列
SELECT setval(pg_get_serial_sequence('training_sets', 'id'), COALESCE(MAX(id), 1)) FROM training_sets;
```

![执行 setval ](/assets/fullstack/data-migration/sql-setval.png)

+ 可以在 DBeaver 中，检查每个表的序列是否被设置为正确的值
![检查表的sequence是否被设置为正确的值](/assets/fullstack/data-migration/check-sequence.png)
