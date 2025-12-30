---
title: DashScope API 配置
description: DashScope 是阿里云 AI 平台，需在百炼控制台获取 API Key 并设置环境变量 DASHSCOPE_API_KEY，代码中调用 API 实现舆情分析等 AI 功能，支持文本、图像等模型服务。
date: 2025-12-30
tags: [DashScope, API]
---

## 阿里云百炼

+ 阿里云百炼提供了一系列的 AI 模型，为我们的程序提供 API 调用的方式。
![百炼控制台](/assets/fullstack/dashscope/bailian.png)

+ 在阿里云百炼的控制台中，创建一个新的项目，获取到一个 API Key。
![获取 API Key](/assets/fullstack/dashscope/dashscope-key.png)

## windows 设置环境变量

+ 打开环境变量设置界面。
+ 点击“新建”，添加一个新的环境变量。变量名：`DASHSCOPE_API_KEY`
![环境变量设置](/assets/fullstack/dashscope/env-setting.png)

+ 重启电脑，使环境变量生效。

## 代码中调用 API Key

```python
import json
import os
import dashscope
from dashscope.api_entities.dashscope_response import Role

# 从环境变量中，获取 DASHSCOPE_API_KEY
api_key = os.environ.get('DASHSCOPE_API_KEY')
dashscope.api_key = api_key

# 封装模型响应函数
def get_response(messages):
    response = dashscope.Generation.call(
        model='deepseek-v3',
        messages=messages,
        result_format='message'  # 将输出设置为message形式
    )
    return response
    
review = '这款音效特别好 给你意想不到的音质。'
messages=[
    {"role": "system", "content": "你是一名舆情分析师，帮我判断产品口碑的正负向，回复请用一个词语：正向 或者 负向"},
    {"role": "user", "content": review}
  ]

response = get_response(messages)
print(response.output.choices[0].message.content)
```
