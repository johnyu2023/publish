<template>
  <div class="tree-node">
    <div class="tree-node-header" :class="`level-${node.level}`">
      <button 
        v-if="node.hasChildren" 
        class="expand-toggle"
        @click="toggleNode"
        :class="{ expanded: node.expanded }"
      >
        <span class="expand-icon">{{ node.expanded ? '▼' : '▶' }}</span>
      </button>
      <span v-else class="no-expand"></span>
      <a 
        :href="`#${node.id}`" 
        @click.prevent="$emit('scrollToHeading', node.id)"
        class="outline-link"
      >
        {{ node.text }}
      </a>
    </div>
    <transition name="slide">
      <div v-show="node.expanded" class="tree-node-children">
        <TreeItem
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          @scrollToHeading="$emit('scrollToHeading', $event)"
          @toggle-node="$emit('toggleNode', $event)"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['scrollToHeading', 'toggleNode'])

const toggleNode = () => {
  emit('toggleNode', props.node)
}
</script>

<style scoped>
.tree-node {
  margin: 0.125rem 0;
}

.tree-node-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.expand-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.expand-toggle:hover {
  color: var(--vp-c-brand-1);
}

.expand-toggle.expanded {
  transform: rotate(0deg);
}

.no-expand {
  width: 1.2rem;
  display: inline-block;
}

.tree-node-children {
  margin-left: 1rem;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 0.5rem;
}

.slide-enter-active, .slide-leave-active {
  max-height: 1000px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>