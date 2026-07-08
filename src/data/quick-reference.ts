export interface MuscleDisease {
  muscle: string;
  diseaseCount: number;
  diseases: string;
}

export const MUSCLE_DISEASE_MAP: MuscleDisease[] = [
  { muscle: "胸锁乳突肌", diseaseCount: 1, diseases: "斜颈（痉挛性斜颈/先天性斜颈）" },
  { muscle: "斜方肌", diseaseCount: 2, diseases: "颈肌筋膜炎（落枕）、颈源性头痛" },
  { muscle: "肩胛提肌", diseaseCount: 1, diseases: "颈肌筋膜炎（落枕）" },
  { muscle: "三角肌", diseaseCount: 2, diseases: "肩袖损伤（冈上肌/冈下肌/肩胛下肌/小圆肌）、肩袖肌腱病/肩峰下滑囊炎" },
  { muscle: "冈上肌", diseaseCount: 3, diseases: "肩袖损伤（冈上肌/冈下肌/肩胛下肌/小圆肌）、肩袖肌腱病/肩峰下滑囊炎、肩峰下撞击综合征" },
  { muscle: "冈下肌", diseaseCount: 2, diseases: "肩袖损伤（冈上肌/冈下肌/肩胛下肌/小圆肌）、肩袖肌腱病/肩峰下滑囊炎" },
  { muscle: "小圆肌", diseaseCount: 2, diseases: "肩袖损伤（冈上肌/冈下肌/肩胛下肌/小圆肌）、肩袖肌腱病/肩峰下滑囊炎" },
  { muscle: "肩胛下肌", diseaseCount: 2, diseases: "肩袖损伤（冈上肌/冈下肌/肩胛下肌/小圆肌）、肩袖肌腱病/肩峰下滑囊炎" },
  { muscle: "肱二头肌", diseaseCount: 1, diseases: "肱二头肌长头肌腱炎/腱鞘炎" },
  { muscle: "肱三头肌", diseaseCount: 1, diseases: "肱三头肌肌腱炎/撕裂" },
  { muscle: "肱肌", diseaseCount: 1, diseases: "肱骨干骨折" },
  { muscle: "旋前圆肌", diseaseCount: 1, diseases: "桡管综合征（骨间后神经卡压）" },
  { muscle: "旋后肌", diseaseCount: 1, diseases: "桡管综合征（骨间后神经卡压）" },
  { muscle: "桡侧腕屈肌", diseaseCount: 1, diseases: "狭窄性腱鞘炎（扳机指/弹响指）" },
  { muscle: "尺侧腕屈肌", diseaseCount: 2, diseases: "三角纤维软骨复合体损伤（TFCC损伤）、腕管综合征" },
  { muscle: "拇短展肌", diseaseCount: 1, diseases: "腕管综合征" },
  { muscle: "小指展肌", diseaseCount: 1, diseases: "尺神经卡压（Guyon管综合征）" },
  { muscle: "胸大肌", diseaseCount: 1, diseases: "胸锁关节脱位/关节炎" },
  { muscle: "胸小肌", diseaseCount: 1, diseases: "胸廓出口综合征" },
  { muscle: "菱形肌", diseaseCount: 1, diseases: "肩胛骨不稳/翼状肩" },
  { muscle: "竖脊肌", diseaseCount: 1, diseases: "腰肌劳损/腰背部肌筋膜炎" },
  { muscle: "腰方肌", diseaseCount: 1, diseases: "腰肌劳损/腰背部肌筋膜炎" },
  { muscle: "多裂肌", diseaseCount: 2, diseases: "腰肌劳损/腰背部肌筋膜炎、腰椎小关节紊乱/滑膜嵌顿" },
  { muscle: "回旋肌", diseaseCount: 1, diseases: "腰椎小关节紊乱/滑膜嵌顿" },
  { muscle: "臀大肌", diseaseCount: 2, diseases: "臀肌筋膜炎、髋部肌肉拉伤（腘绳肌/内收肌等）" },
  { muscle: "臀中肌", diseaseCount: 3, diseases: "臀肌筋膜炎、髋部肌肉拉伤（腘绳肌/内收肌等）、弹响髋（外侧型）" },
  { muscle: "臀小肌", diseaseCount: 2, diseases: "臀肌筋膜炎、弹响髋（外侧型）" },
  { muscle: "梨状肌", diseaseCount: 1, diseases: "梨状肌综合征" },
  { muscle: "股四头肌", diseaseCount: 4, diseases: "髌股关节疼痛综合征（PFPS/跑步膝）、髌骨软化症、膝关节骨性关节炎（KOA）、前交叉韧带损伤/断裂（ACL）" },
  { muscle: "腘绳肌", diseaseCount: 2, diseases: "髋部肌肉拉伤（腘绳肌/内收肌等）、坐骨神经痛" },
  { muscle: "缝匠肌", diseaseCount: 1, diseases: "髋部肌肉拉伤（腘绳肌/内收肌等）" },
  { muscle: "股薄肌", diseaseCount: 1, diseases: "髋部肌肉拉伤（腘绳肌/内收肌等）" },
  { muscle: "腓肠肌", diseaseCount: 1, diseases: "跟腱断裂/跟腱炎" },
  { muscle: "比目鱼肌", diseaseCount: 1, diseases: "跟腱断裂/跟腱炎" },
  { muscle: "胫骨前肌", diseaseCount: 1, diseases: "胫骨结节骨骺炎（Osgood-Schlatter病）" },
  { muscle: "腓骨长短肌", diseaseCount: 1, diseases: "腓骨肌腱炎/脱位" },
  { muscle: "趾短伸肌", diseaseCount: 1, diseases: "爪形趾/锤状趾" },
  { muscle: "足底方肌", diseaseCount: 1, diseases: "足底筋膜炎/跟骨骨刺" },
  { muscle: "肋间肌", diseaseCount: 2, diseases: "胸背部肌筋膜炎、肋间神经痛" },
  { muscle: "膈肌", diseaseCount: 1, diseases: "胸背部肌筋膜炎" },
  { muscle: "肛提肌", diseaseCount: 1, diseases: "产后骨盆底功能障碍（WAFF运动适应证）" },
  { muscle: "尾骨肌", diseaseCount: 1, diseases: "骶尾部挫伤/尾骨痛" },
  { muscle: "腹直肌", diseaseCount: 1, diseases: "产后骨盆带疼痛（PGP/耻骨联合分离+骶髂紊乱）" },
  { muscle: "腹外斜肌", diseaseCount: 1, diseases: "产后骨盆带疼痛（PGP/耻骨联合分离+骶髂紊乱）" },
  { muscle: "腹内斜肌", diseaseCount: 1, diseases: "产后骨盆带疼痛（PGP/耻骨联合分离+骶髂紊乱）" },
  { muscle: "腹横肌", diseaseCount: 1, diseases: "产后骨盆带疼痛（PGP/耻骨联合分离+骶髂紊乱）" },
  { muscle: "背阔肌", diseaseCount: 0, diseases: "—" },
];

export interface RegionSummary {
  region: string;
  muscleCount: number;
  mainFunction: string;
  commonInjury: string;
  redFlag: string;
}

export const REGION_SUMMARY: RegionSummary[] = [
  { region: "头颈部", muscleCount: 3, mainFunction: "头颈屈曲、旋转、肩胛骨上提、后缩", commonInjury: "紧张性头痛、肌筋膜痛、斜颈、肌肉痉挛", redFlag: "进行性神经症状、发热" },
  { region: "肩部", muscleCount: 5, mainFunction: "肩关节内旋、肩关节外旋", commonInjury: "肌腱炎、撕裂、拉伤、挫伤", redFlag: "进行性无力" },
  { region: "上肢", muscleCount: 3, mainFunction: "肘关节屈曲、肘关节伸展", commonInjury: "肌腱炎、撕裂、拉伤、肌腱炎", redFlag: "进行性肿胀" },
  { region: "前臂", muscleCount: 4, mainFunction: "前臂旋前、腕关节屈曲", commonInjury: "旋前圆肌综合征、肌腱炎、拉伤", redFlag: "进行性无力" },
  { region: "手部", muscleCount: 2, mainFunction: "小指外展、拇指外展", commonInjury: "腕管综合征、尺神经卡压", redFlag: "进行性萎缩" },
  { region: "胸部", muscleCount: 2, mainFunction: "肩关节内收、肩胛骨前倾", commonInjury: "紧张、缩短、拉伤、撕裂", redFlag: "臂丛神经症状" },
  { region: "腹部", muscleCount: 4, mainFunction: "躯干屈曲、躯干侧屈", commonInjury: "薄弱、失活、拉伤、撕裂", redFlag: "腹部膨隆" },
  { region: "背部", muscleCount: 5, mainFunction: "肩胛骨运动、肩胛骨内收", commonInjury: "劳损、无力、急性扭伤", redFlag: "进行性神经症状" },
  { region: "臀部", muscleCount: 4, mainFunction: "髋关节外展、髋关节后伸", commonInjury: "肌腱炎、撕裂、拉伤、挫伤", redFlag: "进行性跛行" },
  { region: "大腿", muscleCount: 4, mainFunction: "膝关节伸展、膝关节屈曲", commonInjury: "拉伤、劳损、拉伤、挫伤", redFlag: "无法承重" },
  { region: "小腿", muscleCount: 4, mainFunction: "足背屈、踝关节跖屈", commonInjury: "肌腱炎、撕裂、劳损、激痛点", redFlag: "进行性肿胀" },
  { region: "足部", muscleCount: 2, mainFunction: "稳定足弓、伸趾", commonInjury: "长时间站立、鞋子过紧", redFlag: "进行性畸形" },
  { region: "胸壁", muscleCount: 1, mainFunction: "呼吸、肋骨运动", commonInjury: "拉伤、劳损", redFlag: "气胸、血胸" },
  { region: "背部深层", muscleCount: 2, mainFunction: "脊柱旋转、脊柱稳定", commonInjury: "小关节紊乱、慢性腰痛", redFlag: "进行性旋转痛" },
  { region: "膈肌", muscleCount: 1, mainFunction: "主要呼吸", commonInjury: "膈肌麻痹、痉挛", redFlag: "进行性呼吸困难" },
  { region: "盆底", muscleCount: 2, mainFunction: "支撑盆腔、支撑尾骨", commonInjury: "尾骨痛、盆底松弛、疼痛", redFlag: "进行性疼痛" },
];

export interface QuickRef {
  muscle: string;
  region: string;
  commonInjury: string;
  keyAssessment: string;
  emergency: string;
  returnStandard: string;
}

export const QUICK_REF: QuickRef[] = [
  { muscle: "胸锁乳突肌", region: "头颈部", commonInjury: "斜颈、肌肉痉挛", keyAssessment: "触诊、活动度", emergency: "休息、冰敷、NSAIDs", returnStandard: "无痛全范围活动" },
  { muscle: "斜方肌", region: "头颈部", commonInjury: "紧张性头痛、肌筋膜痛", keyAssessment: "触诊、肌力测试", emergency: "热敷、按摩、休息", returnStandard: "无痛活动、正常姿势" },
  { muscle: "肩胛提肌", region: "头颈部", commonInjury: "落枕、颈肩痛", keyAssessment: "触诊、活动度", emergency: "休息、冰敷", returnStandard: "无痛活动" },
  { muscle: "三角肌", region: "肩部", commonInjury: "拉伤、挫伤", keyAssessment: "Drop Arm试验、触诊", emergency: "RICE原则", returnStandard: "肌力恢复≥80%" },
  { muscle: "冈上肌", region: "肩部", commonInjury: "肌腱炎、撕裂", keyAssessment: "Empty Can试验、超声", emergency: "休息、悬吊", returnStandard: "无痛外展" },
  { muscle: "冈下肌", region: "肩部", commonInjury: "肌腱炎、撕裂", keyAssessment: "External Rotation Lag Sign", emergency: "休息、冰敷", returnStandard: "肌力对称" },
  { muscle: "小圆肌", region: "肩部", commonInjury: "肌腱炎、撕裂", keyAssessment: "Hornblower's Sign", emergency: "休息、冰敷", returnStandard: "肌力对称" },
  { muscle: "肩胛下肌", region: "肩部", commonInjury: "肌腱炎、撕裂", keyAssessment: "Lift-off试验", emergency: "休息、冰敷", returnStandard: "肌力对称" },
  { muscle: "肱二头肌", region: "上肢", commonInjury: "肌腱炎、撕裂", keyAssessment: "Speed's Test、超声", emergency: "RICE原则", returnStandard: "肌力恢复≥85%" },
  { muscle: "肱三头肌", region: "上肢", commonInjury: "拉伤、肌腱炎", keyAssessment: "Triceps Squeeze Test", emergency: "RICE原则", returnStandard: "肌力对称" },
  { muscle: "肱肌", region: "上肢", commonInjury: "拉伤、挫伤", keyAssessment: "触诊、抗阻测试", emergency: "休息、冰敷", returnStandard: "无痛活动" },
  { muscle: "旋前圆肌", region: "前臂", commonInjury: "旋前圆肌综合征", keyAssessment: "Pronator Compression Test", emergency: "休息、夹板", returnStandard: "无痛活动" },
  { muscle: "旋后肌", region: "前臂", commonInjury: "桡神经卡压", keyAssessment: "Resisted Supination Test", emergency: "休息、夹板", returnStandard: "无痛活动" },
  { muscle: "桡侧腕屈肌", region: "前臂", commonInjury: "肌腱炎、拉伤", keyAssessment: "触诊、抗阻测试", emergency: "休息、夹板", returnStandard: "无痛活动" },
  { muscle: "尺侧腕屈肌", region: "前臂", commonInjury: "肌腱炎、拉伤", keyAssessment: "触诊、抗阻测试", emergency: "休息、夹板", returnStandard: "无痛活动" },
  { muscle: "拇短展肌", region: "手部", commonInjury: "腕管综合征", keyAssessment: "Tinel征、Phalen试验", emergency: "休息、夹板", returnStandard: "肌力恢复" },
  { muscle: "小指展肌", region: "手部", commonInjury: "尺神经卡压", keyAssessment: "Froment征", emergency: "休息、夹板", returnStandard: "肌力恢复" },
  { muscle: "胸大肌", region: "胸部", commonInjury: "拉伤、撕裂", keyAssessment: "胸大肌测试、超声", emergency: "RICE原则", returnStandard: "肌力恢复≥80%" },
  { muscle: "胸小肌", region: "胸部", commonInjury: "紧张、缩短", keyAssessment: "胸小肌紧张测试", emergency: "拉伸、姿势矫正", returnStandard: "正常姿势" },
  { muscle: "腹直肌", region: "腹部", commonInjury: "拉伤、撕裂", keyAssessment: "直腿抬高试验、触诊", emergency: "休息、冰敷", returnStandard: "无痛收缩" },
];

export interface EvidenceUpdate {
  muscleGroup: string;
  keyMuscle: string;
  keyUpdate: string;
  recommendation: string;
  reference: string;
}

export const EVIDENCE_UPDATES: EvidenceUpdate[] = [
  {
    muscleGroup: "肩袖肌群",
    keyMuscle: "冈上/冈下/肩胛下/小圆",
    keyUpdate: "AAOS 指南:非手术治疗对多数部分撕裂有效",
    recommendation: "物理治疗+肩胛节律矫正,2周-数月恢复",
    reference: "StatPearls 2024;MSD Manual;Harvard Health 2024",
  },
  {
    muscleGroup: "腘绳肌",
    keyMuscle: "腘绳肌群",
    keyUpdate: "离心训练+运动链整合,降低复发",
    recommendation: "无痛冲刺+完整训练课,RTS 双侧差异<10%",
    reference: "London Consensus 2023 BJSM 57:278",
  },
  {
    muscleGroup: "梨状肌",
    keyMuscle: "梨状肌",
    keyUpdate: "改称\"深部臀肌综合征(DGS)\",排除性诊断",
    recommendation: "短期休息+拉伸+深层按摩,顽固者肉毒毒素注射",
    reference: "Cureus 2024;StatPearls 2024;MedSci 2024",
  },
  {
    muscleGroup: "股四头肌",
    keyMuscle: "股四头肌",
    keyUpdate: "RTS 需肌力≥90% 对称",
    recommendation: "渐进性离心训练+神经肌肉控制",
    reference: "运动康复共识",
  },
  {
    muscleGroup: "小腿三头肌",
    keyMuscle: "腓肠/比目鱼",
    keyUpdate: "DVT 是关键红旗征;RTS 需提踵 20 次",
    recommendation: "加压、抬高、本体感觉训练,血管化运动",
    reference: "PMC 2024;AAOS",
  },
  {
    muscleGroup: "踝外翻肌",
    keyMuscle: "腓骨长/短肌",
    keyUpdate: "RTS 需单腿跳远≥健侧 90%",
    recommendation: "平衡训练+外翻抗阻+贴扎/护踝",
    reference: "Annals of Medicine 2025",
  },
  {
    muscleGroup: "膈肌/盆底",
    keyMuscle: "膈/肛提/尾骨肌",
    keyUpdate: "呼吸-核心-盆底协同激活是基础",
    recommendation: "腹式呼吸+凯格尔+腹横肌激活",
    reference: "BMJ Open SEM 2024",
  },
  {
    muscleGroup: "背深层稳定肌",
    keyMuscle: "多裂/回旋肌",
    keyUpdate: "慢性腰痛核心肌群失活",
    recommendation: "核心稳定训练+节段性控制",
    reference: "BJSM 系统综述",
  },
];

export interface DryNeedle {
  area: string;
  painRelief: string;
  function: string;
  evidence: string;
  reference: string;
  conclusion: string;
}

export const DRY_NEEDLE: DryNeedle[] = [
  { area: "颈/肩肌筋膜痛", painRelief: "3.5", function: "3", evidence: "3", reference: "Para-Garcia 2022(5 RCT, n=315)", conclusion: "干针+运动短期缓解疼痛,长期功能改善有限" },
  { area: "腰肌筋膜痛", painRelief: "3", function: "2.8", evidence: "3", reference: "Cochrane 框架综述 2023", conclusion: "短期内改善疼痛与功能,需更多高质量研究" },
  { area: "过头运动员肩痛", painRelief: "3.2", function: "2.5", evidence: "2", reference: "PMC 系统综述 2024(6 项)", conclusion: "短期有效,报告偏倚与异质性较高" },
  { area: "下肢触发点(腓肠/比目鱼)", painRelief: "2.5", function: "2", evidence: "2", reference: "Stieven 2023 Meta(5 RCT, n=215)", conclusion: "ES=-1.73,联合拉伸优于单独治疗" },
];

export const DRY_NEEDLE_CONTRAINDICATIONS = [
  "抗凝治疗 / 凝血功能障碍",
  "未控制的糖尿病",
  "感染部位 / 局部皮肤破溃",
  "孕妇特定部位(腰骶、下腹)",
  "严重骨质疏松 / 病理性骨折",
  "心理恐惧 / 针刺晕厥史",
];

export interface EvidenceLevel {
  level: string;
  definition: string;
  ocebm: string;
  count: string;
  ratio: string;
}

export const EVIDENCE_LEVELS: EvidenceLevel[] = [
  { level: "A 级", definition: "高质量证据支持", ocebm: "1a–2b(系统评价 / RCT)", count: "25", ratio: "52.1%" },
  { level: "B 级", definition: "中等证据", ocebm: "2c–3a(队列研究 / 病例对照)", count: "19", ratio: "39.6%" },
  { level: "C 级", definition: "专家共识 / 低质量证据", ocebm: "4–5(病例系列 / 专家意见)", count: "4", ratio: "8.3%" },
];
