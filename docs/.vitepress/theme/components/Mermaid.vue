<template>
  <div ref="mermaidContainer" class="mermaid-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: false,
    default: ''
  },
  graph: {
    type: String,
    required: false,
    default: ''
  }
})

// 解码 URL 编码的代码，并使用 graph 属性（如果提供）优先于 code 属性
const mermaidCode = decodeURIComponent(props.graph || props.code)

const mermaidContainer = ref(null)

onMounted(async () => {
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      fontFamily: 'inherit',
      securityLevel: 'loose'
    })

    if (mermaidContainer.value) {
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      const { svg, bindFunctions } = await mermaid.render(id, mermaidCode)

      mermaidContainer.value.innerHTML = svg
      
      if (bindFunctions) {
        bindFunctions(mermaidContainer.value)
      }
    }
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error)
    if (mermaidContainer.value) {
      mermaidContainer.value.innerHTML = `<pre>${props.code}</pre>`
    }
  }
})
</script>

<style>
.mermaid-container {
  margin: 1.5rem 0;
  overflow: auto;
}
</style>