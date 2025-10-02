import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h('div', {
        style: {
          backgroundColor: 'red',
          color: 'white',
          padding: '20px',
          fontSize: '20px'
        }
      }, 'TEST DEBUG MESSAGE')
    })
  }
}
