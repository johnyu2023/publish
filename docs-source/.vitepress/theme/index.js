import { h, ref, onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ShowAllList from '../components/ShowAllList.vue'

// 创建响应式状态和方法
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// 处理全局关闭模态框事件
const handleGlobalCloseModal = () => {
  closeModal()
}

export default {
  extends: DefaultTheme,
  
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
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
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
          // 使用 ShowAllList 组件显示所有文章
          h(ShowAllList)
        ])
      ]) : null
    })
  },
  
  setup() {
    // 注册全局事件监听器
    onMounted(() => {
      window.addEventListener('close-modal', handleGlobalCloseModal)
    })
    
    // 移除全局事件监听器
    onUnmounted(() => {
      window.removeEventListener('close-modal', handleGlobalCloseModal)
    })
  }
}
