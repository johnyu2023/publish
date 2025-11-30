/**
 * Mermaid 图表交互增强功能
 * 支持鼠标滚轮缩放和拖拽移动
 */

class MermaidInteraction {
  constructor() {
    this.scales = new Map(); // 存储每个图表的缩放比例
    this.translations = new Map(); // 存储每个图表的平移位置
    this.modalScales = new Map(); // 弹框中的缩放比例
    this.modalTranslations = new Map(); // 弹框中的平移位置
    this.isDragging = false;
    this.currentMermaid = null;
    this.startX = 0;
    this.startY = 0;
    this.lastTouchDistance = 0;
    this.modalInstance = null;

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
    let wrapper = mermaid.parentElement;
    if (!wrapper.classList.contains('mermaid-wrapper')) {
      wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      mermaid.parentNode.insertBefore(wrapper, mermaid);
      wrapper.appendChild(mermaid);
    }

    // 添加放大镜按钮（如果还没有）
    this.addZoomButton(wrapper, mermaid);

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

  applyModalTransform(modalMermaid) {
    const mermaidId = this.getMermaidId(modalMermaid);
    const scale = this.modalScales.get(mermaidId);
    const translation = this.modalTranslations.get(mermaidId);

    // 应用 CSS 变换
    modalMermaid.style.transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;
  }

  // 添加放大镜按钮
  addZoomButton(wrapper, mermaid) {
    // 检查是否是弹框中的 Mermaid，如果是则不添加按钮
    if (mermaid.classList.contains('modal-mermaid-no-zoom') || mermaid.classList.contains('mermaid-modal-chart')) {
      return;
    }

    // 检查是否已经有按钮
    if (wrapper.querySelector('.mermaid-zoom-btn')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'mermaid-zoom-btn';
    button.innerHTML = '🔍';
    button.title = '点击放大查看';

    // 按钮样式
    Object.assign(button.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.2s ease',
      zIndex: 100
    });

    // 鼠标悬停效果
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgba(59, 130, 246, 1)';
      button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
      button.style.transform = 'scale(1)';
    });

    // 点击事件 - 打开弹框
    button.addEventListener('click', () => {
      this.openModal(mermaid);
    });

    wrapper.appendChild(button);
  }

  // 打开弹框
  openModal(mermaid) {
    // 关闭已存在的弹框
    if (this.modalInstance) {
      this.closeModal();
    }

    // 创建弹框
    const modal = document.createElement('div');
    modal.className = 'mermaid-modal';

    // 弹框背景
    Object.assign(modal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'grab'
    });

    // 创建内容容器
    const content = document.createElement('div');
    content.className = 'mermaid-modal-content';

    Object.assign(content.style, {
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      width: '90vw',
      height: '90vh',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      cursor: 'default'
    });

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.title = '关闭';

    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '36px',
      height: '36px',
      border: 'none',
      borderRadius: '50%',
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      transition: 'all 0.2s ease'
    });

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = 'rgba(239, 68, 68, 1)';
      closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
      closeBtn.style.transform = 'scale(1)';
    });

    closeBtn.addEventListener('click', () => {
      this.closeModal();
    });

    // 复制 Mermaid 内容到弹框
    const modalMermaid = document.createElement('div');
    modalMermaid.className = 'mermaid mermaid-modal-chart';
    modalMermaid.innerHTML = mermaid.innerHTML;

    // 获取原始 Mermaid 图表的尺寸
    const originalRect = mermaid.getBoundingClientRect();
    const originalWidth = originalRect.width;
    const originalHeight = originalRect.height;

    // 智能设置弹框中 Mermaid 图表的尺寸
    if (originalWidth > originalHeight) {
      // 宽度大于高度的图表：宽度为弹框窗口的90%，高度自适应
      Object.assign(modalMermaid.style, {
        width: '90vw', // 使用弹框窗口的90%宽度
        height: 'auto', // 高度自适应
        maxWidth: '90vw' // 最大宽度限制
      });
    } else {
      // 宽度小于等于高度的图表：高度为弹框窗口的90%，宽度自适应
      Object.assign(modalMermaid.style, {
        width: 'auto', // 宽度自适应
        height: '90vh', // 使用弹框窗口的90%高度
        maxHeight: '90vh' // 最大高度限制
      });
    }

    // 复制原始的 data-mermaid-id
    const originalId = this.getMermaidId(mermaid);
    modalMermaid.dataset.mermaidId = originalId + '-modal';

    // 初始化弹框中的变换状态
    this.modalScales.set(modalMermaid.dataset.mermaidId, 1);
    this.modalTranslations.set(modalMermaid.dataset.mermaidId, { x: 0, y: 0 });

    // 不添加使用提示（弹框中不需要提示）

    // 组装弹框
    content.appendChild(modalMermaid);
    content.appendChild(closeBtn);
    modal.appendChild(content);

    // 添加到页面
    document.body.appendChild(modal);

    // 保存引用
    this.modalInstance = {
      modal,
      content,
      mermaid: modalMermaid
    };

    // 重新初始化 Mermaid 渲染
    if (window.mermaid) {
      window.mermaid.init(undefined, modalMermaid);
    }

    // 添加弹框事件监听器
    this.addModalEventListeners(modalMermaid);

    // 弹框中的 Mermaid 图表不添加放大镜按钮，在添加前就阻止
    modalMermaid.classList.add('modal-mermaid-no-zoom');

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // ESC 键关闭
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // 关闭弹框
  closeModal() {
    if (this.modalInstance) {
      document.body.removeChild(this.modalInstance.modal);
      this.modalInstance = null;
    }
  }

  // 添加弹框事件监听器
  addModalEventListeners(modalMermaid) {
    // 鼠标滚轮缩放
    modalMermaid.addEventListener('wheel', (e) => this.handleModalWheel(e, modalMermaid), { passive: false });

    // 鼠标拖拽
    modalMermaid.addEventListener('mousedown', (e) => this.handleModalMouseDown(e, modalMermaid));
    document.addEventListener('mousemove', (e) => this.handleModalMouseMove(e));
    document.addEventListener('mouseup', () => this.handleModalMouseUp());

    // 双击重置
    modalMermaid.addEventListener('dblclick', () => this.resetModalTransform(modalMermaid));

    // 防止右键菜单
    modalMermaid.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // 弹框中的滚轮处理
  handleModalWheel(e, modalMermaid) {
    e.preventDefault();

    const mermaidId = this.getMermaidId(modalMermaid);
    const currentScale = this.modalScales.get(mermaidId);

    // 计算缩放因子
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, currentScale * scaleFactor)); // 限制缩放范围 0.1x 到 5x

    // 更新缩放
    this.modalScales.set(mermaidId, newScale);

    // 应用变换
    this.applyModalTransform(modalMermaid);
  }

  // 弹框中的鼠标按下处理
  handleModalMouseDown(e, modalMermaid) {
    if (e.button === 0) { // 左键
      e.preventDefault();
      this.isDragging = true;
      this.currentMermaid = modalMermaid;
      this.startX = e.clientX;
      this.startY = e.clientY;
      modalMermaid.style.cursor = 'grabbing';
    }
  }

  // 弹框中的鼠标移动处理
  handleModalMouseMove(e) {
    if (this.isDragging && this.currentMermaid && this.currentMermaid.classList.contains('mermaid-modal-chart')) {
      e.preventDefault();

      const mermaidId = this.getMermaidId(this.currentMermaid);
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      const currentTranslation = this.modalTranslations.get(mermaidId);
      this.modalTranslations.set(mermaidId, {
        x: currentTranslation.x + deltaX,
        y: currentTranslation.y + deltaY
      });

      this.startX = e.clientX;
      this.startY = e.clientY;

      this.applyModalTransform(this.currentMermaid);
    }
  }

  // 弹框中的鼠标松开处理
  handleModalMouseUp() {
    if (this.currentMermaid && this.currentMermaid.classList.contains('mermaid-modal-chart')) {
      this.currentMermaid.style.cursor = 'grab';
    }
    this.isDragging = false;
    this.currentMermaid = null;
  }

  // 重置弹框中的变换
  resetModalTransform(modalMermaid) {
    const mermaidId = this.getMermaidId(modalMermaid);
    this.modalScales.set(mermaidId, 1);
    this.modalTranslations.set(mermaidId, { x: 0, y: 0 });
    this.applyModalTransform(modalMermaid);
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