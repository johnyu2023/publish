import DefaultTheme from 'vitepress/theme'
import LayoutWrapper from './LayoutWrapper.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import RecentArticles from './components/RecentArticles.vue'
import MyCustomComponent from './components/MyCustomComponent.vue'
import VueDemo from './components/VueDemo.vue'
import Mermaid from './components/Mermaid.vue'
import { initImageViewer } from './plugins/imageViewer'
import './style.css'

// 引入 KaTeX CSS
if (typeof window !== 'undefined') {
  import('katex/dist/katex.min.css')
}

export default {
  ...DefaultTheme,
  Layout: LayoutWrapper,
  enhanceApp({ app }) {
    app.component('CategoryGrid', CategoryGrid)
    app.component('RecentArticles', RecentArticles)
    app.component('MyCustomComponent', MyCustomComponent)
    app.component('VueDemo', VueDemo)
    app.component('Mermaid', Mermaid)
    
    // 在应用启动时初始化图片查看器
    if (typeof window !== 'undefined') {
      // 稍微延迟以确保 DOM 渲染完成
      setTimeout(initImageViewer, 500);
      
      // 监听 VitePress 的页面变化事件
      document.addEventListener('vitepress:page:finish', () => {
        setTimeout(initImageViewer, 300);
      });
    }
  }
}