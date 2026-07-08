import { Bone, Brain, HeartPulse, Baby } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const map = {
    musculo: { Icon: Bone, color: "text-teal-500" },
    neuro: { Icon: Brain, color: "text-coral" },
    cardio: { Icon: HeartPulse, color: "text-amber-dark" },
    pediatric: { Icon: Baby, color: "text-teal-400" },
  } as const;
  const { Icon, color } = map[category];
  return <Icon className={cn("h-4 w-4", color, className)} strokeWidth={1.6} />;
}

export const CATEGORY_META: Record<Category, { name: string; en: string; desc: string; icon: typeof Bone }> = {
  musculo: { name: "肌骨康复", en: "Musculoskeletal", desc: "骨关节、软组织、术后与慢性疼痛", icon: Bone },
  neuro: { name: "神经康复", en: "Neurological", desc: "脑卒中、颅脑损伤、脊髓与周围神经", icon: Brain },
  cardio: { name: "心肺康复", en: "Cardiopulmonary", desc: "COPD、冠心病、术后心肺功能重建", icon: HeartPulse },
  pediatric: { name: "儿童康复", en: "Pediatric", desc: "发育迟缓、脑性瘫痪、运动障碍", icon: Baby },
};

export const LEVEL_META = {
  screening: { name: "筛查级", desc: "快速识别，3–5 分钟" },
  intermediate: { name: "进阶级", desc: "量化分级，8–15 分钟" },
  specialty: { name: "专科级", desc: "精细评估，含多维报告" },
} as const;
