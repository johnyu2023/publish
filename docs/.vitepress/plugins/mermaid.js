import { defineConfig } from 'vitepress'
import { MermaidPlugin } from 'vitepress-plugin-mermaid'

export default defineConfig({
  vite: {
    plugins: [MermaidPlugin()]
  }
})