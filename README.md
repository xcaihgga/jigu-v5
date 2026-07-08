# 康衡 Rehabalance · 康复评估与训练在线平台

> 覆盖肌骨、神经、心肺、儿童四大亚专科的康复评估与训练管理平台
> 深挖《肌骨康复数据库》《神经系统康复数据库》《21种疼痛治疗方案》《MET肌肉能量技术》全部数据，深度融入平台

## 核心功能

- **分级评估体系** — 78+ 评估量表，7大分类，支持交互式评估
- **互动式康复计划** — 训练动作库、循证方案库、自动排程、计划编辑
- **训练计划汇总（/plan/hub）** — 独立可编辑页面，按状态/患者/排序筛选
- **21 种肌骨疼痛治疗方案（/pain）** — 病因/临床/评估/治疗/预防 5 大维度
- **神经康复扩展数据（/neuro-extras）** — SOAP 框架 + SCI 平面 + 痉挛管理 + Brunnstrom 分期
- **训练进度追踪** — 打卡、14天趋势、完成率统计
- **个性化临床路径** — 基于评估/诊断的智能路径推荐
- **进修中心** — 800+ 道康复知识题库（解剖/量表/疾病/红旗/循证/路径/案例/神经/心肺/儿童/物理治疗/运动/急性期/重返/干针/**21种疼痛**/**MET技术**）
- **智能粘贴识别** — 一键解析患者档案/评估/病例文字
- **多格式导出** — PDF/Word/Excel/思维导图

## 技术栈

- React 18 + TypeScript + Vite 5
- React Router 6 + Zustand
- TailwindCSS 3 + CSS 变量
- lucide-react 图标库
- localStorage 持久化
- 导出：jspdf + html2canvas + docx + xlsx + file-saver
- Markdown 渲染：react-markdown

## 启动

```bash
pnpm install
pnpm dev
```

构建生产版本：

```bash
pnpm build
```

## 演示账号

- 治疗师：therapist@rh.com / 123456
- 或点击"以访客身份浏览"

## 模块

| 路径 | 模块 |
|---|---|
| / | 工作台 |
| /assess | 评估中心 |
| /plan | 康复计划 |
| /plan/hub | 治疗计划汇总（独立可编辑） |
| /progress | 进度追踪 |
| /pathway | 临床路径 |
| /pain | 21 种肌骨疼痛治疗方案 |
| /neuro-extras | 神经康复扩展数据（SOAP/SCI/痉挛/Brunnstrom） |
| /patients | 患者档案 |
| /quiz | 进修中心（800+ 题） |
| /docs | 使用文档 |
| /profile | 个人中心 |

## 数据源

- 《肌骨康复数据库.xlsx》9 个 sheet（疾病/肌肉/区域/循证/干针/RTS 等）
- 《肌骨康复数据.xlsx》24 个 sheet（疾病/量表/方案/临床工具等）
- 《神经系统康复数据库_2.1.xlsx》19 个 sheet（疾病/量表/SCI/痉挛/Brunnstrom/SOAP/PD 等）
- 《评估量表汇总.docx》78 个量表
- 《21种疼痛治疗方案.xlsx》21 种常见肌骨疼痛
- 《MET千题题库_做题看板》MET 肌肉能量技术（70+ 题）
