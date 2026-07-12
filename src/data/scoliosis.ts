import type { Exercise, Pathway } from "@/lib/types";

export const SCOLIOSIS_EXERCISES: Exercise[] = [
  {
    id: "scoliosis-1",
    title: "猫牛式",
    bodyPart: "脊柱",
    goal: "改善脊柱柔韧性",
    cue: "跪姿，双手撑地，吸气时抬头塌腰，呼气时含胸弓背",
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    id: "scoliosis-2",
    title: "靠墙站立",
    bodyPart: "脊柱",
    goal: "矫正姿势",
    cue: "双脚与肩同宽，后脑勺、肩膀、臀部、小腿肚、脚后跟贴墙",
    defaultSets: 1,
    defaultReps: 60,
  },
  {
    id: "scoliosis-3",
    title: "侧平板支撑",
    bodyPart: "核心",
    goal: "增强核心稳定性",
    cue: "侧卧，前臂撑地，身体成一条直线，保持呼吸均匀",
    defaultSets: 2,
    defaultReps: 30,
  },
  {
    id: "scoliosis-4",
    title: "骨盆倾斜",
    bodyPart: "腰椎",
    goal: "改善腰椎灵活性",
    cue: "仰卧，双膝弯曲，吸气时放松，呼气时收紧腹部使腰部贴地",
    defaultSets: 3,
    defaultReps: 15,
  },
  {
    id: "scoliosis-5",
    title: "脊柱旋转",
    bodyPart: "脊柱",
    goal: "增加脊柱旋转活动度",
    cue: "坐姿，双腿伸直，身体向一侧旋转，保持几秒后换侧",
    defaultSets: 2,
    defaultReps: 10,
  },
  {
    id: "scoliosis-6",
    title: "肩胛骨挤压",
    bodyPart: "肩背部",
    goal: "增强背部肌肉",
    cue: "坐姿或站姿，双肩向后下方挤压，感觉肩胛骨并拢",
    defaultSets: 3,
    defaultReps: 15,
  },
  {
    id: "scoliosis-7",
    title: "游泳姿势",
    bodyPart: "上背部",
    goal: "增强背部肌群",
    cue: "俯卧，双臂前伸，交替向上抬起手臂和对侧腿部",
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    id: "scoliosis-8",
    title: "拉伸练习",
    bodyPart: "躯干",
    goal: "改善柔韧性",
    cue: "站姿，身体向侧弯方向的对侧倾斜拉伸，保持15-30秒",
    defaultSets: 2,
    defaultReps: 30,
  },
  {
    id: "scoliosis-9",
    title: "呼吸练习",
    bodyPart: "胸廓",
    goal: "改善呼吸功能",
    cue: "坐姿，双手放在胸廓两侧，吸气时尽量扩张胸廓",
    defaultSets: 3,
    defaultReps: 20,
  },
  {
    id: "scoliosis-10",
    title: "平衡训练",
    bodyPart: "全身",
    goal: "改善平衡能力",
    cue: "站姿，双脚并拢，缓慢抬起一只脚保持平衡",
    defaultSets: 2,
    defaultReps: 30,
  },
];

export const SCOLIOSIS_PATHWAY: Pathway = {
  id: "scoliosis-pathway",
  category: "musculo",
  title: "脊柱侧弯康复路径",
  summary: "针对青少年特发性脊柱侧弯的规范化康复管理路径，涵盖观察、康复训练、支具治疗和手术干预等阶段",
  indication: "脊柱侧弯;青少年特发性脊柱侧弯;Cobb角",
  stages: [
    {
      index: 0,
      title: "筛查与确诊",
      window: "第1-2周",
      goal: "完成全面评估，明确侧弯类型和严重程度",
      keyActions: ["影像学检查", "Cobb角测量", "临床照片评估", "专业诊断"],
      milestone: "明确Cobb角测量结果和侧弯类型",
      referral: "建议转诊至骨科或脊柱专科",
    },
    {
      index: 1,
      title: "观察期（轻度）",
      window: "Cobb角<25°",
      goal: "定期监测侧弯进展，进行康复训练",
      keyActions: ["定期复查X线", "家庭康复训练", "姿势矫正", "体育活动"],
      milestone: "连续2次复查无进展或改善",
    },
    {
      index: 2,
      title: "康复训练期（中度）",
      window: "Cobb角25-40°",
      goal: "通过专业康复训练控制侧弯进展",
      keyActions: ["个体化康复计划", "核心肌群训练", "柔韧性训练", "定期评估"],
      milestone: "Cobb角稳定或减少5°以上",
      referral: "必要时考虑支具治疗",
    },
    {
      index: 3,
      title: "支具治疗期",
      window: "Cobb角>40°且骨骼未成熟",
      goal: "通过支具矫正控制侧弯进展",
      keyActions: ["定制支具", "每日佩戴18-23小时", "配合康复训练", "定期复查调整"],
      milestone: "侧弯进展控制在5°以内",
    },
    {
      index: 4,
      title: "手术准备期",
      window: "Cobb角>50°或进展迅速",
      goal: "术前评估与准备",
      keyActions: ["手术方案制定", "术前康复训练", "心理准备", "并发症预防"],
      milestone: "完成术前评估，进入手术阶段",
      referral: "转诊至脊柱外科",
    },
    {
      index: 5,
      title: "术后康复期",
      window: "术后1-12个月",
      goal: "术后恢复与功能重建",
      keyActions: ["术后监护", "早期活动", "渐进式康复训练", "定期复查"],
      milestone: "恢复正常生活和学习",
    },
  ],
};

export const EXPERT_CONSENSUS_GUIDELINES = {
  mild: {
    range: "Cobb角<25°",
    recommendations: [
      "每6-12个月定期复查X线",
      "进行规律的康复训练",
      "注意日常姿势矫正",
      "鼓励参与体育活动",
    ],
    bracing: "一般不需要支具治疗",
    surgical: false,
    frequency: "每6-12个月复查一次",
    exercise: "建议每周进行3-5次康复训练",
    level: "建议" as const,
  },
  moderate: {
    range: "Cobb角25-40°",
    recommendations: [
      "制定个体化康复训练计划",
      "进行核心肌群强化训练",
      "考虑夜间支具治疗",
      "每4-6个月复查一次",
    ],
    bracing: "建议考虑支具治疗，尤其是骨骼未成熟者",
    surgical: false,
    frequency: "每4-6个月复查一次",
    exercise: "建议每周进行5次以上康复训练",
    level: "推荐" as const,
  },
  severe: {
    range: "Cobb角40-50°",
    recommendations: [
      "佩戴定制支具，每日18-23小时",
      "配合专业康复训练",
      "每月复查评估",
      "考虑手术干预可能性",
    ],
    bracing: "强烈建议支具治疗",
    surgical: false,
    frequency: "每3-4个月复查一次",
    exercise: "每日进行康复训练",
    level: "强烈推荐" as const,
  },
  extreme: {
    range: "Cobb角>50°",
    recommendations: [
      "立即转诊至脊柱外科",
      "评估手术指征",
      "术前康复准备",
      "心理支持",
    ],
    bracing: "支具治疗效果有限，建议手术评估",
    surgical: true,
    frequency: "每1-3个月复查一次",
    exercise: "术前进行适当的康复训练",
    level: "强烈推荐" as const,
  },
};

export function getSeverityByAngle(angle: number): "mild" | "moderate" | "severe" | "extreme" {
  if (angle < 25) return "mild";
  if (angle < 40) return "moderate";
  if (angle < 50) return "severe";
  return "extreme";
}

export function getSeverityLabel(angle: number): string {
  const severity = getSeverityByAngle(angle);
  const map: Record<string, string> = {
    mild: "轻度",
    moderate: "中度",
    severe: "重度",
    extreme: "极重度",
  };
  return map[severity];
}