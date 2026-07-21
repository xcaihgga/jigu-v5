import { useMemo, useState } from "react";
import {
  Stethoscope, Search, ChevronRight, AlertCircle, Target, BookOpen,
  Shield, Activity, MapPin, X, Layers, Sparkles
} from "lucide-react";
import { PAIN_CONDITIONS, PAIN_CATEGORIES, searchPain, type PainCondition } from "@/data/pain-treatments";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui";

const EVIDENCE_COLORS: Record<string, string> = {
  A: "bg-teal-100 text-teal-700 border-teal-300",
  B: "bg-amber-50 text-amber-700 border-amber-300",
  C: "bg-cream-200 text-ink-soft border-line",
};

const EVIDENCE_LABELS: Record<string, string> = {
  A: "A 级证据",
  B: "B 级证据",
  C: "C 级证据",
};

export default function PainConditionsPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<PainCondition | null>(null);

  const list = useMemo(() => {
    let arr = keyword ? searchPain(keyword) : PAIN_CONDITIONS;
    if (category !== "all") arr = arr.filter((c) => c.category === category);
    return arr;
  }, [keyword, category]);

  const grouped = useMemo(() => {
    const m: Record<string, PainCondition[]> = {};
    list.forEach((c) => {
      if (!m[c.category]) m[c.category] = [];
      m[c.category].push(c);
    });
    return m;
  }, [list]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-coral-100 to-transparent rounded-bl-full opacity-60" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-coral-100 text-coral flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-ink-main">疼痛与骨科康复治疗方案</h1>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
            完整数据集，覆盖足踝、膝、髋、腰、肩、肘、颈 7 大区域及骨科术后康复，
            每种疼痛包含 <span className="text-coral font-semibold">病因 / 临床表现 / 评估 / 治疗 / 预防</span> 五大维度，
            深度融入临床路径、康复方案与进修中心题库。
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-teal-50 text-teal-700 border border-teal-200">
              共 {list.length} 种
            </span>
            <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
              {Object.keys(grouped).length} 个区域
            </span>
            <span className="px-2 py-1 rounded bg-coral-50 text-coral border border-coral-200">
              49+ 道相关题目
            </span>
            <span className="px-2 py-1 rounded bg-cream-200 text-ink-soft border border-line">
              数据源：疼痛治疗方案.xlsx
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索疾病名、症状、治疗方案…"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-line bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                category === "all"
                  ? "bg-ink-main text-cream-100 border-ink-main"
                  : "bg-cream-100 text-ink-soft border-line hover:border-coral"
              )}
            >
              全部 ({PAIN_CONDITIONS.length})
            </button>
            {PAIN_CATEGORIES.map((c) => {
              const count = PAIN_CONDITIONS.filter((p) => p.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                    category === c.id
                      ? "bg-coral text-white border-coral"
                      : "bg-cream-100 text-ink-soft border-line hover:border-coral"
                  )}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-coral" />
            <h2 className="text-lg font-semibold text-ink-main">
              {PAIN_CATEGORIES.find((c) => c.id === cat)?.name ?? cat}
            </h2>
            <span className="text-xs text-ink-mute">（{items.length} 种）</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelected(c)}
                className="text-left p-4 rounded-xl border border-line bg-cream-100 hover:bg-cream-200 hover:border-coral transition group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-500" />
                    <span className="text-xs text-ink-mute">{c.region}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded border", EVIDENCE_COLORS[c.evidenceLevel])}>
                    {EVIDENCE_LABELS[c.evidenceLevel]}
                  </span>
                </div>
                <h3 className="font-semibold text-ink-main mb-2 group-hover:text-coral transition">{c.name}</h3>
                {c.symptoms && c.symptoms.length > 0 && (
                  <p className="text-xs text-ink-soft line-clamp-2 mb-2">
                    {c.symptoms[0]}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
                  <span className="text-xs text-ink-mute">{c.treatment.length} 项治疗</span>
                  <ChevronRight className="h-4 w-4 text-ink-mute group-hover:text-coral group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="card text-center py-12 text-ink-mute">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>未找到匹配的疼痛方案</p>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-ink-main/40 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div
            className="bg-cream-100 rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-gradient-to-r from-coral-50 to-cream-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded border bg-teal-50 text-teal-700 border-teal-200">
                    {selected.region}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded border", EVIDENCE_COLORS[selected.evidenceLevel])}>
                    {EVIDENCE_LABELS[selected.evidenceLevel]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-ink-main">{selected.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-cream-200 text-ink-soft"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Causes */}
              {selected.causes && selected.causes.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-coral" />
                    <h3 className="font-semibold text-ink-main">病因 / 危险因素</h3>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {selected.causes.map((s, i) => (
                      <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Stages */}
              {selected.stages && selected.stages.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-coral" />
                    <h3 className="font-semibold text-ink-main">病理分期</h3>
                  </div>
                  <ol className="space-y-2 pl-2">
                    {selected.stages.map((s, i) => (
                      <li key={i} className="text-sm text-ink-soft p-3 bg-cream-200 rounded-lg border border-line">
                        <span className="font-medium text-coral">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Symptoms */}
              {selected.symptoms && selected.symptoms.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-coral" />
                    <h3 className="font-semibold text-ink-main">临床表现</h3>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {selected.symptoms.map((s, i) => (
                      <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Assessment */}
              {selected.assessment && selected.assessment.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-coral" />
                    <h3 className="font-semibold text-ink-main">评估方法</h3>
                  </div>
                  <ul className="space-y-1.5 pl-6">
                    {selected.assessment.map((s, i) => (
                      <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Treatment */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-coral" />
                  <h3 className="font-semibold text-ink-main">治疗 / 改善方案</h3>
                </div>
                <ol className="space-y-1.5 pl-6">
                  {selected.treatment.map((s, i) => (
                    <li key={i} className="text-sm text-ink-soft list-decimal">{s}</li>
                  ))}
                </ol>
              </section>

              {/* Prevention */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-coral" />
                  <h3 className="font-semibold text-ink-main">预防</h3>
                </div>
                <p className="text-sm text-ink-soft pl-6">{selected.prevention}</p>
              </section>

              <div className="pt-3 border-t border-line text-xs text-ink-mute flex items-center justify-between">
                <span>来源：{selected.source}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
                    toast.success("已复制该疼痛方案到剪贴板");
                  }}
                  className="text-coral hover:underline"
                >
                  复制 JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
