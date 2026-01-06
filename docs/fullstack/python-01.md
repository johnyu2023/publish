---
title: Python 使用基础
description: 文章介绍了Python使用基础，涵盖pyenv版本管理工具、装饰器机制、异常处理等核心概念。对比了Python与JavaScript/Java在装饰器和异常处理上的差异，强调Python的函数式特性与灵活性。
date: 2025-06-01
tags: [Python]
---

## pyenv -- 管理多个 Python 版本的工具

- **pyenv** 是一个 **轻量级、跨平台（主要在 Unix-like 系统如 macOS/Linux 上使用）的 Python 版本管理工具**。它的核心功能是：  

> **让你在同一台机器上轻松安装、切换和管理多个 Python 版本，而不会互相干扰。**

它不会修改系统自带的 Python（避免破坏系统依赖），而是通过修改 `PATH` 环境变量，动态地将你指定的 Python 版本“前置”到命令行中。

---

### 🔧 pyenv 能做什么？

1. **安装任意版本的 Python**（包括 CPython、PyPy、Anaconda 等）

   ```bash
   pyenv install 3.9.7
   pyenv install 3.11.5
   ```

2. **在不同粒度下切换 Python 版本**：
   - 全局（所有项目）：`pyenv global 3.11.5`
   - 当前 shell 会话：`pyenv shell 3.9.7`
   - 当前项目目录（推荐）：`pyenv local 3.8.10` → 自动生成 `.python-version` 文件

3. **查看已安装/可用的 Python 版本**

   ```bash
   pyenv versions      # 查看本地已安装版本
   pyenv install --list  # 查看所有可安装版本
   ```

4. **与虚拟环境工具（如 venv、poetry、conda）配合使用**  
   pyenv 管理 **Python 解释器版本**，而 `venv`/`virtualenv` 管理 **依赖包环境**，二者互补。

---

### 🧪 使用示例

#### 1. 安装 Python 3.9.7

```bash
pyenv install 3.9.7
```

#### 2. 设置当前项目使用 3.9.7

```bash
cd my-project/
pyenv local 3.9.7
```

→ 自动生成 `.python-version` 文件，团队成员拉取代码后也会自动使用该版本（前提是他们也装了 pyenv）。

#### 3. 验证当前 Python 版本

```bash
python --version
# 输出：Python 3.9.7
```

#### 4. 查看优先级（哪个版本生效？）

pyenv 按以下优先级决定使用哪个 Python：

1. **`PYENV_VERSION` 环境变量**
2. **当前目录下的 `.python-version` 文件**（`pyenv local` 设置）
3. **当前 shell 的版本**（`pyenv shell` 设置）
4. **全局版本**（`pyenv global` 设置）

---

### ✅ 为什么需要 pyenv？

- 系统自带的 Python（如 macOS 的 `/usr/bin/python3`）通常版本较旧或不可修改。
- 不同项目可能依赖不同 Python 版本（如项目 A 需要 3.8，项目 B 需要 3.11）。
- 直接用 `sudo apt install python3.9` 或覆盖系统 Python 容易导致系统工具崩溃。
- pyenv **无侵入、用户级安装**，安全可靠。

---

### ⚠️ 注意事项

- **Windows 用户**：pyenv 官方不支持 Windows。可使用：
  - [pyenv-win](https://github.com/pyenv-win/pyenv-win)（社区版）
  - 或直接用 **Windows Subsystem for Linux (WSL)** + pyenv
- pyenv **不管理 pip 包**，需配合 `venv` 使用：

  ```bash
  python -m venv .venv
  source .venv/bin/activate
  ```

---

### 🧩 扩展插件（可选）

- **pyenv-virtualenv**：集成虚拟环境管理

  ```bash
  pyenv virtualenv 3.9.7 myproject-venv
  pyenv activate myproject-venv
  ```

- **pyenv-update**：一键更新 pyenv 本身

---

### 📚 总结

| 特性 | 说明 |
|------|------|
| 作用 | 管理多个 Python 解释器版本 |
| 安全性 | 不动系统 Python，用户级操作 |
| 易用性 | 命令简单，支持项目级配置 |
| 适用人群 | Python 开发者、数据科学家、DevOps |

> ✅ **最佳实践**：在每个项目根目录运行 `pyenv local <version>`，配合 `python -m venv venv` 创建隔离环境，实现“版本 + 依赖”双重隔离。

## pyenv-win -- Windows 下的 pyenv 版本

- 命令几乎和 pyenv 一样

``` shell
# 列出本地已经安装的 python 版本，及目前的使用的版本
PS D:\2024-code\py-bus\nl2repo-md-repair> pyenv versions
- 3.12.10 (set by C:\Users\John\.pyenv\pyenv-win\version)
  3.9.7
# 说明本地已经安装了 3.12.10 和 3.9.7 两个版本，当前使用的版本是 3.12.10

# 设置本地默认使用的 python 版本为 3.9.7
PS D:\2024-code\py-bus\nl2repo-md-repair> pyenv global 3.9.7  

# 重新列出本地已经安装的 python 版本，及目前的使用的版本
PS D:\2024-code\py-bus\nl2repo-md-repair> pyenv versions
  3.12.10
- 3.9.7 (set by C:\Users\John\.pyenv\pyenv-win\version)
# 说明当前使用的版本已经切换为 3.9.7
# 有时存在不会立即生效的情况，需要重启 shell 或重新打开命令行窗口

```

## Python 和 JavaScript 的相似性溯源

- Python 和 JavaScript（JS）在整体语法上有一些表面相似之处（比如都使用缩进、都用 `def`/`function` 定义函数、都有动态类型等），但它们**并没有直接的血缘关系**，也不是因为互相借鉴而变得相似。它们的相似性更多是**偶然的**，或者说是**受早期编程语言设计潮流影响的结果**。

### 1. **不同的设计目标和起源**

- **Python** 由 Guido van Rossum 于 1991 年发布，目标是强调**代码可读性**和**简洁性**，灵感来自 ABC 语言。
- **JavaScript** 由 Brendan Eich 在 1995 年为 Netscape 开发，最初叫 LiveScript，后来为了营销借用了 Java 的名字。它的设计目标是在浏览器中实现轻量级脚本功能，语法上**刻意模仿 Java**（比如大括号 `{}`、分号 `;`、`if/for` 结构等），但语义上更接近 **Scheme（一种 Lisp 方言）** 和 **Self（原型继承语言）**。

### 2. **为什么看起来有点像？**

- **高级语言的共性**：现代高级语言为了易读易写，往往会采用类似的控制结构（如 `if`、`for`、`while`）和表达式语法。
- **动态类型和灵活语法**：两者都是动态类型、解释型语言，支持函数是一等公民、支持闭包等特性，这些是 1990 年代后期脚本语言的常见特征。
- **社区演化趋同**：随着语言发展，彼此借鉴一些好用的特性（如列表推导 vs 数组方法、async/await 等），但这属于后期演化，不是初始设计关联。

### 3. **关键差异**

| 特性             | Python                          | JavaScript                     |
|------------------|----------------------------------|--------------------------------|
| 代码块表示       | 缩进（强制）                    | 大括号 `{}`                   |
| 函数定义         | `def func():`                   | `function func() {}` 或 `() => {}` |
| 类型系统         | 强类型 + 动态                   | 弱类型 + 动态（有类型强制转换） |
| 继承模型         | 基于类（支持多重继承）          | 基于原型                      |
| 主要用途         | 后端、数据科学、自动化等        | 前端、Web、Node.js 后端       |

## Python 中的装饰器

Python 中的**装饰器（Decorator）** 是一种用于**修改或增强函数（或类）行为**的高级功能，它本质上是一个**接受函数作为参数并返回新函数的高阶函数**。装饰器让你能在不修改原函数代码的前提下，为其添加额外功能（如日志、权限检查、性能测试等）。

---

### 🌟 核心原理

装饰器利用了 Python 的两个特性：

1. **函数是一等公民**（可以作为参数传递、作为返回值）
2. **闭包**（内部函数可以访问外部函数的变量）

---

### 📌 基础语法

```python
@decorator_name
def func():
    pass
```

等价于：

```python
def func():
    pass
func = decorator_name(func)
```

---

### 🧪 示例 1：最简单的装饰器

```python
def my_decorator(func):
    def wrapper():
        print("函数执行前...")
        func()  # 调用原函数
        print("函数执行后...")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
```

**输出：**

```
函数执行前...
Hello!
函数执行后...
```

---

### 🧪 示例 2：带参数的函数装饰器

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):  # 接受任意参数
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)  # 重复执行3次
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

**输出：**

```
Hello, Alice!
Hello, Alice!
Hello, Alice!
```

---

### 🧪 示例 3：实际应用场景 - 计时器

```python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行耗时: {end - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "完成"

slow_function()
```

**输出：**

```
slow_function 执行耗时: 1.0042秒
```

---

### 🔍 关键点总结

| 特性                | 说明                                                                 |
|---------------------|----------------------------------------------------------------------|
| **不修改原函数**     | 装饰器在外部包装原函数，保持原函数代码纯净                          |
| **可叠加使用**       | `@decorator1` + `@decorator2` 会按从下到上的顺序执行                |
| **保留原函数信息**   | 使用 `@functools.wraps` 避免装饰后函数名/文档丢失（见下方补充）     |

---

### 💡 补充：保留原函数元信息

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 保留原函数的 __name__, __doc__ 等属性
    def wrapper(*args, **kwargs):
        """这是包装函数"""
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def example():
    """这是示例函数"""
    pass

print(example.__name__)  # 输出 "example"（不加 @wraps 会输出 "wrapper"）
print(example.__doc__)   # 输出 "这是示例函数"
```

装饰器是 Python 的优雅特性之一，广泛应用于框架开发（如 Flask 的 `@app.route`）、权限控制、缓存等场景。

## Python，JavaScript，Java 中的装饰器

### 一、设计模式层面：**装饰器模式（Decorator Pattern）**

这是 **GoF（Gang of Four）23 种经典设计模式之一**，核心思想是：

> **动态地给一个对象添加额外的职责，而不修改其结构。**

- **Java** 中的传统“装饰器”通常指这种**面向对象的设计模式**。
  - 例如：`InputStream` → `BufferedInputStream` → `DataInputStream`
  - 通过**组合 + 接口继承**实现功能叠加。
  - 它作用于**对象实例**，不是语法层面的“修饰”。

✅ **原理**：组合优于继承，通过包装对象来扩展行为。  
❌ **和 Python/JS 的函数装饰器原理不同**（后者基于高阶函数和闭包）。

---

### 二、语言语法层面：**装饰器语法（@decorator）**

这是指用 `@xxx` 语法直接修饰类、方法、属性等。这一层在不同语言中实现差异很大：

#### 1. **Python 装饰器**

- **本质**：高阶函数 + 闭包
- **作用目标**：函数、类、方法、属性
- **运行时生效**：程序运行时动态替换/包装
- **原理**：`@dec` 等价于 `func = dec(func)`

```python
@my_dec
def f(): pass
```

#### 2. **JavaScript 装饰器（Stage 3 提案，非正式标准）**

- **目前（截至 2025 年）仍处于 TC39 提案阶段**，但 TypeScript 和 Babel 已广泛支持。
- **作用目标**：类、方法、属性、参数（不能直接装饰普通函数）
- **原理**：也是高阶函数，但接收的是**描述符（descriptor）或构造器**，而非直接函数
- **运行时生效**（但部分场景可静态分析）

```js
@logged
class MyClass { }
```

> ⚠️ 注意：JS 的装饰器**不能直接用于普通函数**（如 `@dec function f(){}` 是非法的），这是和 Python 的关键区别。

#### 3. **Java 注解（Annotation） ≠ 装饰器**

- Java 中常被误称为“装饰器”的其实是 **注解（如 `@Override`, `@Test`）**
- **注解本身不改变行为**，只是元数据
- **真正实现“装饰”效果的是框架**（如 Spring 的 `@Transactional`）
  - 框架通过**反射 + 代理（AOP）** 在运行时织入逻辑
  - 依赖字节码增强（如 CGLIB）或动态代理

✅ 所以 Java 的“装饰”是 **编译时注解 + 运行时代理**，**不是语言原生的函数包装**。

---

### 对比总结表

| 特性                | Python 装饰器         | JavaScript 装饰器（提案） | Java “装饰器”（实际是注解 + AOP） |
|---------------------|------------------------|----------------------------|-----------------------------------|
| **本质**            | 高阶函数 + 闭包        | 高阶函数（操作描述符）      | 注解（元数据）+ 框架代理          |
| **作用目标**        | 函数、类、方法等       | 类、方法、属性、参数        | 类、方法、字段（通过注解）        |
| **是否语言原生**    | ✅ 是                  | ⚠️ 提案（非正式标准）       | ❌ 注解是原生，但装饰逻辑靠框架   |
| **运行时/编译时**   | 运行时                 | 运行时                     | 编译时（注解）+ 运行时（代理）    |
| **依赖闭包？**      | ✅ 是                  | ✅ 是                      | ❌ 否（依赖反射和代理）           |
| **能否装饰普通函数**| ✅ 是                  | ❌ 否                      | ❌ 否（只能注解方法）             |

---

### 结论

- **Python 和 JS 的装饰器**在思想上相似（都是高阶函数），但 JS 限制更多、标准化滞后。
- **Java 的“装饰器”本质上完全不同**：它不是语言层面的函数包装，而是**基于注解和 AOP 框架的间接实现**。
- **只有 Python 的装饰器**是真正直接、灵活、原生地利用了“函数是一等公民 + 闭包”的特性。

所以：**名字相同，但底层原理并不一样**。Python 的最接近函数式编程的本意，而 Java 的是面向对象+AOP的产物。

## try 语句

以下是 Python、JavaScript 和 Java 中 `try` 异常处理语句的对比表格，涵盖语法结构、关键特性与差异：

| 特性 | **Python** | **JavaScript** | **Java** |
|------|------------|----------------|----------|
| **基本语法** | `try: ... except [ExceptionType as e]: ... else: ... finally: ...` | `try { ... } catch (error) { ... } finally { ... }` | `try { ... } catch (ExceptionType e) { ... } finally { ... }` |
| **异常捕获关键字** | `except` | `catch` | `catch` |
| **支持 `else` 分支** | ✅（仅在无异常时执行） | ❌ | ❌ |
| **`finally` 支持** | ✅（总是执行） | ✅（总是执行） | ✅（总是执行） |
| **多类型异常处理** | 多个 `except` 块，或 `except (A, B) as e` | 单一 `catch`，需在内部用 `if (err instanceof ...)` 判断 | 多个 `catch` 块（按顺序匹配），或 Java 7+ 的 `catch (A \| B e)` |
| **异常类型要求** | 必须是 `BaseException` 的子类（通常为 `Exception`） | 可抛出任意值（字符串、对象等），不限类型 | 必须是 `Throwable` 的子类（通常是 `Exception` 或 `Error`） |
| **Checked 异常** | ❌ 无此概念 | ❌ 无此概念 | ✅ 编译器强制处理 `Exception` 的非 `RuntimeException` 子类 |
| **异步错误捕获** | 需配合 `async/await` + `try/except` | 需配合 `async/await` + `try/catch`（不能直接捕获 Promise reject） | 需在 `async` 方法中使用 `try/catch`（Java 8+ CompletableFuture 需特殊处理） |
| **典型用途示例** | ```python\ntry:\n    x = int(s)\nexcept ValueError:\n    print("无效数字")\nelse:\n    print("成功")\nfinally:\n    cleanup()\n``` | ```javascript\ntry {\n    JSON.parse(str);\n} catch (err) {\n    console.log(err.message);\n} finally {\n    cleanup();\n}\n``` | ```java\ntry {\n    Integer.parseInt(s);\n} catch (NumberFormatException e) {\n    System.out.println("无效数字");\n} finally {\n    cleanup();\n}\n``` |

### 关键总结

- **Python 独有 `else`**：用于清晰分离“正常成功路径”与“异常处理路径”。
- **JavaScript 最灵活也最宽松**：可抛出/捕获任意值，但缺乏类型化多分支。
- **Java 最严格**：区分 checked/unchecked 异常，编译期强制处理，适合大型系统。
- 三者都保证 `finally` **无论是否异常都会执行** 。

> 注：虽然语法关键字不同（`except` vs `catch`），但三者核心思想一致——**隔离错误，防止程序崩溃**。
