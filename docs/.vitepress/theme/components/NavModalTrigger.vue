<template>
  <button @click="$emit('openModal')" class="nav-modal-trigger">
    导航
  </button>
</template>

<script setup>
defineEmits(['openModal'])
</script>

<style scoped>
.nav-modal-trigger {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.nav-modal-trigger:hover {
  background-color: #3ca06f;
}
</style>