import DefaultTheme from 'vitepress/theme'
import BlogPost from '../components/BlogPost.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  
  enhanceApp({ app }) {
    // 全局注册 BlogPost 组件
    app.component('BlogPost', BlogPost)
  }
}