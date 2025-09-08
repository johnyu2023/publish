---
title: Transformer 揭秘02
description: Transformer 内部的实现机制
date: 2025-03-04
tags: [Transformer]
---

<BlogPost>

## 基本概念

## `文字序列`要解决的语义问题

### 编码器 & 解码器

+ Encoder 和 Decoder 过去都是以循环神经网络 RNN 为核心计算模块
+ 后来进化为由注意力机制 + 神经网络 组成

#### 过去以RNN为核心的Encoder Decoder有以下几个重要的问题

+ 1、信息丢失
+ 2、无法处理较长句子
+ 3、不能并行计算

## Attention - 注意力机制

### 注意力机制Attention - QKV 的定义和计算

+ Q 和 K 只是为了计算相关的注意力系数
+ 真正有价值的是 V ，最后的输出是 V 中每个元素的加权求和

## Self Attention - 自注意力机制

+ 相关度矩阵 - 这是大模型中最耗算力的地方



</BlogPost>
