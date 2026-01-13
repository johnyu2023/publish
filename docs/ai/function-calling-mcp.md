---
title: Function Calling与MCP
description: 
date: 2026-01-10
tags: [Function Calling, MCP]
---

> Function Calling 与 MCP 的目标：给大模型加上插件

## 概览

+ Function Calling - 一个工具箱，一般是自己开发的
+ MCP - 一个工具箱，一般是别人开发的

## Function Calling

+ 最早是 Langchain 提出来的，
+ 后来 OpenAI 也引入了 Function Calling

## Function Calling在大模型中的作用是什么

+ 扩展模型能力
    大模型本身无法直接操作外部系统（如数据库、计算工具），但通过调用预设函数，可以完成：
    实时数据获取（天气、股价、新闻）
    复杂计算（数学运算、代码执行）
    操作外部系统（发送邮件、控制智能设备）
+ 结构化输出
    模型可将用户自然语言请求转化为结构化参数，传递给函数。例如：
    用户说“明天北京天气如何？” → 模型调用 get_weather(location="北京", date="2025-05-06")
+ 动态决策流程
    模型可根据上下文决定是否/何时调用函数，甚至链式调用多个函数（如先查天气，再推荐穿搭）。
    Function Call是大模型与真实世界交互的“桥梁”
    ，从语言理解 => 具体行动