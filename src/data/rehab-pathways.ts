export interface RehabStage {
  stage: string;
  time: string;
  coreMeasures: string;
  goal: string;
  keyJudgment: string;
}

export const REHAB_STAGES: RehabStage[] = [
  {
    stage: "1. 急性期",
    time: "0-72 小时",
    coreMeasures: "PEACE & LOVE:保护、抬高、避免抗炎、加压",
    goal: "控制症状,避免加重",
    keyJudgment: "红旗征 → 立即转诊",
  },
  {
    stage: "2. 负荷渐进",
    time: "2-7 天",
    coreMeasures: "适度负荷 + 早期活动 + 血管化运动",
    goal: "恢复胶原重塑与循环",
    keyJudgment: "疼痛 VAS≤4 进展下一阶段",
  },
  {
    stage: "3. 主动康复",
    time: "1-6 周",
    coreMeasures: "拉伸 + 力量训练 + 本体感觉 + 神经肌肉控制",
    goal: "恢复关节活动度与基础肌力",
    keyJudgment: "双侧肌力差异<20%",
  },
  {
    stage: "4. 专项训练",
    time: "4-12 周",
    coreMeasures: "速度 / 敏捷 / 心理 / 模拟比赛",
    goal: "恢复运动特异性功能",
    keyJudgment: "客观测试达到阈值",
  },
  {
    stage: "5. 重返运动",
    time: "≥6 周",
    coreMeasures: "完整训练课无限制 + 心理准备就绪",
    goal: "安全重返赛场 / 日常",
    keyJudgment: "TSK<37,Y-Balance≥95%",
  },
  {
    stage: "6. 预防复发",
    time: "持续",
    coreMeasures: "离心训练、神经肌肉训练、负荷管理",
    goal: "降低再损伤率",
    keyJudgment: "周期性功能筛查",
  },
];

export interface ReturnStandard {
  category: string;
  test: string;
  threshold: string;
  hamstring: string;
  quadriceps: string;
  ankle: string;
  rotatorCuff: string;
}

export const RETURN_STANDARDS: ReturnStandard[] = [
  {
    category: "肌力",
    test: "等速肌力测试",
    threshold: "双侧差异<10%",
    hamstring: "5",
    quadriceps: "5",
    ankle: "3",
    rotatorCuff: "4",
  },
  {
    category: "功能",
    test: "单腿跳远",
    threshold: "≥健侧 90%",
    hamstring: "5",
    quadriceps: "5",
    ankle: "5",
    rotatorCuff: "1",
  },
  {
    category: "功能",
    test: "Y-Balance / SEBT",
    threshold: "前后内外≥95% 对称",
    hamstring: "3",
    quadriceps: "2",
    ankle: "5",
    rotatorCuff: "1",
  },
  {
    category: "速度",
    test: "无痛冲刺",
    threshold: "≥80% 最大速度无不适",
    hamstring: "5",
    quadriceps: "3",
    ankle: "1",
    rotatorCuff: "1",
  },
  {
    category: "本体感觉",
    test: "单腿闭眼站立",
    threshold: "≥30 秒",
    hamstring: "2",
    quadriceps: "3",
    ankle: "5",
    rotatorCuff: "1",
  },
  {
    category: "耐力",
    test: "单腿提踵",
    threshold: "20 次无不适",
    hamstring: "2",
    quadriceps: "4",
    ankle: "4",
    rotatorCuff: "1",
  },
  {
    category: "专项",
    test: "完整训练课",
    threshold: "全程无限制",
    hamstring: "5",
    quadriceps: "5",
    ankle: "5",
    rotatorCuff: "4",
  },
  {
    category: "心理",
    test: "TSK 恐动症量表",
    threshold: "<37 分",
    hamstring: "4",
    quadriceps: "3",
    ankle: "3",
    rotatorCuff: "2",
  },
];

export interface AcuteCompare {
  principle: string;
  year: string;
  ice: string;
  antiInflammatory: string;
  rest: string;
  load: string;
  compression: string;
  elevation: string;
  education: string;
  psychology: string;
  exercise: string;
}

export const ACUTE_COMPARE: AcuteCompare[] = [
  {
    principle: "RICE",
    year: "1978",
    ice: "3",
    antiInflammatory: "3",
    rest: "3",
    load: "0",
    compression: "2",
    elevation: "3",
    education: "0",
    psychology: "0",
    exercise: "0",
  },
  {
    principle: "POLICE",
    year: "2012",
    ice: "2",
    antiInflammatory: "2",
    rest: "2",
    load: "3",
    compression: "3",
    elevation: "3",
    education: "1",
    psychology: "0",
    exercise: "1",
  },
  {
    principle: "PEACE & LOVE",
    year: "2019",
    ice: "0",
    antiInflammatory: "0",
    rest: "2",
    load: "3",
    compression: "3",
    elevation: "3",
    education: "3",
    psychology: "3",
    exercise: "3",
  },
];

export const ACUTE_COMPARE_NOTE =
  "PEACE & LOVE 取消冰敷与急性期 NSAIDs，因炎症是修复必要过程；新增心理积极、负荷渐进、血管化与主动运动。适应证：闭合性软组织损伤（拉伤、扭伤、挫伤）。";
