---
title: LaTeX 规范
description: 本网站使用的 LaTeX 编写规范，为了确保所有公式能够正确渲染，请遵循以下编写规范。
date: 2025-11-29
tags: [LaTeX]
---

<BlogPost>

# LaTeX 编写规范

本项目大量使用 LaTeX 来表示数学公式，为了确保所有公式能够正确渲染，请遵循以下编写规范。

## 1. 基本格式规则

### 1.1 行内公式

- 使用**单个美元符号** `$` 包围
- 格式：`$公式内容$`
- 示例：

  ```markdown
  $E = mc^2$
  $F = ma$
  $\cos \theta = \frac{A \cdot B}{||A|| \times ||B||}$
  ```

- 输出内容为：
  - $E = mc^2$
  - $F = ma$
  - $\cos \theta = \frac{A \cdot B}{||A|| \times ||B||}$

### 1.2 块级公式

- 使用**双美元符号** `$$` 包围
- 公式内容单独成行
- 示例：

  ```markdown
  $$
  \frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)
  $$

  $$
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
  $$
  ```

- 输出内容为：
  - 1
  $$
  \frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)
  $$

  - 2
  $$
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
  $$

## 2. 常用数学符号

### 2.1 分数

```markdown
$\frac{分子}{分母}$  # 行内分数
$$
\frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)  # 块级分数
$$
```

- 输出内容为：
  - 行内分数：$\frac{分子}{分母}$

  - 块级分数：
  $$
  \frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)
  $$

### 2.2 向量和矩阵

```markdown
# 向量表示
$\mathbf{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}$
$\textbf{v} = \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix}$

# 矩阵
$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$
```

- 输出内容为：
  - 向量表示：
    - $\mathbf{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}$
    - $\textbf{v} = \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix}$

  - 矩阵：
  $$
  \begin{bmatrix}
  1 & 2 & 3 \\
  4 & 5 & 6 \\
  7 & 8 & 9
  \end{bmatrix}
  $$

### 2.3 求和、积分、极限

```markdown
# 求和
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

# 积分
$$
\int_{a}^{b} f(x) dx
$$

# 极限
$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$
```

- 输出内容为：
  - 求和：
  $$
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
  $$

  - 积分：
  $$
  \int_{a}^{b} f(x) dx
  $$

  - 极限：
  $$
  \lim_{x \to \infty} \frac{1}{x} = 0
  $$

### 2.4 数学函数

```markdown
# 三角函数
$\cos \theta$、$\sin x$、$\tan \alpha$

# 对数函数
$\log_2 P(x_i)$、$\ln x$

# 指数函数
$e^{-(w^T x + b)}$、$2^x$
```

- 输出内容为：
  - 三角函数：$\cos \theta$、$\sin x$、$\tan \alpha$

  - 对数函数：$\log_2 P(x_i)$、$\ln x$

  - 指数函数：$e^{-(w^T x + b)}$、$2^x$

## 3. 特殊格式

### 3.1 文本模式

- 在数学公式中使用 `\text{}` 来插入普通文本
- 示例：

  ```markdown
  $$
  \text{总输入} = \text{权重} \cdot \text{输入} + \text{偏置}
  $$
  ```

- 输出内容为：
  $$
  \text{总输入} = \text{权重} \cdot \text{输入} + \text{偏置}
  $$

### 3.2 空格和间距

- 使用 `\quad` 产生中等空格
- 使用 `\qquad` 产生较大空格
- 示例：

  ```markdown
  $$
  \mathbf{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}, \quad
  \mathbf{b} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}
  $$
  ```

- 输出内容为：
  $$
  \mathbf{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}, \quad
  \mathbf{b} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}
  $$

### 3.3 括号和分隔符

- 使用 `\left(` 和 `\right)` 自动调整大小
- 示例：

  ```markdown
  $$
  \frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)
  $$
  ```

- 输出内容为：
  $$
  \frac{d}{dx}\left(\int_{0}^{x} f(t) dt\right) = f(x)
  $$

## 4. 项目中的常见模式

### 4.1 概率论公式

```markdown
# 条件概率
$$
P(A|B) = \frac{P(A \cap B)}{P(B)}
$$

# 贝叶斯定理
$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

# 正态分布
$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x - \mu)^2}{2\sigma^2}}
$$
```

- 输出内容为：
  - 条件概率：
  $$
  P(A|B) = \frac{P(A \cap B)}{P(B)}
  $$

  - 贝叶斯定理：
  $$
  P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
  $$

  - 正态分布：
  $$
  f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x - \mu)^2}{2\sigma^2}}
  $$

### 4.2 线性代数公式

```markdown
# 点积
$$
\mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + a_3 b_3
$$

# 模长
$$
\|\mathbf{a}\| = \sqrt{a_1^2 + a_2^2 + a_3^2}
$$

# 余弦相似度
$$
\text{cosine\_similarity}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \cdot \|\mathbf{b}\|}
$$
```

- 输出内容为：
  - 点积：
  $$
  \mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + a_3 b_3
  $$

  - 模长：
  $$
  \|\mathbf{a}\| = \sqrt{a_1^2 + a_2^2 + a_3^2}
  $$

  - 余弦相似度：
  $$
  \text{cosine\_similarity}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \cdot \|\mathbf{b}\|}
  $$

### 4.3 机器学习公式

```markdown
# sigmoid 函数
$$
P(y=1|x) = \frac{1}{1 + e^{-(w^T x + b)}}
$$

# 信息熵
$$
\boxed{I(X = x_i) = -\log_2 P(x_i)}
$$

# Softmax 函数
$$
P(\text{word}_i) = \frac{e^{\text{logit}_i}}{\sum_{j=1}^{V} e^{\text{logit}_j}}
$$
```

- 输出内容为：
  - sigmoid 函数：
  $$
  P(y=1|x) = \frac{1}{1 + e^{-(w^T x + b)}}
  $$

  - 信息熵：
  $$
  \boxed{I(X = x_i) = -\log_2 P(x_i)}
  $$

  - Softmax 函数：
  $$
  P(\text{word}_i) = \frac{e^{\text{logit}_i}}{\sum_{j=1}^{V} e^{\text{logit}_j}}
  $$

## 5. 编写最佳实践

### 5.1 避免的写法

- **不要**在 LaTeX 公式中使用中文标点符号
- **不要**在 `$...$` 内部使用多个 `$` 符号
- **不要**在块级公式前后缺少空行

### 5.2 推荐的写法

- **建议**在复杂公式前后添加空行
- **建议**使用 `\mathbf{}` 或 `\textbf{}` 来表示向量
- **建议**使用 `\boxed{}` 突出显示重要结果

### 5.3 调试技巧

1. **先写简单公式测试**：从 `$E = mc^2$` 开始
2. **逐步增加复杂性**：确保每一步都正确渲染
3. **参考现有文件**：查看 `docs-source/other/latex-test.md` 中的示例

## 6. 兼容性注意事项

### 6.1 项目兼容的 LaTeX 命令

基于项目现有文件分析，以下命令都被正确支持：

- 基础数学符号：`\frac`, `\sum`, `\int`, `\prod`
- 矩阵环境：`\begin{pmatrix}`, `\begin{bmatrix}`
- 文本模式：`\text{}`, `\mathbf{}`, `\textbf{}`
- 特殊符号：`\quad`, `\cdot`, `\times`, `\mid`, `\sim`
- 函数名：`\cos`, `\sin`, `\tan`, `\log`, `\ln`
- 格式命令：`\boxed{}`, `\left`, `\right`

### 6.2 需要谨慎使用的命令

如果某个 LaTeX 公式无法正确渲染，请：

1. 检查语法是否正确
2. 尝试简化公式
3. 参考项目中已有的类似公式写法
4. 考虑将复杂公式分解为多个简单公式

## 7. 示例参考

完整的示例可以参考：

- `docs-source/other/latex-test.md` - LaTeX 基础测试
- `docs-source/ai/embeddings.md` - 余弦相似度计算
- `docs-source/foundation/probability-theory.md` - 概率论公式
- `docs-source/foundation/linear-algebra-02.md` - 线性代数公式

---

**注意**：遵循本规范可以确保 LaTeX 公式在项目中正确渲染。如果遇到渲染问题，请优先参考现有文件的写法。

</BlogPost>
