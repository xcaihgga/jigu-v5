import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ListChecks, Stethoscope, ArrowRight, Search } from "lucide-react";
import { assess, patient } from "@/services";
import type { Category, Level, Scale } from "@/lib/types";
import { CATEGORIES } from "@/data/seed";
import { CATEGORY_META, LEVEL_META } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

const LEVELS: { id: Level | "all"; name: string }[] = [
  { id: "all", name: "全部" },
  { id: "screening", name: "筛查级" },
  { id: "intermediate", name: "进阶级" },
  { id: "specialty", name: "专科级" },
];

const levelChipColor: Record<Level, string> = {
  screening: "bg-teal-50 text-teal-600",
  intermediate: "bg-amber-soft/40 text-amber-dark",
  specialty: "bg-coral-soft/40 text-coral-dark",
};

export default function AssessCenter() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<Category | null>(null);
  const [level, setLevel] = useState<Level | "all">("all");
  const [q, setQ] = useState("");

  const scales = useMemo(() => {
    let list = assess.listScales(cat ?? undefined);
    if (level !== "all") list = list.filter((s) => s.level === level);
    if (q.trim()) list = list.filter((s) => s.title.includes(q) || s.abbr.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [cat, level, q]);

  if (!cat) {
    return (
      <div className="space-y-6 stagger">
        <header>
          <p className="label-text">Assessment Center</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">分级评估中心</h1>
          <p className="text-sm text-ink-mute mt-1 max-w-xl">覆盖肌骨、神经、心肺、儿童四大亚专科，按筛查—进阶—专科三级组织，互动式作答并自动计分。</p>
        </header>
        <div className="grid sm:grid-cols-2 gap-4">
          {CATEGORIES.map((c, i) => {
            const meta = CATEGORY_META[c.id];
            const Icon = meta.icon;
            const count = assess.listScales(c.id).length;
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
                <h3 className="relative font-display text-xl text-ink mt-5">{meta.name}</h3>
                <p className="relative text-2xs uppercase tracking-[0.18em] text-ink-mute mt-0.5">{meta.en}</p>
                <p className="relative text-sm text-ink-mute mt-3 max-w-xs">{meta.desc}</p>
                <div className="relative mt-5 inline-flex items-center gap-1 text-sm text-teal-500 font-medium">
                  进入量表库 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          <button onClick={() => setCat(null)} className="inline-flex items-center gap-1 text-2xs text-ink-mute hover:text-teal-500 mb-2">
            <ArrowLeft className="h-3 w-3" /> 返回亚专科
          </button>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink flex items-center gap-2.5">
            {CATEGORY_META[cat].name}
            <span className="text-2xs uppercase tracking-[0.18em] text-ink-mute font-sans">{CATEGORY_META[cat].en}</span>
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <input className="input pl-8 w-56" placeholder="搜索量表" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </header>

      {/* 分级筛选 */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xs text-ink-mute mr-1">分级</span>
        {LEVELS.map((l) => (
          <button key={l.id} onClick={() => setLevel(l.id)} className={cn("chip", level === l.id && "chip-active")}>
            {l.name}
          </button>
        ))}
      </div>

      {/* 量表网格 */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {scales.map((s) => (
          <ScaleCard key={s.id} scale={s} onStart={() => navigate(`/assess/${s.id}`)} />
        ))}
      </div>
      {scales.length === 0 && (
        <div className="card py-16 text-center text-sm text-ink-faint">未找到匹配的量表</div>
      )}
    </div>
  );
}

function ScaleCard({ scale, onStart }: { scale: Scale; onStart: () => void }) {
  return (
    <div className="card p-5 flex flex-col hover:shadow-lift transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-teal-500">{scale.abbr}</p>
          <h3 className="font-display text-lg text-ink mt-1 leading-tight">{scale.title}</h3>
        </div>
        <span className={cn("chip text-2xs", levelChipColor[scale.level])}>{LEVEL_META[scale.level].name}</span>
      </div>
      <p className="text-sm text-ink-mute leading-relaxed">{scale.subtitle}</p>
      <p className="text-2xs text-ink-faint mt-2">适用：{scale.scenario}</p>

      <div className="flex items-center gap-4 mt-4 text-2xs text-ink-mute">
        <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> {scale.questions.length} 条目</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 约 {scale.estMinutes} 分钟</span>
        <span className="inline-flex items-center gap-1">· {scale.dimensions.length} 维度</span>
      </div>

      <button onClick={onStart} className="btn-primary mt-5 w-full">
        <Stethoscope className="h-4 w-4" /> 开始评估
      </button>
    </div>
  );
}
