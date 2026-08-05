# 肌骨康复速查 V5.0 专业版 - Code Wiki

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 整体架构](#2-整体架构)
- [3. 文件结构](#3-文件结构)
- [4. 主要模块职责](#4-主要模块职责)
- [5. 关键数据结构](#5-关键数据结构)
- [6. 依赖关系](#6-依赖关系)
- [7. 项目运行方式](#7-项目运行方式)
- [8. 构建与部署](#8-构建与部署)
- [9. 技术特点](#9-技术特点)

---

## 1. 项目概述

### 1.1 项目简介

**肌骨康复速查 V5.0 专业版**是一个面向康复医学领域的专业工具应用，旨在为康复治疗师、物理治疗师、骨科医生等提供便捷的临床评估工具和康复方案查询服务。

### 1.2 项目定位

- **目标用户**：康复治疗师、物理治疗师、骨科医生、运动康复从业者
- **核心价值**：整合多种临床评估量表、康复方案和知识库，提供一站式临床参考
- **应用场景**：临床评估、康复计划制定、教学培训、患者教育

### 1.3 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | 原生 HTML5 + JavaScript (ES6+) |
| 样式 | 原生 CSS3 + CSS Variables |
| 数据存储 | 纯 JavaScript 对象 |
| 构建工具 | Python 脚本 |
| 部署方式 | 静态 HTML 文件（单文件版） |

---

## 2. 整体架构

### 2.1 架构设计

项目采用**单页应用（SPA）+ 模块化数据驱动**架构：

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    CSS 样式层                         │  │
│  │  (设计系统变量 + 组件样式 + 响应式布局)               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    HTML 结构层                        │  │
│  │  (页面框架 + 导航 + 内容容器 + 模态框)                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    JavaScript 逻辑层                  │  │
│  │  (页面渲染 + 交互控制 + 数据查询 + 计算引擎)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       数据模块层                            │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐        │
│  │ scales  │ │ clinical │ │rehab-   │ │  pain-   │        │
│  │         │ │  tools   │ │protocols│ │protocols │        │
│  └─────────┘ └──────────┘ └─────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │scales-  │ │scales-   │ │knowledge │ │protocols │       │
│  │extra    │ │pro       │ │  base    │ │  pro     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心设计原则

1. **零依赖**：不依赖任何第三方框架或库，纯原生实现
2. **数据驱动**：所有内容通过 JavaScript 对象定义，便于维护和扩展
3. **响应式设计**：适配移动端和桌面端
4. **离线可用**：单文件版本可离线使用
5. **模块化架构**：按功能模块组织代码，高内聚低耦合

---

## 3. 文件结构

```
jigu-v5/
├── index.html              # 主页面（开发版）
├── single-file-v5.html     # 单文件版本（构建产物）
├── data.js                 # 核心数据文件（约7MB）
├── build_single.py         # 单文件构建脚本
├── README.md               # 项目说明
├── .gitignore              # Git 忽略配置
├── src/                    # 源代码目录
│   ├── scales.js           # 基础评估量表（VAS/NRS/NDI/JOA等）
│   ├── scales-extra.js     # 额外评估量表
│   ├── scales-pro.js       # 专业版评估量表
│   ├── clinical-tools.js   # 临床工具（ROM/MMT/MAS等）
│   ├── knowledge-base.js   # 知识库（疾病-评定映射/指南）
│   ├── rehab-protocols.js  # 康复方案（PT/OT/ST）
│   ├── protocols-pro.js    # 专业版康复方案
│   └── pain-protocols.js   # 疼痛治疗方案
└── assets/                 # 资源目录
    └── illustrations/      # 插图资源
```

---

## 4. 主要模块职责

### 4.1 评估量表模块（scales）

**位置**：`src/scales.js`、`src/scales-extra.js`、`src/scales-pro.js`

**职责**：提供各类临床评估量表的数据定义和计算逻辑

**包含量表**：

| 分类 | 量表名称 | 用途 |
|------|---------|------|
| 疼痛评估 | VAS、NRS、P4 | 疼痛强度评估 |
| 颈椎评估 | NDI、JOA-C | 颈椎功能障碍评估 |
| 腰椎评估 | ODI、JOA-L、RMQ | 腰椎功能障碍评估 |
| 肩袖评估 | UCLA | 肩袖损伤评估 |

**量表数据结构**：

```javascript
{
  id: 'vas',                    // 唯一标识
  name: 'VAS 视觉模拟疼痛评分', // 全称
  shortName: 'VAS',             // 简称
  category: 'pain',             // 分类
  description: '...',           // 描述
  reliability: '...',           // 信度说明
  reference: '...',             // 参考文献
  totalScore: 10,               // 总分
  type: 'slider',               // 类型：slider/number/choice/yesno
  question: '...',              // 问题（单选）
  questions: [...],             // 问题（多选）
  labels: [...],                // 标签
  interpretation: [...],        // 评分解读
  calculate: function(answers)  // 计算函数
}
```

### 4.2 临床工具模块（clinical-tools）

**位置**：`src/clinical-tools.js`

**职责**：提供关节活动度、肌力分级、痉挛评估、步态分析等临床参考工具

**包含工具**：

| 分类 | 工具名称 | 内容 |
|------|---------|------|
| 关节测角 | 肩关节/肘关节/腕关节/髋关节/膝关节/踝关节/脊柱ROM | 正常活动范围、测量方法、肌群说明 |
| 肌力评估 | MMT、Oxford、Daniels | 0-5级肌力分级标准 |
| 痉挛评估 | MAS、Tardieu、Penn | 痉挛程度评估量表 |
| 步态分析 | 正常步态参数 | 步长/步频/步速/周期参数 |

### 4.3 知识库模块（knowledge-base）

**位置**：`src/knowledge-base.js`

**职责**：提供疾病与评定量表的映射关系及临床指南推荐

**核心数据结构**：

```javascript
// 疾病-评定映射
const diseaseScaleMap = {
  '脑卒中': {
    core: ['Fugl-Meyer上肢', 'Fugl-Meyer下肢', 'Berg平衡量表', ...],
    recommended: ['TUG起立行走', 'MMSE简易精神状态', ...],
    optional: ['MoCA认知评估', 'HAMD抑郁量表', ...]
  }
};

// 临床指南
const clinicalGuidelines = [
  {
    id: 'stroke_2024',
    title: '中国脑卒中康复指南（2024版）',
    source: '中华医学会神经病学分会',
    recommendations: [
      { text: '...', level: 'A' },  // A/B/C 证据等级
      ...
    ],
    relatedScales: [...]
  }
];
```

### 4.4 康复方案模块（rehab-protocols）

**位置**：`src/rehab-protocols.js`、`src/protocols-pro.js`

**职责**：提供分阶段的康复治疗方案

**包含方案**：

| 分类 | 方案名称 | 阶段划分 |
|------|---------|---------|
| PT | 颈椎手法治疗（CMT） | 急性期/亚急性期/慢性期 |
| PT | ACL前交叉韧带重建术后 | 5个阶段（0-2周~6个月后） |
| PT | COPD呼吸康复 | 急性加重期/稳定期/长期随访期 |
| PT | 肩袖损伤康复 | 急性期/亚急性期/功能恢复期/强化期 |
| PT | 腰椎间盘突出康复 | 急性期/缓解期/功能维持期 |
| PT | TKA全膝关节置换术后 | 4个阶段（0-2周~3-6个月） |
| OT | 脑卒中OT认知康复 | 急性期/亚急性期/慢性期 |

**方案数据结构**：

```javascript
{
  id: 'pt-acl',
  category: 'PT',
  categoryName: '物理治疗',
  name: 'ACL前交叉韧带重建术后康复方案',
  evidence: 'Massachusetts General Brigham指南',
  stages: [
    {
      name: '第一阶段：术后0-2周',
      goal: '保护移植物、消肿止痛...',
      duration: '0-2周',
      exercises: ['踝泵训练', '股四头肌静力收缩', ...],
      cautions: '禁止膝下垫毛巾卷休息...',
      criteria: '膝伸直ROM 0°...'
    }
  ]
}
```

### 4.5 疼痛治疗模块（pain-protocols）

**位置**：`src/pain-protocols.js`

**职责**：提供常见肌骨疼痛的病因、症状和分阶段治疗方案

**包含疼痛类型**：

| 部位 | 疼痛类型 |
|------|---------|
| 踝足部 | 足底筋膜炎、跟腱炎、踝关节扭伤、扁平足、高足弓、足背屈受限、足跟内外翻 |
| 膝部 | 髌骨关节痛、膝关节韧带扭伤、半月板损伤 |
| 髋部 | 非关节炎性髋关节痛 |
| 腰部 | 腰痛伴牵涉痛（骶髂关节）、腰痛伴全身痛（心理因素）、腰痛伴活动度不足 |

---

## 5. 关键数据结构

### 5.1 评估量表结构

```javascript
{
  id: string,              // 唯一标识
  name: string,            // 量表全称
  shortName: string,       // 简称
  category: string,        // 分类：pain/neck/back/upper/lower等
  description: string,     // 量表描述
  reliability: string,     // 信度说明
  reference: string,       // 参考文献
  totalScore: number,      // 总分
  type: string,            // 类型：slider/number/choice/yesno
  
  // 根据 type 不同，包含不同字段
  question: string,        // 单一问题（slider/number）
  questions: Array,        // 多个问题（choice/yesno）
  min: number,             // 最小值（number类型）
  max: number,             // 最大值（number类型）
  labels: Array,           // 标签（slider类型）
  
  interpretation: Array,   // 评分解读
  calculate: function      // 评分计算函数
}
```

### 5.2 临床工具结构

```javascript
{
  id: string,
  name: string,
  category: string,
  description: string,
  type: 'reference',       // 参考类型
  content: Object          // 详细内容
}
```

### 5.3 康复方案结构

```javascript
{
  id: string,
  category: string,        // PT/OT/ST
  categoryName: string,    // 物理治疗/作业治疗/言语治疗
  name: string,
  evidence: string,        // 循证依据
  icon: string,            // 图标标识
  stages: Array[Stage]     // 阶段数组
}

// Stage 结构
{
  name: string,            // 阶段名称
  goal: string,            // 阶段目标
  duration: string,        // 持续时间
  exercises: Array,        // 训练内容列表
  cautions: string,        // 注意事项
  criteria: string         // 阶段达标标准（可选）
}
```

### 5.4 疼痛方案结构

```javascript
{
  id: string,
  category: string,
  categoryName: string,
  name: string,
  icon: string,
  causes: Array,           // 病因列表
  symptoms: Array,        // 症状列表
  stages: Array[Stage]     // 治疗阶段
}
```

---

## 6. 依赖关系

### 6.1 文件依赖关系

```
index.html
├── data.js                    # 核心数据
├── src/scales.js              # 基础量表
├── src/scales-extra.js        # 额外量表
├── src/scales-pro.js          # 专业版量表
├── src/clinical-tools.js      # 临床工具
├── src/knowledge-base.js      # 知识库
├── src/rehab-protocols.js     # 康复方案
├── src/protocols-pro.js       # 专业版方案
└── src/pain-protocols.js      # 疼痛方案
```

### 6.2 脚本加载顺序

根据 `index.html` 中的引用顺序：

1. **data.js** - 最先加载，包含全局数据
2. **scales.js** - 基础评估量表
3. **scales-extra.js** - 额外量表（依赖 scales.js）
4. **scales-pro.js** - 专业版量表（依赖 scales.js）
5. **clinical-tools.js** - 临床工具（独立）
6. **knowledge-base.js** - 知识库（依赖 scales.js）
7. **rehab-protocols.js** - 康复方案（独立）
8. **protocols-pro.js** - 专业版方案（依赖 rehab-protocols.js）
9. **pain-protocols.js** - 疼痛方案（独立）

### 6.3 数据模块依赖

| 模块 | 依赖模块 | 说明 |
|------|---------|------|
| scales-extra.js | scales.js | 扩展基础量表 |
| scales-pro.js | scales.js | 专业版量表 |
| knowledge-base.js | scales.js | 疾病-量表映射引用量表数据 |
| protocols-pro.js | rehab-protocols.js | 专业版方案基于基础方案 |

---

## 7. 项目运行方式

### 7.1 开发模式

**环境要求**：现代浏览器（Chrome、Safari、Firefox、Edge）

**运行步骤**：

1. 克隆仓库：
   ```bash
   git clone https://github.com/xcsjzj/jigu-v5.git
   cd jigu-v5
   ```

2. 直接打开 `index.html` 文件：
   - 双击打开或通过浏览器访问本地文件路径
   - 或使用本地服务器：
     ```bash
     # Python 3
     python -m http.server 8000
     # Node.js
     npx serve
     ```

3. 在浏览器中访问：`http://localhost:8000`

### 7.2 单文件版本

**运行步骤**：

1. 直接打开 `single-file-v5.html` 文件
2. 该版本已包含所有脚本内联，无需额外加载

### 7.3 功能模块访问

项目通过底部 Tab 导航访问各功能模块：

| Tab | 模块 | 功能 |
|-----|------|------|
| 🏥 | 评估量表 | VAS/NRS/NDI/ODI等各类量表评估 |
| 📐 | 临床工具 | 关节活动度、肌力分级、痉挛评估、步态分析 |
| 📚 | 知识库 | 疾病-量表映射、临床指南推荐 |
| 📋 | 康复方案 | PT/OT/ST分阶段康复方案 |
| 🩹 | 疼痛治疗 | 常见肌骨疼痛治疗方案 |

---

## 8. 构建与部署

### 8.1 构建单文件版本

**目的**：将所有外部脚本内联到 HTML 中，生成可离线使用的单文件版本

**运行命令**：

```bash
python build_single.py
```

**构建过程**：

1. 读取 `index.html`
2. 将以下脚本文件内联到 HTML 中：
   - `data.js`
   - `scales.js`
   - `scales-extra.js`
   - `scales-pro.js`
   - `clinical-tools.js`
   - `knowledge-base.js`
   - `rehab-protocols.js`
   - `protocols-pro.js`
   - `pain-protocols.js`
3. 修改标题为"肌骨康复速查 V5.0 专业版（单文件）"
4. 输出到 `single-file-v5.html`

### 8.2 部署方式

**方式一：静态文件部署**

```bash
# 将 single-file-v5.html 部署到任意静态服务器
# 如：GitHub Pages、Vercel、Netlify、阿里云OSS等
```

**方式二：本地使用**

```bash
# 直接双击打开 single-file-v5.html
# 无需网络连接，可离线使用
```

### 8.3 构建注意事项

1. 构建前确保所有 `src/` 目录下的文件存在
2. 构建后生成的文件较大（约8MB），包含所有数据
3. 建议使用单文件版本进行部署，减少网络请求

---

## 9. 技术特点

### 9.1 零依赖设计

- 不依赖任何第三方框架（React/Vue/Angular）
- 不依赖任何第三方库（jQuery/Lodash）
- 纯原生 HTML/CSS/JavaScript 实现
- 降低部署复杂度，提高兼容性

### 9.2 设计系统

项目采用现代化设计系统，通过 CSS Variables 定义设计令牌：

```css
:root {
  /* 颜色系统 */
  --bg-brand: #4B3FE3;          /* 主色：靛紫 */
  --bg-brand-hover: #6A6FFF;    /* 悬停色 */
  
  /* 字体系统 */
  --font-family-default: "SF Pro Text", "PingFang SC", system-ui;
  --font-size-base: 14px;
  
  /* 间距系统 */
  --spacer-0: 0px;
  --spacer-4: 4px;
  --spacer-8: 8px;
  /* ... */
  
  /* 圆角系统 */
  --radius-4: 4px;
  --radius-8: 8px;
  --radius-full: 999px;
}
```

### 9.3 响应式设计

- 使用 `viewport-fit=cover` 适配移动设备
- 使用 CSS Grid/Flexbox 实现弹性布局
- 安全区域适配（`safe-area-inset-top/bottom`）
- 触摸友好的交互设计（44px 最小点击区域）

### 9.4 数据驱动架构

- 所有内容通过 JavaScript 对象定义
- 支持动态渲染和扩展
- 便于数据维护和更新
- 支持多语言扩展（理论上）

### 9.5 离线可用性

- 单文件版本包含所有资源
- 无需后端服务器
- 可在无网络环境下使用
- 适合临床现场使用

---

## 附录：核心数据文件大小

| 文件 | 大小 | 说明 |
|------|------|------|
| data.js | ~7.3MB | 核心数据（最大文件） |
| single-file-v5.html | ~8.0MB | 单文件版本 |
| index.html | ~280KB | 主页面（含CSS） |
| src/scales-extra.js | ~137KB | 额外量表 |
| src/scales.js | ~77KB | 基础量表 |
| src/clinical-tools.js | ~42KB | 临床工具 |
| src/rehab-protocols.js | ~30KB | 康复方案 |
| src/pain-protocols.js | ~30KB | 疼痛方案 |
| src/scales-pro.js | ~38KB | 专业版量表 |
| src/knowledge-base.js | ~27KB | 知识库 |
| src/protocols-pro.js | ~11KB | 专业版方案 |

---

**文档生成日期**：2026-07-20  
**项目版本**：V5.0 专业版  
**仓库地址**：[https://github.com/xcsjzj/jigu-v5](https://github.com/xcsjzj/jigu-v5)