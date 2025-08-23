// 添加固定标题栏功能
export function setupFixedTitle() {
  if (typeof window === 'undefined') return;

  // 创建固定标题栏元素
  const fixedTitleBar = document.createElement('div');
  fixedTitleBar.className = 'fixed-article-title';
  fixedTitleBar.style.position = 'fixed';
  fixedTitleBar.style.top = '60px';
  fixedTitleBar.style.left = '272px';
  fixedTitleBar.style.right = '0';
  fixedTitleBar.style.height = '40px';
  fixedTitleBar.style.backgroundColor = 'var(--vp-c-bg)';
  fixedTitleBar.style.borderBottom = '1px solid var(--vp-c-divider)';
  fixedTitleBar.style.zIndex = '10';
  fixedTitleBar.style.display = 'flex';
  fixedTitleBar.style.alignItems = 'center';
  fixedTitleBar.style.padding = '0 24px';
  fixedTitleBar.style.fontSize = '16px';
  fixedTitleBar.style.fontWeight = '500';
  fixedTitleBar.style.color = 'var(--vp-c-text-1)';
  fixedTitleBar.style.transition = 'opacity 0.3s';
  fixedTitleBar.style.opacity = '0';
  document.body.appendChild(fixedTitleBar);

  // 检查当前页面类型和更新标题栏的函数
  function updateTitleBarVisibility() {
    // 检查当前是否在首页
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html' || 
                       window.location.pathname === '/publish/' || 
                       window.location.pathname === '/publish/index.html';
    
    // 如果是首页，隐藏标题栏
    if (isHomePage) {
      fixedTitleBar.style.display = 'none';
      return;
    } else {
      fixedTitleBar.style.display = 'flex';
    }

    // 获取主标题元素
    const mainTitle = document.querySelector('.VPDoc h1');
    if (!mainTitle) {
      fixedTitleBar.style.display = 'none';
      return;
    }

    // 设置固定标题栏的内容
    fixedTitleBar.textContent = mainTitle.textContent;

    // 获取主标题的位置
    const titleRect = mainTitle.getBoundingClientRect();
    
    // 如果主标题不在可视区域内，显示固定标题栏
    if (titleRect.bottom < 60) {
      fixedTitleBar.style.opacity = '1';
    } else {
      fixedTitleBar.style.opacity = '0';
    }
  }

  // 监听路由变化
  window.addEventListener('popstate', updateTitleBarVisibility);
  
  // 监听点击事件，用于捕获内部导航
  document.addEventListener('click', (e) => {
    // 延迟执行，等待导航完成
    setTimeout(updateTitleBarVisibility, 100);
  });

  // 监听滚动事件
  window.addEventListener('scroll', updateTitleBarVisibility);

  // 初始化
  setTimeout(updateTitleBarVisibility, 1000); // 等待1秒，确保DOM已经加载
}
