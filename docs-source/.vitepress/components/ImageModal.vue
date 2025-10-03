<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 图片弹窗相关
const isModalOpen = ref(false)
const modalImageSrc = ref('')
const modalImageAlt = ref('')

// 打开图片弹窗
const openImageModal = (src, alt) => {
  modalImageSrc.value = src
  modalImageAlt.value = alt || ''
  isModalOpen.value = true
  // 防止背景滚动
  document.body.style.overflow = 'hidden'
}

// 关闭图片弹窗
const closeImageModal = () => {
  isModalOpen.value = false
  modalImageSrc.value = ''
  modalImageAlt.value = ''
  // 恢复背景滚动
  document.body.style.overflow = ''
}

// 点击遮罩层关闭弹窗
const closeModalOnBackdrop = (event) => {
  if (event.target === event.currentTarget) {
    closeImageModal()
  }
}

// 全局点击事件处理
const handleGlobalClick = (event) => {
  const target = event.target
  // 检查点击的是否是图片
  if (target.tagName === 'IMG' && target.closest('.blog-post')) {
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
  <div v-if="isModalOpen" class="image-modal" @click="closeModalOnBackdrop">
    <div class="modal-content">
      <button class="close-button" @click="closeImageModal">&times;</button>
      <img :src="modalImageSrc" :alt="modalImageAlt" class="modal-image" />
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
  max-width: 90%;
  max-height: 90%;
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