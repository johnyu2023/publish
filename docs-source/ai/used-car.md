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

找 y 和一系列 x 的关系
分类和回归是一家，区别是连续的还是离散的

</BlogPost>
