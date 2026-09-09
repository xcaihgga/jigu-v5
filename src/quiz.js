/**
 * 知识测验题库（第 4 批）
 *
 * 设计：单文件数据 + 渲染器分离（数据在本文件，渲染在 quiz-ui.js）
 * 三类各约 20 题：量表判读 / 方案选择 / 安全警示
 *
 * 数据忠实原则：题目答案与判读阈值、方案阶段、注意事项均对齐本库
 *   scales.js / scales-extra.js 的 interpretation 与 totalScore；
 *   rehab-protocols.js / pain-protocols.js / protocols-pro.js 的阶段与 cautions；
 *   clinical-reasoning.js 的决策树与案例安全要点；
 *   NICE NG59 / Ottawa Ankle Rules 等已引用指南。
 */
window.quizData = {
  categories: [
    // ═══════════════════ 一、量表判读 ═══════════════════
    {
      id: 'scale',
      name: '量表判读',
      questions: [
        { q: 'VAS 视觉模拟评分 8 分，通常判读为？', options: ['轻度疼痛', '中度疼痛', '重度疼痛', '无痛'], answer: 2, explain: 'VAS 0=无痛、1-3轻度、4-6中度、7-10重度（本库 VAS interpretation）。', source: 'scales.js: VAS' },
        { q: 'NRS 数字评分 5 分，属于哪一级？', options: ['无痛', '轻度疼痛', '中度疼痛', '重度疼痛'], answer: 2, explain: 'NRS 4-6 为中度疼痛，7-10 为重度（本库 NRS interpretation）。', source: 'scales.js: NRS' },
        { q: 'VAS 的最小临床意义变化值（MCID）约为？', options: ['0.5cm', '1cm', '2cm', '5cm'], answer: 2, explain: '本库 VAS evidence.mcid = 2。', source: 'scales.js: VAS' },
        { q: 'Berg 平衡量表（BBS）的满分是？', options: ['30', '40', '56', '100'], answer: 2, explain: 'Berg 共 14 项、每项 0-4 分，满分 56（本库 totalScore=56）。', source: 'scales.js: Berg' },
        { q: 'Berg 评分 12 分，通常提示？', options: ['平衡良好', '平衡一般', '平衡较差，跌倒风险较高', '平衡很差，跌倒风险高，需轮椅代步'], answer: 3, explain: 'Berg 0-20 判读为"平衡很差，跌倒风险高"（本库 Berg interpretation）。', source: 'scales.js: Berg' },
        { q: 'Berg 评分 50 分，判读为？', options: ['平衡很差', '平衡功能一般', '平衡功能良好，可独立行走', '无法判断'], answer: 2, explain: '45-56 判读为"平衡功能良好，跌倒风险低"（本库 Berg interpretation）。', source: 'scales.js: Berg' },
        { q: 'PHQ-9 总分 17 分，判读为？', options: ['轻度抑郁', '中度抑郁', '中重度抑郁', '重度抑郁'], answer: 2, explain: 'PHQ-9：15-19 为中重度抑郁（本库 PHQ-9 interpretation）。', source: 'scales.js: PHQ-9' },
        { q: 'PHQ-9 量表的满分是？', options: ['9', '18', '27', '36'], answer: 2, explain: 'PHQ-9 共 9 项、每项 0-3 分，满分 27（本库 totalScore=27）。', source: 'scales.js: PHQ-9' },
        { q: 'PHQ-9 得分 0-4 分，判读为？', options: ['无抑郁症状', '轻度抑郁', '中度抑郁', '重度抑郁'], answer: 0, explain: '0-4 判读为无抑郁症状（本库 PHQ-9 interpretation）。', source: 'scales.js: PHQ-9' },
        { q: 'GAD-7 量表的满分是？', options: ['7', '14', '21', '28'], answer: 2, explain: 'GAD-7 共 7 项、每项 0-3 分，满分 21（本库 totalScore=21）。', source: 'scales.js: GAD-7' },
        { q: 'NRS 数字评分量表相较 VAS 的优势是？', options: ['无需解释', '更便于老年患者和儿童操作', '可测量所有疼痛类型', '信度更高'], answer: 1, explain: '本库 NRS 描述：0-10 数字评分，更易操作，适合老年患者和儿童。', source: 'scales.js: NRS' },
        { q: 'P4 疼痛强度量表的满分是？', options: ['10', '20', '40', '50'], answer: 2, explain: 'P4 从程度/频率/睡眠/活动 4 个维度各 0-10 分，满分 40（本库 totalScore=40）。', source: 'scales.js: P4' },
        { q: 'Holden 步行功能分级 4 级表示？', options: ['完全独立，适应各种路面', '平地独立行走，上下楼梯需扶手', '需监护或口头指导', '需持续搀扶'], answer: 1, explain: '4 级=平地独立行走、上下楼梯需扶手；5 级才完全独立（本库 Holden interpretation）。', source: 'scales.js: Holden' },
        { q: 'Berg 量表用于评估？', options: ['记忆力', '平衡功能', '肌张力', '疼痛强度'], answer: 1, explain: 'Berg 为 14 项平衡功能评定，评估静态与动态平衡（本库描述）。', source: 'scales.js: Berg' },
        { q: '评估腰痛功能障碍最常用的"金标准"量表是？', options: ['NDI', 'ODI', 'DASH', 'Lysholm'], answer: 1, explain: 'ODI 描述：评估腰痛功能障碍的金标准、10 个维度（本库 scales.js）。', source: 'scales.js: ODI' },
        { q: '评估颈椎功能障碍的"金标准"量表是？', options: ['ODI', 'NDI', 'Berg', 'GAD-7'], answer: 1, explain: 'NDI 描述：评估颈椎功能障碍、颈椎评估金标准（本库 scales.js）。', source: 'scales.js: NDI' },
        { q: 'NDI 颈椎功能障碍指数的满分是？', options: ['30', '40', '50', '60'], answer: 2, explain: 'NDI 共 10 项、每项 0-5 分，满分 50（本库 totalScore=50）。', source: 'scales.js: NDI' },
        { q: 'SF-12 是哪个量表的简化版？', options: ['Berg', 'SF-36', 'PHQ-9', 'GAD-7'], answer: 1, explain: 'SF-12 为 SF-36 简化版，12 项，含躯体健康(PCS)与心理健康(MCS)两维度（本库 scales.js）。', source: 'scales.js: SF-12' },
        { q: 'VAS 与 NRS 的评分结果通常？', options: ['完全无关', '高度相关', '互为替代的评分方式', '差异很大不可用'], answer: 1, explain: '本库 NRS 可靠性：与 VAS 高度相关。', source: 'scales.js: NRS' },
        { q: 'VAS 4 分判读为？', options: ['无痛', '轻度疼痛', '中度疼痛', '重度疼痛'], answer: 2, explain: 'VAS 4-6 为中度疼痛（本库 VAS interpretation）。', source: 'scales.js: VAS' }
      ]
    },
    // ═══════════════════ 二、方案选择 ═══════════════════
    {
      id: 'protocol',
      name: '方案选择',
      questions: [
        { q: 'ACL 前交叉韧带重建术后第一阶段（0-2周）的核心目标，下列哪项正确？', options: ['立即开始跑跳训练', '保护移植物、消肿止痛、获得完全伸直', '做全套重运动测试', '立即弃拐负重'], answer: 1, explain: 'ACL 阶段1目标：保护移植物、消肿止痛、恢复髌骨活动度、获得完全伸直（本库 pt-acl）。', source: 'rehab-protocols.js: pt-acl' },
        { q: 'ACL 术后步行上楼时，正确原则是？', options: ['患侧先上', '健侧先上，下楼患侧先下', '随意上下', '完全禁止上下楼'], answer: 1, explain: '本库 pt-acl 阶段1：上楼健侧先上、下楼患侧先下。', source: 'rehab-protocols.js: pt-acl' },
        { q: 'ACL 阶段1（0-2周）明确禁止的动作是？', options: ['踝泵训练', '股四头肌静力收缩', '主动踢腿伸直', '冰敷'], answer: 2, explain: 'pt-acl 阶段1 cautions：禁止主动踢腿伸直。', source: 'rehab-protocols.js: pt-acl' },
        { q: '踝关节外侧韧带扭伤"炎症期（4-7天）"的首选处理是？', options: ['热敷加重代谢', '直接跑跳', 'RICE（休息/冰敷/加压/抬高）', '手法正骨'], answer: 2, explain: '本库 pain-ankle-sprain 炎症期：RICE 原则。', source: 'pain-protocols.js: pain-ankle-sprain' },
        { q: '踝扭伤炎症期（4-7天）明确禁止的是？', options: ['患侧休息', '冰敷', '热敷和按摩', '抬高患肢'], answer: 2, explain: 'pain-ankle-sprain 炎症期 cautions：禁止热敷和按摩。', source: 'pain-protocols.js: pain-ankle-sprain' },
        { q: '踝扭伤"重建期（3周-12个月）"的康复重点是？', options: ['制动休息', '本体感觉与平衡训练', '静养不打理', '热敷'], answer: 1, explain: '重建期目标：恢复关节稳定性和本体感受（本库 pain-ankle-sprain）。', source: 'pain-protocols.js: pain-ankle-sprain' },
        { q: '肩袖损伤按 ISAKOS 指南的分阶段康复大致分为几期？', options: ['2期', '3期', '4期', '5期'], answer: 2, explain: '本库 pt-rotator-cuff 为 4 阶段恢复；临床推理中"分4阶段恢复"。', source: 'rehab-protocols.js: pt-rotator-cuff' },
        { q: '冻结肩（肩周炎）的康复应以什么为主？', options: ['大重量力量训练', '被动牵拉 + 活动度(ROM)训练', '完全制动', '冲刺训练'], answer: 1, explain: '临床推理：冻结肩以被动牵拉+ROM 为主，不强调力量训练。', source: 'clinical-reasoning.js' },
        { q: '腰痛伴下肢放射痛且直腿抬高试验阳性，通常优先考虑？', options: ['骶髂关节痛', '腰椎间盘突出伴神经根受压', '腰椎活动度不足', '腰椎不稳'], answer: 1, explain: '临床推理决策树：伴放射痛+SLR阳性→按腰椎间盘突出方案。', source: 'clinical-reasoning.js' },
        { q: '骶髂关节痛的康复为何要采用专门方案？', options: ['因为更简单', '其康复重点与腰椎源性不同，需专门稳定训练', '因为需手术', '因为无方案可循'], answer: 1, explain: '临床推理决策树：骶髂关节痛需专门稳定训练。', source: 'clinical-reasoning.js' },
        { q: '肱骨外上髁炎（网球肘）对应的方案是？', options: ['pain-tennis-elbow', 'pain-tka', 'pro-stroke-rehab', 'pain-plantar-fasciitis'], answer: 0, explain: '本库存在疼痛方案 pain-tennis-elbow（网球肘）。', source: 'pain-protocols.js' },
        { q: 'ACL 重建术后要恢复对抗性运动前，必须？', options: ['无任何要求', '通过全套重返运动测试', '仅靠年龄', '完全依赖时间'], answer: 1, explain: 'pt-acl 阶段5 cautions：需通过全套重返运动测试后方可恢复对抗性运动。', source: 'rehab-protocols.js: pt-acl' },
        { q: 'ACL 术后一般在什么条件下可弃拐？', options: ['术后立即', '仅按周数，不看步态', '步态正常、无打软腿时（约4-6周）', '跑跳无痛后'], answer: 2, explain: 'pt-acl 阶段2：步态正常、无打软腿时4-6周弃拐。', source: 'rehab-protocols.js: pt-acl' },
        { q: '髌股关节痛（膝前痛）的康复重点常为？', options: ['腘绳肌单独拉伸', '股四头肌 + 臀肌强化', '完全休息', '踝泵训练'], answer: 1, explain: '临床推理：髌股关节痛以股四头肌+臀肌强化为主。', source: 'clinical-reasoning.js' },
        { q: 'Berg 评分 ≤ 20 分（跌倒高风险）的患者应优先？', options: ['自由行走', '安排平衡/防跌倒管理与保护', '进行冲刺训练', '无需处理'], answer: 1, explain: 'Berg≤20 高跌倒风险；临床推理案例强调严格防跌倒管理、家属陪护移位。', source: 'scales.js + clinical-reasoning.js' },
        { q: '腰椎间盘突出伴神经根病、无马尾症状时，一般先？', options: ['立即手术', '保守康复处理为主', '长期卧床不动', '立即打封闭'], answer: 1, explain: '临床推理案例：无马尾综合征及进行性肌力下降可保守处理，核心稳定+神经松动。', source: 'clinical-reasoning.js' },
        { q: '踝扭伤后反复扭伤，应特别关注？', options: ['韧带松弛程度', '足弓高度', '体重', '鞋码'], answer: 0, explain: 'pain-ankle-sprain 重建期 cautions：反复扭伤需关注韧带松弛程度。', source: 'pain-protocols.js: pain-ankle-sprain' },
        { q: 'ACL 腘绳肌自体肌腱移植者，一般何时开始抗阻的腘绳肌训练？', options: ['术后即开始', '术后6周', '术后12周后', '一辈子不做'], answer: 2, explain: 'pt-acl 阶段3 cautions：腘绳肌自体移植者12周后开始抗阻腘绳肌训练。', source: 'rehab-protocols.js: pt-acl' },
        { q: '偏瘫（脑卒中）患者稳定性差、坐站不稳，优先选择哪类评估/方案处理思路？', options: ['只查不处理', '保护性站位平衡与防跌倒训练', '立即长距离步行', '不做任何训练'], answer: 1, explain: '临床推理脑卒中案例：重点在防跌倒 + 坐位→站位平衡 + 助行器辅助步态。', source: 'clinical-reasoning.js' },
        { q: '足底筋膜炎早期处理思路通常属于哪类？', options: ['急性手术', '疼痛方案：炎症控制+渐进拉伸', '完全制动', '抗阻力冲刺'], answer: 1, explain: '本库存在疼痛方案 pain-plantar-fasciitis，按疼痛方案分期处理。', source: 'pain-protocols.js' }
      ]
    },
    // ═══════════════════ 三、安全警示 ═══════════════════
    {
      id: 'safety',
      name: '安全警示',
      questions: [
        { q: '腰痛患者出现鞍区麻木、大小便障碍、进行性双下肢无力，应？', options: ['门诊继续观察', '立即急诊转诊', '安排理疗', '加大训练量'], answer: 1, explain: '这些是马尾综合征警示，为外科急症，须立即急诊转诊（NICE NG59）。', source: 'NICE NG59' },
        { q: '马尾综合征延误处理的主要风险是？', options: ['无风险', '可能导致永久性神经损伤', '仅疼痛加重', '只影响美观'], answer: 1, explain: '临床推理：马尾综合征延误致永久神经损伤。', source: 'clinical-reasoning.js / NICE NG59' },
        { q: 'ACL 康复第一阶段（0-2周）禁止以下哪项？', options: ['踝泵', '股四头肌静力收缩', '主动踢腿伸直', '冰敷'], answer: 2, explain: '急性期主动踢腿伸直可能牵拉移植/切口，pt-acl 阶段1明确禁止。', source: 'rehab-protocols.js: pt-acl' },
        { q: '踝扭伤急性期（4-7天）禁止？', options: ['冰敷', '休息', '热敷和按摩', '抬高'], answer: 2, explain: '热敷/按摩会加重出血肿，pain-ankle-sprain 炎症期明确禁止。', source: 'pain-protocols.js' },
        { q: '颈椎手法治疗（CMT）急性期通常不做？', options: ['肌肉激活', '正式/大幅关节活动', '健康教育', '姿势矫正'], answer: 1, explain: 'protocol-teaching 阶段0注意：急性期不做关节活动，只激活肌肉。', source: 'protocol-teaching.js: pt-cmt' },
        { q: '常规冷敷（冰敷）每次宜保持在？', options: ['1-2分钟', '15-20分钟', '1小时', '越久越好'], answer: 1, explain: 'ACL 方案：冰敷每次15-20分钟。', source: 'rehab-protocols.js: pt-acl' },
        { q: '急性期训练中疼痛明显加剧或出现放射痛加重，正确做法是？', options: ['坚持加大剂量', '立即停止并评估、必要时退阶', '转为无痛也硬扛', '开始按摩'], answer: 1, explain: 'rehab 方案 cautions：出现明显疼痛/加重应停止并评估，退阶处理。', source: 'rehab/pain-protocols' },
        { q: 'ACL 康复阶段1补充：休息时"膝下垫毛巾卷"被明确？', options: ['鼓励', '禁止', '无所谓', '仅在夜间禁止'], answer: 1, explain: 'pt-acl 阶段1 cautions：禁止膝下垫毛巾卷休息（易致屈曲挛缩）。', source: 'rehab-protocols.js: pt-acl' },
        { q: '踝扭伤后完全不能承重行走时，应？', options: ['继续走', '需考虑X线排除骨折（如Ottawa规则阳性）', '进行跑跳测试', '热敷'], answer: 1, explain: 'Ottawa 踝规则：不能负重或骨性压痛→考虑摄片排除骨折。', source: 'Ottawa Ankle Rules' },
        { q: '训练中突发的"膝关节晃动不实/打软腿"应？', options: ['继续加练', '暂停、评估并考虑韧带/稳定性评估', '跑跳热身', '忽略'], answer: 1, explain: '打软腿/不稳提示神经肌肉控制或韧带稳定性不足，需暂停并评估。', source: 'rehab-protocols.js: pt-acl' },
        { q: 'COPD 康复训练的原则是？', options: ['高强度冲刺', '循序渐进 + 监测呼吸症状，避免过度憋气', '完全禁动', '大重量举重'], answer: 1, explain: '呼吸康复需循序渐进并监测症状（本库 pt-copd）。', source: 'rehab-protocols.js: pt-copd' },
        { q: '全面的重返运动应建立在？', options: ['仅时间满足', '肌力/功能等多项达标并经评估后', '患者想踢就踢', '只看疼痛'], answer: 1, explain: 'ACL 等需肌力双边对称、功能测试通过后方重返（pt-acl）。', source: 'rehab-protocols.js: pt-acl' },
        { q: '颈痛伴手笨拙、下肢痉挛/步态不稳等脊髓压迫表现时，应', options: ['常规训练', '转专科评估，警惕脊髓型颈椎病', '直接手法正骨', '自行拉伸'], answer: 1, explain: '脊髓压迫征象需专科评估；手法治疗需谨慎并排除禁忌（NICE 颈痛内容）。', source: 'NICE NG59 / 临床推理' },
        { q: '湿热疱疹后/神经损伤处进行电刺激或手法前应？', options: ['直接操作', '确认皮感觉与禁忌，必要时评估', '加大刺激', '无视'], answer: 1, explain: '局部感觉障碍或相应禁忌时需谨慎操作，避免加重神经损伤。', source: '康复操作常规' },
        { q: '跌倒高风险（如 Berg 低分）患者训练时，应？', options: ['无人看护自由走', '全程防跌倒管理、家属陪护与低位环境改造', '闭眼加快', '斜坡冲刺'], answer: 1, explain: '临床推理脑卒中案例：Berg低分全程防跌倒管理、家属陪护移位、居家无障碍改造。', source: 'clinical-reasoning.js' },
        { q: '训练后在无新损伤情况下出现持续肿胀/疼痛，应？', options: ['认为是正常反应并加量', '暂停进阶或退阶，评估是否过载', '热敷加量', '加重负荷'], answer: 1, explain: '持续肿胀提示过载，需暂停进阶（如ACL阶段4：出现不稳定/肿大需暂停），退阶处理。', source: 'rehab-protocols.js: pt-acl' },
        { q: '腰痛伴不明原因体重下降、夜间痛、发热等，应？', options: ['继续训练', '警惕红旗征并转诊评估', '只做按摩', '加大核心训练'], answer: 1, explain: '这些为非机械性腰痛红旗征，需警惕肿瘤/感染等，须转诊（NICE NG59 红旗征）。', source: 'NICE NG59' },
        { q: '存在进行性肌力下降/麻木加重的神经根症状，应？', options: ['坚持训练', '及时评估并考虑影像学检查', '静养一年', '热敷'], answer: 1, explain: '神经功能进行性加重提示需进一步评估（临床推理案例随访要点）。', source: 'clinical-reasoning.js' },
        { q: '急性期疼痛训练的基本安全原则是？', options: ['疼痛到极致', '在无痛/轻微可耐受范围内进行', '完全无痛长期不动', '只做过伸'], answer: 1, explain: 'pain-ankle-sprain 等方案：严格在无痛范围内训练。', source: 'pain-protocols.js' },
        { q: '踝扭伤反复发作、明显不稳定，应？', options: ['继续忍', '评估韧带松弛及重建必要性', '加大跳跃', '忽视'], answer: 1, explain: 'pain-ankle-sprain：反复扭伤需关注韧带松弛程度并评估。', source: 'pain-protocols.js: pain-ankle-sprain' }
      ]
    }
  ]
};