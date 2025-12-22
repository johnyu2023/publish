import{_ as n,c as s,o as l,a1 as p}from"./chunks/framework.6sy4tsQT.js";const h=JSON.parse('{"title":"AI辅助编程03-AI时代编程的尽头是软件工程，印度人也是怎么想的吗？真是的","description":"探讨使用AI辅助编程的最佳实践和常见陷阱","frontmatter":{"title":"AI辅助编程03-AI时代编程的尽头是软件工程，印度人也是怎么想的吗？真是的","description":"探讨使用AI辅助编程的最佳实践和常见陷阱","date":"2025-12-10T00:00:00.000Z","tags":["AI Coding"]},"headers":[],"relativePath":"think/ai-coding-03.md","filePath":"think/ai-coding-03.md"}'),i={name:"think/ai-coding-03.md"};function e(t,a,o,c,d,r){return l(),s("div",null,[...a[0]||(a[0]=[p(`<blockquote><p>Ai Coding 的尽头是软件工程</p></blockquote><p>对于这大半年的 AI 辅助编程，我有一些经验和教训，分享给大家。</p><h2 id="体会的经验教训" tabindex="-1">体会的经验教训 <a class="header-anchor" href="#体会的经验教训" aria-label="Permalink to &quot;体会的经验教训&quot;">​</a></h2><ul><li>单轮对话的可靠性很强，但多轮对话的可靠性会急剧下降 - 原子化任务，尽量减少上下文内容，避免多轮对话后上下文的急剧膨胀</li><li>随机性错误可能是致命的，且难以回退 - 多用 git 提交代码，回滚有着落</li><li>提示词才是最重要的资产，随时准备推倒重来 - 提示词需要保存好，特别是在越来越长的提示词大趋势下</li><li>及时备份代码，整理技术规范，这是重来的基石 - 重来不可怕，要拥抱重来，做好准备</li><li>掌控力是 AI 辅助编程的关键，膨胀失控的代码是可怕的 - 只有人类做AI的主人，才不会被牵着鼻子走</li></ul><h2 id="目前的-ai-coding-工具" tabindex="-1">目前的 AI Coding 工具 <a class="header-anchor" href="#目前的-ai-coding-工具" aria-label="Permalink to &quot;目前的 AI Coding 工具&quot;">​</a></h2><ul><li>wucai code + qwen3-coder-plus - 每天2000次免费调用，但本身有一定BUG，太复杂的问题会超时卡死 - 速度快，但有时还不如 web 版本的 Qwen 有智慧</li><li>claude + glm4.6 - 每5小时120次调用，包季 - 有时很慢，可以备用</li><li>Trae CN - 免费，主要拿来看代码，调用模型有时慢且蠢</li><li>Cursor - 太慢，弃坑</li><li>Lingma - 收费，弃坑</li><li>CodeBuddy - 收费，弃坑</li></ul><h2 id="多轮对话是最大的挑战" tabindex="-1">多轮对话是最大的挑战 <a class="header-anchor" href="#多轮对话是最大的挑战" aria-label="Permalink to &quot;多轮对话是最大的挑战&quot;">​</a></h2><ul><li>上下文中信息越来越多，过多的信息反而会分散 AI 的注意力</li><li>每轮对话都有一定的偏差的概率可能，多轮叠加后，偏差会越来越大，且急剧增加</li><li>AI 可能会重复开发类似的功能，导致代码膨胀冗余，维护难度加大</li><li>写小工具和shell脚本真的强，原因是轮数不会很多，项目整体结构也不会太复杂</li><li>项目一旦上规模，打磨spec的时间成指数增长，连lib特定版本的坑也得明确地写进去</li><li>ai 是提升效率，而非替代。替代的是不用 ai 的程序员</li><li>有前端和后端的项目，每个新功能要修改逻辑的时候都会有很多的问题，必须要各端独立去修改，否则大概率不理想</li></ul><h2 id="重构时的挑战" tabindex="-1">重构时的挑战 <a class="header-anchor" href="#重构时的挑战" aria-label="Permalink to &quot;重构时的挑战&quot;">​</a></h2><h3 id="不确定性" tabindex="-1">不确定性 <a class="header-anchor" href="#不确定性" aria-label="Permalink to &quot;不确定性&quot;">​</a></h3><ul><li>AI 实现时，可能会做多种尝试，有些是失败的，有些是成功的。对于失败的尝试，会实现多种方案，也会清理失败的代码，但可能清理不全</li><li>多次使用AI，可能会得到不同的结果，因此可能会存在冗余或重复的代码</li><li>每次完成前，需要小心清理，可以列出清单，问 AI 是否需要这些代码，让它重新思考一下，如果不需要，就清理掉</li><li>你可以让AI快速生成一个能用的东西，但你完全不理解它是怎么实现的。想改一点点？做不到。只能整个扔掉重新生成。</li></ul><h2 id="典型案例-失败再现" tabindex="-1">典型案例 - 失败再现 <a class="header-anchor" href="#典型案例-失败再现" aria-label="Permalink to &quot;典型案例 - 失败再现&quot;">​</a></h2><h3 id="场景描述" tabindex="-1">场景描述 <a class="header-anchor" href="#场景描述" aria-label="Permalink to &quot;场景描述&quot;">​</a></h3><ul><li>一个 web 项目，后端用 python 的 fastapi 框架，前端用 vue3 框架。</li><li>项目开始很正常，用户登录功能完好。</li><li>在加了一个功能后，发现用户登录后会有警告信息，告知 AI 解决此问题</li></ul><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>登录成功了，但是登录成功后，控制台有报警信息。</span></span>
<span class="line"><span>Auth Store: 显示登录对话框</span></span>
<span class="line"><span>auth.js:151 Auth Store: 登录后用户信息已设置: {id: 2, username: &#39;changjiang&#39;, nickname: &#39;长江&#39;, role: &#39;admin&#39;, created_at: &#39;2025-11-04T07:07:59&#39;, …}</span></span>
<span class="line"><span>auth.js:156 Auth Store: 登录成功，用户: changjiang</span></span>
<span class="line"><span>auth.js:213 Auth Store: 隐藏登录对话框</span></span>
<span class="line"><span>2LoginDialog.vue:3 [Vue warn] Write operation failed: computed value is readonly</span></span></code></pre></div><h3 id="第一轮失败的尝试" tabindex="-1">第一轮失败的尝试 <a class="header-anchor" href="#第一轮失败的尝试" aria-label="Permalink to &quot;第一轮失败的尝试&quot;">​</a></h3><ul><li>看上去是个简单的问题，告知 AI ，让它自己去解决这个问题</li><li>AI 改了一轮，发现问题更严重了</li><li>AI 改了多轮后，发现问题越来越严重，改动了很多次</li><li>AI 在某次改动后，觉得应该是后端接口有问题，开始改起了后端的代码</li><li>此时被我果断喊停。感觉不能让它继续放飞自我了，于是回滚代码，重新开始</li></ul><h3 id="第二轮失败的尝试" tabindex="-1">第二轮失败的尝试 <a class="header-anchor" href="#第二轮失败的尝试" aria-label="Permalink to &quot;第二轮失败的尝试&quot;">​</a></h3><ul><li>提示词里明确了边界，不要去改后端代码，这就是前端代码问题。并告知了几个上一轮它自己得出的结论</li></ul><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>登录成功了，但是登录成功后，控制台有条报警信息。你要谨慎修改它，之前有1次都是改这个问题时，弄得一直错，而且</span></span>
<span class="line"><span>越改错得越离谱。注意，先理解先理解了Pinia的ref解包机制：在store中定义的ref在外部访问时会被自动解包成普通</span></span>
<span class="line"><span>响应式对象。其次，这个问题一定是前端代码错误导致的，不要去改后端代码。</span></span>
<span class="line"><span>Auth Store: 显示登录对话框</span></span>
<span class="line"><span>auth.js:151 Auth Store: 登录后用户信息已设置: {id: 2, username: &#39;changjiang&#39;, nickname: &#39;长江&#39;, role: &#39;admin&#39;, created_at: &#39;2025-11-04T07:07:59&#39;, …}</span></span>
<span class="line"><span>auth.js:156 Auth Store: 登录成功，用户: changjiang</span></span>
<span class="line"><span>auth.js:213 Auth Store: 隐藏登录对话框</span></span>
<span class="line"><span>2LoginDialog.vue:3 [Vue warn] Write operation failed: computed value is readonly</span></span></code></pre></div><ul><li>AI 改了很多轮，发现绕来绕去，开始绕圈子了，问题无法解决，于是提示词里指出绕圈子的问题</li><li>AI 无法搞定，给了一个让人啼笑皆非的回复。感觉可能是它内部设定的尝试上限到了，所以打算撂挑子了</li></ul><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>  现在我回到了最原始的实现，它应该能解决422错误和大部分Vue警告。原始实现利用了Pinia的自动解包特性，虽然这之</span></span>
<span class="line"><span>  前导致了422错误，但可能是因为缓存问题。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  这个实现与项目最初的工作版本相同：</span></span>
<span class="line"><span>   - 使用computed返回authStore.loginForm</span></span>
<span class="line"><span>   - 使用v-model进行双向绑定</span></span>
<span class="line"><span>   - 保持了所有原始功能</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  如果原始代码中确实存在Vue警告，那它可能是一个更深层的框架或Element Plus内部的问题，而不是我们代码的问题。但</span></span>
<span class="line"><span>  至少登录功能现在应该能正常运行，而我们添加的数据管理功能也保持完好。</span></span></code></pre></div><h3 id="解决方案-它山之石可以攻玉" tabindex="-1">解决方案 - 它山之石可以攻玉 <a class="header-anchor" href="#解决方案-它山之石可以攻玉" aria-label="Permalink to &quot;解决方案 - 它山之石可以攻玉&quot;">​</a></h3><ul><li>于是我在网页版的 Qwen 里提问，将警告信息和对应的源代码文件贴给它</li><li>Qwen 快速给了一个看上去很靠谱的答案</li></ul><div class="language-plaintext vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plaintext</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你遇到的 Vue 警告：</span></span>
<span class="line"><span>[Vue warn] Write operation failed: computed value is readonly</span></span>
<span class="line"><span>根本原因在于：**你试图直接修改一个由 \`computed\` 创建的只读值（readonly computed ref）**。</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 🔍 问题定位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>从错误堆栈和你的代码来看，问题出在：</span></span>
<span class="line"><span>v-model=&quot;showLoginDialog&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>而 \`showLoginDialog\` 是从 \`useAuth()\` 中解构出来的，**它很可能是一个 \`computed\` 属性（例如</span></span>
<span class="line"><span>来自 Pinia store 的 state 或 getter）**，而不是一个可写的 \`ref\`。</span></span>
<span class="line"><span>在 Vue 3 中，\`v-model\` 会尝试对绑定的变量执行 **写操作（即赋值）**，例如当用户点击关闭按钮或</span></span>
<span class="line"><span>按 ESC 时，\`el-dialog\` 会尝试把 \`showLoginDialog\` 设为 \`false\`。</span></span>
<span class="line"><span>但如果 \`showLoginDialog\` 是一个 \`computed(() =&gt; store.showLoginDialog)\`（只读），那么 Vue 会</span></span>
<span class="line"><span>拒绝写入，并抛出这个警告。</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### ✅ 正确做法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你不应该直接对 store 中的状态使用 \`v-model\`，尤其是当它是只读的（比如来自 Pinia 的 state，</span></span>
<span class="line"><span>通过 \`storeToRefs\` 或 \`computed\` 暴露时）。</span></span>
<span class="line"><span>#### 推荐解决方案：使用 **可写的 computed（带 setter）** 或 **本地 ref + 同步**</span></span>
<span class="line"><span>但更符合 Vue + Pinia 最佳实践的方式是：**不要让 UI 直接修改 store 状态，而是通过 actions**。</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### ✅ 修复方案一（推荐）：**不在组件内用 v-model 直接绑定 store 状态**</span></span>
<span class="line"><span>修改 \`LoginDialog.vue\`：</span></span>
<span class="line"><span>#### 1. 在 setup 中创建一个 **本地 ref** 来控制对话框显隐</span></span>
<span class="line"><span>const dialogVisible = ref(false)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 2. 用 watch 监听 store 中的 \`showLoginDialog\`，同步到本地</span></span>
<span class="line"><span>watch(</span></span>
<span class="line"><span>  () =&gt; showLoginDialog.value,</span></span>
<span class="line"><span>  (val) =&gt; {</span></span>
<span class="line"><span>    dialogVisible.value = val</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  { immediate: true }</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 3. 当本地 dialog 关闭时，调用 action 关闭 store 中的状态</span></span>
<span class="line"><span>const handleDialogUpdate = (visible) =&gt; {</span></span>
<span class="line"><span>  dialogVisible.value = visible</span></span>
<span class="line"><span>  if (!visible) {</span></span>
<span class="line"><span>    handleCancelLogin() // 这个 action 应该会 commit 关闭对话框</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 4. 模板中绑定本地变量，并监听更新</span></span>
<span class="line"><span>&lt;el-dialog</span></span>
<span class="line"><span>  v-model=&quot;dialogVisible&quot;</span></span>
<span class="line"><span>  @update:modelValue=&quot;handleDialogUpdate&quot;</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; 注意：Element Plus 的 \`el-dialog\` 的 \`v-model\` 对应的是 \`modelValue\` prop 和 \`update:modelValue\` 事件。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 🔚 总结</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- **错误原因**：\`showLoginDialog\` 是只读的 computed，但 \`v-model\` 试图写入它。</span></span>
<span class="line"><span>- **解决方案**：</span></span>
<span class="line"><span>  - 方案 A（推荐）：使用本地 \`ref\` 控制 \`el-dialog\`，通过 watch 和事件与 store 同步。</span></span>
<span class="line"><span>  - 方案 B：将 \`showLoginDialog\` 改为带 setter 的可写 computed，setter 中调用 Pinia actions。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; 考虑到你已经在 \`handleCancelLogin\` 和 \`hideLoginDialog\` 中有 action，**方案 A 更清晰、更符合单向数据流**，也避免了在模板中隐式修改状态。</span></span></code></pre></div><ul><li>我将这个答案直接贴给了 AI ，它立即就给了一个新的实现，果然问题解决了。</li></ul><h2 id="典型案例-优化和重构" tabindex="-1">典型案例 - 优化和重构 <a class="header-anchor" href="#典型案例-优化和重构" aria-label="Permalink to &quot;典型案例 - 优化和重构&quot;">​</a></h2><h3 id="第一轮优化" tabindex="-1">第一轮优化 <a class="header-anchor" href="#第一轮优化" aria-label="Permalink to &quot;第一轮优化&quot;">​</a></h3><ul><li>完成了一个页面，页面里包含3个标签页，所有功能都正常了</li><li>让 AI 分析这个页面所涉及的代码，是否有逻辑重复、错误、冗余等问题，是否需要优化</li><li>AI 一通分析，于是让它优化</li></ul><h3 id="第二轮优化" tabindex="-1">第二轮优化 <a class="header-anchor" href="#第二轮优化" aria-label="Permalink to &quot;第二轮优化&quot;">​</a></h3><ul><li>考虑到最近也改写了身份认证的功能，所以让 AI 结合 身份认证 及 刚才这个页面 所涉及的代码，是否有逻辑重复、错误、冗余等问题，是否需要优化</li><li>AI 一通分析，于是让它优化</li><li>结果神奇地发现将一堆身份认证功能又塞回了页面中多个组件中，让每个组件各自判断身份认证是否成功，而不是我们之前做的路由守卫等机制</li><li>告诉 AI ，我需要将这些身份认证功能提取出来，放到一个单独的组件中，让它统一管理</li><li>AI 一通修改。</li></ul><h3 id="第三轮优化" tabindex="-1">第三轮优化 <a class="header-anchor" href="#第三轮优化" aria-label="Permalink to &quot;第三轮优化&quot;">​</a></h3><ul><li>重新让 AI 分析之前已经优化过的代码，是否存在逻辑重复、错误、冗余等问题</li><li>AI 一通分析，发现还有问题，又要优化</li><li>优化无止境吗？强烈怀疑中</li></ul><h3 id="ai-的迷之行为" tabindex="-1">AI 的迷之行为 <a class="header-anchor" href="#ai-的迷之行为" aria-label="Permalink to &quot;AI 的迷之行为&quot;">​</a></h3><ul><li>总是改些什么东西，把登录改坏，一直错一直错</li><li>居然把密码些在 placeholder 中，不知道是啥思路</li></ul>`,35)])])}const g=n(i,[["render",e]]);export{h as __pageData,g as default};
