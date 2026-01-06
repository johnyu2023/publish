---
title: Python 源代码思考
description: 在阅读 Python 源代码时一些值得记录的内容。文章探讨了Python中类与函数的设计原则，提出"函数做事情，类是东西"的核心理念。建议无状态操作用函数，有状态或需维护数据的用类。提供了现代类设计的最佳实践，包括类型提示、属性声明和文档规范。
date: 2025-10-22
tags: [Python]
---

> 在阅读 Python 源代码时一些值得记录的内容。

## 类和 Top-level Function

在 Python 项目中，合理区分类（Class）和顶层函数（Top-level Function）是良好架构设计的关键。

- **函数做事情，类是东西**
- **无状态用函数，有状态用类**
- **一次性的用函数，可配置的用类**
- **工具性的用函数，实体性的用类**

### 核心设计原则

#### 1. **单一职责原则**

- **函数**：执行单一、明确的操作
- **类**：封装相关的数据和行为，代表一个概念或实体

#### 2. **状态管理**

- **无状态操作 → 函数**
- **有状态操作 → 类**

### 具体判断标准

#### 应该使用函数的场景

##### ✅ 纯函数（Pure Functions）

```python
# 好：无副作用，相同输入总是相同输出
def calculate_tax(amount: float, rate: float) -> float:
    return amount * rate

def format_date(date_obj: datetime) -> str:
    return date_obj.strftime("%Y-%m-%d")
```

##### ✅ 工具函数（Utility Functions）

```python
# 好：通用的、可复用的工具
def load_config(file_path: str) -> dict:
    with open(file_path) as f:
        return json.load(f)

def validate_email(email: str) -> bool:
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))
```

##### ✅ 简单的数据转换

```python
# 好：输入→输出的简单映射
def convert_celsius_to_fahrenheit(celsius: float) -> float:
    return celsius * 9/5 + 32
```

#### 应该使用类的场景

##### ✅ 需要维护状态

```python
# 好：需要维护连接状态
class DatabaseConnection:
    def __init__(self, url: str):
        self.url = url
        self._connection = None
    
    def connect(self):
        self._connection = create_connection(self.url)
    
    def execute_query(self, query: str):
        if not self._connection:
            raise ConnectionError("Not connected")
        return self._connection.execute(query)
```

##### ✅ 相关功能的逻辑分组

```python
# 好：相关操作封装在一起
class EmailService:
    def __init__(self, smtp_config: dict):
        self.config = smtp_config
    
    def send_email(self, to: str, subject: str, body: str):
        # 发送邮件逻辑
        pass
    
    def validate_recipient(self, email: str) -> bool:
        # 验证收件人
        pass
    
    def get_delivery_status(self, message_id: str) -> str:
        # 获取投递状态
        pass
```

##### ✅ 需要继承或多态

```python
# 好：利用面向对象特性
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass

class CreditCardProcessor(PaymentProcessor):
    def process_payment(self, amount: float) -> bool:
        # 信用卡支付逻辑
        pass

class PayPalProcessor(PaymentProcessor):
    def process_payment(self, amount: float) -> bool:
        # PayPal支付逻辑
        pass
```

### 灰色地带的判断方法

#### 问自己这些问题

1. **这个操作需要记住之前的状态吗？**
   - 是 → 类
   - 否 → 函数

2. **这些函数是否总是操作相同类型的数据？**
   - 是 → 考虑将数据和操作封装成类
   - 否 → 保持为独立函数

3. **是否会创建多个具有相同行为但不同配置的实例？**
   - 是 → 类
   - 否 → 函数

4. **这个功能是否代表一个现实世界的实体或概念？**
   - 是 → 类
   - 否 → 函数

### 实际例子对比

#### ❌ 不好的设计（过度使用类）

```python
# 不必要地包装成类
class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b
    
    @staticmethod
    def multiply(a, b):
        return a * b

# 更好的方式
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b
```

#### ❌ 不好的设计（应该用类却用函数）

```python
# 状态分散，难以管理
_connection = None
_config = {}

def init_db(url):
    global _connection, _config
    _config['url'] = url
    _connection = create_connection(url)

def execute_query(query):
    global _connection
    if not _connection:
        raise Error("Not initialized")
    return _connection.execute(query)

# 更好的方式
class Database:
    def __init__(self, url):
        self.url = url
        self.connection = None
    
    def connect(self):
        self.connection = create_connection(self.url)
    
    def execute_query(self, query):
        if not self.connection:
            raise ConnectionError("Not connected")
        return self.connection.execute(query)
```

### 项目结构建议

```
my_project/
├── core/                    # 核心业务逻辑（通常是类）
│   ├── user.py             # User, UserService 等
│   └── payment.py          # PaymentProcessor 等
├── utils/                  # 工具函数（通常是顶层函数）
│   ├── validators.py       # validate_email, validate_phone 等
│   └── helpers.py          # format_date, generate_id 等
├── services/               # 服务层（通常是类）
│   └── email_service.py    # EmailService 类
└── main.py                 # 主函数和顶层函数
```

## 现代主流的类设计方案

### 现代主流写法建议

1. **使用 PEP 484/526 类型提示**：所有函数参数、返回值、类属性都应有明确类型注解。
2. **类属性在类体中声明**：即使没有初始值，也应通过 `: Type` 声明（如 `authenticator: Authenticator`）。
3. **文档使用 Google 或 NumPy 风格**：包含参数说明、返回值、示例（尤其对公共 API）。
4. **构造函数参数尽量提供默认值**：提高可用性，支持关键字调用。
5. **避免在 `__init__` 中隐式创建未声明的属性**：所有实例属性应在类体或 `__init__` 开头明确初始化。
6. **对可配置项，考虑使用描述符或配置代理**（如 `ConfigAttribute`）以解耦逻辑。

### 推荐写法示例

```python
from typing import Optional, Callable, Any
from typing_extensions import Self

class ModernAPIClient:
    """
    A modern API client with type safety and clear configuration.

    Attributes:
        base_url: The base URL for API requests.
        timeout: Request timeout in seconds.
        auth_callback: Optional function to inject auth headers.
    """

    base_url: str
    timeout: float
    auth_callback: Optional[Callable[[dict], dict]]

    def __init__(
        self,
        base_url: str,
        timeout: float = 10.0,
        auth_callback: Optional[Callable[[dict], dict]] = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.auth_callback = auth_callback

    def get(self, path: str) -> dict[str, Any]:
        """Perform a GET request."""
        headers = {"Accept": "application/json"}
        if self.auth_callback:
            headers = self.auth_callback(headers)
        # ... actual request logic
        return {"status": "mocked"}
```

此写法：

- 类属性在类体声明
- 全面类型提示
- 构造函数参数有默认值
- 文档清晰，含属性和方法说明
- 符合 PEP 8 和现代 Python 库风格（如 httpx、FastAPI）
