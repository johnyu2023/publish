---
title: LangChain 介绍 - 具备多轮记忆能力的对话链路
description: 
date: 2026-09-20
tags: [LangChain]
---

## 具备多轮记忆能力的对话链路

+ 示例代码使用 LangChain 框架和阿里云通义千问（ChatTongyi）模型，构建了一个具备多轮记忆能力的对话链路（Pipeline）。
+ 核心逻辑是利用 LangChain 表达式语言（LCEL）将 Prompt 和 LLM 组装成基础 Chain，然后用 RunnableWithMessageHistory 将其包装，实现根据 session_id 自动从内存字典（store）中读取和更新历史对话记录。

### 系统架构流图

+ 用 **Mermaid 流程图（Flowchart）** 来表达这种数据流和架构是非常合适的。由于这段代码的重点在于“组件的组装”和“数据的流转”，比起时序图，**系统架构流图**能更直观地展现 LangChain 的工作原理。

```mermaid
flowchart TD
    %% 定义样式
    classDef input fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef output fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef core fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef memory fill:#fff3e0,stroke:#e65100,stroke-width:2px;

    %% 外部输入输出
    Input([User Input<br>例如: 'Hi there!']):::input
    Config([Config<br>session_id: 'default']):::input
    Output([AI Response]):::output

    %% 记忆存储
    Store[(Memory Store<br>全局字典 store)]:::memory

    %% 核心执行链
    subgraph Conversation ["RunnableWithMessageHistory (conversation)"]
        direction TB
        
        LoadHistory[[get_session_history]]:::memory
        Prompt[ChatPromptTemplate<br>- system<br>- history<br>- human]:::core
        LLM[ChatTongyi<br>qwen-turbo]:::core
        SaveHistory[[Update History]]:::memory
        
        LoadHistory --> |提取历史| Prompt
        Prompt --> |拼接为完整 Messages| LLM
        LLM --> SaveHistory
    end

    %% 连线关系
    Input -->|传递输入| Conversation
    Config -.->|提供 session_id| LoadHistory
    Config -.->|提供 session_id| SaveHistory
    
    Store <==> |读/写| LoadHistory
    SaveHistory -.-> |追加新对话| Store
    SaveHistory --> |输出内容| Output

```

### 为什么这种表达方式最适合？

1. **解耦了核心链与记忆管理**：图中清晰地展示了基础的 `Prompt | LLM`（绿色部分）是被包裹在 `RunnableWithMessageHistory`（外层框）中的。这正是代码中 `chain = prompt | llm` 的直观体现。
2. **状态的可视化**：将 `store` 画成数据库/圆柱体图标，体现了它是独立于单次调用的全局状态。`config` 传入 `session_id` 作为钥匙去 `store` 里取数据的过程一目了然。
3. **LCEL 数据流向**：体现了 LangChain 中 `Input -> Prompt -> LLM -> Output` 这种经典的单向数据流。

### 时序图

```mermaid
sequenceDiagram
    participant User as 用户
    participant Conv as RunnableWithMessageHistory (包装器)
    participant Store as 内存存储 (store)
    participant Chain as 核心链 (Prompt | LLM)
    participant LLM as 通义千问模型

    Note over User, LLM: 第一轮对话
    User->>Conv: invoke({"input": "Hi there!"}, config)
    Conv->>Store: 根据 session_id 获取历史
    Store-->>Conv: 返回空历史 []
    Conv->>Chain: 注入历史 + 当前输入
    Chain->>LLM: 发送完整 Prompt
    LLM-->>Chain: 返回 AI 回复
    Chain-->>Conv: 返回结果
    Conv->>Store: 保存 (用户提问 + AI回复)
    Conv-->>User: 输出 AI 回复

    Note over User, LLM: 第二轮对话 (有记忆)
    User->>Conv: invoke({"input": "I'm doing well..."}, config)
    Conv->>Store: 根据 session_id 获取历史
    Store-->>Conv: 返回第一轮的历史记录
    Conv->>Chain: 注入历史 + 当前输入
    Chain->>LLM: 发送包含上下文的 Prompt
    LLM-->>Chain: 返回 AI 回复 (基于上下文)
    Chain-->>Conv: 返回结果
    Conv->>Store: 追加保存第二轮对话
    Conv-->>User: 输出 AI 回复
```
