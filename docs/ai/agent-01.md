---
title: AI Agents 开发
description: 
date: 2026-01-27
tags: [Agents]
---

## Agent 概念

+ Agent - 智能体，自主完成用户的请求
+ Agent = system_prompt（角色） + tools（工具调用） + rag（知识库）
+ LLM prompt = system prompt + tool prompt + rag prompt

## Tavily MCP

Tavily MCP 是一个基于 **Model Context Protocol**（MCP）标准的轻量级服务器，旨在为大语言模型（LLM）或AI助手提供**实时网络搜索、智能爬取和结构化数据提取**的能力。

其核心功能包括：

+ **为LLM优化的搜索**：Tavily 本身是一家专注于AI搜索的公司，其搜索结果经过专门优化，更适合大模型理解和使用。
+ **遵循开放标准**：通过 MCP 协议，Tavily MCP 能够与支持该协议的AI客户端（如 Cline、Cursor、Windsurf 等）无缝集成，使AI具备联网获取最新信息的能力。
+ **开源与可部署**：Tavily MCP Server 是一个开源项目，开发者可以自行部署，作为AI系统与互联网之间的桥梁，实现安全、高效的实时数据交互。
+ **工具化能力**：除了基本搜索，它还支持结构化数据提取，让AI不仅能“查到”，还能“理解并整理”网页内容。

简而言之，**Tavily MCP 让AI助手拥有了“上网查资料”的能力，并且查得准、用得好**，特别适用于需要实时、准确外部信息的AI应用场景。

## other
