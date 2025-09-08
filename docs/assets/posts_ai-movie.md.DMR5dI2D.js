import{_ as e,C as i,c as p,o as u,G as t,w as c,j as l,a as n}from"./chunks/framework.BX-G93LU.js";const A=JSON.parse('{"title":"AI 制作长视频实践","description":"AI 可以方便地制作短视频，但涉及到长视频，就会面对很多挑战。","frontmatter":{"title":"AI 制作长视频实践","description":"AI 可以方便地制作短视频，但涉及到长视频，就会面对很多挑战。","date":"2025-09-07T00:00:00.000Z","tags":["AI","视频"]},"headers":[],"relativePath":"posts/ai-movie.md","filePath":"posts/ai-movie.md"}'),o={name:"posts/ai-movie.md"};function r(d,a,h,m,b,g){const s=i("BlogPost");return u(),p("div",null,[t(s,null,{default:c(()=>a[0]||(a[0]=[l("h2",{id:"ai-制作长视频面对的挑战",tabindex:"-1"},[n("AI 制作长视频面对的挑战 "),l("a",{class:"header-anchor",href:"#ai-制作长视频面对的挑战","aria-label":'Permalink to "AI 制作长视频面对的挑战"'},"​")],-1),l("ul",null,[l("li",null,"没有哪个 AI 生成视频的模型能提供长视频制作，一般都是在10秒以内，有些5秒，有些8秒，而且生成视频的速度都挺慢的。"),l("li",null,"多个短视频拼接，会面对人物不一致的问题"),l("li",null,"AI 生成视频或图片都存在偶然性，也就是俗称的抽卡，这种不确定性大大增加了难度"),l("li",null,"全链路需要多个工具配合，存在一定的门槛和难度"),l("li",null,"部分功能需要付费，有一定的成本门槛"),l("li",null,"AI 生成很多时候会人为加上水印，去水印有门槛"),l("li",null,"音质可能有问题")],-1),l("h2",{id:"ai-制作长视频的流程",tabindex:"-1"},[n("AI 制作长视频的流程 "),l("a",{class:"header-anchor",href:"#ai-制作长视频的流程","aria-label":'Permalink to "AI 制作长视频的流程"'},"​")],-1),l("ul",null,[l("li",null,"首先要有总体的剧本，不至于让故事跑偏。"),l("li",null,"根据剧本，生成分镜头脚本。"),l("li",null,"每个分镜头脚本，都要对应一个 AI 生成的短视频。"),l("li",null,"每个短视频，建议用首尾帧图片进行控制，再加提示词生成视频。"),l("li",null,"每个短视频，和其他短视频进行拼接时，可能涉及转场，可能要提前定义转场动画，在此短视频设计时考虑到这个问题。"),l("li",null,"多个短视频，通过工具进行拼接，成为一个完整的长视频。"),l("li",null,"每集可能有个“待续”标记，应统一规范"),l("li",null,"旁边要统一找个合适的语音风格"),l("li",null,"对白可能会需要用到静态图片+音频，制作数字人视频")],-1),l("h2",{id:"美术风格设计",tabindex:"-1"},[n("美术风格设计 "),l("a",{class:"header-anchor",href:"#美术风格设计","aria-label":'Permalink to "美术风格设计"'},"​")],-1),l("ul",null,[l("li",null,"最早需要定义的，卡通风格，写实美漫风格，真人风格等"),l("li",null,"可用从某些素材网站上购买素材。比如橙皮素材网，购买的是 fla 文件，需要用 Adobe Animate 才能打开，都是矢量图素材。它家的人物和表情是分开卖的，需要自己组合"),l("li",null,"也可以由 AI 来生成。豆包可以免费生成，但卡通人物参考生成后基本不像最初的样子。")],-1),l("h2",{id:"分镜头的设计",tabindex:"-1"},[n("分镜头的设计 "),l("a",{class:"header-anchor",href:"#分镜头的设计","aria-label":'Permalink to "分镜头的设计"'},"​")],-1),l("ul",null,[l("li",null,"可以将剧本交给 AI 工具来生成，各种 AI 工具都可以完成此任务"),l("li",null,"分镜头设计需要手工修改，有些是无法在后续 AI 生成环节中使用的，这个需要注意"),l("li",null,"分镜头设计可能会和美术风格冲突，需要手工调整")],-1),l("div",{class:"language-text vp-adaptive-theme"},[l("button",{title:"Copy Code",class:"copy"}),l("span",{class:"lang"},"text"),l("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[l("code",null,[l("span",{class:"line"},[l("span",null,"分镜头脚本示例：")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头1（旁白开场）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 黑屏渐亮，城市黄昏背景，高楼林立，一个身穿黄色外卖服、满脸疲惫的年轻男子（龙傲世）骑着电动车穿梭在车流中。画外音低沉旁白：“龙傲世为了供校花女友上大学送了4年外卖，那料女友刚毕业就把他甩到九霄云外，奸夫还发短信贴脸开大，让他放手证明爱。” 镜头拉远，他孤独的身影融入城市霓虹。")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"---")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头2（出租屋内景）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 室内，老旧出租屋，光线昏暗。龙傲世（黄外卖服，汗湿头发）站在门口，苏清月（精致妆容，LV包，拉行李箱）站在玄关，背对镜头，准备离开。环境：墙皮剥落，桌上堆满外卖单和泡面盒。")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"---")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头3（对话1）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 龙傲世正面特写，眼神疲惫带泪，声音颤抖：“阿月，我们六年的感情，你真的要走吗？” 苏清月侧脸冷笑，拉行李箱转身，语气轻蔑：“我是知名大学优秀毕业生，你一个大学都没上完，就去跑外卖的穷屌丝怎么配得上我？”")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"---")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头4（内心独白+旁白）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 龙傲世定定凝视苏清月，眼神痛苦。画面叠加半透明字幕：“可我之所以放弃上大学，出来跑外卖都是为了你啊！” 旁白响起：“但苏清月知道，和苏清月争论这些没用。”")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"---")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头5（不甘开口）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 龙傲世握紧拳头，嘴唇微颤，眼神倔强：“莫欺少年……”")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"---")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"### 🎞️ 镜头6（苏清月打断+撞开）")]),n(`
`),l("span",{class:"line"},[l("span",null,"**提示词：**  ")]),n(`
`),l("span",{class:"line"},[l("span",null,"> 苏清月冷笑打断，晃动手中LV包特写：“看到我手中的包了吗？就这一个就顶你一年的工资！” 她拽行李箱狠狠撞向龙傲世胸口，龙傲世踉跄后退。苏清月头也不回：“抱歉，但我值得更好的生活，而这种生活你给不起！”")])])])],-1),l("h2",{id:"主要人物角色的设计确认",tabindex:"-1"},[n("主要人物角色的设计确认 "),l("a",{class:"header-anchor",href:"#主要人物角色的设计确认","aria-label":'Permalink to "主要人物角色的设计确认"'},"​")],-1),l("ul",null,[l("li",null,"每个要出场的人物都应有明确的设计，包括外貌、服装等"),l("li",null,"制作角色的图，可能包括三视图"),l("li",null,"每个人物的设计都必须包括完整的提示词"),l("li",null,"鼻子和嘴巴的特征要明显一些，否则后续制作数字人的过程中可能会识别有问题"),l("li",null,"人物一致性的其他技巧，待后续摸索完善")],-1),l("h2",{id:"制作每个短视频的首帧和尾帧静态图",tabindex:"-1"},[n("制作每个短视频的首帧和尾帧静态图 "),l("a",{class:"header-anchor",href:"#制作每个短视频的首帧和尾帧静态图","aria-label":'Permalink to "制作每个短视频的首帧和尾帧静态图"'},"​")],-1),l("ul",null,[l("li",null,"可以交由豆包来完成"),l("li",null,"豆包生图完全免费，可以无限次抽卡"),l("li",null,[n("确认一张图后，需要执行"),l("code",null,"变清晰"),n("，然后再下载")]),l("li",null,"需要手工去水印，可以使用 WPS 手工消除水印")],-1),l("div",{class:"language-prompt vp-adaptive-theme"},[l("button",{title:"Copy Code",class:"copy"}),l("span",{class:"lang"},"prompt"),l("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[l("code",null,[l("span",{class:"line"},[l("span",null,"根据参考图，画一张图：")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"横屏 16:9")]),n(`
`),l("span",{class:"line"},[l("span",null,"整体画风为：卡通风格，线条简洁流畅，色彩明快对比鲜明，造型拟人且有趣，简洁活泼富童趣")]),n(`
`),l("span",{class:"line"},[l("span",null,"穿黄色外卖服的年轻男子（龙傲世）的形象和参考图中外卖员的形象保持一致。")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"室内，老旧出租屋，光线昏暗。龙傲世（黄外卖服，汗湿头发）站在门口，苏清月（精致妆容，LV包，拉行李箱）站在玄关，背对镜头，准备离开。环境：墙皮剥落，桌上堆满外卖单和泡面盒。")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span")]),n(`
`),l("span",{class:"line"},[l("span",null,"男子外貌特征：有着黑色的短发，发丝略显凌乱，眼睛明亮有神，面部线条较为清爽，额头上有汗珠，整体给人一种充满活力且略带疲惫的感觉。")]),n(`
`),l("span",{class:"line"},[l("span",null,"衣着特征：身穿黄色的短袖上衣，衣服背后印有黑色的文字和图案，搭配黑色的裤子。")])])])],-1),l("h2",{id:"制作每个短视频",tabindex:"-1"},[n("制作每个短视频 "),l("a",{class:"header-anchor",href:"#制作每个短视频","aria-label":'Permalink to "制作每个短视频"'},"​")],-1),l("ul",null,[l("li",null,"首选 即梦 AI"),l("li",null,"可能要生成多次")],-1),l("div",{class:"language-prompt vp-adaptive-theme"},[l("button",{title:"Copy Code",class:"copy"}),l("span",{class:"lang"},"prompt"),l("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0"},[l("code",null,[l("span",{class:"line"},[l("span",null,"室内，老旧出租屋，光线昏暗。龙傲世（黄外卖服，汗湿头发）站在门口，苏清月（精致妆容，LV包，拉行李箱）站在玄关，背对镜头，准备离开。她抬脚欲走，但又停下脚步，侧身面对他，准备再看他一眼。")])])])],-1),l("h2",{id:"制作对白",tabindex:"-1"},[n("制作对白 "),l("a",{class:"header-anchor",href:"#制作对白","aria-label":'Permalink to "制作对白"'},"​")],-1),l("ul",null,[l("li",null,"尽量一个画面中只有一个人，不要多个人物同时出现"),l("li",null,"使用静态图片，需要面部特征清晰"),l("li",null,"音频通过在 剪映 中添加音频，导出为一个 mp3 文件，其中包含话音的起始、停顿、结束"),l("li",null,"在 即梦 中生成数字人，此时不需要提示词，生成视频")],-1),l("h2",{id:"剪辑视频",tabindex:"-1"},[n("剪辑视频 "),l("a",{class:"header-anchor",href:"#剪辑视频","aria-label":'Permalink to "剪辑视频"'},"​")],-1),l("ul",null,[l("li",null,"在剪映中处理，建议开会员"),l("li",null,"在合适的位置加入转场、音效、背景音乐"),l("li",null,"通过声音自动识别字幕")],-1)])),_:1,__:[0]})])}const f=e(o,[["render",r]]);export{A as __pageData,f as default};
