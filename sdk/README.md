# 肌骨康复速查 V5.0 — SDK 集成包

> 给其他 AI / 开发者嵌入其他程序软件使用

## 文件清单

| 文件 | 说明 |
|---|---|
| `INTEGRATION_GUIDE.md` | **主文档** — 架构、数据结构、API、三种集成方案 |
| `example-a-iframe.html` | 示例 A：iframe 嵌入（最简单，一行代码） |
| `example-b-module-api.html` | 示例 B：模块引入，调用 API（自定义 UI） |
| `example-c-data-api.html` | 示例 C：纯数据 API（完全自定义 UI） |
| `example-d-node-data-api.js` | 示例 D：Node.js 后端访问数据（可导出 JSON） |

## 快速开始

### 场景 1：只想在网页里显示完整应用
→ 看 `example-a-iframe.html`，一行 iframe 搞定

### 场景 2：想用自己的 UI，调用评分逻辑
→ 看 `example-b-module-api.html`，引入模块后调用 `filterScales` / `getInterpretation`

### 场景 3：只想拿数据，UI 完全自己写
→ 看 `example-c-data-api.html`，只引入数据文件

### 场景 4：后端 / AI 训练需要数据
→ 运行 `node sdk/example-d-node-data-api.js`，会导出 `exported-data.json`

## 核心数据速览

- 量表：88 个（VAS / Berg / ODI / JOA / Barthel 等）
- 肌肉：58 块（含解剖、症状、治疗、康复训练）
- 疾病：83 种（含 ICD-10、鉴别诊断、康复方案）
- 康复方案：36 套（分阶段，含训练动作和进阶标准）
- 临床工具：25 个（关节活动度、肌力分级等）
- 临床指南：20 条（按证据等级排列）

## 公网资源

- 演示：https://xcaihgga.github.io/jigu-v5/
- 仓库：https://github.com/xcaihgga/jigu-v5

所有 `src/*.js` 和 `data.js` 均可通过 CDN 直接引用：
```
https://xcaihgga.github.io/jigu-v5/src/scales.js
https://xcaihgga.github.io/jigu-v5/src/scales-extra.js
...
```

## 注意事项

1. 数据仅供临床参考，不作为诊断依据
2. `data.js`（7.2MB）较大，建议只在需要肌肉/疾病数据时引入
3. 集成时建议标注「数据来源：肌骨康复速查 V5.0」
