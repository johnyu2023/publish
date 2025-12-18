<template>
  <div 
    ref="mermaidContainer" 
    class="mermaid-container"
    @click="openModal"
  ></div>
  
  <!-- 弹框 -->
  <Teleport to="body" v-if="showModal">
    <div class="modal-overlay" @click="closeModal">
      <div 
        class="modal-content" 
        @click.stop
        @wheel="handleWheel"
        @mousedown="startDrag"
        ref="modalContentRef"
      >
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <div class="modal-controls">
          <button class="zoom-btn" @click="zoomIn">+</button>
          <button class="zoom-btn" @click="zoomOut">-</button>
          <button class="zoom-btn" @click="resetZoom">重置</button>
          <span class="zoom-info">{{ Math.round(zoomLevel * 100) }}%</span>
        </div>
        <div 
          ref="modalMermaidContainer" 
          class="modal-mermaid-container"
        >
          <div 
            ref="svgContainer"
            class="svg-container"
            :style="{ 
              transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease',
              minWidth: '100%',
              minHeight: '100%'
            }"
          ></div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: false,
    default: ''
  },
  graph: {
    type: String,
    required: false,
    default: ''
  },
  modalWidth: {
    type: String,
    required: false,
    default: '95%'
  },
  modalHeight: {
    type: String,
    required: false,
    default: '95%'
  }
})

// 对于普通的 mermaid 代码块，需要进行 URL 解码处理
// 从 markdown 配置中传入的是 encodeURIComponent 编码的字符串
let mermaidCode = props.graph || props.code

// 尝试解码 URL 编码的内容
try {
  // 循环解码直到不再发生变化，处理多重编码情况
  let decodedString = mermaidCode
  let previous = ''
  while (decodedString !== previous) {
    previous = decodedString
    try {
      decodedString = decodeURIComponent(decodedString)
    } catch (e) {
      // 如果解码出错，则停止循环
      break
    }
  }
  
  // 只有当解码后的字符串与原字符串不同，且解码后字符串有效时才使用
  if (decodedString !== mermaidCode && (decodedString.trim().startsWith('graph ') || 
      decodedString.trim().startsWith('sequenceDiagram') || 
      decodedString.trim().startsWith('gantt') ||
      decodedString.includes('graph ') ||
      decodedString.includes('sequenceDiagram') ||
      decodedString.includes('gantt'))) {
    mermaidCode = decodedString
  }
} catch (e) {
  console.warn('Failed to decode mermaid code:', e)
  // 如果解码失败，回退到原始值
  mermaidCode = props.graph || props.code
}

// 作为备选，如果仍然是编码格式，则手动解码一些常见的 URL 编码字符
if (mermaidCode.includes('%7B') || mermaidCode.includes('%7D') || mermaidCode.includes('%0A')) {
  try {
    const manualDecoded = mermaidCode
      .replace(/%7B/gi, '{')    // {
      .replace(/%7D/gi, '}')    // }
      .replace(/%0A/g, '\n')    // \n
      .replace(/%0D/g, '\r')    // \r
      .replace(/%22/g, '"')     // "
      .replace(/%27/g, "'")     // '
      .replace(/%3C/g, '<')     // <
      .replace(/%3E/g, '>')     // >
      .replace(/%20/g, ' ')     // space
      .replace(/\+/g, ' ')      // space
    
    // 验证解码结果是否为有效的 mermaid 语法
    if (manualDecoded.startsWith('graph ') || 
        manualDecoded.startsWith('sequenceDiagram') || 
        manualDecoded.startsWith('gantt') ||
        manualDecoded.includes('graph ') ||
        manualDecoded.includes('sequenceDiagram') ||
        manualDecoded.includes('gantt')) {
      mermaidCode = manualDecoded
    }
  } catch (e) {
    console.warn('Manual decoding failed:', e)
  }
}

const mermaidContainer = ref(null)
const modalMermaidContainer = ref(null)
const modalContentRef = ref(null)
const svgContainer = ref(null)
const showModal = ref(false)

// 缩放和平移相关变量
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const initialPanX = ref(0)
const initialPanY = ref(0)

// SVG 尺寸相关变量
const svgWidth = ref(800)
const svgHeight = ref(600)

// 记录原始 SVG 内容，在弹窗中复用
let originalSVGContent = ''
let mermaidInstance = null

onMounted(async () => {
  try {
    const { default: mermaid } = await import('mermaid')
    mermaidInstance = mermaid
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      fontFamily: 'inherit',
      securityLevel: 'loose'
    })

    if (mermaidContainer.value) {
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      const { svg, bindFunctions } = await mermaid.render(id, mermaidCode)
      
      // 保存原始 SVG 内容
      originalSVGContent = svg
      
      mermaidContainer.value.innerHTML = svg
      
      if (bindFunctions) {
        bindFunctions(mermaidContainer.value)
      }
    }
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error)
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = `<pre>${props.code}</pre>`
    }
  }
})

// 打开模态框
const openModal = () => {
  showModal.value = true
  // 重置缩放和平移状态
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  
  // 在下一个 DOM 更新后将 SVG 添加到弹窗容器
  nextTick(() => {
    if (svgContainer.value && originalSVGContent) {
      svgContainer.value.innerHTML = originalSVGContent
      
      // 获取 SVG 元素的实际尺寸
      const svgElement = svgContainer.value.querySelector('svg')
      if (svgElement) {
        // 使用 SVG 的原始尺寸来设置容器大小
        if (svgElement.width && svgElement.height) {
          svgWidth.value = parseInt(svgElement.width.baseVal.value)
          svgHeight.value = parseInt(svgElement.height.baseVal.value)
        } else {
          // 备用方案：获取 SVG 的 viewBox 或估计尺寸
          const viewBox = svgElement.getAttribute('viewBox')
          if (viewBox) {
            const dims = viewBox.split(' ')
            if (dims.length === 4) {
              svgWidth.value = parseInt(dims[2]) || 800
              svgHeight.value = parseInt(dims[3]) || 600
            } else {
              svgWidth.value = 800
              svgHeight.value = 600
            }
          } else {
            // 最后的备用方案
            const rect = svgElement.getBoundingClientRect()
            svgWidth.value = rect.width || 800
            svgHeight.value = rect.height || 600
          }
        }
      }
    }
  })
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (mermaidInstance) {
    // 尝试调用 dispose 方法释放资源
    if (typeof mermaidInstance === 'object' && typeof mermaidInstance.dispose === 'function') {
      mermaidInstance.dispose()
    }
  }
})

// 鼠标滚轮缩放
const handleWheel = (event) => {
  event.preventDefault()
  const zoomIntensity = 0.1
  const wheelDelta = event.deltaY
  const zoomFactor = wheelDelta > 0 ? (1 - zoomIntensity) : (1 + zoomIntensity)
  
  // 限制缩放范围在 0.1 到 10 之间
  const newZoom = Math.min(Math.max(zoomLevel.value * zoomFactor, 0.1), 10)
  zoomLevel.value = newZoom
}

// 缩放控制
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 10)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.1)
}

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

// 拖拽功能
const startDrag = (event) => {
  if (event.target.classList.contains('zoom-btn') || event.target.classList.contains('modal-close-btn')) {
    return // 避免在按钮上拖拽
  }
  
  isDragging.value = true
  dragStartX.value = event.clientX - panX.value
  dragStartY.value = event.clientY - panY.value
  
  document.addEventListener('mousemove', performDrag)
  document.addEventListener('mouseup', stopDrag)
}

const performDrag = (event) => {
  if (!isDragging.value) return
  
  panX.value = event.clientX - dragStartX.value
  panY.value = event.clientY - dragStartY.value
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', performDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style>
.mermaid-container {
  margin: 1.5rem 0;
  overflow: auto;
  cursor: pointer; /* 添加光标提示可点击 */
  transition: opacity 0.3s ease; /* 添加过渡效果 */
}

.mermaid-container:hover {
  opacity: 0.8; /* 悬停效果 */
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  width: v-bind('props.modalWidth');
  height: v-bind('props.modalHeight');
  max-width: 95vw;
  max-height: 95vh;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  z-index: 10000;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.modal-close-btn:hover {
  color: #000;
  background-color: #f0f0f0;
}

.modal-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
  display: flex;
  gap: 5px;
  align-items: center;
}

.zoom-btn {
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  min-width: 30px;
}

.zoom-btn:hover {
  background-color: #f0f0f0;
}

.zoom-info {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #ccc;
}

.modal-mermaid-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  cursor: grab;
}

.modal-mermaid-container:active {
  cursor: grabbing;
}

.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: v-bind('svgWidth + "px"');
  height: v-bind('svgHeight + "px"');
  min-width: 100%;
  min-height: 100%;
  transition: none;
}

/* 对于较大的 SVG，适应弹窗大小 */
.svg-container svg {
  max-width: none !important;
  max-height: none !important;
  width: 100% !important;
  height: 100% !important;
  transition: none;
}
</style>