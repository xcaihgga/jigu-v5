# 肌骨康复速查 V5.0 — SDK 集成文档

> 面向第三方 AI / 应用嵌入使用。本文档描述项目架构、数据结构、对外接口与三种集成方案。
> 公网演示：https://xcaihgga.github.io/jigu-v5/
> 仓库：https://github.com/xcaihgga/jigu-v5

---

## 一、项目概览

| 维度 | 说明 |
|---|---|
| 类型 | 纯前端单页应用（SPA），无后端依赖 |
| 技术栈 | 原生 JavaScript（ES5/ES6 混用）+ HTML + CSS，零构建工具 |
| 运行环境 | 任意现代浏览器（Chrome 80+ / Safari 14+ / Firefox 80+ / Edge 80+） |
| 数据规模 | 肌骨康复领域：88 个评估量表、58 块肌肉、83 种疾病、36 套康复方案、25 个临床工具、20 条临床指南 |
| 部署形态 | 静态文件，可直接放 CDN / GitHub Pages / Nginx / IIS / Electron 容器 |

### 核心能力

1. **肌肉查询** — 按身体区域浏览，详情含解剖、症状、治疗、康复训练、循证等级
2. **疾病查询** — 按部位浏览，含 ICD-10 编码、鉴别诊断、康复方案、共病适配
3. **量表评估** — 88 个临床量表（VAS / Berg / ODI / JOA / Barthel 等），支持滑块/选择/是否题，自动评分与解读
4. **临床工具** — 25 个查体/计算工具（关节活动度、肌力分级、深反射等）
5. **临床指南** — 20 条权威指南，按证据等级排列推荐意见
6. **康复方案** — 36 套分阶段方案，含阶段概览表格、训练动作、进阶标准
7. **数据看板** — 评定统计、近 6 月趋势、分类分布、Top10 量表、平均分
8. **历史记录** — 基于 localStorage 的本地持久化，支持趋势图、导出文本/图片

---

## 二、架构分层

```
┌─────────────────────────────────────────────────────────┐
│                    index.html (主壳)                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │  UI 容器 + 内联业务逻辑（页面骨架/初始化/事件）  │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────┬─────────────────────────────────────────┘
                │ <script src>
┌───────────────┴─────────────────────────────────────────┐
│  核心模块层（src/*.js，按依赖顺序加载）                  │
│                                                         │
│  app-config.js      环境检测 / 角色权限 / 路由守卫       │
│  logger.js          结构化日志（级别: debug/info/warn/error）│
│  utils.js           escapeHtml / safeGetJSON / icon / 日期  │
│  router.js          Tab 切换 / 二级页面跳转 / 历史回退    │
│  realtime-bar.js    实时操作信息栏（时钟/最近操作/统计）  │
│  muscle-disease.js  肌肉+疾病 查询模块（网格/列表/详情）  │
│  scales-ui.js       量表评估全流程（88 量表）             │
│  protocols-tools-guidelines.js  工具+指南+康复方案        │
│  dashboard.js       数据看板（统计/趋势图/分布）          │
└───────────────┬─────────────────────────────────────────┘
                │ 异步加载
┌───────────────┴─────────────────────────────────────────┐
│  数据层（data-loader.js 协调）                           │
│                                                         │
│  ┌─ 核心小文件（首屏即用，并行加载）─────────────────┐ │
│  │  scales.js          31 个核心量表（window.assessmentScales）│
│  │  scales-extra.js    57 个扩展量表（window.scalesExtra）    │
│  │  scales-pro.js      PRO 量表（window.scalesPro）           │
│  │  clinical-tools.js  25 个临床工具（window.clinicalTools）  │
│  │  knowledge-base.js  指南 + 疾病量表映射                     │
│  │  rehab-protocols.js 36 套康复方案（window.rehabProtocols） │
│  │  protocols-pro.js   PRO 方案                               │
│  │  pain-protocols.js  疼痛方案                               │
│  └────────────────────────────────────────────────┘ │
│  ┌─ 大文件（后台加载，不阻塞首屏）──────────────────┐ │
│  │  data.js (7.4MB)   肌肉/疾病/解剖/循证数据                 │
│  │    const muscles / diseases / muscleBodyParts ...          │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 加载顺序（关键）

```
1. app-config.js    → 环境与权限（同步）
2. logger.js        → 日志器（同步）
3. utils.js         → 工具函数（同步）
4. data-loader.js   → 数据加载器（自动启动）
5. realtime-bar.js  → 实时栏（同步）
6. router.js        → 路由（同步）
7. muscle-disease.js → 肌肉/疾病模块（同步）
8. scales-ui.js     → 量表评估模块（同步）
9. protocols-tools-guidelines.js → 工具/指南/方案模块（同步）
10. dashboard.js    → 看板模块（同步）
   ↓
   内联 init() → 监听 data-loader-complete 事件 → 渲染首屏
   data-loader-background-ready 事件 → 渲染肌肉/疾病网格
```

---

## 三、数据结构定义

### 3.1 评估量表（assessmentScales / scalesExtra / scalesPro）

```javascript
{
  id: 'vas',                          // 唯一标识（英文+连字符）
  name: 'VAS 视觉模拟疼痛评分',        // 完整名称
  shortName: 'VAS',                   // 简称
  category: 'pain',                   // 分类（见 3.2）
  description: '最常用的疼痛评估工具',  // 简介
  reliability: '信度高',               // 信度描述
  reference: '中华医学会疼痛学分会',    // 来源
  totalScore: 10,                     // 满分
  evidence: {                         // 循证信息（可选）
    mcid: 2,                          // 最小临床重要差异
    testRetest: 'ICC = 0.94-0.97',    // 重测信度
    source: 'IASP 推荐',
    year: 1980
  },
  type: 'slider' | 'choice' | 'yesno' | 'psfs',  // 题型
  // ── slider 型 ──
  question: '请标记您当前的疼痛程度',
  labels: ['无痛', '最剧烈疼痛'],       // 两端标签
  // ── choice 型 ──
  questions: [
    {
      text: '1. 上肢运动功能',
      options: ['0分 - 不能用筷子', '1分 - ...', ...],
      scores: [0, 1, 2, 3, 4]          // 每个选项对应分值
    }
  ],
  // ── psfs 型（患者特定功能量表）──
  psfsQuestions: ['问题1', '问题2', '问题3'],
  // ── 结果解读 ──
  interpretation: [
    { min: 0, max: 0,   level: '无痛',     color: 'success', desc: '无疼痛感觉' },
    { min: 1, max: 3,   level: '轻度疼痛', color: 'success', desc: '...' },
    { min: 4, max: 6,   level: '中度疼痛', color: 'warning', desc: '...' },
    { min: 7, max: 10,  level: '重度疼痛', color: 'danger',  desc: '...' }
  ],
  // ── 评分函数（可选，默认累加）──
  calculate: function(answers) {
    // answers: 数组，元素为每题得分
    return { score: answers[0] || 0, maxScore: 10 };
  }
}
```

### 3.2 量表分类（scaleCategoryInfo）

```javascript
{
  pain:     { name: '疼痛评估',     icon: 'pain' },
  neck:     { name: '颈肩评估',     icon: 'neck' },
  back:     { name: '腰背评估',     icon: 'back' },
  upper:    { name: '上肢评估',     icon: 'arm' },
  wrist:    { name: '腕手评估',     icon: 'hand' },
  lower:    { name: '下肢评估',     icon: 'leg' },
  ankle:    { name: '踝足评估',     icon: 'foot' },
  function: { name: '功能与生活能力', icon: 'function' },
  balance:  { name: '平衡与步行',   icon: 'balance' },
  quality:  { name: '生活质量',     icon: 'quality' },
  muscle:   { name: '肌肉与关节功能', icon: 'muscle' },
  mental:   { name: '心理状态',     icon: 'mental' }
}
```

### 3.3 肌肉数据（muscles，data.js）

```javascript
{
  "序号": '1',
  "身体区域": '头颈部',           // 用于区域分组
  "肌肉名称": '胸锁乳突肌',
  "主要功能": '头颈屈曲、旋转',
  "常见损伤": '斜颈、肌肉痉挛',
  "评估方法": '触诊、活动度',
  "诊断标准": '局部压痛、活动受限',
  "急性期处理": '休息、冰敷、NSAIDs',
  "康复训练": '拉伸、力量训练',
  "激痛点": '胸骨和锁骨附着点',
  "治疗禁忌": '颈椎骨折、肿瘤',
  "红旗征": '进行性神经症状、发热',
  "重返标准": '无痛全范围活动',
  "循证等级": 'B级',
  "关联骨科疾病": '斜颈',
  "疾病分类": '颈部畸形类',
  "疾病分级": 'C级（基础）',
  "典型症状与体征": '...',        // 详细描述
  "影像学特征": '...',
  "鉴别诊断": '...',
  "常用评估量表": '...',
  "分期/严重度分级": '...',
  "治疗方案": '...',
  "手术指征": '...',
  "药物治疗": '...',
  "注射治疗": '...',
  "治疗禁忌": '...',
  "辅助康复": '...',
  "康复训练方案": '...',
  "康复禁忌动作": '...',
  "预后转归": '...',
  "常见并发症": '...',
  "生活方式调整": '...',
  "预防措施": '...',
  "心理与行为干预": '...',
  "辅助器具推荐": '...',
  "重返运动/工作评估": '...',
  "共病适配方案": '...',
  "运动风险与代偿评估": '...',
  "特殊人群适配": '...',
  "再生医学与新技术": '...',
  "证据等级(GRADE)": '...',
  "最新循证进展": '...',
  "患者教育与避坑指南": '...',
  "ICD-10编码": '...'
}
```

### 3.4 疾病数据（diseases，data.js）

结构与 muscles 类似，关键字段：`具体病症` / `部位` / `疾病分类` / `疾病分级` / `ICD-10编码` / `典型症状与体征` / `治疗方案` / `康复训练方案` 等。

### 3.5 康复方案（rehabProtocols）

```javascript
{
  id: 'shoulder-impingement',
  name: '肩峰下撞击综合征康复方案',
  category: 'shoulder',
  categoryName: '肩关节',
  icon: 'shoulder',
  description: '分阶段康复方案...',
  evidence: '循证来源',
  isPain: false,                      // 是否疼痛专项方案
  isPro: false,                       // 是否 PRO 内容
  stages: [
    {
      name: '急性期（0-2周）',
      goal: '控制疼痛和炎症',
      duration: '每日 2-3 次',
      exercises: ['钟摆运动：每方向 10 次', '肩胛骨稳定：10×3 组'],
      cautions: '避免过头上举、提重物',
      criteria: '疼痛 VAS ≤ 3 可进阶'
    },
    // ... 更多阶段
  ]
}
```

### 3.6 临床工具（clinicalTools）

```javascript
{
  id: 'rom-shoulder',
  name: '肩关节活动度测量',
  category: '关节活动度',
  description: '...',
  type: 'rom' | 'calculator' | 'grading' | 'reference',
  content: {
    movements: [
      { name: '前屈', normal: '180°', functional: '120°', notes: '...' }
    ],
    // 或 sections / grades / items / parameters / steps / types
  }
}
```

### 3.7 临床指南（clinicalGuidelines）

```javascript
{
  id: 'cervical-rad',
  title: '颈椎神经根病诊疗指南',
  source: 'NASS',
  year: 2020,
  category: '颈椎',
  recommendations: [
    { level: 'A', text: '推荐意见...' },
    { level: 'B', text: '...' }
  ],
  relatedScales: ['NDI', 'VAS', 'JOA-C']
}
```

### 3.8 评估历史记录（localStorage.assessmentHistory）

```javascript
[
  {
    id: 'rec-1709xxxx',
    date: '2026-08-06T08:30:00.000Z',
    scaleId: 'vas',
    scaleName: 'VAS 视觉模拟疼痛评分',
    category: 'pain',
    answers: [7],                     // 每题得分
    score: 7,
    maxScore: 10,
    level: '重度疼痛',
    duration: 45,                     // 用时（秒）
    patientId: null                   // 可选患者关联
  }
]
```

---

## 四、对外接口（全局函数）

### 4.1 量表评估 API

| 函数 | 说明 | 参数 |
|---|---|---|
| `renderScaleLibrary()` | 渲染量表库到 `#scaleListContainer` | 无 |
| `startScale(scaleId)` | 启动量表评估 | `scaleId: string` |
| `submitScale()` | 提交当前量表，计算得分 | 无 |
| `showScaleResult(result)` | 显示评估结果 | `result: {score, maxScore, level, desc}` |
| `saveAssessment()` | 保存记录到 localStorage | 无 |
| `renderScaleHistory()` | 渲染历史记录 | 无 |
| `filterScales(scales, category, keyword)` | **纯函数**：筛选量表 | `scales: Array, category: string, keyword: string` → `Array` |

`filterScales` 是无副作用的纯函数，适合其他 AI 直接调用做数据筛选。

### 4.2 肌肉/疾病查询 API

| 函数 | 说明 |
|---|---|
| `renderMuscleBodyGrid()` | 渲染身体区域网格到 `#muscleBodyGrid` |
| `showMuscleList(regionId, regionName)` | 显示某区域肌肉列表 |
| `showMuscleDetail(index)` | 显示肌肉详情（index 为 muscles 数组索引） |
| `renderDiseaseBodyGrid()` | 渲染疾病部位网格 |
| `showDiseaseDetail(index)` | 显示疾病详情 |
| `findRelatedDiseases(muscleName, relatedText)` | 查找相关疾病（纯函数） |
| `findRelatedMuscles(diseaseName)` | 查找相关肌肉（纯函数） |

### 4.3 工具函数（utils.js）

| 函数 | 说明 | 签名 |
|---|---|---|
| `escapeHtml(val)` | HTML 转义，防 XSS | `(val: any) → string` |
| `safeGetJSON(key, fallback)` | 安全读 localStorage | `(key: string, fallback?: any) → any` |
| `formatContent(text)` | 格式化多行文本为 HTML | `(text: string) → string` |
| `getInterpretation(score, maxScore, interpretations)` | 根据得分返回解读 | `(score, maxScore, interp: Array) → {level, color, desc}` |
| `formatDate(date)` | 格式化为 `YYYY-MM-DD HH:mm` | `(date: Date\|string) → string` |
| `formatDateShort(date)` | 格式化为 `MM/DD` | `(date: Date\|string) → string` |
| `icon(name, size)` | 返回 SVG 图标 HTML | `(name: string, size?: number) → string` |

### 4.4 数据加载器（DataLoader）

```javascript
window.DataLoader = {
  load: Function,        // 手动触发加载（通常自动执行）
  getProgress: Function  // → { loaded, total, errors }
};

// 事件（CustomEvent）
window.addEventListener('data-loader-complete', function(e) {
  // e.detail = { success, failedFiles, backgroundPending }
  // 核心数据已就绪，量表/工具/方案可用
});

window.addEventListener('data-loader-background-ready', function(e) {
  // e.detail = { file }
  // 大文件（data.js）就绪，肌肉/疾病查询可用
});
```

### 4.5 路由 API（router.js）

| 函数 | 说明 |
|---|---|
| `switchTab(tabName)` | 切换主 Tab：`muscle` / `disease` / `assessment` / `tools` / `guidelines` / `protocols` / `dashboard` / `cases` |
| `showPage(pageId, keepHistory)` | 进入二级详情页 |
| `goBack()` | 返回上一页 |
| `updateNavTitle(title)` | 更新顶部导航标题 |

### 4.6 日志 API（logger.js）

```javascript
window.interactionLog = {
  level: 'debug',
  setLevel: Function,   // 'debug' | 'info' | 'warn' | 'error'
  debug: Function,
  info:  Function,
  warn:  Function,
  error: Function
};

// URL 参数控制级别：?log=warn
```

---

## 五、集成方案

### 方案 A：iframe 嵌入（最简单，5 分钟）

适用：只需在页面中显示完整应用，无需深度交互。

```html
<iframe
  src="https://xcaihgga.github.io/jigu-v5/"
  width="100%"
  height="800"
  frameborder="0"
  allowfullscreen
  style="border: none; border-radius: 12px;"
></iframe>
```

**跨域通信**（可选）：应用支持 URL 参数 `?log=debug`，可通过 postMessage 与父页面通信。

### 方案 B：模块引入（推荐，可深度集成）

适用：需要在你的应用中调用评估 API、查询数据、自定义 UI。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>我的医疗应用</title>
  <!-- 1. 引入核心模块（按顺序）-->
  <script src="https://xcaihgga.github.io/jigu-v5/src/app-config.js"></script>
  <script src="https://xcaihgga.github.io/jigu-v5/src/logger.js"></script>
  <script src="https://xcaihgga.github.io/jigu-v5/src/utils.js"></script>
  <script src="https://xcaihgga.github.io/jigu-v5/src/data-loader.js"></script>
  <script src="https://xcaihgga.github.io/jigu-v5/src/scales-ui.js"></script>
</head>
<body>
  <div id="my-scale-container"></div>

  <script>
    // 2. 等待数据加载完成
    window.addEventListener('data-loader-complete', function() {
      // 3. 调用 API
      // 例：筛选所有疼痛类量表
      var painScales = filterScales(assessmentScales, 'pain', '');
      console.log('疼痛量表:', painScales.length, '个');

      // 例：启动某个量表评估
      // startScale('vas');  // 需配套 UI 容器
    });
  </script>
</body>
</html>
```

**注意**：`data-loader.js` 会自动异步加载所有数据文件。若你只需要量表数据，可只引入 `scales.js`（同步 `<script>` 标签），不引入 `data-loader.js`：

```html
<script src="https://xcaihgga.github.io/jigu-v5/src/scales.js"></script>
<script>
  // scales.js 加载后立即可用
  console.log('量表总数:', assessmentScales.length);  // 31 个核心量表
  var vas = assessmentScales.find(s => s.id === 'vas');
</script>
```

### 方案 C：纯数据 API（最灵活，仅取数据）

适用：你已有自己的 UI，只需要康复领域的数据和评分逻辑。

```javascript
// 只引入数据文件，不要 UI 模块
// <script src="https://xcaihgga.github.io/jigu-v5/src/scales.js"></script>
// <script src="https://xcaihgga.github.io/jigu-v5/src/scales-extra.js"></script>
// <script src="https://xcaihgga.github.io/jigu-v5/src/clinical-tools.js"></script>
// <script src="https://xcaihgga.github.io/jigu-v5/src/rehab-protocols.js"></script>

// ── 1. 获取所有量表 ──
var allScales = assessmentScales.concat(scalesExtra || []);
console.log('量表总数:', allScales.length);  // 88 个

// ── 2. 按分类筛选 ──
var painScales = allScales.filter(s => s.category === 'pain');

// ── 3. 搜索量表 ──
var results = allScales.filter(s =>
  s.name.includes('berg') || s.shortName.toLowerCase().includes('berg')
);

// ── 4. 获取量表详情 ──
var berg = allScales.find(s => s.id === 'berg-balance');
console.log('题目数:', berg.questions.length);
console.log('满分:', berg.totalScore);

// ── 5. 计算得分（模拟用户作答）──
var userAnswers = [4, 3, 2, 2, 2, 3];  // 每题得分
var result = berg.calculate
  ? berg.calculate(userAnswers)
  : { score: userAnswers.reduce((a, b) => a + b, 0), maxScore: berg.totalScore };
console.log('得分:', result.score + '/' + result.maxScore);

// ── 6. 获取结果解读 ──
var interp = getInterpretation(result.score, result.maxScore, berg.interpretation);
console.log('等级:', interp.level, '|', interp.desc);

// ── 7. 获取康复方案 ──
var shoulderProtocol = rehabProtocols.find(p => p.id === 'shoulder-impingement');
console.log('阶段数:', shoulderProtocol.stages.length);
shoulderProtocol.stages.forEach((stage, i) => {
  console.log(`阶段${i+1}: ${stage.name} - ${stage.goal}`);
});

// ── 8. 获取临床工具 ──
var romTool = clinicalTools.find(t => t.id === 'rom-shoulder');
console.log('肩关节活动度:', romTool.content.movements);

// ── 9. 获取肌肉/疾病数据（需引入 data.js，7.4MB）──
// <script src="https://xcaihgga.github.io/jigu-v5/data.js"></script>
// console.log('肌肉数:', muscles.length);     // 58 块
// console.log('疾病数:', diseases.length);     // 83 种
```

---

## 六、集成注意事项

### 6.1 全局变量清单

以下变量在对应脚本加载后挂载到 `window`：

| 变量名 | 来源文件 | 类型 | 说明 |
|---|---|---|---|
| `assessmentScales` | scales.js | Array | 31 个核心量表 |
| `scalesExtra` | scales-extra.js | Array | 57 个扩展量表 |
| `scalesPro` | scales-pro.js | Array | PRO 量表 |
| `scaleCategoryInfo` | scales.js | Object | 分类信息 |
| `clinicalTools` | clinical-tools.js | Array | 25 个临床工具 |
| `clinicalGuidelines` | knowledge-base.js | Array | 20 条指南 |
| `rehabProtocols` | rehab-protocols.js | Array | 36 套方案 |
| `protocolCategories` | rehab-protocols.js | Array | 方案分类 |
| `painProtocols` | pain-protocols.js | Array | 疼痛方案 |
| `protocolsPro` | protocols-pro.js | Array | PRO 方案 |
| `muscles` | data.js | Array | 58 块肌肉 |
| `diseases` | data.js | Array | 83 种疾病 |
| `muscleBodyParts` | data.js | Array | 身体区域定义 |
| `diseaseBodyParts` | data.js | Array | 疾病部位定义 |

> **注意**：`data.js` 使用 `const` 声明变量（未挂载到 window），需在同一作用域或通过 `<script>` 标签引入后词法访问。其他数据文件使用 `window.xxx =` 挂载。

### 6.2 浏览器兼容性

- ES5 兼容写法（部分模块用 IIFE + var）
- 使用 `Array.prototype.forEach` / `querySelectorAll` / `localStorage` / `canvas`
- 不依赖 Promise（data-loader.js 用了，但可 polyfill）
- 不支持 IE

### 6.3 数据版本控制

所有数据文件通过 `?v=4.0` 等版本号缓存。集成时建议固定版本或自行 fork 数据文件。

### 6.4 本地存储 Schema

应用使用以下 localStorage 键：

| 键 | 内容 | 格式 |
|---|---|---|
| `assessmentHistory` | 评估历史记录 | JSON Array |
| `patients` | 患者列表 | JSON Array |
| `interactionLogLevel` | 日志级别 | string |
| `currentUserRole` | 用户角色 | string |

集成时如需隔离命名空间，可修改 `safeGetJSON` 调用处加前缀。

### 6.5 XSS 防护

所有用户输入和动态渲染内容均经过 `escapeHtml()` 转义。集成你的 UI 时，渲染数据前请调用此函数。

---

## 七、文件清单与体积

| 文件 | 行数 | 大小 | 说明 |
|---|---|---|---|
| `index.html` | 4806 | 195 KB | 主应用（含 UI 容器和业务逻辑） |
| `data.js` | 87852 | 7.2 MB | 肌肉/疾病/解剖数据（大文件） |
| `src/scales.js` | 1111 | 77 KB | 31 个核心量表 |
| `src/scales-extra.js` | 1841 | 132 KB | 57 个扩展量表 |
| `src/scales-pro.js` | 906 | 37 KB | PRO 量表 |
| `src/scales-ui.js` | 1236 | 45 KB | 量表评估 UI 模块 |
| `src/muscle-disease.js` | 854 | 39 KB | 肌肉/疾病查询模块 |
| `src/protocols-tools-guidelines.js` | 649 | 30 KB | 工具/指南/方案模块 |
| `src/clinical-tools.js` | 746 | 42 KB | 临床工具数据 |
| `src/rehab-protocols.js` | 581 | 31 KB | 康复方案数据 |
| `src/pain-protocols.js` | 774 | 34 KB | 疼痛方案数据 |
| `src/knowledge-base.js` | 449 | 27 KB | 指南数据 |
| `src/utils.js` | 308 | 29 KB | 工具函数 |
| `src/dashboard.js` | 296 | 13 KB | 看板模块 |
| `src/router.js` | 224 | 10 KB | 路由模块 |
| `src/app-config.js` | 234 | 9 KB | 环境与权限 |
| `src/realtime-bar.js` | 175 | 7 KB | 实时操作栏 |
| `src/data-loader.js` | 236 | 7 KB | 数据加载器 |
| `src/logger.js` | 48 | 2 KB | 日志器 |
| `assets/illustrations/` | - | 62 张 | 解剖插图（webp） |
| **合计** | **~100,000** | **~7.8 MB** | |

### 首屏加载优化

- 核心页面：195 KB（不含数据）
- 核心数据文件：~380 KB（量表+工具+方案，并行加载）
- 大文件 data.js：7.2 MB（后台加载，不阻塞首屏交互）

---

## 八、测试与验证

### 单元测试

```bash
node src/core-logic.test.js
# 105 项测试，覆盖：escapeHtml / safeGetJSON / normName / filterScales /
# convertExtraScale / getInterpretation / formatDate / initAllScales 去重逻辑
```

### 浏览器验证清单

| 功能 | 验证点 |
|---|---|
| 量表搜索 | 输入 "berg" 返回 3 条 |
| 分类筛选 | 选择 "balance" 返回 11 条 |
| 评估流程 | 启动 VAS → 滑动 7 分 → 提交 → 显示"重度疼痛" → 保存 |
| 肌肉查询 | 网格 8 区域 → 列表 → 详情 7 个分区 |
| 疾病查询 | 网格 10 部位 → 搜索 → 详情 |
| 康复方案 | 36 套 → 详情 → 阶段表格点击高亮+滚动联动 |
| 数据看板 | 4 统计卡片 + 趋势图 + 分布 + Top10 |

---

## 九、License 与归属

- 数据来源：临床公开资料整理，仅供参考，不作为诊断依据
- 代码：可自由使用、修改、分发
- 集成时建议标注：「数据来源：肌骨康复速查 V5.0」

---

## 十、联系方式

- 仓库 Issue：https://github.com/xcaihgga/jigu-v5/issues
- 公网演示：https://xcaihgga.github.io/jigu-v5/
