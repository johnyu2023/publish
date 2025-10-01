---
title: Coze 使用 01
description: 开源后的 Coze 未来可期，是时候重新认识一下 Coze 了
date: 2025-09-10
tags: [Coze]
---

<BlogPost>

> Coze 前段时间开源了，官网也做了大调整，有必要重新认识一下 Coze 了

## Agent 与 Copilot 的区别

### 定义与核心理念

+ Agent（智能代理 / 智能体） - 自主决策 + 主动执行
+ Copilot（副驾驶 / 协作助手） - 辅助人类 + 协同工作

### 关键区别对比表

| 维度            | Agent（智能体）                  | Copilot（副驾驶）                  |
|-----------------|----------------------------------|------------------------------------|
| **自主性**       | 高（可独立运行）                 | 低（需人类主导）                   |
| **目标驱动**     | 是（设定目标后自行规划执行）     | 否（辅助人类达成其目标）           |
| **决策权**       | 自主决策                         | 提供建议，人类决策                 |
| **交互模式**     | 主动发起任务                     | 被动响应 + 智能建议                |
| **适用场景**     | 自动化复杂任务、无人值守系统     | 提升人类效率、降低认知负担         |
| **代表产品**     | AutoGPT, BabyAGI, 机器人管家     | GitHub Copilot, Microsoft Copilot  |
| **风险控制**     | 需要强约束和监控（可能失控）     | 风险较低（人类始终在环）           |

## 搭建自己的 AI Agent - Coze 快速上手

+ AI 应用开发平台 - 快速搭建基于大模型的各类 Bot，并将 Bot 发布到社交平台、通讯软件或部署到网站上。
+ 插件工具 - 集成了丰富的插件工具
+ 知识库 - 提供了知识库来管理和存储数据，可将 TXT、PDF、DOCX、Excel、CSV 上传至知识库，也可基于 URL 获取在线网页内容
+ 记忆能力 - 提供了持久化的记忆能力，提供了方便 AI 交互的数据库记忆能力
+ 工作流设计 - 提供了灵活的工作流设计，可以用来处理逻辑复杂，且有较高稳定性要求的任务流。

## Coze 国内版网站内容

+ 扣子空间 - 问答式
+ 开发平台 - DIY 开发

## 开发一个简易的智能体

+ 提示词可以自己写之后，再交由AI进行优化，这样会比较好
+ 使用一个插件：头条搜索
+ 可以查看插件的输入参数和输出参数，考虑自己该怎么调用，怎么获取返回值
+ 智能体的发布，最简单的是发布在豆包中，其次是发布在自己的飞书里

## 插件的使用

+ 在 `技能 => 添加插件` 中，可以看到已有的多款插件
+ 支持自定义插件，集成需要的API

## 插件的创建

### 插件的相关概念

+ 每个`插件`可添加多个`工具`，每个工具都是一个独立的 `API 服务`。
+ 同一个插件内的不同工具必须使用相同的域名，即有相同的 endpoint。

+ 示例图：一个天气查询的 API Service: <http://api.weather.com> ，它有两个endpoint：

  + 工具1：查询当前天气：<http://api.weather.com/current>
  + 工具2：查询未来天气：<http://api.weather.com/forecast>

<img src="../assets/ai/coze/tools-in-plugin.png" alt="tools in plugin" width="100%" height="100%">

### 大模型的连接定义

+ <https://bailian.console.aliyun.com/?tab=api#/api/?type=model&url=2712576>
通过查看官网上的示例代码来了解它的使用方法，注意选择 curl 类型，这个是最标准的，其他的都是基于不同语言的写法

``` shell
curl --location "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation" \
--header "Authorization: Bearer $DASHSCOPE_API_KEY" \
--header "Content-Type: application/json" \
--data '{
    "model": "qwen-plus",
    "input":{
        "messages":[      
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "你是谁？"
            }
        ]
    },
    "parameters": {
        "result_format": "message"
    }
}'
```

+ 需要自行添加以下内容:

``` text
Authorization: Bearer sk-9ac0b88f2761408d865b21496591xxxx
Content-Type: application/json
```

### curl 的说明

+ “**curl**” 是一个非常常用的**命令行工具**，用于在终端（命令行）中 **发送网络请求、传输数据**。它的名字是 “**Client URL**” 的缩写，意思是“客户端 URL 工具”。
+ **curl** = 一个强大的命令行工具，支持 HTTP、HTTPS、FTP、FTPS、SMTP、SFTP 等多种协议，用来从服务器“获取”或“发送”数据。
+ **curl 是程序员的“网络瑞士军刀”🔧 —— 用命令行就能发请求、调接口、下文件，调试神器！**
+ 它**没有图形界面**，纯靠命令行操作，广泛用于：

  + 测试 API 接口
  + 下载文件
  + 调试网络请求
  + 自动化脚本中发送请求

### curl 和 wget 有什么区别？

+ 想**测试 API、发数据、调试接口** → 用 **curl**
+ 想**下载文件、镜像网页** → 用 **wget**

| 特性         | curl                          | wget                          |
|--------------|-------------------------------|-------------------------------|
| 主要用途     | 支持多种协议，侧重“发送请求”   | 侧重“下载文件”                |
| 是否递归下载 | ❌ 不支持                      | ✅ 支持（如下载整个网站）     |
| 是否默认保存 | ❌ 输出到终端                  | ✅ 自动保存为文件             |
| 协议支持     | ✅ HTTP, FTP, SMTP, SFTP 等    | ✅ 主要 HTTP/FTP              |

### 添加工具

使用HTTP方式调用时需配置的endpoint：POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions

<img src="../assets/ai/coze/add-tool-01.png" alt="add tool" width="100%" height="100%">

+ 配置输出参数，可以使用`自动解析`

+ 测试，发布插件

## 工作流的创建

+ 工作流中可以集成多个插件
+ 工作流名称一般用英文命名
+ 工作流节点中，标红的字段说明需要设置值

+ 实例中增加一个`变量聚合`节点，否则会报错





</BlogPost>
