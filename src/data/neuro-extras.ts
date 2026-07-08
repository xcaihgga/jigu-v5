// 神经康复数据扩展 — 来源：《神经系统康复数据库_2.1.xlsx》
// 包含：SOAP评估框架 / SCI平面康复目标 / 痉挛管理 / 脑卒中重症 / PD全周期 / Brunnstrom分期

export interface SOAPModule {
  module: string;
  content: string;
  neuroExample: string;
  notes: string;
  icfLink: string;
}

export const SOAP_FRAMEWORK: SOAPModule[] = [
  {
    "module": "S(主观资料)",
    "content": "患者主诉/病史/社会背景：年龄/职业/症状发生发展/既往病史/家族史/当前功能受限的主观感受/康复期望",
    "neuroExample": "脑卒中：\"左侧肢体无力3天，手拿不住筷子，走路拖曳\"；SCI：\"腰部以下没有感觉，想知道还能不能走路\"；PD：\"最近半年走路越来越慢，容易摔倒\"",
    "notes": "问诊需覆盖：症状(部位/性质/程度/时间/加重缓解因素)/ADL受限程度/睡眠/情绪/社会支持/康复目标期望",
    "icfLink": "ICF-参与受限：患者对日常生活和社会参与的自我报告"
  },
  {
    "module": "O(客观资料)",
    "content": "体格检查+量表评定+影像/检验：视诊(畸形/姿势/表情)/触诊/ROM/肌力/肌张力/反射/感觉/协调/平衡/步态/专项评定量表",
    "neuroExample": "脑卒中：NIHSS 8分/Brunnstrom右上肢Ⅲ期手Ⅱ期下肢Ⅳ期/Ashworth右上肢Ⅰ⁺/Berg 35分/Barthel 55分；影像：左侧基底节区脑梗死(MRI-DWI)",
    "notes": "评定顺序：健侧→患侧、主动→被动→抗阻、引起疼痛的动作最后检查、考虑完整运动链上的影响",
    "icfLink": "ICF-身体结构/功能损害：器官水平的客观测量"
  },
  {
    "module": "A(评估与分析)",
    "content": "整合S+O进行功能障碍分析：①主要问题清单(按ICF三层级) ②功能预后判断 ③SMART康复目标设定",
    "neuroExample": "SMART目标示例——近期(4-6周)：\"右上肢Brunnstrom从Ⅲ期→Ⅳ期，实现手触腰\" \"Berg从35分→42分，独立室内步行(监护下)\"；远期(3-6月)：\"Barthel从55分→85分，回归家庭生活\"",
    "notes": "SMART原则：S-具体(不能笼统) M-可度量(量化指标) A-可实现(不过高过低) R-相关性(目标关联) T-有时限(近期以周为单位/远期以月为单位)",
    "icfLink": "ICF三层级：器官(损伤)→个体(活动受限)→社会(参与受限)"
  },
  {
    "module": "P(计划)",
    "content": "PT/OT/ST/心理/辅具等具体方案：训练种类/部位/目的/方法/设备/剂量参数/时长/频次/总次数",
    "neuroExample": "PT：良肢位(卧位2h翻身)/被动ROM(肩肘腕髋膝踝,2次/天)/桥式运动(10秒×10次)/坐位平衡训练(20分钟×2次/天)/FES(腕伸肌,20分钟×1次/天)——每周5天，4周后复评",
    "notes": "备注：需签署康复知情同意书/根据中期评定结果动态调整方案/记录每次治疗反应",
    "icfLink": "ICF-干预目标：改善身体功能→提升活动能力→促进社会参与"
  }
];

export interface SCILevel {
  level: string;
  keyMuscle: string;
  basicGoal: string;
  selfCare: string;
  wheelchair: string;
  walking: string;
  orthosis: string;
  notes: string;
}

export const SCI_LEVELS: SCILevel[] = [
  {
    "level": "C1-C3",
    "keyMuscle": "—(呼吸机依赖)",
    "basicGoal": "维持生命/预防并发症/环境控制",
    "selfCare": "完全不能自理(眼控/头控)",
    "wheelchair": "不能独立",
    "walking": "无",
    "orthosis": "电动轮椅(头控/语音/眼控)+呼吸机+环境控制系统",
    "notes": "呼吸机管理/气道分泌物/压疮极高危/完全依赖护理"
  },
  {
    "level": "C4",
    "keyMuscle": "三角肌/肱二头肌(膈肌部分)",
    "basicGoal": "脱离呼吸机(部分)/环境控制",
    "selfCare": "完全不能自理(头控/语音操作)",
    "wheelchair": "不能独立",
    "walking": "无",
    "orthosis": "电动轮椅(头控/语音)+环境控制+护理床",
    "notes": "膈肌呼吸训练/肺活量监测/压疮预防(2h翻身)/自主神经反射异常"
  },
  {
    "level": "C5",
    "keyMuscle": "肱二头肌/肱桡肌",
    "basicGoal": "桌上动作自立(进食/部分梳洗)",
    "selfCare": "部分自理(进食+面部清洁自助具)",
    "wheelchair": "平地手动轮椅需辅助(电动可独立)",
    "walking": "无",
    "orthosis": "电动/手动轮椅+万用袖带+防滑垫+加粗手柄自助具",
    "notes": "屈肘功能利用/肩关节半脱位预防(上肢悬吊)/自助具适配/肋间肌麻痹"
  },
  {
    "level": "C6",
    "keyMuscle": "腕伸肌(桡侧腕长/短伸肌)",
    "basicGoal": "ADL部分自立(翻身/坐起/部分转移)",
    "selfCare": "部分自理(可独立进食/修饰/上身着装)",
    "wheelchair": "手动轮椅(平地可独立)/电动轮椅",
    "walking": "无",
    "orthosis": "手动/电动轮椅+腕驱动夹+改装餐具+滑板(转移)",
    "notes": "腕驱动抓握(腱固定效应)/30分钟减压/皮肤管理/手控驾驶评估"
  },
  {
    "level": "C7",
    "keyMuscle": "肱三头肌",
    "basicGoal": "ADL基本自立(独立转移/轮椅操作)",
    "selfCare": "大部分自理(转移/ADL大部分独立)",
    "wheelchair": "手动轮椅完全独立",
    "walking": "无",
    "orthosis": "手动轮椅+残疾人专用汽车(手控)+较少自助具",
    "notes": "肱三头肌(支撑/推轮椅/伸肘转移)/15-30分钟减压/社区独立出行"
  },
  {
    "level": "C8-T4",
    "keyMuscle": "指屈肌(C8)/小指外展肌(T1)",
    "basicGoal": "ADL完全自立(轮椅独立)+治疗性站立",
    "selfCare": "完全自理",
    "wheelchair": "轮椅完全独立",
    "walking": "治疗性站立(平行杠内，骨盆长支具+双拐)",
    "orthosis": "轮椅+骨盆长支具+双拐(治疗性站立)",
    "notes": "上肢全部正常/T1-T6躯干稳定增加/T4以上体位性低血压和自主神经反射异常"
  },
  {
    "level": "T5-T8",
    "keyMuscle": "—(上肢正常，躯干控制良好)",
    "basicGoal": "ADL完全自立(轮椅社区独立)+治疗性步行",
    "selfCare": "完全自理",
    "wheelchair": "轮椅社区完全独立",
    "walking": "治疗性步行(KAFO+双拐,耗能>3倍正常)",
    "orthosis": "轮椅+KAFO(长下肢支具)+双拐",
    "notes": "轮椅社区出行/治疗性步行实用性有限/轮椅运动(篮球/竞速)"
  },
  {
    "level": "T9-T12",
    "keyMuscle": "—(腹肌健全，躯干全控制)",
    "basicGoal": "ADL完全自立+治疗性步行(距离更长)",
    "selfCare": "完全自理",
    "wheelchair": "同T5-T8",
    "walking": "治疗性步行(距离更长，KAFO+双拐)",
    "orthosis": "轮椅+KAFO+双拐",
    "notes": "步行距离较T5-T8延长/社区轮椅出行为主/可驾驶手控车"
  },
  {
    "level": "L1-L3",
    "keyMuscle": "髋屈肌(L2)/膝伸肌(L3)",
    "basicGoal": "家庭功能性步行(室内<900m)",
    "selfCare": "完全自理",
    "wheelchair": "轮椅备用(长距离)",
    "walking": "家庭功能性步行(AFO+肘拐,室内<900m)",
    "orthosis": "AFO/KAFO+肘拐+轮椅(长距离)",
    "notes": "上下楼梯困难(需扶手)/膝过伸(步行时)/室外轮椅代步/可驾驶手控车"
  },
  {
    "level": "L4-S1",
    "keyMuscle": "踝背伸肌(L4)/踇长伸肌(L5)/踝跖屈肌(S1)",
    "basicGoal": "社区功能性步行(≥900m,上下楼梯)",
    "selfCare": "完全自理",
    "wheelchair": "无需轮椅(可能)",
    "walking": "社区功能性步行(AFO+手杖或独立,≥900m)",
    "orthosis": "AFO(踝足矫形器)+手杖/肘拐或无辅助",
    "notes": "足下垂/足内翻(步行时)/踝关节不稳/可驾驶普通/改装汽车"
  },
  {
    "level": "马尾综合征",
    "keyMuscle": "—(下运动神经元损伤)",
    "basicGoal": "促进神经再生(约2年)/膀胱肠道功能恢复",
    "selfCare": "取决于恢复程度",
    "wheelchair": "同平面",
    "walking": "神经再生后逐渐恢复",
    "orthosis": "AFO(按需)+电刺激(辅助步行)",
    "notes": "外周神经再生(速度1mm/天)/需约2年恢复期/疼痛管理"
  },
  {
    "level": "脊髓圆锥综合征",
    "keyMuscle": "—(S2-S5)",
    "basicGoal": "恢复膀胱/肠道/下肢反射功能/保留骶反射",
    "selfCare": "取决于损伤程度",
    "wheelchair": "同平面",
    "walking": "按平面",
    "orthosis": "按平面",
    "notes": "保留骶髂反射的重要性/膀胱管理/肠道管理"
  }
];

export interface SpasmManagement {
  disease: string;
  pattern: string;
  assessment: string;
  oralDrug: string;
  injection: string;
  pt: string;
  orthosis: string;
  surgery: string;
  notes: string;
}

export const SPASM_MANAGEMENT: SpasmManagement[] = [
  {
    "disease": "脑卒中-MCA/ACA/深穿支",
    "pattern": "上肢屈肌/下肢伸肌模式(共同运动)",
    "assessment": "Ashworth/Tardieu",
    "oralDrug": "巴氯芬/替扎尼定/地西泮",
    "injection": "肉毒毒素(靶肌：肱二头肌/屈指/腓肠肌/内收肌等)",
    "pt": "牵伸/站立架/减重步行/电刺激/水中运动/机器人",
    "orthosis": "AFO/腕手矫形器/肩吊带(争议)",
    "surgery": "SDR(不适用)/ITB(严重)",
    "notes": "避免过度牵拉(肩半脱位);预防挛缩"
  },
  {
    "disease": "脑卒中-脑桥/延髓/小脑",
    "pattern": "四肢痉挛(脑桥)或局灶(小脑)",
    "assessment": "Ashworth/Tardieu",
    "oralDrug": "巴氯芬/替扎尼定",
    "injection": "肉毒毒素(靶肌)",
    "pt": "被动ROM/牵伸/站立架/水中运动",
    "orthosis": "AFO/轮椅/站立架",
    "surgery": "ITB(严重广泛)",
    "notes": "吞咽障碍者注意体位;脑桥注意呼吸"
  },
  {
    "disease": "脑出血-壳核/丘脑",
    "pattern": "对侧痉挛(内囊受累);丘脑可伴感觉异常性疼痛",
    "assessment": "Ashworth/Tardieu/NRS",
    "oralDrug": "巴氯芬/替扎尼定/加巴喷丁(丘脑痛)",
    "injection": "肉毒毒素/ITB(严重)",
    "pt": "牵伸/站立架/步态训练/FES/水中运动",
    "orthosis": "AFO/腕手/站立架",
    "surgery": "ITB(严重)/骨科(挛缩)",
    "notes": "再出血风险2-4周内谨慎主动训练;丘脑痛优先药物"
  },
  {
    "disease": "脑出血-脑桥/小脑",
    "pattern": "四肢痉挛(脑桥)或躯干/肢体共济失调(小脑)",
    "assessment": "Ashworth/共济评估",
    "oralDrug": "巴氯芬/替扎尼定",
    "injection": "肉毒毒素(局灶)",
    "pt": "被动ROM/牵伸/站立架/平衡训练(小脑)",
    "orthosis": "轮椅/站立架/AFO",
    "surgery": "ITB(脑桥严重)",
    "notes": "脑桥注意呼吸/吞咽;小脑注意平衡防跌倒"
  },
  {
    "disease": "SCI",
    "pattern": "损伤平面以下痉挛(完全性后期;不完全性早期可迟缓)",
    "assessment": "Ashworth/Tardieu",
    "oralDrug": "巴氯芬/替扎尼定/地西泮/加巴喷丁",
    "injection": "肉毒毒素/ITB/神经阻滞",
    "pt": "站立架/倾斜台/被动ROM/牵伸/FES/水中运动",
    "orthosis": "AFO/KAFO/腕手/站立架/轮椅坐垫",
    "surgery": "ITB(严重广泛)/SDR(不适用)",
    "notes": "自主神经反射异常(T6以上);膀胱充盈可加重痉挛"
  },
  {
    "disease": "CP",
    "pattern": "痉挛型最常见;局灶/多灶/广泛;随生长变化",
    "assessment": "Ashworth/GMFCS/MACS",
    "oralDrug": "巴氯芬/替扎尼定/苯二氮卓类(短期)",
    "injection": "肉毒毒素(超声引导，3-6月)/ITB/神经阻滞(酚/酒精)",
    "pt": "牵伸(每日多次)/站立架/步态训练/水中运动/马术/功率自行车",
    "orthosis": "AFO/KAFO/髋外展支具/脊柱矫形器/坐姿保持椅",
    "surgery": "SDR(选择性)/ITB/骨科矫形",
    "notes": "避免过度牵拉(骨骺损伤);生长中痉挛模式变化"
  },
  {
    "disease": "MS",
    "pattern": "局灶/多灶痉挛;下肢内收肌/伸肌/足;上肢屈肌",
    "assessment": "Ashworth/疼痛/功能",
    "oralDrug": "巴氯芬/替扎尼定/加巴喷丁/氯硝西泮",
    "injection": "肉毒毒素(靶肌)",
    "pt": "牵伸/站立架/水中运动/温度管理(Uhthoff避免热)",
    "orthosis": "AFO/助行器/轮椅(疲劳时)",
    "surgery": "ITB(难治性)",
    "notes": "温度管理(Uhthoff现象：热加重症状)"
  },
  {
    "disease": "PD",
    "pattern": "肌强直(齿轮/铅管样);早期可伴轻度痉挛",
    "assessment": "UPDRS肌强直评分",
    "oralDrug": "无特异性抗痉挛药(左旋多巴改善强直)",
    "injection": "肉毒毒素(局部肌张力障碍/流涎)",
    "pt": "牵伸/太极拳/瑜伽/舞蹈/水中运动",
    "orthosis": "无常规矫形器",
    "surgery": "DBS(STN/GPi改善强直)",
    "notes": "左旋多巴可改善PD强直;区分强直与痉挛"
  },
  {
    "disease": "TBI",
    "pattern": "创伤后痉挛(局灶/多灶/广泛);可伴肌张力障碍",
    "assessment": "Ashworth/Tardieu/功能",
    "oralDrug": "巴氯芬/替扎尼定/地西泮",
    "injection": "肉毒毒素(靶肌)/ITB",
    "pt": "牵伸/站立架/被动ROM/水中运动",
    "orthosis": "AFO/腕手/站立架/轮椅",
    "surgery": "ITB(严重)/骨科(挛缩畸形)",
    "notes": "认知/行为障碍影响治疗配合;癫痫共存"
  }
];

export interface StrokePathway {
  stage: string;
  time: string;
  goal: string;
  measures: string;
  criteria: string;
}

export const STROKE_CRITICAL_PATHWAY: StrokePathway[] = [
  {
    "stage": "S5Q=0",
    "time": "不能主动配合",
    "goal": "良肢位摆放/床上被动体位转移/主被动ROM/电动起立床站立",
    "measures": "定时翻身(2h)/良肢位/被动关节活动/NMES",
    "criteria": "胸廓被动放松/气道廓清(体位引流)"
  },
  {
    "stage": "S5Q<3",
    "time": "少量配合",
    "goal": "以上+Fowler体位(30-50°)/床边被动单车/气压治疗",
    "measures": "以上+支具运用/床头抬高30-50°/气压治疗(排除DVT)",
    "criteria": "胸廓扩张训练/主动循环呼吸(ACBT)"
  },
  {
    "stage": "S5Q=3",
    "time": "中度配合",
    "goal": "以上+床上直立坐位20min×3次/天/被动床椅转移/主动ROM+肢体训练3次/天",
    "measures": "以上+被动/主动床边下肢单车",
    "criteria": "腹式呼吸训练/手法辅助咳痰"
  },
  {
    "stage": "S5Q=5",
    "time": "完全配合",
    "goal": "以上+床椅转移/坐位训练/主动+抗阻训练/辅助站立+步行/ADL训练",
    "measures": "以上+主动/抗阻训练/坐位踏车/辅助站立步行",
    "criteria": "呼吸肌抗阻训练/咳嗽训练/脱机训练(SBT-PSV法30-120min)"
  }
];

export interface PDStage {
  stage: string;
  hY: string;
  symptoms: string;
  rehab: string;
  drug: string;
  notes: string;
}

export const PD_PATHWAY: PDStage[] = [
  {
    "stage": "前驱期(0)",
    "hY": "高危筛查期(可长达20年)",
    "symptoms": "嗅觉减退/RBD/便秘/抑郁",
    "rehab": "嗅觉测试(UPSIT)/PSQI/便秘评估/HAMD",
    "drug": "预防性运动(有氧)",
    "notes": "认知训练/生活方式干预"
  },
  {
    "stage": "H-Y 1-1.5",
    "hY": "早期(单侧/双侧无平衡障碍)",
    "symptoms": "轻度运动迟缓/强直/震颤",
    "rehab": "MDS-UPDRS III/九孔柱/TUG",
    "drug": "有氧训练(≥12周,每周3-5d,20-60min/d,60-80%HRmax)+多模式运动(60min×2次/周×12周)",
    "notes": "手功能训练/ADL策略"
  },
  {
    "stage": "H-Y 2-2.5",
    "hY": "早期(双侧,姿势反射保留)",
    "symptoms": "运动迟缓/强直/步态异常",
    "rehab": "以上+Berg/Tinetti/6MWT/10MWT",
    "drug": "以上+抗阻训练(2-3次/周)+平衡训练+太极拳",
    "notes": "以上+IADL训练/驾驶评估"
  },
  {
    "stage": "H-Y 3-4",
    "hY": "中期(姿势反射障碍,独立生活)",
    "symptoms": "姿势平衡障碍/跌倒/吞咽/认知/精神",
    "rehab": "以上+KPPS(疼痛)/VFSS(吞咽)/MoCA-PD痴呆量表/PD-CRS/HAMD",
    "drug": "以上+步态策略训练(听/视觉提示)+转弯训练+防线训练",
    "notes": "以上+防跌倒家居改造+辅助器具"
  },
  {
    "stage": "H-Y 5",
    "hY": "晚期(轮椅/卧床)",
    "symptoms": "严重运动障碍/全面依赖/吞咽/肺炎",
    "rehab": "MDS-UPDRS/改良Barthel/CPOT(疼痛)/Braden(压疮)",
    "drug": "被动ROM/体位管理/呼吸训练/压疮预防",
    "notes": "环境控制/辅助沟通(AAC)/照护技能培训"
  }
];

export interface BrunnstromStage {
  stage: string;
  feature: string;
  upperLimb: string;
  hand: string;
  lowerLimb: string;
  intervention: string;
}

export const BRUNNSTROM_STAGES: BrunnstromStage[] = [
  {
    "stage": "Ⅰ期(迟缓期,1-2周)",
    "feature": "无任何随意运动",
    "upperLimb": "无任何随意运动",
    "hand": "无任何随意运动",
    "lowerLimb": "无/低下",
    "intervention": "良肢位摆放/被动ROM/感觉刺激/预防并发症"
  },
  {
    "stage": "Ⅱ期(联合反应,1-2周)",
    "feature": "仅引出联合反应",
    "upperLimb": "仅引出联合反应(集团屈曲)",
    "hand": "仅引出联合反应",
    "lowerLimb": "开始出现",
    "intervention": "利用联合反应诱发主动运动"
  },
  {
    "stage": "Ⅲ期(共同运动,3-4周)",
    "feature": "屈肌/伸肌共同运动可随意出现",
    "upperLimb": "集团抓握(不能伸展)",
    "hand": "屈肌/伸肌共同运动可随意出现",
    "lowerLimb": "明显增高",
    "intervention": "抑制痉挛/诱发分离运动"
  },
  {
    "stage": "Ⅳ期(部分分离,4-12周)",
    "feature": "手触腰/肩前屈90°/肘伸直",
    "upperLimb": "侧捏(拇指松动)/指间关节小范围伸展",
    "hand": "坐位屈膝>90°/足跟不离地踝背伸",
    "lowerLimb": "下降",
    "intervention": "促进分离运动/加强协调"
  },
  {
    "stage": "Ⅴ期(分离运动,4-6月)",
    "feature": "肩外展90°/前屈120-180°",
    "upperLimb": "对指/柱状抓握/球状抓握",
    "hand": "立位伸髋屈膝/踝背伸",
    "lowerLimb": "逐渐正常",
    "intervention": "精细运动/速度/实用"
  },
  {
    "stage": "Ⅵ期(正常,>6月)",
    "feature": "各关节独立运动(速度/准确度较健侧差)",
    "upperLimb": "全范围精细运动",
    "hand": "各关节独立运动(速度/准确度较健侧差)",
    "lowerLimb": "正常",
    "intervention": "耐力/适应性/回归社会"
  }
];
