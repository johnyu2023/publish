import DefaultTheme from 'vitepress/theme'
import BlogPost from '../components/BlogPost.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  
  Layout,
  
  enhanceApp({ app }) {
    // 全局注册组件
    app.component('BlogPost', BlogPost)
  }
}
