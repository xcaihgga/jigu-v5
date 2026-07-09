import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Activity,
  ListChecks,
  Bone,
  Brain,
  Baby,
  Stethoscope,
  Clock,
  Info,
  Play,
} from "lucide-react";
import { assess } from "@/services";
import { cn } from "@/lib/utils";
import {
  EXTENDED_SCALES,
  SCALE_CATEGORIES,
  type ScaleCategory,
} from "@/data/scales-extended";
import { SCALES } from "@/data/seed";

const CATEGORY_META: Record<
  ScaleCategory,
  { name: string; en: string; desc: string; icon: typeof Activity }
> = {
  "功能评估": { name: "功能评估", en: "Functional Assessment", desc: "ADL、步行、肌力、疼痛评估与日常活动能力评定", icon: ListChecks },
  "关节评估": { name: "关节评估", en: "Joint Assessment", desc: "肩、肘、腕、髋、膝、踝各关节专项量表", icon: Bone },
  "神经评估": { name: "神经评估", en: "Neurological Assessment", desc: "卒中分期、平衡、认知与痉挛评估", icon: Brain },
  "儿童评估": { name: "儿童评估", en: "Pediatric Assessment", desc: "婴儿运动、脑瘫分级与发育随访", icon: Baby },
  "特殊评估": { name: "特殊评估", en: "Special Assessment", desc: "心肺功能、吞咽、构音、焦虑抑郁与意识评估", icon: Stethoscope },
};

export default function AssessCenter() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<ScaleCategory | null>(null);
  const [q, setQ] = useState("");

  const interactiveIds = useMemo(() => new Set(SCALES.map((s) => s.id)), []);

  const scales = useMemo(() => {
    let list = EXTENDED_SCALES;
    if (cat) list = list.filter((s) => s.category === cat);
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.includes(kw) ||
          s.enName.toLowerCase().includes(kw) ||
          s.purpose.includes(kw)
      );
    }
    return list;
  }, [cat, q]);

  if (!cat) {
    return (
      <div className="space-y-6 stagger">
        <header>
          <p className="label-text">Assessment Center</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">
            评估量表库
          </h1>
          <p className="text-sm text-ink-mute mt-1 max-w-xl">
            覆盖功能、关节、神经、儿童、特殊五大类，共 {EXTENDED_SCALES.length} 个常用量表，支持互动式评估与快速查阅。
          </p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCALE_CATEGORIES.map((c, i) => {
            const meta = CATEGORY_META[c.id];
            const Icon = meta.icon;
            const count = EXTENDED_SCALES.filter((s) => s.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className="card p-6 text-left hover:shadow-lift hover:-translate-y-1 transition-all group relative overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute -right-8 -bottom-8 opacity-[0.06]">
                  <Icon className="h-32 w-32" strokeWidth={1} />
                </div>
                <div className="relative flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded bg-teal-500 text-cream-50">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="chip">{count} 项量表</span>
                </div>
                <h3 className="relative font-display text-xl text-ink mt-5">
                  {meta.name}
                </h3>
                <p className="relative text-2xs uppercase tracking-[0.18em] text-ink-mute mt-0.5">
                  {meta.en}
                </p>
                <p className="relative text-sm text-ink-mute mt-3 max-w-xs">
                  {meta.desc}
                </p>
                <div className="relative mt-5 inline-flex items-center gap-1 text-sm text-teal-500 font-medium">
                  进入量表库{" "}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={() => setCat(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded text-sm font-medium hover:bg-teal-600 transition-colors mb-2 shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 返回分类
          </button>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink flex items-center gap-2.5">
            {CATEGORY_META[cat].name}
            <span className="text-2xs uppercase tracking-[0.18em] text-ink-mute font-sans">
              {CATEGORY_META[cat].en}
            </span>
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <input
            className="input pl-8 w-56"
            placeholder="搜索量表"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </header>

      {/* 分类快速切换 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xs text-ink-mute mr-1">分类</span>
        {SCALE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn("chip", cat === c.id && "chip-active")}
          >
            {c.id}
          </button>
        ))}
      </div>

      {/* 量表网格 */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {scales.map((s) => {
          const canAssess = interactiveIds.has(s.id);
          return (
            <div
              key={s.id}
              className="card p-5 flex flex-col hover:shadow-lift transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-2xs uppercase tracking-[0.16em] text-teal-500">
                    {s.enName}
                  </p>
                  <h3 className="font-display text-lg text-ink mt-1 leading-tight">
                    {s.name}
                  </h3>
                </div>
                {canAssess ? (
                  <span className="chip text-2xs bg-teal-50 text-teal-600">
                    可评估
                  </span>
                ) : (
                  <span className="chip text-2xs bg-cream-100 text-ink-mute">
                    参考
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-mute leading-relaxed">
                {s.purpose}
              </p>
              <p className="text-2xs text-ink-faint mt-2">
                适用：{s.population}
              </p>
              <div className="flex items-center gap-4 mt-4 text-2xs text-ink-mute">
                <span className="inline-flex items-center gap-1">
                  <ListChecks className="h-3 w-3" /> {s.dimensions.length} 维度
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {s.scoring}
                </span>
              </div>
              {canAssess ? (
                <button
                  onClick={() => navigate(`/assess/${s.id}`)}
                  className="btn-primary mt-5 w-full"
                >
                  <Play className="h-4 w-4" /> 开始评估
                </button>
              ) : (
                <button
                  onClick={() =>
                    toast.info(
                      `「${s.name}」暂未接入互动评估，可在临床中按标准流程纸质量化。`
                    )
                  }
                  className="btn-ghost mt-5 w-full"
                >
                  <Info className="h-4 w-4" /> 查看详情
                </button>
              )}
            </div>
          );
        })}
      </div>
      {scales.length === 0 && (
        <div className="card py-16 text-center text-sm text-ink-faint">
          未找到匹配的量表
        </div>
      )}
    </div>
  );
}

const toast = {
  info: (msg: string) => {
    alert(msg);
  },
};
