---
date: 2025-07-16
title: Function Calling 的原始形态
description: 探索大语言模型函数调用的基本实现方式
---

<BlogPost>

# Function Calling 的原始形态


## 1. 一个示例程序

``` python
#!/usr/bin/env python
# coding: utf-8

# In[3]:


import json
import os
import random
import dashscope
from dashscope.api_entities.dashscope_response import Role

# 从环境变量中，获取 DASHSCOPE_API_KEY
api_key = os.environ.get('DASHSCOPE_API_KEY')
dashscope.api_key = api_key

# 获取上海话正字转写内容示例
def get_shanghai_words(wordCount=2, wordNumber="三字"):
    # 词库
    word_1_list = ['搿', '伊', '侬', '㑚']
    word_2_list = ['搿搭', '伊拉', '侬讲', '㑚娘']
    word_3_list = ['吓丝丝', '妗夹夹', '侬讲呢', '野豁豁']
    word_4_list = ['一式似样', '太阳老烊', '潮潮泛泛', '搞勿连牵']

    word_list = []

    print(f"--- wordCount: {wordCount}, wordNumber: {wordNumber},")

    # 根据字数选择对应的词库
    if wordNumber == '一字':
        available_words = word_1_list.copy()
    elif wordNumber == '两字':
        available_words = word_2_list.copy()
    elif wordNumber == '三字':
        available_words = word_3_list.copy()
    elif wordNumber == '四字':
        available_words = word_4_list.copy()
    else:
        available_words = word_3_list.copy()

    # 避免重复选择，如果请求数量超过可用词汇，则重复使用
    while len(word_list) < wordCount:
        if available_words:
            # 从可用词汇中随机选择一个并移除，避免重复
            selected_word = random.choice(available_words)
            available_words.remove(selected_word)
            word_list.append(selected_word)
        else:
            # 如果词汇用完了，重新填充可用词汇
            if wordNumber == '一字':
                available_words = word_1_list.copy()
            elif wordNumber == '两字':
                available_words = word_2_list.copy()
            elif wordNumber == '三字':
                available_words = word_3_list.copy()
            elif wordNumber == '四字':
                available_words = word_4_list.copy()
            else:
                available_words = word_3_list.copy()

    return json.dumps(word_list)


# 封装模型响应函数
def get_response(messages):
    try:
        response = dashscope.Generation.call(
            model='qwen-turbo',
            messages=messages,
            functions=functions,
            result_format='message'
        )
        return response
    except Exception as e:
        print(f"API调用出错: {str(e)}")
        return None

# 使用function call进行QA
def run_conversation():
    query = "我对上海话的正字转写规则理解很模糊，能给我一些示例吗，我想看看4个四字的示例"
    messages=[
        {"role": "system", "content": "你是一名上海话方言转写专家，给用户一些指定规则的上海话转写示例。上海话正字转写规则复杂，目前无法总结规律，因此当用户询问上海话正字转写示例时，必须调专用函数获取准确内容，并严格按返回的内容回答给用户，不要自己发挥。当函数返回结果后，你必须完全按照函数返回的JSON数组内容进行回答，不能修改、不能替换、不能添加任何内容，严格按照数组中的顺序和内容输出。重要：你必须直接输出函数返回的JSON字符串，不要进行任何格式转换或内容修改。"},
        {"role": "user", "content": query}
        ]
    
    print('messages1=', messages)
    
    # 得到第一次响应
    response = get_response(messages)
    if not response or not response.output:
        print("获取响应失败")
        return None
        
    print('response=', response)
    
    message = response.output.choices[0].message
    messages.append(message)
    print('message=', message)
    
    # Step 2, 判断用户是否要call function
    try:
        # 使用字典式访问来检查function_call
        print("检查是否有函数调用...")
        print("message =", message)
        if 'function_call' in message and message['function_call']:
            print("检测到函数调用！")
            function_call = message['function_call']
            tool_name = function_call['name']
            # Step 3, 执行function call
            arguments = json.loads(function_call['arguments'])
            print('arguments=', arguments)
            tool_response = get_shanghai_words(
                wordCount=arguments.get('wordCount'),
                wordNumber=arguments.get('wordNumber'),
            )
            tool_info = {"role": "function", "name": tool_name, "content": tool_response}
            print('tool_info=', tool_info)
            messages.append(tool_info)
            print('messages=', messages)
            
            #Step 4, 直接使用函数返回的内容，不再让大模型处理
            # 解析函数返回的JSON内容
            try:
                word_list = json.loads(tool_response)
                # 直接构造回答，不使用大模型
                direct_response = {
                    "role": "assistant", 
                    "content": f"以下是{arguments.get('wordCount')}个{arguments.get('wordNumber')}的上海话正字转写示例：\n\n" + 
                              "\n".join([f"{i+1}. {word}" for i, word in enumerate(word_list)])
                }
                return direct_response
            except json.JSONDecodeError as e:
                print(f"JSON解析错误: {e}")
                # 如果解析失败，再使用大模型
                response = get_response(messages)
                if not response or not response.output:
                    print("获取第二次响应失败")
                    return None
                    
                print('response=', response)
                message = response.output.choices[0].message
                return message
    except (KeyError, AttributeError) as e:
        print(f"没有检测到函数调用，模型直接回答了问题: {e}")
    return message

# 定义可调用的函数配置
functions = [
    {
      'name': 'get_shanghai_words',
      'description': '获取上海话正字转写内容示例。上海话正字转写规则复杂，目前无法总结规律，因此当用户询问上海话正字转写示例时，必须调用此函数获取准确信息。',
      'parameters': {
            'type': 'object',
            'properties': {
                'wordCount': {
                    'type': 'int',
                    'description': '示例条数'
                },
                'wordNumber': {
                    'type': 'string', 
                    'enum': ['一字', '两字', '三字', '四字'],
                    'description': '字数，示例的字数'
                }
            },
        'required': ['wordCount']
      }
    }
]

if __name__ == "__main__":
    result = run_conversation()
    if result:
        print("最终结果:", result)
    else:
        print("对话执行失败")

```

</BlogPost>

