import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

// 图片查看器初始化函数
export function initImageViewer() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeViewer);
  } else {
    setTimeout(initializeViewer, 300); // 延迟一下确保内容渲染完成
  }

  // 监听路由变化，重新初始化查看器
  // 在 VitePress 中使用原生事件监听
  document.addEventListener('vitepress:page:finish', initializeViewer);
  
  // Vue Router 的 onAfterRouteChanged 类似监听
  if (typeof window !== 'undefined') {
    let timeoutId;
    const handleUrlChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(initializeViewer, 300);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
  }
}

// 初始化 Viewer
function initializeViewer() {
  // 先销毁之前的实例
  if (window.__viewerInstance) {
    window.__viewerInstance.destroy();
    window.__viewerInstance = null;
  }

  // 等待一点时间确保 DOM 更新完成
  setTimeout(() => {
    const gallery = document.querySelector('.VPContent');
    if (gallery) {
      // 排除特定元素（例如代码块中的图片，或其他不需要查看器的图片）
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
          return !img.classList.contains('no-viewer') && 
                 !img.closest('.vp-code-group') && 
                 !img.closest('pre') &&
                 !img.closest('code');
        },
        viewed() {
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
      
      // 对于已经具有自定义点击事件的图片，添加额外处理
      const images = gallery.querySelectorAll('img');
      images.forEach(img => {
        if (!img.classList.contains('viewer-inited')) {
          img.classList.add('viewer-inited');
          // 确保图片能被 Viewer 处理，即使有其他点击事件
          img.addEventListener('click', function(e) {
            // 如果点击事件被其他处理器阻止冒泡，我们仍然要启动查看器
            if (window.__viewerInstance && !e.defaultPrevented) {
              // 延迟执行以确保其他事件处理器已经运行
              setTimeout(() => {
                // 手动触发 viewer
                const galleryElement = document.querySelector('.VPContent');
                if (galleryElement && window.__viewerInstance) {
                  // Viewer 会自动处理点击的图片
                }
              }, 10);
            }
          }, { capture: true }); // 使用捕获阶段以确保我们的处理优先
        }
      });
    }
  }, 100);
}

// 销毁 Viewer 实例
export function destroyImageViewer() {
  if (window.__viewerInstance) {
    window.__viewerInstance.destroy();
    window.__viewerInstance = null;
  }
}