// 疼痛治疗方案题库 — 来源：《疼痛治疗方案.xlsx》
// 覆盖：足底筋膜炎 / 跟腱炎 / 踝扭伤 / 髌股关节痛 / 半月板 / 髋痛 / 腰痛（5 种）/ 肩（2 种）/ 肘（2 种）/ 颈（2 种）

export const Q_PAIN: any[] = [
  {
    "id": "pain-001",
    "type": "single",
    "question": "足底筋膜炎典型表现是？",
    "options": {
      "A": "夜间痛",
      "B": "晨起第一步疼痛",
      "C": "行走后立即缓解",
      "D": "持续灼痛"
    },
    "answer": "B",
    "explanation": "晨起第一步或长时间休息后第一步疼痛是足底筋膜炎典型表现。",
    "category": "musculo",
    "subCategory": "疼痛-足底筋膜炎",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "足底筋膜炎"
    ]
  },
  {
    "id": "pain-002",
    "type": "multi",
    "question": "足底筋膜炎的危险因素有？",
    "options": {
      "A": "超重 / 高 BMI",
      "B": "足弓塌陷",
      "C": "小腿后侧肌肉过紧",
      "D": "扁平足以外其他因素"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "足底筋膜炎危险因素：超重、足弓塌陷、小腿后侧肌肉过紧。",
    "category": "musculo",
    "subCategory": "疼痛-足底筋膜炎",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "足底筋膜炎"
    ]
  },
  {
    "id": "pain-003",
    "type": "single",
    "question": "跟腱炎压痛点位于？",
    "options": {
      "A": "跟骨下方",
      "B": "跟腱止点上方 2-6cm",
      "C": "小腿中段",
      "D": "足底"
    },
    "answer": "B",
    "explanation": "跟腱炎压痛点位于跟腱止点上方 2-6cm 处。",
    "category": "musculo",
    "subCategory": "疼痛-跟腱炎",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "跟腱炎"
    ]
  },
  {
    "id": "pain-004",
    "type": "multi",
    "question": "跟腱炎治疗包括？",
    "options": {
      "A": "离心训练",
      "B": "放松腓肠肌/比目鱼肌",
      "C": "改善足背屈",
      "D": "高冲击训练"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "跟腱炎治疗：离心训练、放松小腿三头肌、改善足背屈，避免高冲击训练。",
    "category": "musculo",
    "subCategory": "疼痛-跟腱炎",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "跟腱炎"
    ]
  },
  {
    "id": "pain-005",
    "type": "single",
    "question": "踝扭伤最常见类型是？",
    "options": {
      "A": "外侧韧带扭伤（足内翻）",
      "B": "内侧韧带扭伤（足外翻）",
      "C": "高位扭伤",
      "D": "胫腓联合扭伤"
    },
    "answer": "A",
    "explanation": "外侧韧带扭伤（足内翻）最常见，约占 85%。",
    "category": "musculo",
    "subCategory": "疼痛-踝扭伤",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "踝扭伤"
    ]
  },
  {
    "id": "pain-006",
    "type": "multi",
    "question": "踝扭伤病理分期包括？",
    "options": {
      "A": "炎症期（4-7 天）",
      "B": "增生期（4-7 天 - 6 周）",
      "C": "重建期（3 周 - 12 个月）",
      "D": "永久期"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "踝扭伤病理三期：炎症期、增生期、重建期。",
    "category": "musculo",
    "subCategory": "疼痛-踝扭伤",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "踝扭伤"
    ]
  },
  {
    "id": "pain-007",
    "type": "single",
    "question": "踝扭伤 RTS 重要测试是？",
    "options": {
      "A": "单腿提踵 20 次",
      "B": "Y-Balance ≥95% 对称",
      "C": "A 和 B 都对",
      "D": "以上都不对"
    },
    "answer": "C",
    "explanation": "踝扭伤 RTS 需单腿提踵 20 次 + Y-Balance ≥95% 对称。",
    "category": "sports",
    "subCategory": "疼痛-踝扭伤",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "踝扭伤",
      "RTS"
    ]
  },
  {
    "id": "pain-008",
    "type": "single",
    "question": "髌股关节痛典型表现？",
    "options": {
      "A": "晨起僵硬",
      "B": "剧院征（久坐起立痛）",
      "C": "夜间抽筋",
      "D": "游走性疼痛"
    },
    "answer": "B",
    "explanation": "剧院征（久坐起立时疼痛）是髌股关节痛典型表现。",
    "category": "musculo",
    "subCategory": "疼痛-PFPS",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "PFPS"
    ]
  },
  {
    "id": "pain-009",
    "type": "multi",
    "question": "髌股关节痛的形成因素？",
    "options": {
      "A": "旋前综合征",
      "B": "膝关节过度屈曲",
      "C": "VMO 弱于 VLO",
      "D": "髋外展肌弱"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "PFPS 形成：旋前、过度屈曲、内外侧肌力不平衡、髋外展肌弱。",
    "category": "musculo",
    "subCategory": "疼痛-PFPS",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "PFPS"
    ]
  },
  {
    "id": "pain-010",
    "type": "single",
    "question": "半月板功能不包括？",
    "options": {
      "A": "缓冲减震",
      "B": "润滑关节",
      "C": "提供本体感觉",
      "D": "屈伸膝关节"
    },
    "answer": "D",
    "explanation": "半月板功能：缓冲减震、润滑关节、本体感觉；屈伸膝关节是交叉韧带和肌肉作用。",
    "category": "anatomy",
    "subCategory": "疼痛-半月板",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "半月板"
    ]
  },
  {
    "id": "pain-011",
    "type": "single",
    "question": "非关节炎性髋关节痛的常见原因是？",
    "options": {
      "A": "FAI（股骨髋臼撞击）",
      "B": "强直性脊柱炎",
      "C": "类风湿",
      "D": "骨坏死"
    },
    "answer": "A",
    "explanation": "FAI（股骨髋臼撞击综合征）是非关节炎性髋痛常见原因。",
    "category": "musculo",
    "subCategory": "疼痛-髋",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "髋痛"
    ]
  },
  {
    "id": "pain-012",
    "type": "multi",
    "question": "非关节炎性髋痛治疗包括？",
    "options": {
      "A": "髋后关节囊松动",
      "B": "髋外旋肌强化",
      "C": "髂腰肌拉伸",
      "D": "股骨头置换"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "非关节炎性髋痛治疗：髋后关节囊松动、外旋肌强化、髂腰肌拉伸；股骨头置换是终末期。",
    "category": "musculo",
    "subCategory": "疼痛-髋",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "髋痛"
    ]
  },
  {
    "id": "pain-013",
    "type": "multi",
    "question": "腰痛伴牵涉痛（骶髂关节）的特征？",
    "options": {
      "A": "骨盆不稳定",
      "B": "骶髂关节对位异常",
      "C": "周围神经肌肉韧带疼痛",
      "D": "骨折"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "骶髂关节源性腰痛：骨盆不稳定 + 关节对位异常 + 周围结构疼痛。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "骶髂"
    ]
  },
  {
    "id": "pain-014",
    "type": "single",
    "question": "腰痛伴全身痛（中枢敏化）持续多久需高度怀疑？",
    "options": {
      "A": "1 周",
      "B": "1 个月",
      "C": "3 个月以上",
      "D": "1 年"
    },
    "answer": "C",
    "explanation": "持续 3 个月以上 + 多部位不符合典型模式，提示中枢敏化。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "中枢敏化"
    ]
  },
  {
    "id": "pain-015",
    "type": "multi",
    "question": "中枢敏化型腰痛治疗应包括？",
    "options": {
      "A": "疼痛教育",
      "B": "分级运动暴露",
      "C": "认知行为治疗",
      "D": "持续休息不动"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "中枢敏化治疗：疼痛教育、分级运动暴露、CBT；持续休息会加重。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "中枢敏化"
    ]
  },
  {
    "id": "pain-016",
    "type": "single",
    "question": "腰椎不稳的临床表现是？",
    "options": {
      "A": "持续剧痛",
      "B": "变换体位时打软、反复发作",
      "C": "发热",
      "D": "夜间痛"
    },
    "answer": "B",
    "explanation": "腰椎不稳典型表现：变换体位打软 + 反复发作 + 早期活动好转。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "不稳"
    ]
  },
  {
    "id": "pain-017",
    "type": "single",
    "question": "腰痛伴放射痛的硬脊膜测试阳性表现？",
    "options": {
      "A": "腰痛缓解",
      "B": "做足背屈时背部发麻",
      "C": "膝反射消失",
      "D": "直腿抬高阴性"
    },
    "answer": "B",
    "explanation": "硬脊膜紧张：坐姿低头弓背做足背屈时背部发麻。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "硬脊膜"
    ]
  },
  {
    "id": "pain-018",
    "type": "multi",
    "question": "椎间盘膨出/突出患者应避免？",
    "options": {
      "A": "过度前屈",
      "B": "过度后仰",
      "C": "椎孔间隙过小者后仰",
      "D": "温和步行"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "椎间盘突出者避免过度前屈和后仰；椎孔间隙过小者更不宜后仰。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "椎间盘"
    ]
  },
  {
    "id": "pain-019",
    "type": "single",
    "question": "肩峰下撞击综合征（肱二头肌长头肌腱炎）的阳性测试？",
    "options": {
      "A": "Speed 试验 / Yergason 试验",
      "B": "Empty Can 试验",
      "C": "Drop Arm 试验",
      "D": "Neer 试验"
    },
    "answer": "A",
    "explanation": "肱二头长头肌腱炎阳性测试：Speed 试验 / Yergason 试验（屈肘抗阻前臂旋后时肩前痛）。",
    "category": "musculo",
    "subCategory": "疼痛-肩",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肩",
      "肱二头肌"
    ]
  },
  {
    "id": "pain-020",
    "type": "single",
    "question": "冈上肌肌腱炎阳性测试？",
    "options": {
      "A": "Empty Can 试验（手臂外展 60° + 水平内收 30° + 大拇指向下 + 抗阻）",
      "B": "Speed 试验",
      "C": "Yergason 试验",
      "D": "Lift-off 试验"
    },
    "answer": "A",
    "explanation": "Empty Can 试验：肩外展 60° + 水平内收 30° + 大拇指向下 + 抗阻时冈上肌痛。",
    "category": "musculo",
    "subCategory": "疼痛-肩",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肩",
      "冈上肌"
    ]
  },
  {
    "id": "pain-021",
    "type": "multi",
    "question": "肩峰下撞击综合征治疗？",
    "options": {
      "A": "肩胛骨稳定训练",
      "B": "肩袖肌群强化",
      "C": "胸小肌拉伸",
      "D": "继续反复过头动作"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "撞击综合征治疗：肩胛稳定、肩袖强化、胸小肌拉伸；应避免反复过头动作。",
    "category": "musculo",
    "subCategory": "疼痛-肩",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肩",
      "撞击"
    ]
  },
  {
    "id": "pain-022",
    "type": "single",
    "question": "网球肘的阳性测试？",
    "options": {
      "A": "伸腕抗阻试验",
      "B": "屈腕抗阻试验",
      "C": "Cozen 试验",
      "D": "A 和 C 都对"
    },
    "answer": "D",
    "explanation": "网球肘：腕伸抗阻痛（Cozen 试验）+ 肱骨外上髁压痛。",
    "category": "musculo",
    "subCategory": "疼痛-肘",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肘",
      "网球肘"
    ]
  },
  {
    "id": "pain-023",
    "type": "multi",
    "question": "网球肘治疗包括？",
    "options": {
      "A": "腕伸肌离心训练（金标准）",
      "B": "前臂放松与拉伸",
      "C": "前臂束带支具",
      "D": "腕屈肌离心训练"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "网球肘治疗：腕伸肌离心训练（金标准）、前臂放松、支具；腕屈肌离心是高尔夫球肘。",
    "category": "musculo",
    "subCategory": "疼痛-肘",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肘",
      "网球肘"
    ]
  },
  {
    "id": "pain-024",
    "type": "single",
    "question": "高尔夫球肘的阳性测试？",
    "options": {
      "A": "伸腕抗阻",
      "B": "屈腕抗阻",
      "C": "外翻应力试验",
      "D": "内翻应力试验"
    },
    "answer": "B",
    "explanation": "高尔夫球肘（内上髁炎）阳性：屈腕抗阻时肱骨内上髁痛。",
    "category": "musculo",
    "subCategory": "疼痛-肘",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肘",
      "高尔夫球肘"
    ]
  },
  {
    "id": "pain-025",
    "type": "multi",
    "question": "颈痛伴放射痛可能卡压的神经？",
    "options": {
      "A": "正中神经",
      "B": "桡神经",
      "C": "尺神经",
      "D": "股神经"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "颈臂放射痛：斜角肌、锁骨下肌、胸小肌紧张可卡压正中、桡、尺神经。",
    "category": "musculo",
    "subCategory": "疼痛-颈",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "颈",
      "放射痛"
    ]
  },
  {
    "id": "pain-026",
    "type": "single",
    "question": "颈痛伴活动度不足的常见原因？",
    "options": {
      "A": "呼吸模式错误",
      "B": "核心不稳",
      "C": "运动模式错误",
      "D": "以上都是"
    },
    "answer": "D",
    "explanation": "颈活动受限常因呼吸模式错误、核心不稳、运动模式错误等综合因素。",
    "category": "musculo",
    "subCategory": "疼痛-颈",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "颈"
    ]
  },
  {
    "id": "pain-027",
    "type": "single",
    "question": "颈深屈肌 MET 强化的目标肌肉是？",
    "options": {
      "A": "胸锁乳突肌",
      "B": "上斜方肌",
      "C": "颈长肌 / 头长肌",
      "D": "肩胛提肌"
    },
    "answer": "C",
    "explanation": "颈深屈肌 MET 主要强化颈长肌和头长肌。",
    "category": "pt",
    "subCategory": "疼痛-颈",
    "difficulty": "medium",
    "source": "Jull 2008",
    "tags": [
      "颈",
      "深屈肌"
    ]
  },
  {
    "id": "pain-028",
    "type": "single",
    "question": "疼痛治疗中『消炎期』应？",
    "options": {
      "A": "立即热敷促进循环",
      "B": "保护 + 抬高 + 加压（PEACE）",
      "C": "立即大强度训练",
      "D": "立即 NSAIDs"
    },
    "answer": "B",
    "explanation": "炎症期应 PEACE：保护、抬高、避免抗炎、加压；避免立即大强度训练。",
    "category": "evidence",
    "subCategory": "疼痛-急性",
    "difficulty": "medium",
    "source": "Dubois 2019",
    "tags": [
      "急性期",
      "PEACE"
    ]
  },
  {
    "id": "pain-029",
    "type": "multi",
    "question": "疼痛治疗方案的核心原则是？",
    "options": {
      "A": "评估 → 治疗 → 预防",
      "B": "精准评估（找准疼痛原因）",
      "C": "整体观（关注运动模式）",
      "D": "个性化（按患者定制）"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "疼痛方案核心：评估→治疗→预防；精准评估、整体观、个性化。",
    "category": "rehab",
    "subCategory": "疼痛-整体",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "疼痛治疗"
    ]
  },
  {
    "id": "pain-030",
    "type": "single",
    "question": "疼痛治疗中『足底筋膜炎』与『跟腱炎』的关键区别是？",
    "options": {
      "A": "部位不同（足底 vs 跟腱）",
      "B": "疼痛时间模式不同",
      "C": "晨起第一步是足底筋膜炎特征",
      "D": "以上都正确"
    },
    "answer": "D",
    "explanation": "足底筋膜炎（足底痛，晨起第一步痛）与跟腱炎（跟腱 2-6cm 痛，运动后加重）关键区别。",
    "category": "musculo",
    "subCategory": "疼痛-鉴别",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "鉴别诊断"
    ]
  },
  {
    "id": "pain-031",
    "type": "single",
    "question": "运动模式错误在颈腰痛中的作用？",
    "options": {
      "A": "次要因素",
      "B": "核心因素之一",
      "C": "无关",
      "D": "只在急性期重要"
    },
    "answer": "B",
    "explanation": "运动模式错误是颈腰痛的核心因素之一，需要在治疗中纠正。",
    "category": "rehab",
    "subCategory": "疼痛-运动模式",
    "difficulty": "medium",
    "source": "Sahrmann 2002",
    "tags": [
      "运动模式"
    ]
  },
  {
    "id": "pain-032",
    "type": "multi",
    "question": "常见疼痛中，哪些与足弓异常相关？",
    "options": {
      "A": "足底筋膜炎",
      "B": "跟腱炎",
      "C": "髌股关节痛",
      "D": "网球肘"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "足弓异常与足底筋膜炎、跟腱炎、髌股关节痛（旋前综合征）相关。",
    "category": "musculo",
    "subCategory": "疼痛-足弓",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "足弓",
      "下肢链"
    ]
  },
  {
    "id": "pain-033",
    "type": "multi",
    "question": "颈肩部疼痛康复应关注？",
    "options": {
      "A": "呼吸模式",
      "B": "核心稳定",
      "C": "胸椎灵活性",
      "D": "颈深屈肌"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "颈肩康复四大支柱：呼吸、核心、胸椎灵活、颈深屈肌。",
    "category": "rehab",
    "subCategory": "疼痛-颈肩",
    "difficulty": "medium",
    "source": "Comerford 2012",
    "tags": [
      "颈肩",
      "整体观"
    ]
  },
  {
    "id": "pain-034",
    "type": "single",
    "question": "腰部核心稳定的『三大肌群』是？",
    "options": {
      "A": "腹横肌、多裂肌、盆底肌",
      "B": "腹直肌、髂腰肌、竖脊肌",
      "C": "腹外斜肌、臀大肌、腘绳肌",
      "D": "膈肌、腹直肌、髂腰肌"
    },
    "answer": "A",
    "explanation": "核心三大稳定肌：腹横肌、多裂肌、盆底肌（加上膈肌形成四方盒）。",
    "category": "anatomy",
    "subCategory": "疼痛-核心",
    "difficulty": "medium",
    "source": "Hodges 2003",
    "tags": [
      "核心"
    ]
  },
  {
    "id": "pain-035",
    "type": "multi",
    "question": "针对疼痛的『运动模式』评估包括？",
    "options": {
      "A": "下蹲（评估下肢链）",
      "B": "过头动作（评估肩链）",
      "C": "体前屈（评估腰链）",
      "D": "站立（评估静态）"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "疼痛的运动模式评估：下蹲、过头动作、体前屈等动态评估。",
    "category": "assessment",
    "subCategory": "疼痛-评估",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "运动模式",
      "评估"
    ]
  },
  {
    "id": "pain-036",
    "type": "single",
    "question": "疼痛治疗中『功能即恢复』的含义是？",
    "options": {
      "A": "止痛即可",
      "B": "恢复功能比单纯止痛更重要",
      "C": "完全休息",
      "D": "只关注结构"
    },
    "answer": "B",
    "explanation": "康复治疗核心：恢复功能比单纯止痛更重要（功能即恢复）。",
    "category": "rehab",
    "subCategory": "疼痛-理念",
    "difficulty": "easy",
    "source": "WHO ICF",
    "tags": [
      "功能",
      "整体观"
    ]
  },
  {
    "id": "pain-037",
    "type": "multi",
    "question": "腰痛患者应避免的『错误动作模式』？",
    "options": {
      "A": "弯腰搬物",
      "B": "久坐不动",
      "C": "突然扭转",
      "D": "温和行走"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "腰痛患者应避免：弯腰搬物、久坐、突然扭转；温和行走是安全的。",
    "category": "rehab",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛",
      "动作模式"
    ]
  },
  {
    "id": "pain-038",
    "type": "single",
    "question": "网球肘的『离心训练』是？",
    "options": {
      "A": "腕伸肌等张离心",
      "B": "腕屈肌离心",
      "C": "前臂旋前离心",
      "D": "伸肘离心"
    },
    "answer": "A",
    "explanation": "网球肘离心训练 = 腕伸肌群在拉长状态下抗重力控制下放（核心治疗）。",
    "category": "rehab",
    "subCategory": "疼痛-肘",
    "difficulty": "medium",
    "source": "Cochrane 2014",
    "tags": [
      "网球肘",
      "离心"
    ]
  },
  {
    "id": "pain-039",
    "type": "multi",
    "question": "颈痛伴放射痛的治疗应？",
    "options": {
      "A": "斜角肌、锁骨下肌、胸小肌放松",
      "B": "颈深屈肌强化",
      "C": "神经松动术",
      "D": "持续被动牵拉"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "颈神经根治疗：肌肉放松 + 颈深屈肌强化 + 神经松动。",
    "category": "rehab",
    "subCategory": "疼痛-颈",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "颈",
      "神经"
    ]
  },
  {
    "id": "pain-040",
    "type": "single",
    "question": "疼痛治疗中『主动康复』的核心是？",
    "options": {
      "A": "被动仪器",
      "B": "患者主动参与训练",
      "C": "长期卧床",
      "D": "仅止痛药"
    },
    "answer": "B",
    "explanation": "主动康复核心：患者主动参与训练，从被动治疗转向主动训练。",
    "category": "rehab",
    "subCategory": "疼痛-康复",
    "difficulty": "easy",
    "source": "WHO ICF",
    "tags": [
      "主动康复"
    ]
  },
  {
    "id": "pain-041",
    "type": "multi",
    "question": "疼痛中『膝关节』相关包括？",
    "options": {
      "A": "髌股关节痛",
      "B": "膝关节韧带扭伤",
      "C": "半月板损伤",
      "D": "髋关节痛"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "膝部相关 3 种：PFPS、韧带扭伤、半月板损伤。",
    "category": "musculo",
    "subCategory": "疼痛-膝",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "膝"
    ]
  },
  {
    "id": "pain-042",
    "type": "multi",
    "question": "疼痛中『腰部』相关包括？",
    "options": {
      "A": "牵涉痛（骶髂）",
      "B": "全身痛（中枢敏化）",
      "C": "活动度不足",
      "D": "协调性障碍（不稳）"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "腰部 5 种：骶髂牵涉痛、中枢敏化、活动度不足、不稳、放射痛。",
    "category": "musculo",
    "subCategory": "疼痛-腰",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "腰痛"
    ]
  },
  {
    "id": "pain-043",
    "type": "multi",
    "question": "疼痛中『颈部』相关包括？",
    "options": {
      "A": "颈痛伴放射痛",
      "B": "颈痛伴活动度不足",
      "C": "颈源性头痛",
      "D": "颈脊髓型"
    },
    "answer": [
      "A",
      "B"
    ],
    "explanation": "颈部 2 种：放射痛 + 活动度不足；颈源性头痛常见但未单列。",
    "category": "musculo",
    "subCategory": "疼痛-颈",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "颈"
    ]
  },
  {
    "id": "pain-044",
    "type": "single",
    "question": "疼痛中『肩部』相关包括？",
    "options": {
      "A": "肩峰下撞击（肱二头肌长头）",
      "B": "肩峰下撞击（冈上肌）",
      "C": "冻结肩",
      "D": "A 和 B 都对"
    },
    "answer": "D",
    "explanation": "肩部 2 种：撞击（肱二头长头）+ 撞击（冈上肌）。",
    "category": "musculo",
    "subCategory": "疼痛-肩",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肩"
    ]
  },
  {
    "id": "pain-045",
    "type": "multi",
    "question": "疼痛中『肘部』相关包括？",
    "options": {
      "A": "网球肘（外上髁炎）",
      "B": "高尔夫球肘（内上髁炎）",
      "C": "肘关节脱位",
      "D": "肘管综合征"
    },
    "answer": [
      "A",
      "B"
    ],
    "explanation": "肘部 2 种：网球肘 + 高尔夫球肘。",
    "category": "musculo",
    "subCategory": "疼痛-肘",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "肘"
    ]
  },
  {
    "id": "pain-046",
    "type": "multi",
    "question": "疼痛中『足踝』相关包括？",
    "options": {
      "A": "足底筋膜炎",
      "B": "跟腱炎",
      "C": "踝扭伤",
      "D": "扁平足/高足弓"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "足踝 5 种：足底筋膜炎、跟腱炎、踝扭伤、扁平足、高足弓（加足背屈受限共 6 种，足底+高足弓+背屈+内外翻细分）。",
    "category": "musculo",
    "subCategory": "疼痛-足踝",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "足踝"
    ]
  },
  {
    "id": "pain-047",
    "type": "single",
    "question": "疼痛治疗中的『红旗征』是指？",
    "options": {
      "A": "普通疼痛",
      "B": "需立即转诊的严重信号",
      "C": "训练强度",
      "D": "热身动作"
    },
    "answer": "B",
    "explanation": "红旗征是需要立即转诊的严重信号（如马尾综合征、骨折、肿瘤、感染等）。",
    "category": "redflag",
    "subCategory": "疼痛-安全",
    "difficulty": "easy",
    "source": "《疼痛治疗方案》",
    "tags": [
      "红旗征"
    ]
  },
  {
    "id": "pain-048",
    "type": "multi",
    "question": "腰痛的红旗征包括？",
    "options": {
      "A": "马尾综合征（鞍区麻木、大小便障碍）",
      "B": "进行性神经症状",
      "C": "不明原因体重减轻",
      "D": "发热"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "腰痛红旗征：马尾综合征、进行性神经症状、体重减轻、发热、感染、肿瘤史。",
    "category": "redflag",
    "subCategory": "疼痛-腰",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "红旗征",
      "腰痛"
    ]
  },
  {
    "id": "pain-049",
    "type": "multi",
    "question": "颈部红旗征包括？",
    "options": {
      "A": "进行性神经症状",
      "B": "发热",
      "C": "脊髓压迫症状",
      "D": "椎动脉供血不足"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "颈部红旗征：进行性神经症状、发热、脊髓压迫、椎动脉供血不足。",
    "category": "redflag",
    "subCategory": "疼痛-颈",
    "difficulty": "medium",
    "source": "《疼痛治疗方案》",
    "tags": [
      "红旗征",
      "颈"
    ]
  }
];
