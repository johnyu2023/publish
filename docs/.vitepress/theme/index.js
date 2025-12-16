import DefaultTheme from 'vitepress/theme'
import LayoutWrapper from './LayoutWrapper.vue'
import MyCustomComponent from './components/MyCustomComponent.vue'
import VueDemo from './components/VueDemo.vue'

export default {
  ...DefaultTheme,
  Layout: LayoutWrapper,
  enhanceApp({ app }) {
    app.component('MyCustomComponent', MyCustomComponent)
    app.component('VueDemo', VueDemo)
  }
}