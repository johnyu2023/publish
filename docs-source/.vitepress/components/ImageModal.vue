<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 图片弹窗相关
const isModalOpen = ref(false)
const modalImageSrc = ref('')
const modalImageAlt = ref('')

// 图片缩放和拖拽相关
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 打开图片弹窗
const openImageModal = (src, alt) => {
  modalImageSrc.value = src
  modalImageAlt.value = alt || ''
  isModalOpen.value = true
  scale.value = 1  // 重置缩放
  position.value = { x: 0, y: 0 }  // 重置位置
  // 防止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭图片弹窗
const closeImageModal = () => {
  isModalOpen.value = false
  modalImageSrc.value = ''
  modalImageAlt.value = ''
  scale.value = 1
  position.value = { x: 0, y: 0 }
  // 恢复背景滚动
  document.body.style.overflow = ''
}

// 点击遮罩层关闭弹窗
const closeModalOnBackdrop = (event) => {
  if (event.target === event.currentTarget) {
    closeImageModal()
  }
}

// 阻止图片拖拽默认行为
const preventDrag = (event) => {
  event.preventDefault()
}

// 鼠标滚轮缩放
const handleWheel = (event) => {
  if (!isModalOpen.value) return
  
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  const newScale = scale.value + delta
  
  // 设置缩放范围限制（0.5 到 3 倍）
  if (newScale >= 0.5 && newScale <= 3) {
    scale.value = newScale
  }
}

// 鼠标按下开始拖拽
const startDrag = (event) => {
  if (scale.value <= 1) return  // 只有在放大时才允许拖拽
  
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
  event.preventDefault()
}

// 鼠标移动拖拽
const onDrag = (event) => {
  if (!isDragging.value) return
  
  position.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y
  }
}

// 鼠标释放结束拖拽
const endDrag = () => {
  isDragging.value = false
}

// 全局点击事件处理
const handleGlobalClick = (event) => {
  const target = event.target
  // 检查点击的是否是图片，支持BlogPost和VPCustomContainer两种容器
  if (target.tagName === 'IMG' && (target.closest('.blog-post') || target.closest('.blog-post-container'))) {
    // 阻止事件冒泡
    event.stopPropagation()
    // 获取图片的src和alt属性
    const src = target.src
    const alt = target.alt || ''
    openImageModal(src, alt)
  }
}

onMounted(() => {
  // 添加全局点击事件监听器
  document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleGlobalClick)
  // 确保恢复背景滚动
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- 图片弹窗 -->
  <div 
    v-if="isModalOpen" 
    class="image-modal" 
    @click="closeModalOnBackdrop"
    @wheel="handleWheel"
  >
    <div class="modal-content">
      <button class="close-button" @click="closeImageModal">&times;</button>
      <img 
        :src="modalImageSrc" 
        :alt="modalImageAlt" 
        class="modal-image" 
        :style="{ 
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @dragstart="preventDrag"
      />
      <div v-if="modalImageAlt" class="image-alt">{{ modalImageAlt }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 图片弹窗样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 36px;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-button:hover {
  color: #ccc;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  display: block;
  object-fit: contain;
  transition: transform 0.1s ease;
}

.image-alt {
  color: white;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 85%;
  }
  
  .modal-image {
    max-height: 70vh;
  }
}
</style>