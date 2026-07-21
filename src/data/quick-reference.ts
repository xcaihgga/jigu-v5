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
  { muscle: "背阔肌", diseaseCount: 2, diseases: "背阔肌肌腱炎、翼状肩（前锯肌/胸长神经受累）" },
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

export interface ManualTherapy {
  technique: string;
  indication: string;
  precaution: string;
  evidence: string;
  reference: string;
}

export const MANUAL_THERAPIES: ManualTherapy[] = [
  { technique: "关节松动术（Maitland）", indication: "关节活动受限、关节囊紧缩、退行性关节病", precaution: "关节不稳、骨折未愈、严重骨质疏松、局部感染", evidence: "A", reference: "Cochrane 2023; AAOS 指南" },
  { technique: "肌肉能量技术（MET）", indication: "肌张力失衡、关节活动受限、骨盆带功能障碍", precaution: "急性损伤、肌腱断裂、严重疼痛", evidence: "B", reference: "Chaitow 2020; JMMT 系统综述" },
  { technique: "PNF 本体感觉神经促进", indication: "卒中偏瘫、脑外伤、多发性硬化肌力下降", precaution: "骨折未愈、急性炎症、严重骨质疏松", evidence: "A", reference: "Kabat 原理; NeuroRehab 综述 2024" },
  { technique: "神经松动术（神经动力学）", indication: "神经卡压、放射痛、周围神经粘连", precaution: "急性神经损伤、严重感觉缺失、马尾综合征", evidence: "B", reference: "Shacklock 2020; BJSM 系统综述" },
  { technique: "肌筋膜松解（MFR）", indication: "肌筋膜痛综合征、慢性腰痛、纤维肌痛", precaution: "局部感染、开放伤口、严重瘀斑", evidence: "B", reference: "Schleip 2021; PMC 系统综述" },
  { technique: "牵伸技术（静态/PNF/动态）", indication: "肌肉短缩、关节ROM受限、运动前准备", precaution: "急性拉伤、关节不稳、骨折未愈", evidence: "A", reference: "ACSM 指南; Page 2012 系统综述" },
  { technique: "Thera-Band 抗阻训练", indication: "肌力下降、术后康复、老年肌少症", precaution: "急性炎症、严重疼痛、肌腱断裂", evidence: "A", reference: "Page 2012; JOSPT 共识" },
  { technique: "贴扎技术（Kinesio Taping）", indication: "肩袖损伤、髌股疼痛、踝扭伤后稳定", precaution: "皮肤过敏、开放伤口、深静脉血栓", evidence: "B", reference: "Cochrane 2020; JOSPT 综述" },
];

export interface AssessmentStandard {
  name: string;
  range: string;
  interpretation: string;
  usage: string;
}

export const ASSESSMENT_STANDARDS: AssessmentStandard[] = [
  { name: "Brunnstrom 分期（偏瘫）", range: "I–VI 期", interpretation: "I=随意运动消失; II=联合反应; III=共同运动; IV=脱离共同运动; V=分离运动; VI=协调正常", usage: "卒中后上肢/下肢运动功能分期" },
  { name: "FIM 功能独立性评定", range: "1–7 分/项（18项）", interpretation: "1=完全依赖; 2=大量辅助; 3=中等辅助; 4=最小辅助; 5=需监护; 6=修饰独立; 7=完全独立", usage: "综合功能独立性评估（运动+认知）" },
  { name: "MAS 改良Ashworth量表", range: "0–4 级", interpretation: "0=无肌张力增高; 1+=轻微增加; 2=明显增加; 3=严重增高; 4=强直", usage: "痉挛评定（被动牵伸阻力）" },
  { name: "Berg 平衡量表", range: "0–56 分", interpretation: "<20=轮椅; 20–40=辅助步行; 41–56=独立步行; <45=跌倒高风险", usage: "静态/动态平衡功能评估" },
  { name: "10MWT 十米步行测试", range: "m/s", interpretation: "<0.4=受限社区步行; 0.4–0.8=有限社区步行; >0.8=社区步行", usage: "步行速度与功能步行分类" },
  { name: "6MWT 六分钟步行测试", range: "米", interpretation: "COPD: >350m=轻; 200–350=中; <200=重; 心衰: >450m=良", usage: "心肺耐力与功能容量评估" },
  { name: "VAS 视觉模拟评分", range: "0–10 cm", interpretation: "0=无痛; 1–3=轻度; 4–6=中度; 7–10=重度", usage: "疼痛强度主观评定" },
  { name: "MMSE 简易精神状态检查", range: "0–30 分", interpretation: "27–30=正常; 21–26=轻度认知障碍; 10–20=中度; <10=重度", usage: "认知功能筛查（注意文化与教育偏差）" },
];

export interface DecisionTiming {
  condition: string;
  timing: string;
  rationale: string;
  reference: string;
}

export const DECISION_TIMINGS: DecisionTiming[] = [
  { condition: "脑卒中康复介入时机", timing: "发病后 24–48h 生命体征稳定即开始", rationale: "早期活动降低并发症与死亡率，改善功能预后", reference: "AHA/ASA 2024; AVERT Trial" },
  { condition: "肩袖修补术后康复", timing: "术后0–4周被动ROM→4–8周主动辅助→8–12周抗阻", rationale: "腱骨愈合需6–8周，过早主动影响修复", reference: "AAOS 指南; JSES 共识 2023" },
  { condition: "ACL 重建术后重返运动", timing: "术后9–12个月+肌力≥90%+功能测试通过", rationale: "移植物成熟需9–12月，过早RTS再断风险高", reference: "London Consensus 2023; BJSM" },
  { condition: "TKA 术后康复节点", timing: "术后当日负重→2周90°屈曲→6周120°→3月功能恢复", rationale: "早期负重与ROM是功能恢复关键", reference: "AAOS 指南; JBJS 综述" },
  { condition: "THA 术后负重时机", timing: "骨水泥型即刻负重; 生物型4–6周保护负重", rationale: "生物型假体骨长入需保护期", reference: "AAOS 指南; JOA 共识" },
  { condition: "踝外侧扭伤重返运动", timing: "急性期RICE→2–4周本体感觉训练→4–6周功能测试", rationale: "本体感觉恢复是防止复扭关键", reference: "IOC 共识; BJSM 2024" },
  { condition: "下腰痛影像学检查时机", timing: "红旗征(+)/症状>6周→影像; 无红旗征4–6周保守", rationale: "过早影像增加不必要手术与焦虑", reference: "ACP 指南 2023; NICE NG59" },
  { condition: "COPD 肺康复启动时机", timing: "稳定期mMRC≥1或6MWT<400m即启动", rationale: "肺康复减少急性加重，改善QoL与运动耐力", reference: "GOLD 2024; ATS/ERS 共识" },
];

export interface RefModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  count: number;
}

export const REF_MODULES: RefModule[] = [
  { id: "dry-needle", title: "干针与激痛点疗法", icon: "Zap", description: "循证证据、疼痛缓解效果与禁忌证", count: DRY_NEEDLE.length },
  { id: "manual-therapy", title: "手法治疗技术", icon: "Hand", description: "关节松动、MET、PNF、神经松动等8种常用技术", count: MANUAL_THERAPIES.length },
  { id: "assessment-standard", title: "评估标准速查", icon: "ClipboardCheck", description: "Brunnstrom、FIM、MAS、Berg等8个常用量表解读", count: ASSESSMENT_STANDARDS.length },
  { id: "decision-timing", title: "临床决策时机", icon: "Clock", description: "卒中、术后、重返运动等8项关键时机", count: DECISION_TIMINGS.length },
  { id: "evidence-update", title: "循证更新速递", icon: "TrendingUp", description: "8大肌群最新康复证据与临床推荐", count: EVIDENCE_UPDATES.length },
  { id: "region-summary", title: "部位肌肉概览", icon: "MapPin", description: "16个身体部位的肌肉功能、常见损伤与红旗征", count: REGION_SUMMARY.length },
  { id: "quick-ref", title: "肌肉快速参考", icon: "ZapOff", description: "20块核心肌肉的损伤、评估、急救与重返标准", count: QUICK_REF.length },
  { id: "evidence-level", title: "循证等级分布", icon: "Award", description: "OCEBM 证据分级体系", count: EVIDENCE_LEVELS.length },
  { id: "muscle-disease", title: "肌肉-疾病映射", icon: "Activity", description: "47块肌肉与常见疾病对应关系", count: MUSCLE_DISEASE_MAP.length },
];
