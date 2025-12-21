<template>
  <Layout>
    
    
    <!-- 在文档内容前插入 frontmatter 信息 -->
    <template #doc-before>
      <!-- 只在文章页面（非首页）显示 -->
      <div v-if="frontmatter.layout !== 'home'" class="frontmatter-meta">
        <div v-if="frontmatter.title" class="meta-item">
          <strong>标题：</strong>
          <span>{{ frontmatter.title }}</span>
        </div>
        <div v-if="frontmatter.description" class="meta-item">
          <strong>描述：</strong>
          <span>{{ frontmatter.description }}</span>
        </div>
        <div v-if="frontmatter.author" class="meta-item">
          <strong>作者：</strong>
          <span>{{ frontmatter.author }}</span>
        </div>
        <div v-if="frontmatter.date" class="meta-item">
          <strong>发布日期：</strong>
          <span>{{ formatDate(frontmatter.date) }}</span>
        </div>
        <div v-if="frontmatter.tags" class="meta-item">
          <strong>标签：</strong>
          <div class="tags">
            <span v-for="tag in frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div v-if="frontmatter.summary" class="meta-item">
          <strong>摘要：</strong>
          <span>{{ frontmatter.summary }}</span>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import Layout from 'vitepress/dist/client/theme-default/Layout.vue'
import NavModalTrigger from './components/NavModalTrigger.vue'
import Modal from './components/Modal.vue'
import { ref } from 'vue'
import { useData } from 'vitepress'

const { Layout: ParentLayout } = DefaultTheme
const { frontmatter } = useData()

const showModal = ref(false)
const counter = ref(0)
const inputText = ref('')

const openModal = () => {
  showModal.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
}
</script>

<style scoped>
.frontmatter-meta {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.meta-item {
  margin-bottom: 0.5rem;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.tags {
  display: inline-block;
}

.tag {
  display: inline-block;
  background: #e0e0e0;
  padding: 0.2em 0.6em;
  border-radius: 4px;
  margin-right: 0.4em;
  font-size: 0.85rem;
}

.modal-content-area {
  min-height: 200px;
}

.interactive-section {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.links-section {
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.links-section ul {
  list-style-type: none;
  padding-left: 0;
}

.links-section li {
  margin: 5px 0;
}

.links-section a {
  color: #3eaf7c;
  text-decoration: none;
}

.links-section a:hover {
  text-decoration: underline;
}

button {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3ca06f;
}

input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}
</style>