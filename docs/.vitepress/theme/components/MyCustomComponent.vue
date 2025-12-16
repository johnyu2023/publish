<template>
  <div class="custom-component">
    <h2>实验性 Vue 组件</h2>
    <p>这是一个自定义的 Vue 组件，展示了如何在 VitePress 中集成 Vue 功能。</p>
    <div class="counter">
      <p>计数器: {{ count }}</p>
      <button @click="increment">点击增加</button>
    </div>
    <div class="color-box" :style="{ backgroundColor: boxColor }">
      颜色盒子: {{ boxColor }}
    </div>
    <button @click="changeColor">改变颜色</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const count = ref(0)
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
const colorIndex = ref(0)
const boxColor = ref(colors[0])

const increment = () => {
  count.value++
}

const changeColor = () => {
  colorIndex.value = (colorIndex.value + 1) % colors.length
  boxColor.value = colors[colorIndex.value]
}
</script>

<style scoped>
.custom-component {
  padding: 20px;
  border: 2px solid #3eaf7c;
  border-radius: 8px;
  margin: 20px 0;
  background-color: #f8f8f8;
}

.counter {
  margin: 15px 0;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
}

.color-box {
  width: 150px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  margin: 10px 0;
}

button {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}

button:hover {
  background-color: #3ca06f;
}
</style>