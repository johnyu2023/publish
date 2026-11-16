---
title: Code Agent 自动化范式
description: 告别手动盯盘：AI 编程 Agent 的三大自动化范式
date: 2026-10-02
tags: [LangChain, /loop, /goal, /schedule]
---

在使用 AI 编程工具时，我们大多数时候仍处于“一问一答”的被动模式：下达指令、盯着屏幕等它改完、手动跑一下测试、把报错贴回去让它继续改，或者守着终端干等 CI 流水线跑完。

随着 Claude Code、OpenAI Codex、Cursor 等工具的演进，AI Agent 正在从“结对编程助手”向“自主值班工程师”跨越。以 Claude Code 中的三个核心指令——`/goal`、`/loop` 和 `/schedule` 为切入点，我们可以清晰地看懂现代 AI 编程 Agent 最核心的三大自动化工程范式：**目标闭环（Verification Loop）**、**会话心跳（Session Heartbeat）** 与 **云端例程（Cloud Routines）**。

## 一、从 Claude Code 看懂三大自动化指令

在日常研发中，“让 AI 自己跑起来”其实对应着三种截然不同的工程诉求。Claude Code 将它们拆解为了三个显式的斜杠指令：

| 指令 | 核心定位 | 驱动逻辑 | 运行环境与生命周期 | 底层停止机制 |
| --- | --- | --- | --- | --- |
| `/goal` | 目标执行器(不达目的不罢休) | 条件驱动：消除回合停顿，上一轮结束立即开启下一轮 | 本地当前 CLI 会话（支持跨中断恢复） | 独立小模型裁判（Stop Hook）：每轮结束后由 Haiku 模型评估是否达标 |
| `/loop` | 本地轮询器(开着终端帮我盯梢) | 时间驱动（本地）：按固定周期或由 AI 动态延迟（1m~1h）唤醒 | 本地当前 CLI 会话（终端关闭即失效，最长 7 天过期） | 满足提示词条件后调用 `ScheduleWakeup(stop: true)` 自停，或按 `Esc` 中断 |
| `/schedule` | 云端例程 Routines(把电脑关了也能跑) | 时间 / 事件驱动（云端）：定时（最小 1h）、GitHub 事件或 API 触发 | Anthropic 托管云容器（每次从 GitHub 克隆仓库拉起新会话，永久常驻） | 单次拉起的云端会话执行完毕即止；例程本身持续等待下一次触发 |

### 1. `/goal`：条件驱动的“连续攻坚战”

当你面对一个确定性目标（如大规模重构、模块迁移、修完所有单测报错），不需要中间停顿，只需要 AI 马不停蹄地连续迭代时，使用 `/goal`。

* **工作原理：** 它是会话级的 **Stop Hook 包装器**。每当主模型完成一轮修改，系统会自动将“当前进展 + 目标条件”发给独立的轻量级裁判模型（如 Haiku）。若裁判判定“未达成”，会将原因作为反馈塞回主模型，立即启动下一轮。
* **实战示例：**

```text
/goal 将所有旧版请求模块迁移至新 API，直到全部调用点编译通过且 pytest 退出码为 0，期间不得修改任何测试文件。

```

### 2. `/loop`：陪伴当前开发的“临时值班员”

当你正在本地开发，手头有一个异步状态（如刚提了 PR 等待 CI 结果、刚发版需要盯紧线上错误日志）需要隔几分钟看一眼时，用 `/goal` 会造成无意义的死循环空转，此时应使用 `/loop`。

* **4 种实用调用模式：**
* **动态间隔（最推荐）：** `/loop 检查当前分支 PR 状态，CI 挂了就拉取日志修复并推送，全绿且无新评论则停止循环`（省略时间，Claude 会在 1 分钟到 1 小时之间智能调整检查频率）。
* **固定间隔：** `/loop 5m 运行 ssh prod 'tail -100 /var/log/error.log'，发现新 ERROR 则定位原因，连续 6 次正常则停止`。
* **嵌套技能：** `/loop 30m /review-pr 1234`（周期性调用其他斜杠技能）。
* **自定义值班清单（`.claude/loop.md`）：** 在项目下配置 `.claude/loop.md` 定义常规巡检动作（查 CI、查未处理异常、领 TODO 任务），平时只需敲入 `/loop` 即可进入自动值班状态，且修改文件后在下一轮立即热生效。

### 3. `/schedule`：脱离本地的“7×24 云端流水线”

`/loop` 绑死在本地终端进程上，合上笔记本就会中断。如果需要跨天常驻、团队共享或响应外部 Webhook，则使用 `/schedule`（对应官方的 **Routines** 功能）。

* **工作原理：** 任务运行在云端隔离容器中，自动克隆 GitHub 仓库并加载预配置的 MCP 连接器（Slack、Jira、Sentry 等）。
* **典型场景：** 每天早上 8 点自动汇总过去 24 小时的新 Issue 并分配标签；或每周五自动扫描本周合并的 PR，检测 API 变动并提交文档更新 PR。

## 二、横向对比：其他主流 Code Agent 是如何实现的？

这三种能力并非 Claude Code 独有，它们在 **OpenAI Codex**、**Cursor**、**Aider** 和 **OpenClaw** 等主流工具中有着清晰的架构映射，只是各家在“交互入口”与“本地/云端重心”上取舍不同：


| 自动化范式 | Claude Code | OpenAI Codex (CLI + Cloud) | Cursor (IDE + Cloud) | Aider / OpenClaw (极客/开源框架) |
| :--- | :--- | :--- | :--- | :--- |
| **1. 目标验证闭环**<br><br>(Verification Loop) | `/goal` 指令<br><br>（内置独立裁判模型每轮验收） | 内化为底层默认行为<br><br>（CLI 的 `--full-auto` 模式，或 Cloud 沙箱内跑通测试才交卷） | Agent Mode + Auto-run<br><br>（自动捕获终端与 Lint 报错并持续修复） | Aider `--auto-test`<br><br>（测试退出码非 0 则将报错塞回模型重修） |
| **2. 会话心跳轮询**<br><br>(Session Heartbeat) | `/loop` + `loop.md`<br><br>（保持当前会话上下文定时唤醒） | 无原生 CLI 轮询命令<br><br>（需靠外部 `watch` 包裹 `codex -q` 静默模式） | 无本地定时器<br><br>（鼓励直接转交云端 Background Agent） | OpenClaw `Heartbeat`<br><br>（读取 `HEARTBEAT.md` 在主会话定时注入指令） |
| **3. 云端异步调度**<br><br>(Cloud Cron / Background) | `/schedule` **(Routines)**<br><br>（云容器克隆仓库，定时/事件/API 触发） | Codex Cloud + Automations<br><br>（多容器高并发并行跑任务，支持定时与事件触发） | Background Agents<br><br>（云端 VM 隔离分支，支持 Slack `@cursor` 触发与无头浏览器录屏验证） | OpenClaw `cron`<br><br>（独立隔离会话定时任务；Aider 需挂载 GitHub Actions） |

### 核心设计哲学差异：Claude Code vs. OpenAI Codex

对比表格可以发现一个非常有趣的架构分野：

* **Claude Code 是“自下而上（CLI-First）”：** 它先把本地终端的能力武装到牙齿，让你能细腻地控制当前会话是“连续攻坚（`/goal`）”还是“定时打盹（`/loop`）”，然后再通过 `/schedule` 把能力延伸到云端。
* **OpenAI Codex 是“自上而下（Cloud-First）”：** Codex 从设计之初就主打**云端异步委派**。在 Codex Cloud 中，“跑通测试才交卷（`/goal`）”是沙箱的出厂默认行为；遇到耗时任务或需要盯盘的场景，OpenAI 认为你应该直接派发给云端容器在后台跑（对应 `/schedule`），因此 Codex CLI 干脆省略了本地 `/loop` 命令。如果在本地必须用 Codex CLI 做轮询，通常需要借助系统级 `watch` 命令组合：

```bash
watch -n 300 "codex -q --full-auto '检查当前分支 CI 状态，若失败则拉取日志尝试修复'"

```

* **OpenClaw 的命名巧合：** 在开源框架中，OpenClaw 的设计与 Claude Code 最为神似——它的 `Heartbeat`（配合 `HEARTBEAT.md`）完美对应 `/loop`（配合 `loop.md`），用于在保持上下文的主会话中做轻量巡检；而它的 `Cron` 则对应 `/schedule`，用于拉起干净的独立会话跑定时重任务。

## 三、实战进阶：组合拳打造“无人值守研发流水线”

真正高效的工程实践，不是孤立地使用某一个指令，而是将它们**嵌套串联**起来。以下是经过实战检验的“四层自动化组合拳”：

1. **触发层（`/schedule` 云端定时唤醒）：** 配置云端 Routine，每小时扫描一次项目的 Bug 反馈渠道或新增 Issue。
2. **控制层（`/goal` 设定本轮清空条件）：** 在唤醒提示词中挂载 `/goal`——*“本轮发现的每一条可复现 Bug，必须完成复现单测编写、代码修复且测试全部通过后才允许结束会话”*。
3. **规范层（`SKILL.md` / `CLAUDE.md` / `AGENTS.md` 量化标准）：** 将团队的代码规范、测试命令和“什么叫修好了”的验收标准写入项目级规范文件，给裁判模型提供明确的判断依据。
4. **权限层（开启 `Auto Mode` / `--full-auto`）：** 消除单轮内部工具调用的人工确认弹窗，让 Agent 在沙箱或受控分支内一气呵成并最终提交 PR。

## 四、落地避坑指南

在将这些自动化循环引入日常开发前，务必注意以下三个工程边界：

* **警惕“Token 刺客”，必写退出条件：** 无论是 `/loop` 还是 `/goal`，如果目标模糊或缺少终止条件，极易陷入死循环（例如 `/loop` 固定间隔默认长达 7 天才过期）。在提示词中务必加上明确的熔断条件（如*“部署成功后停止循环”*或*“若连续尝试修复 3 次仍失败，立即停止并输出诊断报告”*）。
* **给裁判模型提供“客观信号”：** 在使用 `/goal` 或 Codex `--full-auto` 时，不要写“把代码优化得更优雅”这种主观目标，而要给可执行的命令信号（如 `pytest 退出码为 0`、`tsc --noEmit 无报错`、`git diff 行数小于 200`）。
* **本地长时挂机配合 `tmux`：** 像 `/loop` 这类会话级指令依赖终端进程存活。如果需要在本地开发机或跳板机上长时间运行，务必将其放入 `tmux` 或 `screen` 会话中，防止网络抖动或终端关闭导致值班中断。

掌握了 **目标闭环（Goal）**、**会话心跳（Loop）** 和 **云端调度（Schedule）** 这三把钥匙，无论你手头使用的是 Claude Code、Codex 还是其他自研 Agent 框架，都能真正把重复的“盯盘与试错”交给机器，将精力集中在核心架构与业务决策上。
