import { h, ref, onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ShowAllTitle from '../components/ShowAllTitle.vue'
import ArticleListPage from '../components/ArticleListPage.vue'
import TimeArticleList from '../components/TimeArticleList.vue'
import BlogPost from '../components/BlogPost.vue'

// 导入 Naive UI
import naive from 'naive-ui'

// 在 VitePress 路由变化后重新初始化 Mermaid 交互功能
import { useRouter } from 'vitepress'

// 导入专门用于修复ShowAllList组件布局问题的样式
import './custom.css'
import './show-all-list-fix.css'

// 创建响应式状态和方法
const isModalOpen = ref(false)
const openModal = () => {
  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
  isModalOpen.value = true
}
const closeModal = () => {
  // 恢复背景滚动
  document.body.style.overflow = ''
  isModalOpen.value = false
}

// 阻止模态框内部滚动时背景页面滚动
const handleModalWheel = (event) => {
  const modalContent = event.currentTarget
  const scrollTop = modalContent.scrollTop
  const scrollHeight = modalContent.scrollHeight
  const clientHeight = modalContent.clientHeight
  const delta = event.deltaY

  // 检查是否在滚动边界
  const isAtTop = scrollTop <= 0
  const isAtBottom = scrollTop + clientHeight >= scrollHeight
  
  // 如果在滚动边界且试图继续滚动，则阻止默认行为
  if ((isAtTop && delta < 0) || (isAtBottom && delta > 0)) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    return false
  }
  
  // 如果在滚动范围内，允许滚动但阻止事件传播到父元素
  event.stopPropagation()
  event.stopImmediatePropagation()
}

// 处理触摸滚动事件，防止滚动传播
const handleModalTouchMove = (event) => {
  const modalContent = event.currentTarget
  const scrollTop = modalContent.scrollTop
  const scrollHeight = modalContent.scrollHeight
  const clientHeight = modalContent.clientHeight
  
  // 检查是否在滚动边界
  const isAtTop = scrollTop <= 0
  const isAtBottom = scrollTop + clientHeight >= scrollHeight
  
  // 如果在滚动边界，阻止事件传播
  if (isAtTop || isAtBottom) {
    event.stopPropagation()
    event.stopImmediatePropagation()
    return false
  }
  
  // 如果在滚动范围内，阻止事件传播到父元素
  event.stopPropagation()
  event.stopImmediatePropagation()
}

// 处理模态框内容的滚动，确保滚动流畅
const handleModalScroll = (event) => {
  const modalContent = event.currentTarget
  // 添加平滑滚动效果
  modalContent.style.scrollBehavior = 'smooth'
  event.stopPropagation()
}

// 处理模态框内部的滚动事件，确保滚动行为正确
const handleModalContentScroll = (event) => {
  event.stopPropagation()
}

// 处理全局关闭模态框事件
const handleGlobalCloseModal = () => {
  closeModal()
}

export default {
  extends: DefaultTheme,
  
  enhanceApp({ app }) {
    app.use(naive)
    app.component('BlogPost', BlogPost)
    app.component('TimeArticleList', TimeArticleList)
    app.component('ShowAllTitle', ShowAllTitle)
    // app.component('ArticleListPage', ArticleListPage)
  },

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => [
        // 高级导航按钮
        h('button', {
          onClick: openModal,
          style: {
            backgroundColor: 'gray',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            marginBottom: '10px',
            transition: 'background-color 0.3s'
          },
          onMouseover: (event) => {
            event.target.style.backgroundColor = '#707070'
          },
          onMouseout: (event) => {
            event.target.style.backgroundColor = 'gray'
          }
        }, '高级导航')
      ],
      // 将模态框放在 layout-bottom 位置，使其覆盖整个页面
      'layout-bottom': () => isModalOpen.value ? h('div', {
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000'
        },
        onClick: (event) => {
          // 点击遮罩层关闭模态窗口
          if (event.target === event.currentTarget) {
            closeModal()
          }
        }
      }, [
        h('div', {
          style: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '1200px',  // 增加50%
            width: '90%',
            height: '88vh',      // 固定高度
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }, [
          h('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px'
            }
          }, [
            h('h2', { style: { margin: 0 } }, '全部文章'),
            h('button', {
              onClick: closeModal,
              style: {
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }
            }, '×')
          ]),
          // 使用 ShowAllTitle 组件显示所有文章
          h('div', {
            style: {
              flex: 1,
              overflow: 'auto',
              padding: '10px 0'
            },
            onWheel: handleModalWheel,
            onScroll: handleModalScroll,
            onTouchMove: handleModalTouchMove
          }, [
            // 传入高度值，根据模态框高度计算合适的值
            h(ShowAllTitle, {
              height: 'calc(100% - 40px)', // 减去分类标签栏的高度
              inModal: true, // 在模态框中使用，需要触发关闭事件
              ref: 'showAllTitleRef',
              onScroll: handleModalContentScroll
            })
          ])
        ])
      ]) : null
    })
  },
  
  setup() {
    // 注册路由钩子，以便在页面切换时重新初始化 Mermaid 交互功能
    const router = useRouter();
    
    // 页面切换后重新初始化 Mermaid 交互功能
    router.onAfterRouteChanged = () => {
      // 给页面一些时间完成渲染
      setTimeout(() => {
        if (window.mermaidInteraction) {
          // 重新检查并设置新的 Mermaid 元素
          window.mermaidInteraction.setupMermaidElements();
        }
      }, 500);
    };
    
    // 注册全局事件监听器
    onMounted(() => {
      window.addEventListener('close-modal', handleGlobalCloseModal)
      window.addEventListener('open-articles-modal', openModal)
    })
    
    // 移除全局事件监听器
    onUnmounted(() => {
      window.removeEventListener('close-modal', handleGlobalCloseModal)
      window.removeEventListener('open-articles-modal', openModal)
    })
  }
}
