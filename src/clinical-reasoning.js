/**
 * 临床推理模块数据（第 3 批）
 *
 * 三个子模块：
 *   1. 鉴别路径 differentials —— 症状如何查体区分
 *   2. 决策树 decisionTrees —— 评估结果 → 推荐方案（关联本库已有方案 id）
 *   3. 案例库 cases —— 完整教学案例（主诉→查体→量表→诊断→方案→随访）
 *
 * 数据忠实与来源原则（重要）：
 *   - 所有量表判读阈值与本库 scales.js/scales-extra.js 的 interpretation 保持一致；
 *   - 所有推荐方案 id 必须是本库 rehabProtocols/painProtocols/protocolsPro 中真实存在的 id；
 *   - 每条内容带 evidenceSource（来源于某指南/量表原文献）。
 */
window.clinicalReasoning = {

  // ═══════════════════ 一、鉴别路径 ═══════════════════
  differentials: [
    {
      id: 'diff-low-back-radiating',
      title: '腰痛伴腿部放射痛：神经根性 vs 非神经根性',
      context: '腰痛伴下肢疼痛/麻木是基层最常遇到的鉴别难点，需区分是神经根受压还是单纯肌筋膜牵涉痛，处理原则完全不同。',
      compareItems: [
        { test: '疼痛分布', a: '沿皮节分布（如L5到足背、S1到足底），边界清晰', b: '分布不沿皮节，范围模糊，多为深部酸胀感', source: 'NICE NG59（2020）' },
        { test: '直腿抬高试验(SLR)', a: '30°-70°阳性，诱发放射痛至膝下', b: '多为阳性但仅诱发腰部牵拉痛，无放射', source: 'caforio 标准查体' },
        { test: '神经张力·股神经牵拉试验', a: '俯卧被动伸髋时大腿前侧放射痛（提示L2-L4）', b: '阴性', source: 'NICE NG59' },
        { test: '皮节感觉减退', a: '可伴感觉减退、肌力下降（伸拇/足背屈）', b: '常无明确皮节感觉障碍', source: 'NICE NG59' },
        { test: '腱反射', a: '膝/踝反射可减弱（L4/S1受累）', b: '多正常', source: '临床查体' }
      ],
      conclusion: '神经根性：建议完善 MRI 明确压迫平面，按本库「腰椎间盘突出」方案分期处理；非神经根性：以姿势矫正+核心稳定训练为主。',
      evidenceSource: 'NICE. Low back pain and sciatica in over 16s: assessment and management. NG59. 2020（2023 更新）'
    },
    {
      id: 'diff-shoulder-pain',
      title: '肩痛：肩袖损伤 vs 肩峰撞击 vs 肩周炎（冻结肩）',
      context: '肩痛病因多样，主动/被动活动度对比 + 特异性查体是分区关键。',
      compareItems: [
        { test: '主动vs被动活动度', a: '主动受限为主，被动多接近正常（疼痛限制）', b: '主动、被动均受限且进行性加重', source: 'ISAKOS 指南' },
        { test: '疼痛弧(60°-120°)', a: '外展60°-120°痛，超出范围痛缓解', b: '全程疼痛，终末角度显著', source: 'ISAKOS 指南' },
        { test: 'Neer撞击试验', a: '阳性（被动前屈内旋诱发疼痛）', b: '可阴性', source: 'ISAKOS 指南' },
        { test: 'Jobe空罐试验', a: '阳性（提示冈上肌受累）', b: '多阴性', source: '临床查体' },
        { test: '病程特点', a: '体查诱发性疼痛为主', b: '夜间静息痛、进行性僵硬', source: '临床' }
      ],
      conclusion: '撞击/肩袖损伤：急性期按「肩袖损伤」方案制动+被动活动→强化；冻结肩：以被动牵拉+ROM为主，不强调力量训练。',
      evidenceSource: 'ISAKOS 2025 肩袖损伤指南（本库 rehab-protocols 引用）'
    },
    {
      id: 'diff-knee-swelling',
      title: '急性膝肿痛：创伤性积液 vs 膝关节血肿 vs 反应性积液',
      context: '急性膝损伤后肿胀的性质与时间线能快速区分主要结构损伤风险。',
      compareItems: [
        { test: '肿胀出现时间', a: '伤后立即明显肿胀（提示关节内血肿→韧带/骨折）', b: '伤后6-24h逐渐肿（反应性积液）', source: '骨科查体' },
        { test: '浮髌试验', a: '多阳性（大量积液）', b: '轻中度，可阴性', source: '临床查体' },
        { test: '麦氏试验(旋转)', a: '可阳性（提示半月板损伤）', b: '通常阴性', source: '临床查体' },
        { test: '抽屉/轴移试验', a: '可提示前交叉韧带损伤', b: '阴性', source: 'Lachman 试验' },
        { test: '制动效果', a: '血肿需制动+冰敷，加重慢', b: '反应性积液休息可缓解', source: '临床' }
      ],
      conclusion: '伤后立即肿+浮髌阳性：高度警惕韧带/半月板/骨折，24h内冰敷并考虑骨科/运动医学科评估，按本库「ACL」「半月板」等方案处理。',
      evidenceSource: '美国骨科医师学会(AAOS) 膝关节损伤评估要点'
    },
    {
      id: 'diff-neck-arm-pain',
      title: '颈痛伴上肢放射：颈椎神经根病 vs 胸廓出口综合征',
      context: '颈肩痛伴上肢放射需区分病变在颈椎还是臂丛神经通路，治疗方向不同。',
      compareItems: [
        { test: 'Spurling试验(压顶试验)', a: '正向（头侧屈+压顶诱发上肢放射痛）', b: '多阴性', source: '临床查体' },
        { test: '颈部活动影响', a: '颈部活动明显诱发/加重放射', b: '颈动关系不密切', source: '临床' },
        { test: '皮节分布', a: '典型皮节分布（C5-C8对应）', b: '多沿尺神经（C8-T1）或整臂麻木', source: 'NICE' },
        { test: 'Adson试验', a: '多阴性', b: '可阳性（患侧桡动脉减弱+症状）', source: '临床查体' },
        { test: '夜间症状', a: '颈部位置变化诱发', b: '高举患肢可缓解（神经张力下降）', source: '临床' }
      ],
      conclusion: '神经根病：按本库「颈痛伴放射痛」+ CMT 颈椎方案；胸廓出口：避免长时间上肢上举，体位调整为主，必要时血管/神经科评估。',
      evidenceSource: 'NICE NG59 颈部内容协同判读'
    },
    {
      id: 'diff-ankle-sprain',
      title: '踝扭伤：韧带损伤 vs 骨折/腓骨肌腱滑脱',
      context: '踝外侧扭伤最常见，需要 Ottawa 原则快速排除骨折，再评估韧带损伤程度。',
      compareItems: [
        { test: 'Ottawa踝规则', a: '两处骨性压痛阳性或不能负重4步→需X线排除骨折', b: '无法行走需高度警惕', source: 'Ottawa Ankle Rules' },
        { test: '最痛点', a: '距腓前韧带区(外踝前下方)', b: '外踝骨性隆起压痛', source: '临床' },
        { test: '负重能力', a: '轻中度可部分负重', b: '完全不能负重（怀疑骨折/韧带完全撕裂）', source: 'Ottawa' },
        { test: '瘀斑时间', a: '24-48h出现（韧带撕裂）', b: '广泛及踝迅速（骨折可能）', source: '临床' },
        { test: '腓骨肌腱检查', a: '外踝后方肿胀、抗阻外翻痛', b: '可提示腓骨肌腱滑脱', source: '临床' }
      ],
      conclusion: 'Ottawa 阳性→先X线排除骨折；阴性→按本库「踝关节韧带扭伤」POLICE分阶段康复；腓骨肌腱滑脱需专科处理。',
      evidenceSource: 'Ottawa Ankle Rules（Stiell et al. 1992）'
    },
    {
      id: 'diff-elbow-pain',
      title: '肘外侧痛：肱骨外上髁炎 vs 桡管综合征 vs 关节内病变',
      context: '"网球肘"是最常见诊断，但桡管综合征与关节内病变需鉴别，避免误诊延误。',
      compareItems: [
        { test: 'Maudsley试验(中指伸抗阻)', a: '常阳性', b: '多阴性', source: '临床查体' },
        { test: '伸肌群压痛位置', a: '外上髁局部局限压痛', b: '更远(桡骨颈/桡管处)压痛', source: '临床' },
        { test: '伸中指抗阻', a: '轻度', b: '明显诱发前臂外侧痛（桡神经受压）', source: '临床' },
        { test: '前臂旋转', a: '无关', b: '旋后抗阻明显诱发', source: '临床' },
        { test: '关节积液/活动痛', a: '无，被动活动可', b: '可伴关节内积液体征（考虑关节炎）', source: '临床' }
      ],
      conclusion: '明确外上髁压痛点→按本库「网球肘」方案；桡管综合征需按摩/神经松动+避免重复旋转；关节内病变（如软骨/关节面）转运动医学科评估。',
      evidenceSource: 'US 共识：肘外侧痛鉴别诊断要点'
    }
  ],

  // ═══════════════════ 二、决策树（评估→推荐方案） ═══════════════════
  decisionTrees: [
    {
      id: 'tree-back-pain',
      title: '腰痛处理决策树',
      root: '腰痛伴/不伴下肢症状',
      branches: [
        { condition: '存在马尾综合征警示（大小便障碍/鞍区麻木/进行性双下肢无力）', decision: '立即急诊转诊，勿在门诊处理', action: null, why: '马尾综合征为外科急症，延误致永久神经损伤', source: 'NICE NG59' },
        { condition: '伴下肢放射痛+直腿抬高试验阳性', decision: '怀疑神经根受压', action: 'protocol:pro-lumbar-disc-herniation', why: 'MRI确认后再针对性训练', source: 'NICE NG59' },
        { condition: '腰痛为主、无下肢放射+俯卧伸髋痛（骶髂应力）', decision: '怀疑骶髂关节痛', action: 'protocol:pain-lbp-sacroiliac', why: '骶髂关节痛的康复与腰椎源性不同，需专门稳定训练', source: 'IASP 2021' },
        { condition: '腰痛+活动后缓解但晨僵/活动受限', decision: '怀疑腰椎活动度不足', action: 'protocol:pain-lbp-mobility-deficit', why: '活动度不足危害低但需循序渐进恢复', source: '临床' },
        { condition: '腰痛+重复动作诱发、易复发（机械性腰痛）', decision: '怀疑腰椎不稳/协调障碍', action: 'protocol:pain-lbp-instability', why: '核心稳定+协调训练针对不稳', source: '临床' }
      ]
    },
    {
      id: 'tree-knee-instability',
      title: '膝关节创伤后不稳决策树',
      root: '创伤后膝关节肿胀+不稳感',
      branches: [
        { condition: '急性大量血肿+抽屉试验/轴移试验阳性', decision: '高度怀疑ACL损伤', action: 'protocol:pt-acl', why: 'ACL重建与否均按分阶段康复', source: 'MGB 指南' },
        { condition: '旋转损伤+麦氏试验阳性+阵发性卡锁', decision: '怀疑半月板撕裂', action: 'protocol:pain-meniscus-injury', why: '卡锁提示需评估手术', source: 'AAOS' },
        { condition: '膝前痛+上下楼痛+髌骨研磨痛', decision: '怀疑髌股关节痛', action: 'protocol:pain-patellofemoral', why: '髌股关节康复以股四头肌+臀肌强化为主', source: 'JPFA' },
        { condition: '多向不稳+多处韧带松（伴全身关节松弛）', decision: '怀疑多韧带损伤/髓质松弛', action: 'protocol:pt-acl', why: '按保护性康复', source: '临床' }
      ]
    },
    {
      id: 'tree-shoulder-instability',
      title: '肩关节疼痛决策树',
      root: '肩痛伴功能障碍',
      branches: [
        { condition: '外伤史+jobe试验/疼痛弧阳性，被动活动多正常', decision: '撞击/肩袖损伤', action: 'protocol:pt-rotator-cuff', why: '分4阶段恢复', source: 'ISAKOS 2025' },
        { condition: '无明确外伤+主动被动均受限+夜间静息痛进行性', decision: '冻结肩（肩周炎）', action: 'protocol:pt-rotator-cuff', why: '以被动牵拉+ROM为主', source: 'ISAKOS' },
        { condition: '挥拍/甩臂高危动作后+外旋抗阻痛', decision: '肩胛下肌/肩外旋肌损伤', action: 'protocol:pt-rotator-cuff', why: '强化期加入肩外旋训练', source: 'ISAKOS' },
        { condition: '肩痛+颈部活动诱发+上肢放射', decision: '颈椎源性肩痛', action: 'protocol:pain-neck-radiating', why: '处理颈源而非肩关节', source: 'NICE NG59' }
      ]
    },
    {
      id: 'tree-pain-assessment',
      title: '疼痛评估工具选择决策树（量表）',
      root: '需要疼痛强度评估',
      branches: [
        { condition: '成人能理解数字/年龄轻', decision: '用 NRS（0-10）', action: 'scale:nrs', why: '简便、与VAS高度相关', source: 'IASP' },
        { condition: '认知障碍/老年/不理解数字', decision: '用 VAS 视觉模拟尺', action: 'scale:vas', why: '直观，但需能理解刻度', source: 'IASP' },
        { condition: '儿童(4-17岁)/沟通困难者', decision: '用 Wong-Baker FPS 面部表情量表', action: 'scale:fps', why: '以表情评分，儿童适用', source: 'IASP' },
        { condition: '需多维评估(程度/频率/睡眠/活动影响)', decision: '用 P4 疼痛强度量表', action: 'scale:p4', why: '4维度更全面', source: '初级保健疼痛工具' }
      ]
    }
  ],

  // ═══════════════════ 三、案例库（主诉→查体→量表→诊断→方案→随访） ═══════════════════
  cases: [
    {
      id: 'case-lbp-radiating',
      title: '45岁男性：慢性腰痛伴右下肢放射痛',
      presentation: '办公室文员，腰痛5月，近2周向右臀部及右小腿后外侧放射，久坐加重，自述坐位时咳嗽诱发腿痛。',
      examFindings: [
        { test: '直腿抬高试验(SLR)', result: '右侧30°诱发右下肢放射至膝下，阳性', tag: '神经根张力↑' },
        { test: '皮节感觉', result: '右小腿外侧+足背浅感觉减退（L5区）', tag: 'L5受累' },
        { test: '肌力', result: '右伸拇长肌肌力 4/5，余正常', tag: 'L5根性肌力↓' },
        { test: '腱反射', result: '膝/踝反射对称存在', tag: 'S1未受累' },
        { test: '马尾警示', result: '大小便正常、鞍区感觉完整', tag: '排除急症' }
      ],
      scaleSummary: [
        { id: 'scale:nrs', note: 'NRS 6/10，疼痛为主诉且达中重度' },
        { id: 'scale:odi', note: 'ODI 48%，功能中度受限' }
      ],
      diagnosis: '腰椎间盘突出伴神经根病（多为L5/S1或L4/5椎间盘突出刺激L5神经根），无马尾综合征及进行性肌力下降，可保守处理。',
      plan: [
        { step: '急性期(0-2周)', detail: '避免久坐、搬重物；急性期每日NRS监测；按需冷敷/短程镇痛（遵医嘱）' },
        { step: '中期(2-6周)', detail: '按本库「腰椎间盘突出伴神经根病」方案进行神经松动+核心稳定+姿势教育，从低负荷开始' },
        { step: '长期(>6周)', detail: '疼痛稳定后强化核心+返回久坐逐级适应，预防复发' }
      ],
      followUp: '2周复评ODI与NRS；若6周后仍明显放射痛或出现肌力下降/大小便障碍，转骨科/MRI评估。',
      sources: ['NICE NG59（2020/2023）', '本库 scales: NRS、ODI']
    },
    {
      id: 'case-shoulder-impingement',
      title: '52岁女性：右肩反复抬举痛3个月',
      presentation: '自由职业，近期搬抬整理衣物增多，右肩外展60-120°时疼痛，夜间偶发，主动上举受限但被动上举基本正常。',
      examFindings: [
        { test: '疼痛弧', result: '外展60°-120°疼痛明显，超出后减轻', tag: '撞击阳性' },
        { test: '主动vs被动', result: '主动前屈/外展受限，被动接近正常', tag: '非冻结肩' },
        { test: 'Neer撞击试验', result: '阳性', tag: '撞击' },
        { test: 'Jobe空罐试验', result: '阳性（冈上肌受累）', tag: '肩袖累及' },
        { test: '夜间症状', result: '夜间静息痛不重', tag: '可保守' }
      ],
      scaleSummary: [
        { id: 'scale:constant-murley', note: 'Constant 68分，功能下降' },
        { id: 'scale:nrs', note: 'NRS 4/10' }
      ],
      diagnosis: '肩峰撞击综合征伴轻度肩袖(冈上肌)受累，无完全性撕裂及冻结表现，可保守康复。',
      plan: [
        { step: '急性期', detail: '避免过度上举、抬重，冷敷控制炎症，保留无痛范围内被动活动' },
        { step: '中期', detail: '按本库「肩袖损伤」分阶段方案：肩胛骨稳定→冈上肌等长/部分负重→肩外旋肌渐进强化' },
        { step: '强化期', detail: '加入核心稳定与肩胛协调训练，逐级恢复上举动作' }
      ],
      followUp: '4周复评Constant/NRS；若被动活动也进行性受限或疼痛不降，考虑冻结肩对照处理。',
      sources: ['ISAKOS 2025 肩袖损伤指南', '本库 scales: Constant-Murley、NRS']
    },
    {
      id: 'case-acl',
      title: '26岁男性：篮球急停后右膝肿痛不稳',
      presentation: '篮球对抗中变向急停，右膝"啪"一声后立即肿胀，无法继续，随后24h肿胀明显，自觉"膝关节晃动不实"。',
      examFindings: [
        { test: '肿胀', result: '伤后2h即明显肿，张力高，浮髌试验阳性', tag: '关节内血肿' },
        { test: '前抽屉试验', result: '阳性（前向移位明显）', tag: '前交叉松弛' },
        { test: '轴移试验', result: '阳性', tag: '前交叉损伤' },
        { test: '麦氏试验', result: '阴性', tag: '半月板暂未明显' },
        { test: 'Lachman试验', result: '阳性（松动感）', tag: '前交叉损伤' }
      ],
      scaleSummary: [
        { id: 'scale:lysholm', note: 'Lysholm 52分，显著功能下降及不稳感' },
        { id: 'scale:nrs', note: 'NRS 6/10' }
      ],
      diagnosis: '高度怀疑前交叉韧带(ACL)断裂，急性期肿胀显著；需骨科/运动医学科确认是否合并半月板及是否需重建。',
      plan: [
        { step: '急性期(D0-2W)', detail: '按本库「ACL」方案：抬高+冰敷+等长股四头肌激活，限制负重/循序渐进行走' },
        { step: '中期(2-8W)', detail: '恢复活动度+股四头肌/腘绳肌强化+神经肌肉控制，为手术或保守稳定做准备' },
        { step: '是否重建', detail: '由专科结合年龄/运动需求/韧带松弛度决策，重建后同样按分阶段康复' }
      ],
      followUp: '每周复评肿胀与Lysholm；出现再肿/交锁及时复查MRI；运动重返前需肌力双侧对称达标。',
      sources: ['MGB ACL 康复指南', '本库 scales: Lysholm、NRS']
    },
    {
      id: 'case-ankle-sprain',
      title: '19岁学生：篮球落地踝扭伤',
      presentation: '跳投落地时右踝内翻，当时剧痛，勉强能走几步，外踝前下方肿痛，无法再上场，24h后瘀斑逐渐显现。',
      examFindings: [
        { test: 'Ottawa踝规则', result: '外踝上端骨性压痛阴性、内踝痛阴性、可负重4步', tag: '低骨折风险' },
        { test: '最痛点', result: '外踝前下方距腓前韧带区压痛', tag: '韧带损伤' },
        { test: '负重能力', result: '可部分负重跛行', tag: 'I-II度扭伤可' },
        { test: '前抽屉(踝/距骨前移)', result: '轻度阳性（可疑距腓前韧带撕裂）', tag: '需评估' },
        { test: '瘀斑', result: '24-48h外踝-足外侧瘀斑', tag: '韧带撕裂' }
      ],
      scaleSummary: [
        { id: 'scale:aofas', note: 'AOFAS 71分，功能一体性下降' },
        { id: 'scale:nrs', note: 'NRS 5/10' }
      ],
      diagnosis: '右踝外侧韧带扭伤（Ⅰ-Ⅱ度，距腓前韧带为主），Ottawa 排除骨折，可门诊保守。',
      plan: [
        { step: '急性期(0-72h)', detail: 'PRICE原则（保护/休息/冰敷/加压/抬高），可部分负重护具行走' },
        { step: '恢复期(4D-3W)', detail: '按本库「踝关节韧带扭伤」方案：无痛下主动ROM+腓骨肌等长/轻柔等张' },
        { step: '强化期(>3W)', detail: '平衡板本体感觉+腓骨肌离心+踝稳定训练，逐步恢复跑跳' }
      ],
      followUp: '1周复评AOFAS/负重；持续不稳或反复扭伤考虑韧带松弛重建评估。',
      sources: ['Ottawa Ankle Rules（Stiell et al. 1992）', '本库 scales: AOFAS、NRS']
    },
    {
      id: 'case-stroke-gait',
      title: '68岁男性：脑卒中后3周，右下肢无力、步态不稳',
      presentation: '右侧大脑中动脉区脑梗死，右侧偏瘫，神志清可听懂指令，右下肢主动活动差，站立需扶，家属觉行走摇晃怕跌倒。',
      examFindings: [
        { test: '肌力(MMT)', result: '右屈髋4/右伸膝3/右踝背屈2级', tag: '下肢近端受累重' },
        { test: 'Barthel/ADL', result: '步行1项明显减分，余轻', tag: '活动受限' },
        { test: '坐站平衡', result: '可独坐，站立需辅助', tag: '站姿不稳' },
        { test: '病理反射+肌张力', result: '巴氏征阳性，肌张力轻度增高(Ashworth 1)', tag: '上运动神经元' }
      ],
      scaleSummary: [
        { id: 'scale:berg', note: 'Berg 30分，跌倒高风险需严格防跌' },
        { id: 'scale:tug', note: 'TUG 前测无法独立完成（需扶）' }
      ],
      diagnosis: '脑卒中后偏瘫导致的下肢运动与平衡功能障碍（右侧为主），当前处于早期康复窗口期，重点在防跌倒与恢复站立行走。',
      plan: [
        { step: '早期(本阶段)', detail: '按本库「脑卒中后康复」方案：在保护下完成踝背屈/伸膝/屈髋等分级肌力刺激，加床上-坐-站转换训练' },
        { step: '中期', detail: '强化坐位→站位平衡，双杆/助行器辅助步态训练，结合认知-运动双重任务' },
        { step: '防跌倒', detail: 'Berg低于40分全程防跌倒管理，家属陪护训练移位，居家无障碍改造' }
      ],
      followUp: '每2周复评Berg/TUG和肌力；若跌倒或进展停滞及时调整，目标为Berg≥40、TUG<14s可社区步行。',
      sources: ['脑卒中康复临床实践指南', '本库 scales: Berg、TUG、MMT']
    }
  ]
};