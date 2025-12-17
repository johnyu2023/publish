import { nextTick } from 'vue'
import { defineClientComponent } from 'vitepress'

export default defineClientComponent({
  async setup() {
    const { default: mermaid } = await import('mermaid')
    
    // 配置 Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })

    // 等待 DOM 更新
    await nextTick()
    
    // 查找所有 mermaid 代码块并渲染
    const codeBlocks = document.querySelectorAll('pre code.language-mermaid')
    codeBlocks.forEach((codeBlock, index) => {
      const preElement = codeBlock.parentElement
      const code = codeBlock.textContent
      
      if (preElement && code) {
        const containerId = `mermaid-${Date.now()}-${index}`
        
        try {
          // 渲染 Mermaid 图表
          const { svg } = mermaid.render(containerId, code)
          
          // 替换代码块为渲染后的 SVG
          const div = document.createElement('div')
          div.className = 'mermaid'
          div.innerHTML = svg
          preElement.parentElement.replaceChild(div, preElement)
        } catch (e) {
          console.error('Mermaid render error:', e.message)
        }
      }
    })
  }
})