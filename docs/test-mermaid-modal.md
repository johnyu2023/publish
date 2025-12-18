# Mermaid 弹框测试

这个页面用来测试 Mermaid 图表的点击弹框功能。

## 点击下方图表查看放大效果

### 流程图示例（默认尺寸）

```mermaid
graph TD
    A[开始] --> B[安装依赖]
    B --> C[配置 VitePress]
    C --> D[编写 markdown]
    D --> E[部署网站]
    E --> F[结束]
    F --> G[维护更新]
    G --> H[再次部署]
    H --> F
```

### 序列图示例（自定义尺寸 80% x 70%）

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant VitePress
    participant Mermaid

    User->>Browser: facesit website
    Browser->>VitePress: request page
    VitePress->>Mermaid: render chart
    Mermaid->>Browser: return SVG
    Browser->>User: show page
```

### 甘特图示例（自定义尺寸 90% x 85%）

```mermaid
gantt
    title 项目时间规划
    dateFormat  YYYY-MM-DD
    section 研究阶段
     设计1:  des1, 2025-01-01, 2025-01-05
     UI设计:   des2, 2025-01-06, 3d
    section 开发阶段
     前端开发:  dev1, 2025-01-09, 7d
     后端开发:   dev2, 2025-01-12, 7d
     测试:      test, 2025-01-17, 3d
```


### 复杂流程图示例（自定义尺寸 95% x 90%）

```mermaid
graph TD
    A[开始安装和配置] --> B[安装依赖包]
    B --> C{配置环境变量}
    C --> D[配置 VitePress 主题]
    D --> E[配置 Mermaid 支持]
    E --> F[开始开发]
    E --> G[____配置插件____]
    E --> H[配置自定义组件]
    H --> I[结束配置]
    G --> H[配置自定义组件]
    F --> J[____构建项目____]
    J --> K[配置]
    K --> L[____部署网站____]
    L --> M[结束]
    J --> M[结束]
    K --> M[配置]
```

## 功能描述

每个 Mermaid 图表现在都可以点击打开弹框，并放大到适合弹框的大小。点击图表任意位置即可打开弹框，点击右上角的关闭按钮或弹框外区域即可关闭。

### 新增功能：

1. **可配置弹框尺寸**：通过 `modalWidth` 和 `modalHeight` 属性设置弹框的宽度和高度，默认为 95%
2. **缩放功能**：弹框中提供 +、- 和重置按钮进行缩放，也可以使用鼠标滚轮缩放
3. **拖拽功能**：可以通过鼠标拖拽移动图表视图
4. **实时缩放比例显示**：显示当前图表的缩放比例

### 使用方法：

只需要使用标准的 mermaid 代码块语法即可，如上面的示例所示。