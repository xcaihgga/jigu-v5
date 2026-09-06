/**
 * 量表教学详情扩展（第 1 批，核心 15 个量表）
 *
 * 设计：以 scale.id 为 key，存储教学字段，不侵入原始 scales.js / scales-extra.js 数据结构。
 * scales-ui.js 的 showScaleIntro() 会查询 window.scaleTeaching[scale.id]，
 * 存在则追加渲染「操作指引」「常见错误」「信效度增强」三个教学区块。
 */
window.scaleTeaching = {

  // ================ 疼痛类 ================

  vas: {
    adminGuide: '请在这条 10cm 的线上标出您的疼痛程度。"0" 代表完全不痛，"10" 代表您能想象到的最剧烈的疼痛。请标出您过去 24 小时里最严重的那一次。',
    adminSteps: [
      '向患者解释 VAS 的用途（评估疼痛强度，帮助医生了解病情变化）',
      '将标尺水平放置，带刻度的一面朝向自己、无刻度的一面朝向患者（避免数字锚定偏倚）',
      '逐字念一遍标准指导语',
      '患者用笔在尺上做标记后，测量 0 刻度到标记的距离，精确到 mm（如 4.2cm = 4.2 分）',
      '记录读数，同时让患者口头确认"这就是你最疼的程度对吗"'
    ],
    position: '坐位或卧位均可；标尺水平放置；光线充足；患者能看清整个 10cm 范围',
    cautions: [
      '老年、文化程度低或视力差的患者优先改用 NRS（数字评分法），更直观',
      '儿童（< 8 岁）改用 Wong-Baker FACES 脸谱版',
      '不要让患者看有刻度的一面——数字锚定会导致评分偏高',
      '急性疼痛时让患者标记"此刻"；慢性疼痛标记"过去 24 小时最严重"，需提前明确时间窗',
      '每次评估用同一版本（VAS 或 NRS），不要中途切换以保证可比性'
    ],
    pitfalls: [
      '❌ 忘记说明时间窗（"此刻" vs "过去 24 小时"），导致前后评分不可比',
      '❌ 让患者看有刻度的一面（数字锚定偏倚，ICC 下降 0.15-0.2）',
      '❌ 测量时四舍五入到整数（丢失精度，慢性疼痛 MCID 仅 2 分）',
      '❌ 只做一次测量就下结论（急性痛建议间隔 15 分钟复测取均值）'
    ],
    evidence: {
      mdc: 1.2,
      mcid: 2.0,
      testRetest: 'ICC = 0.94-0.97',
      reliability: 'Cronbach α = 0.81-0.92',
      sensitivity: '急性痛 82%，慢性痛 74%',
      specificity: '急性痛 86%，慢性痛 81%',
      source: 'Jensen MP, Karoly P. Self-report scales and procedures for assessing pain in adults. In: Handbook of Pain Assessment, 3rd ed. 2003.',
      year: 2003
    }
  },

  nrs: {
    adminGuide: '现在我想问您一个关于疼痛的问题，0 代表完全不痛，10 代表您能想象到的最剧烈疼痛，您当前的疼痛是几分？',
    adminSteps: [
      '确认患者能理解 0-10 数字的含义（必要时用举手指辅助）',
      '逐字念标准指导语',
      '让患者直接说出数字或用手指数出',
      '记录数字',
      '补充询问"这个分数和您过去 24 小时比，是更高/更低/差不多？"'
    ],
    position: '坐位即可，无需特殊设备',
    cautions: [
      'NRS 与 VAS 相关系数 r = 0.95，可互相替代，临床建议全程用同一种',
      '老年痴呆患者可用 0-5 分简化版，配合手势',
      '急性痛（骨折、术后）用"此刻"，慢性痛（关节炎、腰痛）用"过去 24 小时平均"',
      '不要诱导（如"是不是有点疼？"），保持中性提问'
    ],
    pitfalls: [
      '❌ 诱导性提问（"是不是大概 5 分？"），会显著影响结果',
      '❌ 急性和慢性痛用同一时间窗，导致基线不可比',
      '❌ 忽略 NRS 存在的数字偏倚（患者倾向于 5、7 这样的锚定数字）'
    ],
    evidence: {
      mdc: 1.5,
      mcid: 2.0,
      testRetest: 'ICC = 0.93-0.96',
      reliability: 'Cronbach α = 0.88',
      sensitivity: '84%',
      specificity: '83%',
      source: 'IASP. Classification of Chronic Pain, 3rd ed. 2020.',
      year: 2020
    }
  },

  // ================ 平衡/运动类 ================

  berg: {
    adminGuide: '现在我要测试一下您的平衡能力，总共 14 个小项目，每个项目我会给您指令，您按我说的做就行。如果过程中觉得头晕或站不稳，随时告诉我。',
    adminSteps: [
      '患者穿普通室内鞋（赤脚或拖鞋会影响平衡）',
      '从坐位开始，按照量表顺序依次测试 14 项',
      '每个项目做 1 次；需要时可示范 1 次',
      '每项按 0-4 分评分，当场记录',
      '测试时治疗师站在患者非利侧 0.5m 处保护（不要扶，只防跌倒）'
    ],
    position: '测试前 10 分钟避免进食过饱、避免服用镇静药；穿合适的鞋子；周围无障碍物（至少 2m 圆形空间）',
    cautions: [
      '有认知障碍（MMSE<18）的患者结果不可靠，需用更简单的 Tinetti 或 Timed Up & Go',
      '检查顺序：从简单到复杂，先坐位/站立（静态）再上肢前伸/转身/单腿站（动态）',
      '上肢前伸：用尺子测量，患者抬肩与地面平行、肘伸直，中指顶点距离起始点的水平距离',
      '单腿站立：扶一下作为准备，正式测试松手计时',
      '有严重眩晕史、最近 2 周内有跌倒的患者先评估意识再决定是否做',
      '平衡差的患者可用稳固的椅子或肋木旁测试，降低跌倒风险'
    ],
    pitfalls: [
      '❌ 忘记保护（治疗师未站在近侧），14 项中有 8 项需要在跌倒时接住患者',
      '❌ 上肢前伸只目测不用尺子（目测误差可达 5-10cm，影响得分）',
      '❌ 对平衡差的患者让其独立完成所有项目（0-20 分高跌倒风险组应辅助）',
      '❌ 检查顺序打乱（如先做单腿站立再做坐位站立），患者疲劳影响后期结果',
      '❌ 忘记穿合适的鞋（赤脚 Berg 分平均偏高 2-3 分）'
    ],
    evidence: {
      mdc: 4,
      mcid: 4,
      testRetest: 'ICC = 0.97',
      reliability: 'Cronbach α = 0.95',
      sensitivity: '跌倒风险预测：81%',
      specificity: '跌倒风险预测：62%',
      source: 'Berg KO et al. Measuring balance in the elderly: preliminary development of an instrument. Canadian Journal of Public Health. 1989; 80(6): 405-411.',
      year: 1989
    }
  },

  'fm-upper': {
    adminGuide: '现在我要逐项测试您患侧上肢的运动能力。一共 27 个小项目，每个项目您按我说的做，我给您打分。0 分是做不了，1 分是能做一部分，2 分是完全能做。',
    adminSteps: [
      '患者坐位，检查患侧上肢',
      '按照量表顺序（反射 → 协同模式 → 分离运动 → 腕/手功能 → 协调）逐一测试',
      '每个动作示范 1 次，然后让患者做 1-2 次',
      '观察是否存在联合反应、共同运动、刻板运动',
      '震颤和辨距不良：让患者指鼻 5 次观察',
      '每项当场打分（0/1/2），最后求和'
    ],
    position: '坐位，上肢能自由活动；有稳固的桌面放置检测物品（笔、杯子、网球）',
    cautions: [
      '检查侧确认是患侧，不要测健侧',
      '指鼻测试用于协调项（第 27 项速度也用指鼻 5 次计时）',
      '评估前先做 5 分钟上肢热身活动，避免患者因紧张影响评分',
      '协同模式测试应在患者放松时做，避免刻意用力',
      '腕稳定测试：肘伸直腕背伸 15° 并保持 10 秒（第 14、15 项）',
      '有明显上肢疼痛或急性炎症的患者暂缓测试'
    ],
    pitfalls: [
      '❌ 把健侧也测试了（Fugl-Meyer 只评患侧）',
      '❌ 忽略联合反应（如肩外展时出现肘屈，应判为 1 分"部分完成"）',
      '❌ 腕稳定测试只做静态不计时（标准是保持 10 秒）',
      '❌ 没检查震颤和辨距不良（这两项是协调能力的关键指标）',
      '❌ 让患者连续做超过 27 项（患者疲劳，后期分数下降）'
    ],
    evidence: {
      mdc: 5,
      mcid: 5,
      testRetest: 'ICC = 0.96（急性期）→ 0.90（恢复期）',
      reliability: 'Cronbach α = 0.95',
      sensitivity: '运动功能恢复预测：86%',
      source: 'Fugl-Meyer AR et al. The post-stroke hemiplegic patient. 1. A method for evaluation of physical performance. Scandinavian Journal of Rehabilitation Medicine. 1975; 7(1): 13-31.',
      year: 1975
    }
  },

  'fm-lower': {
    adminGuide: '现在测试您患侧下肢的运动能力。一共 17 个项目，每个项目您按我说的做，我给您打分。0 分是做不了，1 分是能做一部分，2 分是完全能做。',
    adminSteps: [
      '患者仰卧位（反射、协同模式、分离运动）→ 坐位（膝屈、踝背屈）→ 站位（膝屈、踝背屈）',
      '先测反射（跟腱反射、跖屈肌反射）',
      '再测协同模式（屈肌、伸肌协同）',
      '然后从坐位→站位分离运动',
      '最后协调能力（指踝、震颤、辨距、速度）'
    ],
    position: '需要检查床（仰卧）+ 椅子（坐位）+ 稳定站立位环境',
    cautions: [
      '站位测试前先确保患者能独立站立或有辅助',
      '反射测试用叩诊锤：跟腱反射（坐位）、跖屈肌反射（仰卧）',
      '第 13、14 项（膝屈伸、踝背屈）是仰卧位的分离运动，注意体位不同',
      '速度测试：连续做 5 次踝背屈，计时，与健侧比较',
      '有下肢血管疾病、深静脉血栓风险的患者谨慎做仰卧位屈肌协同测试'
    ],
    pitfalls: [
      '❌ 反射测试漏做（很多人跳过前 2 项反射直接做协同模式）',
      '❌ 站位测试前不做保护（站位膝屈和踝背屈易跌倒）',
      '❌ 不区分协同模式 vs 分离运动（协同模式是刻板模式，分离是独立运动）',
      '❌ 速度测试不计时（只看质量不看速度会遗漏运动迟缓这一关键指标）'
    ],
    evidence: {
      mdc: 3,
      mcid: 3,
      testRetest: 'ICC = 0.94',
      reliability: 'Cronbach α = 0.92',
      source: '同 fm-upper，Fugl-Meyer 1975',
      year: 1975
    }
  },

  // ================ 颈椎/腰痛类 ================

  ndi: {
    adminGuide: '这是一份关于您颈部疼痛及其对日常活动影响的问卷。共 10 个问题，请您根据过去一周的情况，选择最符合您的答案。',
    adminSteps: [
      '患者独立填写，不要辅助或解释（避免影响结果）',
      '如患者阅读困难，可念题让其选（保持中性，不解释选项含义）',
      '10 个问题全部完成后检查有无遗漏',
      '每个问题 0-5 分，总分 × 2 = 百分制（0-100）'
    ],
    position: '安静的环境，患者坐舒服的椅子，有书写条件',
    cautions: [
      '不要代替患者回答或解释选项（如"第 3 题意思是你的头疼有多严重"会引导）',
      '问题 10（驾驶）如果患者不开车，通常标记为 0 分（或按临床判断）',
      '颈椎严重外伤、颈椎骨折急性期暂不做',
      '与 ODI（腰痛残疾指数）不要搞混，两者评分结构相同但内容不同',
      '翻译版本需确认：本项目用中华医学会疼痛学分会推荐的中文版，信度已验证'
    ],
    pitfalls: [
      '❌ 计算总分时忘记 × 2（原始 0-50，百分制需 ×2 得 0-100）',
      '❌ 漏掉问题 10 驾驶项就按"不能开车=5 分"处理（正确：不开车=0 分，能开但受影响才给分）',
      '❌ 代患者选答案（患者犹豫时问"你感觉哪个更对"而非"是不是选 3"）'
    ],
    evidence: {
      mdc: 10,
      mcid: 10,
      testRetest: 'ICC = 0.80-0.92',
      reliability: 'Cronbach α = 0.89-0.93',
      sensitivity: '颈椎功能障碍 84%',
      source: 'Vernon H, Mior S. The Neck Disability Index: a study of reliability and validity. Journal of Manipulative and Physiological Therapeutics. 1991; 14(7): 409-415.',
      year: 1991
    }
  },

  odi: {
    adminGuide: '这是一份关于您腰部疼痛及其对日常活动影响的问卷。共 10 个问题，请您根据过去一周的情况，选择最符合您的答案。',
    adminSteps: [
      '同 NDI：患者独立填写',
      '10 问题全部完成后检查遗漏',
      '原始总分 × 2 = 百分制（0-100）'
    ],
    position: '安静环境，坐姿舒适',
    cautions: [
      '与 NDI 结构相同（10 题 × 0-5 分，×2 得百分制），但内容针对腰痛',
      '问题 10（性生活）有些患者觉得隐私，允许跳过后评分除以 9 再 × 100',
      '有明确手术指征（马尾综合征、进展性神经功能缺损）先查 MRI 再评'
    ],
    pitfalls: [
      '❌ 只做 9 题就按 100 分制算（漏题时先算均分再按比例缩放）',
      '❌ 把 ODI 和 Roland-Morris 搞混（Roland-Morris 是 24 题 yes/no，ODI 是 10 题 0-5 分）'
    ],
    evidence: {
      mdc: 10,
      mcid: 10,
      testRetest: 'ICC = 0.84-0.99',
      reliability: 'Cronbach α = 0.88',
      sensitivity: '腰痛功能障碍 85%',
      source: 'Fairbank JC et al. The Oswestry low back pain disability questionnaire. Physiotherapy. 1980; 66(2): 271-273.',
      year: 1980
    }
  },

  // ================ 上肢功能类 ================

  dash: {
    adminGuide: '这份问卷有 30 个问题，评估您过去一周上肢（肩、肘、腕、手）做日常活动时有无困难和疼痛。请逐题作答。',
    adminSteps: [
      '患者独立填写',
      '30 题全部完成，检查遗漏',
      '第 21-30 题为工作/运动/音乐模块（可选），不影响总分',
      '每个问题 1-5 分，(总分 - 30) / 120 × 100 = 百分制'
    ],
    position: '安静环境，坐姿舒适',
    cautions: [
      'DASH 是上肢全功能评估，不局限于某个关节（与 Constant-Murley（肩专用）不同）',
      '可选模块（21-30 题）鼓励填写，但不填不影响总分',
      '中文版本确认用 Beaton 等 2002 年的翻译版，信效度已验证'
    ],
    pitfalls: [
      '❌ 计算总分时忘记减 30（原始 30-150，减 30 再除 120）',
      '❌ 漏题时仍按 30 题算（漏 1 题时总分按剩余题目的均分 × 30 补）'
    ],
    evidence: {
      mdc: 10.2,
      mcid: 10.2,
      testRetest: 'ICC = 0.96',
      reliability: 'Cronbach α = 0.96',
      sensitivity: '上肢功能障碍 83%',
      source: 'Hudak PL et al. Development of an upper extremity outcome measure: the DASH. American Journal of Industrial Medicine. 1996; 29(6): 602-608.',
      year: 1996
    }
  },

  quickdash: {
    adminGuide: '这份问卷有 11 个问题，是 DASH 的简化版本。请根据过去一周上肢的情况作答。',
    adminSteps: [
      '患者独立填写 11 题',
      '计算方法同 DASH：(总分 - 11) / 44 × 100'
    ],
    position: '同 DASH',
    cautions: [
      'QuickDASH 与 DASH 相关系数 r = 0.95，临床可互相替代',
      '效率更高：DASH 30 题 10 分钟，QuickDASH 11 题 3 分钟',
      'DASH 21-30 题（运动/工作模块）QuickDASH 没有'
    ],
    pitfalls: [
      '❌ 计算 QuickDASH 时用了 DASH 的分母 120（QuickDASH 是 44）',
      '❌ 以为 QuickDASH 信度差（ICC 0.94-0.96，与 DASH 相当）'
    ],
    evidence: {
      mdc: 9.4,
      mcid: 9.4,
      testRetest: 'ICC = 0.94-0.96',
      reliability: 'Cronbach α = 0.92',
      source: 'Beaton DE et al. The QuickDASH: comparison of three item-reduction approaches. Journal of Bone and Joint Surgery (American). 2005; 87(5): 1038-1046.',
      year: 2005
    }
  },

  'constant-murley': {
    adminGuide: '现在我要测试您肩关节的情况。Constant-Murley 评分有疼痛（15）、日常活动（20）、ROM（40）、力量（25）四个部分，总分 100。我会让您做几个动作，请按指令完成。',
    adminSteps: [
      '先问疼痛程度（VAS 0-15 转换）和日常活动能力（4 项，每项 0-5 分）',
      '测 ROM：前屈、外展、外旋、内旋（用关节角度计）',
      '外旋角度：站立位，肘屈 90° 贴身体，向外旋',
      '内旋角度：站立位，肘屈 90° 贴身体，向内旋，用手摸到背部最高处',
      '肌力测试：前屈和外展 90° 时对抗阻力，目测/测力计（0-5 级）',
      '总分 = 疼痛 + 活动 + ROM + 力量'
    ],
    position: '站立位（ROM 前屈/外展/外旋）或坐位（力量测试）；需关节角度计、测力计',
    cautions: [
      '只测患侧肩，健侧作为对照参考',
      'ROM 测量：患者独立活动到最大角度，不要主动辅助',
      '内旋角度的评分：手能触到 T12=10 分、L5=8 分、臀部=6 分、大腿外侧=4 分、大腿前面=2 分、不能=0 分',
      '急性肩袖损伤、肩峰撞击综合征急性期暂不测肌力',
      '与 UCLA Shoulder Score 区分：UCLA 有满意度模块，Constant 没有'
    ],
    pitfalls: [
      '❌ 内旋角度只用目测不用体表标记（手摸背部位置的评分是关键点）',
      '❌ 肌力测试时患者有疼痛仍强行继续（疼痛 VAS > 7 分应停止）',
      '❌ 忘记测活动模块的 4 个日常活动（梳头、穿衣、如厕、睡觉）'
    ],
    evidence: {
      mdc: 10,
      mcid: 8.3,
      testRetest: 'ICC = 0.95',
      reliability: 'Cronbach α = 0.91',
      source: 'Constant CR, Murley AH. A clinical method of functional assessment of the shoulder. Clinical Orthopaedics and Related Research. 1987; (214): 160-164.',
      year: 1987
    }
  },

  // ================ 膝/髋类 ================

  lysholm: {
    adminGuide: 'Lysholm 评分评估您膝关节的日常活动功能。总共 8 个项目，我会逐项询问您的情况，请如实回答。',
    adminSteps: [
      '8 个问题（跛行、支撑、交锁、不稳定、疼痛、肿胀、爬楼梯、下蹲），口头问答',
      '总分 0-100',
      '每个问题 0-30 分不等，具体权重见量表'
    ],
    position: '坐位，口头问答即可，无需脱衣检查',
    cautions: [
      'Lysholm 主要用于韧带损伤后的功能评估（特别是 ACL 重建）',
      '8 个问题里"交锁"和"不稳定"是最关键的 2 项（与韧带完整性直接相关）',
      '有明显肿胀或发热的膝关节先排除感染再做'
    ],
    pitfalls: [
      '❌ 用 Lysholm 评估骨关节炎（不合适，OA 应选 WOMAC 或 IKDC）',
      '❌ 忽略"交锁"问题（半月板损伤的典型表现）'
    ],
    evidence: {
      mdc: 10,
      mcid: 8,
      testRetest: 'ICC = 0.91-0.94',
      reliability: 'Cronbach α = 0.93',
      source: 'Lysholm J, Gillquist J. Evaluation of knee ligament surgery results with special emphasis on use of a scoring scale. American Journal of Sports Medicine. 1982; 10(3): 150-154.',
      year: 1982
    }
  },

  ikdc: {
    adminGuide: 'IKDC 评分是国际膝关节文献委员会的标准评估工具，含症状、功能、运动活动三个模块。请根据过去一周的情况作答。',
    adminSteps: [
      '症状模块（6 题，疼痛、僵硬、肿胀、卡锁等）',
      '功能模块（2 题，日常生活功能水平）',
      '运动活动模块（1 题，过去 4 周是否进行运动，选最活跃的一项）',
      '总分 0-100，分数越高越好'
    ],
    position: '患者独立填写（问卷式），或治疗师口头问答',
    cautions: [
      'IKDC 是通用膝关节评分，涵盖所有膝部疾患（OA、韧带、半月板、软骨）',
      '与 Lysholm 互补：Lysholm 偏韧带损伤，IKDC 偏综合功能',
      '中文版确认用 Zhang Y 等 2014 年翻译的版本'
    ],
    pitfalls: [
      '❌ 把 IKDC 和 Oxford Knee Score 搞混（Oxford 是 12 题 yes/no，用于 TKA 前后）',
      '❌ 忽略运动活动模块（IKDC-SF 简版才删了这个）'
    ],
    evidence: {
      mdc: 8,
      mcid: 6,
      testRetest: 'ICC = 0.87-0.96',
      reliability: 'Cronbach α = 0.91',
      source: 'International Knee Documentation Committee. IKDC Subjective Knee Form User Manual. 2000.',
      year: 2000
    }
  },

  // ================ 整体功能类 ================

  barthel: {
    adminGuide: 'Barthel 指数评估您的日常生活活动能力（ADL）。我会问 10 项基本生活活动，每项问您能否独立完成、部分完成还是完全不能。',
    adminSteps: [
      '10 项：进食、洗澡、修饰（洗脸/刷牙）、穿衣、控制大便、控制小便、如厕、转移、行走（平地）、上下楼梯',
      '每项分 2-4 级（0/5/10/15 分），总分 0-100',
      '口头问答 + 观察患者实际能力（不要只靠患者自述）',
      '如有怀疑，当场让患者实际做 1-2 项（如从轮椅转移到椅子）'
    ],
    position: '患者在熟悉的环境（病房/家中），能展示日常生活活动',
    cautions: [
      'Barthel 关注日常生活基本自理，不含高级活动（如购物、使用电话）——后者用 Lawton IADL',
      '评分时看"过去 2 周最稳定的水平"，不要看最好或最差的一天',
      '有认知障碍的患者需向主要照护者确认',
      '行走项：用轮椅也算（独立操纵轮椅得 10 分）'
    ],
    pitfalls: [
      '❌ 仅凭患者自述打分（很多患者高估自己能力，应该让其实际操作）',
      '❌ 把 Barthel 和 Lawton IADL 搞混（Barthel 是 10 项基本 ADL，Lawton 是 8 项工具性 ADL）',
      '❌ 评分看"过去 24 小时最好状态"（正确：过去 2 周平均稳定状态）'
    ],
    evidence: {
      mdc: 5,
      mcid: 5,
      testRetest: 'ICC = 0.85-0.99',
      reliability: 'Cronbach α = 0.92',
      sensitivity: 'ADL 依赖：73%',
      source: 'Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Maryland State Medical Journal. 1965; 14: 61-65.',
      year: 1965
    }
  },

  sf12: {
    adminGuide: 'SF-12 是 12 题的健康调查简表，评估您过去 4 周的总体健康状况。',
    adminSteps: [
      '患者独立填写 12 题',
      '计算 8 个维度（PF、RP、BP、GH、VT、SF、RE、MH）',
      'SF-12 有 2 版：v1（6 题）和 v2（4 题），临床统一用 v2',
      'MCS（心理）+ PCS（躯体）两个综合分（T 分均数 50，标准差 10）'
    ],
    position: '安静环境，独立填写',
    cautions: [
      'SF-12 是 SF-36 的简化版（12 vs 36 题），效率更高',
      'MCS 和 PCS 的计算需要加权，不要手算，用工具',
      '中文版确认用 Ware 等 2007 年的翻译版'
    ],
    pitfalls: [
      '❌ 混淆 v1 和 v2（v2 重标了部分题目的选项，直接影响得分）',
      '❌ 计算 PCS/MCS 时用了不正确的加权系数（必须用 Ware 提供的官方系数）'
    ],
    evidence: {
      testRetest: 'ICC = 0.77-0.90（PCS），0.75-0.89（MCS）',
      reliability: 'Cronbach α = 0.84-0.91',
      source: 'Ware JE Jr et al. SF-12: How to Score the SF-12 Physical and Mental Health Summary Scales. QualityMetric. 2011.',
      year: 2011
    }
  },

  // ================ 心理/筛查类 ================

  gad7: {
    adminGuide: '这份问卷是关于您在过去 2 周内有多频繁感到下面这些状况。没有=0 分，几天=1 分，一半以上时间=2 分，几乎每天=3 分。',
    adminSteps: [
      '7 题，每题 0-3 分',
      '患者独立填写',
      '总分 0-21，临界值 ≥ 5 提示可能有焦虑',
      '分数意义：0-4 无、5-9 轻度、10-14 中度、15-21 重度'
    ],
    position: '安静环境，独立填写',
    cautions: [
      'GAD-7 不是诊断工具，高分提示进一步评估（DSM-5 结构化访谈）',
      '临界值 ≥ 5 的敏感度 89%、特异度 82%',
      '用于基层初筛和随访监测，不是精神科确诊'
    ],
    pitfalls: [
      '❌ 把 GAD-7 总分 ≥ 5 当成"确诊焦虑"（只是筛查阳性，需进一步评估）',
      '❌ 漏算某个"没填的"选项（当 0 分处理，或让患者补上）'
    ],
    evidence: {
      mdc: 2,
      mcid: 2,
      testRetest: 'ICC = 0.83',
      reliability: 'Cronbach α = 0.86',
      sensitivity: '89%（GAD-7 ≥ 5）',
      specificity: '82%（GAD-7 ≥ 5）',
      source: 'Spitzer RL et al. A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine. 2006; 166(10): 1092-1097.',
      year: 2006
    }
  },

  phq9: {
    adminGuide: '这份问卷是关于您在过去 2 周内有多频繁感到下面这些状况。没有=0 分，几天=1 分，一半以上时间=2 分，几乎每天=3 分。最后一题是"有不如死掉的想法"。',
    adminSteps: [
      '9 题，每题 0-3 分，患者独立填写',
      '总分 0-27',
      '最后一题（PHQ-9 第 9 条）：任何分值（哪怕 1 分）都需要立即进一步自杀风险评估',
      '分数意义：0-4 无、5-9 轻度、10-14 中度、15-19 中重度、20-27 重度'
    ],
    position: '安静私密的环境；治疗师不要离开太远（出现自杀意念时需立即应对）',
    cautions: [
      '**第 9 条（自杀意念）是红线**：任何 > 0 的回答都必须立即跟进（安全评估、联系家属、转介精神科）',
      'PHQ-9 是抑郁筛查工具，不是诊断，高分需 DSM-5 结构化访谈确认',
      '临界值 ≥ 10：敏感度 88%、特异度 88%',
      '有自杀意念/自杀历史的患者，不要让其独自持有填写好的 PHQ-9',
      '老年人 ≥ 65 岁临界值建议提高到 ≥ 15'
    ],
    pitfalls: [
      '❌ 忽略第 9 条的异常评分（这是紧急信号，不是普通筛查项）',
      '❌ 分数 ≥ 10 但未转介精神科（或至少做安全评估）',
      '❌ 在嘈杂或有他人在场的环境下让患者填写（隐私很重要）',
      '❌ 告诉患者"这个分数说明你有严重抑郁"（正确：告诉你需要进一步评估）'
    ],
    evidence: {
      mdc: 2,
      mcid: 2,
      testRetest: 'ICC = 0.84',
      reliability: 'Cronbach α = 0.89',
      sensitivity: '88%（PHQ-9 ≥ 10）',
      specificity: '88%（PHQ-9 ≥ 10）',
      source: 'Kroenke K et al. The PHQ-9: validity of a brief depression severity measure. Journal of General Internal Medicine. 2001; 16(9): 606-613.',
      year: 2001
    }
  }

};