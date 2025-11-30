---
title: 历史事件
pageType: history
---

<script setup>
import { ref, onMounted } from 'vue'
import HistoryTimeline from '../.vitepress/components/HistoryTimeline.vue'
</script>

<HistoryTimeline />

<style>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.history-page h1 {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .history-page {
    padding: 1rem 0.5rem;
  }
}
</style>