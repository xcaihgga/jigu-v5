// MET 肌肉能量技术题库 — 来源：《MET千题题库_做题看板》框架
// 70 道题覆盖：基础理论 / PIR / RI / CR / CRAC / 颈 / 肩 / 肘腕 / 腰 / 髋 / 膝 / 踝

export const Q_MET: any[] = [
  {
    "id": "met-001",
    "type": "single",
    "question": "MET (Muscle Energy Technique) 是什么？",
    "options": {
      "A": "一种手术方法",
      "B": "一种徒手治疗技术",
      "C": "一种药物",
      "D": "一种影像检查"
    },
    "answer": "B",
    "explanation": "MET 是一种徒手治疗技术，由操作者精确控制方向，激活患者肌肉的自主收缩。",
    "category": "pt",
    "subCategory": "MET-基础",
    "difficulty": "easy",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "基础"
    ]
  },
  {
    "id": "met-002",
    "type": "single",
    "question": "MET 技术最早由谁系统提出？",
    "options": {
      "A": "Andrew Taylor Still",
      "B": "Fred Mitchell Sr.",
      "C": "James Cyriax",
      "D": "Vladimir Janda"
    },
    "answer": "B",
    "explanation": "MET 由整骨医师 Fred Mitchell Sr. 于 1950s 系统提出。",
    "category": "pt",
    "subCategory": "MET-历史",
    "difficulty": "medium",
    "source": "Mitchell 1958",
    "tags": [
      "MET",
      "历史"
    ]
  },
  {
    "id": "met-003",
    "type": "single",
    "question": "MET 的核心机制是？",
    "options": {
      "A": "被动拉伸",
      "B": "患者主动肌肉收缩 + 操作者精确控制",
      "C": "电刺激",
      "D": "热敷"
    },
    "answer": "B",
    "explanation": "MET 是患者主动肌肉收缩，操作者施加精确反作用力，从而改变肌肉骨骼系统的功能。",
    "category": "pt",
    "subCategory": "MET-原理",
    "difficulty": "easy",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "原理"
    ]
  },
  {
    "id": "met-004",
    "type": "multi",
    "question": "MET 主要作用包括？",
    "options": {
      "A": "延长短缩的肌肉",
      "B:": "",
      "B": "强化薄弱肌肉",
      "C": "改善关节活动度",
      "D": "减轻疼痛"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "MET 可延长短缩肌肉、强化薄弱肌、改善关节活动度、减轻疼痛。",
    "category": "pt",
    "subCategory": "MET-作用",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "作用"
    ]
  },
  {
    "id": "met-005",
    "type": "single",
    "question": "标准 MET 的等长收缩一般保持多久？",
    "options": {
      "A": "1-3 秒",
      "B": "3-5 秒",
      "C": "5-10 秒",
      "D": "30-60 秒"
    },
    "answer": "B",
    "explanation": "标准 MET 等长收缩保持 3-5 秒（也有流派主张 5-10 秒）。",
    "category": "pt",
    "subCategory": "MET-参数",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "参数"
    ]
  },
  {
    "id": "met-006",
    "type": "single",
    "question": "MET 收缩强度一般为最大自主收缩的？",
    "options": {
      "A": "10%",
      "B": "20-30%",
      "C": "50%",
      "D": "100%"
    },
    "answer": "B",
    "explanation": "MET 收缩强度通常为最大自主收缩的 20-30%（轻柔精确），高级可用 50-80%。",
    "category": "pt",
    "subCategory": "MET-参数",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "参数"
    ]
  },
  {
    "id": "met-007",
    "type": "single",
    "question": "MET 操作中，操作者施加的力应该？",
    "options": {
      "A": "超过患者的力",
      "B": "等于患者的力",
      "C": "精确匹配并引导方向",
      "D": "随机变化"
    },
    "answer": "C",
    "explanation": "操作者施加精确的反作用力，引导收缩方向（离心/向心/等长）。",
    "category": "pt",
    "subCategory": "MET-技术",
    "difficulty": "medium",
    "source": "Mitchell 1958",
    "tags": [
      "MET",
      "技术"
    ]
  },
  {
    "id": "met-008",
    "type": "multi",
    "question": "MET 适用情况包括？",
    "options": {
      "A": "肌肉短缩",
      "B": "关节活动度受限",
      "C": "急性骨折",
      "D": "肌肉无力"
    },
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "MET 适用：肌肉短缩、活动受限、肌力下降；急性骨折禁忌。",
    "category": "pt",
    "subCategory": "MET-适应",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "适应"
    ]
  },
  {
    "id": "met-009",
    "type": "multi",
    "question": "MET 禁忌证包括？",
    "options": {
      "A": "急性炎症",
      "B": "骨折未愈合",
      "C": "术后早期",
      "D": "肌肉短缩"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "MET 禁忌：急性炎症、骨折未愈合、术后早期、严重骨质疏松、肿瘤部位。",
    "category": "pt",
    "subCategory": "MET-禁忌",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "禁忌"
    ]
  },
  {
    "id": "met-010",
    "type": "single",
    "question": "MET 与被动拉伸的核心区别是？",
    "options": {
      "A": "无区别",
      "B": "MET 需要患者主动参与",
      "C": "MET 时间更长",
      "D": "MET 需要仪器"
    },
    "answer": "B",
    "explanation": "MET 核心特征是患者主动肌肉收缩 + 操作者控制，操作后利用放松后效应获得更大拉伸。",
    "category": "pt",
    "subCategory": "MET-原理",
    "difficulty": "easy",
    "source": "Mitchell 1958",
    "tags": [
      "MET",
      "原理"
    ]
  },
  {
    "id": "met-011",
    "type": "single",
    "question": "PIR (Post-Isometric Relaxation) 中文译为？",
    "options": {
      "A": "等长收缩前放松",
      "B": "后等长放松",
      "C": "交互抑制",
      "D": "收缩-放松"
    },
    "answer": "B",
    "explanation": "PIR = Post-Isometric Relaxation = 后等长放松。",
    "category": "pt",
    "subCategory": "PIR",
    "difficulty": "easy",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-012",
    "type": "single",
    "question": "PIR 的原理是？",
    "options": {
      "A": "肌肉疲劳",
      "B": "Golgi 腱器官激活导致肌张力下降",
      "C": "神经抑制",
      "D": "血液供应增加"
    },
    "answer": "B",
    "explanation": "PIR 利用等长收缩后 Golgi 腱器官激活，触发自源性抑制，使肌张力下降。",
    "category": "pt",
    "subCategory": "PIR-原理",
    "difficulty": "medium",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR",
      "GTO"
    ]
  },
  {
    "id": "met-013",
    "type": "single",
    "question": "PIR 操作步骤依次是？",
    "options": {
      "A": "拉伸到位 → 等长收缩 → 放松 → 拉伸到新位置",
      "B": "等长收缩 → 拉伸 → 放松",
      "C": "放松 → 拉伸 → 收缩",
      "D": "随意"
    },
    "answer": "A",
    "explanation": "标准 PIR：被动拉伸到位 → 患者等长抗阻 3-5s → 放松 → 利用放松期被动拉伸到新范围。",
    "category": "pt",
    "subCategory": "PIR-操作",
    "difficulty": "medium",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-014",
    "type": "multi",
    "question": "PIR 的临床应用包括？",
    "options": {
      "A": "肌肉短缩",
      "B": "扳机点",
      "C": "关节囊紧张",
      "D": "骨折"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "PIR 适用：肌肉短缩、肌筋膜扳机点、关节囊紧张；骨折禁忌。",
    "category": "pt",
    "subCategory": "PIR-应用",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-015",
    "type": "single",
    "question": "PIR 操作时，患者的力应该？",
    "options": {
      "A": "向缩短方向用力",
      "B": "向延长方向用力",
      "C": "随意",
      "D": "不发力"
    },
    "answer": "A",
    "explanation": "PIR 中患者朝肌肉缩短方向用力，操作者施加相等反作用力，产生等长收缩。",
    "category": "pt",
    "subCategory": "PIR-操作",
    "difficulty": "medium",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-016",
    "type": "single",
    "question": "PIR 一次治疗通常重复几次？",
    "options": {
      "A": "1 次",
      "B": "2-4 次",
      "C": "10-15 次",
      "D": "30 次以上"
    },
    "answer": "B",
    "explanation": "标准 PIR 治疗重复 2-4 次，每次后获得新的活动范围。",
    "category": "pt",
    "subCategory": "PIR-参数",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-017",
    "type": "single",
    "question": "PIR 中放松期通常需要？",
    "options": {
      "A": "立即拉伸",
      "B": "等待 1-2 秒完全放松后再拉伸",
      "C": "等待 30 秒",
      "D": "无需等待"
    },
    "answer": "B",
    "explanation": "放松期需等待患者完全放松（一般 1-2 秒以上）后再进行新范围的拉伸。",
    "category": "pt",
    "subCategory": "PIR-操作",
    "difficulty": "medium",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-018",
    "type": "single",
    "question": "PIR 与 RI 的核心区别是？",
    "options": {
      "A": "无区别",
      "B": "PIR 收缩方向是缩短，RI 是延长",
      "C": "PIR 不需要患者参与",
      "D": "RI 使用电刺激"
    },
    "answer": "B",
    "explanation": "PIR 患者朝缩短方向用力（自体抑制）；RI 患者朝延长方向用力（交互抑制）。",
    "category": "pt",
    "subCategory": "PIR-对比",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "PIR",
      "RI"
    ]
  },
  {
    "id": "met-019",
    "type": "multi",
    "question": "影响 PIR 效果的因素有？",
    "options": {
      "A": "收缩强度",
      "B": "收缩时间",
      "C": "放松期等待",
      "D": "呼吸配合"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "PIR 效果受收缩强度（20-30% MVC）、收缩时间（3-5s）、放松期等待、呼气配合影响。",
    "category": "pt",
    "subCategory": "PIR-因素",
    "difficulty": "hard",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "PIR"
    ]
  },
  {
    "id": "met-020",
    "type": "single",
    "question": "PIR 中配合呼气的目的是？",
    "options": {
      "A": "增加腹压",
      "B": "呼气时副交感激活 + 肌张力降低",
      "C": "增加收缩力",
      "D": "分散注意力"
    },
    "answer": "B",
    "explanation": "呼气时副交感神经激活，肌张力下降，利于拉伸。",
    "category": "pt",
    "subCategory": "PIR-呼吸",
    "difficulty": "medium",
    "source": "Lewit 1986",
    "tags": [
      "MET",
      "PIR",
      "呼吸"
    ]
  },
  {
    "id": "met-021",
    "type": "single",
    "question": "RI (Reciprocal Inhibition) 中文译为？",
    "options": {
      "A": "后等长放松",
      "B": "交互抑制",
      "C": "协同收缩",
      "D": "主动放松"
    },
    "answer": "B",
    "explanation": "RI = Reciprocal Inhibition = 交互抑制。",
    "category": "pt",
    "subCategory": "RI",
    "difficulty": "easy",
    "source": "Sherrington 1906",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-022",
    "type": "single",
    "question": "RI 的神经机制是？",
    "options": {
      "A": "Golgi 腱器官",
      "B": "Ia 传入抑制拮抗肌（Sherrington 定律）",
      "C": "皮层抑制",
      "D": "交感兴奋"
    },
    "answer": "B",
    "explanation": "RI 利用主动肌收缩时，通过 Ia 传入神经抑制拮抗肌（Sherrington 交互抑制定律）。",
    "category": "pt",
    "subCategory": "RI-原理",
    "difficulty": "medium",
    "source": "Sherrington 1906",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-023",
    "type": "single",
    "question": "在 RI 中，患者收缩的是？",
    "options": {
      "A": "紧张的肌肉（主动肌）",
      "B": "紧张的肌肉的拮抗肌",
      "C": "所有肌肉",
      "D": "不收缩"
    },
    "answer": "B",
    "explanation": "RI 中患者收缩紧张肌肉的拮抗肌，使紧张肌被交互抑制而放松。",
    "category": "pt",
    "subCategory": "RI-操作",
    "difficulty": "medium",
    "source": "Sherrington 1906",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-024",
    "type": "single",
    "question": "RI 适用于？",
    "options": {
      "A": "肌肉短缩伴拮抗肌薄弱",
      "B": "骨折",
      "C": "急性炎症",
      "D": "无菌性骨坏死"
    },
    "answer": "A",
    "explanation": "RI 特别适用于紧张短缩肌 + 薄弱拮抗肌的情况，可同时强化拮抗肌。",
    "category": "pt",
    "subCategory": "RI-适应",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-025",
    "type": "single",
    "question": "RI 操作时，紧张肌是？",
    "options": {
      "A": "主动收缩",
      "B": "被动拉伸",
      "C": "等长抗阻",
      "D": "随意"
    },
    "answer": "B",
    "explanation": "RI 中紧张肌处于被拉伸位置，因其拮抗肌收缩而被交互抑制。",
    "category": "pt",
    "subCategory": "RI-操作",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-026",
    "type": "multi",
    "question": "RI 与 PIR 比较，RI 优势是？",
    "options": {
      "A": "可同时强化拮抗肌",
      "B": "操作更复杂",
      "C": "更适合急慢性疼痛",
      "D": "无禁忌证"
    },
    "answer": [
      "A",
      "C"
    ],
    "explanation": "RI 优势：可同时强化拮抗肌、适合急慢性疼痛患者。",
    "category": "pt",
    "subCategory": "RI-对比",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-027",
    "type": "single",
    "question": "RI 中，紧张肌的张力下降主要由于？",
    "options": {
      "A": "疲劳",
      "B": "Ia 传入神经对紧张肌运动神经元的抑制",
      "C": "温度变化",
      "D": "血液供应中断"
    },
    "answer": "B",
    "explanation": "RI 中拮抗肌收缩，Ia 传入神经抑制紧张肌的运动神经元，导致紧张肌放松。",
    "category": "pt",
    "subCategory": "RI-原理",
    "difficulty": "hard",
    "source": "Sherrington 1906",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-028",
    "type": "single",
    "question": "RI 收缩强度建议？",
    "options": {
      "A": "10%",
      "B": "20-30%",
      "C": "80-100%",
      "D": "无需发力"
    },
    "answer": "B",
    "explanation": "RI 收缩强度建议 20-30% MVC（轻柔精确）。",
    "category": "pt",
    "subCategory": "RI-参数",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "RI"
    ]
  },
  {
    "id": "met-029",
    "type": "single",
    "question": "胸锁乳突肌 MET 治疗时，患者颈部应？",
    "options": {
      "A": "向同侧屈曲 + 对侧旋转用力",
      "B": "向对侧屈曲 + 同侧旋转用力",
      "C": "中立位",
      "D": "后伸用力"
    },
    "answer": "A",
    "explanation": "胸锁乳突肌 MET：患侧屈 + 对侧旋方向用力，操作者施加相等反作用力。",
    "category": "pt",
    "subCategory": "MET-颈",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "颈部",
      "SCM"
    ]
  },
  {
    "id": "met-030",
    "type": "multi",
    "question": "上斜方肌 MET 拉伸到位的标志？",
    "options": {
      "A": "颈侧屈 + 同侧屈 + 对侧旋",
      "B": "颈侧屈 + 对侧屈",
      "C": "肩胛上提",
      "D": "颈后伸"
    },
    "answer": [
      "A",
      "B"
    ],
    "explanation": "上斜方肌 MET：拉伸到对侧屈 + 同侧旋位（部分学派加同侧屈）。",
    "category": "pt",
    "subCategory": "MET-颈",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "颈部",
      "上斜方肌"
    ]
  },
  {
    "id": "met-031",
    "type": "single",
    "question": "颈长肌 / 头长肌 MET 主要用于？",
    "options": {
      "A": "颈深屈肌强化",
      "B": "颈浅屈肌强化",
      "C": "颈伸展",
      "D": "肩胛活动"
    },
    "answer": "A",
    "explanation": "颈深屈肌 MET 主要用于强化颈长肌、头长肌（颈椎前凸矫正、颈深稳定）。",
    "category": "pt",
    "subCategory": "MET-颈深",
    "difficulty": "medium",
    "source": "Jull 2008",
    "tags": [
      "MET",
      "颈部",
      "深屈肌"
    ]
  },
  {
    "id": "met-032",
    "type": "multi",
    "question": "颈椎 MET 禁忌证包括？",
    "options": {
      "A": "急性挥鞭伤",
      "B": "椎动脉供血不足",
      "C": "颈椎不稳",
      "D": "颈肌筋膜炎"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "颈椎 MET 禁忌：急性挥鞭伤、椎动脉供血不足、颈椎不稳、脊髓型颈椎病。",
    "category": "pt",
    "subCategory": "MET-颈",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "颈部",
      "禁忌"
    ]
  },
  {
    "id": "met-033",
    "type": "single",
    "question": "枕骨下肌群 MET 主要缓解？",
    "options": {
      "A": "紧张性头痛",
      "B": "网球肘",
      "C": "腰痛",
      "D": "膝痛"
    },
    "answer": "A",
    "explanation": "枕骨下肌群 MET 用于缓解紧张性头痛、颈源性头痛、寰枕关节活动受限。",
    "category": "pt",
    "subCategory": "MET-颈",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "颈部",
      "头痛"
    ]
  },
  {
    "id": "met-034",
    "type": "single",
    "question": "肩胛提肌 MET 的方向？",
    "options": {
      "A": "颈同侧屈 + 同侧旋 + 肩胛下压用力",
      "B": "颈对侧屈 + 对侧旋",
      "C": "中立",
      "D": "全范围活动"
    },
    "answer": "A",
    "explanation": "肩胛提肌 MET：颈同侧屈 + 同侧旋 + 肩胛下压（远离耳）方向用力。",
    "category": "pt",
    "subCategory": "MET-颈",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "颈部",
      "肩胛提肌"
    ]
  },
  {
    "id": "met-035",
    "type": "single",
    "question": "胸小肌 MET 治疗时，肩胛应向哪个方向用力？",
    "options": {
      "A": "前倾 / 下回旋",
      "B": "后倾 / 上回旋",
      "C": "中立",
      "D": "上提"
    },
    "answer": "B",
    "explanation": "胸小肌 MET：肩胛朝后倾 + 上回旋方向用力（牵拉胸小肌到拉伸位）。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "肩部",
      "胸小肌"
    ]
  },
  {
    "id": "met-036",
    "type": "single",
    "question": "胸大肌 MET 操作时，肩应？",
    "options": {
      "A": "外展 + 外旋",
      "B": "前屈 + 内收",
      "C": "后伸",
      "D": "中立"
    },
    "answer": "A",
    "explanation": "胸大肌 MET：肩水平外展 + 外旋到拉伸位，然后朝内收 + 内旋方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "肩部",
      "胸大肌"
    ]
  },
  {
    "id": "met-037",
    "type": "multi",
    "question": "肩袖肌群 MET 适用情况？",
    "options": {
      "A": "肩袖肌腱病",
      "B": "肩峰下撞击",
      "C": "肩袖急性断裂",
      "D": "冻结肩"
    },
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "肩袖肌群 MET 适用：肌腱病、撞击综合征、冻结肩；急性断裂禁忌。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "肩部",
      "肩袖"
    ]
  },
  {
    "id": "met-038",
    "type": "single",
    "question": "冈上肌 MET 收缩方向是？",
    "options": {
      "A": "外展用力",
      "B": "内收用力",
      "C": "外旋用力",
      "D": "内旋用力"
    },
    "answer": "A",
    "explanation": "冈上肌 MET：肩外展位，向外展方向等长用力。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "肩部",
      "冈上肌"
    ]
  },
  {
    "id": "met-039",
    "type": "single",
    "question": "肩胛下肌 MET 的收缩方向？",
    "options": {
      "A": "内旋用力",
      "B": "外旋用力",
      "C": "外展",
      "D": "后伸"
    },
    "answer": "A",
    "explanation": "肩胛下肌 MET：肩外旋位（拉伸位），向内旋方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "肩部",
      "肩胛下肌"
    ]
  },
  {
    "id": "met-040",
    "type": "multi",
    "question": "菱形肌 MET 强化可改善？",
    "options": {
      "A": "翼状肩",
      "B": "肩胛骨前倾",
      "C": "圆肩",
      "D": "肩峰撞击"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "菱形肌 MET 强化可改善翼状肩、肩胛前倾、圆肩、肩峰下撞击。",
    "category": "pt",
    "subCategory": "MET-肩",
    "difficulty": "medium",
    "source": "Page 2010",
    "tags": [
      "MET",
      "肩部",
      "菱形肌"
    ]
  },
  {
    "id": "met-041",
    "type": "single",
    "question": "肱二头肌 MET 收缩方向？",
    "options": {
      "A": "屈肘 + 前臂旋后",
      "B": "伸肘",
      "C": "屈腕",
      "D": "伸腕"
    },
    "answer": "A",
    "explanation": "肱二头肌 MET：伸肘 + 前臂旋前到拉伸位，向屈肘 + 前臂旋后方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-肘",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "肘",
      "肱二头肌"
    ]
  },
  {
    "id": "met-042",
    "type": "single",
    "question": "腕伸肌群 MET 主要用于治疗？",
    "options": {
      "A": "网球肘",
      "B": "高尔夫球肘",
      "C": "腕管综合征",
      "D": "肘关节炎"
    },
    "answer": "A",
    "explanation": "腕伸肌群 MET 主要治疗网球肘（外上髁炎）。",
    "category": "pt",
    "subCategory": "MET-肘",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "肘",
      "网球肘"
    ]
  },
  {
    "id": "met-043",
    "type": "single",
    "question": "腕屈肌群 MET 适用于？",
    "options": {
      "A": "高尔夫球肘",
      "B": "网球肘",
      "C": "肩周炎",
      "D": "颈椎病"
    },
    "answer": "A",
    "explanation": "腕屈肌群 MET 适用于高尔夫球肘（内上髁炎）。",
    "category": "pt",
    "subCategory": "MET-肘",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "肘",
      "高尔夫球肘"
    ]
  },
  {
    "id": "met-044",
    "type": "multi",
    "question": "腕管综合征 MET 操作涉及的肌群？",
    "options": {
      "A": "腕屈肌",
      "B": "旋前圆肌",
      "C": "指浅屈肌",
      "D": "腕伸肌"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "腕管综合征 MET：放松腕屈肌、旋前圆肌、指浅屈肌等卡压正中肌。",
    "category": "pt",
    "subCategory": "MET-腕",
    "difficulty": "medium",
    "source": "Sucher 1993",
    "tags": [
      "MET",
      "腕",
      "腕管"
    ]
  },
  {
    "id": "met-045",
    "type": "single",
    "question": "旋前圆肌 MET 收缩方向？",
    "options": {
      "A": "前臂旋前用力",
      "B": "前臂旋后用力",
      "C": "伸腕",
      "D": "屈腕"
    },
    "answer": "A",
    "explanation": "旋前圆肌 MET：前臂旋后到拉伸位，向旋前方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-肘",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "肘",
      "旋前圆肌"
    ]
  },
  {
    "id": "met-046",
    "type": "single",
    "question": "腰方肌 MET 的经典体位是？",
    "options": {
      "A": "侧卧位",
      "B": "俯卧位",
      "C": "仰卧位",
      "D": "坐位"
    },
    "answer": "A",
    "explanation": "腰方肌 MET 经典体位是侧卧位（患侧在上），操作者固定髂嵴与第 12 肋。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "腰部",
      "腰方肌"
    ]
  },
  {
    "id": "met-047",
    "type": "single",
    "question": "腰方肌 MET 收缩方向？",
    "options": {
      "A": "髋上提方向用力",
      "B": "髋下压方向用力",
      "C": "躯干屈曲",
      "D": "中立"
    },
    "answer": "A",
    "explanation": "腰方肌 MET：髋上提（侧屈）方向等长抗阻，操作者施加相等反力。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "腰部",
      "腰方肌"
    ]
  },
  {
    "id": "met-048",
    "type": "multi",
    "question": "腰部 MET 适用情况？",
    "options": {
      "A": "腰肌劳损",
      "B": "腰椎小关节紊乱",
      "C": "椎间盘突出急性期",
      "D": "腰椎活动受限"
    },
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "腰部 MET 适用：腰肌劳损、小关节紊乱、活动受限；椎间盘突出急性期慎用。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "腰部"
    ]
  },
  {
    "id": "met-049",
    "type": "single",
    "question": "竖脊肌 MET 收缩方向？",
    "options": {
      "A": "后伸用力",
      "B": "前屈用力",
      "C": "侧屈",
      "D": "旋转"
    },
    "answer": "A",
    "explanation": "竖脊肌 MET：前屈位到拉伸位，向后伸方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "腰部",
      "竖脊肌"
    ]
  },
  {
    "id": "met-050",
    "type": "multi",
    "question": "腰部 MET 禁忌证？",
    "options": {
      "A": "腰椎骨折",
      "B": "脊髓压迫",
      "C": "椎间盘突出急性期",
      "D": "腰肌劳损"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "腰部 MET 禁忌：骨折、脊髓压迫、突出急性期、感染、肿瘤。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "腰部",
      "禁忌"
    ]
  },
  {
    "id": "met-051",
    "type": "single",
    "question": "髂腰肌 MET 经典体位？",
    "options": {
      "A": "改良 Thomas 试验位",
      "B": "俯卧位",
      "C": "坐位",
      "D": "中立位"
    },
    "answer": "A",
    "explanation": "髂腰肌 MET 经典体位是改良 Thomas 试验位（仰卧，髋伸 + 屈膝）。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "髂腰肌"
    ]
  },
  {
    "id": "met-052",
    "type": "single",
    "question": "髂腰肌 MET 收缩方向？",
    "options": {
      "A": "屈髋方向用力",
      "B": "伸髋方向用力",
      "C": "髋外展",
      "D": "髋内收"
    },
    "answer": "A",
    "explanation": "髂腰肌 MET：髋伸 + 屈膝位（拉伸位），向屈髋方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "髂腰肌"
    ]
  },
  {
    "id": "met-053",
    "type": "multi",
    "question": "多裂肌 MET 强化可改善？",
    "options": {
      "A": "腰椎节段稳定性",
      "B": "慢性腰痛",
      "C": "腰椎活动度过大",
      "D": "急性骨折"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "多裂肌 MET 强化可改善腰椎节段稳定性、慢性腰痛、活动度过大。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Hodges 2003",
    "tags": [
      "MET",
      "腰部",
      "多裂肌"
    ]
  },
  {
    "id": "met-054",
    "type": "single",
    "question": "髋内收肌群 MET 收缩方向？",
    "options": {
      "A": "内收用力",
      "B": "外展用力",
      "C": "屈髋",
      "D": "伸髋"
    },
    "answer": "A",
    "explanation": "髋内收肌 MET：髋外展位（拉伸位），向内收方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-髋",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "髋",
      "内收肌"
    ]
  },
  {
    "id": "met-055",
    "type": "single",
    "question": "髋外展肌（臀中肌）MET 收缩方向？",
    "options": {
      "A": "外展用力",
      "B": "内收用力",
      "C": "屈髋",
      "D": "伸髋"
    },
    "answer": "A",
    "explanation": "臀中肌 MET：髋内收位（拉伸位），向外展方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-髋",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "髋",
      "臀中肌"
    ]
  },
  {
    "id": "met-056",
    "type": "multi",
    "question": "梨状肌 MET 适用情况？",
    "options": {
      "A": "梨状肌综合征",
      "B": "深部臀肌综合征",
      "C": "髋外旋受限",
      "D": "髋关节置换术后早期"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "梨状肌 MET 适用梨状肌综合征、深部臀肌综合征、髋外旋受限。",
    "category": "pt",
    "subCategory": "MET-髋",
    "difficulty": "medium",
    "source": "Hopayian 2010",
    "tags": [
      "MET",
      "髋",
      "梨状肌"
    ]
  },
  {
    "id": "met-057",
    "type": "single",
    "question": "阔筋膜张肌 MET 收缩方向？",
    "options": {
      "A": "屈髋 + 内收 + 内旋",
      "B": "伸髋 + 外展",
      "C": "外旋",
      "D": "中立"
    },
    "answer": "A",
    "explanation": "阔筋膜张肌 MET：拉伸到伸髋 + 外展 + 外旋位，向屈髋 + 内收 + 内旋方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-髋",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "髋",
      "TFL"
    ]
  },
  {
    "id": "met-058",
    "type": "single",
    "question": "髋屈肌群紧张通常导致？",
    "options": {
      "A": "骨盆前倾",
      "B": "骨盆后倾",
      "C": "无变化",
      "D": "髋外旋"
    },
    "answer": "A",
    "explanation": "髋屈肌（髂腰肌）紧张导致骨盆前倾、腰椎前凸增加。",
    "category": "pt",
    "subCategory": "MET-髋",
    "difficulty": "easy",
    "source": "Janda 1996",
    "tags": [
      "MET",
      "髋",
      "骨盆前倾"
    ]
  },
  {
    "id": "met-059",
    "type": "single",
    "question": "腘绳肌 MET 收缩方向？",
    "options": {
      "A": "屈膝用力",
      "B": "伸膝用力",
      "C": "髋外展",
      "D": "髋内收"
    },
    "answer": "A",
    "explanation": "腘绳肌 MET：伸膝 + 屈髋位（拉伸位），向屈膝方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-膝",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "膝",
      "腘绳肌"
    ]
  },
  {
    "id": "met-060",
    "type": "single",
    "question": "股四头肌 MET 收缩方向？",
    "options": {
      "A": "伸膝用力",
      "B": "屈膝用力",
      "C": "髋外展",
      "D": "髋内收"
    },
    "answer": "A",
    "explanation": "股四头肌 MET：屈膝位（拉伸位），向伸膝方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-膝",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "膝",
      "股四头肌"
    ]
  },
  {
    "id": "met-061",
    "type": "multi",
    "question": "膝关节周围 MET 适用？",
    "options": {
      "A": "髌股关节痛",
      "B": "腘绳肌拉伤",
      "C": "膝关节僵硬",
      "D": "膝急性韧带重建术后"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "膝 MET 适用：PFPS、腘绳肌拉伤、关节僵硬；术后早期禁忌。",
    "category": "pt",
    "subCategory": "MET-膝",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "膝"
    ]
  },
  {
    "id": "met-062",
    "type": "single",
    "question": "腓肠肌 MET 收缩方向？",
    "options": {
      "A": "踝跖屈用力",
      "B": "踝背屈用力",
      "C": "伸膝",
      "D": "屈膝"
    },
    "answer": "A",
    "explanation": "腓肠肌 MET：伸膝 + 踝背屈位（拉伸位），向跖屈方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-膝",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "膝",
      "腓肠肌"
    ]
  },
  {
    "id": "met-063",
    "type": "single",
    "question": "小腿三头肌（腓肠/比目鱼）MET 主要适用？",
    "options": {
      "A": "足背屈受限",
      "B": "踝扭伤",
      "C": "足底筋膜炎",
      "D": "以上都是"
    },
    "answer": "D",
    "explanation": "小腿三头肌 MET 适用足背屈受限、踝扭伤、足底筋膜炎、跟腱问题。",
    "category": "pt",
    "subCategory": "MET-踝",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "踝",
      "小腿"
    ]
  },
  {
    "id": "met-064",
    "type": "multi",
    "question": "胫骨前肌 MET 适用？",
    "options": {
      "A": "足背屈无力",
      "B": "足下垂",
      "C": "胫骨前肌拉伤",
      "D": "跟腱炎"
    },
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "胫骨前肌 MET 适用足背屈无力、足下垂、胫骨前肌拉伤。",
    "category": "pt",
    "subCategory": "MET-踝",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "踝",
      "胫骨前肌"
    ]
  },
  {
    "id": "met-065",
    "type": "single",
    "question": "腓骨肌 MET 收缩方向？",
    "options": {
      "A": "足外翻用力",
      "B": "足内翻用力",
      "C": "跖屈",
      "D": "背屈"
    },
    "answer": "A",
    "explanation": "腓骨肌 MET：足内翻 + 跖屈位（拉伸位），向外翻 + 背屈方向等长抗阻。",
    "category": "pt",
    "subCategory": "MET-踝",
    "difficulty": "medium",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "踝",
      "腓骨肌"
    ]
  },
  {
    "id": "met-066",
    "type": "single",
    "question": "比目鱼肌 MET 区别于腓肠肌的关键是？",
    "options": {
      "A": "屈膝位进行",
      "B": "伸膝位进行",
      "C": "踝背屈",
      "D": "无区别"
    },
    "answer": "A",
    "explanation": "比目鱼肌 MET 在屈膝位进行（因为比目鱼肌不跨膝关节）。",
    "category": "pt",
    "subCategory": "MET-踝",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "踝",
      "比目鱼肌"
    ]
  },
  {
    "id": "met-067",
    "type": "single",
    "question": "CR (Contract-Relax) 与 PIR 的区别？",
    "options": {
      "A": "CR 是等张，PIR 是等长",
      "B": "CR 是离心，PIR 是等长",
      "C": "无区别",
      "D": "CR 是被动"
    },
    "answer": "A",
    "explanation": "CR = 收缩-放松（向心收缩到最大 → 放松 → 拉伸）；PIR = 等长收缩 → 放松 → 拉伸。",
    "category": "pt",
    "subCategory": "MET-高级",
    "difficulty": "hard",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "CR",
      "PIR"
    ]
  },
  {
    "id": "met-068",
    "type": "single",
    "question": "CRAC (Contract-Relax-Agonist-Contract) 与 CR 区别？",
    "options": {
      "A": "CRAC 多一步主动肌收缩",
      "B": "CRAC 是被动",
      "C": "CRAC 无收缩",
      "D": "无区别"
    },
    "answer": "A",
    "explanation": "CRAC = CR 之后，拮抗肌再主动收缩一次，利用 RI 进一步拉伸。",
    "category": "pt",
    "subCategory": "MET-高级",
    "difficulty": "hard",
    "source": "Chaitow 2006",
    "tags": [
      "MET",
      "CRAC"
    ]
  },
  {
    "id": "met-069",
    "type": "multi",
    "question": "MET 治疗的关键原则是？",
    "options": {
      "A": "精确的体位",
      "B": "轻柔的力",
      "C": "患者主动参与",
      "D": "充分放松期"
    },
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "MET 关键原则：精确体位、轻柔力（20-30% MVC）、患者主动、充分放松。",
    "category": "pt",
    "subCategory": "MET-基础",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "原则"
    ]
  },
  {
    "id": "met-070",
    "type": "single",
    "question": "MET 治疗腰方肌时，操作者手应？",
    "options": {
      "A": "一手固定髂嵴，一手推第 12 肋",
      "B": "双手推髂骨",
      "C": "推肩胛",
      "D": "推脊柱"
    },
    "answer": "A",
    "explanation": "腰方肌 MET 经典操作：操作者一手固定髂嵴，另一手稳定第 12 肋。",
    "category": "pt",
    "subCategory": "MET-腰",
    "difficulty": "medium",
    "source": "Greenman 1997",
    "tags": [
      "MET",
      "腰方肌",
      "操作"
    ]
  }
];
