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

## Function Calling 的作用

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

## Function Calling 与 MCP 混用

+ 对 LLM 来说，Function Calling 是一个工具，MCP 也是一组工具，所以二者混用，没有问题。

## 能否指定使用哪个工具

+ 可以在系统提示词里说明，例如：
  + 你是一个智能助手，你可以调用 Tavily 搜索工具来获取最新信息。
  + 如果是关于黄金信息的搜索，你需要调用 Bing 工具。
  + 如果是关于交通路线的搜索，你需要调用 高德地图 工具。
