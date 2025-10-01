---
title: Embeddings
description: 嵌入
date: 2025-09-15
tags: [Embeddings, 向量]
---

<BlogPost>

## 余弦相似度

+ 通过测量两个向量的`夹角的余弦值`来度量它们之间的`相似性`。
+ 判断两个向量⼤致方向是否相同，**方向相同时，余弦相似度为1**；两个向量**夹角为90°时，余弦相似度的值为0，方向完全相反时，余弦相似度的值为-1**。
+ 两个向量之间夹角的余弦值为[-1, 1]
+ 给定属性向量A和B，A和B之间的夹角θ余弦值可以通过点积和向量长度计算得出
  $$
  \cos \theta = \frac{A \cdot B}{||A|| \times ||B||}
  $$
  其中，$A \cdot B$ 表示向量A和B的点积，$||A||$ 和 $||B||$ 分别表示向量A和B的长度。

### 余弦相似度计算示例

#### 📘 两个三维向量的余弦相似度（Cosine Similarity）计算公式

设有两个三维向量：

$$
\mathbf{a} = \begin{pmatrix} a_1 \\ a_2 \\ a_3 \end{pmatrix}, \quad
\mathbf{b} = \begin{pmatrix} b_1 \\ b_2 \\ b_3 \end{pmatrix}
$$

它们的**余弦相似度**定义为：

$$
\text{cosine\_similarity}(\mathbf{a}, \mathbf{b}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \cdot \|\mathbf{b}\|}
= \frac{a_1 b_1 + a_2 b_2 + a_3 b_3}{\sqrt{a_1^2 + a_2^2 + a_3^2} \cdot \sqrt{b_1^2 + b_2^2 + b_3^2}}
$$

#### 📐 计算步骤

1. **计算点积（Dot Product）**：
   $$
   \mathbf{a} \cdot \mathbf{b} = a_1 b_1 + a_2 b_2 + a_3 b_3
   $$

2. **计算向量 \(\mathbf{a}\) 的模（L2 范数）**：
   $$
   \|\mathbf{a}\| = \sqrt{a_1^2 + a_2^2 + a_3^2}
   $$

3. **计算向量 \(\mathbf{b}\) 的模**：
   $$
   \|\mathbf{b}\| = \sqrt{b_1^2 + b_2^2 + b_3^2}
   $$

4. **代入公式计算余弦相似度**：
   $$
   \cos \theta = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \cdot \|\mathbf{b}\|}
   $$

---

#### 📌 举例说明

设：

$$
\mathbf{a} = \begin{pmatrix} 2 \\ 3 \\ 1 \end{pmatrix}, \quad
\mathbf{b} = \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix}
$$

##### 步骤 1：点积

$$
\mathbf{a} \cdot \mathbf{b} = 2 \times 1 + 3 \times 2 + 1 \times 2 = 2 + 6 + 2 = 10
$$

##### 步骤 2：模长

$$
\|\mathbf{a}\| = \sqrt{2^2 + 3^2 + 1^2} = \sqrt{4 + 9 + 1} = \sqrt{14}
$$

$$
\|\mathbf{b}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3
$$

##### 步骤 3：余弦相似度

$$
\cos \theta = \frac{10}{\sqrt{14} \times 3} = \frac{10}{3\sqrt{14}} \approx \frac{10}{11.225} \approx 0.891
$$

---

##### ✅ 最终结果

$$
\boxed{\cos \theta \approx 0.891}
$$

> 说明这两个向量方向比较接近（因为接近 1），夹角约为 $\cos^{-1}(0.891) \approx 27^\circ$。

---

#### 💡 小贴士（可选补充）

+ 余弦相似度范围：$-1 \leq \cos \theta \leq 1$
  + $\cos \theta = 1$ → 完全同向
  + $\cos \theta = 0$ → 正交（垂直）
  + $\cos \theta = -1$ → 完全反向

+ 余弦相似度**只关心方向，不关心大小**，因此常用于文本、图像等特征向量的相似度比较。

</BlogPost>
