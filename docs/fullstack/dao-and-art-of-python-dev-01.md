---
title: Python 开发的道和艺术01
description: 文章探讨了Python开发的道和艺术，涵盖包管理器选择、函数与类的权衡、以及FastAPI设计哲学。建议纯Python项目用Pip，数据科学用Conda，避免混用。强调Python函数式优先的设计哲学，与JS社区的OOP倾向形成对比。
date: 2026-01-05
tags: [Python, Conda, Pip, KISS, 函数, FastAPI, 分层设计]
---

## 包管理器的选择

+ Conda 和 Pip 是 Python 开发中常用的包管理器，它们有不同的定位和功能。
+ 二者尽量不要混用，否则会使问题复杂化
+ 纯 Python 项目建议使用 Pip 管理依赖，而不是 Conda

### Conda 对比 Pip

| 特性维度 | **Conda** | **Pip** | **npm** |
| :--- | :--- | :--- | :--- |
| **核心定位** | **跨语言**的**包和环境**管理系统 | **Python官方**的**包管理器** | **JavaScript** (Node.js) 生态的**包管理器** |
| **管理范围** | Python、R、C/C++等**任意语言**的包，以及**虚拟环境** | **仅Python**包 | **JavaScript/Node.js**包 |
| **安装包类型** | **预编译的二进制包** (无需编译) | **wheel** (预编译) 或 **源码** (可能需编译) | 主要为**源码**或预编译包 |
| **依赖解析** | **严格且强大** (使用SAT求解器，确保所有依赖兼容) | **相对简单**，依赖冲突解决能力较弱 | 有自己的依赖解析机制 |
| **环境管理** | **内置**强大的**虚拟环境**管理功能 (创建、切换、删除) | **无内置**环境管理，需配合 **venv** / **virtualenv** 等工具 | 通过 **node_modules** 目录进行隔离，通常不称“虚拟环境” |
| **包仓库** | **Anaconda Repository** (含main, free, r, msys2等) & **Conda Forge** | **PyPI** (Python Package Index) | **npm registry** |
| **安装Python** | **可以**直接安装不同版本的Python解释器 | **不可以**，需先安装Python | 不涉及Python安装 |
| **典型场景** | **数据科学、机器学习、科学计算**；需要**复杂依赖**和**非Python库** | **通用Python开发**；**纯Python项目**；需要**最新最全的包** | **前端开发、Node.js后端、全栈开发** |

### Conda 和 Pip 的混用

> 可以谨慎混用，但绝不能随意互换

+ **包的来源不同**：Conda 安装的是来自 **Conda 仓库**的包，而 Pip 安装的是来自 **PyPI** 的包。**同一个库的这两个版本，其内部编译、依赖、安装路径可能都不同**。
+ **依赖管理机制不同**：Conda 的依赖解析更严格全面，而 Pip 的相对宽松。混用可能导致依赖冲突，破坏环境稳定性。
+ **文件位置不同**：Conda 安装的包在 Conda 环境目录下，Pip 安装的包在 Python 的 `site-packages` 目录下。混用可能导致同一个包的多个版本共存，引发混乱。
+ 在同一个 Conda 环境中，**可以**同时使用 Conda 和 Pip，但必须遵循严格的规则，否则很容易“炸环境”。

### 混用的最佳实践步骤

> **Conda 无法感知 Pip 安装的包**。它不会知道这些包的存在，因此也无法用 `conda list` 或 `conda update` 来管理它们。同样，Pip 也无法管理 Conda 安装的包。

1. **始终为项目创建新的 Conda 环境**：避免在 `base` 环境中混用，`base` 环境一旦损坏恢复成本很高。
2. **优先使用 Conda 安装核心依赖**：特别是那些有**非Python依赖**或**复杂编译需求**的库，如 `numpy`, `scipy`, `pandas`, `pytorch`, `tensorflow`, `opencv` 等。Conda 的二进制包能帮你省去很多编译麻烦。
3. **再使用 Pip 安装 Conda 没有的包**：例如一些**最新的研究代码**（GitHub上的开发版）、**个人项目**、或**某些只在PyPI上的小众库**。
4. **始终在激活的环境下操作**：确保每次安装前都激活了目标环境 (`conda activate my_project`)，这样无论用 `conda install` 还是 `pip install`，都会安装到当前激活的环境里。
5. **谨慎升级，特别是用 Pip 升级 Conda 安装的包**：`pip install --upgrade` 可能会**无提示地升级 Conda 已安装的包及其依赖**，破坏 Conda 精心维护的依赖平衡。**尽量避免使用 `pip install --upgrade`**，除非你非常清楚自己在做什么。如需升级，更优先使用 `conda update`。
6. **记录依赖，便于复现**：
    + **Conda 部分**：使用 `conda env export --no-builds > environment.yml` 导出 Conda 管理的包和环境信息。
    + **Pip 部分**：使用 `pip freeze > requirements.txt` 导出 Pip 安装的包（**注意：这会包含Conda安装的包，但版本号可能不准确**）。
    + **最佳实践**：在 `environment.yml` 的 `pip:` 部分手动维护 Pip 的依赖列表，或者将两部分文件都纳入版本控制。

### 终极建议

1. **新手入门**：从 **Conda** 开始。安装 Miniconda，为每个项目创建新环境，用 `conda install` 安装需要的包。这是最不容易出错的方式。
2. **有经验后**：在**通用Python项目**中，尝试 **Pip + venv**，体验其轻量和高效。
3. **混用时牢记**：**Conda 优先，Pip 补充**，**永远在新环境中操作**，**定期导出依赖文件**。
4. **遇到环境问题**：**重建环境**通常比试图修复一个混乱的环境更高效。

## 函数和类的取舍

### Python的设计哲学 - KISS

+ 扁平优于嵌套
+ 简单优于复杂
+ KISS（Keep It Simple, Stupid）
+ 用函数解决问题，直到你真正需要类

### Python 的设计哲学下的函数

+ **函数是一等公民**：支持高阶函数、闭包、装饰器，天然适合函数式风格。
+ **没有“一切皆对象”的强制约束**：不像 Java 那样必须包装在类中。
+ **标准库大量使用函数**：如 `os.path.join()`, `json.loads()`, `itertools.chain()` 等。

### FastAPI 的设计哲学 - 函数式、声明式风格

1. **依赖注入（Depends）天然适配函数**  
   你可以直接注入 `Session` 到函数参数，无需类实例管理状态：

   ```python
   def get_user(db: Session = Depends(get_db)): ...
   ```

2. **路由即函数（View Functions）**  
   每个 endpoint 是一个独立函数，逻辑清晰，测试方便。

3. **Repository 层用函数更轻量**  
   如你写的 `get_fitness_knowledge(db, id)`，直接传入依赖，无副作用。

> ✅ **结论**：FastAPI **不是创造了这个实践，而是充分利用了 Python 本身的函数优先哲学**，并提供了工具（依赖注入、Pydantic 模型）让函数式架构更强大。

### Python 推荐使用类的场景

| 场景 | 例子 |
|------|------|
| **需要封装状态** | 数据库连接池、配置对象、缓存客户端 |
| **需要行为+数据绑定** | 用户对象（有 `.save()`, `.send_email()` 方法） |
| **需要继承或多态** | 不同支付网关的统一接口 |
| **复杂业务领域模型** | 订单生命周期管理（创建、支付、发货、退款） |

## Python 和 JS 对函数的态度

+ **JavaScript（尤其是现代 JS）和 Python 一样，函数都是一等公民（first-class functions）**，并且两种语言都**支持函数式编程风格**
+ 社区文化、历史包袱和典型使用场景的差异，导致它们在“是否优先用函数”这个问题上**走向了不同的实践偏好**。

### **JavaScript：从“被迫用原型”到“拥抱类/组件”**

+ **历史包袱**：早期 JS 没有 `class`（ES6 才引入），开发者用**原型链（prototype）模拟 OOP**，导致 OOP 思维根深蒂固。
+ **框架驱动**：
  + **React（前端主流）**：虽然支持函数组件（FC），但复杂逻辑仍需 `useState`, `useEffect` 等**带状态的钩子**，本质是**用函数模拟类的行为**。
  + **Node.js（后端）**：大量使用 **类（Class）** 封装服务（如 `UserService`）、控制器（如 `AuthController`），尤其在 TypeScript 项目中。

→ **JS 社区更倾向于用类组织有状态的业务逻辑**，即使函数可行。

### **Python：从“支持 OOP”到“按需选择范式”**

+ **设计哲学**：Python 从诞生就支持多种范式（OOP/FP/过程式），但《Python 之禅》明确主张**简单优先**。
+ **框架影响**：
  + **Django**：重度 OOP（Model/View/Template 都是类）。
  + **FastAPI/Flask**：**轻量函数式**（路由是函数，Repository 常用函数）。
+ **社区共识**：**无状态逻辑默认用函数**，有状态/复杂领域模型才用类。

---

### **核心差异总结**

| 维度 | Python 社区 | JavaScript 社区 |
|------|-------------|-----------------|
| **默认范式** | **多范式，函数优先** | **多范式，OOP/组件优先** |
| **函数 vs 类的选择** | 无状态 → 函数；有状态 → 类 | 复杂逻辑 → 类/组件（即使无状态也倾向封装） |
| **框架影响** | FastAPI/Flask 推动函数式 | React/Vue/Angular 推动组件化（类/函数组件） |
| **典型后端代码** | `def create_user(db, data): ...` | `class UserService { createUser(data) { ... } }` |
