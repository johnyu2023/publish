import{_ as a,c as i,o as n,ak as e}from"./chunks/framework.CEodobM6.js";const c=JSON.parse('{"title":"Mermaid 弹框测试","description":"","frontmatter":{},"headers":[],"relativePath":"test-mermaid-modal.md","filePath":"test-mermaid-modal.md"}'),t={name:"test-mermaid-modal.md"};function l(p,s,h,E,r,d){return n(),i("div",null,[...s[0]||(s[0]=[e(`<h1 id="mermaid-弹框测试" tabindex="-1">Mermaid 弹框测试 <a class="header-anchor" href="#mermaid-弹框测试" aria-label="Permalink to &quot;Mermaid 弹框测试&quot;">​</a></h1><p>这个页面用来测试 Mermaid 图表的点击弹框功能。</p><h2 id="点击下方图表查看放大效果" tabindex="-1">点击下方图表查看放大效果 <a class="header-anchor" href="#点击下方图表查看放大效果" aria-label="Permalink to &quot;点击下方图表查看放大效果&quot;">​</a></h2><h3 id="流程图示例-默认尺寸" tabindex="-1">流程图示例（默认尺寸） <a class="header-anchor" href="#流程图示例-默认尺寸" aria-label="Permalink to &quot;流程图示例（默认尺寸）&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">graph TD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    A[开始] --&gt; B[安装依赖]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    B --&gt; C[配置 VitePress]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    C --&gt; D[编写 markdown]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D --&gt; E[部署网站]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    E --&gt; F[结束]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt; G[维护更新]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    G --&gt; H[再次部署]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    H --&gt; F</span></span></code></pre></div><h3 id="序列图示例-自定义尺寸-80-x-70" tabindex="-1">序列图示例（自定义尺寸 80% x 70%） <a class="header-anchor" href="#序列图示例-自定义尺寸-80-x-70" aria-label="Permalink to &quot;序列图示例（自定义尺寸 80% x 70%）&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant User</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Browser</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant VitePress</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Mermaid</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    User-&gt;&gt;Browser: facesit website</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Browser-&gt;&gt;VitePress: request page</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    VitePress-&gt;&gt;Mermaid: render chart</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Mermaid-&gt;&gt;Browser: return SVG</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Browser-&gt;&gt;User: show page</span></span></code></pre></div><h3 id="甘特图示例-自定义尺寸-90-x-85" tabindex="-1">甘特图示例（自定义尺寸 90% x 85%） <a class="header-anchor" href="#甘特图示例-自定义尺寸-90-x-85" aria-label="Permalink to &quot;甘特图示例（自定义尺寸 90% x 85%）&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">gantt</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    title 项目时间规划</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    dateFormat  YYYY-MM-DD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    section 研究阶段</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     设计1:  des1, 2025-01-01, 2025-01-05</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     UI设计:   des2, 2025-01-06, 3d</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    section 开发阶段</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     前端开发:  dev1, 2025-01-09, 7d</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     后端开发:   dev2, 2025-01-12, 7d</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     测试:      test, 2025-01-17, 3d</span></span></code></pre></div><h3 id="复杂流程图示例-自定义尺寸-95-x-90" tabindex="-1">复杂流程图示例（自定义尺寸 95% x 90%） <a class="header-anchor" href="#复杂流程图示例-自定义尺寸-95-x-90" aria-label="Permalink to &quot;复杂流程图示例（自定义尺寸 95% x 90%）&quot;">​</a></h3><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">graph TD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    A[开始安装和配置] --&gt; B[安装依赖包]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    B --&gt; C{配置环境变量}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    C --&gt; D[配置 VitePress 主题]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    D --&gt; E[配置 Mermaid 支持]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    E --&gt; F[开始开发]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    E --&gt; G[____配置插件____]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    E --&gt; H[配置自定义组件]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    H --&gt; I[结束配置]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    G --&gt; H[配置自定义组件]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    F --&gt; J[____构建项目____]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    J --&gt; K[配置]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    K --&gt; L[____部署网站____]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    L --&gt; M[结束]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    J --&gt; M[结束]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    K --&gt; M[配置]</span></span></code></pre></div><h2 id="功能描述" tabindex="-1">功能描述 <a class="header-anchor" href="#功能描述" aria-label="Permalink to &quot;功能描述&quot;">​</a></h2><p>每个 Mermaid 图表现在都可以点击打开弹框，并放大到适合弹框的大小。点击图表任意位置即可打开弹框，点击右上角的关闭按钮或弹框外区域即可关闭。</p><h3 id="新增功能" tabindex="-1">新增功能 <a class="header-anchor" href="#新增功能" aria-label="Permalink to &quot;新增功能&quot;">​</a></h3><ol><li><strong>可配置弹框尺寸</strong>：通过 <code>modalWidth</code> 和 <code>modalHeight</code> 属性设置弹框的宽度和高度，默认为 95%</li><li><strong>缩放功能</strong>：弹框中提供 +、- 和重置按钮进行缩放，也可以使用鼠标滚轮缩放</li><li><strong>拖拽功能</strong>：可以通过鼠标拖拽移动图表视图</li><li><strong>实时缩放比例显示</strong>：显示当前图表的缩放比例</li></ol><h3 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to &quot;使用方法&quot;">​</a></h3><p>只需要使用标准的 mermaid 代码块语法即可，如上面的示例所示。</p>`,17)])])}const g=a(t,[["render",l]]);export{c as __pageData,g as default};
