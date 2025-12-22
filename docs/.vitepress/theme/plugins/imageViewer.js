import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

// 图片查看器初始化函数
export function initImageViewer() {
  console.log('[ImageViewer] initImageViewer called at:', new Date().toISOString(), 'document readyState:', document.readyState);
  
  // 使用 MutationObserver 监听 DOM 变化，确保内容加载后也能初始化 Viewer
  setupDOMObserver();
  
  // 立即初始化而不是等待 DOM 加载，因为在 VitePress 中 DOM 可能在不同时间就绪
  setTimeout(initializeViewer, 500); // 延迟一下确保内容渲染完成

  // 监听路由变化，重新初始化查看器
  // 在 VitePress 中使用原生事件监听
  document.removeEventListener('vitepress:page:finish', initializeViewer); // 先移除避免重复绑定
  document.addEventListener('vitepress:page:finish', () => {
    console.log('[ImageViewer] vitepress:page:finish event fired');
    setTimeout(initializeViewer, 1000); // 增加延迟，确保页面内容完全加载
  });
  
  // Vue Router 的 onAfterRouteChanged 类似监听
  if (typeof window !== 'undefined') {
    // 移除之前的事件监听器以避免重复绑定
    window.removeEventListener('popstate', window.__handleUrlChange || (() => {}));
    window.removeEventListener('hashchange', window.__handleUrlChange || (() => {}));
    
    let timeoutId;
    window.__handleUrlChange = () => {
      console.log('[ImageViewer] URL changed, reinitializing in 300ms');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(initializeViewer, 300);
    };

    window.addEventListener('popstate', window.__handleUrlChange);
    window.addEventListener('hashchange', window.__handleUrlChange);
  }
}

// 设置 DOM 观察器，监控内容区域的变化
function setupDOMObserver() {
  if (!window.__domObserver) {
    window.__domObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;
      
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              // 检查新增节点是否是 Viewer 自己的元素，如果是则跳过
              if (node.classList && 
                  (node.classList.contains('viewer-container') || 
                   node.classList.contains('viewer') ||
                   node.closest('.viewer-container'))) {
                continue; // 跳过 Viewer 自己的元素
              }
              
              // 检查新增节点是否包含图片或本身就是图片
              if (node.tagName === 'IMG') {
                shouldReinitialize = true;
                break;
              }
              if (node.querySelectorAll && node.querySelectorAll('img').length > 0) {
                // 检查这些图片是否不在 Viewer 容器内
                const contentImages = Array.from(node.querySelectorAll('img')).filter(img => 
                  !img.closest('.viewer-container')
                );
                if (contentImages.length > 0) {
                  shouldReinitialize = true;
                  break;
                }
              }
              // 检查是否是内容区域被更新
              if (node.classList && 
                  (node.classList.contains('VPContent') || 
                   node.querySelector('.VPContent'))) {
                // 确保这不是 Viewer 内部的内容区域更新
                if (!node.closest('.viewer-container')) {
                  shouldReinitialize = true;
                  break;
                }
              }
            }
          }
        }
        
        if (shouldReinitialize) break;
      }
      
      if (shouldReinitialize) {
        console.log('[ImageViewer] Content-related DOM change detected, reinitializing viewer in 800ms');
        setTimeout(initializeViewer, 800); // 增加延迟，避免在 Viewer 关闭动画期间进行重初始化
      }
    });

    window.__domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('[ImageViewer] DOM Observer set up');
  }
}

// 初始化 Viewer
function initializeViewer() {
  console.log('[ImageViewer] initializeViewer STARTING at:', new Date().toISOString());
  console.log('[ImageViewer] initializeViewer called, destroying existing instance if any');
  // 先销毁之前的实例
  if (window.__viewerInstance) {
    console.log('[ImageViewer] About to destroy existing instance');
    window.__viewerInstance.destroy();
    window.__viewerInstance = null;
    console.log('[ImageViewer] Destroyed previous viewer instance');
  }

  // 等待一点时间确保 DOM 更新完成
  console.log('[ImageViewer] Setting timeout of 300ms to wait for DOM');
  setTimeout(() => {
    console.log('[ImageViewer] Timeout ended, now looking for .VPContent element...');
    const gallery = document.querySelector('.VPContent');
    if (gallery) {
      console.log('[ImageViewer] Found .VPContent element, checking images count...');
      const images = gallery.querySelectorAll('img');
      console.log('[ImageViewer] Found .VPContent element, total images found:', images.length);
      
      // 检查 Viewer 是否已定义
      console.log('[ImageViewer] Checking if Viewer constructor is available:', typeof Viewer);
      
      // 先移除已经添加的viewer-inited类，确保重新绑定
      const allImages = gallery.querySelectorAll('img.viewer-inited');
      allImages.forEach(img => {
        img.classList.remove('viewer-inited');
      });
      
      // 创建新的 Viewer 实例
      try {
        console.log('[ImageViewer] Creating new Viewer instance with gallery containing', images.length, 'images');
        window.__viewerInstance = new Viewer(gallery, {
          toolbar: false,
          navbar: false,
          title: false,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          transition: true,
          inline: false,
          filter: (img) => {
            // 排除特定类名的 img 元素
            const shouldInclude = !img.classList.contains('no-viewer') && 
                   !img.closest('.vp-code-group') && 
                   !img.closest('pre') &&
                   !img.closest('code');
            console.log(`[ImageViewer] Filter check for image ${img.src || 'unknown'}: ${shouldInclude}`);
            return shouldInclude;
          },
          viewed() {
            console.log('[ImageViewer] Viewed callback triggered');
            // 调整 Viewer 弹窗大小为 95vw/95vh
            const modal = document.querySelector('.viewer-container');
            if (modal) {
              modal.style.width = '95vw';
              modal.style.height = '95vh';
              modal.style.maxWidth = '95vw';
              modal.style.maxHeight = '95vh';
              
              // 设置居中显示
              modal.style.left = '2.5vw';
              modal.style.top = '2.5vh';
            }
          }
        });
        
        console.log('[ImageViewer] Viewer instance created successfully:', !!window.__viewerInstance);
        console.log('[ImageViewer] Current viewer instance stored in window.__viewerInstance:', !!window.__viewerInstance);
        
        // Viewer 会自动处理图片，但我们仍然添加自己的检查
        images.forEach(img => {
          console.log(`[ImageViewer] Image processed by viewer: ${img.src || img.alt || 'unknown'}, included: ${!img.classList.contains('no-viewer') && !img.closest('.vp-code-group') && !img.closest('pre') && !img.closest('code')}`);
        });
        
      } catch (error) {
        console.error('[ImageViewer] Error creating Viewer instance:', error);
        console.error('[ImageViewer] Error details:', error.message, error.stack);
      }
    } else {
      console.log('[ImageViewer] No .VPContent element found!');
      console.log('[ImageViewer] Available content containers:', document.querySelectorAll('*[class*="content" i], *[class*="VPHero" i], *[class*="VPContent" i], *[id*="content" i], body').length);
      console.log('[ImageViewer] All elements with class VP:', Array.from(document.querySelectorAll('*')).filter(el => el.className && el.className.includes('VP')).map(el => el.tagName + '.' + el.className));
    }
    console.log('[ImageViewer] initializeViewer COMPLETED at:', new Date().toISOString());
  }, 300); // 增加延迟时间，确保 DOM 完全加载
}

// 销毁 Viewer 实例
export function destroyImageViewer() {
  console.log('[ImageViewer] destroyImageViewer called, has instance:', !!window.__viewerInstance);
  if (window.__viewerInstance) {
    // 先尝试关闭已打开的 Viewer
    if (document.querySelector('.viewer-container')) {
      window.__viewerInstance.hide();
    }
    window.__viewerInstance.destroy();
    window.__viewerInstance = null;
    console.log('[ImageViewer] Viewer instance destroyed');
  } else {
    console.log('[ImageViewer] No viewer instance to destroy');
  }
}