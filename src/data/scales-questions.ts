export interface Question {
  id: string;
  dimension: string;
  text: string;
  options: { label: string; score: number }[];
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

  phq9: {
    id: "phq9",
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
    ],
    grading: {
      max: 27,
      grades: [
        { label: "无抑郁(0-4)", min: 0, tone: "good" },
        { label: "轻度抑郁(5-9)", min: 5, tone: "warn" },
        { label: "中度抑郁(10-14)", min: 10, tone: "warn" },
        { label: "中重度抑郁(15-19)", min: 15, tone: "bad" },
        { label: "重度抑郁(20-27)", min: 20, tone: "bad" },
      ],
    },
  },

  gad7: {
    id: "gad7",
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
};
