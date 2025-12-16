<template>
  <div class="category-grid">
    <div class="category-card" @click="goTo('/ai/')">
      <h3>🤖 人工智能</h3>
      <p>AI技术发展与应用</p>
      <div class="article-preview">
        <h4>最新文章</h4>
        <ul>
          <li>人工智能的未来发展</li>
        </ul>
      </div>
    </div>
    
    <div class="category-card" @click="goTo('/foundation/')">
      <h3>📘 基础知识</h3>
      <p>计算机科学基础知识</p>
      <div class="article-preview">
        <h4>最新文章</h4>
        <ul>
          <li>计算机基础知识</li>
        </ul>
      </div>
    </div>
    
    <div class="category-card" @click="goTo('/fullstack/')">
      <h3>💻 全栈开发</h3>
      <p>前后端开发实践</p>
      <div class="article-preview">
        <h4>最新文章</h4>
        <ul>
          <li>全栈开发指南</li>
        </ul>
      </div>
    </div>
    
    <div class="category-card" @click="goTo('/think/')">
      <h3>💭 观察思考</h3>
      <p>对技术发展的观察</p>
      <div class="article-preview">
        <h4>最新文章</h4>
        <ul>
          <li>技术观察与思考</li>
        </ul>
      </div>
    </div>
    
    <div class="category-card" @click="goTo('/other/')">
      <h3>📋 技术文档</h3>
      <p>实用技术参考文档</p>
      <div class="article-preview">
        <h4>最新文章</h4>
        <ul>
          <li>技术文档示例</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vitepress/client'

const router = useRouter()

const goTo = (path) => {
  router.go(path)
}
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 0 1rem;
}

.category-card {
  background: #fff;
  border: 1px solid #eaecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-color: #3eaf7c;
}

.category-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-card p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.article-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #eaecef;
}

.article-preview h4 {
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 0.5rem 0;
}

.article-preview ul {
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: disc;
  color: #666;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>