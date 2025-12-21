---
title: Vue 中的 Store 与 Composable
description: Vue 中的 Store 与 Composable 是如何工作的
date: 2025-12-07
tags: [Vue, Store, Composable]
---

> 最佳实践：用 **Composable 封装业务逻辑**，用 **Store 管理共享状态**，两者配合让代码更清晰、可维护。

## Store 和 Composable 是什么

在 Vue（特别是 Vue 3）开发中，**Store** 和 **Composable** 是两种用于管理逻辑和状态的机制，它们在用途和实现方式上有所不同，但在实际项目中经常协作使用。

### **Store（状态管理）**

- **代表工具**：通常是 **Pinia**（Vue 官方推荐） 或 Vuex（旧版）。
- **作用**：集中管理**跨组件共享的状态**（如用户信息、购物车、全局配置等）。
- **特点**：
  - 状态是**全局可访问**的。
  - 支持**响应式**、**持久化**、**时间旅行调试**等。
  - 适合**复杂、共享、需要持久保存**的数据。

#### 示例（Pinia）

```ts
// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Alice',
    isLoggedIn: false
  }),
  actions: {
    login() {
      this.isLoggedIn = true
    }
  }
})
```

---

### **Composable（组合式函数）**

- **来源**：Vue 3 的 **Composition API**（`setup()`、`<script setup>`）。
- **作用**：**封装可复用的逻辑**（如数据获取、表单验证、计时器等），**不一定是状态**。
- **特点**：
  - 基于函数，**按需使用**，**作用域局部**（除非内部用了 Store）。
  - 利用 `ref`、`computed`、`watch` 等响应式 API。
  - 轻量、灵活，适合**逻辑复用**而非状态共享。

#### 示例

```ts
// composables/useFetchUser.ts
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export function useFetchUser() {
  const loading = ref(false)
  const store = useUserStore()

  const fetchUserData = async () => {
    loading.value = true
    // 模拟 API 调用
    await new Promise(r => setTimeout(r, 1000))
    store.name = 'Bob'
    store.isLoggedIn = true
    loading.value = false
  }

  return { loading, fetchUserData }
}
```

---

### **它们如何协作？**

- **Composable 负责“逻辑”**（如发起请求、处理副作用）。
- **Store 负责“状态存储”**（如用户数据、登录状态）。
- Composable **可以调用 Store** 来读写全局状态。

#### 组件中使用

```vue
<script setup>
import { useFetchUser } from '@/composables/useFetchUser'

const { loading, fetchUserData } = useFetchUser()
</script>

<template>
  <button @click="fetchUserData" :disabled="loading">
    {{ loading ? '加载中...' : '获取用户' }}
  </button>
</template>
```

在这个例子中：

- 点击按钮 → 触发 `useFetchUser` 的逻辑（Composable）。
- 获取数据后 → 更新 `userStore` 的状态（Store）。
- 其他组件也可通过 `useUserStore()` 访问最新用户信息。

---

### 总结对比

| 特性             | Store (Pinia)             | Composable                     |
|------------------|---------------------------|--------------------------------|
| 目的             | 全局状态管理              | 逻辑复用                       |
| 状态是否共享     | 是（跨组件）              | 否（除非内部用了 Store）       |
| 响应式           | 是                        | 是（通过 ref/computed 等）     |
| 典型用途         | 用户信息、购物车、主题设置 | 数据请求、表单验证、工具函数   |
| 协作方式         | Composable 可读写 Store   | 可封装对 Store 的操作逻辑      |
