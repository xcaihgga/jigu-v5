export interface Question {
  id: string;
  dimension: string;
  text: string;
  options: { label: string; score: number }[];
  weight?: number;
  condition?: { questionId: string; min?: number; max?: number };
}

export interface ScaleQuestions {
  id: string;
  questions: Question[];
  grading?: {
    max: number;
    grades: { label: string; min: number; tone: "good" | "warn" | "bad" }[];
  };
}

export const SCALE_QUESTIONS_MAP: Record<string, ScaleQuestions> = {
  vas: {
    id: "vas",
    questions: [
      {
        id: "q1",
        dimension: "疼痛强度",
        text: "请选择您当前的疼痛强度（0=无痛，10=最剧烈疼痛）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1 - 极轻微疼痛", score: 1 },
          { label: "2 - 轻微疼痛", score: 2 },
          { label: "3 - 轻度疼痛", score: 3 },
          { label: "4 - 中度疼痛", score: 4 },
          { label: "5 - 明显疼痛", score: 5 },
          { label: "6 - 较严重疼痛", score: 6 },
          { label: "7 - 严重疼痛", score: 7 },
          { label: "8 - 剧烈疼痛", score: 8 },
          { label: "9 - 极其剧烈疼痛", score: 9 },
          { label: "10 - 无法忍受的疼痛", score: 10 },
        ],
      },
    ],
    grading: {
      max: 10,
      grades: [
        { label: "无痛/轻度(0-3)", min: 0, tone: "good" },
        { label: "中度(4-6)", min: 4, tone: "warn" },
        { label: "重度(7-10)", min: 7, tone: "bad" },
      ],
    },
  },

  nrs: {
    id: "nrs",
    questions: [
      {
        id: "q1",
        dimension: "疼痛强度",
        text: "请选择您当前的疼痛程度（0=无痛，10=最剧烈疼痛）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1", score: 1 },
          { label: "2", score: 2 },
          { label: "3", score: 3 },
          { label: "4", score: 4 },
          { label: "5", score: 5 },
          { label: "6", score: 6 },
          { label: "7", score: 7 },
          { label: "8", score: 8 },
          { label: "9", score: 9 },
          { label: "10 - 最剧烈疼痛", score: 10 },
        ],
      },
    ],
    grading: {
      max: 10,
      grades: [
        { label: "轻度(1-3)", min: 0, tone: "good" },
        { label: "中度(4-6)", min: 4, tone: "warn" },
        { label: "重度(7-10)", min: 7, tone: "bad" },
      ],
    },
  },

  p4: {
    id: "p4",
    questions: [
      {
        id: "q1",
        dimension: "最剧烈疼痛",
        text: "过去24小时内最剧烈的疼痛程度（0-10分）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1", score: 1 },
          { label: "2", score: 2 },
          { label: "3", score: 3 },
          { label: "4", score: 4 },
          { label: "5", score: 5 },
          { label: "6", score: 6 },
          { label: "7", score: 7 },
          { label: "8", score: 8 },
          { label: "9", score: 9 },
          { label: "10 - 最剧烈", score: 10 },
        ],
      },
      {
        id: "q2",
        dimension: "最轻疼痛",
        text: "过去24小时内最轻的疼痛程度（0-10分）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1", score: 1 },
          { label: "2", score: 2 },
          { label: "3", score: 3 },
          { label: "4", score: 4 },
          { label: "5", score: 5 },
          { label: "6", score: 6 },
          { label: "7", score: 7 },
          { label: "8", score: 8 },
          { label: "9", score: 9 },
          { label: "10 - 最剧烈", score: 10 },
        ],
      },
      {
        id: "q3",
        dimension: "平均疼痛",
        text: "过去24小时内平均疼痛程度（0-10分）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1", score: 1 },
          { label: "2", score: 2 },
          { label: "3", score: 3 },
          { label: "4", score: 4 },
          { label: "5", score: 5 },
          { label: "6", score: 6 },
          { label: "7", score: 7 },
          { label: "8", score: 8 },
          { label: "9", score: 9 },
          { label: "10 - 最剧烈", score: 10 },
        ],
      },
      {
        id: "q4",
        dimension: "当前疼痛",
        text: "现在的疼痛程度（0-10分）",
        options: [
          { label: "0 - 无痛", score: 0 },
          { label: "1", score: 1 },
          { label: "2", score: 2 },
          { label: "3", score: 3 },
          { label: "4", score: 4 },
          { label: "5", score: 5 },
          { label: "6", score: 6 },
          { label: "7", score: 7 },
          { label: "8", score: 8 },
          { label: "9", score: 9 },
          { label: "10 - 最剧烈", score: 10 },
        ],
      },
    ],
    grading: {
      max: 40,
      grades: [
        { label: "轻度(0-12)", min: 0, tone: "good" },
        { label: "中度(13-24)", min: 13, tone: "warn" },
        { label: "重度(25-40)", min: 25, tone: "bad" },
      ],
    },
  },

  barthel: {
    id: "barthel",
    questions: [
      {
        id: "q1",
        dimension: "进食",
        text: "您能自己进食吗？",
        options: [
          { label: "完全独立（无需帮助）", score: 10 },
          { label: "需要部分帮助（切菜、盛饭等）", score: 5 },
          { label: "完全依赖他人", score: 0 },
        ],
      },
      {
        id: "q2",
        dimension: "洗澡",
        text: "您能自己洗澡吗？",
        options: [
          { label: "完全独立", score: 5 },
          { label: "需要帮助", score: 0 },
        ],
      },
      {
        id: "q3",
        dimension: "穿衣",
        text: "您能自己穿脱衣服吗？",
        options: [
          { label: "完全独立（包括系扣、拉拉链）", score: 10 },
          { label: "需要部分帮助", score: 5 },
          { label: "完全依赖他人", score: 0 },
        ],
      },
      {
        id: "q4",
        dimension: "如厕",
        text: "您能自己上厕所吗？",
        options: [
          { label: "完全独立（包括便后清洁）", score: 10 },
          { label: "需要部分帮助", score: 5 },
          { label: "完全依赖他人", score: 0 },
        ],
      },
      {
        id: "q5",
        dimension: "转移",
        text: "从轮椅到床或从床到轮椅的转移",
        options: [
          { label: "完全独立", score: 15 },
          { label: "需要少量帮助或监护", score: 10 },
          { label: "需要大量帮助", score: 5 },
          { label: "完全依赖他人", score: 0 },
        ],
      },
      {
        id: "q6",
        dimension: "行走",
        text: "在平地上行走",
        options: [
          { label: "独立行走50米以上", score: 15 },
          { label: "需要辅助器具行走50米", score: 10 },
          { label: "需要他人帮助行走", score: 5 },
          { label: "完全无法行走", score: 0 },
        ],
      },
      {
        id: "q7",
        dimension: "上下楼梯",
        text: "您能上下楼梯吗？",
        options: [
          { label: "完全独立", score: 10 },
          { label: "需要帮助（扶扶手或他人协助）", score: 5 },
          { label: "无法上下楼梯", score: 0 },
        ],
      },
      {
        id: "q8",
        dimension: "大便控制",
        text: "您能控制大便吗？",
        options: [
          { label: "完全控制", score: 10 },
          { label: "偶尔失控或使用器具", score: 5 },
          { label: "完全失控", score: 0 },
        ],
      },
      {
        id: "q9",
        dimension: "小便控制",
        text: "您能控制小便吗？",
        options: [
          { label: "完全控制", score: 10 },
          { label: "偶尔失控或使用器具", score: 5 },
          { label: "完全失控", score: 0 },
        ],
      },
      {
        id: "q10",
        dimension: "修饰",
        text: "您能自己洗脸、梳头、刷牙、剃须吗？",
        options: [
          { label: "完全独立", score: 5 },
          { label: "需要帮助", score: 0 },
        ],
      },
    ],
    grading: {
      max: 100,
      grades: [
        { label: "完全独立(100)", min: 100, tone: "good" },
        { label: "轻度依赖(61-99)", min: 61, tone: "good" },
        { label: "中度依赖(41-60)", min: 41, tone: "warn" },
        { label: "重度依赖(0-40)", min: 0, tone: "bad" },
      ],
    },
  },

  fim: {
    id: "fim",
    questions: [
      // === 运动项（13项）===
      { id: "q1", dimension: "进食", text: "进食（使用餐具将食物送入口中）", options: [
        { label: "完全独立（安全、合理时间内完成）", score: 7 },
        { label: "修正独立（需辅助器具或额外时间）", score: 6 },
        { label: "监督或准备（需他人准备器具/监督）", score: 5 },
        { label: "最小帮助（自己完成≥75%）", score: 4 },
        { label: "中度帮助（自己完成50-74%）", score: 3 },
        { label: "最大帮助（自己完成25-49%）", score: 2 },
        { label: "完全依赖（自己完成<25%）", score: 1 },
      ]},
      { id: "q2", dimension: "梳洗", text: "梳洗（洗脸、洗手、梳头、刷牙、剃须）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q3", dimension: "洗澡", text: "洗澡（清洗身体、擦干、转移进出浴盆/淋浴）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q4", dimension: "穿上衣", text: "穿上衣（穿脱上衣，包括扣扣子、拉拉链）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q5", dimension: "穿下衣", text: "穿下衣（穿脱裤/裙、鞋袜）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q6", dimension: "如厕", text: "如厕（转移至便器、清洁、整理衣物）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q7", dimension: "膀胱控制", text: "膀胱控制（自主控尿、使用集尿器/导尿）", options: [
        { label: "完全独立（无失禁，自主如厕）", score: 7 }, { label: "修正独立（需器具/药物辅助）", score: 6 },
        { label: "监督或需他人提醒", score: 5 }, { label: "最小帮助（偶有失禁，≥75%自主）", score: 4 },
        { label: "中度帮助（50-74%自主）", score: 3 }, { label: "最大帮助（25-49%自主）", score: 2 },
        { label: "完全依赖（频繁失禁）", score: 1 },
      ]},
      { id: "q8", dimension: "直肠控制", text: "直肠控制（自主排便、使用通便/灌肠）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或需他人提醒", score: 5 }, { label: "最小帮助（≥75%自主）", score: 4 },
        { label: "中度帮助（50-74%自主）", score: 3 }, { label: "最大帮助（25-49%自主）", score: 2 },
        { label: "完全依赖", score: 1 },
      ]},
      { id: "q9", dimension: "床椅转移", text: "床↔椅子/轮椅转移（包括刹车、抬起脚踏板）", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q10", dimension: "如厕转移", text: "转移至/离开坐便器", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q11", dimension: "洗澡转移", text: "转移进出浴盆/淋浴间", options: [
        { label: "完全独立", score: 7 }, { label: "修正独立", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      { id: "q12", dimension: "行走", text: "行走或轮椅推进（在平地移动50米/150英尺）", options: [
        { label: "完全独立（无需器具，≥50米）", score: 7 }, { label: "修正独立（需拐杖/轮椅/矫形器）", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%自主）", score: 4 },
        { label: "中度帮助（50-74%自主）", score: 3 }, { label: "最大帮助（25-49%自主）", score: 2 },
        { label: "完全依赖（<25%，无法移动50米）", score: 1 },
      ]},
      { id: "q13", dimension: "上下楼梯", text: "上下楼梯（连续12-14级台阶）", options: [
        { label: "完全独立（无需扶手/器具）", score: 7 }, { label: "修正独立（需扶手/器具）", score: 6 },
        { label: "监督或准备", score: 5 }, { label: "最小帮助（≥75%）", score: 4 },
        { label: "中度帮助（50-74%）", score: 3 }, { label: "最大帮助（25-49%）", score: 2 },
        { label: "完全依赖（<25%）", score: 1 },
      ]},
      // === 认知项（5项）===
      { id: "q14", dimension: "理解", text: "理解（对听觉/视觉信息的理解能力）", options: [
        { label: "完全独立（理解复杂/抽象信息）", score: 7 }, { label: "修正独立（需辅助器具/额外时间≥90%）", score: 6 },
        { label: "监督（需重复/简化≥75%）", score: 5 }, { label: "最小帮助（理解≥75%）", score: 4 },
        { label: "中度帮助（理解50-74%）", score: 3 }, { label: "最大帮助（理解25-49%）", score: 2 },
        { label: "完全依赖（理解<25%）", score: 1 },
      ]},
      { id: "q15", dimension: "表达", text: "表达（语言/非语言表达基本和复杂需求）", options: [
        { label: "完全独立（表达复杂/抽象内容）", score: 7 }, { label: "修正独立（需辅助器具≥90%）", score: 6 },
        { label: "监督（需提示≥75%）", score: 5 }, { label: "最小帮助（表达≥75%）", score: 4 },
        { label: "中度帮助（表达50-74%）", score: 3 }, { label: "最大帮助（表达25-49%）", score: 2 },
        { label: "完全依赖（表达<25%）", score: 1 },
      ]},
      { id: "q16", dimension: "社交互动", text: "社交互动（与患者/工作人员/家人的互动质量）", options: [
        { label: "完全独立（恰当处理所有社交）", score: 7 }, { label: "修正独立（偶尔不当≥90%）", score: 6 },
        { label: "监督（偶尔需提醒≥75%）", score: 5 }, { label: "最小帮助（适当≥75%）", score: 4 },
        { label: "中度帮助（适当50-74%）", score: 3 }, { label: "最大帮助（适当25-49%）", score: 2 },
        { label: "完全依赖（很少/从不适当）", score: 1 },
      ]},
      { id: "q17", dimension: "问题解决", text: "问题解决（解决日常问题和应对变化的能力）", options: [
        { label: "完全独立（解决复杂问题）", score: 7 }, { label: "修正独立（需额外时间≥90%）", score: 6 },
        { label: "监督（常规问题需提示≥75%）", score: 5 }, { label: "最小帮助（解决≥75%）", score: 4 },
        { label: "中度帮助（解决50-74%）", score: 3 }, { label: "最大帮助（解决25-49%）", score: 2 },
        { label: "完全依赖（解决<25%）", score: 1 },
      ]},
      { id: "q18", dimension: "记忆", text: "记忆（认人、记住日常常规、执行他人指令）", options: [
        { label: "完全独立（记住所有重要信息）", score: 7 }, { label: "修正独立（需辅助器具≥90%）", score: 6 },
        { label: "监督（需提醒≥75%）", score: 5 }, { label: "最小帮助（记住≥75%）", score: 4 },
        { label: "中度帮助（记住50-74%）", score: 3 }, { label: "最大帮助（记住25-49%）", score: 2 },
        { label: "完全依赖（记住<25%）", score: 1 },
      ]},
    ],
    grading: {
      max: 126,
      grades: [
        { label: "独立(108-126)", min: 108, tone: "good" },
        { label: "轻度依赖(90-107)", min: 90, tone: "good" },
        { label: "中度依赖(72-89)", min: 72, tone: "warn" },
        { label: "重度依赖(36-71)", min: 36, tone: "bad" },
        { label: "完全依赖(18-35)", min: 18, tone: "bad" },
      ],
    },
  },

  odi: {
    id: "odi",
    questions: [
      {
        id: "q1",
        dimension: "疼痛强度",
        text: "您的腰痛程度如何？",
        options: [
          { label: "无疼痛", score: 0 },
          { label: "很轻微", score: 1 },
          { label: "轻微", score: 2 },
          { label: "中等", score: 3 },
          { label: "严重", score: 4 },
          { label: "极其严重", score: 5 },
        ],
      },
      {
        id: "q2",
        dimension: "生活自理",
        text: "您能自己穿衣、洗漱吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法完成", score: 5 },
        ],
      },
      {
        id: "q3",
        dimension: "提物",
        text: "您能提重物吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法完成", score: 5 },
        ],
      },
      {
        id: "q4",
        dimension: "行走",
        text: "您能行走多远？",
        options: [
          { label: "不受限", score: 0 },
          { label: "超过1公里", score: 1 },
          { label: "500米到1公里", score: 2 },
          { label: "100米到500米", score: 3 },
          { label: "不到100米", score: 4 },
          { label: "无法行走", score: 5 },
        ],
      },
      {
        id: "q5",
        dimension: "坐",
        text: "您能坐多久？",
        options: [
          { label: "不受限", score: 0 },
          { label: "超过1小时", score: 1 },
          { label: "半小时到1小时", score: 2 },
          { label: "15分钟到半小时", score: 3 },
          { label: "不到15分钟", score: 4 },
          { label: "无法坐", score: 5 },
        ],
      },
      {
        id: "q6",
        dimension: "站立",
        text: "您能站立多久？",
        options: [
          { label: "不受限", score: 0 },
          { label: "超过1小时", score: 1 },
          { label: "半小时到1小时", score: 2 },
          { label: "15分钟到半小时", score: 3 },
          { label: "不到15分钟", score: 4 },
          { label: "无法站立", score: 5 },
        ],
      },
      {
        id: "q7",
        dimension: "睡眠",
        text: "腰痛是否影响您的睡眠？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法入睡", score: 5 },
        ],
      },
      {
        id: "q8",
        dimension: "性生活",
        text: "腰痛是否影响您的性生活？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法进行", score: 5 },
        ],
      },
      {
        id: "q9",
        dimension: "社交活动",
        text: "腰痛是否影响您的社交活动？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法进行", score: 5 },
        ],
      },
      {
        id: "q10",
        dimension: "旅行",
        text: "腰痛是否影响您的旅行？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法旅行", score: 5 },
        ],
      },
    ],
    grading: {
      max: 50,
      grades: [
        { label: "正常(0-20%)", min: 0, tone: "good" },
        { label: "轻度(21-40%)", min: 11, tone: "good" },
        { label: "中度(41-60%)", min: 21, tone: "warn" },
        { label: "重度(61-80%)", min: 31, tone: "bad" },
        { label: "极重度(81-100%)", min: 41, tone: "bad" },
      ],
    },
  },

  ndi: {
    id: "ndi",
    questions: [
      {
        id: "q1",
        dimension: "疼痛强度",
        text: "您的颈痛程度如何？",
        options: [
          { label: "无疼痛", score: 0 },
          { label: "很轻微", score: 1 },
          { label: "轻微", score: 2 },
          { label: "中等", score: 3 },
          { label: "严重", score: 4 },
          { label: "极其严重", score: 5 },
        ],
      },
      {
        id: "q2",
        dimension: "个人护理",
        text: "您能自己洗头、梳头吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法完成", score: 5 },
        ],
      },
      {
        id: "q3",
        dimension: "提物",
        text: "您能提重物吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法完成", score: 5 },
        ],
      },
      {
        id: "q4",
        dimension: "阅读",
        text: "您能阅读多久？",
        options: [
          { label: "不受限", score: 0 },
          { label: "超过1小时", score: 1 },
          { label: "半小时到1小时", score: 2 },
          { label: "15分钟到半小时", score: 3 },
          { label: "不到15分钟", score: 4 },
          { label: "无法阅读", score: 5 },
        ],
      },
      {
        id: "q5",
        dimension: "头痛",
        text: "您的头痛程度如何？",
        options: [
          { label: "无头痛", score: 0 },
          { label: "很轻微", score: 1 },
          { label: "轻微", score: 2 },
          { label: "中等", score: 3 },
          { label: "严重", score: 4 },
          { label: "极其严重", score: 5 },
        ],
      },
      {
        id: "q6",
        dimension: "集中注意力",
        text: "您能集中注意力工作吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法完成", score: 5 },
        ],
      },
      {
        id: "q7",
        dimension: "工作",
        text: "颈痛是否影响您的工作？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法工作", score: 5 },
        ],
      },
      {
        id: "q8",
        dimension: "驾驶",
        text: "您能驾驶吗？",
        options: [
          { label: "完全能", score: 0 },
          { label: "几乎能", score: 1 },
          { label: "有些困难", score: 2 },
          { label: "困难很大", score: 3 },
          { label: "完全不能", score: 4 },
          { label: "无法驾驶", score: 5 },
        ],
      },
      {
        id: "q9",
        dimension: "睡眠",
        text: "颈痛是否影响您的睡眠？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法入睡", score: 5 },
        ],
      },
      {
        id: "q10",
        dimension: "娱乐",
        text: "颈痛是否影响您的娱乐活动？",
        options: [
          { label: "完全不影响", score: 0 },
          { label: "几乎不影响", score: 1 },
          { label: "有些影响", score: 2 },
          { label: "影响很大", score: 3 },
          { label: "严重影响", score: 4 },
          { label: "无法进行", score: 5 },
        ],
      },
    ],
    grading: {
      max: 50,
      grades: [
        { label: "正常(0-10%)", min: 0, tone: "good" },
        { label: "轻度(11-20%)", min: 6, tone: "good" },
        { label: "中度(21-30%)", min: 11, tone: "warn" },
        { label: "重度(31-40%)", min: 16, tone: "bad" },
        { label: "极重度(41-50%)", min: 21, tone: "bad" },
      ],
    },
  },

  berg: {
    id: "berg",
    questions: [
      {
        id: "q1",
        dimension: "坐-站",
        text: "从坐姿站起",
        options: [
          { label: "无需帮助独立站起", score: 4 },
          { label: "需用手支撑站起", score: 3 },
          { label: "需他人少量帮助", score: 2 },
          { label: "需他人大量帮助", score: 1 },
          { label: "完全无法站起", score: 0 },
        ],
      },
      {
        id: "q2",
        dimension: "独立站立",
        text: "独立站立2分钟",
        options: [
          { label: "能独立站立2分钟", score: 4 },
          { label: "能站立但少于2分钟", score: 3 },
          { label: "需他人监护", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法站立", score: 0 },
        ],
      },
      {
        id: "q3",
        dimension: "站-坐",
        text: "从站姿坐下",
        options: [
          { label: "无需帮助独立坐下", score: 4 },
          { label: "需用手支撑坐下", score: 3 },
          { label: "需他人少量帮助", score: 2 },
          { label: "需他人大量帮助", score: 1 },
          { label: "完全无法坐下", score: 0 },
        ],
      },
      {
        id: "q4",
        dimension: "坐-转",
        text: "坐姿下转身向后看",
        options: [
          { label: "无需帮助完成", score: 4 },
          { label: "需用手支撑", score: 3 },
          { label: "需他人帮助", score: 2 },
          { label: "能转头但不能转身", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
      {
        id: "q5",
        dimension: "弯腰拾物",
        text: "从坐姿弯腰拾物",
        options: [
          { label: "无需帮助完成", score: 4 },
          { label: "需用手支撑", score: 3 },
          { label: "需他人帮助", score: 2 },
          { label: "能弯腰但不能拾物", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
      {
        id: "q6",
        dimension: "转身360度",
        text: "站立时转身360度",
        options: [
          { label: "能连续转身360度", score: 4 },
          { label: "能转身但需停顿", score: 3 },
          { label: "能转身180度", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法转身", score: 0 },
        ],
      },
      {
        id: "q7",
        dimension: "双足并拢站立",
        text: "双足并拢站立10秒",
        options: [
          { label: "能独立完成", score: 4 },
          { label: "能完成但少于10秒", score: 3 },
          { label: "需他人监护", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
      {
        id: "q8",
        dimension: "闭眼站立",
        text: "闭眼站立10秒",
        options: [
          { label: "能独立完成", score: 4 },
          { label: "能完成但少于10秒", score: 3 },
          { label: "需他人监护", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
      {
        id: "q9",
        dimension: "单脚站立",
        text: "单脚站立5秒",
        options: [
          { label: "能完成5秒", score: 4 },
          { label: "能完成但少于5秒", score: 3 },
          { label: "能抬起脚但不能站立", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
      {
        id: "q10",
        dimension: "向前伸手",
        text: "站立时向前伸手",
        options: [
          { label: "能伸手超过10厘米", score: 4 },
          { label: "能伸手但少于10厘米", score: 3 },
          { label: "能伸手但需他人监护", score: 2 },
          { label: "需他人帮助", score: 1 },
          { label: "无法完成", score: 0 },
        ],
      },
    ],
    grading: {
      max: 56,
      grades: [
        { label: "平衡良好(≥50)", min: 50, tone: "good" },
        { label: "平衡一般(41-49)", min: 41, tone: "good" },
        { label: "平衡较差(21-40)", min: 21, tone: "warn" },
        { label: "跌倒风险高(<21)", min: 0, tone: "bad" },
      ],
    },
  },

  mmse: {
    id: "mmse",
    questions: [
      {
        id: "q1",
        dimension: "定向力-时间",
        text: "现在是哪一年？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q2",
        dimension: "定向力-时间",
        text: "现在是哪个季节？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q3",
        dimension: "定向力-时间",
        text: "现在是几月？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q4",
        dimension: "定向力-时间",
        text: "今天是几号？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q5",
        dimension: "定向力-时间",
        text: "今天是星期几？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q6",
        dimension: "定向力-地点",
        text: "我们现在在哪个省/市？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q7",
        dimension: "定向力-地点",
        text: "我们现在在哪个区？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q8",
        dimension: "定向力-地点",
        text: "我们现在在哪个街道？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q9",
        dimension: "定向力-地点",
        text: "我们现在在哪个楼层？",
        options: [
          { label: "正确", score: 1 },
          { label: "错误", score: 0 },
        ],
      },
      {
        id: "q10",
        dimension: "记忆力",
        text: "请记住三个词：苹果、桌子、国旗。我稍后会问您。",
        options: [
          { label: "能记住", score: 3 },
          { label: "能记住两个", score: 2 },
          { label: "能记住一个", score: 1 },
          { label: "一个都记不住", score: 0 },
        ],
      },
    ],
    grading: {
      max: 30,
      grades: [
        { label: "正常(≥27)", min: 27, tone: "good" },
        { label: "轻度认知障碍(21-26)", min: 21, tone: "warn" },
        { label: "中度认知障碍(10-20)", min: 10, tone: "bad" },
        { label: "重度认知障碍(<10)", min: 0, tone: "bad" },
      ],
    },
  },

  mmt: {
    id: "mmt",
    questions: [
      {
        id: "q1",
        dimension: "肌力分级",
        text: "请评估目标肌群的肌力等级（0-5级）",
        options: [
          { label: "0级 - 无肌肉收缩", score: 0 },
          { label: "1级 - 有肌肉收缩但无关节活动", score: 1 },
          { label: "2级 - 去重力下可完成全范围活动", score: 2 },
          { label: "3级 - 抗重力可完成全范围活动", score: 3 },
          { label: "4级 - 抗重力抗轻度阻力", score: 4 },
          { label: "5级 - 正常肌力，抗重力抗充分阻力", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "正常(5级)", min: 5, tone: "good" },
        { label: "良好(4级)", min: 4, tone: "good" },
        { label: "尚可(3级)", min: 3, tone: "warn" },
        { label: "差(0-2级)", min: 0, tone: "bad" },
      ],
    },
  },

  "m-ashworth": {
    id: "m-ashworth",
    questions: [
      {
        id: "q1",
        dimension: "肌张力",
        text: "请评估目标肌群的肌张力等级",
        options: [
          { label: "0级 - 肌张力正常，无增高", score: 0 },
          { label: "1级 - 肌张力轻微增高，被动活动时有轻微阻力", score: 1 },
          { label: "1+级 - 肌张力轻度增高，被动活动时在ROM后半程出现明显阻力", score: 1 },
          { label: "2级 - 肌张力中度增高，被动活动时全程均有阻力", score: 2 },
          { label: "3级 - 肌张力明显增高，被动活动困难", score: 3 },
          { label: "4级 - 肌张力极度增高，肢体僵硬", score: 4 },
        ],
      },
    ],
    grading: {
      max: 4,
      grades: [
        { label: "正常(0级)", min: 0, tone: "good" },
        { label: "轻微增高(1级)", min: 1, tone: "good" },
        { label: "中度增高(1+-2级)", min: 1, tone: "warn" },
        { label: "明显增高(3-4级)", min: 3, tone: "bad" },
      ],
    },
  },

  "6mwt": {
    id: "6mwt",
    questions: [
      {
        id: "q1",
        dimension: "步行距离",
        text: "六分钟步行距离（米）",
        options: [
          { label: "<300米 - 严重受限", score: 1 },
          { label: "300-374米 - 中度受限", score: 2 },
          { label: "375-449米 - 轻度受限", score: 3 },
          { label: "450-550米 - 接近正常", score: 4 },
          { label: ">550米 - 正常", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "正常(4-5级)", min: 4, tone: "good" },
        { label: "轻度受限(3级)", min: 3, tone: "good" },
        { label: "中度受限(2级)", min: 2, tone: "warn" },
        { label: "严重受限(1级)", min: 1, tone: "bad" },
      ],
    },
  },

  "phq-9": {
    id: "phq-9",
    questions: [
      {
        id: "q1",
        dimension: "情绪低落",
        text: "过去两周内，您是否感到情绪低落、沮丧或绝望？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q2",
        dimension: "兴趣减退",
        text: "过去两周内，您是否对做事提不起兴趣或乐趣？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q3",
        dimension: "睡眠障碍",
        text: "过去两周内，您是否有睡眠障碍（难以入睡或早醒）？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q4",
        dimension: "精力下降",
        text: "过去两周内，您是否感到疲倦或精力不足？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q5",
        dimension: "食欲改变",
        text: "过去两周内，您的食欲是否有明显改变？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q6",
        dimension: "自我评价",
        text: "过去两周内，您是否觉得自己很失败，或让自己/家人失望？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q7",
        dimension: "注意力",
        text: "过去两周内，您是否难以集中注意力（如阅读、看电视）？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q8",
        dimension: "精神运动",
        text: "过去两周内，您是否行动或说话缓慢，或相反烦躁不安？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q9",
        dimension: "自杀念头",
        text: "过去两周内，您是否有不如死掉或自伤的念头？",
        weight: 1.5,
        condition: { questionId: "q1", min: 1 },
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
    ],
    grading: {
      max: 28.5,
      grades: [
        { label: "无抑郁(0-4)", min: 0, tone: "good" },
        { label: "轻度抑郁(5-9)", min: 5, tone: "warn" },
        { label: "中度抑郁(10-14)", min: 10, tone: "warn" },
        { label: "中重度抑郁(15-19)", min: 15, tone: "bad" },
        { label: "重度抑郁(20-28.5)", min: 20, tone: "bad" },
      ],
    },
  },

  "gad-7": {
    id: "gad-7",
    questions: [
      {
        id: "q1",
        dimension: "紧张焦虑",
        text: "过去两周内，您是否感到紧张、焦虑或烦躁？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q2",
        dimension: "无法放松",
        text: "过去两周内，您是否感到无法放松或坐立不安？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q3",
        dimension: "焦虑预期",
        text: "过去两周内，您是否感到担心过多或难以控制？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q4",
        dimension: "恐慌感",
        text: "过去两周内，您是否感到恐惧或恐慌？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q5",
        dimension: "心跳加速",
        text: "过去两周内，您是否感到心跳加速或心悸？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q6",
        dimension: "烦躁易怒",
        text: "过去两周内，您是否感到烦躁易怒？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
      {
        id: "q7",
        dimension: "恐惧感",
        text: "过去两周内，您是否感到恐惧，好像会发生可怕的事情？",
        options: [
          { label: "完全没有", score: 0 },
          { label: "几天", score: 1 },
          { label: "一半以上天数", score: 2 },
          { label: "几乎每天", score: 3 },
        ],
      },
    ],
    grading: {
      max: 21,
      grades: [
        { label: "无焦虑(0-4)", min: 0, tone: "good" },
        { label: "轻度焦虑(5-9)", min: 5, tone: "warn" },
        { label: "中度焦虑(10-14)", min: 10, tone: "warn" },
        { label: "重度焦虑(15-21)", min: 15, tone: "bad" },
      ],
    },
  },

  "water-swallow": {
    id: "water-swallow",
    questions: [
      {
        id: "q1",
        dimension: "吞咽功能",
        text: "喝下30ml温水后的表现",
        options: [
          { label: "1级 - 一次喝完，无呛咳", score: 1 },
          { label: "2级 - 两次喝完，无呛咳", score: 2 },
          { label: "3级 - 一次喝完，但有呛咳", score: 3 },
          { label: "4级 - 两次喝完，有呛咳", score: 4 },
          { label: "5级 - 多次喝完，频繁呛咳或无法完成", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "正常(1级)", min: 1, tone: "good" },
        { label: "轻度障碍(2级)", min: 2, tone: "warn" },
        { label: "中度障碍(3-4级)", min: 3, tone: "warn" },
        { label: "重度障碍(5级)", min: 5, tone: "bad" },
      ],
    },
  },

  gcs: {
    id: "gcs",
    questions: [
      {
        id: "q1",
        dimension: "睁眼反应",
        text: "睁眼反应",
        options: [
          { label: "4分 - 自动睁眼", score: 4 },
          { label: "3分 - 呼唤睁眼", score: 3 },
          { label: "2分 - 疼痛刺激睁眼", score: 2 },
          { label: "1分 - 任何刺激均不睁眼", score: 1 },
        ],
      },
      {
        id: "q2",
        dimension: "语言反应",
        text: "语言反应",
        options: [
          { label: "5分 - 正常交谈", score: 5 },
          { label: "4分 - 言语不清", score: 4 },
          { label: "3分 - 只能发出声音", score: 3 },
          { label: "2分 - 对疼痛有呻吟", score: 2 },
          { label: "1分 - 无任何反应", score: 1 },
        ],
      },
      {
        id: "q3",
        dimension: "运动反应",
        text: "运动反应",
        options: [
          { label: "6分 - 按指令动作", score: 6 },
          { label: "5分 - 对疼痛能定位", score: 5 },
          { label: "4分 - 对疼痛能躲避", score: 4 },
          { label: "3分 - 对疼痛呈屈曲反应", score: 3 },
          { label: "2分 - 对疼痛呈伸直反应", score: 2 },
          { label: "1分 - 无任何反应", score: 1 },
        ],
      },
    ],
    grading: {
      max: 15,
      grades: [
        { label: "正常(15分)", min: 15, tone: "good" },
        { label: "轻度脑损伤(13-14分)", min: 13, tone: "good" },
        { label: "中度脑损伤(9-12分)", min: 9, tone: "warn" },
        { label: "重度脑损伤(≤8分)", min: 0, tone: "bad" },
      ],
    },
  },

  joa: {
    id: "joa",
    questions: [
      {
        id: "q1",
        dimension: "主观症状",
        text: "颈部疼痛程度",
        options: [
          { label: "无疼痛", score: 3 },
          { label: "轻度疼痛", score: 2 },
          { label: "中度疼痛", score: 1 },
          { label: "重度疼痛", score: 0 },
        ],
      },
      {
        id: "q2",
        dimension: "主观症状",
        text: "上肢麻木程度",
        options: [
          { label: "无麻木", score: 3 },
          { label: "轻度麻木", score: 2 },
          { label: "中度麻木", score: 1 },
          { label: "重度麻木", score: 0 },
        ],
      },
      {
        id: "q3",
        dimension: "临床体征",
        text: "上肢肌力",
        options: [
          { label: "正常", score: 4 },
          { label: "轻度减弱", score: 3 },
          { label: "中度减弱", score: 2 },
          { label: "重度减弱", score: 1 },
          { label: "完全瘫痪", score: 0 },
        ],
      },
      {
        id: "q4",
        dimension: "临床体征",
        text: "感觉功能",
        options: [
          { label: "正常", score: 2 },
          { label: "轻度异常", score: 1 },
          { label: "明显异常", score: 0 },
        ],
      },
      {
        id: "q5",
        dimension: "日常生活受限",
        text: "日常生活活动能力",
        options: [
          { label: "正常", score: 4 },
          { label: "轻度受限", score: 3 },
          { label: "中度受限", score: 2 },
          { label: "重度受限", score: 1 },
        ],
      },
    ],
    grading: {
      max: 17,
      grades: [
        { label: "正常(15-17分)", min: 15, tone: "good" },
        { label: "轻度(12-14分)", min: 12, tone: "good" },
        { label: "中度(7-11分)", min: 7, tone: "warn" },
        { label: "重度(0-6分)", min: 0, tone: "bad" },
      ],
    },
  },

  "wong-baker": {
    id: "wong-baker",
    questions: [
      {
        id: "q1",
        dimension: "面部表情疼痛",
        text: "请选择最符合您当前疼痛程度的面部表情",
        options: [
          { label: "0 - 无痛（笑脸）", score: 0 },
          { label: "2 - 有点痛", score: 2 },
          { label: "4 - 轻微痛", score: 4 },
          { label: "6 - 中等痛", score: 6 },
          { label: "8 - 严重痛", score: 8 },
          { label: "10 - 最剧烈痛（哭泣）", score: 10 },
        ],
      },
    ],
    grading: {
      max: 10,
      grades: [
        { label: "无痛/轻度(0-3)", min: 0, tone: "good" },
        { label: "中度(4-6)", min: 4, tone: "warn" },
        { label: "重度(7-10)", min: 7, tone: "bad" },
      ],
    },
  },

  "sf-mpq": {
    id: "sf-mpq",
    questions: [
      { id: "q1", dimension: "感觉", text: "跳痛（搏动样疼痛）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q2", dimension: "感觉", text: "穿刺样痛（放射痛）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q3", dimension: "感觉", text: "刺痛", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q4", dimension: "感觉", text: "锐痛（刀割样）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q5", dimension: "感觉", text: "痉挛/挛缩痛", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q6", dimension: "感觉", text: "咬痛（啃咬样）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q7", dimension: "感觉", text: "烧灼痛", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q8", dimension: "感觉", text: "隐痛（钝痛）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q9", dimension: "感觉", text: "沉重痛", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q10", dimension: "感觉", text: "触痛", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q11", dimension: "感觉", text: "劈裂样痛（撕裂样）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q12", dimension: "情感", text: "疲劳/耗竭感", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q13", dimension: "情感", text: "令人作呕（恶心感）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q14", dimension: "情感", text: "害怕（恐惧感）", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
      { id: "q15", dimension: "情感", text: "惩罚样/残酷感", options: [
        { label: "无", score: 0 }, { label: "轻微", score: 1 },
        { label: "中度", score: 2 }, { label: "严重", score: 3 },
      ]},
    ],
    grading: {
      max: 45,
      grades: [
        { label: "轻度疼痛(0-14)", min: 0, tone: "good" },
        { label: "中度疼痛(15-29)", min: 15, tone: "warn" },
        { label: "重度疼痛(30-45)", min: 30, tone: "bad" },
      ],
    },
  },

  rmq: {
    id: "rmq",
    questions: [
      { id: "q1", dimension: "功能受限", text: "由于腰背痛，我大部分时间都待在家里", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q2", dimension: "功能受限", text: "由于腰背痛，我频繁变换姿势以使背部舒服", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q3", dimension: "功能受限", text: "由于腰背痛，我走得比平常慢", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q4", dimension: "功能受限", text: "由于腰背痛，我不能做平常所做的家务", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q5", dimension: "功能受限", text: "由于腰背痛，我上楼时扶着扶手", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q6", dimension: "功能受限", text: "由于腰背痛，我经常躺下休息", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q7", dimension: "功能受限", text: "由于腰背痛，我必须借助物品才能从坐椅上站起", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q8", dimension: "功能受限", text: "由于腰背痛，我尽量请别人帮我做事", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q9", dimension: "功能受限", text: "由于腰背痛，我穿衣服比平常慢", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q10", dimension: "功能受限", text: "由于腰背痛，我只能站立较短时间", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q11", dimension: "功能受限", text: "由于腰背痛，我尽量不弯腰或跪下", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q12", dimension: "功能受限", text: "由于腰背痛，我在椅子上坐立困难", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q13", dimension: "功能受限", text: "我的背总是痛", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q14", dimension: "功能受限", text: "由于腰背痛，我在床上翻身困难", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q15", dimension: "功能受限", text: "由于腰背痛，我的食欲不是很好", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q16", dimension: "功能受限", text: "由于腰背痛，我穿袜子、系鞋带困难", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q17", dimension: "功能受限", text: "由于腰背痛，我只能走较短距离", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q18", dimension: "功能受限", text: "由于腰背痛，我睡眠不好", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q19", dimension: "功能受限", text: "由于腰背痛，我经常需要他人帮助穿衣", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q20", dimension: "功能受限", text: "由于腰背痛，我大部分时间都坐着", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q21", dimension: "功能受限", text: "由于腰背痛，我避免做繁重的家务", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q22", dimension: "功能受限", text: "由于腰背痛，我比平常容易急躁和发脾气", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q23", dimension: "功能受限", text: "由于腰背痛，我上楼梯比平常慢", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
      { id: "q24", dimension: "功能受限", text: "由于腰背痛，我整天都待在床上", options: [
        { label: "是", score: 1 }, { label: "否", score: 0 },
      ]},
    ],
    grading: {
      max: 24,
      grades: [
        { label: "轻度功能障碍(0-7)", min: 0, tone: "good" },
        { label: "中度功能障碍(8-15)", min: 8, tone: "warn" },
        { label: "重度功能障碍(16-24)", min: 16, tone: "bad" },
      ],
    },
  },

  dash: {
    id: "dash",
    questions: [
      { id: "q1", dimension: "上肢功能", text: "写字或打字", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q2", dimension: "上肢功能", text: "开紧的或新的罐头盖", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q3", dimension: "上肢功能", text: "准备一顿饭", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q4", dimension: "上肢功能", text: "推开重门", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q5", dimension: "上肢功能", text: "洗头或吹干头发", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q6", dimension: "上肢功能", text: "清洗背部", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q7", dimension: "上肢功能", text: "穿毛衣或套头衫", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q8", dimension: "上肢功能", text: "用刀切食物（如切肉）", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q9", dimension: "上肢功能", text: "提重物（如购物袋或公文包）", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q10", dimension: "上肢功能", text: "做园艺或家务", options: [
        { label: "无困难", score: 1 }, { label: "轻微困难", score: 2 },
        { label: "中度困难", score: 3 }, { label: "重度困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
    ],
    grading: {
      max: 50,
      grades: [
        { label: "轻度功能障碍(10-19)", min: 10, tone: "good" },
        { label: "中度功能障碍(20-34)", min: 20, tone: "warn" },
        { label: "重度功能障碍(35-50)", min: 35, tone: "bad" },
      ],
    },
  },

  katz: {
    id: "katz",
    questions: [
      { id: "q1", dimension: "进食", text: "进食（包括夹菜、送入口中）", options: [
        { label: "独立完成（无需帮助）", score: 1 }, { label: "需要帮助或完全依赖", score: 0 },
      ]},
      { id: "q2", dimension: "穿衣", text: "穿衣脱衣（包括系扣、拉拉链、系鞋带）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或完全依赖", score: 0 },
      ]},
      { id: "q3", dimension: "洗澡", text: "洗澡（清洗身体各部位、擦干）", options: [
        { label: "独立完成（淋浴或盆浴）", score: 1 }, { label: "需要帮助或完全依赖", score: 0 },
      ]},
      { id: "q4", dimension: "如厕", text: "如厕（转移至便器、清洁、整理衣物）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或完全依赖", score: 0 },
      ]},
      { id: "q5", dimension: "转移", text: "转移（从床到椅子、轮椅等）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或完全依赖", score: 0 },
      ]},
      { id: "q6", dimension: "大小便控制", text: "大小便控制能力", options: [
        { label: "完全控制", score: 1 }, { label: "部分或完全失禁", score: 0 },
      ]},
    ],
    grading: {
      max: 6,
      grades: [
        { label: "独立(6分)", min: 6, tone: "good" },
        { label: "轻度依赖(4-5分)", min: 4, tone: "good" },
        { label: "中度依赖(2-3分)", min: 2, tone: "warn" },
        { label: "重度依赖(0-1分)", min: 0, tone: "bad" },
      ],
    },
  },

  lawton: {
    id: "lawton",
    questions: [
      { id: "q1", dimension: "工具性ADL", text: "使用电话（主动拨打电话、接听）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能使用", score: 0 },
      ]},
      { id: "q2", dimension: "工具性ADL", text: "购物（独立挑选并购买所需物品）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q3", dimension: "工具性ADL", text: "做饭（准备食材、烹饪）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q4", dimension: "工具性ADL", text: "做家务（打扫、整理、清洗小件）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q5", dimension: "工具性ADL", text: "洗衣（清洗、晾晒衣物）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q6", dimension: "工具性ADL", text: "出行（独立乘坐公共交通或自驾）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q7", dimension: "工具性ADL", text: "服药（按时按量正确服用药物）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
      { id: "q8", dimension: "工具性ADL", text: "理财（管理财务、处理账单）", options: [
        { label: "独立完成", score: 1 }, { label: "需要帮助或不能完成", score: 0 },
      ]},
    ],
    grading: {
      max: 8,
      grades: [
        { label: "独立(8分)", min: 8, tone: "good" },
        { label: "轻度依赖(6-7分)", min: 6, tone: "good" },
        { label: "中度依赖(3-5分)", min: 3, tone: "warn" },
        { label: "重度依赖(0-2分)", min: 0, tone: "bad" },
      ],
    },
  },

  fac: {
    id: "fac",
    questions: [
      {
        id: "q1",
        dimension: "步行功能",
        text: "请评估患者的步行能力等级",
        options: [
          { label: "0级 - 不能步行或需两人以上协助", score: 0 },
          { label: "1级 - 需1人持续给予躯干承重支持", score: 1 },
          { label: "2级 - 需1人持续或间断给予维持平衡或协调帮助", score: 2 },
          { label: "3级 - 需口头监督或1人随时准备给予帮助", score: 3 },
          { label: "4级 - 平地独立步行，但上下楼梯/坡道/不平地面需帮助", score: 4 },
          { label: "5级 - 任何地面均独立步行", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "独立步行(4-5级)", min: 4, tone: "good" },
        { label: "需监护或协助(2-3级)", min: 2, tone: "warn" },
        { label: "严重依赖(0-1级)", min: 0, tone: "bad" },
      ],
    },
  },

  tug: {
    id: "tug",
    questions: [
      {
        id: "q1",
        dimension: "起立行走能力",
        text: "请记录从坐椅站起、行走3米、转身、走回并坐下所需的总时间",
        options: [
          { label: "<10秒 - 正常，移动能力良好", score: 3 },
          { label: "10-20秒 - 轻度异常，社区行走尚可", score: 2 },
          { label: ">20秒 - 重度异常，跌倒风险高", score: 1 },
        ],
      },
    ],
    grading: {
      max: 3,
      grades: [
        { label: "正常(3级)", min: 3, tone: "good" },
        { label: "轻度异常(2级)", min: 2, tone: "warn" },
        { label: "重度异常(1级)", min: 1, tone: "bad" },
      ],
    },
  },

  constant: {
    id: "constant",
    questions: [
      { id: "q1", dimension: "疼痛", text: "肩关节疼痛程度", options: [
        { label: "无痛", score: 15 }, { label: "轻度疼痛，不影响活动", score: 10 },
        { label: "中度疼痛，可耐受", score: 5 }, { label: "重度疼痛，影响睡眠", score: 0 },
      ]},
      { id: "q2", dimension: "日常生活-工作娱乐", text: "工作和娱乐活动受限程度", options: [
        { label: "全部工作娱乐活动", score: 10 }, { label: "大部分工作娱乐活动", score: 8 },
        { label: "中等程度工作娱乐活动", score: 6 }, { label: "轻度工作娱乐活动", score: 4 },
        { label: "仅能做轻微活动", score: 2 }, { label: "完全不能活动", score: 0 },
      ]},
      { id: "q3", dimension: "日常生活-睡眠", text: "睡眠受肩痛影响情况", options: [
        { label: "无影响", score: 5 }, { label: "偶有影响（惊醒1-2次）", score: 3 },
        { label: "经常影响", score: 0 },
      ]},
      { id: "q4", dimension: "日常生活-活动水平", text: "日常活动水平", options: [
        { label: "全天工作或重度活动", score: 5 }, { label: "全天工作或中度活动", score: 4 },
        { label: "部分工作或轻度活动", score: 3 }, { label: "仅能自理日常生活", score: 2 },
        { label: "不能自理日常生活", score: 0 },
      ]},
      { id: "q5", dimension: "活动度-前屈", text: "肩关节主动前屈活动度", options: [
        { label: "≥151°", score: 10 }, { label: "121°-150°", score: 8 },
        { label: "91°-120°", score: 6 }, { label: "61°-90°", score: 4 },
        { label: "31°-60°", score: 2 }, { label: "0°-30°", score: 0 },
      ]},
      { id: "q6", dimension: "活动度-外展", text: "肩关节主动外展活动度", options: [
        { label: "≥151°", score: 10 }, { label: "121°-150°", score: 8 },
        { label: "91°-120°", score: 6 }, { label: "61°-90°", score: 4 },
        { label: "31°-60°", score: 2 }, { label: "0°-30°", score: 0 },
      ]},
      { id: "q7", dimension: "活动度-旋转", text: "肩关节外旋+内旋综合活动度", options: [
        { label: "外旋≥60°，手可触T6以上", score: 20 }, { label: "外旋30°-59°，手可触L5-T12", score: 15 },
        { label: "外旋<30°，手可触臀部", score: 10 }, { label: "外旋0°，手无法触背部", score: 0 },
      ]},
      { id: "q8", dimension: "肌力", text: "肩关节外展肌力测试（90°位抗阻）", options: [
        { label: "5级 - 正常肌力", score: 25 }, { label: "4级 - 良好，可抗强阻力", score: 20 },
        { label: "3级 - 一般，可抗中等阻力", score: 15 }, { label: "2级 - 差，可抗重力", score: 10 },
        { label: "1级 - 仅可触及肌肉收缩", score: 5 }, { label: "0级 - 无收缩", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(90-100)", min: 90, tone: "good" },
        { label: "良(80-89)", min: 80, tone: "good" },
        { label: "中(70-79)", min: 70, tone: "warn" },
        { label: "差(<70)", min: 0, tone: "bad" },
      ],
    },
  },

  hhs: {
    id: "hhs",
    questions: [
      { id: "q1", dimension: "疼痛", text: "髋关节疼痛程度", options: [
        { label: "无痛或可忽略", score: 44 }, { label: "轻度疼痛，不影响活动", score: 40 },
        { label: "中度疼痛，可耐受，服止痛药有效", score: 30 }, { label: "重度疼痛，活动受限", score: 20 },
        { label: "完全不能活动，卧床疼痛", score: 0 },
      ]},
      { id: "q2", dimension: "功能-跛行", text: "步行时跛行情况", options: [
        { label: "无跛行", score: 11 }, { label: "轻度跛行", score: 8 },
        { label: "中度跛行", score: 5 }, { label: "重度跛行", score: 0 },
      ]},
      { id: "q3", dimension: "功能-支撑", text: "行走时所需支撑", options: [
        { label: "无需支撑", score: 11 }, { label: "长途行走需手杖", score: 7 },
        { label: "全部行走需手杖", score: 5 }, { label: "需双拐", score: 4 },
        { label: "无法行走", score: 0 },
      ]},
      { id: "q4", dimension: "功能-步行距离", text: "最大连续步行距离", options: [
        { label: "不受限", score: 11 }, { label: "≥6个街区（约500米）", score: 8 },
        { label: "2-3个街区", score: 5 }, { label: "仅能室内行走", score: 2 },
        { label: "无法行走", score: 0 },
      ]},
      { id: "q5", dimension: "功能-上下楼梯", text: "上下楼梯能力", options: [
        { label: "正常，无需扶手", score: 4 }, { label: "需扶扶手", score: 2 },
        { label: "无法上下楼梯", score: 0 },
      ]},
      { id: "q6", dimension: "功能-穿袜鞋", text: "穿袜、系鞋带能力", options: [
        { label: "容易完成", score: 4 }, { label: "困难", score: 2 },
        { label: "无法完成", score: 0 },
      ]},
      { id: "q7", dimension: "功能-坐", text: "坐姿情况", options: [
        { label: "可坐任何椅子，持续1小时", score: 5 }, { label: "需坐高椅子", score: 3 },
        { label: "不能舒适坐立", score: 0 },
      ]},
      { id: "q8", dimension: "功能-公共交通", text: "能否乘坐公共交通工具", options: [
        { label: "能", score: 1 }, { label: "不能", score: 0 },
      ]},
      { id: "q9", dimension: "畸形", text: "是否存在以下畸形（前屈<30°、内收<10°、伸直位内旋<10°、肢体短缩>3.2cm，每项1分倒扣）", options: [
        { label: "无任何畸形", score: 4 }, { label: "1项畸形", score: 3 },
        { label: "2项畸形", score: 2 }, { label: "3项畸形", score: 1 },
        { label: "4项畸形", score: 0 },
      ]},
      { id: "q10", dimension: "活动度", text: "髋关节总活动度（屈曲+内收+外展+内旋+外旋）综合评分", options: [
        { label: "210°-300°", score: 5 }, { label: "160°-209°", score: 4 },
        { label: "100°-159°", score: 3 }, { label: "60°-99°", score: 2 },
        { label: "30°-59°", score: 1 }, { label: "0°-29°", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(90-100)", min: 90, tone: "good" },
        { label: "良(80-89)", min: 80, tone: "good" },
        { label: "中(70-79)", min: 70, tone: "warn" },
        { label: "差(<70)", min: 0, tone: "bad" },
      ],
    },
  },

  lysholm: {
    id: "lysholm",
    questions: [
      { id: "q1", dimension: "跛行", text: "日常行走时跛行情况", options: [
        { label: "无跛行", score: 5 }, { label: "轻度/周期性跛行", score: 3 },
        { label: "持续轻度跛行", score: 2 }, { label: "严重跛行", score: 0 },
      ]},
      { id: "q2", dimension: "支撑", text: "行走时所需支撑", options: [
        { label: "无需支撑", score: 5 }, { label: "需手杖或拐杖", score: 2 },
        { label: "不可负重行走", score: 0 },
      ]},
      { id: "q3", dimension: "绞锁", text: "膝关节绞锁情况", options: [
        { label: "无绞锁或卡感", score: 15 }, { label: "有卡感但无绞锁", score: 12 },
        { label: "偶尔绞锁", score: 8 }, { label: "经常绞锁", score: 4 },
        { label: "体检时见绞锁", score: 0 },
      ]},
      { id: "q4", dimension: "不稳定", text: "膝关节不稳定（打软腿）情况", options: [
        { label: "无不稳", score: 25 }, { label: "剧烈运动时偶尔不稳", score: 20 },
        { label: "日常活动偶尔不稳", score: 15 }, { label: "日常活动经常不稳", score: 10 },
        { label: "每步均有不稳", score: 5 }, { label: "完全无法行走", score: 0 },
      ]},
      { id: "q5", dimension: "疼痛", text: "膝关节疼痛情况", options: [
        { label: "无疼痛", score: 25 }, { label: "剧烈运动时偶尔轻度疼痛", score: 20 },
        { label: "剧烈运动时明显疼痛", score: 15 }, { label: "步行>2km后疼痛", score: 10 },
        { label: "步行<2km后疼痛", score: 5 }, { label: "持续疼痛", score: 0 },
      ]},
      { id: "q6", dimension: "肿胀", text: "膝关节肿胀情况", options: [
        { label: "无肿胀", score: 10 }, { label: "剧烈运动后肿胀", score: 8 },
        { label: "日常活动后肿胀", score: 6 }, { label: "持续肿胀", score: 0 },
      ]},
      { id: "q7", dimension: "上下楼梯", text: "上下楼梯能力", options: [
        { label: "无困难", score: 10 }, { label: "略减慢", score: 7 },
        { label: "一步一阶", score: 5 }, { label: "仅能一阶一阶上下", score: 2 },
        { label: "无法上下楼梯", score: 0 },
      ]},
      { id: "q8", dimension: "下蹲", text: "下蹲能力", options: [
        { label: "无困难", score: 5 }, { label: "略减慢", score: 4 },
        { label: "下蹲<90°", score: 2 }, { label: "无法下蹲", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(95-100)", min: 95, tone: "good" },
        { label: "良(84-94)", min: 84, tone: "good" },
        { label: "中(65-83)", min: 65, tone: "warn" },
        { label: "差(<65)", min: 0, tone: "bad" },
      ],
    },
  },

  aofas: {
    id: "aofas",
    questions: [
      { id: "q1", dimension: "疼痛", text: "踝-后足疼痛情况", options: [
        { label: "无痛", score: 40 }, { label: "轻度疼痛，偶发", score: 30 },
        { label: "中度疼痛，每日发作", score: 20 }, { label: "严重疼痛，几乎持续", score: 0 },
      ]},
      { id: "q2", dimension: "功能-活动受限", text: "活动受限情况", options: [
        { label: "无受限（包括娱乐活动）", score: 10 }, { label: "日常活动无受限，娱乐受限", score: 7 },
        { label: "日常和娱乐均受限", score: 4 }, { label: "日常和娱乐严重受限", score: 0 },
      ]},
      { id: "q3", dimension: "功能-步行距离", text: "最大步行距离", options: [
        { label: "≥6个街区", score: 5 }, { label: "4-6个街区", score: 4 },
        { label: "1-3个街区", score: 2 }, { label: "<1个街区", score: 0 },
      ]},
      { id: "q4", dimension: "功能-行走地面", text: "可适应的行走地面", options: [
        { label: "任何地面（包括崎岖）", score: 5 }, { label: "崎岖地面有困难", score: 4 },
        { label: "仅能在平地行走", score: 2 }, { label: "仅能室内行走", score: 0 },
      ]},
      { id: "q5", dimension: "功能-步态", text: "步态异常情况", options: [
        { label: "无异常", score: 8 }, { label: "轻度异常", score: 6 },
        { label: "中度异常", score: 4 }, { label: "明显异常", score: 0 },
      ]},
      { id: "q6", dimension: "功能-矢状面运动", text: "踝关节矢状面（跖屈/背伸）活动度", options: [
        { label: "正常或轻度受限（>30°）", score: 8 }, { label: "中度受限（15°-30°）", score: 5 },
        { label: "明显受限（5°-14°）", score: 2 }, { label: "强直（<5°）", score: 0 },
      ]},
      { id: "q7", dimension: "功能-后足运动", text: "后足（距下关节）内外翻活动度", options: [
        { label: "正常（25°-30°）", score: 6 }, { label: "轻度受限（75%以上）", score: 4 },
        { label: "中度受限（25%-75%）", score: 2 }, { label: "明显受限（<25%）", score: 0 },
      ]},
      { id: "q8", dimension: "功能-稳定性", text: "踝-后足稳定性（前后/内外翻方向）", options: [
        { label: "稳定", score: 8 }, { label: "明显不稳", score: 0 },
      ]},
      { id: "q9", dimension: "对线", text: "踝-后足对线情况", options: [
        { label: "优 - 良好对线，踝-后足位于中立位", score: 10 },
        { label: "良 - 可接受对线，轻度偏移但无症状", score: 5 },
        { label: "差 - 明显对线不良，有症状", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(90-100)", min: 90, tone: "good" },
        { label: "良(80-89)", min: 80, tone: "good" },
        { label: "中(70-79)", min: 70, tone: "warn" },
        { label: "差(<70)", min: 0, tone: "bad" },
      ],
    },
  },

  moca: {
    id: "moca",
    questions: [
      { id: "q1", dimension: "视空间执行", text: "连线测试与画立方体（交替连线1-2-3-4-5-A-B-C-D-E并复制立方体）", options: [
        { label: "两项均正确完成", score: 2 }, { label: "仅正确完成一项", score: 1 },
        { label: "两项均未正确完成", score: 0 },
      ]},
      { id: "q2", dimension: "视空间-画钟", text: "画钟测试（绘制完整钟面，标出12个数字和指定时间如11:10）", options: [
        { label: "轮廓、数字、指针全部正确", score: 3 }, { label: "2项正确", score: 2 },
        { label: "1项正确", score: 1 }, { label: "3项均错误", score: 0 },
      ]},
      { id: "q3", dimension: "命名", text: "命名测试（识别狮子、犀牛、骆驼图片）", options: [
        { label: "3个全部正确", score: 3 }, { label: "正确识别2个", score: 2 },
        { label: "正确识别1个", score: 1 }, { label: "全部错误", score: 0 },
      ]},
      { id: "q4", dimension: "注意-数字广度", text: "数字广度测试（顺背5位数字和倒背3位数字）", options: [
        { label: "顺背和倒背均正确", score: 2 }, { label: "仅顺背或仅倒背正确", score: 1 },
        { label: "两项均错误", score: 0 },
      ]},
      { id: "q5", dimension: "注意-警觉性", text: "字母警觉性测试（听到字母A时拍手）", options: [
        { label: "≥11次正确反应", score: 1 }, { label: "<11次正确反应", score: 0 },
      ]},
      { id: "q6", dimension: "注意-连续减7", text: "从100开始连续减7（100-93-86-79-72）", options: [
        { label: "全部正确或仅1个错误", score: 3 }, { label: "2-3个错误", score: 2 },
        { label: "4个错误", score: 1 }, { label: "全部错误或不能完成", score: 0 },
      ]},
      { id: "q7", dimension: "语言-句子复述", text: "复述句子（如\"我知道今天约翰要帮助明天的我\"）", options: [
        { label: "两句均正确复述", score: 2 }, { label: "仅1句正确", score: 1 },
        { label: "两句均错误", score: 0 },
      ]},
      { id: "q8", dimension: "语言-流畅性与抽象", text: "字母流畅性（1分钟内说出以\"F\"开头的词）与相似性抽象（如香蕉和橘子都是水果）", options: [
        { label: "流畅性≥11个词且抽象2项正确", score: 3 }, { label: "流畅性≥11个词或抽象2项正确", score: 2 },
        { label: "仅完成一项", score: 1 }, { label: "两项均未完成", score: 0 },
      ]},
      { id: "q9", dimension: "延迟回忆", text: "回忆此前所读的5个词（如面孔、丝绒、教堂、菊花、红色）", options: [
        { label: "5个全部正确回忆", score: 5 }, { label: "正确回忆4个", score: 4 },
        { label: "正确回忆3个", score: 3 }, { label: "正确回忆2个", score: 2 },
        { label: "正确回忆1个", score: 1 }, { label: "全部不能回忆", score: 0 },
      ]},
      { id: "q10", dimension: "定向", text: "定向力（今天是几号、星期几、几月、哪一年、这里是哪里、哪个城市）", options: [
        { label: "6项全部正确", score: 6 }, { label: "正确5项", score: 5 },
        { label: "正确4项", score: 4 }, { label: "正确3项", score: 3 },
        { label: "正确2项", score: 2 }, { label: "正确1项", score: 1 },
        { label: "全部错误", score: 0 },
      ]},
    ],
    grading: {
      max: 30,
      grades: [
        { label: "正常(≥26)", min: 26, tone: "good" },
        { label: "轻度认知障碍(18-25)", min: 18, tone: "warn" },
        { label: "中度认知障碍(10-17)", min: 10, tone: "bad" },
        { label: "重度认知障碍(<10)", min: 0, tone: "bad" },
      ],
    },
  },

  "m-tardieu": {
    id: "m-tardieu",
    questions: [
      {
        id: "q1",
        dimension: "肌张力/痉挛",
        text: "在指定速度下被动牵拉目标肌群时，肌肉反应的等级（Y轴评分）",
        options: [
          { label: "0级 - 整个被动活动范围内无阻力", score: 0 },
          { label: "1级 - 整个被动活动范围内轻微阻力，无catch", score: 1 },
          { label: "2级 - 在被动活动范围内出现明确的catch，随后释放", score: 2 },
          { label: "3级 - 出现疲劳性clonus（持续<10秒）", score: 3 },
          { label: "4级 - 出现持续clonus（持续>10秒）", score: 4 },
          { label: "5级 - 关节强直，无法被动活动", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "无痉挛(0级)", min: 0, tone: "good" },
        { label: "轻度痉挛(1-2级)", min: 1, tone: "warn" },
        { label: "重度痉挛(3-5级)", min: 3, tone: "bad" },
      ],
    },
  },

  gmfcs: {
    id: "gmfcs",
    questions: [
      {
        id: "q1",
        dimension: "粗大运动功能",
        text: "请评估患者粗大运动功能分级（按6-12岁年龄段描述）",
        options: [
          { label: "I级 - 可在室内外行走、上下楼梯，能跑、跳但平衡协调略差", score: 1 },
          { label: "II级 - 多数环境下可独立行走，上下楼梯需扶扶手，长距离/不平地面受限", score: 2 },
          { label: "III级 - 室内/社区行走需辅助器具（如助行器），上楼需扶扶手或监护", score: 3 },
          { label: "IV级 - 自我移动严重受限，需轮椅协助，可站立/短距离步行（家中）", score: 4 },
          { label: "V级 - 完全依赖他人移动，运动功能严重受限", score: 5 },
        ],
      },
    ],
    grading: {
      max: 5,
      grades: [
        { label: "I级 - 独立步行", min: 1, tone: "good" },
        { label: "II-III级 - 需辅助或器具", min: 2, tone: "warn" },
        { label: "IV-V级 - 严重依赖", min: 4, tone: "bad" },
      ],
    },
  },

  nyha: {
    id: "nyha",
    questions: [
      {
        id: "q1",
        dimension: "心功能分级",
        text: "请根据患者体力活动受限情况评估心功能分级",
        options: [
          { label: "I级 - 体力活动不受限，一般体力活动不引起过度疲劳、心悸、呼吸困难或心绞痛", score: 1 },
          { label: "II级 - 体力活动轻度受限，休息时无不适，一般体力活动引起症状", score: 2 },
          { label: "III级 - 体力活动明显受限，轻于一般活动即引起症状", score: 3 },
          { label: "IV级 - 不能从事任何体力活动，静息状态下即出现心衰或心绞痛症状", score: 4 },
        ],
      },
    ],
    grading: {
      max: 4,
      grades: [
        { label: "I级 - 无症状", min: 1, tone: "good" },
        { label: "II级 - 轻度受限", min: 2, tone: "warn" },
        { label: "III级 - 明显受限", min: 3, tone: "bad" },
        { label: "IV级 - 静息即有症状", min: 4, tone: "bad" },
      ],
    },
  },

  hamd: {
    id: "hamd",
    questions: [
      { id: "q1", dimension: "抑郁情绪", text: "抑郁情绪（0=无，1=只在问及时诉述，2=自发诉述，3=非言语流露，4=明显流露）", options: [
        { label: "无", score: 0 }, { label: "只在问及时诉述", score: 1 },
        { label: "自发诉述", score: 2 }, { label: "非言语流露（表情/姿势）", score: 3 },
        { label: "明显流露于言语和非言语", score: 4 },
      ]},
      { id: "q2", dimension: "罪恶感", text: "罪恶感（0=无，1=责备自己，2=认为自己连累他人，3=罪恶妄想，4=指责/控诉妄想）", options: [
        { label: "无", score: 0 }, { label: "责备自己", score: 1 },
        { label: "认为自己连累他人", score: 2 }, { label: "罪恶妄想", score: 3 },
        { label: "指控/谴责妄想", score: 4 },
      ]},
      { id: "q3", dimension: "自杀", text: "自杀念头（0=无，1=觉得活着没意思，2=希望死去，3=自杀念头/暗示，4=严重自杀行为）", options: [
        { label: "无", score: 0 }, { label: "觉得活着没意思", score: 1 },
        { label: "希望死去", score: 2 }, { label: "有自杀念头或暗示", score: 3 },
        { label: "有严重自杀行为", score: 4 },
      ]},
      { id: "q4", dimension: "睡眠障碍", text: "入睡困难、睡眠不深、早醒等睡眠障碍综合（0=无，1=轻度，2=中度，3=重度，4=严重失眠）", options: [
        { label: "无睡眠障碍", score: 0 }, { label: "轻度睡眠障碍", score: 1 },
        { label: "中度睡眠障碍", score: 2 }, { label: "重度睡眠障碍", score: 3 },
        { label: "严重失眠", score: 4 },
      ]},
      { id: "q5", dimension: "工作和兴趣", text: "工作和兴趣减退（0=无，1=轻度，2=中度，3=重度，4=完全丧失）", options: [
        { label: "无减退", score: 0 }, { label: "轻度减退", score: 1 },
        { label: "中度减退", score: 2 }, { label: "重度减退", score: 3 },
        { label: "完全丧失工作能力或兴趣", score: 4 },
      ]},
      { id: "q6", dimension: "迟缓", text: "思维和言语迟缓、注意力不集中、运动迟缓（0=无，1=轻度，2=中度，3=重度，4=木僵）", options: [
        { label: "无迟缓", score: 0 }, { label: "轻度迟缓", score: 1 },
        { label: "中度迟缓", score: 2 }, { label: "重度迟缓", score: 3 },
        { label: "木僵", score: 4 },
      ]},
      { id: "q7", dimension: "激越", text: "激越（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无激越", score: 0 }, { label: "轻度激越", score: 1 },
        { label: "中度激越", score: 2 }, { label: "重度激越", score: 3 },
        { label: "严重激越，难以安抚", score: 4 },
      ]},
      { id: "q8", dimension: "焦虑", text: "精神性焦虑和躯体性焦虑综合（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无焦虑", score: 0 }, { label: "轻度焦虑", score: 1 },
        { label: "中度焦虑", score: 2 }, { label: "重度焦虑", score: 3 },
        { label: "严重焦虑，影响生活", score: 4 },
      ]},
      { id: "q9", dimension: "躯体症状", text: "躯体症状（胃肠道、全身症状、性欲、体重减轻等综合）（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无躯体症状", score: 0 }, { label: "轻度躯体症状", score: 1 },
        { label: "中度躯体症状", score: 2 }, { label: "重度躯体症状", score: 3 },
        { label: "严重躯体症状", score: 4 },
      ]},
      { id: "q10", dimension: "自知力", text: "自知力（0=自知有病，1=部分自知，2=否认有病，3=完全否认，4=严重丧失）", options: [
        { label: "自知有病并主动求医", score: 0 }, { label: "部分自知", score: 1 },
        { label: "否认有病", score: 2 }, { label: "完全否认有病", score: 3 },
        { label: "自知力严重丧失", score: 4 },
      ]},
    ],
    grading: {
      max: 40,
      grades: [
        { label: "无抑郁(0-7)", min: 0, tone: "good" },
        { label: "轻度抑郁(8-16)", min: 8, tone: "good" },
        { label: "中度抑郁(17-23)", min: 17, tone: "warn" },
        { label: "严重抑郁(≥24)", min: 24, tone: "bad" },
      ],
    },
  },

  hama: {
    id: "hama",
    questions: [
      { id: "q1", dimension: "焦虑心境", text: "焦虑心境（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度担心、不安", score: 1 },
        { label: "中度焦虑，时轻时重", score: 2 }, { label: "重度焦虑，大部分时间存在", score: 3 },
        { label: "严重焦虑，几乎持续存在", score: 4 },
      ]},
      { id: "q2", dimension: "紧张", text: "紧张感（紧绷、易疲劳、惊跳反应）（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度紧张", score: 1 },
        { label: "中度紧张，易疲劳", score: 2 }, { label: "重度紧张，惊跳反应明显", score: 3 },
        { label: "严重紧张，不能放松", score: 4 },
      ]},
      { id: "q3", dimension: "害怕", text: "害怕（对黑暗、陌生人、独处、动物等的恐惧）（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度害怕", score: 1 },
        { label: "中度害怕", score: 2 }, { label: "重度害怕", score: 3 },
        { label: "严重害怕，影响生活", score: 4 },
      ]},
      { id: "q4", dimension: "失眠", text: "失眠（入睡困难、易醒、早醒综合）（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度睡眠受影响", score: 1 },
        { label: "中度睡眠受影响", score: 2 }, { label: "重度睡眠受影响", score: 3 },
        { label: "严重失眠，每晚<2小时", score: 4 },
      ]},
      { id: "q5", dimension: "认知功能", text: "记忆、注意、智力损害（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度注意力下降", score: 1 },
        { label: "中度记忆/注意下降", score: 2 }, { label: "重度认知下降", score: 3 },
        { label: "严重认知损害，影响日常", score: 4 },
      ]},
      { id: "q6", dimension: "抑郁心境", text: "抑郁心境（兴趣减退、情绪低落）（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度情绪低落", score: 1 },
        { label: "中度情绪低落", score: 2 }, { label: "重度情绪低落", score: 3 },
        { label: "严重抑郁", score: 4 },
      ]},
      { id: "q7", dimension: "肌肉系统症状", text: "肌肉酸痛、抽动、僵硬、震颤、牙关紧闭等（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度肌肉症状", score: 1 },
        { label: "中度肌肉症状", score: 2 }, { label: "重度肌肉症状", score: 3 },
        { label: "严重肌肉症状，影响活动", score: 4 },
      ]},
      { id: "q8", dimension: "心血管症状", text: "心悸、心动过速、胸闷等心血管症状（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度心悸", score: 1 },
        { label: "中度心血管症状", score: 2 }, { label: "重度心血管症状", score: 3 },
        { label: "严重症状，需医疗干预", score: 4 },
      ]},
      { id: "q9", dimension: "呼吸/胃肠道症状", text: "呼吸急促、窒息感、腹痛、恶心、腹泻等综合（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度症状", score: 1 },
        { label: "中度症状", score: 2 }, { label: "重度症状", score: 3 },
        { label: "严重症状，影响日常", score: 4 },
      ]},
      { id: "q10", dimension: "自主神经症状", text: "口干、潮红、苍白、出汗、尿频等自主神经症状（0=无，1=轻度，2=中度，3=重度，4=严重）", options: [
        { label: "无", score: 0 }, { label: "轻度自主神经症状", score: 1 },
        { label: "中度自主神经症状", score: 2 }, { label: "重度自主神经症状", score: 3 },
        { label: "严重自主神经症状", score: 4 },
      ]},
    ],
    grading: {
      max: 40,
      grades: [
        { label: "无焦虑(0-6)", min: 0, tone: "good" },
        { label: "轻度焦虑(7-14)", min: 7, tone: "warn" },
        { label: "中度焦虑(15-21)", min: 15, tone: "warn" },
        { label: "重度焦虑(22-28)", min: 22, tone: "bad" },
        { label: "严重焦虑(≥29)", min: 29, tone: "bad" },
      ],
    },
  },

  frt: {
    id: "frt",
    questions: [
      {
        id: "q1",
        dimension: "功能性伸展",
        text: "请记录患者站立位紧贴墙壁、上肢前屈90°时向前伸展的最大距离（cm）",
        options: [
          { label: ">25.4cm - 正常，跌倒风险低", score: 3 },
          { label: "15.2-25.4cm - 2倍跌倒风险", score: 2 },
          { label: "<15.2cm - 4倍跌倒风险，高风险", score: 1 },
          { label: "无法站立或不能完成测试", score: 0 },
        ],
      },
    ],
    grading: {
      max: 3,
      grades: [
        { label: "正常(3级)", min: 3, tone: "good" },
        { label: "有风险(2级)", min: 2, tone: "warn" },
        { label: "高风险(0-1级)", min: 0, tone: "bad" },
      ],
    },
  },

  ols: {
    id: "ols",
    questions: [
      {
        id: "q1",
        dimension: "单腿站立平衡",
        text: "请记录患者睁眼和闭眼单腿站立坚持的最长时间（秒），分别取双侧最佳值",
        options: [
          { label: "睁眼>30秒且闭眼>15秒 - 平衡功能正常", score: 2 },
          { label: "仅睁眼>30秒或仅闭眼>15秒 - 轻度异常", score: 1 },
          { label: "睁眼<30秒且闭眼<15秒 - 明显异常，跌倒风险高", score: 0 },
        ],
      },
    ],
    grading: {
      max: 2,
      grades: [
        { label: "正常(2级)", min: 2, tone: "good" },
        { label: "轻度异常(1级)", min: 1, tone: "warn" },
        { label: "明显异常(0级)", min: 0, tone: "bad" },
      ],
    },
  },

  // ========== 新增量表 ==========

  "ucla-shoulder": {
    id: "ucla-shoulder",
    questions: [
      { id: "q1", dimension: "疼痛", text: "肩关节疼痛程度", options: [
        { label: "持续疼痛，无法忍受", score: 1 },
        { label: "严重疼痛，但能忍受", score: 2 },
        { label: "运动时中度疼痛", score: 4 },
        { label: "轻度疼痛", score: 6 },
        { label: "无痛", score: 10 },
      ]},
      { id: "q2", dimension: "功能", text: "肩关节功能水平", options: [
        { label: "不能使用上肢", score: 1 },
        { label: "仅能轻微活动", score: 2 },
        { label: "能做轻家务及举手过肩", score: 4 },
        { label: "能做大部分家务及过头工作", score: 6 },
        { label: "正常使用上肢", score: 10 },
      ]},
      { id: "q3", dimension: "主动前屈", text: "肩关节主动前屈活动度", options: [
        { label: "<30°", score: 1 },
        { label: "30°-45°", score: 2 },
        { label: "45°-90°", score: 3 },
        { label: "90°-120°", score: 4 },
        { label: ">120°", score: 5 },
      ]},
      { id: "q4", dimension: "前屈肌力", text: "肩关节前屈肌力", options: [
        { label: "1级", score: 1 },
        { label: "2级", score: 2 },
        { label: "3级", score: 3 },
        { label: "4级", score: 4 },
        { label: "5级（正常）", score: 5 },
      ]},
      { id: "q5", dimension: "满意度", text: "患者对肩关节功能的满意度", options: [
        { label: "不满意", score: 0 },
        { label: "较满意", score: 3 },
        { label: "满意", score: 5 },
      ]},
    ],
    grading: {
      max: 35,
      grades: [
        { label: "优(≥34)", min: 34, tone: "good" },
        { label: "良(29-33)", min: 29, tone: "good" },
        { label: "差(<29)", min: 0, tone: "bad" },
      ],
    },
  },

  "mayo-elbow": {
    id: "mayo-elbow",
    questions: [
      { id: "q1", dimension: "疼痛", text: "肘关节疼痛程度", options: [
        { label: "无疼痛", score: 45 },
        { label: "轻度疼痛，无需用药", score: 30 },
        { label: "中度疼痛，需用药", score: 15 },
        { label: "严重疼痛，功能受限", score: 0 },
      ]},
      { id: "q2", dimension: "运动幅度", text: "肘关节屈伸活动范围", options: [
        { label: "≥100°", score: 20 },
        { label: "50°-100°", score: 15 },
        { label: "<50°", score: 5 },
      ]},
      { id: "q3", dimension: "稳定性", text: "肘关节稳定性", options: [
        { label: "稳定（无明显侧方松弛）", score: 10 },
        { label: "轻度不稳（侧方松弛<10°）", score: 5 },
        { label: "明显不稳（侧方松弛≥10°）", score: 0 },
      ]},
      { id: "q4", dimension: "日常功能", text: "梳头", options: [
        { label: "能独立完成", score: 5 },
        { label: "不能完成", score: 0 },
      ]},
      { id: "q5", dimension: "日常功能", text: "自己吃饭", options: [
        { label: "能独立完成", score: 5 },
        { label: "不能完成", score: 0 },
      ]},
      { id: "q6", dimension: "日常功能", text: "个人卫生（洗对侧腋窝等）", options: [
        { label: "能独立完成", score: 5 },
        { label: "不能完成", score: 0 },
      ]},
      { id: "q7", dimension: "日常功能", text: "穿鞋（系鞋带）", options: [
        { label: "能独立完成", score: 5 },
        { label: "不能完成", score: 0 },
      ]},
      { id: "q8", dimension: "日常功能", text: "穿衣服", options: [
        { label: "能独立完成", score: 5 },
        { label: "不能完成", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(90-100)", min: 90, tone: "good" },
        { label: "良(75-89)", min: 75, tone: "good" },
        { label: "可(60-74)", min: 60, tone: "warn" },
        { label: "差(<60)", min: 0, tone: "bad" },
      ],
    },
  },

  "cooney-wrist": {
    id: "cooney-wrist",
    questions: [
      { id: "q1", dimension: "疼痛", text: "腕关节疼痛程度", options: [
        { label: "无疼痛", score: 25 },
        { label: "轻度疼痛，活动时偶有", score: 20 },
        { label: "中度疼痛，活动受限", score: 15 },
        { label: "严重疼痛，持续存在", score: 0 },
      ]},
      { id: "q2", dimension: "功能", text: "腕关节功能状况", options: [
        { label: "恢复正常工作", score: 25 },
        { label: "工作受限但仍可工作", score: 20 },
        { label: "工作受限且不能工作", score: 10 },
      ]},
      { id: "q3", dimension: "活动度", text: "腕关节屈伸总活动度", options: [
        { label: "≥120°", score: 25 },
        { label: "91°-120°", score: 20 },
        { label: "61°-90°", score: 15 },
        { label: "30°-60°", score: 10 },
        { label: "<30°", score: 5 },
      ]},
      { id: "q4", dimension: "握力", text: "患手握力与健侧比较", options: [
        { label: "正常", score: 25 },
        { label: "轻度减弱（≥75%）", score: 20 },
        { label: "中度减弱（50%-74%）", score: 10 },
        { label: "严重减弱（<50%）", score: 0 },
      ]},
    ],
    grading: {
      max: 100,
      grades: [
        { label: "优(>90)", min: 91, tone: "good" },
        { label: "良(80-89)", min: 80, tone: "good" },
        { label: "可(65-79)", min: 65, tone: "warn" },
        { label: "差(<65)", min: 0, tone: "bad" },
      ],
    },
  },

  "oxford-knee": {
    id: "oxford-knee",
    questions: [
      { id: "q1", dimension: "疼痛", text: "您的膝关节疼痛有多严重？", options: [
        { label: "无疼痛", score: 1 },
        { label: "很轻微", score: 2 },
        { label: "轻微", score: 3 },
        { label: "中度", score: 4 },
        { label: "严重", score: 5 },
      ]},
      { id: "q2", dimension: "功能", text: "膝痛是否影响您洗干身体（洗澡后擦干）？", options: [
        { label: "无困难", score: 1 },
        { label: "很少困难", score: 2 },
        { label: "有些困难", score: 3 },
        { label: "很困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q3", dimension: "功能", text: "上下楼梯是否困难？", options: [
        { label: "无困难", score: 1 },
        { label: "很少困难", score: 2 },
        { label: "有些困难", score: 3 },
        { label: "很困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q4", dimension: "疼痛", text: "走路是否疼痛？", options: [
        { label: "无疼痛", score: 1 },
        { label: "很少疼痛", score: 2 },
        { label: "有时疼痛", score: 3 },
        { label: "经常疼痛", score: 4 },
        { label: "一直疼痛", score: 5 },
      ]},
      { id: "q5", dimension: "功能", text: "从椅子上站起是否困难？", options: [
        { label: "无困难", score: 1 },
        { label: "很少困难", score: 2 },
        { label: "有些困难", score: 3 },
        { label: "很困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q6", dimension: "功能", text: "是否跛行？", options: [
        { label: "无跛行", score: 1 },
        { label: "很少跛行", score: 2 },
        { label: "有时跛行", score: 3 },
        { label: "经常跛行", score: 4 },
        { label: "一直跛行", score: 5 },
      ]},
      { id: "q7", dimension: "功能", text: "是否需要跪下或下蹲？", options: [
        { label: "可以跪/蹲无困难", score: 1 },
        { label: "可以但有很少困难", score: 2 },
        { label: "可以但有些困难", score: 3 },
        { label: "可以但很困难", score: 4 },
        { label: "无法跪/蹲", score: 5 },
      ]},
      { id: "q8", dimension: "疼痛", text: "在床上是否因膝痛而困扰？", options: [
        { label: "没有", score: 1 },
        { label: "仅1-2晚", score: 2 },
        { label: "有些晚上", score: 3 },
        { label: "很多晚上", score: 4 },
        { label: "每天晚上", score: 5 },
      ]},
      { id: "q9", dimension: "功能", text: "膝痛是否影响日常活动？", options: [
        { label: "完全不影响", score: 1 },
        { label: "很少影响", score: 2 },
        { label: "有些影响", score: 3 },
        { label: "很大程度上影响", score: 4 },
        { label: "完全影响", score: 5 },
      ]},
      { id: "q10", dimension: "功能", text: "是否感觉膝部\u201c打软\u201d或不稳？", options: [
        { label: "从没有", score: 1 },
        { label: "很少", score: 2 },
        { label: "有时", score: 3 },
        { label: "经常", score: 4 },
        { label: "一直", score: 5 },
      ]},
      { id: "q11", dimension: "功能", text: "能否从住所走到商店？", options: [
        { label: "无困难", score: 1 },
        { label: "很少困难", score: 2 },
        { label: "有些困难", score: 3 },
        { label: "很困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
      { id: "q12", dimension: "功能", text: "能否走下陡峭的楼梯？", options: [
        { label: "无困难", score: 1 },
        { label: "很少困难", score: 2 },
        { label: "有些困难", score: 3 },
        { label: "很困难", score: 4 },
        { label: "无法完成", score: 5 },
      ]},
    ],
    grading: {
      max: 60,
      grades: [
        { label: "优(<20)", min: 0, tone: "good" },
        { label: "良(20-29)", min: 20, tone: "good" },
        { label: "差(>29)", min: 30, tone: "bad" },
      ],
    },
  },

  "fma-ue": {
    id: "fma-ue",
    questions: [
      { id: "q1", dimension: "肩关节", text: "肩关节屈曲90°", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "部分脱离协同运动", score: 2 },
      ]},
      { id: "q2", dimension: "肩关节", text: "肩关节外展90°", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "部分脱离协同运动", score: 2 },
      ]},
      { id: "q3", dimension: "肘关节", text: "肘关节屈曲", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "部分脱离协同运动", score: 2 },
      ]},
      { id: "q4", dimension: "肘关节", text: "肘关节伸展", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "部分脱离协同运动", score: 2 },
      ]},
      { id: "q5", dimension: "腕关节", text: "腕关节背伸", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q6", dimension: "腕关节", text: "腕关节掌屈", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q7", dimension: "手指", text: "手指屈曲", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q8", dimension: "手指", text: "手指伸展", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q9", dimension: "手指", text: "拇指对指", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q10", dimension: "手指", text: "手抓握（圆柱体）", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
    ],
    grading: {
      max: 66,
      grades: [
        { label: "轻度障碍(≥50)", min: 50, tone: "good" },
        { label: "中度障碍(30-49)", min: 30, tone: "warn" },
        { label: "严重障碍(<30)", min: 0, tone: "bad" },
      ],
    },
  },

  "fma-le": {
    id: "fma-le",
    questions: [
      { id: "q1", dimension: "髋关节", text: "髋关节屈曲", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "独立完成", score: 2 },
      ]},
      { id: "q2", dimension: "髋关节", text: "髋关节外展", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "独立完成", score: 2 },
      ]},
      { id: "q3", dimension: "膝关节", text: "膝关节屈曲", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "独立完成", score: 2 },
      ]},
      { id: "q4", dimension: "膝关节", text: "膝关节伸展", options: [
        { label: "不能完成", score: 0 },
        { label: "协同运动模式完成", score: 1 },
        { label: "独立完成", score: 2 },
      ]},
      { id: "q5", dimension: "踝关节", text: "踝关节背伸", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
      { id: "q6", dimension: "踝关节", text: "踝关节跖屈", options: [
        { label: "不能完成", score: 0 },
        { label: "部分完成", score: 1 },
        { label: "正常完成", score: 2 },
      ]},
    ],
    grading: {
      max: 34,
      grades: [
        { label: "轻度障碍(≥24)", min: 24, tone: "good" },
        { label: "中度障碍(14-23)", min: 14, tone: "warn" },
        { label: "严重障碍(<14)", min: 0, tone: "bad" },
      ],
    },
  },

  brunnstrom: {
    id: "brunnstrom",
    questions: [
      { id: "q1", dimension: "上肢分期", text: "上肢Brunnstrom分期", options: [
        { label: "I期 - 弛缓，无随意运动", score: 1 },
        { label: "II期 - 痉挛出现，出现协同运动模式", score: 2 },
        { label: "III期 - 可随意发起协同运动", score: 3 },
        { label: "IV期 - 可部分脱离协同运动", score: 4 },
        { label: "V期 - 可脱离协同运动，独立完成复杂运动", score: 5 },
        { label: "VI期 - 运动正常或接近正常", score: 6 },
      ]},
      { id: "q2", dimension: "下肢分期", text: "下肢Brunnstrom分期", options: [
        { label: "I期 - 弛缓，无随意运动", score: 1 },
        { label: "II期 - 痉挛出现，出现协同运动模式", score: 2 },
        { label: "III期 - 可随意发起协同运动", score: 3 },
        { label: "IV期 - 可部分脱离协同运动", score: 4 },
        { label: "V期 - 可脱离协同运动，独立完成复杂运动", score: 5 },
        { label: "VI期 - 运动正常或接近正常", score: 6 },
      ]},
      { id: "q3", dimension: "手分期", text: "手Brunnstrom分期", options: [
        { label: "I期 - 弛缓，无随意运动", score: 1 },
        { label: "II期 - 痉挛出现，出现协同运动模式", score: 2 },
        { label: "III期 - 可随意发起协同运动", score: 3 },
        { label: "IV期 - 可部分脱离协同运动", score: 4 },
        { label: "V期 - 可脱离协同运动，独立完成复杂运动", score: 5 },
        { label: "VI期 - 运动正常或接近正常", score: 6 },
      ]},
    ],
    grading: {
      max: 18,
      grades: [
        { label: "恢复良好(15-18)", min: 15, tone: "good" },
        { label: "部分恢复(9-14)", min: 9, tone: "warn" },
        { label: "恢复较差(3-8)", min: 3, tone: "bad" },
      ],
    },
  },

  mas: {
    id: "mas",
    questions: [
      { id: "q1", dimension: "仰卧→侧卧", text: "从仰卧位翻向侧卧位", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q2", dimension: "仰卧→坐位", text: "从仰卧位到坐位", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q3", dimension: "坐位平衡", text: "坐位平衡", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q4", dimension: "坐→站立", text: "从坐位到站立", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q5", dimension: "步行", text: "步行", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q6", dimension: "上肢功能", text: "上肢功能", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q7", dimension: "手部运动", text: "手部运动", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
      { id: "q8", dimension: "手部精细活动", text: "手部精细活动", options: [
        { label: "0分 - 不能完成", score: 0 }, { label: "1分 - 需极大帮助", score: 1 },
        { label: "2分 - 需大量帮助", score: 2 }, { label: "3分 - 需中度帮助", score: 3 },
        { label: "4分 - 需少量帮助", score: 4 }, { label: "5分 - 需监护", score: 5 },
        { label: "6分 - 独立完成", score: 6 },
      ]},
    ],
    grading: {
      max: 48,
      grades: [
        { label: "功能良好(36-48)", min: 36, tone: "good" },
        { label: "中度障碍(18-35)", min: 18, tone: "warn" },
        { label: "严重障碍(0-17)", min: 0, tone: "bad" },
      ],
    },
  },

  rivermead: {
    id: "rivermead",
    questions: [
      { id: "q1", dimension: "基本活动", text: "翻身（从仰卧翻向侧卧）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q2", dimension: "基本活动", text: "坐位（无支撑下坐位≥10秒）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q3", dimension: "基本活动", text: "坐位平衡（无支撑下双臂前伸）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q4", dimension: "基本活动", text: "站立（无支撑站立≥10秒）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q5", dimension: "基本活动", text: "站立平衡（无支撑下转移重心）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q6", dimension: "转移", text: "转移（从床到椅，无帮助）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q7", dimension: "步行", text: "室内步行（无人帮助，可用器具）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q8", dimension: "步行", text: "室外步行（在户外平地行走）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q9", dimension: "步行", text: "上下楼梯（无需他人帮助）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q10", dimension: "高级活动", text: "室外不平地面行走", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q11", dimension: "高级活动", text: "地上拾物", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q12", dimension: "高级活动", text: "跨越台阶", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q13", dimension: "高级活动", text: "上下浴缸", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q14", dimension: "高级活动", text: "坐地板站起", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
      { id: "q15", dimension: "高级活动", text: "跑步（10米内不跛行）", options: [
        { label: "能独立完成", score: 1 }, { label: "不能完成", score: 0 },
      ]},
    ],
    grading: {
      max: 15,
      grades: [
        { label: "活动能力良好(12-15)", min: 12, tone: "good" },
        { label: "活动能力中等(7-11)", min: 7, tone: "warn" },
        { label: "活动能力差(0-6)", min: 0, tone: "bad" },
      ],
    },
  },

  penn: {
    id: "penn",
    questions: [
      { id: "q1", dimension: "痉挛频率", text: "痉挛发作频率", options: [
        { label: "0级 - 无痉挛", score: 0 },
        { label: "1级 - 少于每天1次", score: 1 },
        { label: "2级 - 每天超过1次", score: 2 },
        { label: "3级 - 每小时超过1次", score: 3 },
        { label: "4级 - 每小时超过10次", score: 4 },
      ]},
    ],
    grading: {
      max: 4,
      grades: [
        { label: "无痉挛(0级)", min: 0, tone: "good" },
        { label: "轻度痉挛(1-2级)", min: 1, tone: "warn" },
        { label: "重度痉挛(3-4级)", min: 3, tone: "bad" },
      ],
    },
  },

  clonus: {
    id: "clonus",
    questions: [
      { id: "q1", dimension: "阵挛", text: "踝阵挛分级", options: [
        { label: "0级 - 无阵挛", score: 0 },
        { label: "1级 - 阵挛持续<10秒", score: 1 },
        { label: "2级 - 阵挛持续>10秒", score: 2 },
        { label: "3级 - 持续阵挛，需干预才能停止", score: 3 },
        { label: "4级 - 固定挛缩", score: 4 },
      ]},
    ],
    grading: {
      max: 4,
      grades: [
        { label: "无阵挛(0级)", min: 0, tone: "good" },
        { label: "轻度阵挛(1-2级)", min: 1, tone: "warn" },
        { label: "重度阵挛(3-4级)", min: 3, tone: "bad" },
      ],
    },
  },

  guss: {
    id: "guss",
    questions: [
      { id: "q1", dimension: "间接吞咽", text: "口唇闭合（能否保持嘴唇闭合5秒）", options: [
        { label: "正常闭合", score: 2 },
        { label: "部分闭合", score: 1 },
        { label: "不能闭合", score: 0 },
      ]},
      { id: "q2", dimension: "间接吞咽", text: "咽反射", options: [
        { label: "正常", score: 2 },
        { label: "减弱", score: 1 },
        { label: "消失", score: 0 },
      ]},
      { id: "q3", dimension: "间接吞咽", text: "自主咳嗽", options: [
        { label: "正常", score: 2 },
        { label: "减弱", score: 1 },
        { label: "不能", score: 0 },
      ]},
      { id: "q4", dimension: "间接吞咽", text: "吞咽（空咽）", options: [
        { label: "正常", score: 2 },
        { label: "减弱", score: 1 },
        { label: "不能", score: 0 },
      ]},
      { id: "q5", dimension: "间接吞咽", text: "流口水", options: [
        { label: "无流口水", score: 2 },
        { label: "偶尔流口水", score: 1 },
        { label: "持续流口水", score: 0 },
      ]},
      { id: "q6", dimension: "直接吞咽", text: "半固体吞咽（布丁/酸奶）", options: [
        { label: "安全吞咽，无呛咳", score: 5 },
        { label: "吞咽但有咳嗽/清嗓", score: 3 },
        { label: "不能安全吞咽", score: 0 },
      ]},
      { id: "q7", dimension: "直接吞咽", text: "液体吞咽（水/茶）", options: [
        { label: "安全吞咽，无呛咳", score: 5 },
        { label: "吞咽但有咳嗽/清嗓", score: 3 },
        { label: "不能安全吞咽", score: 0 },
      ]},
    ],
    grading: {
      max: 20,
      grades: [
        { label: "正常(19-20)", min: 19, tone: "good" },
        { label: "轻度障碍(15-18)", min: 15, tone: "good" },
        { label: "中度障碍(10-14)", min: 10, tone: "warn" },
        { label: "严重障碍(0-9)", min: 0, tone: "bad" },
      ],
    },
  },

  "frenchay-dysarthria": {
    id: "frenchay-dysarthria",
    questions: [
      { id: "q1", dimension: "反射", text: "反射（咳嗽、吞咽、流涎反射）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q2", dimension: "呼吸", text: "呼吸（呼吸模式、呼吸控制）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q3", dimension: "唇", text: "唇运动（闭唇、撅唇、唇力度）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q4", dimension: "颌", text: "颌运动（张口、闭合、侧移）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q5", dimension: "软腭", text: "软腭运动（发\u201c啊\u201d时软腭上抬）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q6", dimension: "喉", text: "喉功能（发音时长、音调、音量）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q7", dimension: "舌", text: "舌运动（伸舌、上抬、侧移、交替运动）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
      { id: "q8", dimension: "构音", text: "构音（语速、清晰度、韵律）", options: [
        { label: "正常", score: 4 }, { label: "轻度异常", score: 3 },
        { label: "中度异常", score: 2 }, { label: "严重异常", score: 1 },
        { label: "完全丧失", score: 0 },
      ]},
    ],
    grading: {
      max: 32,
      grades: [
        { label: "正常(28-32)", min: 28, tone: "good" },
        { label: "轻度构音障碍(20-27)", min: 20, tone: "warn" },
        { label: "中度构音障碍(10-19)", min: 10, tone: "warn" },
        { label: "重度构音障碍(0-9)", min: 0, tone: "bad" },
      ],
    },
  },

  "frenchay-ai": {
    id: "frenchay-ai",
    questions: [
      { id: "q1", dimension: "日常生活", text: "做饭", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q2", dimension: "日常生活", text: "洗碗", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q3", dimension: "日常生活", text: "洗衣", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q4", dimension: "日常生活", text: "打扫房间", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q5", dimension: "休闲活动", text: "阅读", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q6", dimension: "社交活动", text: "写信/写邮件", options: [
        { label: "每周/几乎每周", score: 3 }, { label: "每月1-2次", score: 2 },
        { label: "每3个月1次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q7", dimension: "社交活动", text: "打电话", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q8", dimension: "户外活动", text: "走路>15分钟", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q9", dimension: "户外活动", text: "户外走路>15分钟", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q10", dimension: "户外活动", text: "乘公共交通出行", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q11", dimension: "社交活动", text: "购物", options: [
        { label: "每天/几乎每天", score: 3 }, { label: "每周1-2次", score: 2 },
        { label: "每月1-2次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q12", dimension: "社交活动", text: "社交活动（走亲访友）", options: [
        { label: "每周/几乎每周", score: 3 }, { label: "每月1-2次", score: 2 },
        { label: "每3个月1次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q13", dimension: "休闲活动", text: "园艺", options: [
        { label: "每周/几乎每周", score: 3 }, { label: "每月1-2次", score: 2 },
        { label: "每3个月1次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q14", dimension: "户外活动", text: "开车/骑车", options: [
        { label: "每周/几乎每周", score: 3 }, { label: "每月1-2次", score: 2 },
        { label: "每3个月1次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
      { id: "q15", dimension: "户外活动", text: "旅行（外出过夜）", options: [
        { label: "每月/几乎每月", score: 3 }, { label: "每3个月1次", score: 2 },
        { label: "每6个月1次", score: 1 }, { label: "从不/极少", score: 0 },
      ]},
    ],
    grading: {
      max: 45,
      grades: [
        { label: "活动参与良好(30-45)", min: 30, tone: "good" },
        { label: "活动参与中等(15-29)", min: 15, tone: "warn" },
        { label: "活动参与差(0-14)", min: 0, tone: "bad" },
      ],
    },
  },

  "sf-12": {
    id: "sf-12",
    questions: [
      { id: "q1", dimension: "总体健康", text: "总体来说，您的健康状况如何？", options: [
        { label: "极好", score: 5 }, { label: "很好", score: 4 },
        { label: "好", score: 3 }, { label: "一般", score: 2 },
        { label: "差", score: 1 },
      ]},
      { id: "q2", dimension: "躯体功能", text: "中等活动是否受限（如搬桌子、吸尘等）？", options: [
        { label: "是，受限很多", score: 1 }, { label: "是，稍受限", score: 2 },
        { label: "否，不受限", score: 3 },
      ]},
      { id: "q3", dimension: "躯体功能", text: "爬几层楼梯是否受限？", options: [
        { label: "是，受限很多", score: 1 }, { label: "是，稍受限", score: 2 },
        { label: "否，不受限", score: 3 },
      ]},
      { id: "q4", dimension: "心理健康", text: "过去4周，因情绪问题完成的工作或活动是否减少？", options: [
        { label: "是", score: 1 }, { label: "否", score: 2 },
      ]},
      { id: "q5", dimension: "心理健康", text: "过去4周，因情绪问题做事不如平时仔细？", options: [
        { label: "是", score: 1 }, { label: "否", score: 2 },
      ]},
      { id: "q6", dimension: "疼痛", text: "过去4周身体疼痛程度", options: [
        { label: "无疼痛", score: 6 }, { label: "很轻微", score: 5 },
        { label: "轻微", score: 4 }, { label: "中度", score: 3 },
        { label: "严重", score: 2 }, { label: "极严重", score: 1 },
      ]},
      { id: "q7", dimension: "心理健康", text: "过去4周您是否感到安宁平静？", options: [
        { label: "一直", score: 5 }, { label: "大部分时间", score: 4 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 2 },
        { label: "很少", score: 1 },
      ]},
      { id: "q8", dimension: "心理健康", text: "过去4周您是否精力充沛？", options: [
        { label: "一直", score: 5 }, { label: "大部分时间", score: 4 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 2 },
        { label: "很少", score: 1 },
      ]},
      { id: "q9", dimension: "心理健康", text: "过去4周您是否感到消沉或沮丧？", options: [
        { label: "一直", score: 1 }, { label: "大部分时间", score: 2 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 4 },
        { label: "很少", score: 5 },
      ]},
      { id: "q10", dimension: "健康总体评价", text: "过去4周健康是否限制了您的社会活动？", options: [
        { label: "一直", score: 1 }, { label: "大部分时间", score: 2 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 4 },
        { label: "很少", score: 5 },
      ]},
      { id: "q11", dimension: "社会功能", text: "过去4周情绪问题是否干扰了您的社交活动？", options: [
        { label: "一直", score: 1 }, { label: "大部分时间", score: 2 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 4 },
        { label: "很少", score: 5 },
      ]},
      { id: "q12", dimension: "健康总体评价", text: "过去4周健康问题是否影响您的日常活动？", options: [
        { label: "一直", score: 1 }, { label: "大部分时间", score: 2 },
        { label: "相当多时间", score: 3 }, { label: "有时", score: 4 },
        { label: "很少", score: 5 },
      ]},
    ],
    grading: {
      max: 50,
      grades: [
        { label: "生活质量良好(35-50)", min: 35, tone: "good" },
        { label: "生活质量中等(20-34)", min: 20, tone: "warn" },
        { label: "生活质量差(0-19)", min: 0, tone: "bad" },
      ],
    },
  },
};
