export interface RedFlag {
  system: string;
  flag: string;
  frequency: string;
  muscles: string;
  action: string;
}

export const RED_FLAGS: RedFlag[] = [
  {
    system: "神经",
    flag: "进行性神经症状、麻木、肌萎缩",
    frequency: "6",
    muscles: "胸锁乳突肌、肩胛提肌、拇短展肌、小指展肌、梨状肌、腘绳肌",
    action: "肌电图 + 影像(MRI/CT)",
  },
  {
    system: "血管",
    flag: "单侧小腿肿胀、进行性肿胀",
    frequency: "3",
    muscles: "腓肠肌、肱肌、胫骨前肌",
    action: "急查 D-Dimer / 多普勒超声",
  },
  {
    system: "骨",
    flag: "无法承重、进行性无力、骨擦感",
    frequency: "4",
    muscles: "股四头肌、臀中肌、臀小肌",
    action: "X 线 + MRI",
  },
  {
    system: "感染",
    flag: "发热、进行性红肿热痛",
    frequency: "3",
    muscles: "斜方肌、冈上肌、肛提肌",
    action: "血常规 + 培养,经验性抗生素",
  },
  {
    system: "内脏",
    flag: "腹部膨隆、血尿、腹股沟肿块",
    frequency: "4",
    muscles: "腹直肌、腹内斜肌、股薄肌、腰方肌",
    action: "急腹症评估,腹部 CT",
  },
  {
    system: "胸腔",
    flag: "胸痛放射、气胸血胸、呼吸困难",
    frequency: "3",
    muscles: "胸大肌、肋间肌、膈肌",
    action: "心电图 + 胸片 / 胸部 CT",
  },
  {
    system: "结构",
    flag: "进行性畸形、脱垂",
    frequency: "2",
    muscles: "足底方肌、肛提肌",
    action: "专科评估(骨科 / 妇科)",
  },
];
