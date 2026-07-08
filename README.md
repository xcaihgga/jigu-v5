# 康衡 Rehabalance · 康复评估与训练在线平台

> 覆盖肌骨、神经、心肺、儿童四大亚专科的康复评估与训练管理平台

## 核心功能

- **分级评估体系** — 78个评估量表，7大分类，支持交互式评估
- **互动式康复计划** — 训练动作库、循证方案库、自动排程、计划编辑
- **训练进度追踪** — 打卡、14天趋势、完成率统计
- **个性化临床路径** — 基于评估/诊断的智能路径推荐
- **进修中心** — 543+ 道康复知识题库，含多选/案例分析
- **智能粘贴识别** — 一键解析患者档案/评估/病例文字
- **多格式导出** — PDF/Word/Excel/思维导图

## 技术栈

- React 18 + TypeScript + Vite 5
- React Router 6 + Zustand
- TailwindCSS 3 + CSS 变量
- lucide-react 图标库
- localStorage 持久化

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
| /plan/hub | 治疗计划汇总 |
| /progress | 进度追踪 |
| /pathway | 临床路径 |
| /patients | 患者档案 |
| /quiz | 进修中心 |
| /docs | 使用文档 |
| /profile | 个人中心 |
