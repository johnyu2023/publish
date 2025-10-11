---
title: 二手车预测价格大赛
description: 二手车预测价格大赛
date: 2025-09-27
tags: [机器学习]
---

<BlogPost>

## 二手车价格预测学习赛介绍

【AI入门系列】车市先知：二手车价格预测学习赛 <https://tianchi.aliyun.com/competition/entrance/231784/information>
<img src="../assets/ai/used-car/userd-car.png" alt="used-car-competition">

## 获取数据

### ossutil

+ `ossutil` 是阿里云官方提供的命令行工具，专门用于管理和操作其 **对象存储服务（OSS, Object Storage Service）**。它支持在 Windows、Linux 和 macOS 系统上运行，提供上传、下载、同步、复制、删除文件（Object）以及管理存储空间（Bucket）等丰富的功能 。
+ 该工具是 **阿里云专有的**，基于阿里云 OSS SDK 开发，主要面向使用阿里云 OSS 服务的开发者、运维人员和企业用户。目前已有两个主要版本：`ossutil 1.0` 和更高效、功能更强的 `ossutil 2.0` 。

### 阿里云里创建 AccessKey

+ 在阿里云控制台里创建 AccessKey，这样可以减少自己的完整账号密码被泄露的风险
+ 获得 accessKeyId、accessKeySecret

### 安装配置 ossutil

+ 根据自己的操作系统，从 [阿里云 OSS 工具下载页面](https://help.aliyun.com/document_detail/120092.html) 下载对应的版本。
+ 解压下载的文件，将 `ossutil` 可执行文件添加到系统 PATH 中，或者直接在终端中运行。
+ 在 windows 系统中，将 `ossutil.exe` 所在目录添加到环境变量中。
+ 在工作目录中，输入 `ossutil.exe` 来验证安装是否成功。

```powershell
# 检查版本号，验证是否安装成功
PS D:\2024-code\ai-lesson\07\userd-car> ossutil version
2.1.2
```

+ 执行 `ossutil config` 来配置 ossutil。按照提示，将 accessKeyId、accessKeySecret 输入，会生成一个文件

### 执行 `ossutil config` 来配置 ossutil

+ 在某个目录下，执行 `ossutil config` 命令
+ 按照提示输入 文件名、accessKeyId、accessKeySecret，其他都可以不输入。
+ 配置完成后，`ossutil` 会在当前目录下创建一个你输入的文件名的文件，存储访问凭证和其他配置信息。

### 通过 ossutil 复制文件

+ 官网上复制文件的命令，注意直接用这个会报错
+ 要加上一个参数 region

```powershell
# 官网上复制文件的命令，注意直接用这个会报错 
PS D:\2024-code\ai-lesson\07\userd-car> ossutil cp oss://tianchi-race-prod-sh/file/race/documents/231784/used_car_testA_20200313.csv.zip ./used_car_testA_20200313.csv.zip -i STS.NYhGEEDPzqVR8PxKbbiu8MLYG -k 5P6gpt3yUCKNjPRJ5A6mtUBZkQQKdZCEVTJvZ6AwbSkT --endpoint=oss-cn-shanghai.aliyuncs.com --sts-token=CAISvAN1q6Ft5B2yfSjIr5rdDP/xqY9bxpS5OnbJr2I3ZfoUoonypTz2IHhPfHlpAe0Zs/Q/nWpW6PYclrhvQKhJTFDNacJ62c4MqFzxP9JCFmEsHedW5qe+EE2/VjQhta27Opc9JbGwU/OpbE++2U0X6LDmdDKkckW4OJmS8/BOZcgWWQ/KClgjA8xNdCRvtOgQN3baKYy/UHjQj3HXEVBjtydllGp78t7f+MCH7QfEh1CI/I0hro/qcJ+/dJsubtUtT9a82ud2d+/b2SVdrgBQ86szl6wD9zbDs5aHClJcpBmBOPfR/9tzN0gjPfFlS/IDsePxmcpzs/bki4ns1z96Z7kPC3yEHdvmy9DaXvGoLpQbDe+nYi2dg4/Xb8Gk7V15MS8hWVkUK4Z7GBhZEgcxTzzWEKij9W3Rbx2rI6r/i/lticoslwi3oIrafgLRHeXHy1gEO5Y6ZEMpchIfwWX6f7NDbhRIdFprF2ddlHPVh7k0Q8rKyu6yPkUIphk/13bu8ml5T9GxQzFeT0DroGsM5eWnQlFQO3DdYZzAJCkaOpKrP/go/ocTd7HxFt3h4qGnBcSibFRvh0tkTm65x0IagAEJYTKND+F5bb7t9sMjTGX9I41lmPCxKOiuk3kMkfXraNhUGN7Rn+2JfRoafycUSqSEOGdsqF5k7XWAl23QtP0xsHVIRr5Dlm4oYMNmNRzpa0zC5+3oeS+fSldpsAqM2aEgZE1ta742thAr1bGhbDq8JiyeU1TruWyLf2GSlTttCCAA
Error: region must be set in sign version 4.

# 添加一个参数 region，就能正确下载了
PS D:\2024-code\ai-lesson\07\userd-car> ossutil cp oss://tianchi-race-prod-sh/file/race/documents/231784/used_car_testA_20200313.csv.zip ./used_car_testA_20200313.csv.zip -i STS.NYhGEEDPzqVR8PxKbbiu8MLYG -k 5P6gpt3yUCKNjPRJ5A6mtUBZkQQKdZCEVTJvZ6AwbSkT --endpoint=oss-cn-shanghai.aliyuncs.com --sts-token=CAISvAN1q6Ft5B2yfSjIr5rdDP/xqY9bxpS5OnbJr2I3ZfoUoonypTz2IHhPfHlpAe0Zs/Q/nWpW6PYclrhvQKhJTFDNacJ62c4MqFzxP9JCFmEsHedW5qe+EE2/VjQhta27Opc9JbGwU/OpbE++2U0X6LDmdDKkckW4OJmS8/BOZcgWWQ/KClgjA8xNdCRvtOgQN3baKYy/UHjQj3HXEVBjtydllGp78t7f+MCH7QfEh1CI/I0hro/qcJ+/dJsubtUtT9a82ud2d+/b2SVdrgBQ86szl6wD9zbDs5aHClJcpBmBOPfR/9tzN0gjPfFlS/IDsePxmcpzs/bki4ns1z96Z7kPC3yEHdvmy9DaXvGoLpQbDe+nYi2dg4/Xb8Gk7V15MS8hWVkUK4Z7GBhZEgcxTzzWEKij9W3Rbx2rI6r/i/lticoslwi3oIrafgLRHeXHy1gEO5Y6ZEMpchIfwWX6f7NDbhRIdFprF2ddlHPVh7k0Q8rKyu6yPkUIphk/13bu8ml5T9GxQzFeT0DroGsM5eWnQlFQO3DdYZzAJCkaOpKrP/go/ocTd7HxFt3h4qGnBcSibFRvh0tkTm65x0IagAEJYTKND+F5bb7t9sMjTGX9I41lmPCxKOiuk3kMkfXraNhUGN7Rn+2JfRoafycUSqSEOGdsqF5k7XWAl23QtP0xsHVIRr5Dlm4oYMNmNRzpa0zC5+3oeS+fSldpsAqM2aEgZE1ta742thAr1bGhbDq8JiyeU1TruWyLf2GSlTttCCAA --region=cn-shanghai
Success: Total 1 object, size 7997907 B, Download done:(1 files, 7997907 B), avg 10.466 MiB/s

0.758258(s) elapsed
```

## 训练集和测试集的处理

> 在机器学习项目中，**如何正确处理训练集和测试集**直接关系到模型的泛化能力和评估结果的可靠性。

+ ✅ 正确做法：**只基于训练集（train set）进行数据探索和预处理规则的制定，然后将相同的规则应用到测试集（test set）上。**

+ 🚫 绝对不能做的事：
  + **用测试集的信息来指导训练集的预处理**（比如：用整个数据集的均值/众数填充缺失值）
  + **在划分训练/测试集之前就做预处理**（除非是无监督的、不依赖标签的全局操作，如单位换算，但仍需谨慎）

> 这会导致 **数据泄露（Data Leakage）** —— 模型“偷看”了测试集的信息，导致评估结果过于乐观，上线后性能大幅下降。

---

### ✅ 正确流程（以价格预测为例）

#### 第 1 步：**先划分数据**

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

> ⚠️ 一旦划分完成，**测试集就“锁起来”**，后续所有决策（包括缺失值填充、标准化、编码等）**只能基于 X_train 和 y_train**。

---

#### 第 2 步：**仅在训练集上做 EDA 和预处理规则学习**

+ 计算训练集的：
  + 数值特征的**中位数/均值**（用于填充缺失值）
  + 分类特征的**众数**
  + 标准化所需的**均值和标准差**
  + 类别编码的**映射字典**（如 one-hot 的类别列表）
  + 异常值处理的阈值（如 IQR 上下界）

> 📌 所有这些统计量都**只来自训练集**！

---

#### 第 3 步：**将相同的预处理规则应用到测试集**

+ 用**训练集计算出的中位数**去填充测试集的缺失值

+ 用**训练集的均值和标准差**去标准化测试集
+ 用**训练集学到的类别映射**对测试集做编码
  + 如果测试集出现训练集没见过的类别 → 视为“未知”或丢弃

> ✅ 这样模拟了**真实场景**：模型上线后，新数据（相当于测试集）必须用训练时学到的规则处理。

---

### 🌰 举例说明（错误 vs 正确）

#### ❌ 错误做法（数据泄露）

```python
# 先合并 train + test 做填充（泄露！）
df_all = pd.concat([train, test])
df_all['power'].fillna(df_all['power'].median(), inplace=True)  # 用了 test 的信息！
```

#### ✅ 正确做法

```python
# 1. 先划分
X_train, X_test, y_train, y_test = ...

# 2. 从训练集学规则
power_median = X_train['power'].median()
gearbox_mode = X_train['gearbox'].mode()[0]

# 3. 应用到各自数据集
X_train['power'].fillna(power_median, inplace=True)
X_test['power'].fillna(power_median, inplace=True)   # ← 用的是 train 的 median！

X_train['gearbox'].fillna(gearbox_mode, inplace=True)
X_test['gearbox'].fillna(gearbox_mode, inplace=True)
```

---

### 🤔 那能不能“看看”测试集？

+ **可以看**（比如检查格式、字段是否一致），但**不能用它的统计信息做任何决策**。

+ 在竞赛或实际项目中，有时测试集会故意包含训练集没有的类别或异常分布，这正是考验模型鲁棒性的地方。

---

### ✅ 总结

| 问题 | 正确答案 |
|------|--------|
| 要不要对测试集做预处理？ | **要**，但必须用**训练集学到的规则** |
| 能不能用测试集的统计量（如均值、众数）？ | **绝对不能** |
| 预处理前要不要看测试集？ | 可以**检查结构**，但**不能用于制定预处理策略** |
| 核心原则是什么？ | **防止数据泄露，模拟真实预测场景** |

> 🎯 记住：**测试集代表未来未知的数据，模型只能依赖训练中学到的知识来处理它。**

## 测试集如何做数据的预处理

> **测试集也需要做预处理（包括填充缺失值），但必须使用从训练集中学到的规则和统计量来处理。**

### 🎯 核心原则再强调

+ **训练集**：用来 **学习** 预处理规则（如中位数、众数、编码映射、缩放参数等）。
+ **测试集**：**不能参与学习**，但**必须经过相同的预处理流程**，才能输入给模型。

> 模型是在“处理过的训练数据”上训练的，所以**测试数据必须经过完全相同的变换**，否则特征空间不一致，预测会出错！

---

### 🌰 举个具体例子

假设 `power`（发动机功率）字段在训练集和测试集中都有缺失：

#### 步骤 1：从训练集学习填充规则

```python
# 仅用训练集计算中位数
power_median = X_train['power'].median()  # 比如结果是 120
```

#### 步骤 2：分别对训练集和测试集应用该规则

```python
# 填充训练集
X_train['power'].fillna(power_median, inplace=True)

# 填充测试集 ← 用的是训练集的 median！
X_test['power'].fillna(power_median, inplace=True)
```

✅ 这样：

+ 没有数据泄露（测试集没参与计算 median）
+ 测试集被正确预处理，可以输入模型

---

### ❌ 如果不处理测试集的缺失值会怎样？

+ 大多数模型（如 sklearn 的 RandomForest、XGBoost）**无法处理 NaN**

+ 会直接报错：`ValueError: Input contains NaN`
+ 即使某些模型支持（如 LightGBM），其内部处理方式可能与你训练时不同，导致结果不可控

---

### 📌 其他预处理操作同理

| 预处理操作       | 训练集怎么做                     | 测试集怎么做                               |
|------------------|----------------------------------|------------------------------------------|
| 缺失值填充       | 计算中位数/众数                  | 用训练集的中位数/众数填充                |
| 标准化（StandardScaler） | fit + transform             | **只 transform**（用训练集的 mean/std） |
| One-Hot 编码     | fit + transform（学习类别）      | **只 transform**（未见类别需处理）       |
| 异常值截断       | 根据 IQR 或分位数设定上下限      | 用训练集的上下限截断                     |

> 🔑 关键词：**训练集 fit，测试集只 transform**

---

### 💡 实际代码建议（使用 sklearn Pipeline）

```python
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

# 构建预处理 + 模型的 pipeline
pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),  # 自动用训练集 median
    ('scaler', StandardScaler()),                   # 自动用训练集 mean/std
    ('model', RandomForestRegressor())
])

# 只在训练集上 fit 整个 pipeline
pipe.fit(X_train, y_train)

# 自动对测试集做相同预处理 + 预测
y_pred = pipe.predict(X_test)  # 内部已处理缺失值、标准化等
```

这样能**自动避免数据泄露**，且保证训练/测试处理一致。

---

### ✅ 总结

| 问题 | 回答 |
|------|------|
| 测试集要不要做缺失值填充？ | **要！** |
| 用什么值填充？ | **必须用训练集计算出的统计量（如中位数、众数）** |
| 能不能跳过测试集预处理？ | **不能！否则模型无法预测或结果错误** |
| 核心思想？ | **测试集必须经历和训练集完全相同的预处理流程，但不能贡献任何信息给这个流程** |

## AI辅助的数据预处理

### EDA 分析

+ 编写Python，读取 used_car_train_20200313.csv 前5行数据，显示全部列
+ 理解这些字段的含义，写入到 .md ，注意用中文回答
+ 帮我做 EDA （Explorer Data Analysis）
+ 通过EDA，对 used_car_train_20200313.csv 如何进行数据预处理，有什么建议，先不写代码，输出到 .md 文件中

### 数据预处理建议

``` text
1. 数据特征处理，单独写一个python，针对 训练集 （used_car_train_20200313.csv） 进行特征预处理，并将预处理的结果进行保存，方便后续模型训练，同时记录相关中位数，处理后的文件保存到 used_car_train_20200313_pro.csv
2. 处理完训练集后，用同样的逻辑去处理测试集（used_car_testB_20200313.csv） 的数据，但需要注意的事用之前测试集处理中记录的中位数去处理测试集，结果保存到 used_car_testB_20200313_pro.csv

处理方式：
1 异常值处理
- price字段存在负值，删除即可
- kilometer字段中存在异常值（如3972, 1278等），这些可能是数据录入错误，如果数值大于100，则可认为是误将单位弄错成公里，则将数值处于10000。小于100的认为是合理值，不做处理。
- power字段中的异常值（如7515），规定设置上限为600，超过上限的一律修改为600
- regDate, creatDate 需要转化为日期类型，比如 2016-01-01
- 将kilometer、power、gearbox等object类型的字段转换为数值型，对转换中产生的 NaN 值用中位数填充
2 缺失值策略
- **v_12**: 只有0.4%缺失，用中位数填充
- **v_13**: 2.2%缺失，用中位数填充
- **v_14**: 7.4%缺失，用回归方法预测缺失值
- notRepairedDamage字段（汽车有尚未修复的损坏）中的'-'值设置为1（意为 否）
- 将'-'、'0'、'0.0'统一处理为0
- 将'1'、'1.0'统一处理为1
```

### 预处理总结

``` text
# 预处理总结

  成功完成了二手车数据集的预处理任务！以下是主要成果：

  1. 数据预处理完成情况
   - 训练集 (used_car_train_20200313.csv)：
     - 原始数据：150,000 行 × 31 列
     - 预处理后：148,429 行 × 31 列（删除了1,571行负价格数据）
     - 已保存为：used_car_train_20200313_pro.csv

   - 测试集 (used_car_testB_20200421.csv)：
     - 原始数据：50,000 行 × 30 列（无price列）
     - 预处理后：50,000 行 × 30 列
     - 已保存为：used_car_testB_20200421_pro.csv

  2. 预处理操作
   1. 异常值处理：
      - 删除训练集中负价格数据（1,571行）
      - 处理kilometer异常值（>100的值除以10000）
      - 限制power值上限为600

   2. 数据类型转换：
      - 将kilometer、power、gearbox转为数值型
      - 将regDate、creatDate转为日期格式

   3. 缺失值处理：
      - kilometer、power、gearbox用中位数填充
      - v_12、v_13用中位数填充
      - v_14用回归模型预测（基于其他特征）或中位数填充

   4. 分类变量处理：
      - 将notRepairedDamage统一编码（'-'、'0'、'0.0' → 0；'1'、'1.0'、其他 → 1）

  3. 保存的参数
  预处理参数已保存至 preprocessing_params.pkl，包含：
   - 各列的中位数（用于测试集填充）
   - v_14回归预测模型
   - v_14预测使用的特征列表

  4. 预处理脚本
  脚本 feature_preprocessing_fixed.py 包含完整的预处理逻辑，可用于对新数据进行相同处理。

  所有数据已准备就绪，可以用于后续的机器学习模型训练和预测。
```

## 建模，做第一次预测

``` text
刚才我们做了这些特征预处理，现在针对训练数据集（used_car_train_20200313_pro.csv），使用 随机森林 进行建模，并对测试集（used_car_testB_20200313_pro.csv）进行预测，将预测结果写入到 rf_result.csv
表头是：SaleID, price
```

## 改进版本 v1.0


``` text
刚才的结果不理想，我们换个模型，请帮我使用XGBoost进行预测。
针对训练数据集（ used_car_train_20200313_pro.csv ），使用 随机森林 进行建模，并对测试集（ used_car_testB_20200421_pro.csv ）进行预测，将预测结果写入到 XGBoost_result.csv
表头是：SaleID, price
```

## 改进版本 v1.1

``` text
现在预测的偏差还有些大。
你可以先看下 原始price的min, max
感觉现在预测出来的price 范围和之前的训练集的price的范围不同
```

## 答疑摘要

+ 通过和AI聊天，让AI帮我们提取二手车的特征
+ AI 动手能力很强，人要做决策

## 二手车大赛分数想要提高，思路是

1. 做好特征工程是王道。把特征工程确定下来，把网络模型也确定下来，做好训练方式，就可以了。
2. 借助AI，对特征工程有更多掌控感。让 AI 先梳理一下特征工程，把特征工程列出来，我们人工复核哪些是可行的特征，哪些是不可行的特征。
3. 划分训练集和测试集，避免过拟合。测试集不能参与模型训练，只能用来评估模型的性能。测试集数据大概在10%左右即可。
4. 本地测试集的评分，和上传到阿里云上的最终评分比较一致。

## 资金流入流出大赛

+ 上次给大家提的`周期因子`，可以得到一个比较好的分数。
+ 如果想进一步的提升，那模型要复杂一点，是不是可以用lstm来去完成
+ 也可以跟AI呢来去聊一聊啊

</BlogPost>
