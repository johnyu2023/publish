---
title: Python 代码解读的释疑
description: 
date: 2026-09-11
tags: [Python]
---

## import 语句

``` python
from langchain_community.chat_models import ChatTongyi
```

> langchain_community  -- 顶层包，LangChain 社区维护的"第三方集成大全"，对接各种外部模型/工具  
> chat_models  -- 子包，它是个文件夹(含 __init__.py)，专门放各种"聊天模型"的对接代码  
> import ChatTongyi  -- 取出一个类，把里面名叫 ChatTongyi 的类，绑定到你当前这个文件里  

### 概念释疑

+ 模块(module) = 一个 .py 文件
+ 包(package) = 一个装了很多模块的文件夹(里面有 __init__.py)
+ 路径里的点号 . 就是"进入下一层":langchain_community 这层 → 里面的 chat_models 这层。chat_models 我验证过是包(文件夹),不是单个文件。

### import 不是复制,而是建立引用

> 执行`import ChatTongyi`后，ChatTongyi 这个名字就在你文件里"生效"了，指向那个类对象。之后你直接写 ChatTongyi 就能用,不必再写一长串全路径。

对比一下两种写法你就懂了:

``` python
# 写法A:import 整个包 —— 用的时候要写全名
import langchain_community.chat_models
llm = langchain_community.chat_models.ChatTongyi(...)   # 啰嗦

# 写法B:from ... import 具体名字 —— 直接用(就是你文件第3行选的)
from langchain_community.chat_models import ChatTongyi
llm = ChatTongyi(...)                                    # 简洁
```
