import DefaultTheme from 'vitepress/theme'
import PostDate from '../components/PostDate.vue'
import BlogPost from '../components/BlogPost.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('PostDate', PostDate)
    app.component('BlogPost', BlogPost)
  }
}
