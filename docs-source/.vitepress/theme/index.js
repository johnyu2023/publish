import DefaultTheme from 'vitepress/theme'
import BlogPost from '../components/BlogPost.vue'
import Layout from './Layout.vue'
import VPDocFooter from './components/VPDocFooter.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  
  Layout,
  
  enhanceApp({ app }) {
    // 全局注册组件
    app.component('BlogPost', BlogPost)
  },
  
  // 覆盖默认主题组件
  setupSidebarItems() {
    return {
      // 使用自定义的 VPDocFooter 组件替换默认的
      VPDocFooter
    }
  }
}
