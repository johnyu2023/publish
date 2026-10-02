---
title: Codex + Claude 协作开发
description: 
date: 2026-09-23
tags: [Codex, Claude Code]
---

## 引言：为什么我们需要多 Agent 协作？

在使用大语言模型（LLM）进行日常软件开发时，很多开发者都会遇到一个痛点：**上下文污染与指令遗忘**。当我们试图在一个超长的对话窗口中完成“需求分析 -> 架构设计 -> 拆解任务 -> 编写代码 -> 持续 Debug”的全流程时，AI 往往会陷入混乱，忘记最初的设计约束，甚至在修复一个 Bug 时引入两个新 Bug。

为了解决这个问题，我摸索出了一套基于 **ChatGPT (Codex)** 和 **Claude Code** 的多线程（Multi-Thread）、多角色解耦开发工作流。在这套工作流中，AI 被赋予了架构师、项目经理、协调员和执行者等不同角色，而开发者则退居幕后，成为了掌控全局的“调度枢纽”。

本文将详细拆解这套工作流的运转逻辑。

## 整体架构：各司其职的角色设定

在这套体系中，我们将庞大的开发任务按生命周期进行了严格的切割。每个节点都有专门的 Agent（Thread）负责，绝不越权：

* **🧠 Thread 1 (架构师)**：负责需求确认、多轮沟通与技术决策。
* **📋 Thread 2 (项目经理)**：负责整体计划、任务拆解与协调任务的打包。
* **🗣️ Thread 3 (协调员)**：负责管辖范围内的子任务下发与上下文策略制定。
* **🔍 Thread 4 (审核员)**：负责 Code Review、结果验收与返修策略制定。
* **🤖 Claude Code (执行引擎)**：负责在本地环境物理执行代码编写与修改。
* **👨‍💻 开发者 (人工总线)**：不直接写代码，而是作为状态同步器，负责在各个孤立的 AI Thread 之间搬运提示词、同步执行状态。

### 架构说明图

```mermaid
graph TB
    %% 样式定义
    classDef agent fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef doc fill:#fff3e0,stroke:#f57c00,stroke-width:1px,color:#000;
    classDef executor fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000;
    classDef bus fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000,stroke-dasharray: 5 5;

    %% -------------------------
    %% 控制平面 (大模型决策层)
    %% -------------------------
    subgraph ControlPlane ["控制平面 Control Plane : ChatGPT / Codex"]
        direction TB
        T1["Thread 1 : 架构师<br/>(需求与方案)"]:::agent
        T2["Thread 2 : 项目经理<br/>(规划与拆解)"]:::agent
        T3["Thread 3 : 调度员<br/>(任务下发)"]:::agent
        T4["Thread 4 : 审核员<br/>(代码验收)"]:::agent

        DocDesign[/"📄 任务设计<br/>(task-design.md)"/]:::doc
        DocPlan[/"📄 任务计划<br/>(task-plan.md)"/]:::doc

        %% 控制面内部数据流
        T1 --> DocDesign
        DocDesign --> T2
        T2 --> DocPlan
        DocPlan --> T3
    end

    %% -------------------------
    %% 人工总线 (隔离层)
    %% -------------------------
    subgraph HumanBus ["人工总线 Human Bus : 隔离与路由"]
        Dev(("👨‍💻 开发者<br/>(上下文调度器 / 状态同步)")):::bus
    end

    %% -------------------------
    %% 执行平面 (物理操作层)
    %% -------------------------
    subgraph ExecutionPlane ["执行平面 Execution Plane : 本地环境"]
        direction LR
        CC["🤖 Claude Code<br/>(代码执行引擎)"]:::executor
        FS[("💻 本地文件系统<br/>(Codebase / Git)")]:::executor
    end

    %% 执行面内部交互（拆成两条单向边，兼容性更好）
    CC -->|读写修改 / 运行测试| FS
    FS -->|返回结果| CC

    %% -------------------------
    %% 跨平面交互流 (API)
    %% -------------------------
    T3 -->|"Payload: 开发/返修提示词"| Dev
    Dev -->|"注入指令 & 重置上下文"| CC

    FS -->|"Payload: Diff / 运行日志"| Dev
    Dev -->|"上报执行状态"| T4

    %% -------------------------
    %% 架构级反馈闭环 (Feedback Loops)
    %% -------------------------
    T4 -.->|"闭环1: 推进任务游标"| T3
    T4 -.->|"闭环2: 异常回滚与重构"| T1
```

### 带泳道的跨职能流程图

```mermaid
graph TB
    %% ================= 样式定义 =================
    classDef dev fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000;
    classDef ai fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef cc fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,color:#000;
    classDef cond fill:#fffde7,stroke:#fbc02d,stroke-width:2px,color:#000;
    classDef warn fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000;
    classDef startend fill:#eceff1,stroke:#546e7a,stroke-width:2px,color:#000;

    %% ================= 泳道区 =================
    subgraph Swimlane_T1 ["🧠 Thread 1 : 架构师"]
        N_T1_Chat["多轮沟通分析需求与细节"]:::ai
        N_T1_Doc["产出: task-design.md"]:::ai
    end

    subgraph Swimlane_T2 ["📋 Thread 2 : 项目经理"]
        N_T2_Plan["拆分阶段任务<br/>打包为若干协调任务"]:::ai
        N_T2_Doc["产出: task-plan.md"]:::ai
    end

    subgraph Swimlane_T3 ["🗣️ Thread 3 : 协调员"]
        N_T3_Prompt["生成该阶段任务提示词<br/>(含上下文管理策略)"]:::ai
    end

    subgraph Swimlane_T4 ["🔍 Thread 4 : 审核员"]
        N_T4_Review["读取结果进行审核"]:::ai
        N_T4_Cond{"审核是否通过?"}:::cond
        N_T4_Repair["分析错误难度数量<br/>生成『返修提示词』"]:::ai
    end

    subgraph Swimlane_CC ["🤖 Claude Code 执行引擎"]
        N_CC_Exec["重置上下文<br/>执行阶段任务"]:::cc
        N_CC_Repair["依策略执行返修任务<br/>(保持/清空上下文)"]:::cc
    end

    subgraph Swimlane_Dev ["👨‍💻 开发者 (人工调度枢纽)"]
        N_Start(("任务开始")):::startend
        N_Dev_T2["携带文档与提示词<br/>创建新 Thread 2"]:::dev
        N_Dev_T3["下发首个协调任务<br/>创建新 Thread 3"]:::dev
        N_Dev_Copy["手动拷贝提示词<br/>下发给 CC"]:::dev
        N_Dev_T4["携带执行结果/状态<br/>创建新 Thread 4"]:::dev
        N_Dev_CopyRepair["按 Codex 建议拷贝<br/>返修提示词"]:::dev
        N_Dev_Commit["提交相关文件"]:::dev
        N_Dev_T3_Next{"本协调任务内<br/>阶段任务全完成?"}:::cond
        N_Dev_T3_Notify["通知 Thread 3<br/>下发下一个阶段"]:::dev
        N_Dev_T2_Next{"所有协调任务<br/>全部完成?"}:::cond
        N_End(("任务结束")):::startend

        %% 阻断处理逻辑
        N_Dev_Block["🚨 发现重大需求变更<br/>或严重代码阻断"]:::warn
        N_Dev_BlockCommit["尽力提交当前文件<br/>退回主任务(T1/T2)"]:::dev
        N_Block_NewT["拉取新 Thread <br/>多轮沟通重构方向"]:::dev
        N_Block_Cond{"能否继续现有架构?"}:::cond
        N_Block_Branch["拉取新分支<br/>重新开启任务设计"]:::dev
        N_Block_Resume["现有架构下继续"]:::dev
    end

    %% ================= 流程流转 (连线) =================
    %% 第一阶段
    N_Start --> N_T1_Chat
    N_T1_Chat --> N_T1_Doc
    N_T1_Doc --> N_Dev_T2

    %% 第二阶段
    N_Dev_T2 --> N_T2_Plan
    N_T2_Plan --> N_T2_Doc
    N_T2_Doc --> N_Dev_T3

    %% 第三阶段
    N_Dev_T3 --> N_T3_Prompt
    N_T3_Prompt --> N_Dev_Copy
    N_Dev_Copy --> N_CC_Exec

    %% 第四阶段
    N_CC_Exec --> N_Dev_T4
    N_Dev_T4 --> N_T4_Review
    N_T4_Review --> N_T4_Cond

    %% 审核不通过闭环 (返修 Loop)
    N_T4_Cond -->|否 Fail| N_T4_Repair
    N_T4_Repair --> N_Dev_CopyRepair
    N_Dev_CopyRepair --> N_CC_Repair
    N_CC_Repair -.->|开发者反馈返修结果| N_T4_Review

    %% 审核通过闭环 (推进任务)
    N_T4_Cond -->|是 Pass| N_Dev_Commit
    N_Dev_Commit --> N_Dev_T3_Next

    %% 阶段任务循环 (判断是否下发下一阶段)
    N_Dev_T3_Next -->|否| N_Dev_T3_Notify
    N_Dev_T3_Notify --> N_T3_Prompt

    %% 协调任务循环 (判断是否开启下一协调任务)
    N_Dev_T3_Next -->|是| N_Dev_T2_Next
    N_Dev_T2_Next -->|否| N_Dev_T3
    N_Dev_T2_Next -->|是| N_End

    %% ================= 阻断异常流 =================
    N_CC_Exec -.-> N_Dev_Block
    N_T4_Review -.-> N_Dev_Block
    N_Dev_Block --> N_Dev_BlockCommit
    N_Dev_BlockCommit --> N_Block_NewT
    N_Block_NewT --> N_Block_Cond

    %% 异常分支恢复
    N_Block_Cond -->|否| N_Block_Branch
    N_Block_Branch --> N_T1_Chat
    N_Block_Cond -->|是| N_Block_Resume
    N_Block_Resume --> N_Dev_T3
```

## 核心流程拆解：四个阶段的完美闭环

### 第一阶段：任务范围确认 (Thread 1)

一切始于需求的对齐。开发者首先与 Thread 1 开启多轮对话，深入分析需求细节，权衡并选择最合适的技术解决方案。

* **核心产出**：经过充分沟通后，Thread 1 会将最终的解决方案沉淀为一份《任务设计文档》（如 `task-design.md`）。
* **流转动作**：Thread 1 会自动生成用于开启下一阶段的提示词，并创建全新的 Thread 2。提示词中指定要先阅读这份任务设计文档。

### 第二阶段：任务规划与调度 (Thread 2)

在拿到 `task-design.md` 后，Thread 2 开始行使“项目经理”的职能，进行任务拆解与排期。

* **任务分界**：它会将总任务拆分为若干个“阶段任务”（例如 8 个），并设立高一级的“协调任务”来打包管理（例如协调任务A包含阶段1-3，协调任务B包含阶段4-5）。
* **核心产出**：生成《产出计划文档》（如 `task-plan.md`）。
* **流转动作**：Thread 2 负责依次逐步创建所有协调任务。下发首个协调任务时，它会生成专属提示词，开发者据此创建 Thread 3。只有当前协调任务彻底闭环，才会下发下一个。

### 第三阶段：协调任务与代码执行 (Thread 3 & Claude Code)

Thread 3 是一个细粒度的调度器，负责依次完成其所属的“阶段任务”。

* **精准下发**：它会依次给出每个阶段任务的**执行提示词**，并明确指明接下来的上下文管理策略（是保留现有上下文，还是彻底清空）。
* **人机协作**：开发者手动将提示词拷贝给本地终端中的 **Claude Code**。
* **执行与反馈**：Claude Code 在本地执行完毕后，开发者通知调度器 thread ，它会去创建 Thread 4 进行阶段任务的验收。在这个过程中，**不同阶段任务之间 Claude Code 的上下文是完全重置的**，有效杜绝了幻觉的产生。

### 第四阶段：阶段任务审核与返修回路 (Thread 4)

这是保证代码质量的关键节点。开发者将 Claude Code 的执行变更交由 Thread 4 进行审核。

* **Pass (审核通过)**：Thread 4 确认无误，开发者在本地 commit 提交相关文件。
* **Fail (审核失败与返修)**：如果存在问题，Thread 4 会分析错误的数量与修复难度，给出**第一个返修任务的提示词**。它还会向开发者建议：是在 Claude Code 的当前会话中继续返修，还是清空上下文独立返修。
* **返修死循环突破**：开发者将返修提示词喂给 CC 执行，完成后再次交由 Thread 4 审核，直到所有待返修任务清零，最终完成该阶段的验收。
* **结束本阶段**：开发人员向上级 thread 汇报，通知审核已完成，文件已提交，可以下方下一个任务了。上级 thread 验证后将下发下一个任务。

## 系统的“韧性”：异常阻断与回滚机制

在实际开发中，不可能永远一帆风顺。如果遇到**重大代码重构**或**突发的需求变更**导致流程无法推进，这套架构拥有健全的熔断机制：

1. **尽力提交**：发生阻断时，开发者会尽量把当前已完成、无破坏性的修改进行本地提交。
2. **跨级回溯**：退出底层的执行与审核循环，直接退回主任务节点（Thread 1 或 Thread 2），告知当前遇到的阻碍，要求其重新审视架构。
3. **分支决策**：

* 如果经过多轮沟通，确认可以在现有架构下继续，则重新下发提示词，流程恢复。
* 如果确认此路不通，开发者将在本地拉取新分支（Branch），开启一个全新的任务设计与执行流。待新分支攻克难点后，再合并回当前主分支。

## 结语

在这个 AI 辅助编程的时代，**“会写 Prompt”已经不再是护城河，真正的壁垒在于“如何编排 Prompt 和管理上下文状态”**。

通过这套将 ChatGPT (Codex) 作为“大脑/控制平面”，将 Claude Code 作为“手脚/执行平面”，将开发者自身作为“系统总线”的架构，我极大地提升了复杂项目的开发成功率。希望这种多线程、细粒度状态管理的工作流，能给同样在探索 AI 编程最佳实践的你带来一些启发。
