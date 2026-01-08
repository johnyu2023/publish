import DefaultTheme from 'vitepress/theme'
import LayoutWrapper from './LayoutWrapper.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import RecentArticles from './components/RecentArticles.vue'
import MyCustomComponent from './components/MyCustomComponent.vue'
import VueDemo from './components/VueDemo.vue'
import Mermaid from './components/Mermaid.vue'
import CategoryLatestLink from './components/CategoryLatestLink.vue'
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
    app.component('CategoryLatestLink', CategoryLatestLink)
    
    // 在应用启动时初始化图片查看器
    if (typeof window !== 'undefined') {
      console.log('[ImageViewer] App enhancer: initializing image viewer in 500ms');
      // 稍微延迟以确保 DOM 渲染完成
      setTimeout(() => {
        console.log('[ImageViewer] App enhancer: calling initImageViewer after 500ms delay');
        initImageViewer();
      }, 500);
      
      // 监听 VitePress 的页面变化事件
      document.addEventListener('vitepress:page:finish', () => {
        console.log('[ImageViewer] App enhancer: vitepress:page:finish event received, initializing in 300ms');
        setTimeout(() => {
          console.log('[ImageViewer] App enhancer: calling initImageViewer after vitepress:page:finish event');
          initImageViewer();
        }, 300);
      });

      // 监听 HMR 事件以处理热更新
      if (import.meta.hot) {
        console.log('[ImageViewer] HMR detected, adding update listener');
        import.meta.hot.accept(() => {
          console.log('[ImageViewer] HMR update detected, reinitializing viewer in 1000ms');
          setTimeout(() => {
            initImageViewer();
          }, 1000);
        });
      }
    }
  }
}