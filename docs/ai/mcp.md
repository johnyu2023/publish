---
title: MCP 开发
description: 
date: 2026-02-10
tags: [MCP]
---

## MCP 概念



## 版本变更导致的差异

### 老版本的写法

```python
# dashscope==1.22.1
# mcp==1.7.1
# qwen_agent==0.0.19

import os
from pathlib import Path
from mcp.server.fastmcp import FastMCP

# 创建 MCP Server
mcp = FastMCP("桌面 TXT 文件统计器")

@mcp.tool()
def count_desktop_txt_files() -> int:
    """统计桌面上 .txt 文件的数量"""
    # 获取桌面路径
    desktop_path = Path(os.path.expanduser("~/Desktop"))

    # 统计 .txt 文件
    txt_files = list(desktop_path.glob("*.txt"))
    return len(txt_files)
```
