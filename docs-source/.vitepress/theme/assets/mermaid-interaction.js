/**
 * Mermaid 图表交互增强功能
 * 支持鼠标滚轮缩放和拖拽移动
 */

class MermaidInteraction {
  constructor() {
    this.scales = new Map(); // 存储每个图表的缩放比例
    this.translations = new Map(); // 存储每个图表的平移位置
    this.isDragging = false;
    this.currentMermaid = null;
    this.startX = 0;
    this.startY = 0;
    this.lastTouchDistance = 0;

    this.init();
  }

  init() {
    // 延迟执行，确保 Mermaid 插件已经处理完所有图表
    setTimeout(() => {
      console.log('初始化 Mermaid 交互增强功能...');
      this.setupMermaidElements();
      this.observeContentChanges();
    }, 1500);
  }

  observeContentChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // 检查新增的 Mermaid 元素
              if (node.classList && node.classList.contains('mermaid')) {
                this.setupMermaidElement(node);
              }
              // 检查新增的 Mermaid 容器
              if (node.querySelector && node.querySelector('.mermaid')) {
                node.querySelectorAll('.mermaid').forEach(mermaid => {
                  this.setupMermaidElement(mermaid);
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupMermaidElements() {
    const mermaidElements = document.querySelectorAll('.mermaid');
    mermaidElements.forEach(mermaid => {
      this.setupMermaidElement(mermaid);
    });
  }

  setupMermaidElement(mermaid) {
    const mermaidId = this.getMermaidId(mermaid);

    // 初始化状态
    if (!this.scales.has(mermaidId)) {
      this.scales.set(mermaidId, 1);
    }
    if (!this.translations.has(mermaidId)) {
      this.translations.set(mermaidId, { x: 0, y: 0 });
    }

    // 创建容器（如果还没有）
    if (!mermaid.parentElement.classList.contains('mermaid-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      mermaid.parentNode.insertBefore(wrapper, mermaid);
      wrapper.appendChild(mermaid);
    }

    // 添加事件监听器
    this.addEventListeners(mermaid);
  }

  getMermaidId(mermaid) {
    if (!mermaid.dataset.mermaidId) {
      mermaid.dataset.mermaidId = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    return mermaid.dataset.mermaidId;
  }

  addEventListeners(mermaid) {
    // 鼠标滚轮缩放
    mermaid.addEventListener('wheel', (e) => this.handleWheel(e, mermaid), { passive: false });

    // 鼠标拖拽
    mermaid.addEventListener('mousedown', (e) => this.handleMouseDown(e, mermaid));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());

    // 触摸事件（移动设备支持）
    mermaid.addEventListener('touchstart', (e) => this.handleTouchStart(e, mermaid), { passive: false });
    mermaid.addEventListener('touchmove', (e) => this.handleTouchMove(e, mermaid), { passive: false });
    mermaid.addEventListener('touchend', () => this.handleTouchEnd());

    // 双击重置
    mermaid.addEventListener('dblclick', () => this.resetTransform(mermaid));

    // 防止右键菜单
    mermaid.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  handleWheel(e, mermaid) {
    e.preventDefault();

    const mermaidId = this.getMermaidId(mermaid);
    const currentScale = this.scales.get(mermaidId);

    // 计算缩放因子
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, currentScale * scaleFactor)); // 限制缩放范围 0.1x 到 5x

    // 获取鼠标在图表中的位置
    const rect = mermaid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 以鼠标位置为中心进行缩放
    const scaleRatio = newScale / currentScale;

    // 更新缩放
    this.scales.set(mermaidId, newScale);

    // 应用变换
    this.applyTransform(mermaid);
  }

  handleMouseDown(e, mermaid) {
    if (e.button === 0) { // 左键
      e.preventDefault();
      this.isDragging = true;
      this.currentMermaid = mermaid;
      this.startX = e.clientX;
      this.startY = e.clientY;
      mermaid.style.cursor = 'grabbing';
    }
  }

  handleMouseMove(e) {
    if (this.isDragging && this.currentMermaid) {
      e.preventDefault();

      const mermaidId = this.getMermaidId(this.currentMermaid);
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      const currentTranslation = this.translations.get(mermaidId);
      this.translations.set(mermaidId, {
        x: currentTranslation.x + deltaX,
        y: currentTranslation.y + deltaY
      });

      this.startX = e.clientX;
      this.startY = e.clientY;

      this.applyTransform(this.currentMermaid);
    }
  }

  handleMouseUp() {
    if (this.currentMermaid) {
      this.currentMermaid.style.cursor = 'grab';
    }
    this.isDragging = false;
    this.currentMermaid = null;
  }

  handleTouchStart(e, mermaid) {
    if (e.touches.length === 1) {
      // 单指触摸，准备拖拽
      this.isDragging = true;
      this.currentMermaid = mermaid;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      // 双指触摸，准备缩放
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.lastTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  }

  handleTouchMove(e, mermaid) {
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
      // 单指拖拽
      const deltaX = e.touches[0].clientX - this.startX;
      const deltaY = e.touches[0].clientY - this.startY;

      const mermaidId = this.getMermaidId(mermaid);
      const currentTranslation = this.translations.get(mermaidId);
      this.translations.set(mermaidId, {
        x: currentTranslation.x + deltaX,
        y: currentTranslation.y + deltaY
      });

      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;

      this.applyTransform(mermaid);
    } else if (e.touches.length === 2) {
      // 双指缩放
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (this.lastTouchDistance > 0) {
        const mermaidId = this.getMermaidId(mermaid);
        const currentScale = this.scales.get(mermaidId);
        const scaleFactor = currentDistance / this.lastTouchDistance;
        const newScale = Math.max(0.1, Math.min(5, currentScale * scaleFactor));
        this.scales.set(mermaidId, newScale);
        this.applyTransform(mermaid);
      }

      this.lastTouchDistance = currentDistance;
    }
  }

  handleTouchEnd() {
    this.isDragging = false;
    this.currentMermaid = null;
    this.lastTouchDistance = 0;
  }

  resetTransform(mermaid) {
    const mermaidId = this.getMermaidId(mermaid);
    this.scales.set(mermaidId, 1);
    this.translations.set(mermaidId, { x: 0, y: 0 });
    this.applyTransform(mermaid);
  }

  applyTransform(mermaid) {
    const mermaidId = this.getMermaidId(mermaid);
    const scale = this.scales.get(mermaidId);
    const translation = this.translations.get(mermaidId);

    // 应用 CSS 变换
    mermaid.style.transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
  }

  // 重置所有图表
  resetAll() {
    document.querySelectorAll('.mermaid').forEach(mermaid => {
      this.resetTransform(mermaid);
    });
  }
}

// 创建全局实例
window.mermaidInteraction = new MermaidInteraction();

// 为了调试，提供全局访问
window.mermaidInteractionReset = () => {
  window.mermaidInteraction.resetAll();
};

console.log('Mermaid 交互增强功能已加载 ✨');