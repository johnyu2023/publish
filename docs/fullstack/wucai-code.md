---
title: wucai-code 使用
description: wucai-code 是一个基于 node.js 的命令行工具，用于 AI Coding 
date: 2025-09-18
tags: [wucai-code]
---

## wucai-code 介绍

+ <https://github.com/cystanford/wucai-code>
+ Yang Chen 博士开发，他的培训课程中推荐使用
+ 基于 gemini-cli 开发的一款 AI Agent 工具

## 安装 wucai-code

+ 建议使用 nvm 管理 node.js 版本
+ 升级 node.js 到至少 v22.19.0 或更高版本。
+ 执行 `npm install -g @wucai/wucai-code@latest`
+ 在任何一个目录下，执行 `cmd` 命令，在命令行窗口中，输入`wucai`

![install wucai-code](/assets/fullstack/wucai-code/install-wucai-code.png)

## 更新 wucai-code

+ 由于是全局安装，所以可以在任务目录下执行更新命令
+ 执行 `npm install -g @wucai/wucai-code@latest`

## 身份认证方式

![auth](/assets/fullstack/wucai-code/auth.png)

+ 身份认证是为了判读用什么身份去调用大语言模型
+ 输入 /auth 切换认证方式
+ 支持方式一： 通过 dashscope 认证
+ 支持方式二： 通过 qwen 认证
+ 目前通过 qwen 认证方式，每天赠送2000次访问

## 工作目录和授权方式

+ 在任何需要工作的目录，通过 cmd 或 powershell 窗口，执行 `wucai` 命令，就能启动 wucai-code
+ 会询问对该工作目录的授权方式，一般就选`是，始终允许`即可。

![always-true](/assets/fullstack/wucai-code/always-true.png)

