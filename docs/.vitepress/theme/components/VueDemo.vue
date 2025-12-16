<template>
  <div class="vue-demo">
    <h3>Vue 功能演示</h3>
    <p>当前时间: {{ currentTime }}</p>
    <p>响应式数据: {{ message }}</p>
    <input v-model="message" placeholder="输入一些文字..." />
    
    <div class="checkbox-group">
      <label v-for="(item, index) in items" :key="index">
        <input 
          type="checkbox" 
          v-model="selectedItems" 
          :value="item"
        >
        {{ item }}
      </label>
    </div>
    
    <p>选中的项目: {{ selectedItems.join(', ') || '无' }}</p>
    
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></div>
      <span class="progress-text">{{ progress }}%</span>
    </div>
    <button @click="increaseProgress">增加进度</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const message = ref('Hello VitePress!')
const currentTime = ref(new Date().toLocaleString())
const items = ['选项1', '选项2', '选项3', '选项4']
const selectedItems = ref([])
const progress = ref(30)

const increaseProgress = () => {
  if(progress.value < 100) {
    progress.value += 10
  }
}

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)
</script>

<style scoped>
.vue-demo {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin: 15px 0;
  background-color: #fafafa;
}

.checkbox-group {
  margin: 10px 0;
}

.checkbox-group label {
  display: block;
  margin: 5px 0;
}

.progress-bar {
  width: 100%;
  height: 25px;
  background-color: #eee;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background-color: #3eaf7c;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

button {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3ca06f;
}
</style>